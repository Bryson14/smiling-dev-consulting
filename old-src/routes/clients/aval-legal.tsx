import AvalLegal from "@/components/clients/aval-legal";
import { Helmet } from "react-helmet";

export default function AvalLegalPage() {
  return (
    <>
      <Helmet>
        <title>Aval Legal Case Study - Smiling Tech Consulting</title>
        <meta
          name="description"
          content="Discover how we built a scalable AWS solution for Aval Legal to revolutionize legal talent search. Our platform enabled efficient discovery of legal expertise across law firms, streamlining both external recruitment and internal talent management for large legal organizations."
        />
      </Helmet>
      <AvalLegal />
    </>
  );
}
