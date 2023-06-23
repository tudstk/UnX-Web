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
// document.getElementById("get-users-btn").addEventListener("click", function () {
//   fetch("http://localhost:3000/admin/users", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       alert("Users fetched successfully!");
//       // Handle the response data
//       console.log(data); // You can perform further processing here
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// });

document
  .getElementById("delete-user-button")
  .addEventListener("click", function () {
    const username = document.getElementById("username-input").value.trim();
    if (username === "") {
      alert("Please enter a username");
      return;
    }

    fetch(`http://localhost:3000/admin/users/${username}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data
        alert("User deleted successfully!");
        console.log(data);
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
      });
  });

document
  .getElementById("register-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const form = event.target;
    const email = form.elements.email.value;
    const username = form.elements.username.value;
    const password = form.elements.password.value;
    const isAdmin = document.getElementById("is-admin-checkbox").checked;

    const userData = {
      email: email,
      username: username,
      password: password,
      isAdmin: isAdmin,
    };

    fetch("http://localhost:3000/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (typeof data.error === "undefined") {
          alert("User added successfully!");
          // registration succeded
          console.log("User added successfully");
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
      })
      .catch((error) => {
        console.error(error);
      });
  });

//delete review button
document
  .getElementById("delete-review-button")
  .addEventListener("click", function () {
    console.log("delete review button clicked");
    const reviewId = document.getElementById("review-id-input").value.trim();
    if (reviewId === "") {
      alert("Please enter a review id");
      return;
    }
    fetch(`http://localhost:3000/admin/feedbacks/${reviewId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data
        console.log(data);
        alert("Feedback deleted successfully!");
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
      });
  });
