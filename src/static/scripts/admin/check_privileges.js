function getIsAdminFromToken() {
  const token = localStorage.getItem("token");
  if (token) {
    const [, payload] = token.split(".");
    const decodedPayload = atob(payload);
    const { isAdmin } = JSON.parse(decodedPayload);
    return isAdmin;
  }
  return null;
}
const isAdmin = getIsAdminFromToken();
console.log(isAdmin);
if (!isAdmin) {
  window.location.href = "http://127.0.0.1:5500/src/views/index.html";
}
