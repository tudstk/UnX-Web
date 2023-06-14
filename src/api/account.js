// Function to extract the username from the URL
function getUsernameFromToken() {
  const token = localStorage.getItem("token");
  if (token) {
    const [, payload] = token.split(".");
    const decodedPayload = atob(payload);
    const { username } = JSON.parse(decodedPayload);
    return username;
  }
  return null;
}

// Function to display the username on the page
function displayUsername() {
  const usernamePlaceholder = document.getElementById("username-placeholder");
  const username = getUsernameFromToken();
  usernamePlaceholder.textContent = `Hello, ${username}`;
}

// Call the displayUsername function when the page loads
window.addEventListener("DOMContentLoaded", displayUsername);
