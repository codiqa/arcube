# Documentation

## API endpoints
POST `/shorten`
payload: `{ orgUrl: 'https://example.com/long-url' }`

This endpoint is used in the frontend to send a request for generating a shorten url from a long url.
In API controller, it creates a shorten url and store into the database.
And then it sends a shorten url into the frontend.

GET `/:shortUrl`

When a user visits this url, it redirects to the original long url.


## Project structure
- `server.js`
This is for API endpoints and serve files in `builds` (reactjs).

- `server.*.test.js`
These files are for unit and e2e testing files.

- `src/contexts/Auth.tsx`
This is an Auth Guard that redirects visitor into the Sign In page if not authorized

- `src/App.tsx`
This is the App react compoment to render the project.

- `src/InputForm.tsx`
This is a main form to input long url and get a shorte url

...

## Setup instruction
`yarn install`: install all packages

`yarn build`: generate build files

`vercel`: deploy into vercel