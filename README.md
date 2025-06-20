# The Odin Project - File Uploader

## Summary

A file uploader app where users can create, read, update, and delete folders, as well as upload and download files.

## Preview

Click for walkthrough video:

[![Walkthrough of app](https://img.youtube.com/vi/5M5rVtD0LMs/default.jpg)](https://youtu.be/5M5rVtD0LMs)

## Features

- Users can create an account and log in, with sessions stored securely.
- Add folders to organize your account.
- Edit folder names and change folder locations.
- Upload files, which are stored in Supabase.
- Deleting folders and files cascades through the database and Supabase.
- All forms are validated and sanitized; files must be under 2MB.

## Technical Challenges Overcome

- Setting up the Prisma schema and running migrations correctly.
- Configuring Supabase and handling file uploads/deletions in the bucket.
- Separating code into partials for maintainability.
- Using Multer to process file uploads.
- Ensuring files are deleted from Supabase when a folder is deleted, with proper cascading.

## Key Learnings

- Working with Supabase procedures.
- Designing and managing a Prisma schema.
- Structuring files and folders for scalable architecture.
- Using recursion to retrieve folder children.
- Deploying with Prisma.

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript, EJS templating
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL with pg driver, Prisma
- **Authentication:** Passport.js
- **Validation:** express-validator
- **Utilities:** serve-favicon, dotenv
- **Deployment:** Railway

## Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/SReddy-96/TOP-file-uploader.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd TOP-file-uploader
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Configure environment variables:**

   - Create a `.env` file in the root directory.
   - Required variables:

     ```env
     DATABASE_URL=your_postgresql_connection_string
     SUPABASE_URL=your_supabase_url
     SUPABASE_SERVICE_ROLE_KEY=your_role_key
     PORT=3000
     ```

5. **Generate the Prisma client:**

   ```bash
   npx prisma generate
   ```

6. **Run database migrations:**

   ```bash
   npx prisma migrate dev
   ```

7. **Start the development server:**

   ```bash
   npm run dev
   ```

8. **Access the application:**

   Open your browser and navigate to [http://localhost:3000](http://localhost:3000)
