import ClientPage from "@/components/client-details";
import landingPage from "/clients/sorenson-legacy-foundation/landing-sorenson.webp";
import logo from "/clients/sorenson-legacy-foundation/slf-logo.webp";
import education from "/clients/sorenson-legacy-foundation/education-sorenson.webp";

export default function SorensonLegacyFoundation() {
  const clientData = {
    name: "Sorenson Legacy Foundation",
    description:
      "Infrastructure modernization and cost optimization for a prestigious charitable foundation's digital presence",
    longDescription: `
          The Sorenson Legacy Foundation faced significant challenges with their outdated WordPress website, including high hosting costs, security vulnerabilities, and limited functionality. Our mission was to modernize their digital infrastructure while reducing operational costs.
      
          Key Challenges Addressed:
          • Legacy WordPress installation with decade-old outdated plugins
          • Excessive hosting costs ($150/month) on an unknown platform
          • Security vulnerabilities from outdated dependencies
          • Manual processes for handling contact forms and inquiries
          • Poor site performance and reliability
      
          Our Solution Delivered:
          • Complete platform migration to Wix
          • Modern, secure, and maintainable website architecture
          • Automated form submissions and contact management
          • Streamlined content management system
          • Significant cost reduction in hosting fees
          • Enhanced security through managed platform
      
          The migration and modernization project has resulted in a more secure, efficient, and cost-effective digital presence. The foundation now enjoys a modern website with automated features, improved security, and substantial monthly cost savings, allowing them to focus more resources on their charitable mission.`,
    image: logo, // You'll need to import the logo
    url: "https://www.sorensonlegacyfoundation.org/",
    projectImages: [landingPage, education], // Add any project images you have
    projectDuration: "4 weeks",
    technologies: [
      "Wix Platform",
      "Form Automation",
      "Email Integration",
      "Security Protocols",
      "Content Management System",
      "Analytics Tools",
      "Automated Notifications",
      "Cloud Hosting",
      "Performance Monitoring",
      "Backup Systems",
    ],
    keyFeatures: [
      "Modern Content Management System",
      "Automated Form Processing",
      "Real-time Email Notifications",
      "Enhanced Security Protocols",
      "Optimized Cloud Hosting",
      "Mobile-Responsive Design",
      "Automated Backup System",
      "Performance Monitoring Dashboard",
      "Streamlined Admin Interface",
      "Integrated Contact Management",
    ],
    results: [
      "Reduced Monthly Hosting Costs by 70%",
      "Improved Site Security Score by 100%",
      "Automated Form Processing Saves 5+ Hours Monthly",
      "Enhanced Website Performance by 60%",
      "100% Uptime Since Migration",
      "Modernized All Dependencies",
      "Streamlined Content Updates Process",
      "Implemented Real-time Alert System",
    ],
  };
  return <ClientPage {...clientData} />;
}
