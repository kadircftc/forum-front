
export class BaseEncryptedDto {
    payload: string;
    tag: string;

    constructor(payload: string, tag: string) {
        this.payload = payload;
        this.tag = tag;
    }
}
