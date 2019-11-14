import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { LoadableComponent } from 'src/app/components/loadable/loadable.component';
import { ModelService } from 'src/app/services/model/model.service';
import { LocationItem } from 'src/app/models/locationItem/locationItem';
import { Location } from 'src/app/models/location/location';
import { Franchise } from 'src/app/models/franchise/franchise';
import { reject } from 'q';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent extends LoadableComponent implements OnInit {
  private model: {
    search: {
      name: string
    }, results: {
      locationItems: Array<LocationItem>,
      locations: Map<string, Location>,
      franchises: Map<string, Franchise>
    }
  };

  constructor(public loadingController: LoadingController,
    public toastController: ToastController,
    public modelService: ModelService) {
    super(loadingController, toastController);
    this.model = {
      search: {
        name: ''
      }, results: {
        locationItems: null,
        locations: null,
        franchises: null
      }
    };
  }

  ngOnInit() {}

  /**
   * Searches for location items that match model.search.name.
   * From these location items, uses their _locationId to retrieve
   * the location information for each location item, and the _franchiseId
   * from each location for information on each franchise.
   */
  public search(): void {
    this.model.results = {
      locationItems: null,
      locations: null,
      franchises: null
    };

    var params = new Map<string, string>();
    params.set('name', this.model.search.name);
    this.setLoadingMessage('Searching for items named "' + this.model.search.name + '"').then(() => {
      return this.modelService.getAll(LocationItem, params);
    }).then((locationItems: Array<LocationItem>) => {
      if (locationItems.length === 0) {
        return this.setWarningMessage('No items found.');
      } else {
        this.model.results.locationItems = locationItems;
        this.model.results.locationItems.sort((a, b) => {
          return a.getValue('price') - b.getValue('price');
        });

        return this.findLocations(this.model.results.locationItems).then((locationsMap) => {
          this.model.results.locations = locationsMap;
          return this.findFranchises(this.model.results.locations);
        }).then((franchisesMap) => {
          this.model.results.franchises = franchisesMap;
          return this.clearMessage();
        }).catch((err) => {
          reject(err);
        });
      }
    }).catch((err) => {
      this.model.results = {
        locationItems: null,
        locations: null,
        franchises: null
      };
  
      this.setErrorMessage(err.toString());
    });
  }

  /**
   * Retrieves a mapping from location ids to locations, by collecting
   * an array of unique location ids from locationItems.
   * @param locationItems Location items to retrieve the locations for.
   * @returns Resolves with mapping from location ids to locations.
   */
  public findLocations(locationItems: Array<LocationItem>): Promise<Map<string, Location>> {
    var locationIds = new Set<string>();
    
    locationItems.forEach((locationItem) => {
      locationIds.add(locationItem.getValue('_locationId'));
    });

    var locationIdsArray = [];
    
    locationIds.forEach((id) => {
      locationIdsArray.push(id);
    });

    return this.findLocationsFromIds(locationIdsArray);
  }

  /**
   * Retrieves a mapping from location ids to locations, from the current
   * index of an array of location ids, and then continues searching
   * the rest of the indices.
   * @param locationIds Location ids.
   * @param index Current index to search.
   * @param map Current version of the map.
   * @returns Resolves with the map once all searches have completed.
   */
  public findLocationsFromIds(locationIds: Array<string>, index: number = 0, map: Map<string, Location> = new Map<string, Location>()): Promise<Map<string, Location>> {
    return new Promise((resolve, reject) => {
      if (index == locationIds.length) {
        resolve(map);
      } else {
        this.modelService.getOne(locationIds[index], Location).then((location: Location) => {
          map.set(locationIds[index], location);
          return this.findLocationsFromIds(locationIds, index + 1, map);
        }).then((updatedMap) => {
          resolve(updatedMap);
        }).catch((err) => {
          reject(err);
        });
      }
    });
  }

  /**
   * Retrieves a mapping from franchise ids to franchises, by collecting
   * an array of unique franchise ids from locationsMap.
   * @param locationsMap Mapping from location ids to locations.
   * @returns Resolves with mapping from franchise ids to franchises.
   */
  public findFranchises(locationsMap: Map<string, Location>): Promise<Map<string, Franchise>> {
    var franchiseIdsArray = [];

    locationsMap.forEach((location, locationId) => {
      franchiseIdsArray.push(location.getValue('_franchiseId'));
    });

    return this.findFranchisesFromIds(franchiseIdsArray);
  }

  /**
   * Retrieves a mapping from franchise ids to franchises, from the current
   * index of an array of franchise ids, and then continues searching
   * the rest of the indices.
   * @param franchiseIds Franchise ids.
   * @param index Current index to search.
   * @param map Current version of the map.
   * @returns Resolves withn the map once all searches have completed.
   */
  public findFranchisesFromIds(franchiseIds: Array<string>, index: number = 0, map: Map<string, Franchise> = new Map<string, Franchise>()): Promise<Map<string, Franchise>> {
    return new Promise((resolve, reject) => {
      if (index == franchiseIds.length) {
        resolve(map);
      } else {
        this.modelService.getOne(franchiseIds[index], Franchise).then((franchise: Franchise) => {
          map.set(franchiseIds[index], franchise);
          return this.findFranchisesFromIds(franchiseIds, index + 1, map);
        }).then((updatedMap) => {
          resolve(updatedMap);
        }).catch((err) => {
          reject(err);
        });
      }
    });
  }
}