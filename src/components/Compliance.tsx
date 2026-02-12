import { useState, React } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Search, 
  Filter, 
  Shield, 
  FileText, 
  Award, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface ComplianceProps {
  onBack?: () => void;
}

interface ComplianceCard {
  id: string;
  title: string;
  category: 'Certifications' | 'Policies' | 'Reports';
  description: string;
  status: 'Active' | 'Pending' | 'Expiring';
  icon: string;
  buttonText: string;
  fileSize?: string;
}

interface ComplianceDetail {
  id: string;
  title: string;
  description: string;
  lastUpdated: string;
  documents: string[];
}

const complianceCards: ComplianceCard[] = [
  {
    id: 'cert-1',
    title: 'ISO 27001 Certification',
    category: 'Certifications',
    description: 'Information Security Management System certification ensuring robust data protection and cybersecurity protocols.',
    status: 'Active',
    icon: 'shield',
    buttonText: 'View Certificate'
  },
  {
    id: 'cert-2',
    title: 'GDPR Compliance',
    category: 'Certifications',
    description: 'General Data Protection Regulation compliance framework for EU data privacy and protection standards.',
    status: 'Active',
    icon: 'shield',
    buttonText: 'View Details'
  },
  {
    id: 'cert-3',
    title: 'HIPAA Certification',
    category: 'Certifications',
    description: 'Health Insurance Portability and Accountability Act compliance for healthcare data protection.',
    status: 'Active',
    icon: 'shield',
    buttonText: 'View Certificate'
  },
  {
    id: 'policy-1',
    title: 'Data Protection Policy',
    category: 'Policies',
    description: 'Comprehensive data protection and privacy policy outlining our commitment to securing sensitive information.',
    status: 'Active',
    icon: 'filetext',
    buttonText: 'Download',
    fileSize: '2.4 MB'
  },
  {
    id: 'policy-2',
    title: 'Anti-Corruption Framework',
    category: 'Policies',
    description: 'Zero-tolerance policy framework for preventing corruption, bribery, and unethical business practices.',
    status: 'Active',
    icon: 'filetext',
    buttonText: 'Download',
    fileSize: '1.8 MB'
  },
  {
    id: 'policy-3',
    title: 'Environmental Compliance',
    category: 'Policies',
    description: 'Environmental sustainability and compliance policies ensuring responsible business operations.',
    status: 'Active',
    icon: 'filetext',
    buttonText: 'Download',
    fileSize: '3.2 MB'
  },
  {
    id: 'report-1',
    title: 'Quarterly Compliance Report',
    category: 'Reports',
    description: 'Detailed quarterly assessment of compliance status across all regulatory requirements and frameworks.',
    status: 'Active',
    icon: 'filetext',
    buttonText: 'Download',
    fileSize: '5.1 MB'
  },
  {
    id: 'report-2',
    title: 'Security Audit Report',
    category: 'Reports',
    description: 'Independent third-party security audit results and recommendations for continuous improvement.',
    status: 'Active',
    icon: 'filetext',
    buttonText: 'Download',
    fileSize: '4.7 MB'
  },
  {
    id: 'report-3',
    title: 'Risk Assessment Report',
    category: 'Reports',
    description: 'Comprehensive risk assessment covering operational, financial, and regulatory compliance risks.',
    status: 'Pending',
    icon: 'filetext',
    buttonText: 'Download',
    fileSize: '3.9 MB'
  }
];

const complianceDetails: ComplianceDetail[] = [
  {
    id: 'detail-1',
    title: 'Information Security Management',
    description: 'Comprehensive security protocols including access controls, encryption standards, and incident response procedures.',
    lastUpdated: 'March 15, 2024',
    documents: ['Security Policy v3.2', 'Incident Response Plan', 'Access Control Matrix']
  },
  {
    id: 'detail-2',
    title: 'Financial Compliance & Reporting',
    description: 'Adherence to financial reporting standards, audit requirements, and regulatory disclosure obligations.',
    lastUpdated: 'February 28, 2024',
    documents: ['Financial Reporting Standards', 'Audit Compliance Guide', 'SOX Implementation']
  },
  {
    id: 'detail-3',
    title: 'Environmental & Sustainability',
    description: 'Environmental compliance framework including waste management, energy efficiency, and sustainability reporting.',
    lastUpdated: 'March 20, 2024',
    documents: ['Environmental Policy', 'Sustainability Framework', 'Carbon Footprint Report']
  }
];

