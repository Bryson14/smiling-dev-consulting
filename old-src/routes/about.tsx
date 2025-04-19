import AboutPage from "@/components/about-page";
import { Helmet } from "react-helmet";

export default function PageAbout() {
  return (
    <>
      <Helmet>
        <title>
          About Smiling Tech Consulting | Our Expertise & Experience
        </title>
        <meta
          name="description"
          content="Professional technology consultants with experience in healthcare, government, and business sectors. Learn about our approach to solving tech challenges."
        />
        <meta
          name="keywords"
          content="tech consultants, technology expertise, IT professionals, healthcare technology, government systems, business solutions, digital transformation"
        />
        {/* Open Graph tags for social sharing */}
        <meta
          property="og:title"
          content="About Smiling Tech Consulting | Our Expertise & Experience"
        />
        <meta
          property="og:description"
          content="Professional technology consultants with experience in healthcare, government, and business sectors. Learn about our approach to solving tech challenges."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://smiling.dev/about" />
      </Helmet>
      <AboutPage />
    </>
  );
}
