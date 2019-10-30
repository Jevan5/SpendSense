# Authenticate

## /authenticate

Allows for email authentication by clicking links sent via email.

### GET

> Authenticates registration, or a password or email change for a user by email.

After a user has registered, requested to change a password, or change an email, a link is sent to the user's email. Clicking the email calls this API method.

**NOTE:** Authorization header is not needed.

#### Example Request

```sh
url: http://127.0.0.1:8080/authenticate/?username=jevan5&authentication=e14f8905f02a2843dfe1f7cf23618be5228329a553af79b4af
```

`username` Unique identifier for the user's account. Not case-sensitive.

`authentication` Plaintext authentication code sent to the user's email.

#### Example Response

```sh
{
    "message": "Registered account."
}
```