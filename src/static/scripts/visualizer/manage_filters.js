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

let filteredData = [];
let selectedOptions = [];
document
  .getElementById("apply-filters-btn")
  .addEventListener("click", function () {
    //-- initializing variables -- //

    // -------------------------- //
    filterObject.categorie = "";
    filterObject.judete = [];
    filterObject.perioada = "";

    const checkboxes = document.querySelectorAll(
      'input[type="checkbox"]:checked'
    );

    let toataTara = false;

    checkboxes.forEach(function (checkbox) {
      let value = checkbox.value;
      if (listaJudete.includes(value)) {

        if (value === "Toata tara") {
          filterObject.judete.push('TOTAL');
          selectedOptions.push('TOTAL');
          toataTara = true;
        }

        else if (toataTara === false) {
          filterObject.judete.push(value.toUpperCase());
          selectedOptions.push(value);
        }
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

        monthStatement = filterObject.perioada;
      }

      // Add selected options to selectedOptions array
      selectedOptions.push(value);
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

        (async () => {
          // let beautifulData = await beautifyData(data, filterObject);
          // console.log("Beautiful data:", beautifulData);
        })();

        let selectedFilters = [];
        const genuriForm = document.getElementById("genuri");
        const mediiForm = document.getElementById("medii");

        filteredData = data[0];

        if (genuriForm.parentElement.style.display !== "none") {
          hasSelectedGender = true;
          console.log("genuri form is not none");
          const selectedGenuri = Array.from(
            genuriForm.querySelectorAll('input[type="radio"]:checked')
          ).map((radio) => radio.value.toLowerCase());

          selectedFilters = selectedFilters.concat(selectedGenuri);
          console.log("SELECTED filters:" + selectedFilters);
          filteredData = data[0].filter((entry) => {
            const key = entry[0];
            return selectedFilters.some((filter) => key.includes(filter));
          });
        }

        if (mediiForm.parentElement.style.display !== "none") {
          const selectedMedii = Array.from(
            mediiForm.querySelectorAll('input[type="radio"]:checked')
          ).map((radio) => radio.value.toLowerCase());
          selectedFilters = selectedFilters.concat(selectedMedii);
          filteredData = data[0].filter((entry) => {
            const key = entry[0];
            return selectedFilters.some((filter) => key.includes(filter));
          });
        }

        let total = 0;
        let targetArray = [];
        for (let i = 0; i < filteredData.length; i++) {
          if (filteredData[i][0].includes("total")) {
            console.log(filteredData[i]);
            targetArray = filteredData[i];
            filteredData.splice(i, 1);
            break;
          }
        }

        total = targetArray[1];
        let csv = arrayToCsv(filteredData);

        console.log("filtered DATA:", filteredData);
        console.log(targetArray[1]);
        const title = "Total: " + targetArray[1];
        filteredData.unshift(["Total", total.toString()]);
        pieChart.options.title = title;



        pieChart.data = filteredData;
        barChart.data = filteredData;

        console.log("PIECHART DATA:", pieChart.data);
        pieChart.chart.draw(
          google.visualization.arrayToDataTable(pieChart.data),
          pieChart.options
        );

        barChart.chart.draw(
          google.visualization.arrayToDataTable(barChart.data),
          pieChart.options
        );

        // ------ cod leustean ----- //
        // generating line chart data -> check bottom of file
        let lineChartData = data[1];
        let totalSomeriData = [["Luna"]];
        let monthIndex = lineChartData[0][1].length - 1;

        for (let attributeIndex = 0; attributeIndex < monthIndex; attributeIndex++) {
          totalSomeriData[0].push(lineChartData[0][0][attributeIndex]); // pushing attributes name in chart data
        }

        for (let i = 0; i < lineChartData.length; i++) {
          totalSomeriData[i + 1] = [lineChartData[i][1][monthIndex]];

          for (let j = 0; j < monthIndex; j++) {
            totalSomeriData[i + 1].push(lineChartData[i][1][j]);
          }

        }

        lineChart.data = totalSomeriData;

        lineChart.chart.draw(
          google.visualization.arrayToDataTable(lineChart.data),
          lineChart.options
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

async function beautifyData(filteredData, filterObject) {
  let beautifulData = filteredData;

  switch (filterObject.categorie) {
    case "educatie":
      attributeList = [
        "Total",
        "Fara Studii",
        "Primare",
        "Gimnaziale",
        "Liceale",
        "Postliceale",
        "Profesionale",
        "Universitare",
        "Month"
      ];
      break;
    case "mediu":
      attributeList = [
        "Total",
        "Femei",
        "Barbati",
        "Urban",
        "Urban Femei",
        "Urban Barbati",
        "Rural",
        "Rural Femei",
        "Rural Barbati",
        "Month"
      ];
      break;
    case "rate":
      attributeList = [
        "Total",
        "Femei",
        "Barbati",
        "Indemnizati",
        "Neindemnizati",
        "Rata Somaj",
        "Rata Somaj Femei",
        "Rata Somaj Barbati",
        "Month"
      ];
      break;
    case "varste":
      attributeList = [
        "Total",
        " < 25 ani",
        "25-29 ani ",
        "30-39 ani",
        "40-49 ani",
        "50-55 ani",
        " > 55 ani",
        "Month"
      ];
      break;
    default:
      break;
  }

  for (let i = 0; i < filteredData[0].length; i++) {
    beautifulData[0][i] = attributeList[i];
  }

  for (let i = 0; i < filteredData[1].length; i++) {
    beautifulData[1][i][0] = attributeList;
  }

  return beautifulData;
}