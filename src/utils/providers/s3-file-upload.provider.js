"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3FileUploadProvider = void 0;
const common_1 = require("@nestjs/common");
const aws_sdk_1 = require("aws-sdk");
class S3FileUploadProvider {
    configService;
    s3;
    logger = new common_1.Logger(S3FileUploadProvider.name);
    constructor(configService) {
        this.configService = configService;
        aws_sdk_1.config.update({
            accessKeyId: configService.get('AWS_ACCESS_KEY'),
            secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
            region: configService.get('AWS_S3_REGION'),
        });
        this.s3 = new aws_sdk_1.S3({
            accessKeyId: configService.get('AWS_ACCESS_KEY'),
            secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
        });
        this.logger.debug('S3 Initialized');
    }
    static uniqueFilename() {
        const timestamp = Date.now().toString();
        const randomString = Math.random().toString(36).substring(2);
        return `${timestamp}-${randomString}`;
    }
    async upload(file) {
        try {
            file = this.restoreBuffer(file);
            const fileName = S3FileUploadProvider.uniqueFilename();
            const newFileName = `${this.configService.get('AWS_S3_UPLOAD_FOLDER')}/${fileName}`;
            const uploadResult = await this.s3
                .upload({
                Bucket: this.configService.get('AWS_S3_BUCKET') || 'DigiLog',
                Body: file.buffer,
                Key: `${newFileName}${file.fieldname}${file.fieldname}`,
                ContentType: file.mimetype,
            })
                .promise();
            const uploadedFile = {
                name: file.originalname,
                url: uploadResult.Location,
            };
            return uploadedFile;
        }
        catch (err) {
            this.logger.log(err);
            console.log(err.stack);
            throw new common_1.BadRequestException('Error uploading file to S3.');
        }
    }
    restoreBuffer(file) {
        if (file?.buffer?.type === 'Buffer' && Array.isArray(file.buffer.data)) {
            file.buffer = Buffer.from(file.buffer.data);
        }
        return file;
    }
    async remove(url) {
        const key = this.extractKeyFromUrl(url);
        await this.s3.deleteObject();
    }
    extractKeyFromUrl(url) {
        const urlObj = new URL(url);
        return urlObj.pathname.substring(1);
    }
}
exports.S3FileUploadProvider = S3FileUploadProvider;
//# sourceMappingURL=s3-file-upload.provider.js.map