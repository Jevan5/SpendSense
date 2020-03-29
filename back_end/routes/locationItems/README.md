# LocationItems

A location item is an item that has recently been sold at a location.

```sh
{
    "_id": string,
    "_locationId": string,
    "name": string,
    "tag": string,
    "price": number,
    "__v": number
}
```

`_id` Unique identifier for the location item. Non-modifiable.

`_locationId` _id of the location which the location item was purchased at. Non-modifiable.

`name` Name of the item purchased. Non-modifiable.

`tag` Tag of the item purchased. Non-modifiable.

`price` Price the item was purchased for. Non-modifiable.

## /locationItems

### GET

> Get all location items that match a name.

#### Example Request

```sh
url: http://127.0.0.1:8080/locationItems/?name=banana
```

#### Example Response

```sh
{
    "locationItems": [
        {
            "_id": "5db62f14daeeec4704e6ba1f",
            "_locationId": "5db62f14daeeec4704e6ba10",
            "name": "banana",
            "tag": "food",
            "price": 3.25,
            "__v": 0
        },
        {
            "_id": "5db62f14daeeec4704e6ba1d",
            "_locationId": "5db62f14daeeec4704e6ba1b",
            "name": "banana",
            "tag": "food",
            "price": 3.5,
            "__v": 0
        }
    ]
}
```