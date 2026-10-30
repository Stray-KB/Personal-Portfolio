const projects = [
  {
    title: "First Project",
    url: "http://link.to.first.com",
    description: "my first project, its pretty cool.",
  },
  {
    title: "Second Project",
    url: "http://link.to.second.com",
    description: "my second project, its pretty cooler",
  },
  {
    title: "Third Project",
    url: "https://link.to.third.com",
    description: "My Third Project, its the coolest",
  },
];

const projectList = document.createElement("ul");

projects.forEach(function (project) {
  const listItem = document.createElement("li");
  listItem.className = "project";

  const link = document.createElement("a");
  link.setAttribute("href", project.url);

  const title = document.createElement("h3");
  title.textContent = project.title;

  const description = document.createElement("p");
  description.textContent = project.description;

  link.appendChild(title);
  link.appendChild(description);
  listItem.appendChild(link);
  projectList.appendChild(listItem);
});

document.querySelector("#projects").appendChild(projectList);
