const listaCategorii = ["Educatie", "Mediu", "Rata", "Varsta"];

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
  newInput.setAttribute("name", groupName); // Set the same name for all checkboxes in a category
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

const filterObject = {
  categorie: "",
  judete: [],
  perioada: "",
};
document.getElementById("export-button").addEventListener("click", function () {
  // Reset filterObject fields
  filterObject.categorie = "";
  filterObject.judete = [];
  filterObject.perioada = "";

  // Retrieve selected filters
  const checkboxes = document.querySelectorAll(
    'input[type="checkbox"]:checked'
  );
  checkboxes.forEach(function (checkbox) {
    const value = checkbox.value;
    if (listaJudete.includes(value)) {
      filterObject.judete.push(value);
    }
  });

  const radios = document.querySelectorAll('input[type="radio"]:checked');
  radios.forEach(function (radio) {
    const value = radio.value;
    if (listaCategorii.includes(value)) {
      filterObject.categorie = value;
    }
    if (listaPerioade.includes(value)) {
      filterObject.perioada = value;
    }
  });

  console.log("Filter Object:", filterObject);
});
