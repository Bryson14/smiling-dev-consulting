import { Link } from "react-router-dom";
export default function Footer() {
  const email = "info@smiling.dev";
  const emailSubject = "Tech Services Inquiry";
  const emailBody = `Hi there,

I'm interested in learning more about your tech services. Could you please provide information about:
- Your available services
- Typical project timelines
- General pricing structure

Looking forward to hearing from you.

Best regards`;

  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full container shrink-0 items-center px-4 md:px-6 border-t">
      <p className="text-xs text-gray-600 dark:text-gray-400">
        © 2024 Smiling Tech Consulting. All rights reserved.
      </p>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6">
        <Link
          className="text-xs hover:underline underline-offset-4"
          to="/terms"
        >
          Terms of Service
        </Link>
        <Link
          className="text-xs hover:underline underline-offset-4"
          to="/contact"
        >
          Contact
        </Link>
        <a className="text-xs" href={mailtoLink}>
          {email}
        </a>
      </nav>
    </footer>
  );
}
