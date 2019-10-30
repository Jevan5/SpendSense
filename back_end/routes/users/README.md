# Users

A user is the entry point into the system. Without a registered user account, you cannot perform any queries on the system, except for creating and registering a user account.

```sh
{
    "_id": string,
    "email": string,
    "firstName": string,
    "lastName": string,
    "username": string,
    "password": string,
    "salt": string,
    "authentication": string,
    "changingPassword": string,
    "changingEmail": string,
    "__v": number
}
```

`_id` Unique identifier for the user. Non-modifiable.

`email` Unique email for the user. Useful for password resets. Not case-sensitive, stored as lower-case.

`firstName` First name of the user.

`lastName` Last name of the user.

`username` Unique identifier for the user. Non-modifiable. Used for authorization. Not case-sensitive, stored as lower-case.

`password` Hash value of the user's plaintext password concatenated with the user's salt. Plaintext of password must be at least 10 characters long.

`salt` Randomly generated salt for authentication and password hashing. Non-modifiable.

`authentication` Hash value of the last authentication string sent to the user's email concatenated with the user's salt. Once authentication occurs, the value is set to empty.

`changingPassword` Hash value of the new password that the user requested concatenated with the user's salt. Overwrites `password` once authentication occurs, then is set to empty.

`changingEmail` The new email that the user requested. Overwrites `email` once authentication occurs, then is set to empty.

`__v` Version number of the user. Non-modifiable.

## /users

### GET

> Gets the authorized user.

#### Example Request
```sh
url: http://127.0.0.1:8080/users
```

#### Example Response
```sh
{
    "user": {
        "_id": "5db62f14daeeec4704e6ba1b",
        "email": "example@example.com",
        "firstName": "Josh",
        "lastName": "Evans",
        "username": "jevan5",
        "password": "f60392a8446daad1fbccf1ff00bb45637ec4e024364605521b4540188b14d1aa587b03a03e804283faa642c92a77272f88f590e92a060d90112457d752d7301b",
        "salt": "405c8abd202468fd5ea05cb209084b26fbc7217d27cd398cbf",
        "authentication": "",
        "changingPassword": "",
        "changingEmail": "",
        "__v": 0
    }
}
```

### POST

> Create a user.

Creates a new user, and emails the authentication code for completing registration to the email address provided.

#### Example Request

```sh
url: http://127.0.0.1:8080/users,
body: {
    "user": {
        "email": 'Example@example.com',
        "firstName": 'Josh',
        "lastName": 'Evans',
        "username": 'Jevan5',
        "password": 'example_password'
    }
}
```

`password` In plaintext form.

#### Example Response

```sh
{
    "user": {
        "_id": "5db62f14daeeec4704e6ba1b",
        "email": "example@example.com",
        "firstName": "Josh",
        "lastName": "Evans",
        "username": "jevan5",
        "password": "f60392a8446daad1fbccf1ff00bb45637ec4e024364605521b4540188b14d1aa587b03a03e804283faa642c92a77272f88f590e92a060d90112457d752d7301b",
        "salt": "405c8abd202468fd5ea05cb209084b26fbc7217d27cd398cbf",
        "authentication": "f882ced2949a686eae0ecb5913a4dc07513868c3f402d2980f8be4d261ae1e87e4caf4c96365555c7878ac4f064af8062a49e81e02b3d5b287ccfc8195206f6a",
        "changingPassword": "",
        "changingEmail": "",
        "__v": 0
    }
}
```

### PUT

> Requests to change the authorized user's password.

The user might not have their _id since they cannot login because they don't know their password, so that's why this PUT method does not require an _id parameter.

**NOTE:** Authorization header is not needed.

#### Example Request

```sh
url: http://127.0.0.1:8080/users,
body: {
    "user": {
        "username": "Jevan5",
        "changingPassword": "newPassword123"
    }
}
```

`changingPassword` New password the user would like to use. Will not be used until the user authenticates the request by clicking the link sent to their email.

#### Example Response

```sh
{
    "user": {
        "_id": "5db62f14daeeec4704e6ba1b",
        "email": "example@example.com",
        "firstName": "Josh",
        "lastName": "Evans",
        "username": "jevan5",
        "password": "f60392a8446daad1fbccf1ff00bb45637ec4e024364605521b4540188b14d1aa587b03a03e804283faa642c92a77272f88f590e92a060d90112457d752d7301b",
        "salt": "405c8abd202468fd5ea05cb209084b26fbc7217d27cd398cbf",
        "authentication": "f882ced2949a686eae0ecb5913a4dc07513868c3f402d2980f8be4d261ae1e87e4caf4c96365555c7878ac4f064af8062a49e81e02b3d5b287ccfc8195206f6a",
        "authentication": "9881ced2949a686eae0ecb5913a4dc07513868c3f402d2980f8be4d261ae1e87e4caf4c96365555c7878ac4f064af8062a49e81e02b3d5b287ccfc8195205ea",
        "changingPassword": "5881ced2949a686eae0ecb5913a4dc07513868c3f402d2980f8be4d261ae1e87e4caf4c96365555c7878ac4f064af8062a49e81e02b3d5b287ccfc8195205f0",
        "changingEmail": "",
        "__v": 1
    }
}
```

`authentication` New hashed authentication concatenated with the user's salt.
`changingPassword` Hashed password in the request body concatenated with the user's salt. Will overwrite the user's password once the request has been authenticated through the emailed link.

## /users/:id

### PUT

> Updates a user's information.

Updates all the user's modifiable information, except for the password.

#### Example Request

```sh
url: http://127.0.0.1:8080/users/5db62f14daeeec4704e6ba1b,
body: {
    "user": {
        "_id": "5db62f14daeeec4704e6ba1b",
        "firstName": "Michael",
        "lastName": "Scott",
        "changingEmail": "newEmail@example.com"
    }
}
```

`changingEmail` If this value differs from the current value of `changingEmail`, it will overwrite it and generate a new `authentication` value and send an authentication link to the new email. Once authenticated, `changingEmail` will overwrite  `email`, then be cleared.

#### Example Response

```sh
{
    "user": {
        "_id": "5db62f14daeeec4704e6ba1b",
        "email": "example@example.com",
        "firstName": "Michael",
        "lastName": "Scott",
        "username": "jevan5",
        "password": "f60392a8446daad1fbccf1ff00bb45637ec4e024364605521b4540188b14d1aa587b03a03e804283faa642c92a77272f88f590e92a060d90112457d752d7301b",
        "salt": "405c8abd202468fd5ea05cb209084b26fbc7217d27cd398cbf",
        "authentication": "f882ced2949a686eae0ecb5913a4dc07513868c3f402d2980f8be4d261ae1e87e4caf4c96365555c7878ac4f064af8062a49e81e02b3d5b287ccfc8195206f6a",
        "authentication": "9881ced2949a686eae0ecb5913a4dc07513868c3f402d2980f8be4d261ae1e87e4caf4c96365555c7878ac4f064af8062a49e81e02b3d5b287ccfc8195205ea",
        "changingPassword": "",
        "changingEmail": "newEmail@example.com",
        "__v": 1
    }
}
```