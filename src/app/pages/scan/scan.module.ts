import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ScanPageRoutingModule } from './scan-routing.module';
import { ScanPage } from './scan.page';
import { QrScannerComponent } from '../../components/qr-scanner/qr-scanner.component';
import { PhoneFormComponent } from '../../components/phone-form/phone-form.component';
import { OfflineBannerComponent } from '../../components/offline-banner/offline-banner.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ScanPageRoutingModule
  ],
  declarations: [
    ScanPage,
    QrScannerComponent,
    PhoneFormComponent,
    OfflineBannerComponent
  ]
})
export class ScanPageModule {}