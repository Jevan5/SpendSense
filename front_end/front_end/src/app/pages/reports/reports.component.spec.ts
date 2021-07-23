import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';

import { ReportsComponent } from './reports.component';

import { TestVariables } from 'src/app/testing/test-variables';
import { MockModelService } from 'src/app/services/model/mock-model.service';
import { MockAuthenticationService } from 'src/app/services/authentication/mock-authentication.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ModelService } from 'src/app/services/model/model.service';

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;
  let mockAuthenticationService: MockAuthenticationService;

  beforeEach((done) => {
    var user = TestVariables.getUser();

    var mockModelService = new MockModelService();
    mockModelService.save(user).then((u) => {
      mockAuthenticationService = new MockAuthenticationService(u);

      return TestBed.configureTestingModule({
        declarations: [ ReportsComponent ],
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
          }
        ]
      }).compileComponents();
    }).then(() => {
      fixture = TestBed.createComponent(ReportsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      done();
    }).catch((err) => {
      fail(err);
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
