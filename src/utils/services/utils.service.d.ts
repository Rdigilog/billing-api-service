export declare class UtilsService {
    pagination(page: number, size: number): {
        limit: number;
        offset: number;
    };
    pagingData(data: any, page: any, limit: any): {
        totalItems: any;
        result: any;
        totalPages: number;
        currentPage: number;
    };
    nextBilling(): Date;
    exclude(data: any, keys: any[]): {
        [k: string]: unknown;
    };
    hashPassword(plain: string, p0: number): Promise<string | null>;
    comparePassword(plain: any, hash: any): Promise<boolean>;
    validateContact(identifier: string): 'email' | 'phone' | null;
    formatPhoneNumber(phoneNumber: string): string;
    lisaUnique(): any;
}
