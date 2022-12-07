import * as admin from "firebase-admin";
import { ISettingsProvider } from "@paperbits/common/configuration";
import { FirebaseCredentialProvider } from "./firebaseCredentialProvider";


export class FirebaseService {
    public databaseRootKey: string;
    public storageBasePath: string;
    private initializePromise: Promise<any>;

    constructor(
        private readonly settingsProvider: ISettingsProvider,
        private readonly firebaseCredentialProvider: FirebaseCredentialProvider) { }

    private async applyConfiguration(firebaseSettings: Object): Promise<any> {
        this.databaseRootKey = firebaseSettings["databaseRootKey"];
        this.storageBasePath = firebaseSettings["storageBasePath"];

        const credential = await this.firebaseCredentialProvider.getCredential();

        admin.initializeApp({
            credential,
            databaseURL: firebaseSettings["databaseURL"],
            storageBucket: firebaseSettings["storageBucket"]
        });
    }

    public async getDatabaseRef(): Promise<admin.database.Reference> {
        await this.getFirebaseRef();
        const databaseRef = await admin.database().ref(this.databaseRootKey);

        return databaseRef;
    }

    public async getStorageRef(): Promise<any> {
        await this.getFirebaseRef();

        const bucket = admin.storage().bucket();

        return bucket;
    }

    private async loadSettings(): Promise<void> {
        const firebaseSettings = await this.settingsProvider.getSetting<any>("firebase");
        this.databaseRootKey = this.databaseRootKey = firebaseSettings.rootKey || "/";

        await this.applyConfiguration(firebaseSettings);
    }

    private async getFirebaseRef(): Promise<void> {
        if (!this.initializePromise) {
            this.initializePromise = this.loadSettings();
        }

        return this.initializePromise;
    }
}