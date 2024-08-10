document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".link");
  const currentUrl = window.location.pathname;

  navItems.forEach((item) => {
    const itemUrl = item.getAttribute("href");

    if (itemUrl === currentUrl) {
      item.classList.add("selected");
      item.classList.remove("unselected");
    }
  });

  navItems.forEach((item) => {
    item.addEventListener("click", () => addSelectedClass(item));
  });

  function addSelectedClass(element) {
    navItems.forEach((item) => {
      item.classList.remove("selected");
    });
    element.classList.add("selected");
    element.classList.remove("unselected");
    console.log("removed!", element.classList)
  }
});
