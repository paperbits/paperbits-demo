import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { FirebaseObjectStorage } from "./persistence/firebaseObjectStorage.admin";
import { FirebaseBlobStorage } from "./persistence/firebaseBlobStorage.admin";
import { FirebaseService } from "./services/firebaseService.admin";
import { ServiceAccountCredentialProvider } from "./services/serviceAccountCredentialProvider";


export class FirebaseModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindSingleton("firebaseService", FirebaseService);
        injector.bindSingleton("blobStorage", FirebaseBlobStorage);
        injector.bindSingleton("objectStorage", FirebaseObjectStorage);
        injector.bindSingleton("firebaseCredentialProvider", ServiceAccountCredentialProvider);
    }
}