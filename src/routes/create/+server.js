import { saveImageMetadata } from "$lib/server/database";
import fs from "fs";
import path from "path";

const uploadDir = "./static/uploads";  // Base directory for storing uploaded images

//Handles the file upload request and stores the image on the server.

export async function POST({ request }) {
  try {
     // **Extract form data from the request**
    const formData = await request.formData();

    /** @type {any} */
    const file = formData.get("postimage");
    
    // **Validate if a file was provided**
    if (!file || typeof file.arrayBuffer !== "function" || !file.name) {
      return new Response(
        JSON.stringify({ error: "Ungültige Datei. Bitte wählen Sie ein Bild aus." }),
        { status: 400 }
      );
    }

    // ** Validate file size (Max: 5MB)**
    if (file.size > 5 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ error: "Datei ist zu groß. Maximal 5MB erlaubt." }),
        { status: 400 }
      );
    }

    // ** Validate allowed file types (Only JPG, PNG, GIF)**
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({ error: "Ungültiges Dateiformat. Erlaubt sind: JPG, PNG, GIF." }),
        { status: 400 }
      );
    }

     // **Extract additional form data (title, description, size)**
    const title = formData.get("title");
    const description = formData.get("description");
    const size = formData.get("size");

    // **Validate that required metadata is provided**
    if (!title || typeof title !== "string") {
      return new Response(
        JSON.stringify({ error: "Titel ist erforderlich." }),
        { status: 400 }
      );
    }

    if (!description || typeof description !== "string") {
      return new Response(
        JSON.stringify({ error: "Beschreibung ist erforderlich." }),
        { status: 400 }
      );
    }

    if (!size || typeof size !== "string") {
      return new Response(
        JSON.stringify({ error: "Bildgröße ist erforderlich." }),
        { status: 400 }
      );
    }

  // **Generate unique filename for the uploaded file**
    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(uploadDir, size, filename);

    // **Ensure the upload directory exists**
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.mkdirSync(path.join(uploadDir, size), { recursive: true });
    fs.writeFileSync(filepath, buffer);

    // **Save the uploaded file**
    const relativeFilepath = `/uploads/${size}/${filename}`;
    await saveImageMetadata(title, description, relativeFilepath, size);

    // **Return success response**
    return new Response(
      JSON.stringify({ message: "Bild erfolgreich hochgeladen!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Fehler beim Upload:", error);

     // **Return error response in case of failure**
    return new Response(
      JSON.stringify({ error: "Ein unerwarteter Fehler ist aufgetreten." }),
      { status: 500 }
    );
  }
}
