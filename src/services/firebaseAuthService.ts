export interface FirebaseAuthService {
    authenticate(firebaseApp: firebase.app.App): Promise<void>;
}