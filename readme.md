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


# 1. Signup

- **HTTP Method:** `POST`  
- **URL:** `/v1/auth/signup`  
- **Description:** Registers a new user.

---

### Body Parameters

#### Required
- `firstName`: String – User’s first name  
- `lastName`: String – User’s last name  
- `email`: String – User’s email  
- `password`: String – User’s password  

#### Optional
- `profileImageUrl`: String – URL to user's profile image

---

### Sample Request Body

```json
{
  "email": "yagami@gmail.com",
  "firstName": "Light",
  "lastName": "Yagami",
  "password": "Notebook",
  "profileImageUrl": "https://preview.redd.it/1upvo51j79u51.jpg?width=640&crop=smart&auto=webp&s=660fd8f03282eb487b2f1b73d39a63cd89eeec8b"
}
```
### How to fetch (using fetch):

```javascript
const res = await fetch("/v1/auth/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    firstName: "Light",
    lastName: "Yagami",
    email: "yagami@gmail.com",
    password: "Notebook",
    profileImageUrl: "https://preview.redd.it/1upvo51j79u51.jpg?..."
  }),
});

```

### How to fetch (using axios):

```javascript
const res = await axios.post("/v1/auth/signup", {
  firstName: "Light",
  lastName: "Yagami",
  email: "yagami@gmail.com",
  password: "Notebook",
  profileImageUrl: "https://preview.redd.it/1upvo51j79u51.jpg?..."
});

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




# 2. Signin

- **HTTP Method:** `POST`  
- **URL:** `/v1/auth/signin`  
- **Description:** Signs in an existing user.

---

### Body Parameters

#### Required
- `email`: String – User’s email  
- `password`: String – User’s password

---

### Sample Request Body

```json
{
  "email": "yagami@gmail.com",
  "password": "Notebook"
}
```
### How to fetch (using fetch):

```javascript
   const res = await fetch("/v1/auth/signin", {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({
      email: "yagami@gmail.com",
      password: "Notebook"
   }),
   });

```

### How to fetch (using axios):

```javascript
   const res = await axios.post("/v1/auth/signin", {
   email: "yagami@gmail.com",
   password: "Notebook"
   });

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

# 3. Refresh Access Token

- **HTTP Method:** `POST`  
- **URL:** `/v1/auth/refreshAccessToken`  
- **Description:** Refreshes the access token after it expires (typically after 1 hour).

---

### 📝 Body Parameters

#### Required
- `refreshToken`: String – The refresh token obtained during login

---

### 📦 Sample Request Body

```json
{
  "refreshToken": "<refresh token here>"
}
```

### How to fetch (using fetch):

   ```javascript
      const res = await fetch("/v1/auth/refreshAccessToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken })
      });

   ```

