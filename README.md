# Virtualytics

> An expensing tool that lessens the burden of manual entry from the user, and provides valuable insights regarding the user's spending.

Virtualytics uses computer vision to parse receipts and bills, and quantifies this data so that it may be analyzed. The items from a receipt or a bill can be categorized, to allow more powerful analytical reporting. The user can track their spending at merchants or in categories over time to see if they are meeting their budgeting goals. By collecting data from different merchants, users can query the systemt to see which merchants sell which items, and who sells it the cheapest.

## Dependencies

### Node.js (Latest stable, 12.13.0)

https://nodejs.org/en/

### MongoDB (Latest stable, 4.2.1)

https://www.mongodb.com/download-center/community

## Using Google Vision API

Google Vision API information can be [viewed on their site here](https://cloud.google.com/vision/docs/before-you-begin). An account should be created for use, as calling the API requires a unique access token.

- **NOTE** to prevent overloading a single billing account, where possible every development environment should use its own token

Google Vision API can be executed VIA code, or using http requests (using cUrl, etc). Further information and documentation on usage can be accessed from the linked site.

## Set-up Development Environment

### Front End

Navigate to the front end directory, update your dependencies, and start the ionic server:

```sh
cd <clone_directory>/front_end
npm i
cd front_end
npm i
ionic serve
```

### Back End

Navigate to the bin subfolder in the MongoDB directory, and start the MongoDB server:

```sh
cd <MongoDB_installation>/MongoDB/Server/<version>/bin
mongod
```

Navigate to the back end directory, update your dependencies, and start the node server:

```sh
cd <clone_directory>/back_end
npm i
nodemon server.js <mode>
```

`mode` Is either prod|dev|test. It is possible to have one instance of each mode running at the same time, since they each serve off different ports and connect to different databases.

#### Google Application Credentials

Before running the backend server, for receipt scanning functionality your local variable for `GOOGLE_APPLICATION_CREDENTIALS` must be set to your credentials file.

For more information for local setup, or how to generate your credentials file, check the Google API documentation, [see here](https://cloud.google.com/vision/docs/quickstart-client-libraries).

### Secrets.json

In the root of the project (same location as this README), a `secrets.json` file is required, with the following info (values must be filled out locally):

```json
{
    "emailAddress": <admin_email>,
    "emailPassword": <admin_email_password>,
    "visionApiToken": <google_api_token>
}
```

## Contributing

### Testing

Before submitting changes, make sure the tests for the backend and frontend are working. Try to implement as much test coverage as you can for your code.

#### Back End

Run the following command in the back end directory to run tests:

```sh
npm test
```

#### Front End

The front end contains tests cases which query the backend, so ensure the backend is running a dev instance:

```sh
nodemon server.js dev
```

Run the following command in the front end directory to run tests:

```sh
ng test
```

### Ionic Development

Create re-usable components by running:

```sh
ionic g component components/<component-name>
```

`<component-name>` Is the name of the new component, all lowercase and hyphenated.

Create injectible services by running:

```sh
ionic g service services/<service-name>/<service-name>
```

`<service-name>` Is the name of the new service, all lowercase and hyphenated.

Create new pages by running:

```sh
ionic g component pages/<page-name>
```

`<page-name>` Is the name of the new page, all lowercase and hyphenated.

### Express Development

Create a new model by creating a .js file for it in models/:

```sh
type nul > models/<modelName>.js
```

`<modelName>` Is the model's singular name in camel-case.

Create a new route by creating a directory and file for it in routes/:

> If the route is for a model, make sure the name is pluralized.

```sh
mkdir routes/<routeName>
type nul > routes/<routeName>/<routeName>.js
```

### Pushing

Clone the repository locally.

```sh
git clone git@github.com:Jevan5/Virtualytics.git
```

Pull the current development branch.

```sh
git pull origin develop
```

Make your changes, and include meaningful commit messages.

```sh
git commit
```

Push to your working branch.

```sh
git push origin <working branch>
```

Submit a pull-request to the develop branch in GitHub, and add the appropriate approvers.

### Documentation

Use JsDoc to document Javascript and Typescript code.

## Bug tracking

If you find a bug, please create an issue for it in GitHub.

## Authors

|Name|Email|
|:-------|:----|
|Joshua Evans|jevan5@uwo.ca|
|Kevin Freeman|kfreem4@uwo.ca|
|Aaron Yung|ayung7@uwo.ca|
