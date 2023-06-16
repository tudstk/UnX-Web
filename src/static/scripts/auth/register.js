document
  .getElementById("register-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

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
          // registration succeded
          window.location.href = "/src/views/login.html";
        } else {
          // there is an input error

          // Find the div element with the class "invalid-input"
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

            // Append the h5 element to the div
            invalidDiv.appendChild(h5);
          }
        }

        console.log(data.error);
      })
      .catch((error) => {
        console.error(error);
      });
  });