### How to fetch (using axios):

   ```javascript
      const res = await axios.post("/v1/auth/refreshAccessToken", {
      refreshToken
      });

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


# Blogs

# 4. Create Blog

- **HTTP Method:** `POST`  
- **URL:** `/v1/api/blog/create?state=published`  
- **Description:** Creates a new blog and saves it as a draft by default. If the `state` query parameter is provided as `published`, it saves it as published instead.  
- **Authorization:** `Bearer <your_jwt_token>`

---

### 🔐 Authorization Required
This endpoint requires the user to be authenticated via a valid JWT token.

---

### 📝 Body Parameters

#### Required
- `title` (string) – Must be unique
- `body` (string)

#### Optional
- `tags` (array of strings)
- `description` (string)
- `headImageUrl` (string)
- `fandom` (string)

---

### 🔍 Query Parameters

#### Optional
- `state` (string) – Accepts values like `draft` or `published`

---

### 📦 Sample Request Body

   ```json
   {
   "title": "The Time-Travel Genius of Ocarina of Time 4",
   "description": "Exploring how time travel shapes gameplay and narrative in Nintendo’s iconic masterpiece.",
   "body": "Ocarina of Time isn't just a great game—it’s a blueprint for time-based storytelling........",
   "tags": ["Zelda", "Ocarina of Time", "Nintendo", "Time Travel", "N64", "Retro Gaming"],
   "fandom": "Legend of Zelda",
   "headImageUrl": "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ-LOlVep8-oIQTwhgjsGJWzP0EORdoQd0AO8CKOFR4duBMM_UfVmO-44LufawrKq8wzcbACw"
   }

  ```

### How to fetch (using fetch):

   ```javascript
         const res = await fetch("/v1/api/blog/create", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer <your_jwt_token>`
         },
         body: JSON.stringify({
            title,
            description,
            body,
            tags,
            fandom,
            headImageUrl
         })
         });

   ```

### How to fetch (using axios):

   ```javascript
      const res = await axios.post("/v1/api/blog/create", {
      title,
      description,
      body,
      tags,
      fandom,
      headImageUrl
      }, {
      headers: {
         "Authorization": `Bearer <your_jwt_token>`
      }
      });

   ```

### success response


```json
{
    "message": "blog The Time-Travel Genius of Ocarina of Time 6 created successfully and saved as draft",
    "success": true,
    "data": {
        "userId": "684d635089bcc1e0e1c0cf17",
        "title": "The Time-Travel Genius of Ocarina of Time 6",
        "description": "Exploring how time travel shapes gameplay and narrative in Nintendo’s iconic masterpiece.",
        "author": "Light Yagami",
        "state": "draft",
        "readCount": 0,
        "readingTime": "2m 17s",
        "headImageUrl": "https://example.com/images/ocarina-of-time-cover.jpg",
        "tags": [
            "Zelda",
            "Ocarina of Time",
            "Nintendo",
            "Time Travel",
            "N64",
            "Retro Gaming"
        ],
        "timeStamp": {
            "createdAt": "2025-06-14T13:00:10.491Z",
            "updatedAt": "2025-06-14T13:00:10.491Z"
        },
        "body": "Ocarina of Time isn't just a great game—it’s a blueprint for time-based storytelling. From the Master Sword to the Temple of Time, Nintendo masterfully lets players bend chronology to solve puzzles and defeat evil......",
        "likedUsers": [],
        "fandom": "Legend of Zelda",
        "_id": "684d725a109f294077fc15c4",
        "rating": [],
        "comments": [],
        "__v": 0
    }
}
```



## 📝 5. Publish Blog

- **HTTP Method**: `GET`  
- **Endpoint**: `/v1/api/blog/publish/:blogId`  
- **Description**: Publishes an existing blog post.  
- **Authorization**: Requires a valid JWT token (Bearer Token).  
- **Note**: Users must be signed in to perform this action.

---

### 📦 How to Fetch (Using `fetch`)

```javascript
   const res = await fetch(`/v1/api/blog/publish/${blogId}`, {
   method: "GET",
   headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer <your_jwt_token>` // Replace with your actual token
   },
   });

   ```

### How to fetch (using axios):

   ```javascript
      const res = await axios.get(`/v1/api/blog/publish/${blogId}`, {
      headers: {
         "Authorization": `Bearer <your_jwt_token>` // Replace with your actual token
      }
      });
   ```

### success response

```json
   {
      "message": "blog Ash Ketchum's Eternal Youth: Coma Theory? published successfully",
      "success": true,
      "data": {
         "timeStamp": {
               "createdAt": "2025-06-14T14:03:31.494Z",
               "updatedAt": "2025-06-14T14:03:31.494Z"
         },
         "_id": "684d81337417c9bd7ac1f661",
         "userId": "684d7cc0d83f10961a6fc8ea",
         "title": "Ash Ketchum's Eternal Youth: Coma Theory?",
         "description": "A look into the persistent fan theory that Ash Ketchum never ages because he's actually in a coma, with the Pokémon world being his dream.",
         "author": "Okarun Takamura",
         "state": "published",
         "readCount": 0,
         "readingTime": "52s",
         "headImageUrl": "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ-LOlVep8-oIQTwhgjsGJWzP0EORdoQd0AO8CKOFR4duBMM_UfVmO-44LufawrKq8wzcbACw",
         "tags": [
               "Pokemon",
               "AshKetchum",
               "FanTheory",
               "Anime",
               "ComaTheory",
               "Speculation",
               "CartoonLogic",
               "Mystery"
         ],
         "body": "For over two decades, Ash Ketchum has journeyed across ......",
         "likedUsers": [],
         "fandom": "Pokémon",
         "rating": [],
         "comments": [],
         "__v": 0
      }
   }
