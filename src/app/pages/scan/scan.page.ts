import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { Network } from '@capacitor/network';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { StorageService } from '../../services/storage.service';
import { PhoneFormComponent } from '../../components/phone-form/phone-form.component';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss']
})
export class ScanPage implements OnInit, OnDestroy {
  @ViewChild(PhoneFormComponent) phoneForm!: PhoneFormComponent;

  qrData: string = '';
  isOnline: boolean = true;
  private networkSubscription?: Subscription;

  constructor(
    private apiService: ApiService,
    private storageService: StorageService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    await this.checkNetworkStatus();
    this.networkSubscription = Network.addListener('networkStatusChange', status => {
      this.isOnline = status.connected;
      if (status.connected) {
        this.syncOfflineData();
      }
    });
  }

  ngOnDestroy() {
    this.networkSubscription?.remove();
  }

  async checkNetworkStatus() {
    const status = await Network.getStatus();
    this.isOnline = status.connected;
  }

  onQrScanned(data: string) {
    this.qrData = data;
  }

  async onPhoneSubmit(phoneNumber: string) {
    const loading = await this.loadingCtrl.create({
      message: 'Submitting data...'
    });
    await loading.present();

    try {
      const data = { qrData: this.qrData, phoneNumber };

      if (!this.isOnline) {
        await this.storageService.saveOfflineData(data);
        this.showToast('Data saved offline');
        this.resetForm();
      } else {
        await this.apiService.submitData(data);
        this.showToast('Data submitted successfully');
        this.resetForm();
      }
    } catch (error) {
      console.error('Submission error:', error);
      this.showAlert('Submission Error', 'Failed to submit data. Please try again.');
    } finally {
      await loading.dismiss();
    }
  }

  private async syncOfflineData() {
    const offlineData = await this.storageService.getOfflineData();
    if (offlineData.length > 0) {
      for (const data of offlineData) {
        try {
          await this.apiService.submitData(data);
          await this.storageService.removeOfflineData(data);
        } catch (error) {
          console.error('Sync error:', error);
        }
      }
    }
  }

  private resetForm() {
    this.qrData = '';
    this.phoneForm.reset();
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}