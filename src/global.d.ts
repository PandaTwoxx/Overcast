declare namespace NodeJS {
    export interface ProcessEnv {
        USERNAME?: string;
        HOST?: string;
        PASSWORD?: string;
        DATABASE?: string;
        PORT?: number;
    }
}