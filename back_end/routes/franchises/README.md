# Franchises

A franchise is the company which owns a location.

```sh
{
    "_id": string.
    "name": string,
    "__v": number
}
```

`_id` Unique identifier for the franchise. Non-modifiable.

`name` Unique name for the franchise. Non-modifiable.

`__v` Version of the franchise. Non-modifiable.

## /franchises

### GET

> Get all franchises.

#### Example Request

```sh
url: http://127.0.0.1:8080/franchises
```

#### Example Responnse

```sh
{
    "franchises": [
        {
            "_id": "5db62f14daeeec4704e6ba1b",
            "name": "Walmart",
            "__v": 0
        },
        {
            "_id": "5db62f14daeeec4704e6ba1c",
            "name": "Loblaws",
            "__v": 0
        }
    ]
}
```

### POST

> Creates a new franchise.

#### Example Request

```sh
url: http://127.0.0.1:8080/franchises,
body: {
    "franchise": {
        "name": "Home Depot"
    }
}
```

#### Example Response

```sh
{
    "franchise": {
        "_id": "5db62f14daeeec4704e6ba1f",
        "name": "Home Depot",
        "__v": 0
    }
}
```

## /franchises/:_id

### GET

> Get a single franchise.

#### Example Request

```sh
url: http://127.0.0.1:8080/franchises/5db62f14daeeec4704e6ba1f
```

#### Example Response

```sh
{
    "franchise": {
        "_id": "5db62f14daeeec4704e6ba1f",
        "name": "Home Depot",
        "__v": 0
    }
}
```