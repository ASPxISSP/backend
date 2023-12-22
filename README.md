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
    - [Puzzle](#puzzle)
    - [Leaderboard](#leaderboard)
    - [Image](#image)

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
    "imageUri": "bucket/avatars/avatar.png"
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

* **409** - conflict
```json
{
    "message": "User already exists",
    "statusCode": 409
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
<summary><strong><code>DELETE /user</code></strong></summary>

<br/>

Delete user

**Headers**
```
Authorization: Bearer <access token>
```

**Response**

* **204**


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

<details>
<summary><strong><code>GET /user/puzzle</code></strong></summary>

<br/>

Get user puzzles

**Headers**
```
Authorization: Bearer <access token>
```

**Query params**
* `city` - string, (default empty). If present, will return all puzzles from given city with additional PuzzleSolve props

**Response**

* **200** - /user/puzzles
```json
[
    {
        "id": 1,
        "solution": "prisma",
        "difficulty": "MEDIUM",
        "latitude": 51,
        "longitude": 67,
        "address": "ul. Nożownicza 13, Wrocław",
        "city": "Wrocław",
        "imageUri": "prisma-erd.svg",
        "puzzleOrder": 1
    }
]
```

* **200** - /user/puzzles?city=Wrocław
```json
[
    {
        "id": 1,
        "solution": "prisma",
        "difficulty": "MEDIUM",
        "latitude": 51,
        "longitude": 67,
        "address": "ul. Nożownicza 13, Wrocław",
        "city": "Wrocław",
        "imageUri": "prisma-erd.svg",
        "puzzleOrder": 1,
        "isSolved": true,
        "isUnlocked": true
    },
    {
        "id": 2,
        "solution": "adios",
        "difficulty": "HARD",
        "latitude": 50,
        "longitude": 61,
        "address": "ul. Kuźnicza 10, Wrocław",
        "city": "Wrocław",
        "imageUri": "adios.png",
        "puzzleOrder": 2,
        "isSolved": false,
        "isUnlocked": true
    },
    {
        "id": 3,
        "solution": "rynek",
        "difficulty": "HARD",
        "latitude": 51.11,
        "longitude": 67.01,
        "address": "Rynek 7, Wrocław",
        "city": "Wrocław",
        "imageUri": "rynek.svg",
        "puzzleOrder": 3,
        "isSolved": false,
        "isUnlocked": false
    }
]
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

### Puzzle

Puzzle resource

<details>
<summary><strong><code>GET /puzzle/:id</code></strong></summary>

<br/>

Get puzzle

**Params**

* `id` - int

**Response**

* **200**
```json
{
    "id": 1,
    "solution": "solution",
    "difficulty": "MEDIUM",
    "latitude": 51.110252,
    "longitude": 17.030915,
    "address": "Rynek",
    "city": "Wrocław",
    "imageUri": "s3://bucket/image"
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

</details>

<details>
<summary><strong><code>GET /puzzle</code></strong></summary>

<br/>

Get list of puzzles

**Query params**

* `size` - int, 1-100 (default 10)
* `page` - int, min 1 (default 1)
* `city` - string (default empty)

**Response**

* **200**
```json
{
    "data": [
        {
            "id": 1,
            "solution": "solution",
            "difficulty": "MEDIUM",
            "latitude": 51.110252,
            "longitude": 17.030915,
            "address": "Rynek 13, 50-003 Wrocław",
            "city": "Wrocław",
            "imageUri": "image.svg"
        },
        ...
    ],
    "meta": {
        "page": 1,
        "size": 10,
        "total": 1
    }
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

</details>

<details>
<summary><strong><code>POST /puzzle/:id/solve</code></strong></summary>

<br/>

Solve a puzzle

**Headers**
```
Content-Type: application/json
Authorization: Bearer <access token>
```

**Params**

* `id` - int

**Body**
```json
{
    "solution": "solution",
    "latitude": 51.110316,
    "longitude": 17.030929
}
```

**Response**

* **204**
```json
{
    "score": 20
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
    "message": "Unauthorized",
    "statusCode": 401
}
```

* **422** - Unprocessable Entity 
```json
{
    "message": "Invalid solution or location",
    "error": "Unprocessable Entity",
    "statusCode": 422
}
```

</details>

### Leaderboard

<details>
<summary><strong><code>GET /leaderboard</code></strong></summary>

<br/>

Get leaderboard list

**Query params**

* `size` - int, 1-100 (default 10)
* `city` - string, (default empty)

**Response**

* **200**
```json
[
    {
        "id": "d01fc20c-a754-40e6-9af9-85b24366a445",
        "name": "user2",
        "score": 20,
        "imageId": 0
    },
    {
        "id": "08ce3039-1e71-4de2-8b56-1abe5e65ba41",
        "name": "user2",
        "score": 0,
        "imageId": 0
    }
]
```

</details>

### Image

<details>
<summary><strong><code>GET /image/avatar</code></strong></summary>

<br/>

Get list of avatars

**Response**

* **200**
```json
[
    {
        "name": "adios.png",
        "url": "https://zpp-bucket.s3.eu-central-1.amazonaws.com/avatars/adios.png"
    },
    {
        "name": "pan_puzel.png",
        "url": "https://zpp-bucket.s3.eu-central-1.amazonaws.com/avatars/pan_puzel.png"
    },
    {
        "name": "pani_puzel.png",
        "url": "https://zpp-bucket.s3.eu-central-1.amazonaws.com/avatars/pani_puzel.png"
    }
]
```

</details>

<details>
<summary><strong><code>GET /image/avatar/:key</code></strong></summary>

<br/>

Get single avatar by key

**Params**
* `key` - key of the resource, based on `imageUri` columns in database, which corresponds to object Key in S3 bucket

**Response**

* **200**
```json
{
        "name": "adios.png",
        "url": "https://zpp-bucket.s3.eu-central-1.amazonaws.com/avatars/adios.png"
}
```

</details>

<details>
<summary><strong><code>GET /image/puzzle/:key</code></strong></summary>

<br/>

Get single puzzle by key. Returned `url` prop is a signed resource url valid for 1h

**Params**
* `key` - key of the resource, based on `imageUri` columns in database, which corresponds to object Key in S3 bucket

**Response**

* **200**
```json
{
    "name": "prisma-erd.svg",
    "url": "https://zpp-bucket.s3.eu-central-1.amazonaws.com/puzzles/prisma-erd.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAZPQRBDIY352F75GP%2F20231222%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20231222T105613Z&X-Amz-Expires=3600&X-Amz-Signature=fdb3836dd5bee68c5191dff08d73a0b5abd2c37a59a630ba764990ccc5531d28&X-Amz-SignedHeaders=host&x-id=GetObject"
}
```

</details>
