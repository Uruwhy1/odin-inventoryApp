const ul = document.querySelector("ul");

document.getElementById("searchBooks").addEventListener("input", function () {
  const searchQuery = this.value.toLowerCase();
  const books = document.querySelectorAll("ul li");

  books.forEach((book) => {
    const title = book.querySelector("strong").textContent.toLowerCase();
    const description = book.querySelector("p").textContent.toLowerCase();

    if (title.includes(searchQuery) || description.includes(searchQuery)) {
      book.style.display = "";
    } else {
      book.style.display = "none";
    }
  });
});