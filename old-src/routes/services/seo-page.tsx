import SEOServices from "@/components/services/seo";
import { Helmet } from "react-helmet";

export default function SeoPage() {
  return (
    <>
      <Helmet>
        <title>Smiling SEO & Digital Presence Services</title>
        <meta
          name="description"
          content="Boost your online visibility with comprehensive SEO and digital presence management. From search rankings to social media, we help you get found online."
        />
        <meta
          name="keywords"
          content="SEO, search engine optimization, digital marketing, social media, Google Business Profile, online presence, local SEO"
        />
      </Helmet>
      <SEOServices />
    </>
  );
}
