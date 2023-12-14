# Backend

## Table of contents  
- [Backend](#backend)
  - [Table of contents](#table-of-contents)
  - [About](#about)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the app](#running-the-app)
  - [API Documentation](#api-documentation)
    - [Auth](#auth)
    - [User](#user)

## About
This is the backend repository for RegGraTer project, made using [Nest](https://github.com/nestjs/nest) framework for TypeScript.

## Prerequisites
* Node 20.9
* PostgreSQL

## Installation

1. `git clone https://github.com/ASPxISSP/backend.git`
2. `npm install`

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
or 
```bash
docker build -t <you-tag> . && docker run --env-file .env
```

## API Documentation

### Auth

User authentication

<details>
<summary><strong><code>POST /auth/register</code></strong></summary>

<br/>

Register new user

**Body**
```json
{
    "email": "email@example.com",
    "password": "passwd!1",
    "name": "Magical User",
}
```

**Response**

* **201** - user created
```json
{
    "message": "User created successfully"
}
```
* **400** - validation error
```json
{
    "message": <error message> | [<error messages>],
    "error": <error>,
    "statusCode": 400
}
```

</details>

<details>
<summary><strong><code>POST /auth/login</code></strong></summary>

<br/>

Login user

**Body**
```json
{
    "email": "email@example.com",
    "password": "passwd!1",
}
```

**Response**

* **200**
```json
{
    "accessToken": <token>,
    "refreshToken": <token>
}
```

* **401** - Unauthorized
```json
{
    "message": "Unauthorized",
    "statusCode": 401
}
```

</details>

<details>
<summary><strong><code>POST /auth/refresh</code></strong></summary>

<br/>

Refresh access token

**Body**
```json
{
    "refreshToken": <refresh token>
}
```

**Response**

* **200**
```json
{
    "accessToken": <access token>,
    "refreshToken": <refresh token>
}
```

* **400** - validation error
```json
{
    "error": "Bad Request",
    "statusCode": 400
}
```

* **401** - Unauthorized
```json
{
    "error": "Unauthorized",
    "statusCode": 401
}
```

</details>

<details>
<summary><strong><code>GET /auth/profile</code></strong></summary>

<br/>

Get user profile

**Headers**
```
Authorization: Bearer <access token>
```

**Response**

* **200**
```json
{
    "id": "22da87a9-55cd-49fd-9ed1-adb3602b0b01",
    "email": "test2@test.com",
    "name": "user2",
    "imageId": 0,
    "score": 0
}
```

* **401** - Unauthorized
```json
{
    "error": "Unauthorized",
    "statusCode": 401
}
```

</details>

### User

User resource

<details>
<summary><strong><code>PUT /user</code></strong></summary>

<br/>

Update user profile

**Headers**
```
Authorization: Bearer <access token>
```

**Response**

* **200**
```json
{
    "id": "22da87a9-55cd-49fd-9ed1-adb3602b0b01",
    "email": "test1@test.com",
    "password": "$2b$10$bEnzCbU0y0g7fE0BHxVVm.3aa03.oC5hgJMGlzpiOOGVWqTt49x46",
    "name": "user2",
    "score": 0,
    "imageId": 0,
    "createdAt": "2023-11-09T11:34:27.742Z",
    "updatedAt": "2023-12-14T11:11:05.490Z"
}
```

* **400** - Bad Request
```json
{
    "message": [
        <error message>
    ],
    "error": "Bad Request",
    "statusCode": 400
}
```

* **401** - Unauthorized
```json
{
    "error": "Unauthorized",
    "statusCode": 401
}
```

</details>

<details>
<summary><strong><code>GET /user/profile</code></strong></summary>

<br/>

Get user profile

**Headers**
```
Authorization: Bearer <access token>
```

**Response**

* **200**
```json
{
    "id": "22da87a9-55cd-49fd-9ed1-adb3602b0b01",
    "email": "test2@test.com",
    "name": "user2",
    "imageId": 0,
    "score": 0
}
```

* **400** - Bad Request
```json
{
    "message": [
        <error message>
    ],
    "error": "Bad Request",
    "statusCode": 400
}
```

* **401** - Unauthorized
```json
{
    "error": "Unauthorized",
    "statusCode": 401
}
```

</details>
