import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  Globe,
  Timer,
  Trophy,
  Wrench,
} from "lucide-react";
import { Link } from "react-router-dom";

export interface ClientDetails {
  name: string;
  description: string;
  longDescription: string;
  image: string;
  url: string;
  projectImages: string[];
  projectDuration?: string;
  technologies?: string[];
  keyFeatures?: string[];
  results?: string[];
}

export default function ClientPage(client: ClientDetails) {
  const longDescSections = client.longDescription.split("\n");
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-gray-50">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 bg-white border-b">
          <div className="container px-4 md:px-6">
            <Link
              to="/clients"
              className="inline-flex items-center mb-8 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Clients
            </Link>
            <div className="grid gap-8 lg:grid-cols-2 items-start">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={client.image}
                    alt={`${client.name} logo`}
                    width={64}
                    height={64}
                    className="rounded-lg"
                  />
                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    {client.name}
                  </h1>
                </div>
                <p className="text-xl text-gray-600 mb-6">
                  {client.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Timer className="h-3 w-3" />
                    {client.projectDuration || "Ongoing"}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Globe className="h-3 w-3" />
                    Active Project
                  </Badge>
                </div>
                <Button asChild size="lg" className="mb-8">
                  <Link
                    to={client.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Live Site
                  </Link>
                </Button>
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                <img
                  src={client.projectImages[0]}
                  alt={`${client.name} main project image`}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-3">
              {/* Project Overview */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
                  <div className="prose max-w-none">
                    {longDescSections.map((line) => {
                      return (
                        <>
                          <p className="text-gray-600 leading-relaxed">
                            {line}
                          </p>
                          <br />
                        </>
                      );
                    })}
                  </div>
                </div>

                {/* Image Gallery */}
                {client.projectImages.length > 1 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Project Gallery</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      {client.projectImages.slice(1).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${client.name} project image ${index + 2}`}
                          className="rounded-lg shadow-md hover:shadow-xl transition-shadow"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Technologies */}
                {client.technologies && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Wrench className="h-5 w-5" />
                        Technologies Used
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {client.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Key Features */}
                {client.keyFeatures && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Key Features
                      </h3>
                      <ul className="space-y-2">
                        {client.keyFeatures.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-2 text-gray-600"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Results */}
                {client.results && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Trophy className="h-5 w-5" />
                        Project Results
                      </h3>
                      <ul className="space-y-2">
                        {client.results.map((result) => (
                          <li
                            key={result}
                            className="flex items-start gap-2 text-gray-600"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                            {result}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
