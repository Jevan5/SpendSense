# SystemItems

A  system item groups common receipt items, by giving them a common name and a categorization tag.

```sh
{
    "_id": string,
    "tag": string,
    "name": string,
    "__v": number
}
```

`_id` Unique identifier for the system item. Non-modifiable.

`tag` Category for the item. Non-modifiable. Paired with `name`, is unique.

`name` Common name for the item. Non-modifiable. Paired with `tag`, is unique.

`__v` Version number of the system item. Non-modifiable.

## /systemItems

### GET

> Get all system items.

#### Example Request

```sh
url: http://127.0.0.1:8080/systemItems
```

#### Example Response

```sh
{
    "systemItems": [
        {
            "_id": "5db62f14daeeec4704e6ba1b",
            "tag": "food",
            "name": "banana",
            "__v": 0
        },
        {
            "_id": "4db62f14daeeec4704e6ba1c",
            "tag": "appliance",
            "name": "monitor",
            "__v": 0
        }
    ]
}
```

### POST

> Create a new system item.

#### Example Request

```sh
url: http://127.0.0.1:8080/systemItems,
body: {
    "systemItem": {
        "tag": "food",
        "name": "apple"
    }
}
```

#### Example Response

```sh
{
    "systemItem": {
        "_id": "5db62f14daeeec4704e6ba1d",
        "tag": "food",
        "name": "apple",
        "__v": 0
    }
}
```

## /systemItems/:_id

### GET

> Gets a single system item.

#### Example Request

```sh
url: http://127.0.0.1:8080/systemItems/5db62f14daeeec4704e6ba1b
```

#### Example Response

```sh
{
    "systemItem": {
        "_id": "5db62f14daeeec4704e6ba1b",
        "tag": "food",
        "name": "banana",
        "__v": 0
    }
}
```