const dnsEntryList = document.getElementById("results");
const form = document.querySelector("form");

form.addEventListener("submit", event => {
  const url = form.elements.url.value
  event.preventDefault();
  dnsEntryList.innerHTML = '<div class="loader" />';
  apiCall("/dns", {
    hostname: new URL(url).hostname
  })
    .then(response => response.json())
    .then(response => {
      dnsEntryList.innerHTML = '';
      if (response.results) {
        response.results.forEach(entry => {
          const newListItem = document.createElement("li");
          newListItem.innerText = entry.type + " " + entry.address;
          dnsEntryList.appendChild(newListItem);
          const requestResult = document.createElement("p");
          requestResult.innerHTML = '<div class="loader" />';
          newListItem.appendChild(requestResult);
          apiCall("/request", {url: url, ip: entry.address})
          .then(r => r.json())
            .then(json => {
            if (json.status) {
                requestResult.innerText = json.status;
            } else {
              requestResult.innerText = json.error;
            }
          })
        });
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
