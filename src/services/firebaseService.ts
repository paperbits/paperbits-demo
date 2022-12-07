import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
import { ISettingsProvider } from "@paperbits/common/configuration";
import { Logger } from "@paperbits/common/logging";
import { FirebaseSettings } from "./firebaseSettings";
import { FirebaseAuthService } from "./firebaseAuthService";


export class FirebaseService {
    private databaseRootKey: string;
    private storageBasePath: string;
    private initializationPromise: Promise<any>;
    private authenticationPromise: Promise<any>;

    public firebaseApp: firebase.app.App;
    public authenticatedUser: firebase.User;

    constructor(
        private readonly settingsProvider: ISettingsProvider,
        private readonly firebaseAuthService: FirebaseAuthService,
        private readonly logger: Logger) {
    }

    private async trySignIn(): Promise<void> {
        await this.firebaseAuthService.authenticate(this.firebaseApp);
    }

    private async authenticate(): Promise<void> {
        if (this.authenticationPromise) {
            return this.authenticationPromise;
        }

        this.authenticationPromise = new Promise<void>((resolve) => {
            firebase.auth(this.firebaseApp).onAuthStateChanged(async (user: firebase.User) => {
                if (user) {
                    this.authenticatedUser = user;
                    const userId = user.displayName || user.email || (user.isAnonymous ? "Anonymous" : "Custom");

                    this.logger.trackEvent("Startup", { message: `Logged in as ${userId}.` });
                    await this.logger.trackSession({ userId: userId });

                    resolve();
                    return;
                }

                await this.trySignIn();
                resolve();
            });
        });

        return this.authenticationPromise;
    }

    private async applyConfiguration(): Promise<firebase.app.App> {
        const firebaseSettings = await this.settingsProvider.getSetting<FirebaseSettings>("firebase");
        this.databaseRootKey = firebaseSettings.databaseRootKey || "/";
        this.storageBasePath = firebaseSettings.storageBasePath;

        const appName = firebaseSettings.databaseRootKey;
        this.firebaseApp = firebase.initializeApp(firebaseSettings, appName); // This can be called only once

        await this.authenticate();

        return this.firebaseApp;
    }

    public async getFirebaseRef(): Promise<firebase.app.App> {
        if (this.initializationPromise) {
            return this.initializationPromise;
        }

        this.initializationPromise = this.applyConfiguration();

        return this.initializationPromise;
    }

    public async getDatabaseRef(): Promise<firebase.database.Reference> {
        const firebaseRef = await this.getFirebaseRef();
        const databaseRef = await firebaseRef.database().ref(this.databaseRootKey);

        return databaseRef;
    }

    public async getStorageRef(): Promise<firebase.storage.Reference> {
        const firebaseRef = await this.getFirebaseRef();
        const storageRef = firebaseRef.storage().ref(this.storageBasePath);

        return storageRef;
    }
}