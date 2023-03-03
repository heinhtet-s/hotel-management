importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyDKQIHwerypNjkvJWjYF96O8jWZgOSri6c",
    authDomain: "flash-mall-ed921.firebaseapp.com",
    projectId: "flash-mall-ed921",
    storageBucket: "flash-mall-ed921.appspot.com",
    messagingSenderId: "833764220183",
    appId: "1:833764220183:web:509b8768f6c97733932b52",
    measurementId: "G-7SH7VFGLPM"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/img/icons/flash.png'
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions).then(r => {
            console.log(r)
    });
});

