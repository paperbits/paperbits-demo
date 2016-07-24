module Vienna.Firebase {
    import IConfigProvider = Vienna.Configuration.IConfigProvider;

    export class FirebaseManager {
        private configProvider: IConfigProvider;
        private eventManager: IEventManager;
        private tenantRootKey: string;
        private firebaseRef: any;
        private preparingPromise: Promise<any>;

        constructor(configProvider: IConfigProvider, eventManager: IEventManager) {
            this.configProvider = configProvider;
            this.eventManager = eventManager;

            // rebinding...
            this.onConfiurationLoaded = this.onConfiurationLoaded.bind(this);
        }

        private onConfiurationLoaded(config: any): Promise<any> {
            this.tenantRootKey = "tenants/" + config.tenantId;

            firebase.initializeApp(config.firebase); // This can be called only once

            var connectedRef = firebase.database().ref(".info/connected");

            connectedRef.on("value", (snapshot) => {
                if (snapshot.val() === true) {
                    this.eventManager.dispatchEvent("onOnlineStatusChanged", "online");
                }
                else {
                    this.eventManager.dispatchEvent("onOnlineStatusChanged", "offline");
                }
            });

            this.firebaseRef = firebase;

            return Promise.resolve();
        }

        public authenticate(): Promise<any> {
            return firebase.auth().signInAnonymously().then((result) => {
                console.log("Firebase: Authenticated anonymously.");
            });

            // TODO: Uncomment for Google Auth

            // firebase.auth().getRedirectResult().then((result) => {
            //     if (!result.credential) {
            //         console.log(result);
            //         var provider = new firebase.auth.GoogleAuthProvider();
            //         firebase.auth().signInWithRedirect(provider);
            //     }
            //     console.log("Firebase: Authenticated with Google.");
            // });
        }

        public getFirebaseRef(): Promise<any> {
            if (this.preparingPromise) {
                return this.preparingPromise
            }

            this.preparingPromise = new Promise((resolve, reject) => {
                this.configProvider.getSetting()
                    .then(this.onConfiurationLoaded)
                    .then(this.authenticate)
                    .then(() => {
                        resolve(firebase);
                    });
            });

            return this.preparingPromise;
        }

        public getDatabaseRef(): Promise<FirebaseDatabaseRef> {
            return new Promise<FirebaseDatabaseRef>((resolve, reject) => {
                this.getFirebaseRef().then((firebaseRef) => {
                    let databaseRef = firebaseRef.database().ref(this.tenantRootKey);
                    resolve(databaseRef);
                });
            });
        }

        public getStorageRef(): Promise<FirebaseStorageRef> {
            return new Promise<FirebaseStorageRef>((resolve, reject) => {
                this.getFirebaseRef().then((firebaseRef) => {
                    let storageRef = firebaseRef.storage().ref(this.tenantRootKey);
                    resolve(storageRef);
                });
            });
        }
    }
}