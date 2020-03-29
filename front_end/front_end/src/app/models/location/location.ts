import { Model } from 'src/app/models/model';

export class Location extends Model {
    public readonly class = Location;

    constructor() {
        super();
    }

    public static getModelName(): string {
        return 'location';
    }

    public static getFields(): Array<string> {
        return ['_id', '__v', '_franchiseId', 'address', 'city', 'country'];
    }
}