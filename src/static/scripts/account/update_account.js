function handleFormSubmit(event) {
  event.preventDefault();

  const firstNameInput = document.querySelector('input[name="fName"]');
  const lastNameInput = document.querySelector('input[name="lName"]');
  const firstName = firstNameInput.value;
  const lastName = lastNameInput.value;

  const token = localStorage.getItem("token");

  const data = {
    firstName,
    lastName,
  };

  fetch("http://localhost:3000/user/account/details", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Account updated successfully");
        successMessage.style.display = "block";
      } else {
        alert("An error occurred while updating the account.");
        console.error("Error updating account");
      }
    })
    .catch((error) => {
      alert("An error occurred while updating the account.");
      console.error("Error updating account:", error);
    });
}

accountDetailsForm.addEventListener("submit", handleFormSubmit);
