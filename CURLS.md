# API Curl Commands

## Setup

```bash
# Set your token (get it from login response)
TOKEN="your_access_token_here"
```

---

## Auth

```bash
# Register (Public)
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"M Naveed","email":"naveed@yopmail.com","password":"pass123"}'

# Login (Public)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"naveed@yopmail.com","password":"pass123"}'
```

---

## Users (Admin Only)

```bash
# Get All Users
curl http://localhost:3000/users \
  -H "Authorization: Bearer $TOKEN"

# Get User by ID
curl http://localhost:3000/users/1 \
  -H "Authorization: Bearer $TOKEN"

# Update User
curl -X PATCH http://localhost:3000/users/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"M Naveed Updated"}'

# Delete User
curl -X DELETE http://localhost:3000/users/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## Movies

```bash
# Create Movie with File Uploads (multipart/form-data)
curl -X POST http://localhost:3000/movies \
  -H "Authorization: Bearer $TOKEN" \
  -F "title=The Matrix" \
  -F "description=A computer hacker learns about the true nature of reality" \
  -F "releaseDate=1999-03-31" \
  -F "actorIds=1,2" \
  -F "genreIds=1,2" \
  -F "poster=@/path/to/poster.jpg" \
  -F "trailer=@/path/to/trailer.mp4"

# Create Movie without files
curl -X POST http://localhost:3000/movies \
  -H "Authorization: Bearer $TOKEN" \
  -F "title=Cyber Hell: Exposing an Internet Horror" \
  -F "description=Anonymous and exploitative, a network of online chat rooms ran rampant with sex crimes." \
  -F "releaseDate=2022-05-17" \
  -F "actorIds=1,2" \
  -F "genreIds=1"

# Get All Movies (with pagination)
curl "http://localhost:3000/movies"

# Get Movies - Page 2 with 5 items per page
curl "http://localhost:3000/movies?page=2&limit=5"

# Search Movies by Title
curl "http://localhost:3000/movies?title=Matrix"

# Filter Movies by Genre ID
curl "http://localhost:3000/movies?genreId=1"

# Filter Movies by Actor ID
curl "http://localhost:3000/movies?actorId=1"

# Filter Movies by Minimum Rating
curl "http://localhost:3000/movies?minRating=4"

# Combined: Movies in genre 1 with rating >= 4
curl "http://localhost:3000/movies?genreId=1&minRating=4&page=1&limit=10"

# Get Movie by ID (includes average rating)
curl http://localhost:3000/movies/1

# Update Movie with new poster
curl -X PATCH http://localhost:3000/movies/1 \
  -H "Authorization: Bearer $TOKEN" \
  -F "title=Updated Title" \
  -F "poster=@/path/to/new-poster.jpg"

# Update Movie without files
curl -X PATCH http://localhost:3000/movies/1 \
  -H "Authorization: Bearer $TOKEN" \
  -F "title=Updated Title" \
  -F "actorIds=1,2,3" \
  -F "genreIds=1,2"

# Delete Movie (also deletes poster/trailer files)
curl -X DELETE http://localhost:3000/movies/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## Actors

```bash
# Create Actor
curl -X POST http://localhost:3000/actors \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Christian Bale",
    "dateOfBirth":"1974-01-30",
    "movieIds":[]
  }'

# Get All Actors
curl http://localhost:3000/actors

# Get Actor by ID
curl http://localhost:3000/actors/1

# Update Actor
curl -X PATCH http://localhost:3000/actors/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Actor Name","movieIds":[1]}'

# Delete Actor
curl -X DELETE http://localhost:3000/actors/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## Genres

```bash
# Create Genre
curl -X POST http://localhost:3000/genres \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Action",
    "description":"Action movies",
    "movieIds":[]
  }'

# Get All Genres
curl http://localhost:3000/genres

# Get Genre by ID
curl http://localhost:3000/genres/1

# Update Genre
curl -X PATCH http://localhost:3000/genres/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Genre","movieIds":[1]}'

# Delete Genre
curl -X DELETE http://localhost:3000/genres/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## Reviews

```bash
# Create Review (Auth Required)
curl -X POST http://localhost:3000/reviews \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"movieId":1,"rating":5,"comment":"Amazing movie!"}'

# Get All Reviews
curl http://localhost:3000/reviews

# Get Reviews by Movie
curl "http://localhost:3000/reviews?movieId=1"

# Get Review by ID
curl http://localhost:3000/reviews/1

# Update Review (Owner/Admin)
curl -X PATCH http://localhost:3000/reviews/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"rating":4,"comment":"Updated comment"}'

# Delete Review (Owner/Admin)
curl -X DELETE http://localhost:3000/reviews/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## Movies Response Format

Movies endpoint returns paginated results:

```json
{
  "data": [
    {
      "id": 1,
      "title": "The Matrix",
      "description": "...",
      "releaseDate": "1999-03-31",
      "poster": "...",
      "trailerLink": "...",
      "averageRating": 4.5,
      "actors": [...],
      "genres": [...],
      "reviews": [...]
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## Notes

- Token expires in 1 hour
- If you get `401 Unauthorized`, login again
- If you get `403 Forbidden`, you don't have permission (check role)
- File uploads use `multipart/form-data` (use `-F` flag in curl)
- Maximum file size: 100MB
- Poster: accepts image files (jpg, png, gif, etc.)
- Trailer: accepts video files (mp4, mov, avi, etc.)

