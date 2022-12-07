import { FirebaseCredentialProvider } from "./firebaseCredentialProvider";
import * as admin from "firebase-admin";
import { ISettingsProvider } from "@paperbits/common/configuration";
import { FirebaseSettings } from "./firebaseSettings";


export class ServiceAccountCredentialProvider implements FirebaseCredentialProvider {
    constructor(private readonly settingsProvider: ISettingsProvider) { }

    public async getCredential(): Promise<admin.credential.Credential> {
        const firebaseSettings = await this.settingsProvider.getSetting<FirebaseSettings>("firebase");
        const auth = firebaseSettings.auth;

        return admin.credential.cert(auth.serviceAccount);
    }
}