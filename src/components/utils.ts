import * as fs from "fs";

export async function loadFileAsString(filepath: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        fs.readFile(filepath, "utf8", (error, content) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(content);
        });
    });
}