import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonToggle
} from '@ionic/react';
import { useSettings } from '../hooks/useSettings';

const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <IonLabel>Save Scanned Data Offline</IonLabel>
            <IonToggle
              checked={settings.saveOffline}
              onIonChange={e => updateSettings({ saveOffline: e.detail.checked })}
            />
          </IonItem>
          <IonItem>
            <IonLabel>Auto Submit</IonLabel>
            <IonToggle
              checked={settings.autoSubmit}
              onIonChange={e => updateSettings({ autoSubmit: e.detail.checked })}
            />
          </IonItem>
          <IonItem>
            <IonLabel>Vibrate on Scan</IonLabel>
            <IonToggle
              checked={settings.vibrateOnScan}
              onIonChange={e => updateSettings({ vibrateOnScan: e.detail.checked })}
            />
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
}

export default SettingsPage;