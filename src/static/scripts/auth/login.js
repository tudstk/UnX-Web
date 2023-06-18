const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  const userData = {
    email: email,
    password: password,
  };

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      const data = await response.json();
      loginMessage.textContent = "Login successful!";
      loginMessage.style.color = "green";
      console.log("Login successful!");
      localStorage.setItem("token", data.token);
      window.location.href = "/src/views/index.html";
    } else {
      const errorData = await response.json();
      loginMessage.textContent = "Login failed!";
      loginMessage.style.color = "red";
      console.log(errorData.error);
    }
  } catch (error) {
    console.error("An error occurred during login:", error);
  }
});
