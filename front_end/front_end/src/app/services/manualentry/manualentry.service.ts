import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Receipt } from 'src/app/models/receipt/receipt';
import { ReceiptItem } from 'src/app/models/receiptItem/receiptItem';
import { Franchise } from 'src/app/models/franchise/franchise';

@Injectable({
  providedIn: 'root'
})
export class ManualentryService {
  private receipt = Receipt;
  private receiptItem = ReceiptItem;

  constructor(public http: HttpClient, public storage: Storage) { }

  public submit(name: string, price: string, amount: number, unit: string, tag: string ): Promise<Receipt>{
    return new Promise((resolve, reject) => {
      this.http.post('http://' + environment.backEndIp + ':' + environment.backEndPort + '/manual-entry', {
        receipt: {
          franchise: Franchise,
          location: location,
          date: Date,
        },
        ReceiptItem: {
          name: name,
          price: price,
          amount: amount,
          unit: unit,
          tag: tag
        }
      }).subscribe((data: any) => {
        try {
          resolve(Receipt.createOneFromResponse(data));
        } catch (e) {
          reject(e);
        }
      }, (err) => {
        reject(err);
      });
    });

  }
}
