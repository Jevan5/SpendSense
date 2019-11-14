import { Model } from 'src/app/models/model/model';

export class Location extends Model {
    private static fields = ['_id', '__v', '_franchiseId', 'address', 'city', 'country'];

    constructor() {
        super();
    }

    public static getModelName() {
        return 'location';
    }

    public static createOneFromResponse(response: any): Location {
        if (response == null) {
            throw new Error('response is null');
        }

        if (response[Location.getModelName()] == null) {
            throw new Error('response.' + Location.getModelName() + ' is null.');
        }

        let location = new Location();

        Location.fields.forEach((field) => {
            if (!response[Location.getModelName()].hasOwnProperty(field)) {
                throw new Error("response (" + JSON.stringify(response) + ") is missing property (" + field + ")");
            }

            location.setValue(field, response[Location.getModelName()][field]);
        });

        return location;
    }

    public static createManyFromResponse(response: any): Array<Location> {
        if (response == null) {
            throw new Error('response is null.');
        }

        if (response[Location.getModelName() + 's'] == null) {
            throw new Error('response.' + Location.getModelName() + 's is null.');
        }

        var locations = new Array<Location>();

        response[Location.getModelName() + 's'].forEach((location) => {
            locations.push(Location.createOneFromResponse({ location: location }));
        });

        return locations;
    }

    public deepCopy(): Location {
        let location = new Location();

        Location.fields.forEach((field) => {
            if (this.hasField(field)) {
                location.setValue(field, this.getValue(field));
            }
        });

        return location;
    }

    public getClass() {
        return Location;
    }
}