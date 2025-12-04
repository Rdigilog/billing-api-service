"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploadProviderFactory = fileUploadProviderFactory;
const cloudinary_file_uppoad_1 = require("../providers/cloudinary-file-uppoad");
const s3_file_upload_provider_1 = require("../providers/s3-file-upload.provider");
function fileUploadProviderFactory(provider, configService) {
    if (provider != null && provider.toLocaleLowerCase() === 'aws') {
        return new s3_file_upload_provider_1.S3FileUploadProvider(configService);
    }
    else {
        return new cloudinary_file_uppoad_1.CooudinaryFileUploadProvider(configService);
    }
}
//# sourceMappingURL=factory.provider.js.map