import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-offline-banner',
  template: `
    <ion-text color="medium" *ngIf="!isOnline" class="ion-text-center ion-padding">
      <p>
        <ion-icon name="cloud-offline-outline"></ion-icon>
        You're offline. Data will be saved locally and synced when online.
      </p>
    </ion-text>
  `
})
export class OfflineBannerComponent {
  @Input() isOnline: boolean = true;
}