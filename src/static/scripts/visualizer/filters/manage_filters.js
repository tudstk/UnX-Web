const filterObject = {
  categorie: "",
  judete: [],
  perioada: "",
};
let filteredData = [];
let selectedOptions = [];

function filterObjectToString(filterObject) {
  // Create a new instance of URLSearchParams
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
  console.log("Query string:", queryString);
  return queryString;
}

document
  .getElementById("apply-filters-btn")
  .addEventListener("click", function () {
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
    console.log("Filter string:", filterString);
    let url = `http://localhost:3000/visualizer/charts/data/${filterString}`;

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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

        if (filterObject.categorie === "mediu") {
          // prelucrarea filtrelor pentru mediu
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
        console.log("filtered DATA:", filteredData);
        console.log(targetArray[1]);
        const title = "Total: " + targetArray[1];
        filteredData.unshift(["Total", total.toString()]);
        pieChart.options.title = title;

        let pieChartData = filteredData;

        if (filterObject.categorie === "rate") {
          pieChartData = [filteredData[0], filteredData[1], filteredData[2]];
        }

        pieChart.data = pieChartData;
        barChart.data = pieChartData;

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
        let startIndex = 0;
        if (filterObject.categorie === "rate") {
          startIndex = 5;
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
