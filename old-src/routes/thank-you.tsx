import ThankYou from "@/components/thank-you";
import { Helmet } from "react-helmet";

export default function ThankYouPage() {
  return (
    <>
      <Helmet>
        <title>Thank You - Smiling Tech Consulting</title>
        <meta
          name="description"
          content="Thank you for reaching out to Smiling Tech Consulting. We've received your message and will respond within 24 hours. We look forward to discussing your web development needs."
        />
      </Helmet>
      <ThankYou />
    </>
  );
}
