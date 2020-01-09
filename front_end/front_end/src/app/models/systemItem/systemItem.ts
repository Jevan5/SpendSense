import { Model } from 'src/app/models/model/model';

export class SystemItem extends Model {
    public readonly class = SystemItem;

    constructor() {
        super();
    }

    public static getModelName(): string {
        return 'systemItem';
    }

    public static getFields(): Array<string> {
        return ['_id', '__v', 'name', 'tag'];
    }
}