// Mobile menu
const toggle = document.querySelector('.nav__toggle');
const menu = document.getElementById('mobile-menu');

toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(open));
});
menu.querySelectorAll('a').forEach((link) =>
  link.addEventListener('click', () => {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  })
);

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// Meri Agents platform preview: switch between the home screen and each app
const platform = document.getElementById('platform');
if (platform) {
  const navs = platform.querySelectorAll('.platform__nav');
  const views = platform.querySelectorAll('.pview');
  const show = (name) => {
    views.forEach((v) => {
      const on = v.dataset.view === name;
      v.hidden = !on;
      v.classList.toggle('is-active', on);
    });
    navs.forEach((n) => {
      const on = n.dataset.view === name;
      n.classList.toggle('is-active', on);
      n.setAttribute('aria-current', on ? 'page' : 'false');
    });
  };
  platform.querySelectorAll('[data-view]').forEach((el) => {
    if (el.matches('.platform__nav, .papp')) el.addEventListener('click', () => show(el.dataset.view));
  });
}

// Prompt typing loop in the platform preview
const typed = document.getElementById('typed');
const prompts = [
  'What’s still owed by the market agents?',
  'Build next month’s procurement plan',
  'Which invoices need my approval?',
  'Summarise this week across all my apps',
];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typed && !reduceMotion) {
  let p = 0;
  let i = 0;
  let deleting = false;

  const tick = () => {
    const text = prompts[p];
    i += deleting ? -1 : 1;
    typed.textContent = text.slice(0, i) || 'Ask Meri to…';

    let delay = deleting ? 30 : 55;
    if (!deleting && i === text.length) {
      deleting = true;
      delay = 1800;
    } else if (deleting && i === 0) {
      deleting = false;
      p = (p + 1) % prompts.length;
      delay = 400;
    }
    setTimeout(tick, delay);
  };
  setTimeout(tick, 1200);
}

// Inside MURR showcase tabs
const showcaseTabs = document.querySelectorAll('.showcase__tab');
showcaseTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    showcaseTabs.forEach((t) => {
      const active = t === tab;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', String(active));
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });
  });
  // Arrow keys move between tabs
  tab.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    const next = showcaseTabs[(index + (event.key === 'ArrowRight' ? 1 : -1) + showcaseTabs.length) % showcaseTabs.length];
    next.focus();
    next.click();
  });
});

// Intro call form (posts to Formspree without leaving the page)
const form = document.getElementById('intro-form');
if (form) {
  const status = document.getElementById('form-status');
  const success = document.getElementById('form-success');
  const submitBtn = form.querySelector('button[type="submit"]');

  const setError = (input, message) => {
    const field = input.closest('.field');
    field.classList.toggle('is-invalid', Boolean(message));
    let note = field.querySelector('.field__error');
    if (message) {
      if (!note) {
        note = document.createElement('span');
        note.className = 'field__error';
        field.appendChild(note);
      }
      note.textContent = message;
    } else if (note) {
      note.remove();
    }
  };

  const validate = () => {
    let firstInvalid = null;
    form.querySelectorAll('[required]').forEach((input) => {
      let message = '';
      if (input.type === 'checkbox') {
        if (!input.checked) message = 'Please tick this box to continue.';
      } else if (!input.value.trim()) message = 'Please fill this in.';
      else if (input.type === 'email' && !input.checkValidity()) message = 'Please enter a valid email address.';
      setError(input, message);
      if (message && !firstInvalid) firstInvalid = input;
    });
    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  };

  form.querySelectorAll('[required]').forEach((input) =>
    input.addEventListener(input.type === 'checkbox' ? 'change' : 'input', () => setError(input, ''))
  );

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = '';
    if (!validate()) return;

    if (form.action.includes('YOUR_FORM_ID')) {
      status.textContent = 'This form isn’t connected yet. Please email VisserMeridian@outlook.com in the meantime.';
      return;
    }

    const data = new FormData(form);
    // Send multiple interests as one readable line
    const interests = data.getAll('interest');
    data.delete('interest');
    data.append('interest', interests.length ? interests.join(', ') : 'Not specified');

    submitBtn.disabled = true;
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(`Formspree responded ${response.status}`);
      form.hidden = true;
      success.hidden = false;
    } catch (error) {
      status.textContent = 'Something went wrong sending your request. Please try again, or email VisserMeridian@outlook.com.';
    } finally {
      submitBtn.disabled = false;
    }
  });
}

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
