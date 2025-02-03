<script>
  // **Import the loaded data from the server**
  // @ts-ignore
  export let data;

   // **Extract image details from the loaded data**
  // @ts-ignore
  const { title, description, filepath } = data.image;
</script>

<!-- Main Container -->
<div class="bg-blue-50 min-h-screen flex flex-col items-center p-6 space-y-6">
  <!-- Navigation -->
  <div class="w-full flex justify-start mb-4">
    <a href="/" class="btn btn-ghost btn-sm">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      <span class="ml-2">Zurück</span>
    </a>
  </div>

  <!-- Main Content Section -->
  <div class="max-w-5xl mx-auto bg-white shadow-lg rounded-lg flex flex-wrap md:flex-nowrap overflow-hidden">
    <!-- Right Side: Image -->
    <div class="md:w-1/2 w-full">
      <img 
        src="{filepath}" 
        alt="{title}" 
        class="w-full h-auto object-contain rounded-lg" 
      />
    </div>

    <!-- Left Side: Image Details -->
    <div class="md:w-1/2 w-full p-6 bg-blue-100 flex flex-col justify-center">
      <h1 class="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
      <p class="text-gray-700 text-lg mb-6 description">{description}</p>

      <!-- Share Link Section -->
      <div>
        <label for="share-link" class="block text-sm font-medium text-gray-600 mb-2">Teilen Sie diesen Link:</label>
        <div class="flex items-center space-x-2">
          <input
            id="share-link"
            type="text"
            value="{window.location.href}"
            readonly
            class="input input-bordered w-full bg-gray-100 cursor-pointer"
          />
          <button
            on:click={() => navigator.clipboard.writeText(window.location.href)}
            class="btn btn-primary"
          >
            Kopieren
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Styles -->
<style>
  /* Ensure the image is displayed properly */
  img {
    display: block;
    max-height: 100%;
    max-width: 100%;
  }

  /* Fix for long descriptions: No cutoff */
  .description {
    white-space: normal; /* Zeilenumbruch erlauben */
    word-wrap: break-word; /* Lange Wörter umbrechen */
    overflow: visible; /* Sicherstellen, dass nichts abgeschnitten wird */
    max-width: 100%; /* Verhindert Überlauf */
  }
</style>
