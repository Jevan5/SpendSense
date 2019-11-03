import { CUSTOM_ELEMENTS_SCHEMA, Injector } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule, HttpClient, HttpHandler, ɵHttpInterceptingHandler } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { ProfileComponent } from './profile.component';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ModelService } from 'src/app/services/model/model.service';
import { User } from 'src/app/models/user/user';

import { TestVariables } from 'src/app/testing/test-variables';
import { MockAuthenticationService } from 'src/app/services/authentication/mock-authentication.service';
import { MockModelService } from 'src/app/services/model/mock-model.service';

describe('ProfileComponent', () => {
  var component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let mockAuthenticationService: MockAuthenticationService;

  beforeEach((done) => {
    var user = new User();
    user.setValues({
      __v: 0,
      username: 'someUsername',
      password: 'somePassword',
      email: 'someEmail@server.endpoint',
      firstName: 'theirFirstName',
      lastName: 'theirLastName',
      salt: 'someSalt',
      authentication: '',
      changingEmail: '',
      changingPassword: ''
    });

    var mockModelService = new MockModelService();
    mockModelService.save(user).then((u) => {
      mockAuthenticationService = new MockAuthenticationService(u);

      TestBed.configureTestingModule({
        declarations: [ ProfileComponent ],
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
      }).compileComponents().then(() => {
        fixture = TestBed.createComponent(ProfileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        done();
      }).catch((err) => {
          fail(err);
      });
    });
  });

  it('should create', (done) => {
    expect(component).toBeTruthy();
    done();
  });

  it('should not be editable on open', (done) => {
    expect(component.editing).toBeFalsy();
    done();
  });

  it('should be able to toggle editing', (done) => {
    expect(component.editing).toBeFalsy();
    component.toggleEditing();
    expect(component.editing).toBeTruthy();
    component.toggleEditing();
    expect(component.editing).toBeFalsy();
    done();
  });

  it('should use logged in user as model', (done) => {
    expect(component.model.username).toEqual(component.authenticationService.getUser().getValue('username'));
    expect(component.model.email).toEqual(component.authenticationService.getUser().getValue('email'));
    expect(component.model.firstName).toEqual(component.authenticationService.getUser().getValue('firstName'));
    expect(component.model.lastName).toEqual(component.authenticationService.getUser().getValue('lastName'));
    done();
  });

  it('should be able to cancel to reset the model and stop editing', (done) => {
    component.editing = true;
    component.model.username = 'usernameInEdit';
    component.model.email = 'emailInEdit';
    component.model.firstName = 'firstNameInEdit';
    component.model.lastName = 'lastNameInEdit';

    component.cancel();

    expect(component.model.username).toEqual(component.authenticationService.getUser().getValue('username'));
    expect(component.model.email).toEqual(component.authenticationService.getUser().getValue('email'));
    expect(component.model.firstName).toEqual(component.authenticationService.getUser().getValue('firstName'));
    expect(component.model.lastName).toEqual(component.authenticationService.getUser().getValue('lastName'));
    expect(component.editing).toEqual(false);

    done();
  });

  it('should fail save if the email is empty', (done) => {
    component.model.email = '';
    component.save().then(() => {
      fail("'save()' should have failed with empty email");
    }).catch((err) => {
      expect(component.hasErrored()).toBeTruthy();
      done();
    });
  });

  it('should update the logged in user if saved properly', (done) => {
    var newEmail = 'aNewEmail';
    var newFirstName = 'aNewFirstName';
    var newLastName = 'aNewLastName';

    component.model.email = newEmail;
    component.model.firstName = newFirstName;
    component.model.lastName = newLastName;

    component.save().then((user) => {
      return component.modelService.getAll(User);
    }).then((users) => {
      expect(users[0].getValue('firstName')).toEqual(newFirstName);
      expect(users[0].getValue('lastName')).toEqual(newLastName);
      expect(users[0].getValue('changingEmail')).toEqual(newEmail);
      
      done();
    }).catch((err) => {
      fail(err);
    });
  });
});
