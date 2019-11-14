import { ValueAccessor } from '@ionic/angular/dist/directives/control-value-accessors/value-accessor';

export abstract class Model {
    private values: Map<string, any>;
    public abstract readonly class;

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
        throw new Error('Model.getModelName() is not implemented.');
    }

    /**
     * Returns a deep copy of this model.
     * @returns Deep copy of this model.
     */
    public deepCopy(): Model {
        var copied: Model = new this.class();

        this.class.getFields().forEach((field: string) => {
            if (this.hasField(field)) {
                copied.setValue(field, this.getValue(field));
            }
        });

        return copied;
    }

    /**
     * Gets the fields for the saved model.
     * @returns The fields for the saved model.
     */
    public static getFields(): Array<string> {
        throw new Error('Model.getFields() is not implemented.');
    }

    /**
     * Creates the model from a response originating from the back end.
     * Will ensure the structure of the response.
     * @param response Response from the backend.
     * @param modelClass Class of the model.
     * @returns The model.
     */
    public static createOneFromResponse(response: any, modelClass): Model {
        return Model.createFromResponse(response, modelClass, false)[0];
    }

    /**
     * Creates models from a response originating from the back end.
     * Will ensure the structure of the response.
     * @param response Response from the backend.
     * @param modelClass Class of the model.
     * @returns The models.
     */
    public static createManyFromResponse(response: any, modelClass): Array<Model> {
        return Model.createFromResponse(response, modelClass, true);
    }

    /**
     * Creates models from a response. Throws an error
     * if the response is null, does not have the
     * required model name as a field, or contains invalid
     * fields.
     * @param response Response to validate.
     * @param modelClass Class of the model.
     * @param multiple True if the response is for multiple documents.
     * @returns An array of models from the response.
     */
    private static createFromResponse(response: any, modelClass, multiple: boolean): Array<Model> {
        if (response == null) {
            throw new Error('response is null.');
        }

        var modelField = modelClass.getModelName();

        if (multiple) {
            modelField += 's';
        }

        if (response[modelField] == null) {
            throw new Error("response." + modelField + " is null.");
        }

        var data = response[modelField];
        var elements = [];

        if (multiple) {
            if (!Array.isArray(data)) {
                throw new Error("response." + modelField + " is not an array.");
            }

            elements = data;
        } else {
            elements.push(data);
        }

        var requiredFields = new Set<string>(modelClass.getFields());

        var models = [];

        for (var i = 0; i < elements.length; i++) {
            
        }

        elements.forEach((element, index) => {
            var model = new modelClass();

            modelClass.getFields().forEach((field: string) => {
                if (!element.hasOwnProperty(field)) {
                    if (multiple) {
                        throw new Error("response." + modelField + "[" + index + "]." + field + " is missing.");
                    } else {
                        throw new Error("response." + modelField + "." + field + " is missing.");
                    }
                }

                model.setValue(field, element[field]);
            });

            for (var key in element) {
                if (element.hasOwnProperty(key)) {
                    if (!requiredFields.has(key)) {
                        if (multiple) {
                            throw new Error("response." + modelField + "[" + index + "]." + key + " should not exist.");
                        } else {
                            throw new Error("response." + modelField + "." + key + " should not exist.");
                        }
                    }
                }
            }

            models.push(model);
        });

        return models;
    }
};