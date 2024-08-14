// yeah i have no clue what the fuck is going on here
document
  .querySelector(".delete-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const form = event.target;
    const actionUrl = form.action;

    fetch(actionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(new FormData(form)),
    })
      .then((response) => {
        if (response.ok) {
          setTimeout(() => {
            const currentUrl = window.location.href;
            const baseUrl = currentUrl.substring(
              0,
              currentUrl.lastIndexOf("/")
            );

            window.location.href = baseUrl + "/";
          }, 500);
        } else {
          alert("Error: Could not delete.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error: Something went wrong.");
      });
  });
