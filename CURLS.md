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
# Create Movie
curl -X POST http://localhost:3000/movies \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Cyber Hell: Exposing an Internet Horror",
    "description":"Anonymous and exploitative, a network of online chat rooms ran rampant with sex crimes. The hunt to take down its operators required guts and tenacity.",
    "releaseDate":"2022-05-17",
    "poster":"https://image.tmdb.org/t/p/original//eRlW6yvXHyXPuN0Ea6u6Sc48lGm.jpg",
    "actorIds":[1,2],
    "genreIds":[1]
  }'

# Get All Movies
curl http://localhost:3000/movies

# Get Movie by ID
curl http://localhost:3000/movies/1

# Update Movie
curl -X PATCH http://localhost:3000/movies/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title","actorIds":[1,2],"genreIds":[1,2]}'

# Delete Movie
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

## Notes

- Token expires in 1 hour
- If you get `401 Unauthorized`, login again
- If you get `403 Forbidden`, you don't have permission (check role)

