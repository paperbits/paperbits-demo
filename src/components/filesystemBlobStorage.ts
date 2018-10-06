import * as fs from "fs";
import * as path from "path";
import * as mkdirp from "mkdirp";
import { ProgressPromise } from "@paperbits/common";
import { IBlobStorage } from "@paperbits/common/persistence";


export class FileSystemBlobStorage implements IBlobStorage {
    private basePath: string;

    constructor(basePath: string) {
        this.basePath = basePath;
    }

    public uploadBlob(blobPath: string, content: Uint8Array): ProgressPromise<void> {
        return new ProgressPromise<void>((resolve, reject) => {
            const partPath = blobPath.replace("//", "/");
            const fullpath = `${this.basePath}/${partPath}`;

            mkdirp(path.dirname(fullpath), (error) => {
                if (error) {
                    console.error(error);
                    reject(error);
                }
                else {
                    fs.writeFile(fullpath, new Buffer(content), error => {
                        if (error) {
                            reject(error);
                        }
                        resolve();
                    });
                }
            });
        });
    }

    public downloadBlob(blobPath: string): Promise<Uint8Array> {
        return new Promise<Uint8Array>((resolve, reject) => {
            const fullpath = `${this.basePath}/${blobPath}`;

            fs.readFile(fullpath, (error, buffer: Buffer) => {
                if (error) {
                    reject(error);
                    return;
                }

                const arrayBuffer = new ArrayBuffer(buffer.length);
                const unit8Array = new Uint8Array(arrayBuffer);

                for (let i = 0; i < buffer.length; ++i) {
                    unit8Array[i] = buffer[i];
                }

                resolve(unit8Array);
            });
        });
    }

    public async listBlobs(): Promise<string[]> {
        function getFilesFromDir(dir, fileTypes?) {
            const filesToReturn = [];

            function walkDir(currentPath) {
                const files = fs.readdirSync(currentPath);

                for (const file of files) {
                    const curFile = path.join(currentPath, file);

                    if (fs.statSync(curFile).isFile()) {
                        const filepath = curFile.replace(dir, "").replace(/\\/g, "\/");
                        filesToReturn.push(filepath);
                    }
                    else if (fs.statSync(curFile).isDirectory()) {
                        walkDir(curFile);
                    }
                }
            }

            walkDir(dir);

            return filesToReturn;
        }

        return getFilesFromDir(this.basePath);
    }

    public getDownloadUrl(filename: string): Promise<string> {
        throw new Error("Not supported");
    }

    public async deleteBlob(filename: string): Promise<void> {
        return null;
    }
}