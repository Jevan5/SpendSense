# LocationItems

A location item is an item that has recently been sold at a location.

```sh
{
    "_id": string,
    "_locationId": string,
    "_receiptItemId": string,
    "lastPurchased": Date,
    "__v": number
}
```

## /locationItems

### GET

> Get all location items.

#### Example Request

```sh
url: http://127.0.0.1:8080/locationItems
```

#### Example Response

```sh
{
    "locationItems": [
        {
            "_id": "5db62f14daeeec4704e6ba1f",
            "_locationId": "5db62f14daeeec4704e6ba10",
            "_receiptItemId": "5db62f14daeeec4704e6ba1c",
            "lastPurchased": "2018-03-22",
            "__v": 0
        },
        {
            "_id": "5db62f14daeeec4704e6ba1d",
            "_locationId": "5db62f14daeeec4704e6ba1b",
            "_receiptItemId": "5db62f14daeeec4704e6ba1e",
            "lastPurchased": "2018-03-25",
            "__v": 0
        }
    ]
}
```