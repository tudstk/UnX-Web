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
        "Month",
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
        "Month",
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
        "Month",
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
        "Month",
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
