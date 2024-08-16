document.addEventListener("DOMContentLoaded", () => {
  const loadingElement = document.querySelector(".loading");

  function showLoadingBar() {
    loadingElement.classList.add("active");
  }
  function hideLoadingBar() {
    setTimeout(() => {
      loadingElement.classList.remove("active");
      setTimeout(() => {
        loadingElement.style.background = "";
      }, 500);
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

    switch (target.id) {
      case "addForm":
        loadingElement.style.background = "lightgreen";
        break;
      case "deleteForm":
        loadingElement.style.background = "red";
        hideLoadingBar(); // 1s delay here
        break;
      case "updateForm":
        loadingElement.style.background = "yellow";
      default:
        break;
    }
  });

  document.addEventListener("submit", function (event) {
    const form = event.target.closest("form");
    event.preventDefault();
    showLoadingBar();

    switch (form.id) {
      case "addForm":
        loadingElement.style.background = "lightgreen";
        break;
      case "deleteForm":
        loadingElement.style.background = "red";
        hideLoadingBar(); // 1s delay here
        break;
      case "updateForm":
        loadingElement.style.background = "yellow";
      default:
        break;
    }

    setTimeout(() => {
      form.submit();
    }, 500); // delay so loading bar fills up
  });
});
