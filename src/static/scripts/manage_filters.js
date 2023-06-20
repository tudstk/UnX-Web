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
      pieChart.chart.draw(
        google.visualization.arrayToDataTable(pieChart.data),
        pieChart.options
      );
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
