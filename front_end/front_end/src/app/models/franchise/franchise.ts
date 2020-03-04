import { Model } from 'src/app/models/model';

export class Franchise extends Model {
    public readonly class = Franchise;

    constructor() {
        super();
    }

    public static getModelName(): string {
        return 'franchise';
    }

    public static getFields(): Array<string> {
        return ['_id', '__v', 'name'];
    }
}