import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { HttpClient } from '@angular/common/http';
import { DepFlags } from '@angular/compiler/src/core';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss'],
})
export class UploadImageComponent implements OnInit {
  camera: any;
  imageURI: any;
  transfer: any;
  //loadingCtrl: any;
  //imageFileName: string;
  //toastCtrl: any;

//   Second attempt - good THIS STUFF WORKS 
  public imagePath;
  imageURL:any;
  imageFileName:any;
  public message: string;

  selectedFile:any;

  preview(files) {
    if (files.length === 0)
      return;
 
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
 
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imageURL = reader.result; 
    }
  }
  
constructor(public navCtrl: NavController,
  //private transfer: FileTransfer,
  //private camera: Camera,
  public loadingCtrl: LoadingController,
  public toastCtrl: ToastController,
  private http: HttpClient) {}


  onFileSelected(event){
    // this.selectedFile = <File>event.target.files[0];
    this.selectedFile = event.target.files[0];
  }

  uploadFile(imageFileName){
    let fd = new FormData();
    fd.append('image', this.selectedFile)
    this.http.post('http://' + environment.backEndIp + ':' + environment.backEndPort + '/scanReceipt',fd)
     .subscribe(res =>{
       console.log(res);
     })
  }



  //First attempt
  // getImage() {
  //   const options: CameraOptions = {
  //     quality: 100,
  //     destinationType: this.camera.DestinationType.FILE_URI,
  //     sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
  //   }
  
  //   this.camera.getPicture(options).then((imageData) => {
  //     this.imageURI = imageData;
  //   }, (err) => {
  //     console.log(err);
  //     this.presentToast(err);
  //   });
  // }

  // uploadFile() {
  //   let loader = this.loadingCtrl.create({
  //     content: "Uploading..."
  //   });
  //   loader.present();
  //   const fileTransfer: FileTransferObject = this.transfer.create();
  
  //   let options: FileUploadOptions = {
  //     fileKey: 'ionicfile',
  //     fileName: 'ionicfile',
  //     chunkedMode: false,
  //     mimeType: "image/jpeg",
  //     headers: {}
  //   }
  
  //   fileTransfer.upload(this.imageURI, 'http://192.168.0.7:8080/api/uploadImage', options)
  //     .then((data) => {
  //     console.log(data+" Uploaded Successfully");
  //     this.imageFileName = "http://192.168.0.7:8080/static/images/ionicfile.jpg"
  //     loader.dismiss();
  //     this.presentToast("Image uploaded successfully");
  //   }, (err) => {
  //     console.log(err);
  //     loader.dismiss();
  //     this.presentToast(err);
  //   });
  // }

  // presentToast(msg) {
  //   let toast = this.toastCtrl.create({
  //     message: msg,
  //     duration: 3000,
  //     position: 'bottom'
  //   });
  
  //   toast.onDidDismiss(() => {
  //     console.log('Dismissed toast');
  //   });
  
  //   toast.present();
  // }


  ngOnInit() {}

  }




