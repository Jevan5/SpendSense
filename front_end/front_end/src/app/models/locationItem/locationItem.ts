import { Model } from 'src/app/models/model/model';

export class LocationItem extends Model {
    private static fields = ['_id', '__v', '_locationId', 'name', 'tag', 'price'];

    constructor() {
        super();
    }

    public static getModelName(): string {
        return 'locationItem';
    }

    public static createOneFromResponse(response: any): LocationItem {
        if (response == null) {
            throw new Error("response is null.");
        }

        if (response[LocationItem.getModelName()] == null) {
            throw new Error("response." + LocationItem.getModelName() + " is null.");
        }

        let locationItem = new LocationItem();

        LocationItem.fields.forEach((field) => {
            if (!response[LocationItem.getModelName()].hasOwnProperty(field)) {
                throw new Error("response (" + JSON.stringify(response) + ") is missing property (" + field + ")");
            }

            locationItem.setValue(field, response[LocationItem.getModelName()][field]);
        });

        return locationItem;
    }

    public static createManyFromResponse(response: any): Array<LocationItem> {
        if (response == null) {
            throw new Error('response is null.');
        }

        if (response[LocationItem.getModelName() + 's'] == null) {
            throw new Error("response." + LocationItem.getModelName() + 's is null.');
        }

        var locationItems = new Array<LocationItem>();

        response[LocationItem.getModelName() + 's'].forEach((locationItem) => {
            locationItems.push(LocationItem.createOneFromResponse({ locationItem: locationItem }));
        });

        return locationItems;
    }

    public deepCopy(): LocationItem {
        let locationItem = new LocationItem();

        LocationItem.fields.forEach((field) => {
            if (this.hasField(field)) {
                locationItem.setValue(field, this.getValue(field));
            }
        });

        return locationItem;
    }

    public getClass() {
        return LocationItem;
    }
}