import * as firebase from "firebase/app";
import { ISettingsProvider } from "@paperbits/common/configuration";
import { FirebaseAuthService } from "./firebaseAuthService";
import { FirebaseSettings } from "./firebaseSettings";


export class BasicAuthService implements FirebaseAuthService {
    constructor(private readonly settingsProvider: ISettingsProvider) { }

    public async authenticate(firebaseApp: firebase.app.App): Promise<void> {
        console.info("Firebase: Signing-in with email and password...");

        const firebaseSettings = await this.settingsProvider.getSetting<FirebaseSettings>("firebase");
        const auth = firebaseSettings.auth;
    
        await firebaseApp.auth().signInWithEmailAndPassword(auth.basic.email, auth.basic.password);
        return;
    }
}