# ReceiptItems

A receipt item is an item on a receipt.

```sh
{
    "_id": string,
    "_receiptId": string,
    "_systemItemId": string,
    "name": string,
    "price": number,
    "quantity": number,
    "__v": number
}
```

`_id` Unique identifier for the receipt item. Non-modifiable.

`_receiptId` _id of the receipt which this receipt item is a part of. Non-modifiable.

`_systemItemId` _id of the system item which this receipt item is associated with.

`name` Text that appears on the receipt for this receipt item.

`price` Price that appears on the receipt for this receipt item.

`quantity` Quantity that appears on the receipt for this receipt item.

`__v` Version number of the receipt item. Non-modifiable.

## /receiptItems

### GET

> Gets all the receipt items for the authorized user.

#### Example Request

```sh
url: http://127.0.0.1:8080/receiptItems
```

#### Example Response

```sh
{
    "receiptItems": [
        {
            "_id": "5db62f14daeeec4704e6ba1b",
            "receiptId": "5db62f14daeeec4704e6ba19",
            "systemItemId": "5db62f14daeeec4704e6ba1a",
            "name": "banana",
            "price": 1.5,
            "quantity": 6
        },
        {
            "_id": "5db62f14daeeec4704e6ba1c",
            "receiptId": "5db62f14daeeec4704e6ba1d",
            "systemItemId": "5db62f14daeeec4704e6ba1e",
            "name": "apple",
            "price": 1.2,
            "quantity": 4
        }
    ]
}
```

### POST

> Adds a receipt item to a receipt.

#### Example Request

```sh
url: http://127.0.0.1:8080/receiptItems,
body: {
    "receiptItem": {
        "receiptId": "5db62f14daeeec4704e6ba19",
        "systemItemId": "5db62f14daeeec4704e6ba1a",
        "name": "banana",
        "price": 15,
        "quantity": 10
    }
}
```

#### Example Response

```sh
url: http://127.0.0.1:8080/receiptItems,
body: {
    "receiptItem": {
        "_id": "5db62f14daeeec4704e6ba1b",
        "_receiptId": "5db62f14daeeec4704e6ba19",
        "_systemItemId": "5db62f14daeeec4704e6ba1a",
        "name": "banana",
        "price": 15,
        "quantity": 10,
        "__v": 0
    }
}
```

## /receiptItems/:_id

### GET

> Get a single receipt item.

#### Example Request

```sh
url: http://127.0.0.1:8080/receiptItems/5db62f14daeeec4704e6ba1b
```

#### Example Response

```sh
{
    "receiptItem": {
        "_id": "5db62f14daeeec4704e6ba1b",
        "_receiptId": "5db62f14daeeec4704e6ba19",
        "_systemItemId": "5db62f14daeeec4704e6ba1a",
        "name": "banana",
        "price": 15,
        "quantity": 10,
        "__v": 0
    }
}
```

### PUT

> Updates an existing receipt item.

#### Example Request

```sh
url: http://127.0.0.1:8080/receiptItems/5db62f14daeeec4704e6ba1b,
body: {
    "receiptItem": {
        "_systemItemId": "6ab62f14daeeec4704e6ba1a",
        "name": "watermelon",
        "price": 13,
        "quantity": 2
    }
}
```

#### Example Response

```sh
{
    "receiptItem": {
        "_id": "5db62f14daeeec4704e6ba1b",
        "_receiptId": "5db62f14daeeec4704e6ba19",
        "_systemItemId": "6ab62f14daeeec4704e6ba1a",
        "name": "watermelon",
        "price": 13,
        "quantity": 2,
        "__v": 1
    }
}
```

### DELETE

> Deletes an existing receipt item.

Deletes all associated location items as well.

#### Example Request

```sh
url: http://127.0.0.1:8080/receiptItems/5db62f14daeeec4704e6ba1b
```

#### Example Response

```sh
{}
```