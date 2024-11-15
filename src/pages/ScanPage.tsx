import React, { useState, useRef, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonToast,
  useIonAlert
} from '@ionic/react';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Network } from '@capacitor/network';
import jsQR from 'jsqr';
import { submitData } from '../services/api';
import { validatePhoneNumber } from '../utils/validators';
import './ScanPage.css';

const ScanPage: React.FC = () => {
  const [qrData, setQrData] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [presentAlert] = useIonAlert();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    checkNetworkStatus();
    const networkListener = Network.addListener('networkStatusChange', status => {
      setIsOnline(status.connected);
    });

    return () => {
      networkListener.remove();
    };
  }, []);

  const checkNetworkStatus = async () => {
    const status = await Network.getStatus();
    setIsOnline(status.connected);
  };

  const startScanning = async () => {
    try {
      const permission = await Camera.checkPermissions();
      if (permission.camera !== 'granted') {
        await Camera.requestPermissions();
      }

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl
      });

      if (image.dataUrl) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const img = new Image();
        img.src = image.dataUrl;
        
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          context?.drawImage(img, 0, 0);
          
          const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
          if (imageData) {
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            if (code) {
              setQrData(code.data);
            } else {
              showAlert('No QR code found', 'Please try scanning again.');
            }
          }
        };
      }
    } catch (error) {
      console.error('Camera error:', error);
      showAlert('Camera Error', 'Failed to access camera. Please check permissions.');
    }
  };

  const handleSubmit = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      showAlert('Invalid Input', 'Please enter a valid phone number.');
      return;
    }

    if (!qrData) {
      showAlert('Missing Data', 'Please scan a QR code first.');
      return;
    }

    if (!isOnline) {
      showAlert('Offline', 'Please check your internet connection.');
      return;
    }

    setLoading(true);
    try {
      await submitData({ qrData, phoneNumber });
      setToastMessage('Data submitted successfully!');
      setShowToast(true);
      setQrData('');
      setPhoneNumber('');
    } catch (error) {
      console.error('Submission error:', error);
      showAlert('Submission Error', 'Failed to submit data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (header: string, message: string) => {
    presentAlert({
      header,
      message,
      buttons: ['OK'],
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>QR Scanner</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="scanner-container">
          {qrData ? (
            <div className="qr-result">
              <p>QR Code Data: {qrData}</p>
            </div>
          ) : (
            <IonButton expand="block" onClick={startScanning}>
              Scan QR Code
            </IonButton>
          )}
        </div>

        <IonItem>
          <IonLabel position="stacked">Phone Number</IonLabel>
          <IonInput
            type="tel"
            value={phoneNumber}
            onIonChange={e => setPhoneNumber(e.detail.value!)}
            placeholder="Enter phone number"
          />
        </IonItem>

        <IonButton
          expand="block"
          className="submit-button"
          onClick={handleSubmit}
          disabled={!qrData || !phoneNumber || !isOnline}
        >
          Submit Data
        </IonButton>

        <IonLoading isOpen={loading} message="Submitting data..." />
        
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default ScanPage;