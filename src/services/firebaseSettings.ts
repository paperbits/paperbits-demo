import { FirebaseAuth } from "./firebaseAuth";

export interface FirebaseSettings {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    databaseRootKey: string;
    storageBasePath: string;
    auth: FirebaseAuth;
}
