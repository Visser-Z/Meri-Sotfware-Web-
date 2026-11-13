// Two question lead form: email or WhatsApp number, then what they're struggling with most.
// Only the first answer can hold up a send. Posts to Web3Forms like every other form on the site.
// A form can set its own chips (data-jobs, split by |), email subject (data-subject), thank you line
// (data-thanks) and Tag Manager label (data-page). Without them it asks for the free AI Opportunity Map.
// An optional .phone-field asks for a call back number; it hides itself when the first answer is already a phone.
(() => {
  const forms = document.querySelectorAll('.lead-form');
  if (!forms.length) return;

  // Keep the ad's tags with the lead for this visit, so each request shows where it came from
  const params = new URLSearchParams(window.location.search);
  const tracking = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid'].forEach((name) => {
    let value = params.get(name) || '';
    try {
      if (value) sessionStorage.setItem(name, value);
      else value = sessionStorage.getItem(name) || '';
    } catch (error) { /* Storage blocked: the value from this page's link still goes through */ }
    tracking[name] = value;
  });

  const post = async (fields) => {
    const body = new FormData();
    body.append('access_key', '62328122-afea-4965-b488-da9861562fc9');
    Object.entries({ ...tracking, ...fields }).forEach(([name, value]) => { if (value) body.append(name, value); });
    const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body, headers: { Accept: 'application/json' } });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success === false) throw new Error(result.message || `Form service responded ${response.status}`);
  };

  const isEmail = (text) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
  const isPhone = (text) => /^[+\d\s()./-]+$/.test(text) && text.replace(/\D/g, '').length >= 9;
  const JOBS = ['Invoices and payments', 'Retyping documents', 'Quotes and follow ups', 'Reports', 'Email and admin', 'Something else'];

  forms.forEach((form, index) => {
    const input = form.querySelector('.contact-field');
    const other = form.querySelector('.other');
    const chips = form.querySelector('.chips');
    const note = form.querySelector('.error');
    const button = form.querySelector('button[type="submit"]');
    const phoneField = form.querySelector('.phone-field');
    const phoneBox = phoneField && phoneField.closest('.phone-opt');

    const jobs = form.dataset.jobs ? form.dataset.jobs.split('|') : JOBS;
    jobs.forEach((job) => {
      const chip = document.createElement('label');
      const radio = Object.assign(document.createElement('input'), { type: 'radio', name: `struggle-${index}`, value: job });
      const text = document.createElement('span');
      text.textContent = job;
      radio.addEventListener('change', () => {
        other.hidden = job !== 'Something else';
        if (!other.hidden) other.focus();
      });
      chip.append(radio, text);
      chips.appendChild(chip);
    });

    const say = (message) => { note.textContent = message; note.hidden = !message; };
    input.addEventListener('input', () => {
      say('');
      // No need to ask for a number twice
      if (phoneBox) phoneBox.hidden = isPhone(input.value.trim());
    });
    if (phoneField) phoneField.addEventListener('input', () => say(''));

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const contact = input.value.trim();
      const email = isEmail(contact);
      if (!email && !isPhone(contact)) {
        say('Please enter an email address or a phone number.');
        input.focus();
        return;
      }
      const callBack = phoneField && !phoneBox.hidden ? phoneField.value.trim() : '';
      if (callBack && !isPhone(callBack)) {
        say('Please check the phone number, or leave it empty.');
        phoneField.focus();
        return;
      }
      if (form.querySelector('[name="botcheck"]').checked) return;
      say('');
      button.disabled = true;
      const picked = chips.querySelector('input:checked');
      const struggle = picked ? (!other.hidden && other.value.trim()) || picked.value : '';
      try {
        await post({
          from_name: form.dataset.from || 'Meri.Software website',
          // The call back number goes in the subject, so it shows in the inbox without opening the lead
          subject: `${form.dataset.subject || 'AI Opportunity Map request'}: ${contact}${callBack ? `, call ${callBack}` : ''}`,
          contact,
          struggling_with: struggle,
          // Web3Forms uses "email" as the reply address, so only set it for a real one
          email: email ? contact : '',
          phone: callBack || (email ? '' : contact),
          call_back: callBack ? 'Yes, call this number' : '',
          page: window.location.pathname,
        });
        // Tag Manager counts the lead: map_request is the trigger for the Google Ads conversion
        (window.dataLayer = window.dataLayer || []).push({ event: 'map_request', lead_page: form.dataset.page || 'home' });
        if (window.gtag) window.gtag('event', 'generate_lead');
        const done = document.createElement('div');
        done.className = 'done';
        done.setAttribute('role', 'status');
        done.innerHTML = '<p class="big">Got it. Thank you.</p><p></p>';
        done.lastChild.textContent = form.dataset.thanks || 'We\'ll reply within 24 hours with your free map.';
        form.replaceWith(done);
      } catch (error) {
        say('That did not send. Please try again, or email visser@meri-ai.com.');
      } finally {
        button.disabled = false;
      }
    });
  });
})();
