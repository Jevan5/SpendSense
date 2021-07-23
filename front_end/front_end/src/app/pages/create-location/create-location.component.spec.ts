import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';

import { CreateLocationComponent } from './create-location.component';

import { TestVariables } from 'src/app/testing/test-variables';
import { MockModelService } from 'src/app/services/model/mock-model.service';
import { MockAuthenticationService } from 'src/app/services/authentication/mock-authentication.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ModelService } from 'src/app/services/model/model.service';
import { MockLoadingController } from 'src/app/testing/mock-loadingController';
import { MockToastController } from 'src/app/testing/mock-toastController';

describe('CreateLocationComponent', () => {
  let component: CreateLocationComponent;
  let fixture: ComponentFixture<CreateLocationComponent>;
  let mockAuthenticationService: MockAuthenticationService;

  beforeEach((done) => {
    var user = TestVariables.getUser();

    var mockModelService = new MockModelService();
    mockModelService.save(user).then((u) => {
      mockAuthenticationService = new MockAuthenticationService(u);

      return TestBed.configureTestingModule({
        declarations: [ CreateLocationComponent ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [HttpClientModule],
        providers: [
          {
            provide: Storage,
            useValue: new Storage({})
          },
          {
            provide: AuthenticationService,
            useValue: mockAuthenticationService
          },
          {
            provide: ModelService,
            useValue: mockModelService
          },
          {
            provide: MockLoadingController,
            useValue: new MockLoadingController()
          },
          {
            provide: MockToastController,
            useValue: new MockToastController()
          }
        ]
      }).compileComponents();
    }).then(() => {
      fixture = TestBed.createComponent(CreateLocationComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      done();
    }).catch((err) => {
      fail(err);
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
