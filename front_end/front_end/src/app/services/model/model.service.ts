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
      this.http.get('http://' + environment.backEndIp + ':' + environment.backEndPort + '/' + modelClass.getModelName() + 's/' + id)
      .subscribe((data) => {
        try {
          var model = modelClass.createOneFromResponse(data);

          resolve(model);
        } catch (e) {
          reject(e);
        }
      }, (err) => {
        reject(err);
      });
    });
  }

  /**
   * Gets all the models for a model class.
   * @param modelClass Class of the Model to retrieve.
   * @returns Resolves with the retrieved models.
   */
  public getAll(modelClass): Promise<Array<Model>> {
    return new Promise((resolve, reject) => {
      this.http.get('http://' + environment.backEndIp + ':' + environment.backEndPort + '/' + modelClass.getModelName() + 's')
      .subscribe((data) => {
        try {
          var models = modelClass.createManyFromResponse(data);

          resolve(models);
        } catch (e) {
          reject(e);
        }
      }, (err) => {
        reject(err);
      });
    });
  }

  /**
   * Saves a model, by POSTing a new one if it does not exist,
   * or PUTing it if it already exists.
   * @param model Model to save.
   * @returns Resolves with the saved model.
   */
  public save(model: Model): Promise<Model> {
    return new Promise((resolve, reject) => {
        var request: Observable<any>;
        if (model.hasField('_id')) {  // Updating
          request = this.http.put('http://' + environment.backEndIp + ':' + environment.backEndPort + '/' + model.getClass().getModelName() + 's/' + model.getValue('_id'),
          JSON.parse("{\"" + model.getClass().getModelName() + "\": " + JSON.stringify(model.toJson()) + "}"),
          this.authenticationService.getAuthorizationHeader());
        } else {  // Creating new
          request = this.http.post('http://' + environment.backEndIp + ':' + environment.backEndPort + '/' + model.getClass().getModelName() + 's',
          JSON.parse("{\"" + model.getClass().getModelName() + "\": " + JSON.stringify(model.toJson()) + "}"),
          this.authenticationService.getAuthorizationHeader());
        }

        request.subscribe((data) => {
          try {
            resolve(model.getClass().createOneFromResponse(data));
          } catch (e) {
            reject(e);
          }
        }, (err) => {
          reject(err);
        });
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
      this.http.delete('http://' + environment.backEndIp + ':' + environment.backEndPort + '/' + modelClass.getModelName() + 's/' + id)
      .subscribe((data) => {
        try {
          resolve();
        } catch (e) {
          reject(e);
        }
      }, (err) => {
        reject(err);
      });
    })
  }
}