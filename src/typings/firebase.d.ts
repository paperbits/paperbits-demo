interface Firebase {
    database();
    storage();
    initializeApp(options);
    auth(): any;
}

interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    storageBucket: string;
}

interface FirebaseDatabaseRef {
    child(...args): any;
    update(...args): any;
}

interface FirebaseStorageRef {
    child(...args): any;
}

interface FirebaseUploadSnapshot {
    state: string;
    bytesTransferred: number;
    totalBytes: number;
}

interface FirebaseUploadError {
    code: string;
}

interface TaskState {
    //firebase.storage.TaskState.PAUSED
    // RUNNING
    // Indicates that the task is still running and making progress.
    // PAUSED
    // Indicates that the task is paused.
    // SUCCESS
    // Indicates that the task completed successfully.
    // CANCELED
    // Indicates that the task was canceled.
    // ERROR
}

interface TaskEvent {
    //firebase.storage.TaskEvent.STATE_CHANGED
}

declare var firebase: any;