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

const filterObject = {
  categorie: "",
  judete: [],
  perioada: "",
};

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

document.getElementById("export-button").addEventListener("click", function () {
  filterObject.categorie = "";
  filterObject.judete = [];
  filterObject.perioada = "";

  const checkboxes = document.querySelectorAll(
    'input[type="checkbox"]:checked'
  );
  checkboxes.forEach(function (checkbox) {
    const value = checkbox.value;
    if (listaJudete.includes(value)) {
      filterObject.judete.push(value.toUpperCase());
    }
  });

  const radios = document.querySelectorAll('input[type="radio"]:checked');
  radios.forEach(function (radio) {
    const value = radio.value;
    if (listaCategorii.includes(value)) {
      filterObject.categorie = value.toLowerCase();
    }
    if (listaPerioade.includes(value)) {
      if (value === "Ultima luna") {
        filterObject.perioada = "ultima_luna";
      } else if (value === "Ultimele 3 luni") {
        filterObject.perioada = "ultimele_3_luni";
      } else if (value === "Ultimele 6 luni") {
        filterObject.perioada = "ultimele_6_luni";
      } else if (value === "Ultimul an") {
        filterObject.perioada = "ultimele_12_luni";
      }
    }
  });

  console.log("Filter Object:", filterObject);
  fetch("http://localhost:3000/visualizer/get-data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filterObject),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Received data:", data);
      let total = 0;
      let targetArray = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].includes("total")) {
          console.log(data[i]);
          targetArray = data[i];
          data.splice(i, 1);
          break;
        }
      }
      console.log(targetArray[1]);
      const title = "Total:" + targetArray[1];
      data.unshift(["Judet", "Numar someri"]);
      pieChart.options.title = title;
      pieChart.data = data;
      barChart.data = data;

      pieChart.chart.draw(
        google.visualization.arrayToDataTable(pieChart.data),
        pieChart.options
      );

      barChart.chart.draw(
        google.visualization.arrayToDataTable(barChart.data),
        pieChart.options
      );
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
