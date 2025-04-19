import LandingPage from "@/components/landing-page";
import { Helmet } from "react-helmet";

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Smiling Tech Consulting | Web, Cloud & Digital Solutions</title>
        <meta
          name="description"
          content="Expert tech consulting, web development, cloud solutions, and SEO services. We help businesses navigate technology and build their digital presence."
        />
        <meta
          name="keywords"
          content="tech consulting, web development, cloud solutions, SEO, digital solutions, technology services, IT consulting, digital transformation"
        />
        {/* Open Graph tags for social sharing */}
        <meta
          property="og:title"
          content="Smiling Tech Consulting | Web, Cloud & Digital Solutions"
        />
        <meta
          property="og:description"
          content="Expert tech consulting, web development, cloud solutions, and SEO services. We help businesses navigate technology and build their digital presence."
        />
        <meta property="og:type" content="website" />
        {/* Add your domain when you have it */}
        <meta property="og:url" content="https://smiling.dev" />
      </Helmet>
      <LandingPage />
    </>
  );
}
