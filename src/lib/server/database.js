import { DuckDBInstance } from '@duckdb/node-api';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';

/** 
 * Erstellt eine DuckDB-Datenbankinstanz und verbindet sich mit ihr.
 */

// @ts-ignore
const db = await DuckDBInstance.create('./database.db'); // Erstelle oder öffne die Datenbank
// @ts-ignore
export const connection = await db.connect(); // Stelle die Verbindung her


/**
 * Initialisiere die Datenbank, falls noch nicht geschehen.
 */
export async function initializeDatabase() {

  
  try {
    // Erstellt eine Sequenz für automatische IDs in der Tabelle "images"
    // @ts-ignore
    await connection.run(`
      CREATE SEQUENCE IF NOT EXISTS id_sequence START 1;
    `);

    // Erstellt die Tabelle für Bilder
    // @ts-ignore
    await connection.run(`
      CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY DEFAULT nextval('id_sequence'), -- ID wird durch die Sequenz generiert
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        filepath TEXT NOT NULL,
        size TEXT NOT NULL -- Größe des Bildes speichern
      );
    `);
    console.log('Datenbank erfolgreich initialisiert!');

    // Tabelle für Nutzer erstellen
    // @ts-ignore
    await connection.run(`
      CREATE SEQUENCE IF NOT EXISTS user_id_sequence START 1;
    `);


     // Erstellt die Tabelle für Benutzer
    // @ts-ignore
    await connection.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY DEFAULT nextval('user_id_sequence'), -- IDs werden automatisch generiert
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
    `);
    console.log("Tabelle 'users' erfolgreich erstellt!");
  } catch (error) {
    console.error('Fehler beim Initialisieren der Datenbank:', error);
  }
}

/**
 * Retrieves all stored images from the database.
 * @returns {Promise<Array<{ filepath: string, title: string, description: string, size: string }>>}
 */
export async function getAllImages() {
  try {
    const result = await connection.runAndReadAll(
      'SELECT id, filepath, title, description, size FROM images'
    );

    const images = result.getRows().map((row) => ({
      id: row[0] !== null ? Number(row[0]) : 0,
      filepath: row[1] !== null ? String(row[1]) : '',
      title: row[2] !== null ? String(row[2]) : '',
      description: row[3] !== null ? String(row[3]) : '',
      size: row[4] !== null ? String(row[4]) : ''
    }));

    console.log('Geladene Bilder:', images);
    return images;
  } catch (error) {
    console.error('Fehler beim Abrufen der Bilder:', error);
    return [];
  }
}

/**
 * Searches for images based on a search term in the title or description.
 * @param {string} query - The search term.
 * @returns {Promise<Array<{ id: number, title: string, description: string, filepath: string }>>}
 */
export async function searchImages(query) {
  try {
    const result = await connection.runAndReadAll(
      `SELECT id, title, description, filepath FROM images 
      WHERE title ILIKE ? OR description ILIKE ? LIMIT 5`,
      [`%${query}%`, `%${query}%`]
    );

    return result.getRows().map((row) => ({
      id: Number(row[0] ?? 0),
      title: String(row[1] ?? ""),
      description: String(row[2] ?? ""),
      filepath: String(row[3] ?? "")
    }));
  } catch (error) {
    console.error("Fehler bei der Bildersuche:", error);
    return [];
  }
}

/**
 * Stores image metadata in the database..
 * @param {string} title - Image title
 * @param {string} description - Image description
 * @param {string} filepath - Relative path to the image file
 * @param {string} size - Image size
 */
export async function saveImageMetadata(title, description, filepath, size) {
  try {
    const relativeFilepath = `/uploads/${size}/${path.basename(filepath)}`;

    await connection.run(
      `INSERT INTO images (title, description, filepath, size) VALUES (?, ?, ?, ?)`,
      [title, description, relativeFilepath, size]
    );

    console.log('Zu speichernder Bildpfad:', relativeFilepath);
    console.log('Bild-Metadaten erfolgreich gespeichert!');
  } catch (error) {
    console.error('Fehler beim Speichern der Metadaten:', error);
  }
}

/**
 * Registers a new user with a hashed password.
 * @param {string} email -  email - User's email address
 * @param {string} password - password - User's password
 */
export async function registerUser(email, password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.run(
      `INSERT INTO users (email, password) VALUES (?, ?)`,
      [email, hashedPassword]
    );

    console.log(`Benutzer gespeichert: ${email}`);
    return { success: true, message: "Benutzer erfolgreich registriert." };
  } catch (error) {
    console.error("Fehler beim Speichern des Benutzers:", error);
    return { success: false, error: "Fehler beim Registrieren des Benutzers." };
  }
}

/**
 * Processes the file upload and stores it.
 * @param {File} file - The uploaded file
 * @param {string} title - title - Image title
 * @param {string} description - description - Image description
 * @param {string} size - Die Größe des Bildes
 */
export async function processUpload(file, title, description, size) {
  try {
    const filename = `${Date.now()}-${file.name}`;
    const uploadDir = path.resolve('./static/uploads', size);
    const filepath = path.join(uploadDir, filename);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filepath, buffer);

    await saveImageMetadata(title, description, filepath, size);
  } catch (error) {
    console.error('Fehler beim Verarbeiten des Uploads:', error);
  }
}

/**
 * Debug function: Displays all stored images.
 */
export async function testDatabase() {
  try {
    const result = await connection.runAndReadAll('SELECT * FROM images');
    console.log('Daten in der Tabelle images:', result.getRows());
  } catch (error) {
    console.error('Fehler bei der Testfunktion:', error);
  }
}

/**
 * Debug function: Displays all users in the database.
 */
export async function showAllImages() {
  try {
    const result = await connection.runAndReadAll('SELECT * FROM images');
    console.log('Alle Bilder in der Datenbank:', result.getRows());
  } catch (error) {
    console.error('Fehler beim Abrufen der Bilder:', error);
  }
}

/**
 *  Debug function: Displays all users in the database.
 */
export async function showAllUsers() {
  try {
    const result = await connection.runAndReadAll(`SELECT * FROM users`);
    console.log("Alle Benutzer in der Datenbank:", result.getRows());
  } catch (error) {
    console.error("Fehler beim Abrufen der Benutzer:", error);
  }
}

export async function showDatabaseContent() {
  try {
    const result = await connection.runAndReadAll('SELECT * FROM images');
    console.log('Inhalt der Tabelle images:', result.getRows());

    const usersResult = await connection.runAndReadAll("SELECT * FROM users");
    console.log("Alle Benutzer in der Datenbank:", usersResult.getRows());
  } catch (error) {
    console.error('Fehler beim Überprüfen der Datenbank:', error);
  }
}

// Initialize the database when the app starts
await showDatabaseContent();
await showAllUsers();
