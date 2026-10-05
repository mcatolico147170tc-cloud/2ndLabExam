// API base URL from the instructor's guide (jsonplaceholder).
export const API_BASE_URL = "https://jsonplaceholder.typicode.com";

// Endpoint mapping used by this app:
// POST /login          -> GET /users (the email must match a user)
// GET /students        -> GET /users
// GET /students/{id}   -> GET /users/{id}
// GET /profile         -> GET /users/{logged-in user id}
