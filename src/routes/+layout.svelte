<script>
  import "../app.css";
  import { isLoggedIn, userEmail } from "$lib/stores/auth";
  // @ts-ignore
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
 

$: console.log("Aktueller Benutzername:", $userEmail);

  let searchQuery = "";
  // @ts-ignore
  let searchResults = writable([]);
  let showDropdown = false;

  // Zustand für das Theme
  let theme_dark = window.localStorage.getItem("theme") === "dark" ? true : false;

  // Reaktive Änderungen für das Theme
 // @ts-ignore
  // @ts-ignore
   // @ts-ignore
    // @ts-ignore
      $: window.localStorage.setItem("theme", theme_dark ? "dark" : "light");
 // @ts-ignore
  // @ts-ignore
   // @ts-ignore
    // @ts-ignore
      $: document.documentElement.setAttribute("data-theme", theme_dark ? "dark" : "light");

  // Laden der Login-Informationen aus dem LocalStorage
 // @ts-ignore
  // @ts-ignore
   // @ts-ignore
    // @ts-ignore
      $: {
    const loggedIn = localStorage.getItem("isLoggedIn");
    const email = localStorage.getItem("userEmail");

    console.log("localStorage isLoggedIn:", loggedIn); // Debugging
    console.log("localStorage userEmail:", email); // Debugging

    if (loggedIn === "true") {
      isLoggedIn.set(true);
      userEmail.set(email || "");
    } else {
      isLoggedIn.set(false);
      userEmail.set("");
    }
  }

  // Reaktive Änderungen für LocalStorage
  isLoggedIn.subscribe((value) => {
    localStorage.setItem("isLoggedIn", String(value));
    console.log("isLoggedIn updated:", value); // Debugging
  });

  userEmail.subscribe((value) => {
    localStorage.setItem("userEmail", value);
    console.log("userEmail updated:", value); // Debugging
  });

  // POPUP ---> LOGIN
  let showLoginPopup = false;
  let showLogoutPopup = false;
  let isLogin = true;
  let email = "";
  let password = "";
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  let message = "";
  let toastMessage = "";
  let showToast = false;
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  let toastType = "error";

  // @ts-ignore
  function showToastNotification(message) {
    toastMessage = message;
    showToast = true;
    setTimeout(() => (showToast = false), 3000);
  }

  // Funktion zum Authentifizieren (Login oder Registrierung)
  async function handleAuth() {
  const action = isLogin ? "login" : "register";

  if (!email || !password) {
    showToastNotification("Bitte geben Sie Ihre Zugangsdaten ein.");
    return;
  }

  const response = await fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, email, password }),
  });

  const result = await response.json();

  console.log("Serverantwort:", result);


  if (!response.ok) {
    if (result.error === "Du hast bereits ein Konto, melde dich an!") {
      showToastNotification(result.error);
    } else if (result.error === "Falsches Passwort!") {
      showToastNotification("Falsches Passwort!");
    } else if (result.error === "Nutzer nicht gefunden!") {
      showToastNotification("Dieser Nutzer ist nicht registriert.");
    } else {
      showToastNotification(result.error || "Fehler beim Authentifizieren.");
    }
    return;
  }

  if (result.loggedIn) {
    isLoggedIn.set(true);
    userEmail.set(result.userEmail);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", result.userEmail);
    showToastNotification(result.message);
  }

  // **Popup schließen nach erfolgreichem Login oder Registrierung**
  showLoginPopup = false;

  if (action === "login" ) {
    isLoggedIn.set(true);
    userEmail.set(email);
    showLoginPopup = false;
    showToastNotification("Erfolgreich eingeloggt!");
    // Speichere den Zustand im localStorage
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email);

    console.log("Benutzer ist jetzt eingeloggt:", email);
  }

  if (action === "register" ) {
     showToastNotification("Registrierung erfolgreich!");
    showLoginPopup = false;
  }
}

  // Funktion zum Logout
  function handleLogout() {
    isLoggedIn.set(false);
    userEmail.set("");
    showLogoutPopup = false;

    // Entferne den Zustand aus dem localStorage
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");

    showToastNotification("Erfolgreich ausgeloggt!");
    // Leere die Eingabefelder
    email = "";
    password = "";

    console.log("Benutzer ist jetzt ausgeloggt"); // Debugging
  }

  // Funktion zur Verarbeitung der Suche
  // Funktion zur Verarbeitung der Suche
async function handleSearch() {
  if (searchQuery.trim().length < 3) {
    searchResults.set([]); // Keine Ergebnisse anzeigen, wenn weniger als 3 Zeichen
    showDropdown = false;
    return;
  }

  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
    if (!response.ok) throw new Error("Fehler bei der Suche");

    const results = await response.json();
    searchResults.set(results);
    showDropdown = results.length > 0; // Dropdown nur anzeigen, wenn Ergebnisse existieren
  } catch (error) {
    console.error("Fehler bei der Suche:", error);
    searchResults.set([]); // Leere Ergebnisse bei Fehler
    showDropdown = false;
  }
}
// @ts-ignore
function handleKeyPress(event) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault(); // Prevent any default action
    event.target.click(); // Simulate a click event for accessibility
  }
}


// Funktion zum Schließen des Dropdowns nach Auswahl
function closeDropdown() {
  searchQuery = ""; // Suchfeld leeren
  showDropdown = false; // Dropdown schließen
}

</script>

