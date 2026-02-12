import { useState, useRef, React } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface Director {
  id: string;
  name: string;
  title: string;
  role: string;
  oneLiner: string;
  description: string;
  image: string;
  email: string;
  linkedin: string;
  biography: string;
  experience: string;
  expertise: string[];
  achievements: string[];
  isChairman?: boolean;
}

interface BoardOfDirectorsProps {
  onBack?: () => void;
}

const directors: Director[] = [
  {
    id: "1",
    name: "Robert Chen",
    title: "Chairman & CEO",
    role: "Chairman",
    oneLiner: "25+ years in global corporate strategy and governance",
    description: "Leading strategic vision and corporate governance across our portfolio.",
    image: "https://images.unsplash.com/photo-1739298061757-7a3339cee982?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGV4ZWN1dGl2ZSUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc1ODUyMzk5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    email: "r.chen@ctpredcorp.com",
    linkedin: "linkedin.com/in/robertchen",
    biography: "Robert Chen brings over 25 years of extensive experience in real estate development, strategic planning, and business development across multiple industries. As Chairman & CEO of CTP Red Corp, he has led the company's transformation into a leading commercial real estate investment firm, overseeing a portfolio worth over $2.1 billion.",
    experience: "Previously served as Senior Managing Director at several major property development companies",
    expertise: ["Strategy", "Governance", "Leadership"],
    achievements: [
      "Led CTP Corp transformation",
      "Managed $2.1B portfolio",
      "25+ years industry experience"
    ],
    isChairman: true
  },
  {
    id: "2",
    name: "Sarah Martinez",
    title: "Chief Operating Officer",
    role: "COO",
    oneLiner: "20+ years in operations and tenant excellence",
    description: "Expert in operational excellence and tenant relations.",
    image: "https://images.unsplash.com/photo-1736939666660-d4c776e0532c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHdvbWFuJTIwZXhlY3V0aXZlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU4NDcyODc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    email: "s.martinez@ctpredcorp.com",
    linkedin: "linkedin.com/in/sarahmartinez",
    biography: "Sarah brings 20 years of leadership experience in commercial real estate management and operations. Her expertise in sustainable building practices and tenant relations has been instrumental in CTP Red Corp's growth and reputation for excellence in the industry.",
    experience: "20+ years in commercial real estate operations and management",
    expertise: ["Operations", "Leadership", "Strategy"],
    achievements: [
      "Operational Excellence Leader",
      "Tenant Satisfaction Expert",
      "Sustainability Champion"
    ]
  },
  {
    id: "3",
    name: "Michael Johnson",
    title: "Chief Financial Officer",
    role: "CFO",
    oneLiner: "15+ years in financial strategy and risk management",
    description: "Strategic financial planning and risk management expertise.",
    image: "https://images.unsplash.com/photo-1584940120505-117038d90b05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBleGVjdXRpdmUlMjBidXNpbmVzc21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1ODUxOTczM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    email: "m.johnson@ctpredcorp.com",
    linkedin: "linkedin.com/in/michaeljohnson",
    biography: "Michael oversees all financial operations and strategic planning for CTP Red Corp. With his CPA certification and extensive background in real estate finance, he ensures the company's continued financial stability and growth trajectory.",
    experience: "15+ years in financial management and real estate finance",
    expertise: ["Finance", "Strategy", "Risk Management"],
    achievements: [
      "CPA Certified Professional",
      "Financial Strategy Expert",
      "Risk Management Leader"
    ]
  },
  {
    id: "4",
    name: "Elena Rodriguez",
    title: "Chief Development Officer",
    role: "Development",
    oneLiner: "18+ years in development and construction excellence",
    description: "Leading development and construction across all properties.",
    image: "https://images.unsplash.com/photo-1589639293663-f9399bb41721?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBmZW1hbGUlMjBleGVjdXRpdmUlMjBib2FyZHJvb218ZW58MXx8fHwxNzU4NTE5NzM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    email: "e.rodriguez@ctpredcorp.com",
    linkedin: "linkedin.com/in/elenarodriguez",
    biography: "Elena manages development initiatives and construction projects across all CTP Red Corp properties. Her background in architecture and project management has helped streamline development processes and deliver high-quality commercial spaces.",
    experience: "18+ years in development and construction management",
    expertise: ["Development", "Architecture", "Project Management"],
    achievements: [
      "Architecture Background",
      "Project Management Expert",
      "Development Innovation Leader"
    ]
  },
  {
    id: "5",
    name: "David Kim",
    title: "Independent Director",
    role: "Director",
    oneLiner: "22+ years in corporate governance and board leadership",
    description: "Independent governance and strategic oversight.",
    image: "https://images.unsplash.com/photo-1736939678218-bd648b5ef3bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW5pb3IlMjBleGVjdXRpdmUlMjBidXNpbmVzcyUyMGxlYWRlcnxlbnwxfHx8fDE3NTg1MTk3MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    email: "d.kim@ctpredcorp.com",
    linkedin: "linkedin.com/in/davidkim",
    biography: "David serves as an independent director, providing valuable insights from his experience in corporate governance and risk management. He currently serves on several other boards and brings external perspective to strategic decisions.",
    experience: "22+ years in corporate governance and board leadership",
    expertise: ["Governance", "Strategy", "Board Leadership"],
    achievements: [
      "Multi-Board Experience",
      "Governance Excellence",
      "Strategic Advisory Expert"
    ]
  },
  {
    id: "6",
    name: "Jennifer Park",
    title: "Lead Independent Director",
    role: "Director",
    oneLiner: "20+ years in corporate strategy and ESG leadership",
    description: "ESG initiatives and corporate transparency leadership.",
    image: "https://images.unsplash.com/photo-1745970347703-687874c5ddbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGV4ZWN1dGl2ZSUyMGxlYWRlcnNoaXAlMjB0ZWFtfGVufDF8fHx8MTc1ODUxOTc0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    email: "j.park@ctpredcorp.com",
    linkedin: "linkedin.com/in/jenniferpark",
    biography: "Jennifer leads our independent board committee and brings extensive experience in corporate strategy and ESG initiatives. Her leadership ensures transparency and accountability in all board decisions and company governance practices.",
    experience: "20+ years in corporate strategy and ESG leadership",
    expertise: ["ESG", "Strategy", "Governance"],
    achievements: [
      "ESG Leadership Pioneer",
      "Board Committee Chair",
      "Corporate Transparency Advocate"
    ]
  }
];

