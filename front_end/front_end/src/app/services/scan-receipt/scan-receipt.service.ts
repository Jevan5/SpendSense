import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ScanReceiptService {
  private lastReceipt: receipt;

  constructor(public httpClient: HttpClient,
    public authenticationService: AuthenticationService) { }

  public scanReceipt(formData: FormData): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.httpClient.post('http://' + environment.backEndIp + ':' + environment.backEndPort + '/scanReceipt',
      formData,
      this.authenticationService.getAuthorizationHeader()).subscribe((res: any) => {
        let r = this.parseScanForText(res);
        this.lastReceipt = r;
        resolve(this.lastReceipt);
      }, (err) => {
        reject(err);
      });
    });
  }

  public getLastReceipt(): receipt {
    return this.lastReceipt;
  }

  public clearLastReceipt(): void {
    this.lastReceipt = null;
  }

  /**
   * Function to parse the JSON string returned by google-cv-api into a receipt item
   * @param file JSON-formatted string
   * @returns {receipt} 
   */
  public parseScanForText(file): receipt {
    let json = file;
    const pItems = [];
    var storeName = null;

    json.forEach(el => {
      if (getHeight(el.boundingPoly) < 100) {
        // Arbitrary check to factor out items that scan the entire receipt at once... 
        // receipt items probably won't be too large. Change right side of comparator if needed.
        pItems.push(new pItem(el.description,
          getBoundingY(el.boundingPoly),
          getBoundingX(el.boundingPoly),
          getAngle(el.boundingPoly),
          getHeight(el.boundingPoly)));
      }
    });

    pItems.sort(sortByY);
    var tItems = pItems;
    var itemRows = [];

    pItems.forEach(pel => {
      var newItem = null;
      tItems.forEach(tel => {
        if (tel.added == false) {
          if (inline(pel, tel)) {
            if (newItem == null) {
              newItem = new fItemRow(new fItem(pel.desc, pel.x, pel.y));
            }
            newItem.addItem(new fItem(tel.desc, tel.x, tel.y));
            tel.added = true;
          }
        }
      })

      if (newItem != null) {
        itemRows.push(newItem);
      }
    });

    var finalRows = [];

    itemRows.forEach(el => {
      el.fItems.sort(sortByX);
      if (/[0-9]+\.[0-9]{2}/.test(el.fItems[el.fItems.length - 1].desc)) {
        finalRows.push(el);
      }
    });

    finalRows.forEach(el => {
      el.getPriceAsLastItem();
    });

    var finalReceipt = new receipt(storeName, finalRows);

    return finalReceipt;
  }
}

class pItem {
  public desc;
  public y;
  public x;
  public angle;
  public height;
  public added;

  constructor(desc, y, x, angle, height) {
    this.desc = desc;
    this.y = y;
    this.x = x;
    this.angle = angle;
    this.height = height;
    this.added = false;
  }
}

class fItem {
  public desc;
  public x;
  public y;

  constructor(desc, x, y) {
    this.desc = desc;
    this.x = x;
    this.y = y;
  }
}

/**
 * the final automatically generated receipt & items
 * @param store store name
 * @param items array of items
 */
class receipt {
  public store: string;
  public items: Array<fItemRow>;

  constructor(store, items) {
    this.store = store;
    this.items = items;
  }
}

/**
 * a row featuring an item name and price
 * @param fItems array of fItems
 * @param description collected item name for this row
 * @param price the collected price for this row
 */
class fItemRow {
  public fItems;
  public description;
  public price;

  constructor(fItem) {
    this.fItems = [];
    this.description = null;
    this.price = null;

    this.addItem(fItem);
  }

  addItem(fItem) {
    this.fItems.push(fItem);
  }

  getPriceAsLastItem() {
    this.price = this.fItems.pop().desc;
    this.description = "";

    this.fItems.forEach(el => {
      this.description += el.desc + " ";
    })
    this.description = this.description.slice(0, -1);
  }
}

function getBoundingY(boundingPoly) {
  return ((boundingPoly.vertices[0].y + boundingPoly.vertices[1].y + boundingPoly.vertices[2].y + boundingPoly.vertices[3].y) / 4);
}
function getBoundingX(boundingPoly) {
  return ((boundingPoly.vertices[0].x + boundingPoly.vertices[1].x + boundingPoly.vertices[2].x + boundingPoly.vertices[3].x) / 4);
}
function getHeight(boundingPoly) {
  var y = getBoundingY(boundingPoly);
  var h0, h1, h2, h3;

  h0 = Math.abs(y - boundingPoly.vertices[0].y);
  h1 = Math.abs(y - boundingPoly.vertices[1].y);
  h2 = Math.abs(y - boundingPoly.vertices[2].y);
  h3 = Math.abs(y - boundingPoly.vertices[3].y);

  return ((h0 + h1 + h2 + h3) / 4);
}
function getAngle(boundingPoly) {
  var dy1, dy2;

  dy1 = (boundingPoly.vertices[1].y - boundingPoly.vertices[0].y) / (boundingPoly.vertices[1].x - boundingPoly.vertices[0].x)
  dy2 = (boundingPoly.vertices[2].y - boundingPoly.vertices[3].y) / (boundingPoly.vertices[2].x - boundingPoly.vertices[3].x)

  return ((dy1 + dy2) / 2);
}

function sortByY(A, B) {
  let comparison = 0;
  if (A.y > B.y) {
    comparison = 1;
  }
  if (A.y < B.y) {
    comparison = -1;
  }
  return comparison;
}

function sortByX(A, B) {
  let comparison = 0;
  if (A.x > B.x) {
    comparison = 1;
  }
  if (A.x < B.x) {
    comparison = -1;
  }
  return comparison;
}

function inline(pItemA, pItemB) {
  const heightFlex = 0.2 // manage the leniency for how well points line up
  var dist = pItemB.x - pItemA.x

  if (dist <= 0) return false;

  var finY = pItemA.y + (pItemA.angle * dist);
  var finY2 = pItemB.y - (pItemB.angle * dist);


  // 1: more lenient check
  if (finY > pItemB.y - (pItemB.height * heightFlex) && finY < pItemB.y + (pItemB.height * heightFlex)) return true;

  // 2: more strict check
  // if (finY > pItemB.y - (pItemB.height * heightFlex) && finY < pItemB.y + (pItemB.height * heightFlex) &&
  //   finY2 > pItemA.y - (pItemA.height * heightFlex) && finY2 < pItemA.y + (pItemA.height * heightFlex)) return true;

  return false;
}

