function handleGetAccount() {
  const token = localStorage.getItem("token");

  fetch("http://localhost:3000/user/account/details", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const firstNameInput = document.querySelector('input[name="fName"]');
      const lastNameInput = document.querySelector('input[name="lName"]');
      firstNameInput.value = data.first_name;
      lastNameInput.value = data.last_name;
    })
    .catch((error) => {
      console.error("Error retrieving account details:", error);
    });
}

handleGetAccount();
