# CCE106 Practical Laboratory Examination

## Student Service Portal

### Student Information

Name:   Mark Joseph P. Catolico

Section: 2013 - 8:00 - 10:00 am

Date: October 2, 2026

### Required Features

- [x] Login
- [x] Authentication state
- [x] Secure token storage
- [x] Protected navigation
- [x] Dashboard
- [x] Student API request
- [x] Loading state
- [x] Error state
- [x] Empty state
- [x] Search/filter
- [x] Dynamic student details
- [x] Profile
- [x] Session restoration
- [x] Logout

### API

Base URL: `https://jsonplaceholder.typicode.com` (set in `constants/api.ts`).
This is the guide API sent by the instructor. It is a fake API, so the app maps
the required endpoints to the resources it provides:

| Required endpoint | Used in this app |
|---|---|
| POST /login | GET /users (the email must match a user) |
| GET /students | GET /users |
| GET /students/{id} | GET /users/{id} |
| GET /profile | GET /users/{logged-in user id} |

jsonplaceholder has no passwords, so the password field is required but not
verified, and no password is stored. Test email: `Sincere@april.biz` with any password.

### How to Run

```sh
npm install
npx expo start
```

Press `w` for web, or run `npm run web` directly.

The app opens the sign-in screen first. The application tabs and the
`/student/[id]` detail route are both protected: unauthenticated users are
redirected to `/sign-in`.

The access token is saved with Expo SecureStore (`context/AuthContext.tsx`) on
Android/iOS and restored when the app starts. SecureStore does not support web,
so the web build falls back to `localStorage`; verify secure session persistence
on Android/iOS.

Compiler and lint checks:

```sh
npx tsc --noEmit
npm run lint
```

### Required Git Commits

Students must create at least five meaningful commits.

Suggested examples:

- `exam: setup navigation`
- `exam: implement login`
- `exam: integrate student api`
- `exam: add dynamic student details`
- `exam: implement session and logout`

### Submission

Submit the GitHub repository URL according to the instructor's instructions.
