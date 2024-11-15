import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private storageService: StorageService
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();
    await this.storageService.init();
  }
}