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

// The setup call form: js/main.js emails it through Web3Forms. A copy also goes to the Meri Agents
// app, so the lead shows on All clients. Best effort: if the app can't be reached, the email still goes.
const APP_INQUIRY = 'https://meri-agents.vercel.app/api/inquiry';
const introForm = document.getElementById('intro-form');
if (introForm) {
  introForm.addEventListener('submit', () => {
    const required = [...introForm.querySelectorAll('[required]')];
    const valid = required.every((input) =>
      input.type === 'checkbox' ? input.checked : input.value.trim() && (input.type !== 'email' || input.checkValidity()));
    if (!valid) return;                       // main.js shows what's missing; nothing is sent
    const data = Object.fromEntries(new FormData(introForm).entries());
    delete data.access_key;
    fetch(APP_INQUIRY, {
      method: 'POST', mode: 'cors', keepalive: true,
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    }).catch(() => {});
  });
}

const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());
