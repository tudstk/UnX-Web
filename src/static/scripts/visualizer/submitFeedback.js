const submitStars = document.querySelector("#submit-stars");
const submitStarList = submitStars.children;
let selectedRating = 0;

for (let i = 0; i < submitStarList.length; i++) {
  const star = submitStarList[i];
  star.addEventListener("click", function () {
    selectedRating = i + 1;
    for (let j = 0; j < submitStarList.length; j++) {
      const star = submitStarList[j];
      if (j < selectedRating) {
        star.classList.add("fa-solid");
        star.classList.remove("fa-regular");
      } else {
        star.classList.add("fa-regular");
        star.classList.remove("fa-solid");
      }
    }
  });
}

const feedbackSection = document.getElementById("feedback-section");
const feedbackTextarea = document.getElementById("feedback-textarea");
const submitFeedbackButton = document.getElementById("submit-feedback-button");

submitFeedbackButton.addEventListener("click", () => {
  const username = document.querySelector(".submit-feedback h4").textContent;
  const starRating = document.querySelectorAll(
    ".submit-feedback .fa-solid"
  ).length;
  const feedbackText = feedbackTextarea.value;
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
  const tokenUsername = getUsernameFromToken();
  fetch("http://localhost:3000/user/account/details", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
  })
    .then((response) => response.json())
    .then((accountDetails) => {
      const firstName = accountDetails.first_name; // Extract the first name from account details
      const lastName = accountDetails.last_name; // Extract the last name from account details
      const feedbackData = {
        username: tokenUsername,
        first_name: firstName,
        last_name: lastName,
        feedback: feedbackText,
        stars: starRating,
      };
      console.log("FEEEDBAACK DATAAA", feedbackData);
      fetch("http://localhost:3000/visualizer/feedbacks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      })
        .then((response) => response.json())
        .then((data) => {
          getAllFeedbacks();
          console.log(data.message);
          feedbackTextarea.value = "";
          document.querySelector(".submit-feedback .stars").innerHTML = `
            <i class="fa-sharp fa-solid fa-star"></i>
            <i class="fa-sharp fa-solid fa-star"></i>
            <i class="fa-sharp fa-solid fa-star"></i>
            <i class="fa-sharp fa-solid fa-star"></i>
            <i class="fa-sharp fa-solid fa-star"></i>
          `;
        })
        .catch((error) => {
          console.error(error);
        });
    })
    .catch((error) => {
      console.error(error);
    });
});
