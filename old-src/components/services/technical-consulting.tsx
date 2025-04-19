import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Laptop,
  Building2,
  Lightbulb,
  ArrowRight,
  Target,
  Clock,
  Shield,
  TreePine,
} from "lucide-react";

export default function TechConsulting() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Technical Consulting That Makes Sense
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Transform your business challenges into technical solutions.
                  From legacy system modernization to new project planning, we
                  speak your language and deliver clear paths forward.
                </p>
              </div>
              <Button asChild>
                <Link to="/contact">Schedule a Free Consultation</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
              How We Help Businesses Like Yours
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <Building2 className="h-6 w-6 mb-2" />
                  <CardTitle>Legacy System Modernization</CardTitle>
                  <CardDescription>
                    Transform outdated systems into modern solutions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Assessment of current systems</li>
                    <li>• Risk-free migration planning</li>
                    <li>• Cost-effective upgrade paths</li>
                    <li>• Data preservation strategies</li>
                    <li>• Government system experience</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Lightbulb className="h-6 w-6 mb-2" />
                  <CardTitle>New Project Planning</CardTitle>
                  <CardDescription>
                    Turn your ideas into actionable tech plans
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Business needs analysis</li>
                    <li>• Technology stack selection</li>
                    <li>• Budget optimization</li>
                    <li>• Implementation roadmap</li>
                    <li>• ROI forecasting</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Target className="h-6 w-6 mb-2" />
                  <CardTitle>Strategic Technology Planning</CardTitle>
                  <CardDescription>
                    Align your tech with business goals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Digital transformation strategy</li>
                    <li>• Technology audit</li>
                    <li>• Growth scalability planning</li>
                    <li>• Vendor selection guidance</li>
                    <li>• Cost reduction analysis</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
              Our Consulting Process
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white mb-4">
                  <Laptop className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">1. Discovery</h3>
                <p className="text-sm text-gray-500">
                  We learn about your business, challenges, and goals through
                  in-depth discussion
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">2. Assessment</h3>
                <p className="text-sm text-gray-500">
                  Technical evaluation of current systems and future needs
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white mb-4">
                  <TreePine className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">3. Planning</h3>
                <p className="text-sm text-gray-500">
                  Develop clear, actionable recommendations and roadmap
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white mb-4">
                  <ArrowRight className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">4. Implementation</h3>
                <p className="text-sm text-gray-500">
                  Guide execution and ensure successful outcomes
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Common Questions We Solve</CardTitle>
                  <CardDescription>
                    Real problems we help businesses address
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 mt-1 text-primary" />
                      <div>
                        <p className="font-medium">
                          "Our systems are outdated, but change feels risky."
                        </p>
                        <p className="text-sm text-gray-500">
                          We create safe, phased modernization plans that
                          protect your data and operations.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Laptop className="h-5 w-5 mt-1 text-primary" />
                      <div>
                        <p className="font-medium">
                          "We need new software but don't know where to start."
                        </p>
                        <p className="text-sm text-gray-500">
                          We guide you through options and help choose solutions
                          that fit your needs and budget.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Target className="h-5 w-5 mt-1 text-primary" />
                      <div>
                        <p className="font-medium">
                          "How do we know we're making the right tech
                          investments?"
                        </p>
                        <p className="text-sm text-gray-500">
                          We analyze ROI and align technology choices with your
                          business goals.
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Why Choose Us</CardTitle>
                  <CardDescription>
                    Experience that delivers results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Building2 className="h-5 w-5 mt-1 text-primary" />
                      <div>
                        <p className="font-medium">
                          Government & Legacy System Expertise
                        </p>
                        <p className="text-sm text-gray-500">
                          Proven experience modernizing complex government
                          systems and helping organizations overcome technical
                          debt.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Lightbulb className="h-5 w-5 mt-1 text-primary" />
                      <div>
                        <p className="font-medium">Business-First Approach</p>
                        <p className="text-sm text-gray-500">
                          We focus on your business goals first, then find the
                          right technology to achieve them.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 mt-1 text-primary" />
                      <div>
                        <p className="font-medium">Risk-Managed Solutions</p>
                        <p className="text-sm text-gray-500">
                          Careful planning and phased approaches that protect
                          your business while moving forward.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Not Sure Where to Start?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Let's have a no-pressure conversation about your business
                  needs and explore how technology can help you grow.
                </p>
              </div>
              <Button size="lg" asChild>
                <Link to="/contact">Book Your Free Consultation</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
