import TechConsulting from "@/components/services/technical-consulting";
import { Helmet } from "react-helmet";

export default function TechConsultingPage() {
  return (
    <>
      <Helmet>
        <title>Smiling Tech Consulting Services</title>
        <meta
          name="description"
          content="Expert technology consulting for businesses of all sizes. We help navigate complex tech decisions, modernize legacy systems, and plan for growth."
        />
        <meta
          name="keywords"
          content="tech consulting, technology consulting, IT consulting, legacy systems, digital transformation, technology planning"
        />
      </Helmet>
      <TechConsulting />
    </>
  );
}
