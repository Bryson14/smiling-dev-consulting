import { Helmet } from "react-helmet";
import CrockerVentures from "@/components/clients/crocker-ventures";

export default function CrockerVenturesPage() {
  return (
    <>
      <Helmet>
        <title>Crocker Ventures Case Study - Smiling Tech Consulting</title>
        <meta
          name="description"
          content="Discover how we modernized Crocker Ventures' WordPress platform, enhancing security and performance for this leading life science investment firm. Learn about our website transformation success."
        />
      </Helmet>
      <CrockerVentures />
    </>
  );
}
