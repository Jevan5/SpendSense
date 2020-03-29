import { Model } from 'src/app/models/model';

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

    public getValue(field: string): any {
        if (field === 'date') {
            return new Date(super.getValue(field));
        } else {
            return super.getValue(field);
        }
    }
}