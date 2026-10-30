const staticProjects = document.getElementById("myProjects");
const ul = document.createElement("ul");

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


Use JavaScript to create an unordered list of at least three list items that describe hypothetical future projects in your "Projects" section. Each list item should have:

A classname of "project".
A nested link.
The href can be "#" or can be to a project you completed from the Computer Programming course. (Use the setAttribute method to set the "href" attribute of your anchor element to equal the url of the project, even if that url is just "#" for now; if you're using an actual url, also set the "target" attribute equal to "_blank" so that link opens in a new tab.)
It should contain a nested title as a header.
A description as a paragraph.
Create an array of objects that represent the data for each project. Each object should have the following keys (here I'm giving example values for each key):

Title: "My First Project".
URL: "http://link.to.my.first.project.com".
Description: "My first project is the first project I ever made, and it's cool because...".