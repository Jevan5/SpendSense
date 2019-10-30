# Receipts

A receipt contains receipt items.

```sh
{
    "_id": string,
    "_userId": string,
    "date": Date,
    "__v": number
}
```

`_id` Unique identifier for the receipt item. Non-modifiable.

`_userId` _id of the user which this receipt item belongs to. Non-modifiable.

`date` Date the receipt was made.

`__v` Version of the receipt.

## /receipts

### GET

> Get all receipts for the authorized user.

#### Example Request

```sh
url: http://127.0.0.1:8080/receipts
```

#### Example Response

```sh
{
    "receipts": [
        {
            "_id": "5db62f14daeeec4704e6ba1b",
            "_userId": "3db62f14daeeec4704e6ba1c",
            "date": "2017-02-22",
            "__v": 0
        },
        {
            "_id": "5db62f14daeeec4704e6ba1d",
            "_userId": "3db62f14daeeec4704e6ba1c",
            "date": "2018-05-17",
            "__v": 0
        }
    ]
}
```

### POST

> Create an empty receipt.

#### Example Request

```sh
url: http://127.0.0.1:8080/receipts,
body: {
    "receipt": {
        "_userId": "3db62f14daeeec4704e6ba1c",
        "date": "2018-05-17"
    }
}
```

#### Example Response

```sh
{
    "receipt": {
        "_id": "5db62f14daeeec4704e6ba1d",
        "_userId": "3db62f14daeeec4704e6ba1c",
        "date": "2018-05-17",
        "__v": 0
    }
}
```

## /receipts/:_id

### GET

> Get a single receipt.

#### Example Request

```sh
url: http://127.0.0.1:8080/receipts/5db62f14daeeec4704e6ba1d
```

#### Example Response

```sh
{
    "receipt": {
        "_id": "5db62f14daeeec4704e6ba1d",
        "_userId": "3db62f14daeeec4704e6ba1c",
        "date": "2018-05-17",
        "__v": 0
    }
}
```

### PUT

> Updates an existing receipt.

#### Example Request

```sh
url: http://127.0.0.1:8080/receipts/5db62f14daeeec4704e6ba1d,
body: {
    "receipt": {
        "date": "2018-06-17"
    }
}
```

#### Example Response

```sh
{
    "receipt": {
        "_id": "5db62f14daeeec4704e6ba1d",
        "_userId": "3db62f14daeeec4704e6ba1c",
        "date": "2018-06-17",
        "__v": 1
    }
}
```

### DELETE

> Deletes an existing receipt.

Deletes all associated receipt items as well, and those location items that were associated with the deleted receipt items.

#### Example Request

```sh
url: http://127.0.0.1:8080/receipts/5db62f14daeeec4704e6ba1d
```

#### Example Response

```sh
{}
```