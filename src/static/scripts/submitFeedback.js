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
  const feedbackData = {
    username: tokenUsername,
    feedback: feedbackText,
    stars: starRating,
  };

  fetch("http://localhost:3000/saveFeedback", {
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
      // Clear input fields and star rating
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
      // Handle any errors that occurred during the fetch request
      console.error(error);
    });
});
