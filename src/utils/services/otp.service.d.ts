export declare class OtpService {
    isTokenValid(secret: string, token: string): any;
    secretOTP(): {
        code: any;
        secret: any;
    };
}
