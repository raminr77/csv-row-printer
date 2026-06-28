import { matchSearch, themeClassName, CARD_THEMES } from "../core/core.js";

export function showLoading() {
  loading.classList.add("is-active");
}

export function hideLoading() {
  loading.classList.remove("is-active");
}

/**
 * Show the loading overlay, let the browser actually paint it, then run the
 * (potentially blocking) synchronous `task` and hide the overlay again.
 *
 * The double requestAnimationFrame guarantees the overlay is rendered before
 * the main thread is blocked by `task`. Returns a Promise that resolves once
 * the task has finished.
 */
export function withLoading(task) {
  showLoading();
  return new Promise((resolve, reject) => {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        try {
          resolve(task());
        } catch (error) {
          reject(error);
        } finally {
          hideLoading();
        }
      }),
    );
  });
}

export function showMessage(text, isWarning = false) {
  if (isWarning) {
    message.classList.add("is-warning");
    message.textContent = `Warning: ${text}`;
  } else {
    message.classList.remove("is-warning");
    message.textContent = `Error: ${text}`;
  }
  message.classList.remove("u-hidden");
}

export function activeUploadButton(isActive = true) {
  const UPLOAD_BTN_TEXTS = {
    false: "Select your CSV file",
    true: "File selected",
  };
  customUploadInput.classList.toggle("is-active", isActive);
  uploadBtnText.textContent = UPLOAD_BTN_TEXTS[isActive];
}

export function changeLabel(labelId, newLabel) {
  const labels = document.querySelectorAll(`[data-label-id="${CSS.escape(labelId)}"]`);
  labels.forEach((label) => {
    label.textContent = `${newLabel} : `;
  });
}

export function applyTheme(themeKey) {
  const themeClasses = CARD_THEMES.map((theme) => themeClassName(theme.key));
  document.querySelectorAll(".card").forEach((card) => {
    card.classList.remove(...themeClasses);
    card.classList.add(themeClassName(themeKey));
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
    const values = Array.from(card.querySelectorAll(".card-item-value"));
    const isMatch = values.some((value) => matchSearch(value.textContent, searchValue));
    card.classList.toggle("u-hidden", !isMatch);
  });
}

export function resetAllCheckboxes() {
  const allCheckboxes = document.querySelectorAll("input[type=checkbox]:checked");
  if (allCheckboxes.length === 0) return;
  allCheckboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
}
