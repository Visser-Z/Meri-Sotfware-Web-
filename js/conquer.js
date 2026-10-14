// Meri.Conquer page: the hero demo plays one morning of the Reconciler
// and the Credit Controller at work (sample data), then loops.

const demo = document.getElementById('ae-demo');
if (demo) {
  const workers = {
    rc: demo.querySelector('[data-worker="rc"]'),
    cc: demo.querySelector('[data-worker="cc"]'),
  };
  const bar = demo.querySelector('.ae-demo__bar i');
  const rows = [...demo.querySelectorAll('[data-row]')];
  const sums = [...demo.querySelectorAll('[data-count]')];
  const replay = demo.querySelector('.ae-demo__replay');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // What the Reconciler decides for each row, then what the Credit Controller does with it
  const reconciled = {
    paid: ['is-paid', 'Paid'],
    short: ['is-short', 'R3,000 short'],
    late: ['is-late', '12 days late'],
    ask: ['is-ask', 'Asked you'],
  };
  const chased = {
    short: ['is-late', 'Chasing R3,000'],
    late: ['is-late', 'Follow up ready'],
  };

  let timers = [];
  const at = (ms, fn) => timers.push(setTimeout(fn, ms));
  const rand = (n) => 'R' + Math.round(n).toLocaleString('en-ZA').replace(/\s/g, ',');

  const setWorker = (key, on, text) => {
    workers[key].classList.toggle('is-on', on);
    workers[key].querySelector('.ae-worker__state').textContent = text;
  };
  const setPill = (row, [cls, text]) => {
    const pill = row.querySelector('.ae-pill');
    pill.className = 'ae-pill ' + cls;
    pill.textContent = text;
  };
  const countTo = (el, target, ms = 700) => {
    const plain = el.hasAttribute('data-plain');
    const show = (v) => (el.textContent = plain ? String(Math.round(v)) : rand(v));
    const start = performance.now();
    let done = false;
    const step = (now) => {
      if (done) return;
      const t = Math.min(1, (now - start) / ms);
      show(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    // Background tabs pause animation frames; make sure the final figure still lands
    at(ms + 100, () => {
      done = true;
      show(target);
    });
  };

  const reset = () => {
    timers.forEach(clearTimeout);
    timers = [];
    replay.hidden = true;
    bar.style.width = '0';
    setWorker('rc', false, 'Waiting for the statement');
    setWorker('cc', false, 'Waiting for the Reconciler');
    rows.forEach((row) => {
      row.classList.remove('is-focus');
      setPill(row, ['', 'Open']);
    });
    sums.forEach((el) => (el.textContent = el.hasAttribute('data-plain') ? '0' : 'R0'));
  };

  const finalState = () => {
    bar.style.width = '100%';
    setWorker('rc', false, 'Done: 3 matched, 1 for you');
    setWorker('cc', true, '2 follow ups waiting for your OK');
    rows.forEach((row) => {
      const key = row.querySelector('.ae-pill').dataset.final;
      setPill(row, chased[key] || reconciled[key]);
    });
    sums.forEach((el) => {
      const n = Number(el.dataset.count);
      el.textContent = el.hasAttribute('data-plain') ? String(n) : rand(n);
    });
  };

  const play = () => {
    reset();
    at(500, () => {
      setWorker('rc', true, 'Reading the bank statement');
      bar.style.width = '100%';
    });

    // The Reconciler works down the list
    let t = 1900;
    rows.forEach((row) => {
      const key = row.querySelector('.ae-pill').dataset.final;
      at(t, () => {
        rows.forEach((r) => r.classList.toggle('is-focus', r === row));
        setPill(row, ['is-working', 'Matching']);
        setWorker('rc', true, 'Matching ' + row.querySelector('b').textContent);
      });
      at(t + 650, () => setPill(row, reconciled[key]));
      t += 1000;
    });

    at(t, () => {
      rows.forEach((r) => r.classList.remove('is-focus'));
      setWorker('rc', false, 'Done: 3 matched, 1 for you');
      countTo(sums[0], Number(sums[0].dataset.count));
    });

    // The Credit Controller picks up only what's confirmed unpaid
    at(t + 900, () => setWorker('cc', true, 'Writing follow ups'));
    rows.forEach((row) => {
      const key = row.querySelector('.ae-pill').dataset.final;
      if (!chased[key]) return;
      at(t + 1500, () => {
        row.classList.add('is-focus');
        setPill(row, chased[key]);
      });
    });
    at(t + 2300, () => {
      rows.forEach((r) => r.classList.remove('is-focus'));
      setWorker('cc', true, '2 follow ups waiting for your OK');
      countTo(sums[1], Number(sums[1].dataset.count));
      countTo(sums[2], Number(sums[2].dataset.count), 300);
      replay.hidden = false;
    });

    at(t + 9000, play);
  };

  replay.addEventListener('click', play);

  if (reduceMotion) {
    finalState();
  } else {
    play();
  }
}

// Free check form: keep the ad's utm_ tags with the lead, so each request shows which ad it came from.
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
