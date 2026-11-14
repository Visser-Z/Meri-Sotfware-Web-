// WhatsApp chat button, bottom right on every page that loads this script.
// The opening message can be set per page with data-text on the script tag.
(() => {
  const NUMBER = '27817013089';
  const script = document.currentScript;
  const text = (script && script.dataset.text) || "Hi Meri.Software, I saw your website and I'd like to know more.";

  const style = document.createElement('style');
  style.textContent = `
    .wa { position: fixed; right: 16px; bottom: 16px; z-index: 20; width: 58px; height: 58px; border-radius: 50%;
      background: #25d366; display: grid; place-items: center; box-shadow: 0 8px 22px -6px rgba(0, 0, 0, 0.45); }
    .wa:hover { background: #1ebe5b; }
    .wa svg { width: 32px; height: 32px; fill: #fff; }
    .wa:focus-visible { outline: 3px solid #ff5f14; outline-offset: 3px; }
    @media (max-width: 640px) {
      .wa { right: 12px; bottom: 12px; width: 56px; height: 56px; }
      /* The phone button bar makes room for WhatsApp beside it */
      .stick { right: 80px !important; }
    }`;
  document.head.appendChild(style);

  const link = document.createElement('a');
  link.className = 'wa';
  link.href = `https://wa.me/${NUMBER}?text=${encodeURIComponent(text)}`;
  link.target = '_blank';
  link.rel = 'noopener';
  link.setAttribute('aria-label', 'Chat with us on WhatsApp');
  link.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 7L3 29l6.4-2c2 1.1 4.3 1.6 6.6 1.6 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.4c-2.1 0-4.1-.6-5.9-1.6l-.4-.3-3.8 1.2 1.2-3.7-.3-.4c-1.2-1.8-1.8-3.8-1.8-5.9C5 9.9 9.9 5.1 16 5.1s11 4.8 11 10.7-4.9 10.6-11 10.6zm6-7.9c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.8.2l-1 1.3c-.2.2-.4.3-.7.1-.3-.2-1.4-.5-2.7-1.7-1-.9-1.7-2-1.9-2.3-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6l-1-2.5c-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.4 1.4 3.6c.2.2 2.4 3.7 5.9 5.1 2.9 1.1 3.5.9 4.1.8.6-.1 2-.8 2.3-1.6.3-.8.3-1.5.2-1.6-.1-.2-.3-.3-.6-.4z"/></svg>';
  // Counted in Tag Manager as its own event, so WhatsApp chats can become a conversion later
  link.addEventListener('click', () => (window.dataLayer = window.dataLayer || []).push({ event: 'whatsapp_click', lead_page: location.pathname }));
  document.body.appendChild(link);
})();
