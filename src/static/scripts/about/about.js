const links = document.querySelectorAll(".summary a");

links.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault(); // prevent the default link behavior

    const href = link.getAttribute("href"); // get the href attribute
    const targetElement = document.querySelector(href); // get the target element
    const targetPosition = targetElement.offsetTop; // get the position of the target element

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth", // smooth scrolling transition
    });
  });
});
