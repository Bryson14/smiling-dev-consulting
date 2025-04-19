import ClientPage from "@/components/client-details";
import landingPage from "/clients/sublime-decor/landing-page-sublime.webp";
import services from "/clients/sublime-decor/services-sublime.webp";
import logo from "/clients/sublime-decor/sublime-logo.webp";

export default function SublimeEventsDecor() {
  const clientData = {
    name: "Sublime Events and Decor",
    description:
      "Complete digital transformation for a local events and party decoration business, including e-commerce, booking system, and comprehensive social media presence",
    longDescription: `
      Sublime Events and Decor needed a professional online presence that would help grow their local party decoration business while streamlining their operations. The challenge was to create a solution that was both professional and easy to manage for a small business owner.
  
      Our comprehensive solution included:
  
      • Website Development & E-commerce
      - Custom Wix website with modern, visually appealing design
      - Integrated payment processing system
      - Automated invoice generation
      - Online booking and consultation scheduling
      - Portfolio showcase for previous events
  
      • Business Operations Enhancement
      - Streamlined payment collection process
      - Automated invoice management
      - Digital contract signing
      - Event scheduling and management system
      - Inventory tracking capabilities
  
      • Digital Presence Optimization
      - Comprehensive SEO implementation
      - Google Business Profile optimization
      - Social media account setup and integration
      - Local business directory listings
      - Customer review management system
  
      The new platform has significantly improved the business's online visibility and operational efficiency, allowing the owner to focus on what she does best - creating beautiful events and decorations for her clients.`,
    image: logo,
    url: "https://www.sublimeeventsdecor.com/",
    projectImages: [landingPage, services],
    projectDuration: "6 weeks",
    technologies: [
      "Wix Platform",
      "Wix Payments",
      "Wix Bookings",
      "SEO Tools",
      "Google Business Suite",
      "Social Media APIs",
      "Analytics Tools",
      "Email Marketing Integration",
      "Mobile Optimization",
      "Payment Gateway Integration",
    ],
    keyFeatures: [
      "Custom Website Design",
      "Online Payment Processing",
      "Automated Invoice Generation",
      "Event Booking System",
      "Portfolio Gallery",
      "Social Media Integration",
      "SEO Optimization",
      "Mobile-Responsive Design",
      "Customer Review Platform",
      "Business Analytics Dashboard",
    ],
    results: [
      "200% Increase in Online Visibility",
      "50% Reduction in Payment Processing Time",
      "Established Presence on All Major Social Platforms",
      "Improved Google Search Rankings for Local Keywords",
      "Automated Invoice Processing Saves 5+ Hours Weekly",
      "30% Increase in Customer Inquiries",
      "Streamlined Booking Process",
      "Enhanced Digital Brand Presence",
    ],
  };
  return <ClientPage {...clientData} />;
}
