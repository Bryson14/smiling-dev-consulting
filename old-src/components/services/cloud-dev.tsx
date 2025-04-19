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
  Cloud,
  Database,
  Server,
  Files,
  Key,
  Zap,
  Brain,
  Shield,
  ArrowUpRight,
  Gauge,
  DollarSign,
  Scale,
} from "lucide-react";

export default function CloudServices() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Cloud Solutions That Scale With You
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  From simple file storage to complex backend systems, we build
                  cloud solutions that grow with your business. Pay only for
                  what you need, scale when you need it.
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
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-4">
              What Can The Cloud Do For You?
            </h2>
            <p className="text-center text-gray-500 mb-12 max-w-[800px] mx-auto">
              Think of the cloud as your business's digital utility service -
              just like electricity or water, you only pay for what you use, but
              have unlimited potential when you need it.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <Files className="h-6 w-6 mb-2" />
                  <CardTitle>Smart Storage Solutions</CardTitle>
                  <CardDescription>
                    Never worry about running out of space
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Secure file storage and sharing</li>
                    <li>• Automatic backups</li>
                    <li>• Pay only for what you use</li>
                    <li>• Access from anywhere</li>
                    <li>• AWS S3 and similar services</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Database className="h-6 w-6 mb-2" />
                  <CardTitle>Cloud Databases</CardTitle>
                  <CardDescription>
                    Reliable data storage that grows with you
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Scalable data storage</li>
                    <li>• Automatic maintenance</li>
                    <li>• High availability</li>
                    <li>• Disaster recovery</li>
                    <li>• SQL and NoSQL options</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Server className="h-6 w-6 mb-2" />
                  <CardTitle>Backend Services</CardTitle>
                  <CardDescription>
                    Powerful computing when you need it
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• API development</li>
                    <li>• Serverless functions</li>
                    <li>• Application hosting</li>
                    <li>• Auto-scaling services</li>
                    <li>• Cost-efficient computing</li>
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
                  AWS Solutions We Deliver
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <Files className="h-5 w-5 mb-2" />
                      <CardTitle className="text-lg">Storage</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      S3, EBS, EFS for all your storage needs
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <Database className="h-5 w-5 mb-2" />
                      <CardTitle className="text-lg">Databases</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      RDS, DynamoDB, Aurora
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <Zap className="h-5 w-5 mb-2" />
                      <CardTitle className="text-lg">Compute</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      EC2, Lambda, ECS
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <Brain className="h-5 w-5 mb-2" />
                      <CardTitle className="text-lg">AI/ML</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      SageMaker, Rekognition, Comprehend
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Why Move to the Cloud?</CardTitle>
                  <CardDescription>
                    Real benefits for your business
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <DollarSign className="h-5 w-5 mt-1 text-primary" />
                      <div>
                        <p className="font-medium">Cost Efficiency</p>
                        <p className="text-sm text-gray-500">
                          Pay only for what you use, with no upfront hardware
                          costs.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Scale className="h-5 w-5 mt-1 text-primary" />
                      <div>
                        <p className="font-medium">Scalability</p>
                        <p className="text-sm text-gray-500">
                          Grow or shrink resources instantly based on demand.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 mt-1 text-primary" />
                      <div>
                        <p className="font-medium">Security</p>
                        <p className="text-sm text-gray-500">
                          Enterprise-grade security and compliance features.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Gauge className="h-5 w-5 mt-1 text-primary" />
                      <div>
                        <p className="font-medium">Performance</p>
                        <p className="text-sm text-gray-500">
                          Fast, reliable service from anywhere in the world.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
              Our Cloud Development Process
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white mb-4">
                  <Key className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">1. Requirements</h3>
                <p className="text-sm text-gray-500">
                  We analyze your needs and identify the right cloud solutions
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white mb-4">
                  <ArrowUpRight className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">2. Architecture</h3>
                <p className="text-sm text-gray-500">
                  Design scalable, cost-effective cloud infrastructure
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white mb-4">
                  <Cloud className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">3. Development</h3>
                <p className="text-sm text-gray-500">
                  Build and configure your cloud solutions
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white mb-4">
                  <Gauge className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">4. Optimization</h3>
                <p className="text-sm text-gray-500">
                  Monitor and optimize for performance and cost
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Ready to Harness the Power of the Cloud?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Let's discuss how cloud solutions can help your business grow
                  while keeping costs under control.
                </p>
              </div>
              <Button size="lg" asChild>
                <Link to="/contact">Start Your Cloud Journey</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
