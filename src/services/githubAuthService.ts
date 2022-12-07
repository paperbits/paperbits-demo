import * as firebase from "firebase/app";
import { ISettingsProvider } from "@paperbits/common/configuration";
import { FirebaseAuthService } from "./firebaseAuthService";
import { FirebaseSettings } from "./firebaseSettings";


export class GithubAuthService implements FirebaseAuthService {
    constructor(private readonly settingsProvider: ISettingsProvider) { }

    public async authenticate(firebaseApp: firebase.app.App): Promise<void> {
        console.info("Firebase: Signing-in with Github...");

        const firebaseSettings = await this.settingsProvider.getSetting<FirebaseSettings>("firebase");
        const auth = firebaseSettings.auth;
        const provider = new firebase.auth.GithubAuthProvider();

        if (auth.github.scopes) {
            auth.github.scopes.forEach(scope => {
                provider.addScope(scope);
            });
        }

        const redirectResult = await firebase.auth().getRedirectResult();

        if (!redirectResult.credential) {
            await firebaseApp.auth().signInWithRedirect(provider);
            return;
        }

        return;
    }
}