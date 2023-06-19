const crypto = require("crypto");
const { parse } = require("querystring");
const bcrypt = require("bcrypt");

const pool = require("../../utils/db_connection").pool;
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
                ${`<i class="fa-sharp fa-solid fa-star"></i>`.repeat(
                  starRating
                )}
                ${`<i class="fa-sharp fa-regular fa-star"></i>`.repeat(
                  5 - starRating
                )}
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

async function saveFeedback(req, res) {
  try {
    let requestBody = "";

    req.on("data", (chunk) => {
      requestBody += chunk;
    });

    req.on("end", async () => {
      const { username, feedback, stars } = JSON.parse(requestBody);

      // Validate username, content, and stars
      if (!username || !feedback || !stars) {
        res.statusCode = 400; // Bad Request status code
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Invalid feedback data" }));
        return;
      }

      const query =
        "INSERT INTO feedback (username, feedback, stars) VALUES ($1, $2, $3)";
      await pool.query(query, [username, feedback, stars]);

      res.statusCode = 201; // Setting success status code
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "Feedback saved successfully!" }));
    });
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({ error: "An error occurred while saving the feedback." })
    );
  }
}

module.exports = {
  saveFeedback,
};

