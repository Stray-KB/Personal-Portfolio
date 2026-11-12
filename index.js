import { faker } from "@faker-js/faker";

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

  description.style.display = "none";

  title.addEventListener("click", function(event) {
  event.preventDefault();

  if (description.style.display === "none") {
    description.style.display = "block";
  } else {
    description.style.display = "none";
  }
  });

  link.appendChild(title);
  link.appendChild(description);
  listItem.appendChild(link);
  projectList.appendChild(listItem);
});

document.querySelector("#projects").appendChild(projectList);

class Reference {
  constructor(name, company, email, id) {
    this.id = id;
    this.name = name;
    this.company = company;
    this.email = email;
  }
}

class Testimonial {
  constructor(comment, rating, referenceId) {
    this.comment = comment;
    this.rating = rating;
    this.referenceId = referenceId;
  }
}

const referenceDAO = new DataAccessObject("references");
const testimonialDAO = new DataAccessObject("testimonials");

class DataAccessObject {
  constructor(key, storageMethod) {
    this.key = key;
    this.storageMethod = storageMethod;
  }

  getAll() {
    if(this.storageMethod === "localStorage") {
      return JSON.parse(localStorage.getItem(this.key)) || [];
    } else {
      const cookie = document.cookie
        .split("; ")
        .find(item => item.startsWith(`${this.key}=`));\
      return cookie ? JSON.parse(decodeURIComponent(cookie.substring(this.key.length + 1))) : [];
    }
  }

  add(item) {
    const items = this.getAll();
    items.push(item);
    localStorage.setItem(this.key, JSON.stringify(items));
  }
}