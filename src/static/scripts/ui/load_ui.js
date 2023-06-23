function logout() {
  localStorage.removeItem("token");
  window.location.href = "/src/views/login.html";
}

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

function updateUI() {
  const accountElement = document.querySelector(".account");
  const accountLinkElement = document.querySelector(".account_link");
  const username = getUsernameFromToken();
  if (username) {
    accountElement.style.display = "none";
    accountLinkElement.style.display = "none";
    const nav = document.querySelector("nav");

    const userContainer = document.createElement("div");
    userContainer.style.display = "flex";
    userContainer.style.alignItems = "center";
    const logoutElement = document.createElement("span");
    logoutElement.textContent = "Logout";

    const usernameLink = document.createElement("a");
    usernameLink.href = `account.html`;
    usernameLink.textContent = username;
    usernameLink.style.fontStyle = "italic";
    usernameLink.style.textDecoration = "underline";

    userContainer.appendChild(usernameLink);

    nav.appendChild(userContainer);
  } else {
    accountElement.style.display = "block";
  }
}
window.addEventListener("DOMContentLoaded", function () {
  updateUI();
});

const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "/src/views/login.html";
}