```



## 6. Fetch Published Blogs

- **HTTP Method:** `GET`
- **URL:** `/v1/api/blog/fetch`
- **Description:** Fetch all published blogs with optional filters, search, pagination, and sorting.
- **Authentication:** Not required

---

###  Query Parameters (Optional)

| Parameter    | Type     | Description                                                                 |
|--------------|----------|-----------------------------------------------------------------------------|
| `page`       | Number   | Page number for pagination (default: `1`)                                   |
| `limit`      | Number   | Number of blogs per page (default: `20`)                                    |
| `sortBy`     | String   | Field to sort by (default: `createdAt`)                                     |
| `sortOrder`  | String   | Sort direction: `asc` or `desc` (default: `desc`)                            |
| `title`      | String   | Filter blogs by title (case-insensitive partial match)                      |
| `author`     | String   | Filter blogs by author (case-insensitive partial match)                     |
| `tag`        | String   | Filter blogs that contain a specific tag                                    |
| `state`      | String   | Filter blogs by fandom (exact match)                                        |

---

### 🛠 Fetch Example (Using Fetch API)

   ```js
   const res = await fetch("/v1/api/blog/fetch?title=ascension&author=okarun&tag=Metroid&page=1&limit=10&sortBy=createdAt&sortOrder=desc");
   const data = await res.json();
   ```
   ### 🛠 Fetch Example (Using Fetch axios)

   ```js
   const res = await axios.get("/v1/api/blog/fetch", {
   params: {
      title: "ascension",
      author: "okarun",
      tag: "Metroid",
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc"
   }
   });
   ```

   
   ### success response


   ```json
      {
      "message": "blogs fetched successfully",
      "count": 25,
      "success": true,
      "data": [
         {
            "timeStamp": {
            "createdAt": "2025-06-14T13:57:17.111Z",
            "updatedAt": "2025-06-14T13:57:17.111Z"
            },
            "_id": "684d7fbdd83f10961a6fc8ff",
            "userId": "684d7cc0d83f10961a6fc8ea",
            "title": "Beyond Extinction: The Chozo's Ascended Legacy and Samus's Unwitting Role",
            "description": "A deep dive into the possibility that the Chozo didn't just disappear...",
            "author": "Okarun Takamura",
            "state": "published",
            "readCount": 0,
            "readingTime": "2m 39s",
            "headImageUrl": "https://encrypted-tbn2.gstatic.com/images?q=tbn:...",
            "tags": [ "Metroid", "FanTheory", "Chozo", "SamusAran", "Lore", "Gaming", "Nintendo", "SciFi"],
            "body": "The Chozo, the enigmatic bird-like benefactors of Samus Aran, are widely believed...",
            "likedUsers": [],
            "fandom": "Metroid",
            "rating": [],
            "comments": [],
            "__v": 0
         },
         // ... other blogs ...
      ]
      }

   ```
   





## 🧾 7. Fetch One Published Blog by ID

- **HTTP Method**: `GET`  
- **Endpoint**: `/v1/api/blog/fetchone/:id`  
- **Description**: Fetches a single published blog by its ID along with the author's profile information.  
- **Authorization**: Not required — this endpoint is **public**.

---

### How to fetch (using fetch):

```javascript
const res = await fetch(`/v1/api/blog/fetchone/{id}`);

