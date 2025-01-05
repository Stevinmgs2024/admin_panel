# Admin Dashboard

An admin dashboard based on electron and react

## Api Connections

In root folder create an envs.js file

Add your apis in the following manner

```js
export const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

export const serviceAccount = {
  "type": "",
  "project_id": "",
  "private_key_id": "",
  "private_key": "",
  "client_email": "",
  "client_id": "",
  "auth_uri": "",
  "token_uri": "",
  "auth_provider_x509_cert_url": "",
  "client_x509_cert_url": "",
  "universe_domain": ""
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

