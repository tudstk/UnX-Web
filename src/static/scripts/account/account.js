const accountDetailsButton = document.getElementById("accountDetailsButton");
const resetPasswordButton = document.getElementById("resetPasswordButton");
accountDetailsButton.addEventListener("click", () => {
  accountDetailsForm.style.display = "block";
  resetPasswordForm.style.display = "none";
  successMessage.style.display = "none";
});
resetPasswordButton.addEventListener("click", () => {
  accountDetailsForm.style.display = "none";
  resetPasswordForm.style.display = "block";
  successMessage.style.display = "none";
});

accountDetailsForm.style.display = "block";
resetPasswordForm.style.display = "none";

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

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/src/views/login.html";
}

const logoutButton = document.getElementById("logoutButton");
logoutButton.addEventListener("click", logout);

window.addEventListener("DOMContentLoaded", setEmailValueFromToken);
window.addEventListener("DOMContentLoaded", displayUsername);
