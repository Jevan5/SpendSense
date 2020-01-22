import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { Storage, IonicStorageModule } from '@ionic/storage';
  

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from 'src/app/app.component';
import { AppRoutingModule } from 'src/app/app-routing.module';

import { HomeComponent } from 'src/app/pages/home/home.component';
import { LoginComponent } from 'src/app/pages/login/login.component';
import { ProfileComponent } from 'src/app/pages/profile/profile.component';
import { ReportsComponent } from 'src/app/pages/reports/reports.component';
import { SearchComponent } from 'src/app/pages/search/search.component';


import { UploadImageComponent } from './pages/upload-image/upload-image.component';

import { File } from '@ionic-native/File/ngx';
import { Camera } from '@ionic-native/Camera/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { ManualEntryComponent } from './pages/manual-entry/manual-entry.component';
import { DropdownSearchComponent } from './components/dropdown-search/dropdown-search.component';
import { CreateFranchiseComponent } from './pages/create-franchise/create-franchise.component';
import { CreateLocationComponent } from './pages/create-location/create-location.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    ProfileComponent,
    ManualEntryComponent,
    UploadImageComponent,
    ReportsComponent,
    SearchComponent,
    ManualEntryComponent,
    DropdownSearchComponent,
    CreateFranchiseComponent,
    CreateLocationComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'manual-entry', component: ManualEntryComponent},
      { path: 'upload-image', component: UploadImageComponent},
      { path: 'reports', component: ReportsComponent },
      { path: 'search', component: SearchComponent },
      { path: 'manual-entry', component: ManualEntryComponent },
      { path: 'create-franchise', component: CreateFranchiseComponent },
      { path: 'create-location', component: CreateLocationComponent }
    ]),
    HttpClientModule,
    NgbModule,
    FormsModule,
    // AutoCompleteModule,
    IonicStorageModule.forRoot()
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: Storage, useValue: new Storage({}) },
    //FileTransfer,
    //FileUploadOptions,
    //FileTransferObject,
    File,
    Camera,
    WebView
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
