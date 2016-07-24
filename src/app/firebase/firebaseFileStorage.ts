module Vienna.Firebase {
    export class FirebaseFileStorage implements Vienna.Persistence.IFileStorage {
        firebaseManager: FirebaseManager;

        constructor(firebaseManager: FirebaseManager) {
            this.firebaseManager = firebaseManager;
        }

        public uploadFile(file: File): ProgressPromise<void> {
            return new ProgressPromise<void>((resolve, reject, progress) => {
                this.firebaseManager.getStorageRef().then((storageRef) => {
                    var uploadTask = storageRef
                        .child(file.name)
                        .put(file);

                    uploadTask.on("state_changed",
                        (snapshot: FirebaseUploadSnapshot) => {
                            progress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                        },
                        (error: FirebaseUploadError) => {
                            console.log(error);
                            reject()
                        },
                        resolve);

                });
            });
        }

        public getDownloadUrl(filename: string): Promise<string> {
            return this.firebaseManager.getStorageRef().then((storageRef) => {
                return storageRef.child(filename).getDownloadURL();
            });
        }

        public deleteFile(filename: string): Promise<void> {
            return new Promise<void>((resolve, reject) => {
                this.firebaseManager.getStorageRef().then((storageRef) => {
                    storageRef
                        .child(filename)
                        .delete().then(() => {
                            resolve();
                        });
                });
            });
        }
    }
}
