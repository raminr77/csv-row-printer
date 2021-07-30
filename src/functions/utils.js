export function toggleLoading() {
  loading.classList.toggle("is-active");
}

export function showMessage(text, isWarning = false) {
  if (isWarning) {
    message.classList.add("is-warning");
    message.innerHTML = `Warning: ${text}`;
  } else {
    message.classList.remove("is-warning");
    message.innerHTML = `Error: ${text}`;
  }
  message.classList.remove("u-hidden");
}

export function activeUploadButton(isActive = true) {
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

export function changeLabel(labelId, newLabel) {
  const labels = document.querySelectorAll(`[data-label-id='${labelId}']`);
  labels.forEach((label) => {
    label.innerHTML = `${newLabel} : `;
  });
}

export function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction() {
    let context = this;
    let args = arguments;
    let later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

export function searchInCards(searchValue = "") {
  document.querySelectorAll(".card").forEach((card) => {
    let filteredCards = Array.from(card.querySelectorAll(".card-item-value")).filter(
      (value) => value.innerHTML.match(searchValue),
    );
    if (filteredCards.length > 0) {
      card.classList.remove("u-hidden");
    } else {
      card.classList.add("u-hidden");
    }
  });
}

export function resetAllCheckboxes() {
  const allCheckboxes = document.querySelectorAll("input[type=checkbox]:checked");
  if (allCheckboxes.length === 0) return;
  allCheckboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
}
