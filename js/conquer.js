// Meri.Conquer page. The menu, reveal and enquiry form are handled by js/main.js.

// Keep the ad's utm_ tags with the lead, so each request shows which ad it came from.
// Kept for the visit in sessionStorage, in case the visitor clicks around before filling in the form.
const utmFields = document.querySelectorAll('input[data-utm]');
if (utmFields.length) {
  const params = new URLSearchParams(window.location.search);
  utmFields.forEach((input) => {
    let value = params.get(input.name) || '';
    try {
      if (value) sessionStorage.setItem(input.name, value);
      else value = sessionStorage.getItem(input.name) || '';
    } catch (error) {
      // Storage blocked: the value from this page's link still goes through
    }
    input.value = value;
  });
}

const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());