```

### How to fetch (using axios):

   ```javascript
      const res = await axios.post(`/v1/api/blog/fetchone/{id}`);

   ```

### success response


```json
   {
      "message": "blog fetched successfully",
      "success": true,
      "data": {
         "timeStamp": {
               "createdAt": "2025-06-14T14:03:31.494Z",
               "updatedAt": "2025-06-14T14:03:31.494Z"
         },
         "_id": "684d81337417c9bd7ac1f661",
         "userId": "684d7cc0d83f10961a6fc8ea",
         "title": "Ash Ketchum's Eternal Youth: Coma Theory?",
         "description": "A look into the persistent fan theory that Ash Ketchum never ages because he's actually in a coma, with the Pokémon world being his dream.",
         "author": "Okarun Takamura",
         "state": "published",
         "readCount": 2,
         "readingTime": "52s",
         "headImageUrl": "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ-LOlVep8-oIQTwhgjsGJWzP0EORdoQd0AO8CKOFR4duBMM_UfVmO-44LufawrKq8wzcbACw",
         "tags": [ "Pokemon", "AshKetchum", "Anime", "ComaTheory", "Speculation", "CartoonLogic", "Mystery"],
         "body": "For over two decades,.........",
         "likedUsers": [],
         "fandom": "Pokémon",
         "rating": [],
         "comments": [],
         "__v": 0
      },
      "authorProfile": {
         "email": "turbogranny@gmail.com",
         "firstName": "Okarun",
         "lastName": "Takamura",
         "profileImageUrl": "https://preview.redd.it/1upvo51j79u51.jpg?width=640&crop=smart&auto=webp&s=660fd8f03282eb487b2f1b73d39a63cd89eeec8b"
      }
   }
```


# 8. Fetch All User Posts

- **HTTP Method:** `GET`  
- **URL:** `/v1/api/blog/user/fetchposts?page=1&limit=5&state=drafted`  
- **Description:** Fetches all the posts written by a user. This includes both drafted and published posts.

---

## 🛡️ Authentication

This operation **requires a token**, so the user must be signed in.

---

## 🔍 Request Query Parameters (Optional)

- `page` (number): Page number for pagination.  
- `limit` (number): Number of posts per page.  
- `state` (string): Filter posts by state — `drafted` or `published`.

---

## 📦 How to Fetch (Using `fetch`)

```javascript
   const res = await fetch(`/v1/api/blog/user/fetchposts?page=1&limit=5&state=drafted`, {
   method: "GET",
   headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer <your_jwt_token>`
   },
   });

```

### How to fetch (using axios):

   ```javascript
      const res = await axios.get(`/v1/api/blog/user/fetchposts?page=1&limit=5&state=drafted`, {
      headers: {
         "Authorization": `Bearer <your_jwt_token>`
      }
});

   ```
### success response


```json
  {
    "message": "blogs fetched successfully",
    "count": 10,
    "success": true,
    "data": [
        {
            "timeStamp": {
                "createdAt": "2025-06-14T13:57:17.111Z",
                "updatedAt": "2025-06-14T13:57:17.111Z"
            },
            "_id": "684d7fbdd83f10961a6fc8ff",
            "userId": "684d7cc0d83f10961a6fc8ea",
            "title": "Beyond Extinction: The Chozo's Ascended Legacy and Samus's Unwitting Role",
            "description": "A deep dive into the possibility that the Chozo didn't just disappear, but ascended to a higher plane, subtly influencing events and using Samus Aran for a purpose yet unknown.",
            "author": "Okarun Takamura",
            "state": "published",
            "readCount": 0,
            "readingTime": "2m 39s",
            "headImageUrl": "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ-LOlVep8-oIQTwhgjsGJWzP0EORdoQd0AO8CKOFR4duBMM_UfVmO-44LufawrKq8wzcbACw",
            "tags": [ "Metroid", "FanTheory", "Chozo", "SamusAran", "Lore", "Gaming", "Nintendo", "SciFi"
            ],
            "body": "The Chozo, the enigmatic bird-like benefactors of Samus Aran, a........",
            "likedUsers": [],
            "fandom": "Metroid",
            "rating": [],
            "comments": [],
            "__v": 0
        },
        // ... other blogs ...
         
    ]
}
```


# 9. Editing Blogs

- **HTTP Method:** `PATCH`  
- **URL:** `/v1/api/blog/user/edit/:blogId`  
- **Description:** Edits a blog using the provided blog ID.

---

## 🛡️ Authentication

This operation **requires a token**.  
Users **must be signed in**, and a user **cannot edit another user’s blogs**.

---

##  Request Parameters

- `blogId` (in URL path) – **Required**: The ID of the blog to be edited.

---

## Request Body Parameters

All fields are optional unless stated otherwise:

- `title` (string): Must be unique.  
- `description` (string)  
- `body` (string)  
- `tags` (array of strings)  
- `fandom` (string)  
- `headImageUrl` (string)

---

## 🧪 Sample Request Body

```json
{
  "title": "The Undead Curse: Choice or Inevitability?",
  "description": "Exploring the philosophical ?",
  "body": "The world of Dark Souls i.....",
  "tags": [
    "DarkSouls", "FanTheory", "Lore", "FromSoftware",
    "Gaming", "UndeadCurse", "Philosophy", "Soulsborne", "Existentialism"
  ],
  "fandom": "Dark Souls",
  "headImageUrl": "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ-LOlVep8-oIQTwhgjsGJWzP0EORdoQd0AO8CKOFR4duBMM_UfVmO-44LufawrKq8wzcbACw"
}

  ```



### How to fetch (using fetch):

```javascript
   const res = await fetch(`/v1/api/blog/user/edit/${blogId}`, {
   method: "PATCH",
   headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer <your_jwt_token>`
   },
   body: JSON.stringify({
      title: "...",
      description: "...",
      // other fields...
   })
   });


