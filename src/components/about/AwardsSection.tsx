import { Award } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { awards } from "./AboutConstants";

export default function AwardsSection() {
  return (
    <section id="awards" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Awards & Recognition</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {awards.map((award, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex items-center space-x-4">
                  <Award className="h-12 w-12 text-primary flex-shrink-0" />
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-2xl font-bold text-primary">{award.year}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{award.title}</h3>
                    <p className="text-gray-600">{award.organization}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}