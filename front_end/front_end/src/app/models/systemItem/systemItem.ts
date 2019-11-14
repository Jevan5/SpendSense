import { Model } from 'src/app/models/model/model';

export class SystemItem extends Model {
    private static fields = ['_id', '__v', 'name', 'tag'];

    constructor() {
        super();
    }

    public static getModelName(): string {
        return 'systemItem';
    }

    public static createOneFromResponse(response: any): SystemItem {
        if (response == null) {
            throw new Error("response is null.");
        }

        if (response[SystemItem.getModelName()] == null) {
            throw new Error("response." + SystemItem.getModelName() + " is null.");
        }

        let systemItem = new SystemItem();

        SystemItem.fields.forEach((field) => {
            if (!response[SystemItem.getModelName()].hasOwnProperty(field)) {
                throw new Error("response (" + JSON.stringify(response) + ") is missing property (" + field + ")");
            }

            systemItem.setValue(field, response[SystemItem.getModelName()][field]);
        });

        return systemItem;
    }

    public static createManyFromResponse(response: any): Array<SystemItem> {
        if (response == null) {
            throw new Error("response is null.");
        }

        if (response[SystemItem.getModelName() + 's'] == null) {
            throw new Error("response." + SystemItem.getModelName() + 's is null.');
        }

        var systemItems = new Array<SystemItem>();

        response[SystemItem.getModelName() + 's'].forEach((systemItem) => {
            systemItems.push(SystemItem.createOneFromResponse({ systemItem: systemItem }));
        });

        return systemItems;
    }

    public deepCopy(): SystemItem {
        let systemItem = new SystemItem();

        SystemItem.fields.forEach((field) => {
            if (this.hasField(field)) {
                systemItem.setValue(field, this.getValue(field));
            }
        });

        return systemItem;
    }

    public getClass() {
        return SystemItem;
    }
}