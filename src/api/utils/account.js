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

function getEmailFromToken() {
  const token = localStorage.getItem("token");
  if (token) {
    const [, payload] = token.split(".");
    const decodedPayload = atob(payload);
    const { email } = JSON.parse(decodedPayload);
    return email;
  }
  return null;
}

function displayUsername() {
  const usernamePlaceholder = document.getElementById("username-placeholder");
  const username = getUsernameFromToken();
  usernamePlaceholder.textContent = `Hello, ${username}`;
}

function setEmailValueFromToken() {
  const emailInput = document.querySelector('input[name="email"]');
  const email = getEmailFromToken();
  emailInput.value = email;
}

window.addEventListener("DOMContentLoaded", setEmailValueFromToken);
window.addEventListener("DOMContentLoaded", displayUsername);
