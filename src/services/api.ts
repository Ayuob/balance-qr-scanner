import axios from 'axios';
import { Storage } from '@ionic/storage';

const API_URL = 'https://api.example.com/submit'; // Replace with your API endpoint
const storage = new Storage();
storage.create();

interface SubmissionData {
  qrData: string;
  phoneNumber: string;
}

export const submitData = async (data: SubmissionData) => {
  try {
    const response = await axios.post(API_URL, data, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    if (!navigator.onLine) {
      await saveOffline(data);
      throw new Error('No internet connection. Data saved offline.');
    }
    throw error;
  }
};

const saveOffline = async (data: SubmissionData) => {
  const offlineData = await storage.get('offlineData') || [];
  offlineData.push({ ...data, timestamp: Date.now() });
  await storage.set('offlineData', offlineData);
};

export const syncOfflineData = async () => {
  const offlineData = await storage.get('offlineData') || [];
  if (offlineData.length === 0) return;

  const failedSubmissions: SubmissionData[] = [];

  for (const data of offlineData) {
    try {
      await submitData(data);
    } catch (error) {
      failedSubmissions.push(data);
    }
  }

  await storage.set('offlineData', failedSubmissions);
  return failedSubmissions.length === 0;
};