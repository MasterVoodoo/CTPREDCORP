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
import CTP_BLDG from "@/assets/CTP_BLDG.png";
import SUSTAINABILITY_IMAGE from "@/assets/SUSTAINABILITY_IMAGE.jpg";

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
                  The CTP Red Group was founded in the early 1990s by the late Clarence T. Pimentel, a visionary Filipino entrepreneur with a passion for real estate development and leasing. Driven by his commitment to quality, integrity, and community growth, Mr. Pimentel established the company’s foundation in BF Homes, Parañaque, where operations began with the construction of a low-rise commercial building along Presidents Avenue under the company CTP Red II Inc.
                  </p>
                  <p>
                  Building upon the success of its initial ventures, the Group embarked on its first major development project in 2014—the CTP Alpha Tower, located at Madrigal Business Park, Alabang, Muntinlupa City. This high-rise development, under CTP Red I Corp. marked a significant milestone in the company’s transition toward large-scale commercial real estate projects.
                  </p>
                  <p>
                  Following four years of sustained growth and strong occupancy performance, the Group expanded further with the construction of its second major development, the CTP ASEAN Tower, under CTP Red III Corp. Strategically situated in the Spectrum District, Filinvest Alabang, Muntinlupa City, this modern commercial tower reinforces the group’s position as a key player in the southern Metro Manila real estate market.
                  </p>
                  <p>
                  Through the years, the CTP Red Group has earned a solid reputation for delivering high-quality developments in prime locations, designed to foster lasting partnerships with its tenants and communities. Many of the group’s tenants have grown alongside its properties—testament to the company’s enduring commitment to service excellence and sustainable development.
                  </p>
                  <p>
                  From its humble beginnings in Parañaque to its growing footprint across Alabang’s business districts, the CTP Red Group under its next generation leadership continues to uphold the legacy of its founder—building spaces that inspire productivity, progress, and pride in Filipino enterprise.
                  </p>
                </div>
              </div>
              <div className="relative">
                <ImageWithFallback
                  src={CTP_BLDG}
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
                  To provide modern, high-quality, and cost-effective workspaces supported by tenant-focused care and sustainable operations thereby providing businesses strategic value and exponential growth.
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
                    To be a pioneer and leading real estate developer in the Philippines through multiple innovative and green projects, fostering harmonious environments and positive communities for our clients, employees and shareholders.
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
      {/* <AwardsSection /> */}

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
                      LEED Gold certified
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
                    src={SUSTAINABILITY_IMAGE}
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