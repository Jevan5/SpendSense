# API Documentation

> The backend interface for the Virtualytics application.

## Endpoint

The endpoint for the server is `127.0.0.1:8080`.

## Headers

### Content-Type

Data is expected in application/json format.

```sh
Content-Type: application/json
```

### Authorization

Unless specified otherwise, each request requires an authorization header to ensure that the client has the valid permissions on the table they are querying.

The authorization header should be formatted as follows:

```sh
Authorization: <username>,<password>
```

`username` Plaintext value of user's username. Is not case-sensitive.

`password` Plaintext value of user's password.

## Routes

[Authenticate](./authenticate/README.md)

[FavItem](./favItems/README.md)

[FavLocation](./favLocation/README.md)

[Franchise](./franchises/README.md)

[LocationItem](./locationItems/README.md)

[Location](./locations/README.md)

[ReceiptItem](./receiptItems/README.md)

[Receipt](./receipts/README.md)

[SystemItem](./systemItems/README.md)

[User](./users/README.md)

[ScanReceipt](./scanReceipt/README.md)
