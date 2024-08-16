document.addEventListener("DOMContentLoaded", function () {
  const firstInput = document.querySelector("input");
  if (firstInput) {
    firstInput.focus();
  }
});

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

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get("status");


  if (status === "error") {
    displayMessage(formatMessage());
  }

  function formatMessage() {
    const message = urlParams.get('message');
    if (message.includes('duplicate key value')) {
      return 'A category with that name already exists.'
    }
    return 'Failed to create category.';
  }

  function displayMessage(message) {
    const messageElement = document.getElementById("message");
    if (messageElement) {
      messageElement.textContent = message;
      messageElement.style.color = "red";
      messageElement.style.display = "block";
      messageElement.style.fontWeight = '500'
    }
  }
});
