import ClientPage from "@/components/client-details";
import landingPage from "/clients/crocker-ventures/landing_page.webp";
import logo from "/clients/crocker-ventures/crocker-ventures-logo.webp";

export default function CrockerVentures() {
  const clientData = {
    name: "Crocker Ventures",
    description:
      "Modern website revitalization for a leading Utah-based Venture Capital firm",
    longDescription: `
      Crocker Ventures, a distinguished private investment firm focusing on life sciences, healthcare, and emerging technologies, approached us with a critical challenge: their WordPress website, last updated in 2016, needed comprehensive modernization while preserving their established brand identity.
  

      Our team undertook a systematic approach to revitalize their digital presence:
  

      • Technical Modernization
        - Performed a complete WordPress core system upgrade
        - Updated all themes and plugins to their latest secure versions
        - Implemented robust backup systems and security protocols
        - Enhanced site loading speed and performance
  

      • Content Revitalization
        - Refreshed outdated company information and portfolio listings
        - Restructured content to better highlight investment successes
        - Optimized all images for faster loading while maintaining quality
        - Ensured mobile responsiveness across all pages
  

      • Key Improvements Delivered
        - Reduced page load times by optimizing database and hosting configuration
        - Implemented modern security practices to protect sensitive investment information
        - Created a more maintainable system for future updates
        - Preserved all existing content while enhancing its presentation
  
        
      The result was a modernized, secure, and efficient website that properly represents Crocker Ventures' position as a leading investment firm in the life sciences and healthcare sectors.`,
    image: logo,
    url: "https://crockerventures.com",
    projectImages: [landingPage],

    // Additional suggested fields to enhance the case study:
    projectDuration: "2 weeks",
    technologies: [
      "WordPress",
      "PHP",
      "MySQL",
      "Custom Theme Development",
      "Bluehost",
    ],
    keyFeatures: [
      "Modern WordPress Infrastructure",
      "Enhanced Security Protocols",
      "Optimized Performance",
      "Mobile-First Design",
      "Content Management System Upgrade",
    ],
    results: [
      "100% Security Score Improvement",
      "Modern Tech Stack Implementation",
      "Streamlined Content Management",
      "Enhanced User Experience",
    ],
  };
  return <ClientPage {...clientData} />;
}
