import WebDevelopment from "@/components/services/web-dev";
import { Helmet } from "react-helmet";

export default function WebDevPage() {
  return (
    <>
      <Helmet>
        <title>Smiling Web Development Services</title>
        <meta
          name="description"
          content="Custom websites and web applications built with modern technology. From simple business sites to complex web apps, we create solutions that work for your needs."
        />
        <meta
          name="keywords"
          content="web development, website design, React, WordPress, custom websites, web applications, responsive design"
        />
      </Helmet>
      <WebDevelopment />
    </>
  );
}
