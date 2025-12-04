"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CooudinaryFileUploadProvider = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
class CooudinaryFileUploadProvider {
    configService;
    logger = new common_1.Logger(CooudinaryFileUploadProvider.name);
    constructor(configService) {
        this.configService = configService;
        this.logger.debug(' Initialized');
    }
    static uniqueFilename() {
        const timestamp = Date.now().toString();
        const randomString = Math.random().toString(36).substring(2);
        return `${timestamp}-${randomString}`;
    }
    async upload(file) {
        try {
            file = this.restoreBuffer(file);
            const fileName = CooudinaryFileUploadProvider.uniqueFilename();
            const newFileName = `${this.configService.get('AWS_S3_UPLOAD_FOLDER')}/${fileName}`;
            const uploadResult = await this.cloudinaryUpload(file);
            const uploadedFile = {
                name: file.originalname,
                url: uploadResult.secure_url,
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
    async cloudinaryUpload(file) {
        try {
            const formData = new form_data_1.default();
            formData.append('file', file.buffer, file.originalname);
            formData.append('upload_preset', this.configService.get('CLOUD_UPLOAD_PRESET') || 'unsigned');
            formData.append('cloud_name', this.configService.get('CLOUD_NAME') || 'dwhvilwc3');
            const uploadName = this.configService.get('CLOUD_NAME') || 'dwhvilwc3';
            const baseUrl = this.configService.get('CLOUDINARY_BASEURL') || 'https://api.cloudinary.com/v1_1/';
            const response = await axios_1.default.post(`${baseUrl}${uploadName}/image/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        }
        catch (e) {
            console.log(e);
            return e.message;
        }
    }
    async remove(url) {
        const publicId = this.extractPublicId(url);
        const cloudName = this.configService.get('CLOUD_NAME') || 'dwhvilwc3';
        const apiKey = this.configService.get('CLOUDINARY_API_KEY') || '';
        const apiSecret = this.configService.get('CLOUDINARY_API_SECRET');
        const endpoint = `${this.configService.get('CLOUDINARY_BASEURL')}${cloudName}/resources/image/upload`;
        const response = await axios_1.default.delete(endpoint, {
            auth: {
                username: apiKey,
                password: apiSecret,
            },
            params: {
                public_ids: [publicId],
            },
        });
        return response.data;
    }
    extractPublicId(url) {
        const cleanUrl = url.split('?')[0];
        const parts = cleanUrl.split('/upload/')[1].split('/');
        const publicIdWithExt = parts.join('/');
        return publicIdWithExt.replace(/\.[^/.]+$/, '');
    }
}
exports.CooudinaryFileUploadProvider = CooudinaryFileUploadProvider;
//# sourceMappingURL=cloudinary-file-uppoad.js.map