const getRoleColor = (role: string) => {
  switch (role.toLowerCase()) {
    case 'chairman':
      return 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg';
    case 'coo':
      return 'bg-blue-500 text-white';
    case 'cfo':
      return 'bg-green-500 text-white';
    case 'development':
      return 'bg-purple-500 text-white';
    case 'director':
      return 'bg-gray-600 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const getExpertiseIcon = (expertise: string) => {
  switch (expertise.toLowerCase()) {
    case 'strategy':
      return '📈';
    case 'leadership':
      return '👥';
    case 'governance':
      return '🏛️';
    case 'finance':
      return '💼';
    case 'operations':
      return '⚙️';
    case 'development':
      return '🏗️';
    case 'architecture':
      return '📐';
    case 'project management':
      return '📋';
    case 'risk management':
      return '🛡️';
    case 'esg':
      return '🌱';
    case 'board leadership':
      return '👔';
    default:
      return '⭐';
  }
};

export default function BoardOfDirectors({ onBack }: BoardOfDirectorsProps) {
  const [selectedDirector, setSelectedDirector] = useState<Director | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const totalExperience = directors.reduce((total, director) => {
    const experience = director.oneLiner.match(/(\d+)/);
    return total + (experience ? parseInt(experience[1]) : 20);
  }, 0);

  // Sort directors to put chairman first
  const sortedDirectors = [...directors].sort((a, b) => {
    if (a.isChairman) return -1;
    if (b.isChairman) return 1;
    return 0;
  });

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % directors.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + directors.length) % directors.length);
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Geometric Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: [
              'linear-gradient(30deg, #dc2626 12%, transparent 12.5%, transparent 87%, #dc2626 87.5%, #dc2626)',
              'linear-gradient(150deg, #dc2626 12%, transparent 12.5%, transparent 87%, #dc2626 87.5%, #dc2626)',
              'linear-gradient(30deg, #dc2626 12%, transparent 12.5%, transparent 87%, #dc2626 87.5%, #dc2626)',
              'linear-gradient(150deg, #dc2626 12%, transparent 12.5%, transparent 87%, #dc2626 87.5%, #dc2626)'
            ].join(', '),
            backgroundSize: '80px 140px',
            backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px'
          }}
        />
      </div>

      {/* Hero Section with Gradient Background */}
      <div className="relative bg-gradient-to-br from-gray-900 via-red-900 to-red-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">Board of Directors</h1>
          <div className="w-24 h-1 bg-red-400 mx-auto mb-8"></div>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-12">
            Meet the visionaries guiding our company forward with expertise and integrity.
          </p>

          {/* Experience Info Bar */}
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
            <div className="w-3 h-3 bg-red-400 rounded-full mr-3 animate-pulse"></div>
            <span className="text-white font-medium">
              {totalExperience}+ years combined leadership experience
            </span>
          </div>
        </div>
      </div>

      {/* Directors Grid - Desktop & Tablet */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {sortedDirectors.map((director, index) => (
            <div 
              key={director.id}
              className={`group relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 ${
                director.isChairman 
                  ? 'ring-2 ring-red-200 shadow-xl' 
                  : ''
              }`}
              onClick={() => setSelectedDirector(director)}
              style={{ aspectRatio: '1 / 1.3' }}
            >
              {/* Director Photo Container */}
              <div className="relative overflow-hidden h-64">
                <ImageWithFallback
                  src={director.image}
                  alt={`${director.name} - ${director.title}`}
                  className="w-full h-full object-cover object-top transition-all duration-700 filter grayscale-[0.8] group-hover:grayscale-0 group-hover:scale-110"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-red-600/80 via-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end">
                  <div className="p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-sm font-medium leading-relaxed">
                      {director.oneLiner}
                    </p>
                  </div>
                </div>

                {/* Role Badge */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${getRoleColor(director.role)}`}>
                  {director.role}
                </div>

                {/* Chairman Special Badge */}
                {director.isChairman && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                    ⭐ CHAIRMAN
                  </div>
                )}
              </div>

              {/* Director Information */}
              <div className="p-4 lg:p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {director.name}
                </h3>
                <h4 className="text-gray-600 font-medium mb-3 text-sm">
                  {director.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1 line-clamp-2">
                  {director.description}
                </p>
                
                {/* Expertise Badges */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {director.expertise.slice(0, 3).map((skill, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-red-50 text-red-600 border border-red-100"
                    >
                      <span className="mr-1">{getExpertiseIcon(skill)}</span>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden relative">
          <div className="overflow-hidden rounded-xl">
            <div 
              ref={sliderRef}
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {directors.map((director) => (
                <div 
                  key={director.id}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div 
                    className={`group relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 ${
                      director.isChairman 
                        ? 'ring-2 ring-red-200 shadow-xl' 
                        : ''
                    }`}
                    onClick={() => setSelectedDirector(director)}
                    style={{ aspectRatio: '1 / 1.3' }}
                  >
                    {/* Director Photo Container */}
                    <div className="relative overflow-hidden h-64">
                      <ImageWithFallback
                        src={director.image}
                        alt={`${director.name} - ${director.title}`}
                        className="w-full h-full object-cover object-top transition-all duration-500 filter grayscale-[0.8] group-active:grayscale-0 group-active:scale-105"
                      />
                      
                      {/* Role Badge */}
                      <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(director.role)}`}>
                        {director.role}
                      </div>

                      {/* Chairman Special Badge */}
                      {director.isChairman && (
                        <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                          ⭐ CHAIRMAN
                        </div>
                      )}

                      {/* Mobile Tap Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-red-600/60 via-transparent to-transparent opacity-0 group-active:opacity-100 transition-opacity duration-200 flex items-end">
                        <div className="p-4 text-white">
                          <p className="text-sm font-medium">
                            {director.oneLiner}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Director Information */}
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {director.name}
                      </h3>
                      <h4 className="text-gray-600 font-medium mb-2 text-sm">
                        {director.title}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed mb-3 flex-1">
                        {director.description}
                      </p>
                      
                      {/* Expertise Badges */}
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {director.expertise.slice(0, 3).map((skill, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-red-50 text-red-600 border border-red-100"
                          >
                            <span className="mr-1">{getExpertiseIcon(skill)}</span>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 z-10 transition-all duration-200"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 z-10 transition-all duration-200"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {directors.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  index === currentSlide ? 'bg-red-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <Dialog open={!!selectedDirector} onOpenChange={() => setSelectedDirector(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedDirector && (
            <div className="p-6">
              <DialogHeader className="sr-only">
                <DialogTitle>{selectedDirector.name} - Profile</DialogTitle>
                <DialogDescription>
                  Detailed profile information for {selectedDirector.name}, {selectedDirector.title} at CTP Red Corp.
                </DialogDescription>
              </DialogHeader>

              {/* Director Photo */}
              <div className="text-center mb-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-100 mb-4 ring-4 ring-red-100">
                  <ImageWithFallback
                    src={selectedDirector.image}
                    alt={`${selectedDirector.name} - ${selectedDirector.title}`}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedDirector.name}
                </h2>
                <p className="text-lg text-gray-600 mb-2">
                  {selectedDirector.title}
                </p>
                <p className="text-red-600 font-medium mb-4">
                  {selectedDirector.oneLiner}
                </p>
                
                {/* Role and Expertise Tags */}
                <div className="flex justify-center flex-wrap gap-2 mb-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(selectedDirector.role)}`}>
                    {selectedDirector.role}
                  </span>
                  {selectedDirector.expertise.map((skill, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      <span className="mr-1">{getExpertiseIcon(skill)}</span>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {selectedDirector.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    {selectedDirector.linkedin}
                  </div>
                </div>
              </div>

              {/* Biography */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Biography</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {selectedDirector.biography}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {selectedDirector.experience}
                </p>
              </div>

              {/* Career Highlights */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Career Highlights</h3>
                <ul className="space-y-2">
                  {selectedDirector.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3 flex-shrink-0"></div>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Custom Footer for Board of Directors */}
      <footer className="relative bg-gray-50">
        {/* Geometric Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: [
                'linear-gradient(30deg, #dc2626 12%, transparent 12.5%, transparent 87%, #dc2626 87.5%, #dc2626)',
                'linear-gradient(150deg, #dc2626 12%, transparent 12.5%, transparent 87%, #dc2626 87.5%, #dc2626)',
                'linear-gradient(30deg, #dc2626 12%, transparent 12.5%, transparent 87%, #dc2626 87.5%, #dc2626)',
                'linear-gradient(150deg, #dc2626 12%, transparent 12.5%, transparent 87%, #dc2626 87.5%, #dc2626)'
              ].join(', '),
              backgroundSize: '80px 140px',
              backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px'
            }}
          />
        </div>
      </footer>
    </div>
  );
}