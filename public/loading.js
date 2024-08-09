document.addEventListener("DOMContentLoaded", () => {
  const loadingElement = document.querySelector(".loading");

  function showLoadingBar() {
    loadingElement.classList.add("active");
  }
  function hideLoadingBar() {
    loadingElement.classList.remove("active");
    setTimeout(() => {
      loadingElement.style.background = "";
    }, 500);
  }

  // Delay so animation always has time to complete
  document.addEventListener("click", function (event) {
    const target = event.target.closest("a");

    if (target && target.href) {
      event.preventDefault();
      showLoadingBar();
      setTimeout(() => {
        location.href = target.href;
      }, 500);
    }
  });

  document.addEventListener("submit", function (event) {
    const form = event.target.closest("form");

    console.log(event.target);
    if (form == document.getElementById("deleteForm")) {
      event.preventDefault();

      console.log("XDJKNGDSNJGKDSJNK");
      loadingElement.style.background = "red";
    }

    if (form) {
      showLoadingBar();
      event.preventDefault();

      setTimeout(() => {
        hideLoadingBar();
        form.submit(); // Submit the form after showing the loading bar
      }, 500);
    }
  });
});
