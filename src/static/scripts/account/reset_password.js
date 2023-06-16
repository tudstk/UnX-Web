function handlePasswordSubmit(event) {
  event.preventDefault();

  const currentPasswordInput = document.querySelector(
    'input[name="currentPassword"]'
  );
  const newPasswordInput = document.querySelector('input[name="newPassword"]');
  const confirmPasswordInput = document.querySelector(
    'input[name="confirmPassword"]'
  );
  const currentPassword = currentPasswordInput.value;
  const newPassword = newPasswordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  const token = localStorage.getItem("token");

  const data = {
    currentPassword,
    newPassword,
    confirmPassword,
  };

  fetch("http://localhost:3000/resetPassword", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      console.log(response);
      if (response.ok) {
        console.log("Password updated successfully");
        successMessageResetPassword.style.display = "block";
      } else {
        console.error("Error updating password");
      }
    })
    .catch((error) => {
      console.error("Error updating password:", error);
    });
}

resetPasswordForm.addEventListener("submit", handlePasswordSubmit);
