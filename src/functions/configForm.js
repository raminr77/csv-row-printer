import { changeLabel, debounce } from "./utils.js";
import { mergeRows, CARD_THEMES } from "../core/core.js";

export function createSelectorItem() {
  const noneOption = document.createElement("option");
  noneOption.value = "";
  noneOption.textContent = "None";
  selector.appendChild(noneOption);

  COLS_TITLE.forEach((cols, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = cols;
    selector.appendChild(option);
  });
  selector.disabled = false;
}

export function createThemeOptions() {
  if (themeSelector.options.length > 0) return;
  CARD_THEMES.forEach((theme) => {
    const option = document.createElement("option");
    option.value = theme.key;
    option.textContent = theme.label;
    themeSelector.appendChild(option);
  });
}

export function createColItem(text, value) {
  const label = document.createElement("label");
  const input = document.createElement("input");
  input.value = value;
  input.type = "checkbox";
  label.className = "js-checkbox";
  label.appendChild(input);
  label.append(text);
  colsContainer.appendChild(label);
}

export function createLabelsInput(label) {
  const labelRow = document.createElement("div");
  const labelInput = document.createElement("input");

  labelInput.value = label;
  labelRow.className = "label-edit-row";

  labelRow.appendChild(labelInput);
  labelItemsContainer.appendChild(labelRow);

  labelInput.addEventListener(
    "keyup",
    debounce((e) => {
      changeLabel(label, e.target.value);
    }, 500),
  );
}

export function mergeRow(colIndex) {
  const tempData = mergeRows(DATA, colIndex);
  rangeStartInput.value = 1;
  rangeEndInput.value = tempData.length;
  rangeEndInput.max = tempData.length;
  rangeStartInput.max = tempData.length;
  return tempData;
}
