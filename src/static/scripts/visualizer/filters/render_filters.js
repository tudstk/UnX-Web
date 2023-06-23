const listaCategorii = ["Educatie", "Mediu", "Rate", "Varste"];

const listaJudete = [
  "Toata tara",
  "Alba",
  "Arad",
  "Arges",
  "Bacau",
  "Bistrita-Nasaud",
  "Botosani",
  "Braila",
  "Brasov",
  "Bucuresti",
  "Buzau",
  "Calarasi",
  "Caras-Severin",
  "Cluj",
  "Constanta",
  "Covasna",
  "Dambovita",
  "Dolj",
  "Galati",
  "Giurgiu",
  "Gorj",
  "Harghita",
  "Hunedoara",
  "Ialomita",
  "Iasi",
  "Ilfov",
  "Maramures",
  "Mehedinti",
  "Mures",
  "Neamt",
  "Olt",
  "Prahova",
  "Salaj",
  "Satu Mare",
  "Sibiu",
  "Suceava",
  "Teleorman",
  "Timis",
  "Tulcea",
  "Vaslui",
  "Valcea",
  "Vrancea",
];

const listaGenuri = ["Femei", "Barbati"];
const listaMedii = ["Rural", "Urban"];

const listaPerioade = [
  "Ultima luna",
  "Ultimele 3 luni",
  "Ultimele 6 luni",
  "Ultimul an",
];

function createDivs(value, parentId, groupName, type) {
  const newInput = document.createElement("input");
  const newLabel = document.createElement("label");
  const lineBreak = document.createElement("br");

  newInput.setAttribute("type", type);
  newInput.setAttribute("id", value);
  newInput.setAttribute("name", groupName);
  newInput.setAttribute("value", value);
  newLabel.setAttribute("for", value);
  newLabel.textContent = value;

  const parentElement = document.getElementById(parentId);

  parentElement.appendChild(newInput);
  parentElement.appendChild(newLabel);
  parentElement.appendChild(lineBreak);
}

listaCategorii.forEach((categorie) =>
  createDivs(categorie, "categorii", "categorie", "radio")
);
listaJudete.forEach((judet) =>
  createDivs(judet, "judete", "judet", "checkbox")
);
listaPerioade.forEach((perioada) =>
  createDivs(perioada, "perioade", "perioada", "radio")
);

document.getElementById("categorii").addEventListener("change", function () {
  const selectedCategory = this.querySelector(
    'input[name="categorie"]:checked'
  ).value;
  if (selectedCategory === "Mediu") {
    createRadioButtons(listaGenuri, "genuri", "gen");
    createRadioButtons(listaMedii, "medii", "mediu");
  } else {
    clearForm("genuri");
    clearForm("medii");
  }
});
function clearForm(formId) {
  const formElement = document.getElementById(formId);
  // formElement.innerHTML = "";
  formElement.parentElement.style.display = "none";
}

document.getElementById("genuri").addEventListener("change", function () {
  const selectedGen = this.querySelector('input[name="gen"]:checked').value;

  const mediiForm = document.getElementById("medii");
  if (selectedGen !== "") {
    mediiForm.parentElement.style.display = "none";
  } else {
    mediiForm.parentElement.style.display = "block";
  }
});

document.getElementById("medii").addEventListener("change", function () {
  const selectedMediu = this.querySelector('input[name="mediu"]:checked').value;

  const genuriForm = document.getElementById("genuri");
  if (selectedMediu !== "") {
    genuriForm.parentElement.style.display = "none";
  } else {
    genuriForm.parentElement.style.display = "block";
  }
});

function createRadioButtons(list, parentId, groupName) {
  const parentElement = document.getElementById(parentId);
  parentElement.innerHTML = ""; // Clear previous radio buttons
  parentElement.parentElement.style.display = "block";

  list.forEach((item) => {
    const newInput = document.createElement("input");
    const newLabel = document.createElement("label");
    const lineBreak = document.createElement("br");

    newInput.setAttribute("type", "radio");
    newInput.setAttribute("id", item);
    newInput.setAttribute("name", groupName);
    newInput.setAttribute("value", item);
    newLabel.setAttribute("for", item);
    newLabel.textContent = item;

    parentElement.appendChild(newInput);
    parentElement.appendChild(newLabel);
    parentElement.appendChild(lineBreak);
  });
}
