import { readCSV } from "./functions/csv.js";
import { showCards } from "./functions/card.js";
import { mergeRow } from "./functions/configForm.js";
import { activeUploadButton, debounce, showMessage } from "./functions/utils.js";

// Events
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
  showCards();
});

cancelBtn.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.reload();
});

printBtn.addEventListener("click", (e) => {
  e.preventDefault();
  window.print();
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

cardWidthInput.addEventListener(
  "keyup",
  debounce((e) => {
    const value = e.target.value;
    const cardMaxWidth = `${value}px`;
    if (value < 200 || value > window.innerWidth) {
      showMessage("Your width is invalid!");
      return;
    }
    cardsContainer.style.maxWidth = cardMaxWidth;
  }, 500),
);
