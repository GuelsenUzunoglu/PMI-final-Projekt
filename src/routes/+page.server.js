import { getAllImages } from '$lib/server/database';

export async function load() {
  try {
    const images = await getAllImages(); // Fetch images from the database
    return { images }; // Return images to the frontend
  } catch (error) {
    console.error('Error loading images:', error);
    return { images: [] }; // Return an empty array on error
  }
}
