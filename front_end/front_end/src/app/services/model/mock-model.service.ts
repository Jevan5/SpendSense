import { Model } from 'src/app/models/model/model';
import { MockAuthenticationService } from '../authentication/mock-authentication.service';

export class MockModelService {
    private tables;
    private nextId: number;

    constructor() {
        this.tables = {};
        this.nextId = 0;
    }

    public getOne(id: string, modelClass): Promise<Model> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this.tables[modelClass] == null) {
                    return reject('modelClass does not exist.');
                }

                if (this.tables[modelClass][id] == null) {
                    return reject('[' + id + '] does not exist.');
                }

                resolve(this.tables[modelClass][id]);
            }, 100);
        });
    }

    public getAll(modelClass): Promise<Array<Model>> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this.tables[modelClass] == null) {
                    return reject('modelClass does not exist.');
                }

                var models = [];

                for (var key in this.tables[modelClass]) {
                    if (this.tables[modelClass].hasOwnProperty(key)) {
                        models.push(this.tables[modelClass][key]);
                    }
                }

                resolve(models);
            }, 100);
        });
    }

    public save(model: Model): Promise<Model> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this.tables[model.getClass()] == null) {
                    this.tables[model.getClass()] = {};
                }

                if (model.hasField('_id')) {    // Updating
                    if (this.tables[model.getClass()][model.getValue('_id')] == null) {
                        return reject('[' + model.getValue('_id') + '] does not exist.');
                    }
                } else {    // Creating new
                    model.setValue('_id', this.nextId.toString());
                    this.nextId += 1;
                }

                this.tables[model.getClass()][model.getValue('_id')] = model;

                resolve(model);
            }, 100);
        });
    }

    public deleteOne(id: string, modelClass): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this.tables[modelClass] == null) {
                    return reject('modelClass does not exist.');
                }

                if (this.tables[modelClass][id] == null) {
                    return reject('[' + id + '] does not exist.');
                }

                this.tables[modelClass][id] = null;

                resolve();
            }, 100);
        });
    }
}