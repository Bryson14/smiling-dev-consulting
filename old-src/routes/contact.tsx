import ContactPage from "@/components/contact-page";
import { Helmet } from "react-helmet";

export default function PageContact() {
  return (
    <>
      <Helmet>
        <title>
          Contact Smiling Tech Consulting | Let's Discuss Your Project
        </title>
        <meta
          name="description"
          content="Get in touch for expert tech consulting, web development, cloud solutions, and SEO services. Schedule a free consultation to discuss your business needs."
        />
        <meta
          name="keywords"
          content="contact tech consultant, tech consulting services, free consultation, technology help, IT consultation, digital solutions contact"
        />
        {/* Open Graph tags for social sharing */}
        <meta
          property="og:title"
          content="Contact Smiling Tech Consulting | Let's Discuss Your Project"
        />
        <meta
          property="og:description"
          content="Get in touch for expert tech consulting, web development, cloud solutions, and SEO services. Schedule a free consultation to discuss your business needs."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://smiling.dev/contact" />
      </Helmet>
      <ContactPage />
    </>
  );
}
