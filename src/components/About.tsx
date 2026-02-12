// import { React } from "react";
import { Leaf } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import TeamSection from "./about/TeamSection";
import AwardsSection from "./about/AwardsSection";
import ValuesSection from "./about/ValuesSection";

export default function About() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section id="about-hero" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About{" "}
              <span className="text-primary">
                CTP R.E.D. CORP
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Leading the future of commercial real estate with
              over two decades of excellence, innovation, and
              unwavering commitment to our clients.
            </p>
          </div>
        </div>
      </section>

      {/* Company History */}
      <section id="history" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className=" ">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    Founded in 2001, CTP RED CORP began as a
                    vision to transform the commercial real
                    estate landscape. What started as a small
                    property management company has evolved into
                    a premier destination for businesses seeking
                    exceptional office spaces.
                  </p>
                  <p>
                    Over the years, we've expanded our portfolio
                    to include three flagship buildings: CTP
                    Asean Tower, CTP Alpha Tower, and CTP BF
                    Building. Each property represents our
                    commitment to modern design, cutting-edge
                    technology, and sustainable practices.
                  </p>
                  <p>
                    Today, we proudly serve over 200 businesses
                    across our properties, providing not just
                    office space, but comprehensive business
                    solutions that help our tenants thrive in an
                    ever-evolving marketplace.
                  </p>
                </div>
              </div>
              <div className="relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="CTP RED CORP Building"
                  className="rounded-lg shadow-lg"
                />
                <div className="absolute inset-0 bg-primary opacity-10 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section id="mission" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className=" ">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">
                    Our Mission
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    To provide exceptional commercial real
                    estate solutions that empower businesses to
                    achieve their goals through innovative
                    spaces, outstanding service, and strategic
                    partnerships that foster growth and success.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-black">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">
                    Our Vision
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    To be the premier choice for businesses
                    seeking world-class office environments,
                    setting the standard for excellence in
                    commercial real estate through innovation,
                    sustainability, and unwavering commitment to
                    client success.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <ValuesSection />

      {/* Leadership Team */}
      {/* <TeamSection /> */}

      {/* Awards & Recognition */}
      <AwardsSection />

      {/* Sustainability */}
      <section id="sustainability" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className=" ">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center mb-4">
                    <Leaf className="h-8 w-8 text-primary mr-3" />
                    <h2 className="text-3xl font-bold text-gray-900">
                      Sustainability Commitment
                    </h2>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Environmental responsibility is at the core
                    of our operations. We're committed to
                    reducing our carbon footprint and creating
                    sustainable work environments for future
                    generations.
                  </p>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      LEED Gold certified buildings
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      Energy-efficient lighting and HVAC systems
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      Comprehensive recycling programs
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      Green transportation initiatives
                    </li>
                  </ul>
                </div>
                <div className="relative">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Sustainable Building"
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}