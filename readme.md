# Thread Canon Wiki

This is an Express API for a user-driven web platform where users can create blogs centered around their favorite fandoms. These blogs are then rated by other users of Thread Canon based on their accuracy and quality. This community-driven system encourages the creation of fan theories and headcanons.


## Tech Stack
- NodeJS
- ExpressJS
- MongoDB (Mongoose)
- Nodemon
- bcrypt
- cors
- dotenv
- jsonwebtoken
---

## How to setup

1. ### Clone the repository:

   git clone https://github.com/Onetyten/threadcanon_wiki.git
   cd threadcanon_wiki

2. ### Install dependencies(make sure you have npm and node installed):

   ```bash
   npm install
   ```

3. ### Create a .env file following this format

   Create a `.env` file in the root of the project and add the following environment variables:

   ```env
   MONGO_URL=your_mongodb_connection_string
   PORT=your_desired_port (e.g., 8000)
   JWT_SECRET=your_super_secret_jwt_key
   ```

4. ### Start the server
   ```bash
   npm run dev
   ```

# Authentication

While users do not need to be logged in to view blogs, they will be required to log in to perform write operations (create, update,review,comment on, write and delete blogs).

Example: `Authorization: Bearer <your_jwt_token>`


1. # Signup

   - HTTP method: POST
   - URL: /v1/auth/signup
   - Description: Registers a new user.

   ### Body params:
   *compulsory*
    - firstName
    - lastName
    - email
    - password

   ### optional 
    - profileImageUrl

  Sample Request body

  ```json
    {
        "email":"yagami@gmail.com",
        "firstName":"Light",
        "lastName":"Yagami",
        "password":"Notebook",
        "profileImageUrl":"https://preview.redd.it/1upvo51j79u51.jpg?width=640&crop=smart&auto=webp&s=660fd8f03282eb487b2f1b73d39a63cd89eeec8b"
    }

  ```

### How to fetch (using fetch):

```javascript
const res = await fetch("/v1/auth/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ firstName, lastName, email, password, profileImageUrl }),
});
```

### How to fetch (using axios):

```javascript
const res = await axios.post("/auth/signup", { firstName, lastName, email, password, profileImageUrl });
```

### success response


```json
{
    "message": "user created successfully",
    "data": {
        "email": "yagami@gmail.com",
        "firstName": "Light",
        "lastName": "Yagami",
        "password": "$2b$1",
        "profileImageUrl": "https://preview.redd.it/1upvo51j79u51.jpg?width=640&crop=smart&auto=webp&s=660fd8f03282eb487b2f1b73d39a63cd89eeec8b",
        "_id": "ghyrtrnsky792h2g2t22",
        "refreshTokens": [],
        "createdAt": "2025-06-13T21:54:50.451Z",
        "updatedAt": "2025-06-13T21:54:50.451Z",
        "lastLogin": "2025-06-13T21:54:50.451Z",
        "__v": 0
    },
    "success": true
}
```


2. # Signin

   - HTTP method: POST
   - URL: /v1/auth/signin
   - Description: Sign in an existing user.

   ### Body params:
   *compulsory*
    - email
    - password

  Sample Request body

  ```json
   {
      "email":"yagami@gmail.com",
      "password":"Notebook"
   }

  ```

### How to fetch (using fetch):

```javascript
const res = await fetch("/v1/auth/signin", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
```

### How to fetch (using axios):

```javascript
const res = await axios.post("/v1/auth/signin", { email, password});
```

### success response


   ```json
   {
      "message": "login successful",
      "success": true,
      "token": "<token string>",
      "refreshToken": {
         "token": "<refresh token string>",
         "expiresAt": "2025-11-28T23:01:44.572Z",
         "_id": "684cadd8437e5f2360de4440",
         "createdAt": "2025-06-13T23:01:44.575Z"
      },
      "data": {
         "id": "ghyrtrnsky792h2g2t22",
         "email": "yagami@gmail.com",
         "lastLogin": "2025-06-13T23:01:44.576Z"
      }
   }
```

2. # Refresh Access Token

   - HTTP method: POST
   - URL: /v1/auth/refreshAccessToken
   - Description: Refresh the access token after it expires in an hour. 

   ### Body params:
   *compulsory*
    - refreshToken

  Sample Request body

  ```json
   {
      "refreshToken":"<refresh token here>"
   }
  ```

### How to fetch (using fetch):

   ```javascript
   const res = await fetch("/v1/auth/refreshAccessToken", {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ refreshToken }),
   });
   ```

### How to fetch (using axios):

   ```javascript
   const res = await axios.post("/v1/auth/refreshAccessToken", { refreshToken});
   ```

### success response


```json
   {
      "user": {
         "id": "<id here>",
         "email": "yagami@gmail.com",
         "token": "<Access token here>"
      },
      "message": "New token assigned",
      "success": true
      }
```

