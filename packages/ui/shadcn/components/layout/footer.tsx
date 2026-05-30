const icons = [
  { label: "X", href: "https://x.com" },
  { label: "IG", href: "https://instagram.com" },
  { label: "GH", href: "https://github.com" },
];

export const Footer = () => (
  <footer className="template-footer">
    <div className="template-footer__icons" aria-label="SNS">
      {icons.map((icon) => (
        <a
          key={icon.label}
          className="template-footer__icon"
          href={icon.href}
          target="_blank"
          rel="noreferrer"
          aria-label={icon.label}
        >
          <span>{icon.label}</span>
        </a>
      ))}
    </div>
  </footer>
);
