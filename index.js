const projects = [
  {
    id: 1,
    name: "Loomis",
    site: "http://link.to.loomis.com",
    description: "Loomis is a software the brightens looms?",
  },
  {
    id: 2,
    name: "Stackly",
    site: "http://link.to.stackly.com",
    description: "Stackly is a software that stacks things.",
  },
  {
    id: 3,
    name: "Tether",
    site: "https://link.to.tether.com",
    description: "Tether is a software that tethers objects",
  },
];

const projectList = document.createElement("ul");

projects.forEach(function (project) {
  const listItem = document.createElement("li");
  listItem.className = "project";

  const link = document.createElement("a");
  link.setAttribute("href", project.url);

  const title = document.createElement("h2");
  title.textContent = project.title;

  const description = document.createElement("p");
  description.textContent = project.description;

  link.appendChild(title);
  link.appendChild(description);
  listItem.appendChild(link);
  projectList.appendChild(listItem);
});

document.querySelector("#projects").appendChild(projectList);
