# Locations

A location is where a franchise is located.

```sh
{
    "_id": string,
    "_franchiseId": string,
    "address": string,
    "city": string,
    "country": string,
    "__v": number
}
```

`_id` Unique identifier for the location. Non-modifiable.

`_franchiseId`_id of the franchise which this location belongs to. Non-modifiable.

`address` Address of the location. Non-modifiable.

`city` City of the location. Non-modifiable.

`country` Country of the location. Non-modifiable.

`__v` Version of the location. Non-modifiable.

## /locations

### GET

> Get a single location.

#### Example Request

```sh
url: http://127.0.0.1:8080/locations
```

#### Example Response

```sh
{
    "locations": [
        {
            "_id": "5db62f14daeeec4704e6ba1d",
            "_franchiseId": "6db62f14daeeec4704e6ba1e",
            "address": "1300 Richmond Street",
            "city": "London",
            "country": "Canada"
        },
        {
            "_id": "5db62f14daeeec4704e6ba1e",
            "franchiseId": "5db62f14daeeec4704e6ba1f",
            "address": "100 Sparks Street",
            "city": "Ottawa",
            "country": "Canada"
        }
    ]
}
```

### POST

> Create a location.

#### Example Request

```sh
url: http://127.0.0.1:8080/locations,
body: {
    "location": {
        "_franchiseId": "5db62f14daeeec4704e6ba1f",
        "address": "600 Windermere Road",
        "city": "London",
        "country": "Canada"
    }
}
```

#### Example Response

```sh
{
    "location": {
        "_id": "5db62f14daeeec4704e6ba10",
        "_franchiseId": "5db62f14daeeec4704e6ba1f",
        "address": "600 Windermere Road",
        "city": "London",
        "country": "Canada",
        "__v": 0
    }
}
```

## /locations/:_id

### GET

> Get a single location.

#### Example Request

```sh
url: http://127.0.0.1:8080/locations/5db62f14daeeec4704e6ba10
```

#### Example Response

```sh
{
    "location": {
        "_id": "5db62f14daeeec4704e6ba10",
        "_franchiseId": "5db62f14daeeec4704e6ba1f",
        "address": "600 Windermere Road",
        "city": "London",
        "country": "Canada",
        "__v": 0
    }
}
```