# Admin Dashboard

An admin dashboard based on electron and react

## Api Connections

In root folder create an envs.js file

add the apis in the following manner

```js
export const firebaseConfig = {
  apiKey: "",
  authDomain: "employeeapp-f3d3f.firebaseapp.com",
  projectId: "employeeapp-f3d3f",
  storageBucket: "employeeapp-f3d3f.firebasestorage.app",
  messagingSenderId: "",
  appId: "1:288311010212:web:512f5a59edaaa3fbcf5731",
  measurementId: "G-VK2F3QW794"
};

export const serviceAccount = {
  "type": "service_account",
  "project_id": "employeeapp-f3d3f",
  "private_key_id": "",
  "private_key": "-----BEGIN PRIVATE KEY-----\n\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-igzqt@employeeapp-f3d3f.iam.gserviceaccount.com",
  "client_id": "",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-igzqt%40employeeapp-f3d3f.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};
```

## Commands

To view the electron app

```bash
npm run electron
```

To create an distributable

```bash
npm run dist:<name_of_os>
```

