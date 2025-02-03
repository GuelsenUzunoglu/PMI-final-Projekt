import { writable } from "svelte/store";

/**
 * Creates a reactive store for user authentication status.
 * The values are loaded from localStorage to persist login state across sessions.
 */


// `isLoggedIn` stores whether the user is currently logged in (true/false)
export const isLoggedIn = writable(localStorage.getItem("isLoggedIn") === "true");

// `userEmail` stores the logged-in user's email address
export const userEmail = writable(localStorage.getItem("userEmail") || "");


/**
 * Subscribe to changes in `isLoggedIn` and `userEmail` stores.
 * If the value changes, update localStorage accordingly to persist login data.
 */

isLoggedIn.subscribe((value) => localStorage.setItem("isLoggedIn", String(value)));
userEmail.subscribe((value) => localStorage.setItem("userEmail", value));


/**
 * Additional safeguard to ensure that localStorage is correctly updated
 * in case of an inconsistent state between the store and localStorage.
 */
isLoggedIn.subscribe((value) => {
    if (localStorage.getItem("isLoggedIn") !== String(value)) {
      localStorage.setItem("isLoggedIn", String(value));
    }
  });
  