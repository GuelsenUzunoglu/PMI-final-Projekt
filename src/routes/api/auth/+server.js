import { connection } from "$lib/server/database";
import bcrypt from "bcrypt";

/**
 * Handles user authentication requests (register & login).
 * Supports two actions: "register" and "login".
 */

// @ts-ignore
export async function POST({ request }) {
  const data = await request.json();
  const { action, email, password } = data;

  console.log("POST-Anfrage erhalten!"); // Debugging log
  console.log("Empfangene Daten:", { action, email, password }); 

  // Ensure email and password are provided
  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: "E-Mail und Passwort sind erforderlich!" }),
      { status: 400 }
    );
  }

  try {
    if (action === "register") {
      // **Check if the user already exists**
      const checkUser = await connection.runAndReadAll(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      if (checkUser.getRows().length > 0) {
        return new Response(
          JSON.stringify({ error: "Du hast bereits ein Konto, melde dich an!" }),
          { status: 409 }
        );
      }

       // **Hash the password before storing**
      // @ts-ignore
      const hashedPassword = await bcrypt.hash(password, 10);
      // @ts-ignore
      // **Insert new user into the database**
      await connection.run(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [email, hashedPassword]
      );

      console.log(`Nutzer registriert: ${email}`); 

      // **Direkt nach der Registrierung einloggen**
      return new Response(
        JSON.stringify({ message: "Registrierung erfolgreich! Du bist jetzt eingeloggt.", loggedIn: true, userEmail: email }),
        { status: 200 }
      );
    }

    if (action === "login") {
      // @ts-ignore
      const result = await connection.runAndReadAll(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      console.log("Abfrageergebnisse:", result.getRows()); 

      if (result.getRows().length === 0) {
        return new Response(
          JSON.stringify({ error: "Nutzer nicht gefunden!" }),
          { status: 404 }
        );
      }

       // **Retrieve user data**
      const user = result.getRows()[0];
      const hashedPassword = user[2]; // Password is stored in column index 2

      // @ts-ignore
      // **Verify password using bcrypt**
      const match = await bcrypt.compare(password, hashedPassword);
      if (!match) {
        return new Response(
          JSON.stringify({ error: "Falsches Passwort!" }),
          { status: 401 }
        );
      }

      console.log(`Nutzer eingeloggt: ${email}`);
      return new Response(
        JSON.stringify({ message: "Login erfolgreich!", loggedIn: true, userEmail: email }),
        { status: 200 }
      );
    }

    /***  Handle Invalid Actions  ***/
    return new Response(JSON.stringify({ error: "Ungültige Aktion!" }), {
      status: 400,
    });
  } catch (error) {
    console.error("Fehler bei der Authentifizierung:", error); 
    return new Response(
      JSON.stringify({ error: "Ein Fehler ist aufgetreten!" }),
      { status: 500 }
    );
  }
}
