import { Model } from 'src/app/models/model/model';

export class Receipt extends Model {
    public readonly class = Receipt;

    constructor() {
        super();
    }

    public static getModelName(): string {
        return 'receipt';
    }

    public static getFields(): Array<string> {
        return ['_id', '__v', '_userId', '_locationId', 'date'];
    }
}