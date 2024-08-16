const ul = document.querySelector("ul");

document.getElementById("searchItems").addEventListener("input", function () {
  const searchQuery = this.value.toLowerCase();
  const books = document.querySelectorAll("ul li");

  books.forEach((book) => {
    const title = book.querySelector(".title").textContent.toLowerCase();

    if (title.includes(searchQuery)) {
      book.style.display = "";
    } else {
      book.style.display = "none";
    }
  });
});

const remove = document.querySelectorAll(".remove");

remove.forEach((item) => {
  item.addEventListener("click", () => {
    setTimeout(() => {
      setTimeout(() => {
        book.style.opacity = "0";
      }, 250);
      setTimeout(() => {
        book.style.display = "none";
      }, 500);
    }, 0);
    const book = item.closest("li");
    item.style.animation = "extend 0.25s linear forwards";
  });
});
