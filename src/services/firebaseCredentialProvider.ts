import * as admin from "firebase-admin";

export interface FirebaseCredentialProvider {
    getCredential(): Promise<admin.credential.Credential>;
}