import { Model } from 'src/app/models/model/model';

export class Receipt extends Model {
    private static fields = ['_id', '__v', '_userId', '_locationId', 'date'];

    constructor() {
        super();
    }

    public static getModelName() {
        return 'receipt';
    }

    public static createOneFromResponse(response: any): Receipt {
        if (response == null) {
            throw new Error("response is null.");
        }

        if (response[Receipt.getModelName()] == null) {
            throw new Error("response." + Receipt.getModelName() + " is null.");
        }

        let receipt = new Receipt();

        Receipt.fields.forEach((field) => {
            if (!response[Receipt.getModelName()].hasOwnProperty(field)) {
                throw new Error("response (" + JSON.stringify(response) + ") is missing property (" + field + ")");
            }

            receipt.setValue(field, response[Receipt.getModelName()][field]);
        });

        return receipt;
    }

    public static createManyFromResponse(response: any): Array<Receipt> {
        if (response == null) {
            throw new Error('response is null.');
        }

        if (response[Receipt.getModelName() + 's'] == null) {
            throw new Error("response." + Receipt.getModelName() + "s is null.");
        }

        var receipts = new Array<Receipt>();

        response[Receipt.getModelName() + 's'].forEach((receipt) => {
            receipts.push(Receipt.createOneFromResponse({ receipt: receipt }));
        });

        return receipts;
    }

    public deepCopy(): Receipt {
        let receipt = new Receipt();

        Receipt.fields.forEach((field) => {
            if (this.hasField(field)) {
                receipt.setValue(field, this.getValue(field));
            }
        });

        return receipt;
    }

    public getClass() {
        return Receipt;
    }
}