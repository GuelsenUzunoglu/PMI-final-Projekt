import { searchImages } from "$lib/server/database";

export async function GET({ url }) {
  try {
    const query = url.searchParams.get("q");
    if (!query || query.trim().length < 3) {
      return new Response(JSON.stringify([]), { status: 200 });
    }

    const results = await searchImages(query);
    return new Response(JSON.stringify(results), { status: 200 });
  } catch (error) {
    console.error("Fehler bei der Suchanfrage:", error);
    return new Response(JSON.stringify({ error: "Fehler bei der Suche" }), {
      status: 500,
    });
  }
}

