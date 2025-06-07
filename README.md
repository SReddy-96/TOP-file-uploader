# File Uploader - 

## Summary

## Preview

![Walkthrough of app]()

## Features

## Technical Challenges Overcome

## Key Learnings

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript, EJS templating
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL with pg driver, Prisma
- **Authentication:** Passport.js
- **Validation:** express-validator
- **Utilities:** serve-favicon, dotenv
- **Deployment:**  

## Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/SReddy-96/TOP-file-uploader.git
   ```

2. **Navigate to project directory:**

   ```bash
   cd TOP-file-uploader
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Configure environment variables:**

   - Create a `.env` file in the root directory
   - Required variables:

     ```.env
     DATABASE_URL=your_postgresql_connection_string
     SESSION_SECRET=your_session_secret
     PORT=3000
     ```

5. **Start the development server:**

   ```bash
   npm run dev
   ```

6. **Access the application:**
   Open your browser and navigate to `http://localhost:3000`

## Application Structure

## About

## Notes

### install

- @prisma/client
- @quixo3/prisma-session-store
- bcryptjs
- dotenv"
- ejs
- express
- express-session
- express-validator
- multer
- passport
- passport-local
- pg
- prisma
- serve-favicon

### schemas

- sessions
- files (ONE-TO-MANY  with user)
- folders (one-to-many with user)
- users ()
      - If user deleted then delete all files and folders.