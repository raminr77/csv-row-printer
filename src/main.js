// elements
const QRData = document.querySelector(".qr-data");
const showBtn = document.querySelector(".show-btn");
const loading = document.querySelector(".u-loading");
const message = document.querySelector(".js-message");
const printBtn = document.querySelector(".print-btn");
const cancelBtn = document.querySelector(".cancel-btn");
const fileInput = document.querySelector(".file-input");
const selector = document.querySelector(".js-selector");
const footerInput = document.querySelector(".footer-input");
const headerInput = document.querySelector(".header-input");
const rangeEndInput = document.querySelector(".js-range-end");
const colsContainer = document.querySelector(".cols-container");
const uploadBtnText = document.querySelector(".upload-btn-text");
const rangeStartInput = document.querySelector(".js-range-start");
const cardsContainer = document.querySelector(".cards-container");
const QRCheckbox = document.querySelector(".js-qr-checkbox input");
const RTLCheckbox = document.querySelector(".js-rtl-checkbox input");
const customUploadInput = document.querySelector(".custom-upload-btn");
const configContainer = document.querySelector(".print-config-container");
const labelFormContainer = document.querySelector(".label-form-container");
const labelItemsContainer = document.querySelector(".label-inputs-container");

// local variable
let DATA = [];
let COLS_TITLE = [];
let MERGED_DATA = [];

// functions
function toggleLoading() {
  loading.classList.toggle("is-active");
}

function createSelectorItem() {
  const noneOption = document.createElement("option");
  noneOption.value = "";
  noneOption.innerHTML = "None";
  selector.appendChild(noneOption);

  COLS_TITLE.map((cols, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.innerHTML = cols;
    selector.appendChild(option);
  });
  selector.disabled = false;
}

function createColItem(text, value) {
  const label = document.createElement("label");
  const input = document.createElement("input");
  input.value = value;
  input.type = "checkbox";
  label.classList = "js-checkbox";
  label.appendChild(input);
  label.append(text);
  colsContainer.appendChild(label);
}

function showMessage(text, isWarning = false) {
  if (isWarning) {
    message.classList.add("is-warning");
    message.innerHTML = `Warning: ${text}`;
  } else {
    message.classList.remove("is-warning");
    message.innerHTML = `Error: ${text}`;
  }
  message.classList.remove("u-hidden");
}

function activeUploadButton(isActive = true) {
  const UPLOAD_BTN_TEXTS = {
    false: "Select Your CSV File",
    true: "Selected Your File",
  };
  if (isActive) {
    customUploadInput.classList.add("is-active");
  } else {
    customUploadInput.classList.remove("is-active");
  }
  uploadBtnText.innerHTML = UPLOAD_BTN_TEXTS[isActive];
}

function readCSV(csv) {
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

function showCarts() {
  if (QRCheckbox.checked && !QRData.value) {
    showMessage("Type Your QR Data!");
    return;
  }
  let checkedItem = [];
  let allCheckBoxes = document.querySelectorAll(".js-checkbox input:checked");
  allCheckBoxes.forEach((item) => checkedItem.push(parseInt(item.value)));
  filterCSVData(checkedItem);
  return checkedItem.length > 0;
}

function changeLabel(labelId, newLabel) {
  const labels = document.querySelectorAll(`[data-label-id='${labelId}']`);
  labels.forEach((label) => {
    label.innerHTML = `${newLabel} : `;
  });
}

function createLabelsInput(label) {
  const labelRow = document.createElement("div");
  const labelInput = document.createElement("input");

  labelInput.value = label;
  labelRow.classList = "label-edit-row";

  labelRow.appendChild(labelInput);
  labelItemsContainer.appendChild(labelRow);

  labelInput.addEventListener("keyup", (e) => {
    changeLabel(label, e.target.value);
  });
}

function mergeRow(colIndex) {
  const keys = {};
  const tempData = [];
  DATA.forEach((item) => {
    if (keys[item[colIndex]]) {
      let tempDataIndex = Object.keys(keys).indexOf(item[colIndex]);
      item.forEach((col, index) => {
        if (item[index] !== tempData[tempDataIndex][index]) {
          tempData[tempDataIndex][index] += `, ${item[index]}`;
        }
      });
    } else {
      keys[item[colIndex]] = true;
      tempData.push(item);
    }
  });
  return tempData;
}

// card functions
function filterCSVData(selectedCols = []) {
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
  cardsContainer.scrollIntoView();
}

function createCard(cardData = [], selectedCols = [], headerText, footerText) {
  const card = document.createElement("div");
  const footer = document.createElement("p");
  const header = document.createElement("h3");
  const qrDiv = document.createElement("div");
  const cardContent = document.createElement("div");
  const cardRowContainer = document.createElement("div");

  footer.innerHTML = footerText;
  header.innerHTML = headerText;

  card.classList = "card";
  qrDiv.classList = "qr-div";
  cardRowContainer.classList = "card-row-container";
  cardContent.classList = RTLCheckbox.checked ? "card-content is-rtl" : "card-content";

  if (headerText) {
    card.appendChild(header);
  }
  let QRColData = "";
  cardData.forEach((value, index) => {
    const row = document.createElement("div");
    const label = COLS_TITLE[selectedCols[index]];
    const labelElm = document.createElement("label");
    const valueElm = document.createElement("label");
    row.classList = RTLCheckbox.checked ? "card-row is-rtl" : "card-row";
    labelElm.setAttribute("data-label-id", label);
    labelElm.classList = "card-item-label";
    valueElm.classList = "card-item-value";
    labelElm.innerHTML = label + " : ";
    valueElm.innerHTML = value;
    row.appendChild(labelElm);
    row.appendChild(valueElm);
    cardRowContainer.appendChild(row);

    if (QRData.value === label) {
      QRColData = value;
    } else {
      QRColData = QRData.value;
    }
  });

  cardContent.appendChild(cardRowContainer);
  if (QRCheckbox.checked) {
    new QRCode(qrDiv, {
      width: 100,
      height: 100,
      text: QRColData,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });
    cardContent.appendChild(qrDiv);
  }
  card.appendChild(cardContent);
  if (footerText) {
    card.appendChild(footer);
  }
  cardsContainer.appendChild(card);
}

// events
fileInput.addEventListener("change", (e) => {
  DATA = [];
  COLS_TITLE = [];
  e.preventDefault();
  selector.innerHTML = "";
  selector.disabled = true;
  message.classList.add("u-hidden");
  labelItemsContainer.innerHTML = "";
  configContainer.classList.add("u-hidden");
  labelFormContainer.classList.add("u-hidden");
  const file = e.target.files[0];
  if (!file) {
    activeUploadButton(false);
    showMessage("First Select Your CSV File.");
    return;
  }
  activeUploadButton(true);
  readCSV(file);
});
showBtn.addEventListener("click", (e) => {
  e.preventDefault();
  showCarts();
});
cancelBtn.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.reload();
});
printBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const result = showCarts();
  if (result) {
    window.print();
  } else {
    window.alert("Error");
  }
});
selector.addEventListener("change", (e) => {
  const value = e.target.value;
  if (!value) {
    MERGED_DATA = [];
    return;
  }
  MERGED_DATA = mergeRow(value);
});
QRCheckbox.addEventListener("change", () => {
  QRData.classList.toggle("u-hidden");
});
