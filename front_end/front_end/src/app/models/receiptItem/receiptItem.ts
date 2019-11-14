import { Model } from 'src/app/models/model/model';

export class ReceiptItem extends Model {
    private static fields = ['_id', '__v', '_receiptId', '_systemItemId', 'name', 'price', 'quantity'];

    constructor() {
        super();
    }

    public static getModelName() {
        return 'receiptItem';
    }

    public static createOneFromResponse(response: any): ReceiptItem {
        if (response == null) {
            throw new Error("response is null.");
        }

        if (response[ReceiptItem.getModelName()] == null) {
            throw new Error("response." + ReceiptItem.getModelName() + " is null.");
        }

        let receiptItem = new ReceiptItem();

        ReceiptItem.fields.forEach((field) => {
            if (!response[ReceiptItem.getModelName()].hasOwnProperty(field)) {
                throw new Error("response (" + JSON.stringify(response) + ") is missing (" + field + ")");
            }

            receiptItem.setValue(field, response[ReceiptItem.getModelName()][field]);
        });

        return receiptItem;
    }

    public static createManyFromResponse(response: any): Array<ReceiptItem> {
        if (response == null) {
            throw new Error('response is null.');
        }

        if (response[ReceiptItem.getModelName() + 's'] == null) {
            throw new Error("response." + ReceiptItem.getModelName() + "s is null.");
        }

        var receiptItems = new Array<ReceiptItem>();

        response[ReceiptItem.getModelName() + 's'].forEach((receiptItem) => {
            receiptItems.push(ReceiptItem.createOneFromResponse({ receiptItem: receiptItem }));
        });

        return receiptItems;
    }

    public deepCopy(): ReceiptItem {
        let receiptItem = new ReceiptItem();

        ReceiptItem.fields.forEach((field) => {
            if (this.hasField(field)) {
                receiptItem.setValue(field, this.getValue(field));
            }
        });

        return receiptItem;
    }

    public getClass() {
        return ReceiptItem;
    }
}