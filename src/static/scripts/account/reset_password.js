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

  fetch("http://localhost:3000/user/account/password", {
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
        failMessage.style.display = "none"; // Hide the failure message
      } else {
        alert("An error occurred while updating the password: current password is incorrect or new password and confirm password do not match.");
        console.log("Failed to update password");
        successMessageResetPassword.style.display = "none";
        failMessage.style.display = "block"; // Display the failure message
      }
    })
    .catch((error) => {
      alert("An error occurred while updating the password: current password is incorrect or new password and confirm password do not match.");
      console.error("Error updating password:", error);
    });
}
resetPasswordForm.addEventListener("submit", handlePasswordSubmit);
