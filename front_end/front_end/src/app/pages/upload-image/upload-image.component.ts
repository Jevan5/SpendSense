import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { ScanReceiptService } from '../../services/scan-receipt/scan-receipt.service';
import { LoadableComponent } from '../../components/loadable/loadable.component';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss'],
})
export class UploadImageComponent extends LoadableComponent implements OnInit {
  camera: any;
  imageURI: any;
  transfer: any;
  public imagePath;
  imageURL:any;
  imageFileName:any;

  selectedFile:any;
  
  constructor(public router: Router,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public scanReceiptService: ScanReceiptService) {

    super(loadingCtrl, toastCtrl);
  }

  preview(files) {
    if (files.length === 0)
      return;
  
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.setErrorMessage('Only images are supported.');
      return;
    }
  
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imageURL = reader.result; 
    }
  }

  onFileSelected(event){
    this.selectedFile = event.target.files[0];

    this.uploadFile();
  }

  uploadFile() {
    let fd = new FormData();
    fd.append('image', this.selectedFile);

    this.setLoadingMessage('Scanning image...').then(() => {
      return this.scanReceiptService.scanReceipt(fd);
    }).then((receipt) => {

      return this.clearMessage();
    }).then(() => {
      this.router.navigate(['/manual-entry']);
    }).catch((err) => {
      this.setErrorMessage(err);
    });
  }

  ngOnInit() {}
}