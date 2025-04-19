import SorensonLegacyFoundation from "@/components/clients/sorenson-legacy-foundation";
import { Helmet } from "react-helmet";

export default function SorensonLegacyFoundationPage() {
  return (
    <>
      <Helmet>
        <title>
          Sorenson Legacy Foundation Case Study - Smiling Tech Consulting
        </title>
        <meta
          name="description"
          content="Learn how we transformed Sorenson Legacy Foundation's website, reducing costs by 70% while modernizing their digital presence. From complex WordPress to intuitive Wix platform."
        />
      </Helmet>

      <SorensonLegacyFoundation />
    </>
  );
}
