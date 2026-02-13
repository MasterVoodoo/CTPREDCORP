import { useState, React } from "react";
import {
  Calendar,
  Clock,
  Building2,
  Phone,
  Mail,
  User,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";
import { 
  getCtpAseanAvailableFloors,
  getCtpAlphaAvailableFloors,
  getCtpBFAvailableFloors 
} from "../data/ctpData";

export default function ScheduleAppointment() {
  const [formData, setFormData] = useState({
    companyName: "",
    phoneNumber: "",
    email: "",
    preferredDate: "",
    preferredTime: "",
    property: "",
    floor: "",
    additionalNotes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };
      
      // If property changes, reset floor selection
      if (field === "property") {
        newData.floor = "";
      }
      
      return newData;
    });
  };

  // Get available floors based on selected property
  const getAvailableFloors = (): number[] => {
    switch (formData.property) {
      case "CTP Asean Tower":
        return getCtpAseanAvailableFloors();
      case "CTP Alpha Tower":
        return getCtpAlphaAvailableFloors();
      case "CTP BF Building":
        return getCtpBFAvailableFloors();
      default:
        return [];
    }
  };

  // Method 1: Client-side email using mailto
  const sendEmailClientSide = () => {
    const {
      companyName,
      phoneNumber,
      email,
      preferredDate,
      preferredTime,
      property,
      floor,
      additionalNotes,
    } = formData;

    const formattedDate = new Date(preferredDate).toLocaleDateString('en-GB');
    
    const subject = `Appointment Request from ${companyName}`;
    const body = `
Company Name: ${companyName}
Email: ${email}
Phone: ${phoneNumber}
Preferred Date: ${formattedDate}
Preferred Time: ${preferredTime}
Property: ${property || 'Not specified'}
Floor: ${floor || 'Not specified'}
Additional Notes: ${additionalNotes || 'N/A'}
    `.trim();

    // Create mailto link
    const mailtoLink = `mailto:aseantower@ctpred.com.ph?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open email client
    window.location.href = mailtoLink;
  };

  // Method 2: Server-side email submission (requires backend API)
  const sendEmailServerSide = async () => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (
      !formData.companyName ||
      !formData.phoneNumber ||
      !formData.email ||
      !formData.preferredDate ||
      !formData.preferredTime ||
      !formData.property ||
      !formData.floor
    ) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    try {
      // Choose one method below:

      // Method 1: Client-side email (opens user's email client)
      sendEmailClientSide();

      // Method 2: Server-side email (requires backend implementation)
      // const success = await sendEmailServerSide();
      // if (!success) {
      //   toast.error("Failed to send appointment request. Please try again.");
      //   return;
      // }

      toast.success(
        "Appointment request submitted successfully! We'll contact you soon.",
      );

      // Reset form
      setFormData({
        companyName: "",
        phoneNumber: "",
        email: "",
        preferredDate: "",
        preferredTime: "",
        property: "",
        floor: "",
        additionalNotes: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const properties = [
    "CTP Asean Tower",
    "CTP Alpha Tower", 
    "CTP BF Building"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Schedule an Appointment
            </h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              Ready to find your perfect office space? Schedule
              a personalized tour and consultation with our
              leasing specialists.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="shadow-lg">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl text-gray-900 mb-4">
                Request Your Appointment
              </CardTitle>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Fill out the form below and our team will
                contact you within 24 hours to confirm your
                appointment and discuss your office space
                requirements.
              </p>
            </CardHeader>

            <CardContent className="space-y-8">
              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Company Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="companyName"
                      className="flex items-center gap-2"
                    >
                      <Building2 className="h-4 w-4 text-primary" />
                      Company Name *
                    </Label>
                    <Input
                      id="companyName"
                      type="text"
                      placeholder="Enter your company name"
                      value={formData.companyName}
                      onChange={(e) =>
                        handleInputChange(
                          "companyName",
                          e.target.value,
                        )
                      }
                      className="bg-input-background border-gray-300 focus:border-primary"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phoneNumber"
                      className="flex items-center gap-2"
                    >
                      <Phone className="h-4 w-4 text-primary" />
                      Phone Number *
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        handleInputChange(
                          "phoneNumber",
                          e.target.value,
                        )
                      }
                      className="bg-input-background border-gray-300 focus:border-primary"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4 text-primary" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@company.com"
                    value={formData.email}
                    onChange={(e) =>
                      handleInputChange("email", e.target.value)
                    }
                    className="bg-input-background border-gray-300 focus:border-primary"
                    required
                  />
                </div>

                {/* Date and Time */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="preferredDate"
                      className="flex items-center gap-2"
                    >
                      <Calendar className="h-4 w-4 text-primary" />
                      Preferred Date *
                    </Label>
                    <Input
                      id="preferredDate"
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) =>
                        handleInputChange(
                          "preferredDate",
                          e.target.value,
                        )
                      }
                      className="bg-input-background border-gray-300 focus:border-primary"
                      min={
                        new Date().toISOString().split("T")[0]
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="preferredTime"
                      className="flex items-center gap-2"
                    >
                      <Clock className="h-4 w-4 text-primary" />
                      Preferred Time *
                    </Label>
                    <Input
                      id="preferredTime"
                      type="time"
                      value={formData.preferredTime}
                      onChange={(e) =>
                        handleInputChange(
                          "preferredTime",
                          e.target.value,
                        )
                      }
                      className="bg-input-background border-gray-300 focus:border-primary"
                      required
                    />
                  </div>
                </div>

                {/* Property Selection */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    Property *
                  </Label>
                  <Select
                    value={formData.property}
                    onValueChange={(value) =>
                      handleInputChange("property", value)
                    }
                  >
                    <SelectTrigger className="bg-input-background border-gray-300 focus:border-primary">
                      <SelectValue placeholder="Select a property" />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map((property) => (
                        <SelectItem
                          key={property}
                          value={property}
                        >
                          {property}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Floor Selection */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    Preferred Floor *
                  </Label>
                  <Select
                    value={formData.floor}
                    onValueChange={(value) =>
                      handleInputChange("floor", value)
                    }
                    disabled={!formData.property}
                  >
                    <SelectTrigger className={`bg-input-background border-gray-300 focus:border-primary ${!formData.property ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <SelectValue placeholder={formData.property ? "Select a floor" : "Please select a property first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableFloors().map((floor) => (
                        <SelectItem
                          key={floor}
                          value={floor.toString()}
                        >
                          {floor === 0 ? "Ground Floor" : `Floor ${floor}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Additional Notes */}
                <div className="space-y-2">
                  <Label htmlFor="additionalNotes">
                    Additional Notes or Requirements
                  </Label>
                  <Textarea
                    id="additionalNotes"
                    placeholder="Tell us about your specific requirements, team size, or any special needs..."
                    value={formData.additionalNotes}
                    onChange={(e) =>
                      handleInputChange(
                        "additionalNotes",
                        e.target.value,
                      )
                    }
                    className="bg-input-background border-gray-300 focus:border-primary min-h-[120px]"
                    rows={4}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-primary hover:bg-accent text-white cursor-pointer"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Schedule My Appointment"}
                  </Button>
                </div>
              </form>

              {/* Contact Information */}
              <div className="border-t pt-8">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Need immediate assistance?
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 max-w-md mx-auto">
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>(02) 8334-2091</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4 text-primary" />
                      <span>aseantower@ctpred.com.ph</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}