import { Model } from 'src/app/models/model/model';

export class LocationItem extends Model {
    public readonly class = LocationItem;

    constructor() {
        super();
    }

    public static getModelName(): string {
        return 'locationItem';
    }

    public static getFields(): Array<string> {
        return ['_id', '__v', '_locationId', 'name', 'tag', 'price'];
    }
}