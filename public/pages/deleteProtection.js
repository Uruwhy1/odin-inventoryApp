document.addEventListener("DOMContentLoaded", () => {
  const deleteForms = document.querySelectorAll("#deleteForm");
  deleteForms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      const categoryName = form.dataset.categoryName || "";
      const authorName = form.dataset.authorName || "";

      if (categoryName === "No Category" || authorName === "No Author") {
        const confirmDelete = confirm(
          `Are you sure you want to delete ${
            categoryName || authorName
          }? \nThis action will delete all books under it.`
        );
        if (!confirmDelete) {
          event.preventDefault();

          const submitButton = form.querySelector('button[type="submit"]');
          if (submitButton) {
            submitButton.style.animation = "";
          }
          location.reload();
        }
      }
    });
  });
});
