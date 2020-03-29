import { Model } from 'src/app/models/model';

export class CommonTag extends Model {
    public readonly class = CommonTag;

    constructor() {
        super();
    }

    public static getModelName(): string {
        return 'commonTag';
    }

    public static getFields(): Array<string> {
        return ['_id', 'name', 'tag', '__v'];
    }
}