<header style="background-color: rgb(173, 216, 230)" class="text-white shadow-md">
  <div class="container mx-auto flex items-center justify-between py-3 px-6">
    <!-- Linke Seite: Logo und Navigation -->
    <div class="flex items-center space-x-6">
      <!-- Logo -->
      <img src="/Logo k.png" alt="BloomingGallery Logo" class="h-14 w-14" />

      <!-- Navigation -->
      <nav class="flex space-x-6">
        <a
          href="/"
          class="relative text-[18px] font-bold text-white hover:text-[rgb(25,25,112)] transition-all duration-200 after:block after:h-[2px] after:w-0 after:bg-[rgb(25,25,112)] after:transition-all after:duration-200 after:absolute after:bottom-0 after:left-0 hover:after:w-full"
        >
          Home
        </a>
        <a
          href="/create"
          class="relative text-[18px] font-bold text-white hover:text-[rgb(25,25,112)] transition-all duration-200 after:block after:h-[2px] after:w-0 after:bg-[rgb(25,25,112)] after:transition-all after:duration-200 after:absolute after:bottom-0 after:left-0 hover:after:w-full"
        >
          Create
        </a>
      </nav>
    </div>

    <!-- Mittig: Suchleiste -->
    <div class="relative flex-grow mx-4 search-container">
      <input
        type="text"
        bind:value={searchQuery}
        on:input={handleSearch}
        placeholder="Suche nach ..."
        class={`input input-bordered w-full h-12 pl-12 pr-4 rounded-full shadow ${
          theme_dark ? "text-white bg-gray-800 placeholder-gray-400" : "text-black bg-white placeholder-gray-600"
        }`}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="absolute left-4 top-3 h-6 w-6 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M10.5 4.5a6 6 0 100 12 6 6 0 000-12z" />
      </svg>

      {#if showDropdown}
  <ul
    class={`absolute left-0 w-full shadow-lg mt-1 rounded-lg max-h-60 overflow-y-auto border z-50 ${
      theme_dark ? "bg-gray-800 text-white" : "bg-white text-black"
    }`}
  >
    {#each $searchResults as result}
      <li class="p-2 hover:bg-gray-200">
        <a 
          href={`/image/${result.id}`} 
          class="flex items-center space-x-3 focus:outline-none"
          on:click={closeDropdown}
          on:keydown={handleKeyPress}
          tabindex="0"
        >
          <img src="{result.filepath}" alt="{result.title}" class="w-12 h-12 object-cover rounded-md" />
          <span>{result.title}</span>
        </a>
      </li>
    {/each}
  </ul>
{/if}


    </div>

    <!-- Rechte Seite: Theme-Toggle und Profil -->
    <div class="flex items-center space-x-4">
      <!-- Theme-Toggle -->
      <input
        type="checkbox"
        class="toggle toggle-lg"
        bind:checked={theme_dark}
        aria-label="Toggle Dark Mode"
      />

      <div class="relative">
        <!-- Profil-Icon -->
        <button
          class="flex items-center justify-center w-12 h-12 rounded-full shadow-lg"
          on:click={() => ($isLoggedIn ? (showLogoutPopup = true) : (showLoginPopup = true))}
        >
          <img
            src={$isLoggedIn ? "/logout (1).png" : "/login.png"}
            alt="Profil"
            class="w-10 h-10 rounded-full"
          />
        </button>
      
      </div>
      
  </div>
</header>

<!-- Login / Registrierung Pop-Up -->
{#if showLoginPopup}
<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
  <div class="relative bg-white rounded-xl shadow-lg w-96 p-6">
    <!-- X-Button -->
    <button
      class="absolute top-4 right-4 text-gray-600 text-2xl hover:text-gray-900"
      on:click={() => (showLoginPopup = false)}
    >
      &times;
    </button>

    <h2 class="text-2xl font-bold mb-4">{isLogin ? "Anmelden" : "Registrieren"}</h2>
    <form on:submit|preventDefault={handleAuth} class="space-y-4">
      <input type="email" bind:value={email} placeholder="E-Mail" class="w-full p-2 border rounded" />
      <input type="password" bind:value={password} placeholder="Passwort" class="w-full p-2 border rounded" />
      <button type="submit" class="w-full p-2 bg-blue-500 text-white rounded">{isLogin ? "Anmelden" : "Registrieren"}</button>
    </form>
    <button class="mt-4 text-blue-600 text-sm hover:underline" on:click={() => (isLogin = !isLogin)}>
      {isLogin ? "Noch kein Konto? Jetzt registrieren" : "Bereits registriert? Jetzt anmelden"}
    </button>
  </div>
</div>
{/if}

<!-- Logout-Pop-Up -->
{#if isLoggedIn && showLogoutPopup}
<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
  <div class="relative bg-white rounded-xl shadow-lg w-96 p-6 text-center">
    <!-- X-Button -->
    <button
      class="absolute top-4 right-4 text-gray-600 text-2xl hover:text-gray-900"
      on:click={() => (showLogoutPopup = false)}
    >
      &times;
    </button>

    <h2 class="text-2xl font-bold mb-4">Möchten Sie sich wirklich abmelden?</h2>
    
    <div class="flex justify-center space-x-4">
      <button class="px-4 py-2 bg-gray-300 rounded" on:click={() => (showLogoutPopup = false)}>Abbrechen</button>
      <button class="px-4 py-2 bg-red-500 text-white rounded" on:click={handleLogout}>Abmelden</button>
    </div>
  </div>
</div>
{/if}

<!-- Toast-Benachrichtigung -->
<div class="fixed bottom-4 right-4 bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
  style="opacity: {showToast ? 1 : 0}; pointer-events: {showToast ? 'auto' : 'none'}">
  {toastMessage}
</div>

<main class="p-4">
  <slot />
</main>