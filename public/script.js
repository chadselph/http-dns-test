const dnsEntryList = document.getElementById("results");
const form = document.querySelector("form");

form.addEventListener("submit", event => {
  event.preventDefault();
  apiCall("/dns", {
    hostname: new URL(form.elements.url.value).hostname
  })
    .then(response => response.json())
    .then(response => {
      if (response.results) {
        response.results.forEach(entry => {
          const newListItem = document.createElement("li");
          newListItem.innerText = entry.type + " " + entry.address;
          dnsEntryList.appendChild(newListItem);
        });
        console.log(response.results);
      } else if (response.error) {
        console.log(response.error);
      }
    });
});

function apiCall(url, body) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
}
