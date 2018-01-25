class CustomError extends Error {
    constructor(message, error) {
        super(message);
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, CustomError);
        } else { 
            this.stack = (new Error(message)).stack; 
        }; 	
        if (typeof error === "object") {
            this.originalErr = error; 
        }
    }
};

export class QuerySyncError extends CustomError {
    constructor(message, error) {
        super(message, error);
        this.name = "QuerySyncError";
    }
};