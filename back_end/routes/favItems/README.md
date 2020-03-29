# FavItems

A favourite item is a link that a user has made between a receipt item and a system item. Useful for automatically tagging new receipt items with a system item.

```sh
{
    "_id": string,
    "_userId": string,
    "_receiptItemId": string,
    "_systemItemId": string,
    "__v": number
}
```

`_id` Unique identifier for the favourited item. Non-modifiable.

`_userId` _id of the user who favourited the item. Non-modifiable. Paired with `_receiptItemId`, is unique.

`_receiptItemId` _id of the receipt item that has been favourited. Non-modifiable. Paired with `_receiptItemId`, is unique.

`_systemItemId` _id of the system item that has been favourited. Non-modifiable.

`__v` Version of the favourited item.

## /favItems

### GET

> Gets all favourited items for the authorized user.

#### Example Request

```sh
url: http://127.0.0.1:8080/favItems
```

#### Example Response

```sh
{
    "favItems": [
        {
            "_id": "5db62f14daeeec4704e6ba15",
            "_userId": "5db62f14daeeec4704e6ba16",
            "_receiptItemId": "5db62f14daeeec4704e6ba17",
            "_systemItemId": "5db62f14daeeec4704e6ba18",
            "__v": 0
        },
        {
            "_id": "5db62f14daeeec4704e6ba10",
            "_userId": "5db62f14daeeec4704e6ba16",
            "_receiptItemId": "5db62f14daeeec4704e6ba1a",
            "_systemItemId": "5db62f14daeeec4704e6ba1b",
            "__v": 0
        }
    ]
}
```

### POST

> Favourites an item for the authorized user.

#### Example Request

```sh
url: http://127.0.0.1:8080/favItems,
body: {
    "favItem": {
        "_receiptItemId": "5db62f14daeeec4704e6ba1c",
        "_systemItemId": "5db62f14daeeec4704e6ba18"
    }
}
```

#### Example Respones

```sh
{
    "favItem": {
        "_id": "5db62f14daeeec4704e6ba1e",
        "_userId": "5db62f14daeeec4704e6ba16",
        "_receiptItemId": "5db62f14daeeec4704e6ba1c",
        "_systemItemId": "5db62f14daeeec4704e6ba18",
        "__v": 0
    }
}
```

## /favItems/:_id

### GET

> Gets a single favourited item for the authorized user.

#### Example Request

```sh
url: http://127.0.0.1:8080/favItems/5db62f14daeeec4704e6ba1e
```

#### Example Response

```sh
{
    "favItem": {
        "_id": "5db62f14daeeec4704e6ba1e",
        "_userId": "5db62f14daeeec4704e6ba16",
        "_receiptItemId": "5db62f14daeeec4704e6ba1c",
        "_systemItemId": "5db62f14daeeec4704e6ba18",
        "__v": 0
    }
}
```

### DELETE

> Un-favourites a favourite item for the authorized user.

#### Example Request

```sh
url: http://127.0.0.1:8080/favItems/5db62f14daeeec4704e6ba1e
```

#### Example Response

```sh
{}
```