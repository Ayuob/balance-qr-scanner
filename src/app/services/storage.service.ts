import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { SubmissionData } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {}

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async saveOfflineData(data: SubmissionData) {
    const offlineData = await this.getOfflineData();
    offlineData.push({ ...data, timestamp: Date.now() });
    await this._storage?.set('offlineData', offlineData);
  }

  async getOfflineData(): Promise<SubmissionData[]> {
    const data = await this._storage?.get('offlineData');
    return data || [];
  }

  async removeOfflineData(data: SubmissionData) {
    const offlineData = await this.getOfflineData();
    const updatedData = offlineData.filter(item => 
      item.qrData !== data.qrData || item.phoneNumber !== data.phoneNumber
    );
    await this._storage?.set('offlineData', updatedData);
  }

  async clearOfflineData() {
    await this._storage?.remove('offlineData');
  }
}