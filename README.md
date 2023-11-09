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
    "id": "08ce3039-1e71-4de2-8b56-1abe5e65ba41",
    "email": "test4@test.com",
    "name": "user2",
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