const trustLogos = [
  { name: 'ISO', logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=40&fit=crop&crop=center' },
  { name: 'GDPR', logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=40&fit=crop&crop=center' },
  { name: 'HIPAA', logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=40&fit=crop&crop=center' },
  { name: 'SOX', logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=40&fit=crop&crop=center' },
  { name: 'SOC 2', logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=40&fit=crop&crop=center' }
];

const renderIcon = (iconType: string) => {
  const iconProps = {
    className: "w-8 h-8 text-red-400",
    strokeWidth: 1.5
  };

  switch (iconType) {
    case 'shield':
      return <Shield {...iconProps} />;
    case 'filetext':
      return <FileText {...iconProps} />;
    case 'award':
      return <Award {...iconProps} />;
    default:
      return <FileText {...iconProps} />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'Pending':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'Expiring':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

export default function Compliance({ onBack }: ComplianceProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'All' | 'Certifications' | 'Policies' | 'Reports'>('All');
  const [expandedDetails, setExpandedDetails] = useState<string[]>([]);

  const filteredCards = complianceCards.filter(card => {
    const matchesSearch = card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'All' || card.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const toggleDetail = (id: string) => {
    setExpandedDetails(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div 
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #000000 0%, #1a0000 50%, #8B0000 100%)'
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          {/* Back button */}
          {onBack && (
            <button
              onClick={onBack}
              className="mb-8 flex items-center px-6 py-3 rounded-full bg-black/40 border border-red-600/30 text-white hover:bg-red-600 hover:border-red-500 transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Sustainability
            </button>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                Compliance & 
                <span className="text-red-400 block">Certifications</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Building trust through transparency, accountability, and unwavering commitment to 
                the highest standards of regulatory compliance and business integrity.
              </p>
            </div>

            {/* Right side - Illustration */}
            <div className="flex justify-center">
              <div className="relative">
                <div 
                  className="w-80 h-80 rounded-full flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, transparent 70%)',
                    boxShadow: '0 0 60px rgba(239, 68, 68, 0.3)'
                  }}
                >
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1639503547276-90230c4a4198?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wbGlhbmNlJTIwc2VjdXJpdHklMjBzaGllbGR8ZW58MXx8fHwxNzU5MTE0OTk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Compliance and Security"
                    className="w-64 h-64 object-cover rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Strip */}
        <div className="relative border-t border-red-900/30 bg-black/40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-center space-x-12 opacity-60">
              {trustLogos.map((logo, index) => (
                <div key={index} className="text-white font-semibold text-lg tracking-wider">
                  {logo.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-gradient-to-b from-gray-900 to-black py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search compliance documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-black/60 border border-red-900/30 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as any)}
                className="appearance-none pl-4 pr-12 py-4 bg-black/60 border border-red-900/30 rounded-full text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Certifications">Certifications</option>
                <option value="Policies">Policies</option>
                <option value="Reports">Reports</option>
              </select>
              <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Cards Section */}
      <div className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCards.map((card) => (
              <div
                key={card.id}
                className="group relative bg-[#1A1A1A] rounded-2xl p-8 transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{
                  boxShadow: '0 8px 32px rgba(239, 68, 68, 0.15)',
                }}
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-600/0 via-red-600/0 to-red-600/0 group-hover:from-red-600/10 group-hover:via-red-600/5 group-hover:to-red-600/10 transition-all duration-300 pointer-events-none"></div>
                
                <div className="relative">
                  {/* Icon */}
                  <div className="mb-6">
                    <div 
                      className="w-16 h-16 rounded-full bg-black/30 border-2 border-red-500 group-hover:border-red-400 transition-all duration-300 flex items-center justify-center"
                      style={{
                        boxShadow: '0 0 16px rgba(239, 68, 68, 0.4)'
                      }}
                    >
                      {renderIcon(card.icon)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-bold text-white group-hover:text-red-50 transition-colors duration-300">
                        {card.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(card.status)}`}>
                        {card.status}
                      </span>
                    </div>
                    
                    <p className="text-base text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                      {card.description}
                    </p>

                    {/* Action Button */}
                    <div className="pt-4">
                      <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full hover:from-red-500 hover:to-red-600 transition-all duration-300 font-medium">
                        {card.category === 'Reports' || card.category === 'Policies' ? (
                          <>
                            <Download className="w-4 h-4" />
                            {card.buttonText}
                            {card.fileSize && <span className="text-xs opacity-75">({card.fileSize})</span>}
                          </>
                        ) : (
                          <>
                            <ExternalLink className="w-4 h-4" />
                            {card.buttonText}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Compliance List Section */}
      <div className="bg-gradient-to-b from-black to-gray-900 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Detailed Compliance Framework</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Comprehensive overview of our compliance policies and procedures across key business areas.
            </p>
          </div>

          <div className="space-y-4">
            {complianceDetails.map((detail) => (
              <div
                key={detail.id}
                className="bg-[#1A1A1A] rounded-xl border border-red-900/20 overflow-hidden"
              >
                <button
                  onClick={() => toggleDetail(detail.id)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-red-900/10 transition-colors duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-1 h-8 bg-red-500 rounded-full"></div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{detail.title}</h3>
                      <p className="text-sm text-gray-400">Last updated: {detail.lastUpdated}</p>
                    </div>
                  </div>
                  <div className="text-red-400">
                    {expandedDetails.includes(detail.id) ? (
                      <ChevronDown className="w-6 h-6" />
                    ) : (
                      <ChevronRight className="w-6 h-6" />
                    )}
                  </div>
                </button>
                
                {expandedDetails.includes(detail.id) && (
                  <div className="px-8 pb-6 border-t border-red-900/20">
                    <div className="pt-6">
                      <p className="text-gray-300 mb-6 leading-relaxed">
                        {detail.description}
                      </p>
                      
                      <div>
                        <h4 className="font-medium text-white mb-3">Related Documents:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {detail.documents.map((doc, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-red-900/20"
                            >
                              <span className="text-sm text-gray-300">{doc}</span>
                              <button className="text-red-400 hover:text-red-300 transition-colors">
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Separator */}
      <div className="relative">
        <div 
          className="h-px w-full"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #ef4444 50%, transparent 100%)',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)'
          }}
        ></div>
      </div>
    </div>
  );
}