import { showMessage } from "./utils.js";
import { filterCSVData } from "./csv.js";
import { resolveQRData, themeClassName } from "../core/core.js";

export function showCards() {
  if (QRCheckbox.checked && !QRData.value) {
    showMessage("Please type your QR data.");
    return;
  }
  let checkedItem = [];
  searchInput.value = "";
  let allCheckBoxes = document.querySelectorAll(".js-checkbox input:checked");
  allCheckBoxes.forEach((item) => checkedItem.push(parseInt(item.value)));
  filterCSVData(checkedItem);
}

export function createCard(
  cardData = [],
  selectedCols = [],
  headerText,
  footerText,
  parent = cardsContainer,
) {
  const card = document.createElement("div");
  const footer = document.createElement("p");
  const header = document.createElement("h3");
  const qrDiv = document.createElement("div");
  const cardContent = document.createElement("div");
  const cardRowContainer = document.createElement("div");

  footer.textContent = footerText;
  header.textContent = headerText;

  card.className = `card ${themeClassName(THEME)}`;
  qrDiv.className = "qr-div";
  cardRowContainer.className = "card-row-container";
  cardContent.className = "card-content";
  if (RTLCheckbox.checked) {
    cardContent.classList.add("is-rtl");
  }
  if (QRColLayoutCheckbox.checked) {
    cardContent.classList.add("is-col");
  }

  if (headerText) {
    card.appendChild(header);
  }

  const labels = selectedCols.map((colIndex) => COLS_TITLE[colIndex]);
  cardData.forEach((value, index) => {
    const row = document.createElement("div");
    const label = labels[index];
    const labelElm = document.createElement("label");
    const valueElm = document.createElement("label");
    row.className = RTLCheckbox.checked ? "card-row is-rtl" : "card-row";
    labelElm.setAttribute("data-label-id", label);
    labelElm.className = "card-item-label";
    valueElm.className = "card-item-value";
    labelElm.textContent = `${label} : `;
    valueElm.textContent = value;
    row.appendChild(labelElm);
    row.appendChild(valueElm);
    cardRowContainer.appendChild(row);
  });

  cardContent.appendChild(cardRowContainer);
  if (QRCheckbox.checked) {
    new QRCode(qrDiv, {
      width: 100,
      height: 100,
      text: resolveQRData(cardData, labels, QRData.value),
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
  parent.appendChild(card);
}
