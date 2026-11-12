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

const referenceDAO = new DataAccessObject("references", "localStorage");
const testimonialDAO = new DataAccessObject("testimonials", "localStorage");

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
        .find(item => item.startsWith(`${this.key}=`));
      return cookie ? JSON.parse(decodeURIComponent(cookie.substring(this.key.length + 1))) : [];
    }
  }

  add(item) {
    const items = this.getAll();
    items.push(item);
    if (this.storageMethod === "localStorage") {
      localStorage.setItem(this.key, JSON.stringify(items));
    } else {
      document.cookie = `${this.key}=${encodeURIComponent(JSON.stringify(items))}`;
    }
  }
}

if(referenceDAO.getAll().length === 0) {
for (let i = 0; i < 3; i++) {
  const reference = new Reference(
    i + 1,
    faker.person.fullName(),
    faker.company.name(),
    faker.internet.email()
  );
  referenceDAO.add(reference);
 }
}

if (testimonialDAO.getAll().length === 0) {
  const references = referenceDAO.getAll();
  references.forEach(function(reference) {
    const testimonial = new Testimonial(
      faker.lorem.sentence(),
      faker.number.int({min:1, max:5}),
      reference.id
    );
    testimonialDAO.add(testimonial);
  })
}

const referenceList = document.querySelector("#reference-list");
const averageRating = document.querySelector("#average-rating");

function displayReferences() {
  const references = referenceDAO.getAll();
  const testimonials = testimonialDAO.getAll();

  referenceList.innerHTML = "";

  references.forEach(function(reference) {
    const referenceItem = document.createElement("li");
    const referenceDetails = document.createElement("p");
    referenceDetails.textContent = `${reference.name} - ${reference.company} (${reference.email})`;
    referenceItem.appendChild(referenceDetails);
    referenceList.appendChild(referenceItem);
  });
}