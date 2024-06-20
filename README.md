# Shorten URL

## Description

This is a simple URL shortener service. It takes a long URL and returns a shortened version of it. The shortened URL can be used to redirect to the original URL.

## Installation

1. Clone the repository
2. Install the dependencies
3. Run the server
4. Access the server on `localhost:3333`
5. Use the API to shorten URLs
6. Redirect to the original URL using the shortened URL
7. Enjoy!

## API

### POST /shorten

Shortens a URL.

#### Request

```json
{
  "url": "https://www.example.com"
}
```

#### Response

```json
{
  "shortUrl": "http://localhost:3000/abc123"
}
```

### GET /:code

Redirects to the original URL.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

README initially generated by GitHub Copilot

---

Owner
- email
- ⁠password

URL
- shortUrl
- ⁠longUrl
- code
- ⁠usedCount
- ⁠owner
- ⁠createdAt
- ⁠deletedAt

/shorten -> nanoid(6)
- url
- ⁠code (authenticated)
/:code

/owners (register)
/sessions (authenticates)

Authenticated
/:code/edit
- code
- url
/:code/delete

Services
- url shorten queue (with lambda)
- maybe?

Notifications (extra)
No auth -> link with 7 day limit
