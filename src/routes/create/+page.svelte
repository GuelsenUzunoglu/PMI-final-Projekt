<script>
  // Variables for user input and error messages
  // @ts-ignore
  let file = null; // Datei für den Upload
  let previewUrl = ""; // URL für die Bildvorschau
  let title = "";
  let description = "";
  let selectedSize = "medium"; // Standardgröße setzen
  let showToast = false;
  let toastMessage = "";

  /**
   * Handles drag-over event to prevent the default browser behavior.
   * This allows users to drag files over the upload area.
   */
  // @ts-ignore
  function handleDragOver(event) {
    event.preventDefault(); // Prevents default behavior (open file in new tab)
  }

  // @ts-ignore
  function handleDrop(event) {
    event.preventDefault(); 
    const droppedFile = event.dataTransfer?.files[0];
    if (droppedFile) {
      file = droppedFile;
      previewUrl = URL.createObjectURL(file); 
    }
  }

  /**
   * Handles file selection via the file input field.
   * Updates the selected file and sets a preview image.
   */
  // @ts-ignore
  function handleFileChange(event) {
    const input = event.target;
    if (input?.files?.length > 0) {
      file = input.files[0];
      previewUrl = URL.createObjectURL(file); /// Create an object URL for preview
    }
  }

  /**
   * Handles form submission for image upload.
   * Validates input fields and sends the image data to the server.
   */
  // @ts-ignore
  async function handleSubmit(event) {
    event.preventDefault();

     // **Input validation**
    // @ts-ignore
    if (!file || !title || !description || !selectedSize) {
      toastMessage = "Bitte fülle alle Felder aus und wähle ein Bild.";
      showToast = true;
      setTimeout(() => (showToast = false), 5000);
      return;
    }

    // **Check file size limit (5MB max)**
    if (file.size > 5 * 1024 * 1024) {
      toastMessage = "Die Datei ist zu groß! Maximal 5MB erlaubt.";
      showToast = true;
      setTimeout(() => (showToast = false), 3000);
      return;
    }

    // **Check allowed file types (JPEG, PNG, GIF only)**
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toastMessage = "Falsches Bildformat! Erlaubt: JPG, PNG, GIF.";
      showToast = true;
      setTimeout(() => (showToast = false), 3000);
      return;
    }

    // **Prepare form data**
    const formData = new FormData();
    formData.append("postimage", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("size", selectedSize);

    try {
      // **Send file data to server**
      const response = await fetch("/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Fehler beim Hochladen: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Serverantwort:", result);

      // **Show success notification**
      toastMessage = "Bild wurde erfolgreich hochgeladen!";
      showToast = true;
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);

      // **Reset input fields**
      file = null;
      previewUrl = ""; 
      title = "";
      description = "";
      selectedSize = "medium";
    } catch (error) {
      console.error("Fehler beim Senden des POST-Requests:", error);
      toastMessage = "Upload fehlgeschlagen.";
      showToast = true;
      setTimeout(() => (showToast = false), 3000);
    }
  }
</script>

<!-- Main Container -->
<div class="bg-blue-50 min-h-screen flex items-center justify-center p-6">
  <!-- Container -->
  <div class="bg-white shadow-lg rounded-lg p-6 max-w-5xl w-full flex flex-wrap md:flex-nowrap space-y-8 md:space-y-0 md:space-x-8">
    <!-- Left Side: Drag-and-Drop Upload Area -->
    <div class="md:w-1/2 w-full">
      <h2 class="text-xl font-bold text-gray-700 mb-4">Bild hochladen</h2>
      <div
        on:dragover={handleDragOver}
        on:drop={handleDrop}
        role="button"
        tabindex="0"
        aria-label="Drag-and-Drop-Bereich"
        class="w-full h-64 flex items-center justify-center border-2 border-dashed rounded-lg bg-gray-100 hover:border-blue-500 transition relative"
      >
        {#if previewUrl}
          <img src={previewUrl} alt="Vorschau" class="w-full h-full object-cover rounded-lg" />
        {:else}
          <div class="text-center absolute inset-0 flex flex-col justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-12 w-12 mx-auto text-gray-400 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 16l-4-4-4 4m4-12v16"
              />
            </svg>
            <p class="text-sm text-gray-500">Ziehe ein Bild hierher oder wähle eine Datei aus.</p>
          </div>
        {/if}
      </div>
      <input
        type="file"
        accept="image/*"
        on:change={handleFileChange}
        class="file-input file-input-bordered w-full mt-4"
      />
    </div>

    <!-- Right Side: Image Details Form -->
    <div class="md:w-1/2 w-full bg-blue-100 p-6 rounded-lg">
      <h2 class="text-xl font-bold text-gray-700 mb-4">Details eingeben</h2>
      <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700">Titel</label>
          <input
            id="title"
            type="text"
            placeholder="Titel"
            bind:value={title}
            class="input input-bordered w-full"
          />
        </div>
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">Beschreibung</label>
          <textarea
            id="description"
            placeholder="Beschreibung"
            bind:value={description}
            class="textarea textarea-bordered w-full"
          ></textarea>
        </div>
        <div>
          <label for="size" class="block text-sm font-medium text-gray-700">Bildgröße wählen</label>
          <select
            id="size"
            bind:value={selectedSize}
            class="select select-bordered w-full"
          >
            <option value="small">Klein</option>
            <option value="medium">Mittel</option>
            <option value="large">Groß</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary w-full">Hochladen</button>
      </form>
    </div>
  </div>

  <!-- Toast Notification for Success/Error Messages -->
  <div
    class="fixed bottom-4 right-4 bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
    style="opacity: {showToast ? 1 : 0}; pointer-events: {showToast ? 'auto' : 'none'}"
  >
    {toastMessage}
  </div>
</div>
