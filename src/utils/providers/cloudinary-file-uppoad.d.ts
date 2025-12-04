import { FileUploadProvider, UploadedFileDto } from '../interfaces/file-upload.interface';
import { ConfigService } from '@nestjs/config';
export declare class CooudinaryFileUploadProvider implements FileUploadProvider {
    private configService;
    private readonly logger;
    constructor(configService: ConfigService);
    static uniqueFilename(): string;
    upload(file: Express.Multer.File): Promise<UploadedFileDto>;
    restoreBuffer(file: any): Express.Multer.File;
    cloudinaryUpload(file: Express.Multer.File): Promise<any>;
    remove(url: string): Promise<any>;
    extractPublicId(url: string): string;
}
