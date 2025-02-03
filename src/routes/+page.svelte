<script>
  // @ts-nocheck
  // **Receive data from the server**
  export let data;
  // **Reverse images array so the newest images appear first**
  let images = (data.images || []).slice().reverse(); 
  // **Search-related variable (linked to the header search input)**
  export let searchQuery = ""; 
    // **Filtered images array (default: show all images)**
  let filteredImages = images; 

    // **Update filtered images based on search query**
  $: filteredImages = searchQuery
    ? images.filter((image) =>
        image.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : images; // **If no search query, show all images**
</script>

<!-- **Masonry Layout for Image Gallery** -->
<div class="masonry">
  {#each filteredImages as image (image.id)}
    <a
      href={`/image/${image.id}`}
      class="masonry-item"
    >
       <!-- **Image Container** -->
      <div class="image-container">
        <img
          src={image.filepath}
          alt={image.title || "Bild"}
          class="masonry-image"
          loading="lazy"
        />
      </div>
       <!-- **Title & Description Container** -->
      <div class="masonry-text">
        <h2>{image.title || "Kein Titel"}</h2>
        <p>{image.description || "Keine Beschreibung"}</p>
      </div>
    </a>
  {/each}
</div>

<style>
   /* **Masonry Grid Layout** */
  .masonry {
    column-count: 4; /* Anzahl der Spalten */
    column-gap: 1rem; /* Abstand zwischen den Spalten */
  }

  /* **Masonry Item (Each Image Block)** */
  .masonry-item {
    break-inside: avoid; /* Verhindert, dass Elemente zwischen Spalten unterbrochen werden */
    margin-bottom: 1rem;
    background: white;
    border-radius: 0.5rem; /* Abrundung des Containers */
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    text-decoration: none; /* Entfernt Unterstriche bei Links */
    color: inherit; /* Verwendet Standardfarben */
    display: flex;
    flex-direction: column; /* Stellt sicher, dass Bild und Text gestapelt sind */
  }

  .masonry-item:hover {
    transform: scale(1.02);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  }

   /* **Image Container** */
  .image-container {
    width: 100%;
    overflow: hidden; /* Verhindert Überlaufen */
  }

 /* **Images in the Grid** */
  .masonry-image {
    width: 100%; /* Breite auf Container anpassen */
    height: auto; /* Höhe dynamisch an Bildverhältnis anpassen */
    display: block; /* Block-Level für korrekte Anzeige */
    border-radius: 0.5rem 0.5rem 0 0; /* Abrundung der oberen Ecken */
  }

  /* **Text Container** */
  .masonry-text {
    padding: 0.5rem 1rem; /* Abstand für Titel und Beschreibung */
    text-align: left; /* Linksbündiger Text */
  }

  .masonry-text h2 {
    margin: 0;
    font-size: 1rem;
    font-weight: bold;
    color: #333; /* Dunkler Text */
  }

  .masonry-text p {
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
    color: gray; /* Hellerer Text für Beschreibung */
  }
</style>
