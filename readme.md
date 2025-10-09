# MERN Ecommerce
A seamless shopping experience powered by the MERN stack, Redux Toolkit, and Material UI.

<!-- ![ecommerce-homepage](https://github.com/RishiBakshii/mern-ecommerce/blob/main/frontend/src/assets/images/front.png?raw=true)
![ecommerce-banner](https://github.com/RishiBakshii/mern-ecommerce/blob/main/frontend/src/assets/images/banner3.jpg?raw=true) -->

## Features

### User
- Product Reviews: write, edit, delete; instant rating updates.
- Wishlist: add/remove items; annotate with personal notes.
- Orders: create orders and view order history.
- Profile: manage email, username, multiple addresses.
- Cart: add items, adjust quantities, view subtotals.

### Admin
- Products: add, edit, delete, soft-delete; manage stock and attributes.
- Orders: view and update details and status.

### Security & UX
- Auth: login, signup, OTP verification, password reset, logout.
- UI: Material UI for a clean, responsive interface.

### Scalability
- Modular, scalable architecture ready for growth.

## Tech Stack
- Frontend: React, Redux Toolkit, Material UI
- Backend: Node.js, Express.js, MongoDB (Mongoose)
- Auth: JWT, cookies
- Tooling: Nodemon (dev), npm

## Prerequisites
- Node.js v21.1.0 or later
- MongoDB installed and running locally

## Quick Start

Clone
```bash
git clone https://github.com/kasun2001/mern-ecommerce.git
cd mern-ecommerce
```

Install dependencies

Frontend
```bash
cd frontend
npm install
```

Backend
```bash
cd backend
npm install
```

## Environment Variables

Backend (create backend/.env)
```bash
# Database connection string
MONGO_URI="mongodb://localhost:27017/your-database-name"

# Frontend URL (adjust if needed)
ORIGIN="http://localhost:3000"

# Email credentials for sending password resets and OTPs
EMAIL="your-email@example.com"
PASSWORD="your-email-password"

# Token and cookie expiration settings
LOGIN_TOKEN_EXPIRATION="30d"          # Days
OTP_EXPIRATION_TIME="120000"          # Milliseconds
PASSWORD_RESET_TOKEN_EXPIRATION="2m"  # Minutes
COOKIE_EXPIRATION_DAYS="30"           # Days

# Secret key for JWT security
SECRET_KEY="your-secret-key"

# Environment (production/development)
PRODUCTION="false" # false for development
```

Frontend (create frontend/.env)
```bash
# Backend URL (adjust if needed)
REACT_APP_BASE_URL="http://localhost:8000"
```

Important
- Replace placeholders with real values.
- Do not commit .env files.

<!-- ## Seed Sample Data
Pre-populate users, products, reviews, and carts.

```bash
cd backend
npm run seed
# (equivalent to: node seed/seed.js)
``` -->

## Run in Development

Open two terminals (or use split terminal in VS Code).

Backend
```bash
cd backend
# install nodemon globally if needed
npm install -g nodemon
npm run dev   # or: npm start
# server should run on http://localhost:8000
```

Frontend
```bash
cd frontend
npm start
# app should run on http://localhost:3000
```

Access
- Backend: http://localhost:8000
- Frontend: http://localhost:3000

## Demo Account (Optional)
After seeding:
```bash
email: demo@gmail.com
pass:  helloWorld@123
```
Notes
- Password reset and OTP verification are disabled for the demo account (non-real email).
- Create a real account with a valid email to test those flows.

## Scripts (common)
- backend: npm run dev — start backend with nodemon
- backend: npm run seed — seed sample data
- frontend: npm start — start React dev server
- frontend: npm run build — production build

## Project Structure
```
mern-ecommerce/
  backend/
    src/...
    seed/seed.js
    .env (local)
  frontend/
    src/...
    public/...
    .env (local)
  readme.md
```

## Troubleshooting

- MongoDB connection error:
  - Ensure MongoDB is running.
  - Windows service: net start MongoDB (if installed as a service)
  - Or run mongod in a separate terminal.

- CORS errors:
  - Make sure backend ORIGIN matches your frontend URL exactly.

- Auth not working / 401:
  - Verify SECRET_KEY and cookie settings.
  - Clear browser cookies and retry.

- Ports already in use:
  - Stop other processes using 3000 or 8000, or change ports.

## Contributing
- Open issues and pull requests are welcome.

<!-- ## Author
- @RishiBakshii (https://github.com/RishiBakshii) -->