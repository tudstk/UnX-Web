// Function to extract the username from the URL
function getUsernameFromURL() {
  const url = window.location.href;
  const parts = url.split("/");
  return parts[parts.length - 1];
}

// Function to display the username on the page
function displayUsername() {
  const usernamePlaceholder = document.getElementById("username-placeholder");
  const username = getUsernameFromURL();
  usernamePlaceholder.textContent = `Hello, ${username}`;
}

// Call the displayUsername function when the page loads
window.addEventListener("DOMContentLoaded", displayUsername);
