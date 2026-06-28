import { readCSV } from "./functions/csv.js";
import { showCards } from "./functions/card.js";
import { mergeRow, createThemeOptions } from "./functions/configForm.js";
import {
  activeUploadButton,
  applyTheme,
  resetAllCheckboxes,
  searchInCards,
  showMessage,
  withLoading,
  debounce,
} from "./functions/utils.js";
import { isValidWidth, isValidHeight, DEFAULT_THEME } from "./core/core.js";

// Populate the card theme dropdown once on load.
createThemeOptions();
THEME = DEFAULT_THEME;

// Events
fileInput.addEventListener("change", (e) => {
  DATA = [];
  COLS_TITLE = [];
  MERGED_DATA = [];
  e.preventDefault();
  resetAllCheckboxes();
  searchInput.value = "";
  selector.innerHTML = "";
  selector.disabled = true;
  cardsContainer.innerHTML = "";
  message.classList.add("u-hidden");
  labelItemsContainer.innerHTML = "";
  configContainer.classList.add("u-hidden");
  labelFormContainer.classList.add("u-hidden");
  const file = e.target.files[0];
  if (!file) {
    activeUploadButton(false);
    showMessage("Please select a CSV file first.");
    return;
  }
  activeUploadButton(true);
  readCSV(file);
});

showBtn.addEventListener("click", (e) => {
  e.preventDefault();
  withLoading(() => showCards());
});

cancelBtn.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.reload();
});

printBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (document.querySelectorAll(".card").length > 0) {
    window.print();
  } else {
    showMessage("Please click the Show button first.");
  }
});

selector.addEventListener("change", (e) => {
  const value = e.target.value;
  if (!value) {
    MERGED_DATA = [];
    return;
  }
  withLoading(() => {
    MERGED_DATA = mergeRow(value);
  });
});

themeSelector.addEventListener("change", (e) => {
  THEME = e.target.value;
  withLoading(() => applyTheme(THEME));
});

QRCheckbox.addEventListener("change", () => {
  QRData.classList.toggle("u-hidden");
});

advancedSettingsCheckbox.addEventListener("change", () => {
  advancedSettingsContainer.classList.toggle("u-hidden");
});

cardWidthInput.addEventListener(
  "keyup",
  debounce((e) => {
    const value = e.target.value;
    if (!isValidWidth(value, window.innerWidth)) {
      showMessage("Your card width is invalid.");
      return;
    }
    withLoading(() => {
      cardsContainer.style.maxWidth = `${value}px`;
    });
  }, 500),
);

cardMinHeightInput.addEventListener(
  "keyup",
  debounce((e) => {
    const value = e.target.value;
    if (!isValidHeight(value, window.innerHeight)) {
      showMessage("Your card height is invalid.");
      return;
    }
    withLoading(() => {
      document
        .querySelectorAll(".card")
        .forEach((card) => (card.style.minHeight = `${value}px`));
    });
  }, 500),
);

searchInput.addEventListener(
  "keyup",
  debounce((e) => {
    withLoading(() => searchInCards(e.target.value));
  }, 500),
);
