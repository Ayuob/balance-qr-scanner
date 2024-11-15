import { useState, useEffect } from 'react';
import { Storage } from '@ionic/storage';

const storage = new Storage();
storage.create();

interface Settings {
  saveOffline: boolean;
  autoSubmit: boolean;
  vibrateOnScan: boolean;
}

const defaultSettings: Settings = {
  saveOffline: true,
  autoSubmit: false,
  vibrateOnScan: true
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const savedSettings = await storage.get('settings');
    if (savedSettings) {
      setSettings(savedSettings);
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    await storage.set('settings', updatedSettings);
    setSettings(updatedSettings);
  };

  return { settings, updateSettings };
};