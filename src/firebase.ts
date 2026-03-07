import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: 'AIzaSyB1vweb5mfT5LpOgKntOV4r7EPeFTfL5-c',
    authDomain: 'boost--mark.firebaseapp.com',
    projectId: 'boost--mark',
    storageBucket: 'boost--mark.firebasestorage.app',
    messagingSenderId: '701522474256',
    appId: '1:701522474256:web:f5ed3730b08ae158322195',
    measurementId: 'G-QCJS0C9J5L',
};

export const app = initializeApp(firebaseConfig);

// Analytics só funciona em contexto de browser com cookies — inicializa condicionalmente
isSupported().then((supported) => {
    if (supported) getAnalytics(app);
});
