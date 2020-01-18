# CommonTags

Many system items can exist with the same name, all having different tags. A common tag is a pairing of the name that many system items can share, with it's most commonly paired tag.

```sh
{
    "_id": string,
    "tag": string,
    "name": string,
    "__v": number
}
```

`_id` Unique identifier for the common tag. Non-modifiable.

`tag` Most common tag associated with the name. Non-modifiable.

`name` Common name of an item. Non-modifiable. Unique.

`__v` Version number of the common tag. Non-modifiable.

## /commonTags

### GET

> Get all common tags.

#### Example Request

```sh
url: http://127.0.0.1:8080/commonTags
```

#### Example Response

```sh
{
    "commonTags": [
        {
            "_id": "5db62f14daeeec4704e6ba1b",
            "tag": "food",
            "name": "banana",
            "__v": 0
        },
        {
            "_id": "5db62f14daeeec4704e6ba1c",
            "tag": "hardware",
            "name": "arduino board",
            "__v": 0
        }
    ]
}
```