import ClientPage from "@/components/client-details";
import logo from "/clients/the-massapequa-tutor/tmt-logo.webp";
import about from "/clients/the-massapequa-tutor/about.webp";
import classes from "/clients/the-massapequa-tutor/class-registration.webp";
import clientDashboard from "/clients/the-massapequa-tutor/client-dashboard.webp";
import landingStats from "/clients/the-massapequa-tutor/landing-stats.webp";
import tutorApp from "/clients/the-massapequa-tutor/tutor-app.webp";
import tutorDashboard from "/clients/the-massapequa-tutor/tutor-dashboard.webp";
import tutors from "/clients/the-massapequa-tutor/tutors.webp";

export default function TheMassapequaTutor() {
  const clientData = {
    name: "The Massapequa Tutor",
    description:
      "Full-stack educational platform revolutionizing local tutoring services with automated scheduling, payment processing, and student-tutor matching",
    longDescription: `
      The Massapequa Tutor needed a comprehensive digital transformation to handle their rapidly growing tutoring business. We built a modern, full-stack educational platform that automates and streamlines all aspects of their tutoring operations, enabling them to scale efficiently while maintaining service quality.
  
      Our solution addresses several critical business challenges:
  
      • Complex Scheduling Management
      - Real-time availability tracking for hundreds of tutors
      - Automated booking system with conflict prevention
      - Smart calendar integration for both tutors and students
  
      • User Experience & Interface
      - Intuitive student portal for class registration and tutor selection
      - Comprehensive tutor dashboard for managing appointments and students
      - Administrative console for business oversight and analytics
  
      • Technical Infrastructure
      - Built on AWS for maximum scalability and reliability
      - Real-time data synchronization across all users
      - Secure payment processing and data handling
      - Automated email notifications and reminders
  
      The platform now successfully manages hundreds of tutor-student relationships weekly, with robust systems for scheduling, communication, and payment processing. The automated systems have significantly reduced administrative overhead while improving the experience for both tutors and students.`,
    image: logo,
    url: "https://themassapequatutor.com/",
    projectImages: [
      tutors,
      about,
      classes,
      clientDashboard,
      tutorApp,
      tutorDashboard,
      landingStats,
    ],
    projectDuration: "1 year (Ongoing)",
    technologies: [
      "React.js",
      "React Router",
      "AWS Amplify",
      "Amazon S3",
      "GraphQL",
      "Go/Golang",
      "JavaScript",
      "GitHub",
      "Tailwind CSS",
      "CI/CD Pipeline",
      "AWS Lambda",
      "DynamoDB",
    ],
    keyFeatures: [
      "Automated Student-Tutor Matching System",
      "Real-time Scheduling & Availability Management",
      "Secure Payment Processing & Automated Billing",
      "Comprehensive Student Portal",
      "Advanced Tutor Dashboard",
      "Administrative Control Center",
      "Automated Email Notifications",
      "Performance Analytics & Reporting",
      "Resource Management System",
      "Mobile-Responsive Design",
    ],
    results: [
      "Managing 500+ Active Student-Tutor Relationships",
      "Processing 1000+ Monthly Class Bookings",
      "Achieved 70% Reduction in Administrative Work",
      "Maintaining 99.9% Platform Uptime",
      "Reduced Scheduling Conflicts by 95%",
      "Doubled Tutor Onboarding Efficiency",
      "Automated 20+ Hours of Weekly Administrative Tasks",
      "Successfully Handling 100+ Concurrent Users",
    ],
  };
  return <ClientPage {...clientData} />;
}
