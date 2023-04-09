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

  const feedbackCard = document.createElement("div");
  feedbackCard.classList.add("feedback-card");
  feedbackCard.innerHTML = `
              <h4>${username}</h4>
              <div class="stars">
                ${"★".repeat(starRating)}
                ${"☆".repeat(5 - starRating)}
              </div>
              <p>${feedbackText}</p>
            `;

  feedbackSection.insertBefore(
    feedbackCard,
    document.querySelector(".submit-feedback")
  );

  feedbackTextarea.value = "";
  document.querySelector(".submit-feedback .stars").innerHTML = `
              <i class="fa-sharp fa-solid fa-star"></i>
              <i class="fa-sharp fa-solid fa-star"></i>
              <i class="fa-sharp fa-solid fa-star"></i>
              <i class="fa-sharp fa-solid fa-star"></i>
              <i class="fa-sharp fa-solid fa-star"></i>
            `;
});
