export declare class ResponsesService {
    responseCodes: {
        SUCCESS: number;
        UNAUTHORIZED: number;
        NOT_FOUND: number;
        INVALID_REQUEST: number;
        FORBIDDEN: number;
        TIMEOUT: number;
        EXCEPTION: number;
    };
    responseMessages: {
        SUCCESS: string;
        UNAUTHORIZED: string;
        NOT_FOUND: string;
        INVALID_REQUEST: string;
        FORBIDDEN: string;
        TIMEOUT: string;
        EXCEPTION: string;
    };
    success(message: any): {
        statusCode: number;
        message: string;
        data: any;
    };
    unauthorized(message: any): {
        statusCode: number;
        message: any;
        data: null;
    };
    badRequest(message: any): {
        statusCode: number;
        message: any;
        data: null;
    };
    notFound(message: any): {
        statusCode: number;
        message: any;
        data: null;
    };
    exception(message: any): {
        statusCode: number;
        message: any;
        data: null;
    };
    cast(obj: any): any;
    isDecimal(object: any): object is DecimalFormat;
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
    errorHandler(e: any): {
        error: number;
        body: string;
    };
}
interface DecimalFormat {
    s: number;
    e: number;
    d: number[];
}
export {};
