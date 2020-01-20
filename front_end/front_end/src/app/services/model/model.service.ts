import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';
import { Model } from '../../models/model/model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModelService {
  constructor(public http: HttpClient, public authenticationService: AuthenticationService) {}

  /**
   * Gets a single model.
   * @param id ID of the entity to get.
   * @param modelClass Class of the Model to retrieve.
   * @returns Resolves with the retrieved model.
   */
  public getOne(id: string, modelClass): Promise<Model> {
    return new Promise((resolve, reject) => {
      this.http.get('http://' + environment.backEndIp + ':' + environment.backEndPort + '/' + modelClass.getModelName() + 's/' + id, this.authenticationService.getAuthorizationHeader())
      .subscribe((data) => {
        try {
          var model = Model.createOneFromResponse(data, modelClass);

          resolve(model);
        } catch (e) {
          reject(e);
        }
      }, (err) => {
        reject(err.error);
      });
    });
  }

  /**
   * Gets all the models for a model class.
   * @param modelClass Class of the Model to retrieve.
   * @param queryParameters Mapping from query parameters to their values.
   * @returns Resolves with the retrieved models.
   */
  public getAll(modelClass, queryParameters: Map<string, string> = new Map<string, string>()): Promise<Array<Model>> {
    return new Promise((resolve, reject) => {
      try {
        var paramsString = '?';

        queryParameters.forEach((value, key) => {
          paramsString += key + '=' + value + '&';
        });

        this.http.get('http://' + environment.backEndIp + ':' + environment.backEndPort + '/' + modelClass.getModelName() + 's/' + paramsString, this.authenticationService.getAuthorizationHeader())
        .subscribe((data) => {
          try {
            var models = Model.createManyFromResponse(data, modelClass);

            resolve(models);
          } catch (e) {
            console.log(e);
            reject(e);
          }
        }, (err) => {
          reject(err.error);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Saves a model, by POSTing a new one if it does not exist,
   * or PUTing it if it already exists.
   * @param model Document to save.
   * @returns Resolves with the saved model.
   */
  public save(model: Model): Promise<Model> {
    return new Promise((resolve, reject) => {
        var request: Observable<any>;
        if (model.hasField('_id')) {  // Updating
          request = this.http.put('http://' + environment.backEndIp + ':' + environment.backEndPort + '/' + model.class.getModelName() + 's/' + model.getValue('_id'),
          JSON.parse("{\"" + model.class.getModelName() + "\": " + JSON.stringify(model.toJson()) + "}"),
          this.authenticationService.getAuthorizationHeader());
        } else {  // Creating new
          request = this.http.post('http://' + environment.backEndIp + ':' + environment.backEndPort + '/' + model.class.getModelName() + 's',
          JSON.parse("{\"" + model.class.getModelName() + "\": " + JSON.stringify(model.toJson()) + "}"),
          this.authenticationService.getAuthorizationHeader());
        }

        request.subscribe((data) => {
          try {
            resolve(Model.createOneFromResponse(data, model.class));
          } catch (e) {
            reject(e);
          }
        }, (err) => {
          reject(err.error);
        });
    });
  }

  /**
   * 
   * @param models Models to save.
   * @returns {Promise<Array<Model>>} Promise which resolves with the saved models.
   */
  public saveMany(models: Array<Model>): Promise<Array<Model>> {
    return this.saveManyRec(models, new Array<Model>(), 0);
  }

  public saveManyRec(models: Array<Model>, savedModels: Array<Model>, index: number): Promise<Array<Model>> {
    if (index === models.length) {
      return new Promise<Array<Model>>((resolve, reject) => {
        resolve(savedModels);
      });
    }

    return this.save(models[index]).then((model) => {
      savedModels.push(model);

      return this.saveManyRec(models, savedModels, index + 1);
    });
  }

  /**
   * Deletes a single model.
   * @param id ID of the model to delete.
   * @param modelClass Class of the model.
   * @returns Resolves when the model has been deleted.
   */
  public deleteOne(id: string, modelClass): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.delete('http://' + environment.backEndIp + ':' + environment.backEndPort + '/' + modelClass.getModelName() + 's/' + id, this.authenticationService.getAuthorizationHeader())
      .subscribe((data) => {
        try {
          resolve();
        } catch (e) {
          reject(e);
        }
      }, (err) => {
        reject(err.error);
      });
    })
  }
}