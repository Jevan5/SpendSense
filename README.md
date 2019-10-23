# Virtualytics

> An expensing tool that lessens the burden of manual entry from the user, and provides valuable insights regarding the user's spending.

Virtualytics uses computer vision to parse receipts and bills, and quantifies this data so that it may be analyzed. The items from a receipt or a bill can be categorized, to allow more powerful analytical reporting. The user can track their spending at merchants or in categories over time to see if they are meeting their budgeting goals. By collecting data from different merchants, users can query the systemt to see which merchants sell which items, and who sells it the cheapest.

## Dependencies

### Node.js (Latest stable, 12.13.0)

https://nodejs.org/en/

### MongoDB (Latest stable, 4.2.1)

https://www.mongodb.com/download-center/community

## Installation

### Android

TODO

### iOS

TODO

### Windows

TODO

## Documentation

TODO

### Using Google Vision API

## Set-up Development Environment

### Front End

Navigate to the front end directory, update your dependencies, and start the ionic server:

```sh
cd <clone_directory>/front_end
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
# mode is either 'test' or 'prod'
node server.js <mode>
```

## Contributing

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

## Bug tracking

If you find a bug, please create an issue for it in GitHub.

## Authors

|Name|Email|
|:-------|:----|
|Joshua Evans|jevan5@uwo.ca|
|Kevin Freeman|kfreem4@uwo.ca|
|Aaron Yung|ayung7@uwo.ca|
