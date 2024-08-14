document.addEventListener("DOMContentLoaded", function() {
  const firstInput = document.querySelector("input");
  if (firstInput) {
    firstInput.focus();
  }
  
  function toggleNewAuthorField(selectElement) {
    const newAuthorField = document.getElementById("new-author-field");
    if (selectElement.value === "new") {
      newAuthorField.style.display = "block";
    } else {
      newAuthorField.style.display = "none";
    }
  }

  function toggleNewCategoryField(selectElement) {
    const newCategoryField = document.getElementById("new-category-field");
    if (selectElement.value === "new") {
      newCategoryField.style.display = "block";
    } else {
      newCategoryField.style.display = "none";
    }
  }
});
