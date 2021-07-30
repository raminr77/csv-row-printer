import { showMessage } from "./utils.js";
import { filterCSVData } from "./csv.js";

export function showCards() {
  if (QRCheckbox.checked && !QRData.value) {
    showMessage("Type Your QR Data!");
    return;
  }
  let checkedItem = [];
  searchInput.value = "";
  let allCheckBoxes = document.querySelectorAll(".js-checkbox input:checked");
  allCheckBoxes.forEach((item) => checkedItem.push(parseInt(item.value)));
  filterCSVData(checkedItem);
}

export function createCard(cardData = [], selectedCols = [], headerText, footerText) {
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
  cardContent.classList = "card-content";
  if (RTLCheckbox.checked) {
    cardContent.classList.add("is-rtl");
  }
  if (QRColLayoutCheckbox.checked) {
    cardContent.classList.add("is-col");
  }

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