```

### How to fetch (using axios):

   ```javascript
      const res = await axios.patch(`/v1/api/blog/user/edit/${blogId}`, {
      title: "...",
      description: "...",
      // other fields...
      }, {
      headers: {
         "Authorization": `Bearer <your_jwt_token>`
      }
      });


   ```
### success response


```json
   {
    "message": "blog edited successfully",
    "data": {
        "timeStamp": {
            "createdAt": "2025-06-14T14:03:25.434Z",
            "updatedAt": "2025-06-15T06:57:31.570Z"
        },
        "_id": "684d812d7417c9bd7ac1f65d",
        "userId": "684d7cc0d83f10961a6fc8ea",
        "title": "The Undead Curse: Choice or Inevitability",
        "description": "Exploring the philosophical ",
        "author": "Okarun Takamura",
        "state": "draft",
        "readCount": 0,
        "readingTime": "1m 31s",
        "headImageUrl": "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ-LOlVep8-oIQTwhgjsGJWzP0EORdoQd0AO8CKOFR4duBMM_UfVmO-44LufawrKq8wzcbACw",
        "tags": [ "DarkSouls", "FanTheory", "Lore", "FromSoftware", "Gaming", "UndeadCurse", "Philosophy", "Soulsborne", "Existentialism"
        ],
        "body": "The world of Dark Souls ......",
        "likedUsers": [],
        "fandom": "Dark Souls",
        "rating": [],
        "comments": [],
        "__v": 1
    },
    "success": true
}
```





# 10. Delete Blogs

- **HTTP Method:** `DELETE`  
- **URL:** `/v1/api/blog/user/delete/:blogId`  
- **Description:** Deletes a blog using the provided blog ID.

---

## 🛡️ Authentication

This operation **requires a token**.  
Users **must be signed in**, and a user **cannot delete another user’s blogs**.

---

## 📌 Request Parameters

- `blogId` (in URL path) – **Required**: The ID of the blog to be deleted.

---

## 📦 How to Fetch (Using `fetch`)

```javascript
const res = await fetch(`/v1/api/blog/user/delete/${id}`, {
  method: "DELETE",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer <your_jwt_token>`
  }
});


```

### How to fetch (using axios):

   ```javascript
      const res = await axios.delete(`/v1/api/blog/user/delete/${id}`, {
      headers: {
         "Authorization": `Bearer <your_jwt_token>`
      }
      });


   ```
### success response

```json
   {
      "message": "blog with title The Undead Curse: Choice or Inevitability3 and id 6{id} deleted successfully",
      "success": true
   }
```