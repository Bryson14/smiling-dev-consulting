import TermsAndConditionsPage from "@/components/terms-and-conditions";
import Helmet from "react-helmet";

export default function PageTerms() {
  return (
    <>
      <Helmet>
        <title>Terms and Conditions - Smiling Tech Consulting</title>
        <meta
          name="description"
          content="Read our terms and conditions for web development and digital consulting services. Clear guidelines on project scope, deliverables, payments, and service agreements for Smiling Tech Consulting clients."
        />
      </Helmet>
      <TermsAndConditionsPage />;
    </>
  );
}
