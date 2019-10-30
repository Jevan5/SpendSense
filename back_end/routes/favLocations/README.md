# FavLocations

A user can favourite a location.

```sh
{
    "_id": string,
    "_userId": string,
    "_locationId": string,
    "__v": number
}
```

`_id` Unique identifier for the favourite location. Non-modifiable.

`_userId` _id of the user who has favourited the location. Non-modifiable.

`_locationId` _id of the location that has been favourited. Non-modifiable.

`__v` Version of the favourite location.

## /favLocations

### GET

> Gets all favourite locations of the user.

#### Example Request

```sh
url: http://127.0.0.1:8080/favLocations
```

#### Example Response

```sh
{
    "favLocations": [
        {
            "_id": "5db62f14daeeec4704e6ba1d",
            "_userId": "5db62f14daeeec4704e6ba1c",
            "_locationId": "5db62f14daeeec4704e6ba1e",
            "__v": 0
        },
        {
            "_id": "5db62f14daeeec4704e6ba10",
            "_userId": "5db62f14daeeec4704e6ba1c",
            "_locationId": "5db62f14daeeec4704e6ba12",
            "__v": 0
        }
    ]
}
```

### POST

> Creates a favourited location for the authorized user.

#### Example Request

```sh
url: http://127.0.0.1:8080/favLocations,
body: {
    "favLocation": {
        "_locationId": "5db62f14daeeec4704e6ba13"
    }
}
```

#### Example Response

```sh
{
    "favLocation": {
        "_id": "5db62f14daeeec4704e6ba15",
        "_userId": "5db62f14daeeec4704e6ba1c",
        "_locationId": "5db62f14daeeec4704e6ba13",
        "__v": 0
    }
}
```

## /favLocations/:_id

### GET

> Gets a single favourited location for the authorized user.

#### Example Request

```sh
url: http://127.0.0.1:8080/favLocations/5db62f14daeeec4704e6ba15
```

#### Example Response

```sh
{
    "favLocation": {
        "_id": "5db62f14daeeec4704e6ba15",
        "_userId": "5db62f14daeeec4704e6ba1c",
        "_locationId": "5db62f14daeeec4704e6ba13",
        "__v": 0
    }
}
```

### DELETE

> Deletes a single favourited location for the authorized user.

#### Example Request

```sh
url: http://127.0.0.1:8080/favLocations/5db62f14daeeec4704e6ba15
```

#### Example Response

```sh
{}
```