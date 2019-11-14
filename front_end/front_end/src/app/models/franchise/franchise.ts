import { Model } from 'src/app/models/model/model';

export class Franchise extends Model {
    private static fields = ['_id', '__v', 'name'];

    constructor() {
        super();
    }

    public static getModelName() {
        return 'franchise';
    }

    public static createOneFromResponse(response: any): Franchise {
        if (response == null) {
            throw new Error("response is null");
        }

        if (response[Franchise.getModelName()] == null) {
            throw new Error("response." + Franchise.getModelName() + " is null.");
        }

        let franchise = new Franchise();

        Franchise.fields.forEach((field) => {
            if (!response[Franchise.getModelName()].hasOwnProperty(field)) {
                throw new Error("response (" + JSON.stringify(response) + ") is missing property (" + field + ")");
            }

            franchise.setValue(field, response[Franchise.getModelName()][field]);
        });

        return franchise;
    }

    public static createManyFromResponse(response: any): Array<Franchise> {
        if (response == null) {
            throw new Error('response is null.');
        }

        if (response[Franchise.getModelName() + 's'] == null) {
            throw new Error("response." + Franchise.getModelName() + 's is null.');
        }

        var franchises = new Array<Franchise>();

        response[Franchise.getModelName() + 's'].forEach((franchise) => {
            franchises.push(Franchise.createOneFromResponse({ franchise: franchise }));
        });

        return franchises;
    }

    public deepCopy(): Franchise {
        let franchise = new Franchise();

        Franchise.fields.forEach((field) => {
            if (this.hasField(field)) {
                franchise.setValue(field, this.getValue(field));
            }
        });

        return franchise;
    }

    public getClass() {
        return Franchise;
    }
}