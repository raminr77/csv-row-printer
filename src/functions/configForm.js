import { changeLabel, debounce, toggleLoading } from "./utils.js";

export function createSelectorItem() {
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

export function createColItem(text, value) {
  const label = document.createElement("label");
  const input = document.createElement("input");
  input.value = value;
  input.type = "checkbox";
  label.classList = "js-checkbox";
  label.appendChild(input);
  label.append(text);
  colsContainer.appendChild(label);
}

export function createLabelsInput(label) {
  const labelRow = document.createElement("div");
  const labelInput = document.createElement("input");

  labelInput.value = label;
  labelRow.classList = "label-edit-row";

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
  rangeStartInput.value = 1;
  rangeEndInput.value = tempData.length;
  return tempData;
}
