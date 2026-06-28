import { createCard } from "./card.js";
import { showMessage, showLoading, hideLoading } from "./utils.js";
import { createColItem, createLabelsInput, createSelectorItem } from "./configForm.js";
import { sliceRange, filterRowByCols } from "../core/core.js";

export function readCSV(csv) {
  if (!Papa || !Papa.parse) {
    showMessage("Server Error");
    return;
  }
  showLoading();
  Papa.parse(csv, {
    // Stream the file row-by-row in a background thread so large files
    // (hundreds of MB) parse without freezing the UI or exhausting memory.
    worker: true,
    skipEmptyLines: "greedy",
    step: (results) => {
      if (results.errors?.length > 0) {
        console.error("CSV parse error: ", results.errors);
      }
      DATA.push(results.data);
    },
    error: (error) => {
      hideLoading();
      console.error("CSV parse error: ", error);
      showMessage("Your file could not be parsed.");
    },
    complete: () => {
      if (DATA.length === 0) {
        hideLoading();
        showMessage("Your file is empty.");
        return;
      }
      COLS_TITLE = DATA.shift();
      colsContainer.innerHTML = "";
      COLS_TITLE.forEach((item, index) => createColItem(item, index));
      configContainer.classList.remove("u-hidden");
      hideLoading();
      createSelectorItem();
      rangeStartInput.value = 1;
      rangeEndInput.max = DATA.length;
      rangeStartInput.max = DATA.length;
      rangeEndInput.value = DATA.length;
    },
  });
}

export function filterCSVData(selectedCols = []) {
  if (selectedCols.length === 0) {
    showMessage("Please select at least one column.");
    return;
  }
  cardsContainer.innerHTML = "";
  labelItemsContainer.innerHTML = "";
  const footerText = footerInput.value;
  const headerText = headerInput.value;
  const CSV_DATA = MERGED_DATA.length > 0 ? MERGED_DATA : DATA;

  const dataTemp = sliceRange(CSV_DATA, rangeStartInput.value, rangeEndInput.value);

  // Batch every card into a fragment so the DOM is touched once, even for
  // tens of thousands of rows.
  const fragment = document.createDocumentFragment();
  let labels = [];
  let hasMissingCols = false;

  dataTemp.forEach((dataItem) => {
    const filteredRowData = filterRowByCols(dataItem, selectedCols);
    if (filteredRowData.length > 0) {
      labels = filteredRowData;
      createCard(filteredRowData, selectedCols, headerText, footerText, fragment);
    } else {
      hasMissingCols = true;
    }
  });

  cardsContainer.appendChild(fragment);

  if (hasMissingCols) {
    showMessage("Some rows are missing the selected columns.", true);
  }

  labels.forEach((_value, index) => {
    createLabelsInput(COLS_TITLE[selectedCols[index]]);
  });
  labelFormContainer.classList.remove("u-hidden");
  resultCount.innerHTML = dataTemp.length;
  labelFormContainer.scrollIntoView({ behavior: "smooth" });
}
