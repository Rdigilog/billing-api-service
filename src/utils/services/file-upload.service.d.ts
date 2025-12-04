import * as fileUploadInterface from '../interfaces/file-upload.interface';
export declare class FileUploadService {
    private fileUploadProvider;
    constructor(fileUploadProvider: fileUploadInterface.FileUploadProvider);
    uploadPicture(file: Express.Multer.File): Promise<fileUploadInterface.UploadedFileDto>;
}
