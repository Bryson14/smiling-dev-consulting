import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Code, Blocks, Layout, Sparkles } from "lucide-react";

export default function WebDevelopment() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Web Development Solutions
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  From simple business websites to complex web applications, we
                  build digital experiences that work for your needs and budget.
                </p>
              </div>
              <Button asChild>
                <Link to="/contact">Discuss Your Project</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
              Choose Your Perfect Solution
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <Layout className="h-6 w-6 mb-2" />
                  <CardTitle>No-Code Solutions</CardTitle>
                  <CardDescription>
                    Perfect for small businesses and quick launches
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Professional Wix and Squarespace websites</li>
                    <li>• Mobile-friendly designs</li>
                    <li>• Easy content management</li>
                    <li>• Quick setup and launch</li>
                    <li>• Built-in SEO tools</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Blocks className="h-6 w-6 mb-2" />
                  <CardTitle>WordPress Development</CardTitle>
                  <CardDescription>
                    Flexible solutions for growing businesses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Custom WordPress themes</li>
                    <li>• E-commerce integration</li>
                    <li>• Plugin customization</li>
                    <li>• Performance optimization</li>
                    <li>• Security hardening</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Code className="h-6 w-6 mb-2" />
                  <CardTitle>Custom Web Applications</CardTitle>
                  <CardDescription>
                    Enterprise-grade solutions with modern technology
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• React.js custom applications</li>
                    <li>• Modern UI with Tailwind CSS & shadcn/ui</li>
                    <li>• Healthcare industry expertise</li>
                    <li>• Scalable architecture</li>
                    <li>• Enterprise integration</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl mb-4">
                  Why Choose Us?
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Sparkles className="h-6 w-6 mt-1" />
                    <div>
                      <h3 className="font-semibold">
                        Healthcare Industry Experience
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Currently engineering solutions at a major healthcare
                        company, bringing enterprise-grade expertise to your
                        projects.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Layout className="h-6 w-6 mt-1" />
                    <div>
                      <h3 className="font-semibold">Modern Technology Stack</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Using the latest tools like React, Tailwind CSS, and
                        shadcn/ui to build fast, responsive, and beautiful
                        websites.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Code className="h-6 w-6 mt-1" />
                    <div>
                      <h3 className="font-semibold">Flexible Solutions</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        From no-code platforms to custom applications, we'll
                        recommend the best solution for your needs and budget.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl mb-4">
                  Technical Expertise
                </h2>
                <Card>
                  <CardContent className="pt-6">
                    <ul className="space-y-2">
                      <li className="font-mono text-sm">
                        ✓ React.js & Modern JavaScript
                      </li>
                      <li className="font-mono text-sm">
                        ✓ Tailwind CSS & shadcn/ui
                      </li>
                      <li className="font-mono text-sm">
                        ✓ WordPress Development
                      </li>
                      <li className="font-mono text-sm">
                        ✓ Wix & Squarespace Customization
                      </li>
                      <li className="font-mono text-sm">✓ Responsive Design</li>
                      <li className="font-mono text-sm">
                        ✓ Performance Optimization
                      </li>
                      <li className="font-mono text-sm">✓ API Integration</li>
                      <li className="font-mono text-sm">
                        ✓ Enterprise Solutions
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Ready to Build Your Website?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Let's discuss your project and find the perfect solution for
                  your needs.
                </p>
              </div>
              <Button size="lg" asChild>
                <Link to="/contact">Get Started Today</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
