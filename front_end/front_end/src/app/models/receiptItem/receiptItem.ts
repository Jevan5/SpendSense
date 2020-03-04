import { Model } from 'src/app/models/model';

export class ReceiptItem extends Model {
    public readonly class = ReceiptItem;

    constructor() {
        super();
    }

    public static getModelName(): string {
        return 'receiptItem';
    }

    public static getFields(): Array<string> {
        return ['_id', '__v', '_receiptId', '_systemItemId', 'name', 'price', 'amount'];
    }
}