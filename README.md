# Virtualytics

> An expensing tool that lessens the burden of manual entry from the user, and provides valuable insights regarding the user's spending.

Virtualytics uses computer vision to parse receipts and bills, and quantifies this data so that it may be analyzed. The items from a receipt or a bill can be categorized, to allow more powerful analytical reporting. The user can track their spending at merchants or in categories over time to see if they are meeting their budgeting goals. By collecting data from different merchants, users can query the systemt to see which merchants sell which items, and who sells it the cheapest.

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

Google Vision API information can be [viewed on their site here](https://cloud.google.com/vision/docs/before-you-begin). An account should be created for use, as calling the API requires a unique access token.

- **NOTE** to prevent overloading a single billing account, where possible every development environment should use its own token

Google Vision API can be executed VIA code, or using http requests (using cUrl, etc). Further information and documentation on usage can be accessed from the linked site.

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
