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
- files (ONE-TO-MANY with user) user, file_url, id
- folders (one-to-many with user) (one-to-many with files) user, id
- users (id, name, email, username, password, folders[], files[]) - If user deleted then delete all files and folders.

### Layout

User should be able to login or sign up from the initial load.
Shouldn't need a landing page Used more like an app.
login and sign up have no header and footer. Just fill the entire page.
Similar to google drive but using a side panel style.
Some sort of index page with all the files and folders.
Side panel has add folder and add file and home page and maybe a settings / profile page
Title of the page shows which folder your in.
side panel and footer.
Able to add new folders and open the folders and then add folders or files to these folders.

- register (CRUD) - Should have a view profile where they can change user data and delete themselves.
- log in (probably the '/' route) (get, post)
- home (get)
- file (CRUD) Should be able to download the file.
- folder (CRUD)

need to add update to users and be able to delete on a profile page.

put a max about of bytes for the file uploaded, can do both supabase and on schema.
