/**
 * Injury Intake Form — script.js
 * ------------------------------
 * Multi-step lead-qualification funnel with 4 branching gates:
 * car accident → damages range → insurance → existing lawyer.
 * Each step fires a step_N_complete dataLayer event; a fully
 * qualified lead also fires lead_qualified with all four answers.
 *
 * Contact step (name/email/phone) validates on submit, formats
 * the phone field live, sends the payload to a webhook via fetch(),
 * then redirects to thank-you.html with the damages range in the URL.
 */

///// STEP 1 - CAR ACCIDENT /////
// Grab the elements we need to work with, once, up front.

const step1 = document.getElementById("step-1");
const step1NextBtn = document.getElementById("step-1-next");
const step1Select = document.getElementById("step-1-select");
const step1Error = document.getElementById("step-1-error");
const step1Disqualified = document.getElementById("step-1-disqualified");
const step2 = document.getElementById("step-2");

step1NextBtn.addEventListener("click", function () {
  const value = step1Select.value;

  if (!value) {
    // Nothing picked yet — show the error message and stop here.
    step1Error.style.display = "block";
    return;
  }

  // A choice was made, so hide any leftover error message.
  step1Error.style.display = "none";

  // Step Data layer push
  dataLayer.push({
    event: "step_1_complete",
    answer: value,
  });

  if (value === "yes") {
    step1.style.display = "none";
    step2.style.display = "block";
  } else {
    step1.style.display = "none";
    step1Disqualified.style.display = "block";
  }
});

///// STEP 2 - DAMAGES /////
// Grab the elements we need to work with, once, up front for step 2.

const step2NextBtn = document.getElementById("step-2-next");
const step2Select = document.getElementById("step-2-select");
const step2Error = document.getElementById("step-2-error");
const step3 = document.getElementById("step-3");

step2NextBtn.addEventListener("click", function () {
  const value = step2Select.value;

  if (!value) {
    // Nothing picked yet — show the error message and stop here.
    step2Error.style.display = "block";
    return;
  }
  // A choice was made, so hide any leftover error message.
  step2Error.style.display = "none";

  // Step Data layer push
  dataLayer.push({
    event: "step_2_complete",
    answer: value,
  });

  step2.style.display = "none"; // hide the card they just answered
  step3.style.display = "block"; // show the next question
});

///// STEP 3 - INSURANCE /////
// Grab the elements we need to work with, once, up front.

const step3NextBtn = document.getElementById("step-3-next");
const step3Select = document.getElementById("step-3-select");
const step3Error = document.getElementById("step-3-error");
const step3Disqualified = document.getElementById("step-3-disqualified");
const step4 = document.getElementById("step-4");

step3NextBtn.addEventListener("click", function () {
  const value = step3Select.value;

  if (!value) {
    // Nothing picked yet — show the error message and stop here.
    step3Error.style.display = "block";
    return;
  }

  // A choice was made, so hide any leftover error message.
  step3Error.style.display = "none";

  // Step Data layer push
  dataLayer.push({
    event: "step_3_complete",
    answer: value,
  });

  if (value === "yes") {
    step3.style.display = "none";
    step4.style.display = "block";
  } else {
    step3.style.display = "none";
    step3Disqualified.style.display = "block";
  }
});

///// STEP 4 - EXISTING LAWYER /////
// Grab the elements we need to work with, once, up front.

const step4NextBtn = document.getElementById("step-4-next");
const step4Select = document.getElementById("step-4-select");
const step4Error = document.getElementById("step-4-error");
const step4Disqualified = document.getElementById("step-4-disqualified");
const step5 = document.getElementById("step-5");

step4NextBtn.addEventListener("click", function () {
  const value = step4Select.value;

  if (!value) {
    // Nothing picked yet — show the error message and stop here.
    step4Error.style.display = "block";
    return;
  }

  // A choice was made, so hide any leftover error message.
  step4Error.style.display = "none";

  // Step Data layer push
  dataLayer.push({
    event: "step_4_complete",
    answer: value,
  });

  if (value === "no") {
    dataLayer.push({
      event: "lead_qualified",
      car_accident: step1Select.value,
      damages_range: step2Select.value,
      has_insurance: step3Select.value,
      has_lawyer: step4Select.value,
    });
    step4.style.display = "none";
    step5.style.display = "block";
  } else {
    step4.style.display = "none";
    step4Disqualified.style.display = "block";
  }
});

// Contact info Validation
const nameInput = document.getElementById("full-name");
const nameError = document.getElementById("error-full-name");
const emailInput = document.getElementById("email");
const emailError = document.getElementById("error-email");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneInput = document.getElementById("phone");
const phoneError = document.getElementById("error-phone");
const phonePattern = /^\d{10}$/;

// Phone mask — runs on every keystroke, not on submit
phoneInput.addEventListener("input", function () {
  let digits = phoneInput.value.replace(/\D/g, "").slice(0, 10);
  let formatted = digits;

  if (digits.length > 6) {
    formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length > 3) {
    formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  } else if (digits.length > 0) {
    formatted = `(${digits}`;
  }

  phoneInput.value = formatted;
});

///// THANK YOU PAGE REDIRECT /////
const intakeForm = document.getElementById("intake-form");

intakeForm.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the default form submission/page reload

  if (!nameInput.value) {
    nameError.style.display = "block";
    return;
  }
  nameError.style.display = "none";

  if (!emailInput.value || !emailPattern.test(emailInput.value)) {
    emailError.style.display = "block";
    return;
  }
  emailError.style.display = "none";

  const digitsOnly = phoneInput.value.replace(/\D/g, "");

  if (!digitsOnly || !phonePattern.test(digitsOnly)) {
    phoneError.style.display = "block";
    return;
  }
  phoneError.style.display = "none";

  fetch("https://webhook.site/5505b06a-ee32-40b8-aa91-6dc235bc6a91", {
    method: "POST",
    headers: { "Content-Type": "text/plain" }, // ← only this line changes
    body: JSON.stringify({
      name: nameInput.value,
      email: emailInput.value,
      phone: digitsOnly,
      damages_range: step2Select.value,
    }),
  })
    .then(function () {
      window.location.href = "thank-you.html?damages=" + step2Select.value;
    })
    .catch(function () {
      // Even if the webhook fails, don't trap the user on the page
      window.location.href = "thank-you.html?damages=" + step2Select.value;
    });
});
