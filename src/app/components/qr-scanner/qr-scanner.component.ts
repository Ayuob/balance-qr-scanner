import { Component, Output, EventEmitter } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Camera } from '@capacitor/camera';
import jsQR from 'jsqr';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.scss']
})
export class QrScannerComponent {
  @Output() scannedData = new EventEmitter<string>();
  
  constructor(private alertCtrl: AlertController) {}

  async startScanning() {
    try {
      const permission = await Camera.checkPermissions();
      if (permission.camera !== 'granted') {
        await Camera.requestPermissions();
      }

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: 'dataUrl'
      });

      if (image.dataUrl) {
        const qrCode = await this.processQRCode(image.dataUrl);
        if (qrCode) {
          this.scannedData.emit(qrCode);
        } else {
          this.showAlert('No QR Code Found', 'Please try scanning again.');
        }
      }
    } catch (error) {
      console.error('Camera error:', error);
      this.showAlert('Camera Error', 'Failed to access camera. Please check permissions.');
    }
  }

  private async processQRCode(dataUrl: string): Promise<string | null> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        context?.drawImage(img, 0, 0);
        
        const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
        if (imageData) {
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          resolve(code?.data || null);
        } else {
          resolve(null);
        }
      };
      img.src = dataUrl;
    });
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