import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Trophy, ArrowUpRight } from "lucide-react";
import crockerLogo from "/clients/crocker-ventures/crocker-ventures-logo.webp";
import sublimeLogo from "/clients/sublime-decor/sublime-logo.webp";
import tmtLogo from "/clients/the-massapequa-tutor/tmt-logo.webp";
import sorensonLogo from "/clients/sorenson-legacy-foundation/slf-logo.webp";
import avalLogo from "/clients/aval-legal/aval.webp";
import { Link } from "react-router-dom";
import tikcookLogo from "/clients/tikcook-recipes/tikcook-logo.webp";

// Keep existing client data
const clients = [
  {
    id: "the-massapequa-tutor",
    name: "The Massapequa Tutor",
    description: "Compelling Peer Tutors for the New York Area",
    image: tmtLogo,
    url: "https://themassapequatutor.com",
    tags: ["Education", "Local Business"],
    services: ["Web Development", "Digital Marketing"],
    yearStarted: "2023",
  },
  {
    id: "sublime-events",
    name: "Sublime Events and Decor",
    description: "Beautiful local parties and decor in South Bend, Indiana",
    image: sublimeLogo,
    url: "https://sublimeeventsdecor.com",
    tags: ["Events", "Local Business"],
    services: ["Website Design", "Brand Identity"],
    yearStarted: "2024",
  },
  {
    id: "crocker-ventures",
    name: "Crocker Ventures",
    description:
      "Private Firm investing in life science, healthcare, and emerging technology",
    image: crockerLogo,
    url: "https://crockerventures.com",
    tags: ["Investment", "Healthcare"],
    services: ["Web Development", "Digital Strategy"],
    yearStarted: "2024",
  },
  {
    id: "sorenson-legacy-foundation",
    name: "Sorenson Legacy Foundation",
    description:
      "Non Profit giving back to the community, education, healthcare, innovation in Utah",
    image: sorensonLogo,
    url: "https://sorensonlegacyfoundation.com",
    tags: ["Non-Profit", "Community"],
    services: ["Web Development", "Ease of Use"],
    yearStarted: "2023",
  },
  {
    id: "tikcook-recipes",
    name: "TikCook Recipes",
    Description: "A modern recipe platform with lightning-fast performance",
    image: tikcookLogo,
    url: "https://tik-cook-recipes.pages.dev/",
    tags: ["Community", "Blog"],
    services: ["Web Development", "Marketing", "Content Management"],
    yearStarted: "2025",
  },
  {
    id: "aval-legal",
    name: "Aval Legal",
    description:
      "A innovative Startup searching to intelligently search for Legal talent in and outside of large firms.",
    image: avalLogo,
    url: "https://www.avallegal.com/",
    tags: ["AI Search", "Startup"],
    services: ["Cloud Development", "Web Development"],
    yearStarted: "2023",
  },
];

const stats = [
  {
    icon: <Building2 className="w-6 h-6" />,
    value: "6",
    label: "Active & Past Clients",
  },
  {
    icon: <Users className="w-6 h-6" />,
    value: "100%",
    label: "Client Satisfaction",
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    value: "2023",
    label: "Founded",
  },
];

export default function ClientShowcase() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 bg-gradient-to-b from-gray-100 to-white">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none mb-4">
                Trusted by Industry Leaders
              </h1>
              <p className="text-gray-500 md:text-xl mb-8">
                We partner with innovative businesses to create exceptional
                digital experiences
              </p>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                {stats.map((stat, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="mb-2 p-2 bg-blue-50 rounded-full">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Client Grid */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl mb-12">
              Our Client Success Stories
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {clients.map((client) => (
                <Link
                  key={client.id}
                  to={`/clients/${client.id}`}
                  className="group"
                >
                  <Card className="hover:shadow-lg transition-all duration-300 h-full">
                    <CardHeader className="flex flex-col space-y-4">
                      <div className="flex items-center justify-between">
                        <img
                          src={client.image}
                          alt={`${client.name} logo`}
                          width={100}
                          height={100}
                          className="rounded-full"
                        />
                        <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <CardTitle className="flex items-center justify-between">
                        {client.name}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2">
                        {client.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-500">{client.description}</p>
                      <div className="pt-4 border-t">
                        <p className="font-medium text-sm">
                          Services Provided:
                        </p>
                        <ul className="mt-2 text-sm text-gray-500">
                          {client.services.map((service) => (
                            <li key={service} className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-green-800 rounded-full mr-2" />
                              {service}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
