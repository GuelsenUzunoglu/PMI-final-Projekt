# BloomingGallery - Image Upload and Display App

BloomingGallery is a **SvelteKit**-based web application that allows users to upload images with titles and descriptions and display them in a **Pinterest-style gallery**. The app uses **DuckDB** for lightweight storage and **Tailwind CSS** for styling.

---

## **Prerequisites**

Before running this project, make sure you have the following installed:

- **Node.js**: Version 16.x or higher
- **npm**: Version 8.x or higher
- **DuckDB**: Automatically handled in the project

Check your installed versions:
```bash
node -v
npm -v
```
## Getting Started

### 2. Install Dependencies
```bash
   npm install
   ```

### 3. Start the Development Server
  ```bash
   npm run dev
```
 - The project runs on http://localhost:5173 by default.


## Features

### 1. Upload Images
 - Go to /create 
 - Drag & drop an image or click the upload area 
 - Enter a title and description 
 - Click Upload 
 - Images are stored in static/uploads and metadata is saved in the database

### 2. Display Uploaded Images
 - Go to / 
 - See uploaded images displayed in a Pinterest-style grid 
 - Each image shows its title and description

### 3. Responsive Design
 - Uses Tailwind CSS and DaisyUI for a modern, responsive UI

## Building for Production
### 1. Create a Production Build:
  ```bash
npm run build
```
### 2. Run the Production Server:
  ```bash
npm run preview
```

## Database Configuration
BloomingGallery uses DuckDB as an embedded database.

### Database Setup
 - The database file is stored in data/project_database.db 
 - The database is initialized automatically when the project starts. 

### Manually Checking the Database 
To view saved images in DuckDB:

1. Install DuckDB CLI (if not already installed)
2. Open the database:
  ```bash
duckdb data/project_database.db
```
3. Run:
  ```sql
SELECT * FROM images;
```


## Dependencies
The project uses the following technologies:

- SvelteKit: Frontend framework
- DuckDB: Lightweight database
- Tailwind CSS + DaisyUI: Styling and UI components
- Vite: Fast build and development server
- Node.js: Backend logic and file handling

## Troubleshooting
### Problem: Database Not Found
 - Ensure the data/ directory exists:
  ```bash
mkdir data
```

 - Restart the server:
  ```bash
npm run dev
```

### Problem: Images Not Displaying
 - Check if images are stored in static/uploads 
 - Verify database entries with:
  ```sql
SELECT * FROM images;
```