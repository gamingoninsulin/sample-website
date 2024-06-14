document
  .getElementById("guestbook-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const message = document.getElementById("message").value;

    // Send guestbook entry to server
    fetch("/api/guestbook", {
      method: "POST",
      body: JSON.stringify({ name, message }),
      headers: { "Content-Type": "application/json" },
    })
      .then((data) => {
        const guestbookEntry = `
              <div class="guestbook-entry">
                <h5>${name}</h5>
                <p>${message}</p>
              </div>
            `;
        document.getElementById("guestbook-container").innerHTML +=
          guestbookEntry;
        document.getElementById("name").value = "";
        document.getElementById("message").value = "";
      })
      .catch((error) => {
        console.error("Error submitting guestbook entry:", error);
      });
  });
