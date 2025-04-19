import ClientPage from "@/components/client-details";
import logo from "/clients/tikcook-recipes/tikcook-logo.webp";

export default function TikCookRecipes() {
  const clientData = {
    name: "TikCook Recipes",
    description:
      "TikCook is a modern recipe platform built with React and Astro, combining seamless content management with lightning-fast performance. Powered by Cloudflare's global network and featuring an intuitive Pages CMS, it makes recipe sharing and management effortless while maintaining developer-friendly GitHub integration.",
    longDescription: `
Discover TikCook, where culinary creativity meets technical excellence. Our platform revolutionizes the way recipes are shared and managed online, leveraging the power of modern web technologies to deliver an exceptional user experience.
Built on a robust foundation of React and Astro, TikCook offers blazing-fast page loads and smooth interactions that make browsing recipes a joy. The hybrid architecture ensures optimal performance while maintaining full interactivity where it matters most.
Content creators will love our seamless integration with Pages CMS, allowing for easy recipe updates and management directly through an intuitive interface. No technical expertise required – simply log in, make your changes, and watch them go live. Behind the scenes, every update is automatically synchronized with GitHub, maintaining version control and enabling collaborative development.
Thanks to Cloudflare's global CDN, your recipes are delivered at lightning speed to users worldwide. Whether you're sharing family secrets or professional techniques, TikCook ensures your culinary content is always accessible and performs flawlessly across all devices.
Perfect for food bloggers, professional chefs, and home cooks alike, TikCook combines the reliability of enterprise-grade infrastructure with the simplicity of modern content management. Join us in creating the future of recipe sharing, where technology enhances rather than complicates the joy of cooking.`,
    image: logo,
    url: "https://tik-cook-recipes.pages.dev/",
    projectImages: [],
    projectDuration: "1 week",
    technologies: ["Astro", "React", "CloudFlare Pages", "Pages CRM"],
    keyFeatures: [
      "CRM to easily manage recipes and blogs",
      "Cheap, nearly free hosting",
      "Mobile Optimized with dark and light themes",
    ],
    results: ["Quick turn around from idea to concept website in a few days"],
  };
  return <ClientPage {...clientData} />;
}
