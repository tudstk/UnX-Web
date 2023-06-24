const filterObject = {
  categorie: "",
  judete: [],
  perioada: "",
};
let filteredData = [];
let selectedOptions = [];

function filterObjectToString(filterObject) {

  const params = new URLSearchParams();

  // Iterate over the filterObject properties and add them to the URLSearchParams
  for (const [key, value] of Object.entries(filterObject)) {
    // If the value is an array, iterate over its elements and add them as repeated parameters
    if (Array.isArray(value)) {
      for (const item of value) {
        params.append(key, item);
      }
    } else {
      // Otherwise, add the parameter as a single key-value pair
      params.set(key, value);
    }
  }

  // Convert the URLSearchParams to a string
  const queryString = params.toString();
  return queryString;
}

document
  .getElementById("apply-filters-btn")
  .addEventListener("click", function () {
    const checkboxes = document.querySelectorAll(
      'input[type="checkbox"]:checked'
    );

    let toataTara = false;

    checkboxes.forEach(function (checkbox) {
      let value = checkbox.value;
      if (listaJudete.includes(value)) {
        if (value === "Toata tara") {
          filterObject.judete.push("TOTAL");
          selectedOptions.push("TOTAL");
          toataTara = true;
        } else if (toataTara === false) {
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

    let filterString = filterObjectToString(filterObject);
    let url = `http://localhost:3000/visualizer/charts/data/${filterString}`;

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {

        let beautifulData;
        beautifulData = beautifyData(data, filterObject);
        console.log("Received data:", beautifulData);

        let selectedFilters = [];
        const genuriForm = document.getElementById("genuri");
        const mediiForm = document.getElementById("medii");

        filteredData = beautifulData[0];

        // if gender filter is selected
        if (genuriForm.parentElement.style.display !== "none") {
          hasSelectedGender = true;
          const selectedGenuri = Array.from(
            genuriForm.querySelectorAll('input[type="radio"]:checked')
          ).map((radio) => radio.value);

          selectedFilters = selectedFilters.concat(selectedGenuri);
          filteredData = beautifulData[0].filter((entry) => {
            const key = entry[0];
            
            return selectedFilters.some((filter) => key.includes(filter));
          });
        }

        // if rural/urban filter is selected
        if (mediiForm.parentElement.style.display !== "none") {
          const selectedMedii = Array.from(
            mediiForm.querySelectorAll('input[type="radio"]:checked')
          ).map((radio) => radio.value);
          selectedFilters = selectedFilters.concat(selectedMedii);
          filteredData = beautifulData[0].filter((entry) => {
            const key = entry[0];
            return selectedFilters.some((filter) => key.includes(filter));
          });
        }


        // searching for "Total" entry and removing it
        let total = 0;
        let targetArray = [];
        for (let i = 0; i < filteredData.length; i++) {
          if (filteredData[i][0].includes("Total")) {
            targetArray = filteredData[i];
            filteredData.splice(i, 1);
            break;
          }
        }

        total = targetArray[1];
        let title = "Total: " + targetArray[1];

        filteredData.unshift(["Total", "Numar someri"]);

        if(filterObject.categorie === "mediu") {
          title = "Total: " + filteredData[1][1];
          filteredData.splice(1, 1);
        }

        pieChart.options.title = title;

        let pieChartData = filteredData;

        if (filterObject.categorie === "rate") {
          pieChartData = [filteredData[0], filteredData[1], filteredData[2]];
        }

        pieChart.data = pieChartData;
        barChart.data = pieChartData;
        pieChart.chart.draw(
          google.visualization.arrayToDataTable(pieChart.data),
          pieChart.options
        );

        barChart.chart.draw(
          google.visualization.arrayToDataTable(barChart.data),
          pieChart.options
        );

        // generating line chart data -> check bottom of file
        let lineChartData = data[1];

        let totalSomeriData = [["Luna"]];

        let monthIndex = lineChartData[0][1].length - 1;
        let startIndex = 0;

        switch (filterObject.categorie) {
          case "educatie":
            lineChart.options.title = "Procente pe categoria de educatie";
            break;
          case "mediu":
            lineChart.options.title = "Procente pe tipul de mediu si gen";
            break;
          case "rate":
            lineChart.options.title = "Procente pe rata somajului in functie de gen";
            startIndex = 5;
            break;
          case "varsta":
            lineChart.options.title = "Procente pe grupe de varsta";
            break;
          default:
            break;
        }


        for (
          let attributeIndex = startIndex;
          attributeIndex < monthIndex;
          attributeIndex++
        ) {
          totalSomeriData[0].push(lineChartData[0][0][attributeIndex]); // pushing attributes name in chart data
        }

        for (let i = 0; i < lineChartData.length; i++) {
          totalSomeriData[i + 1] = [lineChartData[i][1][monthIndex]];

          for (let j = startIndex; j < monthIndex; j++) {
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
