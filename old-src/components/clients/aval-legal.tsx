import logo from "/clients/aval-legal/aval.webp";
import ClientPage from "../client-details";

export default function AvalLegal() {
  const clientData = {
    name: "Aval Legal",
    description:
      "Enterprise-scale legal talent discovery platform leveraging AWS infrastructure and AI-powered search capabilities",
    longDescription: `
      Aval Legal aimed to revolutionize how law firms discover and manage legal talent through intelligent document analysis and search capabilities. Our mission was to build a scalable, secure platform that could handle complex searches across vast amounts of legal documents and professional profiles.

      Key Challenges Addressed:
      • Inefficient manual processes for finding specialized legal talent
      • Scattered documentation across multiple systems and formats
      • Complex requirements for secure document handling and privacy
      • Need for real-time search across large document repositories
      • Integration requirements with existing legal systems

      Our Solution Delivered:
      • Custom React frontend hosted on AWS Amplify
      • Golang backend service for optimal performance
      • AWS Kendra implementation for intelligent document search
      • AI-powered vector embeddings for semantic search capabilities
      • Secure document processing and storage system
      • Real-time analytics dashboard for talent insights
      • Role-based access control system
      • Integration with existing legal document management systems

      The platform successfully demonstrated how modern cloud architecture and AI technologies can transform legal talent discovery, making it faster and more accurate while maintaining the highest security standards.`,
    image: logo,
    url: "https://aval-legal.com", // Example URL
    projectImages: [],
    projectDuration: "6 months",
    technologies: [
      "React.js",
      "Golang",
      "AWS Amplify",
      "AWS Kendra",
      "Vector Embeddings",
      "GraphQL",
      "PostgreSQL",
      "Elasticsearch",
      "Docker",
      "Kubernetes",
      "Redis",
      "JWT Authentication",
      "OpenAI API",
    ],
    keyFeatures: [
      "AI-Powered Talent Search",
      "Document Intelligence Engine",
      "Real-time Analytics Dashboard",
      "Secure Document Processing",
      "Custom Matching Algorithms",
      "Role-based Access Control",
      "Multi-factor Authentication",
      "Advanced Search Filters",
      "Talent Pool Analytics",
      "Integration Framework",
    ],
    results: [
      "90% Reduction in Talent Search Time",
      "85% More Accurate Candidate Matching",
      "100K+ Documents Processed Daily",
      "99.99% Platform Uptime",
      "Sub-second Search Response Times",
      "GDPR and CCPA Compliant",
      "Successfully Scaled to 50+ Law Firms",
      "Processed Over 1M Legal Documents",
    ],
  };

  return <ClientPage {...clientData} />;
}
