document
  .getElementById("searchCategories")
  .addEventListener("input", function () {
    const searchQuery = this.value.toLowerCase();
    const categories = document.querySelectorAll("ul li");

    categories.forEach((category) => {
      const title = category.querySelector(".title").textContent.toLowerCase();

      if (title.includes(searchQuery)) {
        category.style.display = "";
      } else {
        category.style.display = "none";
      }
    });
  });

const remove = document.querySelectorAll(".remove");

remove.forEach((item) => {
  item.addEventListener("click", () => {
    const book = item.closest("li");
    item.style.animation = "extend 0.25s linear forwards";

    setTimeout(() => {
      book.style.opacity = "0";
    }, 250);
    setTimeout(() => {
      book.style.display = "none";
    }, 500);
  });
});
