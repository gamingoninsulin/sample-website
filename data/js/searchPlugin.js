const searchQueries = [
  { topic: "topic:minecraft-plugin" },
  { topic: "topic:minecraft-plugin+topic:slimefun" },
  { topic: "topic:minecraft-plugin+topic:slimefun4" },
  { topic: "topic:slimefun" },
  { topic: "topic:slimefun4" },
  { topic: "topic:spigot-plugin" },
  { topic: "topic:bukkit-plugin" },
  { topic: "topic:paper-plugin" },
  { topic: "topic:slimefun-addon" },
];

let allPlugins = [];

window.onload = function () {
  fetchAndDisplayPlugins();
  document
    .getElementById("search-button")
    .addEventListener("click", searchPlugins);
  document
    .getElementById("reset-button")
    .addEventListener("click", resetPlugins);
};

function fetchAndDisplayPlugins() {
  const apiUrls = searchQueries.map(
    (query) => `https://api.github.com/search/repositories?q=${query.topic}`,
  );

  Promise.all(
    apiUrls.map((url) => fetch(url).then((response) => response.json())),
  ).then((data) => {
    const plugins = data.reduce((acc, curr) => acc.concat(curr.items), []);
    const tableBody = document.getElementById("plugin-table-body");
    tableBody.innerHTML = "";

    plugins.forEach((plugin) => {
      const row = document.createElement("tr");

      const imageCell = document.createElement("td");
      const image = document.createElement("img");
      image.src = plugin.owner.avatar_url;
      image.alt = "Plugin Image";
      image.width = 50;
      image.height = 50;
      imageCell.appendChild(image);

      const titleCell = document.createElement("td");
      titleCell.textContent = plugin.name;

      const descriptionCell = document.createElement("td");
      descriptionCell.textContent = plugin.description;

      const authorCell = document.createElement("td");
      authorCell.textContent = plugin.owner.login;

      const versionsCell = document.createElement("td");
      versionsCell.textContent = getSupportedVersions(plugin);

      const downloadCell = document.createElement("td");
      const downloadLink = document.createElement("a");
      downloadLink.href = plugin.html_url;
      downloadLink.textContent = "Download";
      downloadCell.appendChild(downloadLink);

      row.appendChild(imageCell);
      row.appendChild(titleCell);
      row.appendChild(descriptionCell);
      row.appendChild(authorCell);
      row.appendChild(versionsCell);
      row.appendChild(downloadCell);

      tableBody.appendChild(row);
    });

    allPlugins = Array.from(tableBody.rows);
  });
}

function getSupportedVersions(plugin) {
  const versions = plugin.topics;
  let supportedVersions = "";

  versions.forEach((version) => {
    supportedVersions += `${version}, `;
  });

  return supportedVersions.substring(0, supportedVersions.length - 2);
}

function searchPlugins() {
  const searchTerm = document
    .getElementById("search-field")
    .value.toLowerCase();
  const tableBody = document.getElementById("plugin-table-body");
  tableBody.innerHTML = "";

  allPlugins.forEach((row) => {
    const titleCell = row.querySelector("td:nth-child(2)");
    const titleText = titleCell.textContent.toLowerCase();

    if (titleText.includes(searchTerm)) {
      tableBody.appendChild(row);
    }
  });
}

function resetPlugins() {
  const tableBody = document.getElementById("plugin-table-body");
  tableBody.innerHTML = "";
  allPlugins.forEach((row) => {
    tableBody.appendChild(row);
  });
}
