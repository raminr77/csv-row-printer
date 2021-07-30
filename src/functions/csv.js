import { createCard } from "./card.js";
import { showMessage, toggleLoading } from "./utils.js";
import { createColItem, createLabelsInput, createSelectorItem } from "./configForm.js";

export function readCSV(csv) {
  if (!Papa || !Papa.parse) {
    showMessage("Server Error");
    return;
  }
  toggleLoading();
  Papa.parse(csv, {
    step: (results) => {
      if (results.errors?.lenght > 0) {
        showMessage("Your File Has A Problem.");
        console.error("Error: ", results.errors);
      }
      DATA.push(results.data);
    },
    complete: () => {
      COLS_TITLE = DATA.shift();
      colsContainer.innerHTML = "";
      COLS_TITLE.map((item, index) => createColItem(item, index));
      configContainer.classList.remove("u-hidden");
      toggleLoading();
      createSelectorItem();
      DATA.pop(); // remove empty row
      rangeStartInput.value = 1;
      rangeEndInput.max = DATA.length;
      rangeStartInput.max = DATA.length;
      rangeEndInput.value = DATA.length;
    },
  });
}

export function filterCSVData(selectedCols = []) {
  if (selectedCols.length === 0) {
    showMessage("Select the columns you want!");
    return;
  }
  cardsContainer.innerHTML = "";
  labelItemsContainer.innerHTML = "";
  const footerText = footerInput.value;
  const headerText = headerInput.value;
  const CSV_DATA = MERGED_DATA.length > 0 ? MERGED_DATA : DATA;

  let dataTemp = CSV_DATA.slice(
    parseInt(rangeStartInput.value) - 1,
    parseInt(rangeEndInput.value),
  );
  let labels = [];
  dataTemp.forEach((dataItem) => {
    let filteredRowData = dataItem.filter((itemCol, itemIndex) =>
      selectedCols.includes(itemIndex),
    );
    if (filteredRowData.length > 0) {
      labels = filteredRowData;
      createCard(filteredRowData, selectedCols, headerText, footerText);
    } else {
      showMessage("Some of your lines do not have the columns value!", true);
    }
  });
  labels.forEach((value, index) => {
    createLabelsInput(COLS_TITLE[selectedCols[index]]);
  });
  labelFormContainer.classList.remove("u-hidden");
  resultCount.innerHTML = dataTemp.length;
  labelFormContainer.scrollIntoView({ behavior: "smooth" });
}
