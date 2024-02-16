'use client'
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging'
import firebase from "firebase/compat/app"
import { getAuth } from "firebase/auth";
import toast from 'react-hot-toast';
import { getFcmToken } from '@/store/reducer/settingsSlice';
import { store } from '@/store/store';

const FirebaseData = () => {
  let firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
  }

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const app = initializeApp(firebaseConfig);
  const authentication = getAuth(app);
  const firebaseApp = !getApps().length
    ? initializeApp(firebaseConfig)
    : getApp();
 


  const createStickyNote = () => {
    const stickyNote = document.createElement('div');
    stickyNote.style.position = 'fixed';
    stickyNote.style.bottom = '0';
    stickyNote.style.width = '100%';
    stickyNote.style.backgroundColor = '#ffffff'; // White background
    stickyNote.style.color = '#000000'; // Black text
    stickyNote.style.padding = '10px';
    stickyNote.style.textAlign = 'center';
    stickyNote.style.fontSize = '14px';
    stickyNote.style.zIndex = '99999'; // Set zIndex to 99999

    const closeButton = document.createElement('span');
    closeButton.style.cursor = 'pointer';
    closeButton.style.float = 'right';
    closeButton.innerHTML = '&times;'; // Times symbol (X) for close

    closeButton.onclick = function () {
      document.body.removeChild(stickyNote);
    };

    const link = document.createElement('a');
    link.style.textDecoration = 'underline';
    link.style.color = '#3498db';
    link.innerText = 'Download Now';

    // Update link with the dynamic appstoreLink
    link.href = process.env.NEXT_PUBLIC_APP_ID;
    console.log("link", link)
    stickyNote.innerHTML = 'Chat and Notification features are not supported on this browser. For a better user experience, please use our mobile application. ';
    stickyNote.appendChild(closeButton);
    stickyNote.appendChild(link);

    document.body.appendChild(stickyNote);
  };

  const messagingInstance = async () => {
    try {
      const isSupportedBrowser = await isSupported();
      if (isSupportedBrowser) {
        return getMessaging(firebaseApp);
      } else {
        createStickyNote();
        return null;
      }
    } catch (err) {
      console.error('Error checking messaging support:', err);
      return null;
    }
  };
  const fetchToken = async (setTokenFound, setFcmToken) => {
    const messaging = await messagingInstance();
    if (!messaging) {
      console.error('Messaging not supported.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
        })
          .then((currentToken) => {
            if (currentToken) {
              setTokenFound(true);
              setFcmToken(currentToken);
              getFcmToken(currentToken);
            } else {
              setTokenFound(false);
              setFcmToken(null);
              toast.error('Permission is required to receive notifications.');
            }
          })
          .catch((err) => {
            console.error('Error retrieving token:', err);
          });
      } else {
        setTokenFound(false);
        setFcmToken(null);
        toast.error('Permission is required for notifications.');
      }
    } catch (err) {
      console.error('Error requesting notification permission:', err);
    }
  };

  const onMessageListener = async () => {
    const messaging = await messagingInstance();
    if (messaging) {
      return new Promise((resolve) => {
        onMessage(messaging, (payload) => {
          resolve(payload);
        });
      });
    } else {
      console.error('Messaging not supported.');
      return null;
    }
  };
  const signOut = () => {
    return authentication.signOut();
  };
  return { firebase, authentication, fetchToken, onMessageListener, signOut }
}

export default FirebaseData;
