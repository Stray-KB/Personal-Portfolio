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

class Reference extends DatabaseObject{
  constructor(name, company, email, id) {
    super();
    this.id = id;
    this.name = name;
    this.company = company;
    this.email = email;
  }

  toString(){
    return `${this.name} - ${this.company} (${this.email})`;
  }
}

class Testimonial extends DatabaseObject {
  constructor(comment, rating, referenceId) {
    super();
    this.comment = comment;
    this.rating = rating;
    this.referenceId = referenceId;
  }

  toString() {
    const references = referenceDAO.getAll();
    const author = references.find(reference => reference.id === this.referenceId);
    return `${this.comment} - ${author ? author.name : "Unknown"} - ${this.rating}/5`;
  }
}

class TestimonialDAO {
  getAll() {
    throw new Error("getAll() isnt overridden")
  }

  create() {
    throw new Error("getAll() isnt overridden")
  }
}

class SessionStorageTestimonialDAO extends TestimonialDAO {
  getAll() {
  const testimonials = JSON.parse(sessionStorage.getItem("testimonials")) || [];
  return testimonials.map(function(testimonial) {
    return new Testimonial(
      testimonial.comment,
      testimonial.rating,
      testimonial.referenceId
    );
  });
}

  create() {
    const testimonials = this.getAll();
    testimonials.push(testimonial);
    sessionStorage.setItem("testimonials", JSON.stringify(testimonials));
  }
}

class CookieStorageTestimonialDAO extends TestimonialDAO {
  getAll() {
    const cookie = document.cookie
      .split("; ")
      .find(item => item.startsWith("testimonials="));
    const testimonials = cookie
      ? JSON.parse(decodeURIComponent(cookie.substring("testimonials=".length))) : [];

    return testimonials.map(function(testimonial) {
      return new Testimonial(
        testimonial.comment,
        testimonial.rating,
        testimonial.referenceId
      );
    });
  }

  create(testimonial) {
    const testimonials = this.getAll();
    testimonials.push(testimonial);

    document.cookie = `testimonials=${encodeURIComponent(JSON.stringify(testimonials))}`;
  }
}

class TestimonialService {
  constructor(testimonialDAO) {
    this.testimonialDAO = testimonialDAO;
  }

  createTestimonial(testimonial) {
    this.testimonialDAO.create(testimonial);
  }
}

class DatabaseObject {
  toString() {
    throw new Error("toString() must be overridden");
  }
}

class DataAccessObject {
  constructor(key, storageMethod) {
    this.key = key;
    this.storageMethod = storageMethod;
  }

  getAll() {
    if (this.storageMethod === "localStorage") {
      return JSON.parse(localStorage.getItem(this.key)) || [];
    } else {
      const cookie = document.cookie
        .split("; ")
        .find((item) => item.startsWith(`${this.key}=`));
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

const referenceDAO = new DataAccessObject("references", "localStorage");

const testimonialStorage = "sessionStorage";

const testimonialDAO = testimonialStorage === "sessionStorage"
  ? new SessionStorageTestimonialDAO()
  : new CookieStorageTestimonialDAO();

const testimonialService = new TestimonialService(testimonialDAO);

if(referenceDAO.getAll().length === 0) {
for (let i = 0; i < 3; i++) {
  const reference = new Reference(
    faker.person.fullName(),
    faker.company.name(),
    faker.internet.email(),
    i + 1
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
    testimonialDAO.createTestimonial(testimonial);
  });
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

    const testimonialList = document.createElement("ul");
    const referenceTestimonials = testimonials.filter(function(testimonial) {
      return testimonial.referenceId === reference.id;
    });

    referenceTestimonials.forEach(function(testimonial) {
      const testimonialItem = document.createElement("li");
      testimonialItem.textContent = `${testimonial.comment} Rating: ${testimonial.rating}/5`;
      testimonialList.appendChild(testimonialItem);
    });

    referenceItem.appendChild(referenceDetails);
    referenceItem.appendChild(testimonialList);
    referenceList.appendChild(referenceItem);
  });

  const totalRating = testimonials.reduce(function(total, testimonial) {
    return total + testimonial.rating;}, 0);

  averageRating.textContent = testimonials.length > 0
    ? (totalRating / testimonials.length).toFixed(1)
    : "0";
}

const referenceForm = document.querySelector("#reference-form");
const formMessage = document.querySelector("#form-message");

referenceForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const name = document.querySelector("#reference-name").value.trim();
  const company = document.querySelector("#reference-company").value.trim();
  const email = document.querySelector("#reference-email").value.trim();
  const comment = document.querySelector("#testimonial-comment").value.trim();
  const rating = document.querySelector("#testimonial-rating").value;

  if ((comment && !rating) || (!comment && rating)) {
    formMessage.textContent = "Enter both a testimonial and rating, or leave both blank.";
    return;
  }

  const referenceId = Date.now();
  const reference = new Reference(name, company, email, referenceId);
  referenceDAO.add(reference);

  if (comment && rating) {
    const testimonial = new Testimonial(comment, Number(rating), referenceId);
    testimonialService.createTestimonial(testimonial);
  }

  referenceForm.reset();
  formMessage.textContent = "Reference added";
  displayReferences();
});

displayReferences();