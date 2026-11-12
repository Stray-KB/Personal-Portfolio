
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

let storageMethod = "localStorage";

class DAO {
  constructor(key) {
    this.key = key;
  }

  getAll() {
    if (storageMethod === "localStorage") {
      return JSON.parse(localStorage.getItem(this.key)) || [];
    }

    const cookie = document.cookie.split("; ").find(function (item) {
      return item.startsWith(`${this.key}=`);
    }, this);

    return cookie ? JSON.parse(decodeURIComponent(cookie.substring(this.key.length + 1))) : [];
  }

  add(item) {
    const items = this.getAll();
    items.push(item);

    if (storageMethod === "localStorage") {
      localStorage.setItem(this.key, JSON.stringify(items));
    } else {
      document.cookie = `${this.key}=${encodeURIComponent(JSON.stringify(items))}; max-age=31536000; path=/; SameSite=Lax`;
    }
  }
}

const referenceDAO = new DAO("references");
const testimonialDAO = new DAO("testimonials");

function addSeedData(method) {
  storageMethod = method;

  if (referenceDAO.getAll().length === 0) {
    const references = [];

    for (let i = 0; i < 3; i++) {
      const reference = {
        id: Date.now() + i,
        name: faker.person.fullName(),
        company: faker.company.name(),
        email: faker.internet.email(),
      };

      references.push(reference);
      referenceDAO.add(reference);
    }

    references.forEach(function (reference) {
      testimonialDAO.add({
        comment: faker.lorem.sentence(),
        rating: faker.number.int({ min: 3, max: 5 }),
        referenceId: reference.id,
      });
    });
  }
}

addSeedData("localStorage");
addSeedData("cookies");

const referenceList = document.querySelector("#reference-list");
const averageRating = document.querySelector("#average-rating");
const referenceForm = document.querySelector("#reference-form");
const formMessage = document.querySelector("#form-message");

storageMethod = storageSelector.value;

function displayReferences() {
  const references = referenceDAO.getAll();
  const testimonials = testimonialDAO.getAll();

  referenceList.innerHTML = "";

  references.forEach(function (reference) {
    const referenceItem = document.createElement("li");
    const referenceDetails = document.createElement("p");

    referenceDetails.textContent = `${reference.name}${reference.company ? ` - ${reference.company}` : ""} (${reference.email})`;

    const testimonialList = document.createElement("ul");

    const referenceTestimonials = testimonials.filter(function (testimonial) {
      return testimonial.referenceId === reference.id;
    });

    referenceTestimonials.forEach(function (testimonial) {
      const testimonialItem = document.createElement("li");

      testimonialItem.textContent = `${testimonial.comment} Rating: ${testimonial.rating}/5`;

      testimonialList.appendChild(testimonialItem);
    });

    referenceItem.appendChild(referenceDetails);
    referenceItem.appendChild(testimonialList);
    referenceList.appendChild(referenceItem);
  });

  if (testimonials.length === 0) {
    averageRating.textContent = "No ratings yet";
  } else {
    const totalRating = testimonials.reduce(function (total, testimonial) {
      return total + testimonial.rating;
    }, 0);

    averageRating.textContent = (totalRating / testimonials.length).toFixed(1);
  }
}

storageSelector.addEventListener("change", function () {
  storageMethod = storageSelector.value;
  displayReferences();
});

referenceForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.querySelector("#reference-name").value.trim();
  const company = document.querySelector("#reference-company").value.trim();
  const email = document.querySelector("#reference-email").value.trim();
  const comment = document.querySelector("#testimonial-comment").value.trim();
  const rating = document.querySelector("#testimonial-rating").value;

  if ((comment && !rating) || (!comment && rating)) {
    formMessage.textContent = "Enter both a comment and rating, or leave both blank.";
    return;
  }

  const referenceId = Date.now();

  referenceDAO.add({
    id: referenceId,
    name: name,
    company: company,
    email: email,
  });

  if (comment && rating) {
    testimonialDAO.add({
      comment: comment,
      rating: Number(rating),
      referenceId: referenceId,
    });
  }

  referenceForm.reset();
  formMessage.textContent = "Reference added!";

  displayReferences();
});

displayReferences();