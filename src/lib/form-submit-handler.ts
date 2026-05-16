/**
 * Form submission feedback utilities for improved UX
 * Handles loading states, error display, and visual feedback
 */

interface FormSubmitOptions {
  formId: string;
  submitButtonId: string;
  submitTextId: string;
  loadingText?: string;
  onSubmit?: (form: HTMLFormElement) => Promise<void>;
}

export function initializeFormSubmitHandler(options: FormSubmitOptions) {
  const {
    formId,
    submitButtonId,
    submitTextId,
    loadingText = "Submitting...",
    onSubmit,
  } = options;

  const form = document.getElementById(formId) as HTMLFormElement | null;
  const submitButton = document.getElementById(submitButtonId) as HTMLButtonElement | null;
  const submitText = document.getElementById(submitTextId) as HTMLElement | null;
  const defaultSubmitText = submitText?.textContent || "";

  if (!form || !submitButton) return;

  // Handle form submission
  form.addEventListener("submit", async () => {
    // Clear previous error messages
    clearFieldErrors(form);

    // Show loading state
    submitButton.disabled = true;
    if (submitText) {
      submitText.textContent = loadingText;
    }

    // Call optional custom handler
    if (onSubmit) {
      try {
        await onSubmit(form);
      } catch {
        // Error handling done in onSubmit
        submitButton.disabled = false;
        if (submitText) {
          submitText.textContent = defaultSubmitText;
        }
      }
    }
  });

  // Re-enable button if user makes changes (remove "submitted" state)
  const inputs = form.querySelectorAll("input, textarea, select");
  inputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (form.dataset.submitted !== "true") {
        submitButton.disabled = false;
      }
    });
  });
}

/**
 * Display field-level error messages
 * This is called by the server response handler
 */
export function displayFieldError(formId: string, fieldName: string, errorMessage: string) {
  const form = document.getElementById(formId) as HTMLFormElement | null;
  if (!form) return;

  const field = form.querySelector(`[name="${fieldName}"]`) as HTMLElement | null;
  if (!field) return;

  // Create or update error message element
  let errorEl = field.parentElement?.querySelector(`.field-error[data-field="${fieldName}"]`) as HTMLElement | null;

  if (!errorEl) {
    errorEl = document.createElement("div");
    errorEl.className = "field-error mt-2 text-xs text-rose-600";
    errorEl.setAttribute("data-field", fieldName);
    field.parentElement?.appendChild(errorEl);
  }

  errorEl.textContent = errorMessage;
  (errorEl as HTMLElement).style.display = "block";

  // Add error styling to field
  field.classList.add("border-rose-300", "bg-rose-50");
  field.classList.remove("border-stone-200", "bg-white");
}

/**
 * Clear all field-level error messages from a form
 */
export function clearFieldErrors(form: HTMLFormElement) {
  const errorElements = form.querySelectorAll(".field-error");
  errorElements.forEach((el) => {
    (el as HTMLElement).style.display = "none";
  });

  // Remove error styling from fields
  const fields = form.querySelectorAll("[data-error='true']");
  fields.forEach((field) => {
    field.classList.remove("border-rose-300", "bg-rose-50");
    field.classList.add("border-stone-200", "bg-white");
    field.removeAttribute("data-error");
  });
}

/**
 * Attach form handlers for both quote and booking forms
 * Call this on page load
 */
export function setupFormHandlers() {
  // Quote form
  const quoteForm = document.getElementById("quote-form") as HTMLFormElement | null;
  if (quoteForm) {
    initializeFormSubmitHandler({
      formId: "quote-form",
      submitButtonId: "quote-submit",
      submitTextId: "quote-submit-text",
      loadingText: "Sending request...",
    });
  }

  // Booking form
  const bookingForm = document.getElementById("booking-form") as HTMLFormElement | null;
  if (bookingForm) {
    initializeFormSubmitHandler({
      formId: "booking-form",
      submitButtonId: "booking-submit",
      submitTextId: "booking-submit-text",
      loadingText: "Checking availability...",
    });
  }

  // Contact form
  const contactForm = document.getElementById("contact-form") as HTMLFormElement | null;
  if (contactForm) {
    initializeFormSubmitHandler({
      formId: "contact-form",
      submitButtonId: "contact-submit",
      submitTextId: "contact-submit-text",
      loadingText: "Sending...",
    });
  }
}
