export class CustomErrorWrapper extends Error {
    public payload: object | undefined;

    constructor(payload?: object) {
        super('');
        this.name = this.constructor.name;
        this.payload = payload;
        Error.captureStackTrace(this, this.constructor);
    }

    public static throwError(payload?: object): void {
        throw new CustomErrorWrapper(payload);
    }
}
