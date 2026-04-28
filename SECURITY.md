# TauSu Guard — Security Notes

This file documents all security requirements that **must be implemented
before this project handles real user data** in any production environment.

---

## What is safe to deploy right now (demo)

- The frontend UI, animations, and map demo
- The registration and sign-in forms (validation runs client-side only)
- All data shown is fictional demo data (`data.js`)
- No real medical data, phone numbers, or GPS coordinates are stored anywhere

---

## What MUST be implemented before real users register

### 1. Backend API (required)

The frontend currently stubs two API calls. You must implement:

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/v1/register` | POST | Save registration + medical data |
| `/api/v1/auth/signin` | POST | Authenticate user, return JWT |
| `/api/v1/auth/refresh` | POST | Refresh access token via httpOnly cookie |
| `/api/v1/auth/signout` | POST | Invalidate refresh token |
| `/api/v1/hiker/:id/medical` | GET | Fetch a hiker's medical record (admin only) |

### 2. Authentication (required)

- Use **JWT** for access tokens (short-lived: 15 minutes)
- Use **httpOnly, Secure, SameSite=Strict cookies** for refresh tokens
- Store access tokens in `sessionStorage` only (never `localStorage`)
- Hash passwords with **bcrypt** (cost factor ≥ 12) or **argon2id**
- Rate-limit sign-in to **5 attempts per minute per IP**
- Implement account lockout after 10 failed attempts

### 3. Medical data encryption (required)

The following fields are PII and must be encrypted at rest in the database:

- `bloodType`
- `allergies` / `allergyNote`
- `sosName`, `sosRel`, `sosPhone`, `sosPhone2`
- `gps` coordinates

Use AES-256-GCM. Store the encryption key in an environment variable or
secrets manager (AWS Secrets Manager, Hashicorp Vault), never in the codebase.

### 4. CSRF protection (required)

Uncomment the `X-CSRF-Token` header in `modals.js` and wire it to a
server-generated token injected into the `<meta name="csrf-token">` tag on
every page load. Validate this token on every POST endpoint.

### 5. Content Security Policy (already partially done)

The CSP meta tag in `index.html` is a starting point. When you add your
backend domain, update `connect-src`:

```
connect-src 'self' https://api.yourdomain.kz https://api.open-meteo.com;
```

For a production server, move the CSP to an HTTP response header instead of
a `<meta>` tag — response headers cannot be overridden by injected content.

### 6. HTTPS (required)

All traffic must be over HTTPS. Never serve this site over HTTP once real
users are registering. Use Let's Encrypt (free) or your hosting provider's
certificate.

### 7. GPS privacy

- Do not log GPS coordinates to any console or error tracking service
- Do not include GPS in error messages sent to users
- Store GPS in a separate database table with access logs
- Delete GPS history older than the hiker's registered journey duration + 24h

### 8. `window.showDashboard` (must replace before auth is added)

`main.js` currently exposes `window.showDashboard` as a global bridge so
`modals.js` can navigate after sign-in. Once real auth exists, replace this
with a custom event:

```javascript
// In modals.js after successful sign-in:
document.dispatchEvent(new CustomEvent('tausu:authenticated', { detail: { userId } }));

// In main.js:
document.addEventListener('tausu:authenticated', () => showDashboard());
```

### 9. Remove `noindex` meta tag when the site goes live

`index.html` currently has `<meta name="robots" content="noindex, nofollow"/>`.
Remove this when the real site launches so it appears in search results.

### 10. Environment variables

Never commit these to GitHub:
- Database connection strings
- JWT signing secret
- Encryption key
- Google Maps API key (when added)
- Any third-party API keys

Use a `.env` file locally and environment variables in production.
Add `.env` to `.gitignore`.

---

## Responsible disclosure

If you find a security vulnerability in this project, please contact the
project owner directly before disclosing publicly.
