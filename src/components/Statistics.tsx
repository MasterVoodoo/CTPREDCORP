import { Building, Users, Award, Clock } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { companyStatistics, simpleBuildingStatistics, companyOverview } from "../data/ctpData";

const stats = [
  {
    icon: <Building className="h-8 w-8" />,
    number: companyStatistics[0].number,
    label: companyStatistics[0].label,
    description: companyStatistics[0].description,
  },
  {
    icon: <Users className="h-8 w-8" />,
    number: companyStatistics[1].number,
    label: companyStatistics[1].label,
    description: companyStatistics[1].description,
  },
  {
    icon: <Award className="h-8 w-8" />,
    number: companyStatistics[2].number,
    label: companyStatistics[2].label,
    description: companyStatistics[2].description,
  },
  {
    icon: <Clock className="h-8 w-8" />,
    number: companyStatistics[3].number,
    label: companyStatistics[3].label,
    description: companyStatistics[3].description,
  },
];

const buildingStats = simpleBuildingStatistics;

export default function Statistics() {
  return (
    <section className="relative py-16 bg-black text-white overflow-hidden">
      {/* Animated Background with Panning Effect */}
      <div className="absolute inset-0">
        {/* Gradient overlay with animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-red-900/20 to-black animate-pulse"></div>

        {/* Moving geometric shapes */}
        <div className="absolute inset-0">
          <div
            className="absolute top-10 left-0 w-32 h-32 bg-primary/10 rounded-full animate-bounce"
            style={{
              animationDelay: "0s",
              animationDuration: "8s",
            }}
          ></div>
          <div
            className="absolute top-32 right-0 w-24 h-24 bg-red-600/10 rounded-full animate-bounce"
            style={{
              animationDelay: "2s",
              animationDuration: "6s",
            }}
          ></div>
          <div
            className="absolute bottom-20 left-1/4 w-16 h-16 bg-primary/15 rounded-full animate-bounce"
            style={{
              animationDelay: "4s",
              animationDuration: "7s",
            }}
          ></div>
          <div
            className="absolute bottom-10 right-1/3 w-20 h-20 bg-red-500/10 rounded-full animate-bounce"
            style={{
              animationDelay: "1s",
              animationDuration: "9s",
            }}
          ></div>
        </div>

        {/* Panning lines effect */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-primary to-transparent transform -skew-x-12 animate-pulse"></div>
        </div>
      </div>

      <div className="relative container mx-auto px-4 z-10">
        {/* Main Statistics */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose{" "}
            <span className="text-primary">{companyOverview.name}</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-12">
            Our track record speaks for itself. We've been
            providing exceptional office spaces and service for
            over {companyOverview.yearsInBusiness} years.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="bg-white/10 backdrop-blur-sm border-gray-700 text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                <CardContent className="p-6">
                  <div className="text-primary mb-4 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-lg font-medium text-white mb-2">
                    {stat.label}
                  </div>
                  <p className="text-gray-300 text-sm">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>


    </section>
  );
}