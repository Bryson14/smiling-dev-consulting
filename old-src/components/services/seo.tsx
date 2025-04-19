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
  Search,
  BarChart,
  Globe,
  Users,
  MessageSquare,
  Store,
  Compass,
  LineChart,
  Map,
  Share2,
  Megaphone,
  ScrollText,
} from "lucide-react";

export default function SEOServices() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Get Found Online
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  More than just SEO - we build your complete digital presence
                  to attract customers where they already are.
                </p>
              </div>
              <Button asChild>
                <Link to="/contact">Boost Your Visibility</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
              Complete Digital Presence Management
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <Search className="h-6 w-6 mb-2" />
                  <CardTitle>Search Engine Optimization</CardTitle>
                  <CardDescription>
                    Rank higher in Google searches
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Keyword research & strategy</li>
                    <li>• On-page optimization</li>
                    <li>• Technical SEO fixes</li>
                    <li>• Content optimization</li>
                    <li>• Local SEO optimization</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Store className="h-6 w-6 mb-2" />
                  <CardTitle>Google Business Profile</CardTitle>
                  <CardDescription>Stand out in local searches</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Profile setup & optimization</li>
                    <li>• Photo & service updates</li>
                    <li>• Review management</li>
                    <li>• Post scheduling</li>
                    <li>• Location optimization</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="h-6 w-6 mb-2" />
                  <CardTitle>Social Media Presence</CardTitle>
                  <CardDescription>
                    Engage where your customers are
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Profile setup & branding</li>
                    <li>• Content strategy</li>
                    <li>• Platform selection</li>
                    <li>• Cross-platform integration</li>
                    <li>• Engagement optimization</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
              Our Approach to Digital Growth
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white mb-4">
                  <Compass className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">1. Analyze</h3>
                <p className="text-sm text-gray-500">
                  Understand your market and current online presence
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white mb-4">
                  <Map className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">2. Plan</h3>
                <p className="text-sm text-gray-500">
                  Create a comprehensive digital strategy
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white mb-4">
                  <Share2 className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">3. Implement</h3>
                <p className="text-sm text-gray-500">
                  Execute across all chosen platforms
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white mb-4">
                  <LineChart className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">4. Monitor</h3>
                <p className="text-sm text-gray-500">
                  Track performance and optimize results
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
                  <CardTitle>Measurable Results</CardTitle>
                  <CardDescription>
                    Track your success with clear metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <BarChart className="h-5 w-5 mt-1 text-primary" />
                      <div>
                        <p className="font-medium">Search Rankings</p>
                        <p className="text-sm text-gray-500">
                          Monitor your position for key search terms
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Globe className="h-5 w-5 mt-1 text-primary" />
                      <div>
                        <p className="font-medium">Website Traffic</p>
                        <p className="text-sm text-gray-500">
                          Track visitors, engagement, and conversions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MessageSquare className="h-5 w-5 mt-1 text-primary" />
                      <div>
                        <p className="font-medium">Social Engagement</p>
                        <p className="text-sm text-gray-500">
                          Measure likes, shares, and community growth
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Digital Presence Audit</CardTitle>
                  <CardDescription>
                    What we analyze to improve your visibility
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <ScrollText className="h-4 w-4" />
                        Content Analysis
                      </h4>
                      <ul className="text-sm text-gray-500 space-y-1">
                        <li>• Website content</li>
                        <li>• Blog posts</li>
                        <li>• Meta descriptions</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        Technical SEO
                      </h4>
                      <ul className="text-sm text-gray-500 space-y-1">
                        <li>• Site structure</li>
                        <li>• Loading speed</li>
                        <li>• Mobile optimization</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <Store className="h-4 w-4" />
                        Local Presence
                      </h4>
                      <ul className="text-sm text-gray-500 space-y-1">
                        <li>• Google Business</li>
                        <li>• Local citations</li>
                        <li>• Review platforms</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <Megaphone className="h-4 w-4" />
                        Social Presence
                      </h4>
                      <ul className="text-sm text-gray-500 space-y-1">
                        <li>• Profile optimization</li>
                        <li>• Content strategy</li>
                        <li>• Engagement rates</li>
                      </ul>
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
                  Ready to Grow Your Online Presence?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Let's create a digital strategy that brings more customers to
                  your business.
                </p>
              </div>
              <Button size="lg" asChild>
                <Link to="/contact">Get Your Free Audit</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
