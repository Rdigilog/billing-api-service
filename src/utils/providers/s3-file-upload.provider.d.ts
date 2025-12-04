import { ConfigService } from '@nestjs/config';
import { FileUploadProvider, UploadedFileDto } from '../interfaces/file-upload.interface';
export declare class S3FileUploadProvider implements FileUploadProvider {
    private configService;
    private s3;
    private readonly logger;
    constructor(configService: ConfigService);
    static uniqueFilename(): string;
    upload(file: Express.Multer.File): Promise<UploadedFileDto>;
    restoreBuffer(file: any): Express.Multer.File;
    remove(url: string): Promise<void>;
    private extractKeyFromUrl;
}
