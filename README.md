# **BloomingGallery - Image Upload and Display App**

BloomingGallery is a **SvelteKit**-based web application that allows users to upload images with titles and descriptions and display them in a **Pinterest-style gallery**. The app uses **DuckDB** for lightweight storage, **bcrypt** for secure password hashing, and **Tailwind CSS** for styling.

---

## **Prerequisites**

Before running this project, make sure you have the following installed:

- **Node.js**: Version 18.x or higher
- **npm**: Version 8.x or higher
- **DuckDB**: Automatically handled in the project

Check your installed versions:
```bash
node -v
npm -v
```

---

## **Technology Versions**
The project was built and tested using the following versions:
- **Node.js**: 18.x
- **npm**: 8.x
- **SvelteKit**: 2.0.0
- **Svelte**: 5.0.0
- **DuckDB**: 1.1.3
- **Tailwind CSS**: 3.4.17
- **bcrypt**: 5.1.1
- **DaisyUI**: 4.12.23
- **Vite**: 5.4.11
- **TypeScript**: 5.0.0
- **PostCSS**: 8.4.49
- **Svelte Check**: 4.0.0

---

## **Getting Started**

### **1. Install Dependencies**
Run the following command to install all required packages:
```bash
npm install
```

### **2. Start the Development Server**
Start the local development server:
```bash
npm run dev
```
- The project runs on `http://localhost:5173` by default.

---

## **Features**

### **1. Upload Images**
- Go to `/create`.
- Drag & drop an image or click the upload area.
- Enter a title and description.
- Click "Upload".
- Images are stored in `static/uploads` and metadata is saved in the database.

### **2. Display Uploaded Images**
- Go to `/`.
- See uploaded images displayed in a Pinterest-style grid.
- Each image shows its title and description.

### **3. Responsive Design**
- Uses **Tailwind CSS** and **DaisyUI** for a modern, responsive UI.

### **4. User Authentication**
- Users can register and log in securely.
- Passwords are hashed using **bcrypt** for enhanced security.
- Login status is managed with local storage.

### **5. Commenting Feature**
- Users can comment on images if logged in.
- Comments include the user's email, content, and a timestamp.
- Comments are securely stored in the database.

### **6. Search Functionality**
- The search bar allows users to search images by title or description in real-time.
- Results are displayed dynamically in a dropdown menu.

---

## **Building for Production**

### **1. Create a Production Build**
To build the app for production, run:
```bash
npm run build
```

### **2. Run the Production Server**
Preview the production build locally:
```bash
npm run preview
```

---

## **Database Configuration**

BloomingGallery uses **DuckDB** as an embedded database.

### **Database Setup**
- The database file is stored in `data/project_database.db`.
- The database is initialized automatically when the project starts.

### **Manually Checking the Database**
To view saved images in DuckDB:
1. Install the DuckDB CLI (if not already installed).
2. Open the database:
   ```bash
   duckdb data/project_database.db
   ```
3. Run the following query to view all images:
   ```sql
   SELECT * FROM images;
   ```

---

## **Available npm Scripts**
- **`npm run dev`**: Starts the development server on `http://localhost:5173`.
- **`npm run build`**: Builds the project for production.
- **`npm run preview`**: Runs the production build in a local server environment.

---

## **Security and Authentication**
The app uses **bcrypt** (version 5.1.1) for securely hashing user passwords. Passwords are never stored in plain text.

To install bcrypt manually, if not already installed, run:
```bash
npm install bcrypt
```

---

## **Troubleshooting**

### **Problem: Database Not Found**
- Ensure the `data/` directory exists:
  ```bash
  mkdir data
  ```
- Restart the server:
  ```bash
  npm run dev
  ```

### **Problem: Images Not Displaying**
- Check if images are stored in `static/uploads`.
- Verify database entries with:
  ```sql
  SELECT * FROM images;
  ```

---

## **Dependencies**
The project uses the following technologies:
- **SvelteKit**: Frontend framework.
- **DuckDB**: Lightweight database.
- **bcrypt**: Secure password hashing.
- **Tailwind CSS + DaisyUI**: Styling and UI components.
- **Vite**: Fast build and development server.
- **Node.js**: Backend logic and file handling.

---

## **License**
This project is licensed under the MIT License. See the LICENSE file for more details.



### Additional Informartions
- Author: Gülsen Uzunoglu
- Matrikelnummer: 3682917
