import image_7cb049e3da17c47cff60c03167368fcdf36917e1 from 'figma:asset/7cb049e3da17c47cff60c03167368fcdf36917e1.png';
import image_921bacae4fb3f71299da1dd7d8332e7e9a9c8452 from 'figma:asset/921bacae4fb3f71299da1dd7d8332e7e9a9c8452.png';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ExternalLink } from "lucide-react";
import maintainXLogo from "figma:asset/9d724889652415e7ae7aaa588ada7b86c4e61e9e.png";
import envoyLogo from "figma:asset/3a06f30cc086516766b4109da9df2fbbe308c00e.png";

export default function TenantsPortal() {

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Tenant Portal
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Welcome to your comprehensive tenant resource center. Access services, submit requests, and stay connected with your CTP RED CORP community.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Platform Integration Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* MaintainX Integration */}
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-900 mb-2">
                Advanced Maintenance Management
              </CardTitle>
              <CardDescription className="text-lg">
                Experience streamlined maintenance requests with our integrated MaintainX platform
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
              <div className="bg-white p-8 rounded-lg shadow-lg border">
                <div className="flex justify-center mb-6">
                  <img 
                    src={image_7cb049e3da17c47cff60c03167368fcdf36917e1}
                    alt="MaintainX Logo" 
                    className="h-16 w-auto cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => window.open("https://www.getmaintainx.com/?fbclid=IwY2xjawMl9chleHRuA2FlbQIxMABicmlkETFka25WZGdJVkZQTHd3bnF1AR5QWUuotv-FbCc-n1KZGrg9GES1W0-4FB3NWNgbjroztI99HelKO601NTctWQ_aem_etKcJu1-OkV1SLq1f8LyxA", "_blank")}
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Professional Maintenance Solutions
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Access our comprehensive maintenance management system for faster response times and better service quality.
                  </p>
                  <Button 
                    className="bg-primary hover:bg-accent text-white"
                    onClick={() => window.open("https://www.getmaintainx.com/?fbclid=IwY2xjawMl9chleHRuA2FlbQIxMABicmlkETFka25WZGdJVkZQTHd3bnF1AR5QWUuotv-FbCc-n1KZGrg9GES1W0-4FB3NWNgbjroztI99HelKO601NTctWQ_aem_etKcJu1-OkV1SLq1f8LyxA", "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Access MaintainX Platform
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Envoy Integration */}
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-900 mb-2">
                Visitor & Workplace Management
              </CardTitle>
              <CardDescription className="text-lg">
                Streamline your workplace experience with our integrated Envoy platform
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
              <div className="bg-white p-8 rounded-lg shadow-lg border">
                <div className="flex justify-center mb-6">
                  <img 
                    src={envoyLogo}
                    alt="Envoy Logo" 
                    className="h-16 w-auto cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => window.open("https://envoy.com/?fbclid=IwY2xjawM84vNleHRuA2FlbQIxMQABHuOtWp3K_odhtCEnSoe1V1tTBHgsPOnQf8KCdLybcNpzG_lGWLBv978uxywj_aem_QbG3SGEsvTL_EcaIQPsFew", "_blank")}
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Modern Workplace Solutions
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Manage visitor registration, desk booking, and workplace logistics with our comprehensive Envoy platform.
                  </p>
                  <Button 
                    className="bg-primary hover:bg-accent text-white"
                    onClick={() => window.open("https://envoy.com/?fbclid=IwY2xjawM84vNleHRuA2FlbQIxMQABHuOtWp3K_odhtCEnSoe1V1tTBHgsPOnQf8KCdLybcNpzG_lGWLBv978uxywj_aem_QbG3SGEsvTL_EcaIQPsFew", "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Access Envoy Platform
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}