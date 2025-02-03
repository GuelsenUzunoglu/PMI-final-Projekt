import { connection } from "$lib/server/database";

/**
 * Loads image details from the database based on the provided image ID.
 */
export async function load({ params }) {
  const { id } = params; // Extract image ID from the request parameters

  try {
     // **Retrieve image details from the database based on the provided ID**
    const result = await connection.runAndReadAll(
      `SELECT id, title, description, filepath FROM images WHERE id = ?`, // ID hinzufügen
      [id]
    );

     // **Check if any image was found**
    if (result.getRows().length === 0) {
      throw new Error('Bild nicht gefunden');
    }

    // **Return the image details in a structured format**

    const [row] = result.getRows();
    return {
      image: {
        id: row[0], 
        title: row[1],
        description: row[2],
        filepath: row[3]
      }
    };
  } catch (error) {
    console.error('Fehler beim Laden des Bildes:', error);

    // **Return a 404 error if the image is not found**
    return { status: 404, error: 'Bild nicht gefunden' };
  }
}
