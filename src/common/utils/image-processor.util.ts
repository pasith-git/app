import * as path from 'path';
import { v4 as uuid } from 'uuid';
import * as fs from "fs-extra";

const IMAGE_PATH = 'assets/images/';

export const createfileGenerator = (file: Express.Multer.File, filePrefixPath: string, fileNamePath: string) => {
    if (file) {
        const folderNameUUID = uuid();
        const filePath = path.join(filePrefixPath, `${fileNamePath}_${folderNameUUID}`, `${uuid()}${path.extname(file.originalname)}`);
        return {
            filePath,
            generate: async () => {
                if (!fs.pathExistsSync(path.join(IMAGE_PATH, filePrefixPath))) {
                    await fs.mkdir(path.join(IMAGE_PATH, filePrefixPath));
                    if (!fs.pathExistsSync(path.join(IMAGE_PATH, filePrefixPath, `${fileNamePath}_${folderNameUUID}`))) {
                        await fs.mkdir(path.join(IMAGE_PATH, filePrefixPath, `${fileNamePath}_${folderNameUUID}`));
                    }
                }
                await fs.outputFile(path.join(IMAGE_PATH, filePath), file.buffer);
            }
        }
    }
}

export const updatefileGenerator = (file: Express.Multer.File, filePrefixPath: string, oldFileNamePath: string, fileNamePath: string, dbFilePath: string, isDelete: boolean) => {
    let filePath;
    let generate = async () => { };

    if (isDelete && dbFilePath) {
        filePath = null;
        generate = async () => {
            await fs.remove(path.dirname(path.join(IMAGE_PATH, dbFilePath)));
        }
    }

    if (fileNamePath && dbFilePath && !isDelete && fileNamePath !== oldFileNamePath) {
        const folderNameUUID = uuid();
        filePath = path.join(filePrefixPath, `${fileNamePath}_${folderNameUUID}`, path.basename(dbFilePath));
        generate = async () => {
            await fs.rename(path.join(IMAGE_PATH, path.dirname(dbFilePath)), path.join(IMAGE_PATH, filePrefixPath, `${fileNamePath}_${folderNameUUID}`));
        }
    }

    if (file) {
        const folderNameUUID = uuid();
        filePath = path.join(filePrefixPath, `${fileNamePath}_${folderNameUUID}`, `${uuid()}${path.extname(file.originalname)}`);
        generate = async () => {
            if (dbFilePath) {
                await fs.remove(path.dirname(path.join(IMAGE_PATH, dbFilePath)));
            }
            await fs.outputFile(path.join(IMAGE_PATH, filePath), file.buffer);
        }
    }

    return {
        filePath,
        generate,
    }

}

export const deleteFileGenerator = (dbFilePath: string) => {
    if (dbFilePath) {
        return {
            generate: async () => {
                await fs.remove(path.dirname(path.join(IMAGE_PATH, dbFilePath)));
            }
        }
    }
}