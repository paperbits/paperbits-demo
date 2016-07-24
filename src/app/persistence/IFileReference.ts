﻿module Vienna.Persistence {
    export interface IFileReference {
        path: string;
        metadata: Vienna.IBag<any>;
    }
}