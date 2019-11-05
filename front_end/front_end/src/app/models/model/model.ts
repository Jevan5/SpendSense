import { ValueAccessor } from '@ionic/angular/dist/directives/control-value-accessors/value-accessor';

export abstract class Model {
    private values: Map<string, any>;

    constructor() {
        this.values = new Map<string, any>();
    }

    /**
     * Gets the value of a field.
     * @param field Field to get the value of.
     * @returns The value of the field.
     */
    public getValue(field: string): any {
        return this.values.get(field);
    }

    /**
     * Determines whether the model contains the field.
     * @param field Field to check for existence.
     * @returns True if the model has the field. Otherwise, false.
     */
    public hasField(field: string): any {
        return this.values.has(field);
    }

    /**
     * Sets the field's value.
     * @param field Field to set.
     * @param value Value to set field to.
     * @returns The field's old value.
     */
    public setValue(field: string, value: any): any {
        let oldValue = this.values.get(field);

        this.values.set(field, value);

        return oldValue;
    }

    /**
     * Sets the fields' values.
     * @param json JSON mapping from keys to values.
     */
    public setValues(json): void {
        for (var key in json) {
            if (json.hasOwnProperty(key)) {
                this.setValue(key, json[key]);
            }
        }
    }

    /**
     * Removes a field from the model.
     * @param field Field to remove.
     * @returns Value of the field before removal.
     */
    public removeValue(field: string): any {
        let oldValue = this.values.get(field);

        this.values.delete(field);

        return oldValue;
    }

    /**
     * Converts the model to JSON form.
     * @returns The model in JSON form.
     */
    public toJson(): any {
        let json = {};
        this.values.forEach((value, key) => {
            json[key] = value;
        });

        return json;
    }

    /**
     * Gets the name of the model.
     * @returns The name of the model.
     */
    public static getModelName(): string {
        throw new Error('Function not implemented.');
    }

    /**
     * Creates the model from a response originating from the back end.
     * Will ensure the structure of the response.
     * @param response Response from the backend.
     * @returns The model.
     */
    public static createOneFromResponse(response: any): Model {
        throw new Error('Function not implemented.');
    }

    /**
     * Creates models from a response originating from the back end.
     * Will ensure the structure of the response.
     * @param response Response from the backend.
     * @returns The models.
     */
    public static createManyFromResponse(response: any): Array<Model> {
        throw new Error('Function not implemented.');
    }

    /**
     * Returns a deep copy of this model.
     */
    public abstract deepCopy(): Model;

    /**
     * Gets the class of the model.
     * @returns The class of the model.
     */
    public abstract getClass();
};