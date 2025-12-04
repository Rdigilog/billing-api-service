export interface Configuration {
    port: number;
    nodeEnv: string;
    jwt: {
        secret: string;
        expirationTime: string;
    };
    database: {
        url: string;
        replicaUrl: string;
        autoMigrate: string;
    };
    redis: {
        url: string;
    };
    mail: {
        host: string;
        port: number;
        user: string;
        pass: string;
    };
    fileUpload: {
        provider: string;
    };
}
export declare function getConfigValues(): Promise<Partial<Configuration>>;
declare const _default: () => Promise<Configuration>;
export default _default;
