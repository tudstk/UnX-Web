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

const username = getUsernameFromToken();
const htmlUsername = document.querySelector(".username-text");
htmlUsername.textContent = "@" + username;
htmlUsername.style.fontStyle = "italic";
function getAllFeedbacks() {
  fetch("http://localhost:3000/visualizer/feedbacks")
    .then((response) => response.json())
    .then((feedbacks) => {
      const feedbackSection = document.getElementById("feedback-section");
      feedbackSection.innerHTML = "";

      feedbacks.forEach((feedback) => {
        const feedbackCard = document.createElement("div");
        feedbackCard.style.marginTop = "1rem";
        feedbackCard.classList.add("feedback-card");
        feedbackSection.appendChild(feedbackCard);

        const authorSection = document.createElement("div");
        const feedbackUsername = document.createElement("h4");
        const feedbackName = document.createElement("h4");
        feedbackUsername.textContent = "@" + feedback.username;
        feedbackUsername.style.fontStyle = "italic";
        feedbackUsername.style.marginBottom = "0.5rem";
        feedbackName.textContent =
          feedback.first_name + " " + feedback.last_name;
        authorSection.appendChild(feedbackUsername);
        authorSection.appendChild(feedbackName);

        const stars = document.createElement("div");
        stars.classList.add("stars");

        for (let i = 0; i < feedback.stars; i++) {
          const starIcon = document.createElement("i");
          starIcon.classList.add("fa-sharp", "fa-solid", "fa-star");
          stars.appendChild(starIcon);
        }

        const feedbackContent = document.createElement("p");
        feedbackContent.textContent = feedback.feedback;

        // Append the elements to the feedback card
        feedbackCard.appendChild(authorSection);
        feedbackCard.appendChild(stars);
        feedbackCard.appendChild(feedbackContent);

        // Append the feedback card to the feedback section
        feedbackSection.appendChild(feedbackCard);
      });
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      alert("An error occurred while fetching the feedbacks.");
      console.error("An error occurred while fetching the feedbacks:", error);
    });
}
getAllFeedbacks();
