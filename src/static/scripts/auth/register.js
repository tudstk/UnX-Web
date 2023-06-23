document.addEventListener("DOMContentLoaded", function () {
  const checkbox = document.querySelector('input[type="checkbox"]');
  const registerButton = document.querySelector(".register-btn");

  checkbox.addEventListener("change", function () {
    registerButton.disabled = !this.checked;
  });

  document
    .getElementById("register-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      // Check if the checkbox is checked before proceeding with registration
      if (!checkbox.checked) {
        return;
      }

      // Rest of your code for registration
      const form = event.target;
      const email = form.elements.email.value;
      const username = form.elements.username.value;
      const password = form.elements.password.value;

      const userData = {
        email: email,
        username: username,
        password: password,
      };

      fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (typeof data.error === "undefined") {
            // registration succeeded
            window.location.href = "/src/views/login.html";
          } else {
            // there is an input error
            const invalidDiv = document.querySelector(".invalid-input");
            invalidDiv.innerHTML = "";

            if (data.error == "Invalid password format") {
              const texts = [
                "The password must:",
                "• contain at least one letter",
                "• contain at least one digit",
                "• be at least 6 characters long",
              ];

              texts.forEach((text) => {
                const h5 = document.createElement("h5");
                h5.textContent = text;
                invalidDiv.appendChild(h5);
              });
            } else if (data.error == "Invalid email format") {
              const h5 = document.createElement("h5");
              h5.textContent = data.error;
              invalidDiv.appendChild(h5);
            }
          }

          console.log(data.error);
        })
        .catch((error) => {
          console.error(error);
        });
    });
});
