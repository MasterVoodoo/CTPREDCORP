import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Plus, FileText, Calendar, User, Share2, Download, Shield, FileCheck, Lock, AlertTriangle } from 'lucide-react';

interface PolicyArticle {
  id: string;
  title: string;
  category: string;
  description: string;
  author: string;
  date: string;
  shares: number;
  image: string;
  type: 'article';
}

interface PolicyDocument {
  id: string;
  title: string;
  category: string;
  description: string;
  author: string;
  date: string;
  shares: number;
  image: string;
  type: 'document';
  fileSize?: string;
}

interface PoliciesProceduresProps {
  onBack?: () => void;
}

const policyArticles: PolicyArticle[] = [
  {
    id: "art-1",
    title: "Code of Business Conduct",
    category: "Ethics & Compliance",
    description: "Comprehensive guidelines outlining ethical standards and professional conduct expectations for all stakeholders.",
    author: "Sarah Rodriguez",
    date: "March 15, 2024",
    shares: 142,
    image: "https://images.unsplash.com/photo-1695720247431-2790feab65c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGV0aGljcyUyMGNvbXBsaWFuY2UlMjBoYW5kYm9va3xlbnwxfHx8fDE3NTkwNDAwODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    type: 'article'
  },
  {
    id: "art-2",
    title: "Environmental Sustainability Policy",
    category: "Sustainability",
    description: "Guidelines for environmental responsibility, energy efficiency, and sustainable building practices.",
    author: "Elena Martinez",
    date: "March 10, 2024",
    shares: 98,
    image: "https://images.unsplash.com/photo-1719825523711-eda3221c111c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJpbGl0eSUyMGVudmlyb25tZW50YWwlMjBwb2xpY3klMjBncmVlbnxlbnwxfHx8fDE3NTkwNDAwODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    type: 'article'
  },
  {
    id: "art-3",
    title: "Data Protection & Privacy Standards",
    category: "Data Security",
    description: "Comprehensive data protection standards ensuring compliance with privacy regulations and safeguarding information.",
    author: "Alex Kumar",
    date: "March 5, 2024",
    shares: 156,
    image: "https://images.unsplash.com/photo-1603985529862-9e12198c9a60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2VjdXJpdHklMjBwcml2YWN5JTIwcHJvdGVjdGlvbnxlbnwxfHx8fDE3NTkwNDAwODh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    type: 'article'
  }
];

const policyDocuments: PolicyDocument[] = [
  {
    id: "doc-1",
    title: "Health & Safety Procedures Manual",
    category: "Safety",
    description: "Detailed safety protocols and emergency procedures for building occupants and visitors.",
    author: "Marcus Chen",
    date: "March 12, 2024",
    shares: 87,
    fileSize: "2.4 MB",
    image: "shield", // Icon identifier
    type: 'document'
  },
  {
    id: "doc-2",
    title: "Anti-Corruption & Bribery Policy",
    category: "Ethics & Compliance",
    description: "Zero-tolerance policy regarding corruption, bribery, and unethical business practices.",
    author: "Jennifer Park",
    date: "February 28, 2024",
    shares: 124,
    fileSize: "1.8 MB",
    image: "lock", // Icon identifier
    type: 'document'
  },
  {
    id: "doc-3",
    title: "Corporate Governance Framework",
    category: "Operations",
    description: "Best practices for maintaining corporate governance standards and regulatory compliance.",
    author: "David Thompson",
    date: "February 25, 2024",
    shares: 203,
    fileSize: "3.1 MB",
    image: "filecheck", // Icon identifier
    type: 'document'
  }
];

// Helper function to render document icons
const renderDocumentIcon = (iconType: string) => {
  const iconProps = {
    className: "w-10 h-10 text-red-400",
    strokeWidth: 1.5
  };

  switch (iconType) {
    case 'shield':
      return <Shield {...iconProps} />;
    case 'lock':
      return <Lock {...iconProps} />;
    case 'filecheck':
      return <FileCheck {...iconProps} />;
    case 'alert':
      return <AlertTriangle {...iconProps} />;
    default:
      return <FileText {...iconProps} />;
  }
};

export default function PoliciesProcedures({ onBack }: PoliciesProceduresProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(180deg, #8B0000 0%, #0D0D0D 100%)'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Back button */}
        {onBack && (
          <button
            onClick={onBack}
            className="mb-8 flex items-center px-4 py-2 rounded-lg bg-black/20 backdrop-blur-sm border border-red-600/30 text-white hover:bg-red-600 hover:border-red-500 transition-all duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        )}

        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-6 tracking-tight">
            Policies & Procedures
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Centralized access to company policies, documents, and updates
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Add Policy Panel */}
          <div className="lg:w-80 space-y-6">
            {/* Action Buttons */}
            <div className="space-y-4">
              <button className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 group">
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                Add an Article
              </button>
              
              <button className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-black border-2 border-red-600 text-white rounded-lg hover:bg-red-600 hover:border-red-500 transition-all duration-300 group">
                <FileText className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Add a Document
              </button>
            </div>

            {/* Date Range Filter */}
            <div className="bg-black/20 backdrop-blur-sm border border-red-600/30 rounded-lg p-6">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-red-400" />
                Date Range Filter
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-black/30 border border-red-600/50 rounded-lg text-white text-sm focus:border-red-400 focus:outline-none transition-colors duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-black/30 border border-red-600/50 rounded-lg text-white text-sm focus:border-red-400 focus:outline-none transition-colors duration-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-12">
            {/* Policy Articles Section */}
            <section>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Policy Articles</h2>
                <div 
                  className="h-0.5 w-32"
                  style={{
                    background: 'linear-gradient(90deg, #ef4444 0%, rgba(239, 68, 68, 0.3) 100%)',
                    boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)'
                  }}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {policyArticles.map((article) => (
                  <div
                    key={article.id}
                    className="group relative bg-[#1A1A1A] rounded-2xl p-8 transition-all duration-300 hover:scale-105 cursor-pointer"
                    style={{
                      boxShadow: '0 8px 32px rgba(239, 68, 68, 0.15)',
                    }}
                  >
                    {/* Hover Glow Effect */}
                    <div 
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                      style={{
                        boxShadow: '0 0 40px rgba(239, 68, 68, 0.3)'
                      }}
                    />

                    {/* Circular Image */}
                    <div className="relative mb-8 flex justify-center">
                      <div 
                        className="w-24 h-24 rounded-full overflow-hidden border-2 border-red-500 group-hover:border-red-400 transition-colors duration-300"
                        style={{
                          boxShadow: '0 0 16px rgba(239, 68, 68, 0.4)'
                        }}
                      >
                        <ImageWithFallback
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center space-y-4">
                      <h3 className="text-xl font-bold text-white group-hover:text-red-50 transition-colors duration-300">
                        {article.title}
                      </h3>
                      
                      <p className="text-base text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                        {article.description}
                      </p>
                      
                      {/* Meta Information */}
                      <div className="flex items-center justify-between pt-6 border-t border-red-900/30">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1 hover:text-red-400 transition-colors duration-300 cursor-pointer">
                            <User className="w-4 h-4" />
                            {article.author}
                          </span>
                          <span className="flex items-center gap-1 hover:text-red-400 transition-colors duration-300 cursor-pointer">
                            <Share2 className="w-4 h-4" />
                            {article.shares}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {article.date}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Policy Documents Section */}
            <section>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Policy Documents</h2>
                <div 
                  className="h-0.5 w-40"
                  style={{
                    background: 'linear-gradient(90deg, #ef4444 0%, rgba(239, 68, 68, 0.3) 100%)',
                    boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)'
                  }}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {policyDocuments.map((document) => (
                  <div
                    key={document.id}
                    className="group relative bg-[#1A1A1A] rounded-2xl p-8 transition-all duration-300 hover:scale-105 cursor-pointer"
                    style={{
                      boxShadow: '0 8px 32px rgba(239, 68, 68, 0.15)',
                    }}
                  >
                    {/* Hover Glow Effect */}
                    <div 
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                      style={{
                        boxShadow: '0 0 40px rgba(239, 68, 68, 0.3)'
                      }}
                    />

                    {/* Circular Icon */}
                    <div className="relative mb-8 flex justify-center">
                      <div 
                        className="w-24 h-24 rounded-full bg-black/30 border-2 border-red-500 group-hover:border-red-400 transition-all duration-300 flex items-center justify-center"
                        style={{
                          boxShadow: '0 0 16px rgba(239, 68, 68, 0.4)'
                        }}
                      >
                        {renderDocumentIcon(document.image)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center space-y-4">
                      <h3 className="text-xl font-bold text-white group-hover:text-red-50 transition-colors duration-300">
                        {document.title}
                      </h3>
                      
                      <p className="text-base text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                        {document.description}
                      </p>
                      
                      {/* File Size & Download */}
                      <div className="flex items-center justify-center gap-2 pt-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-600/30 rounded-full text-sm text-red-300 hover:bg-red-600 hover:text-white transition-all duration-300">
                          <Download className="w-4 h-4" />
                          {document.fileSize}
                        </button>
                      </div>
                      
                      {/* Meta Information */}
                      <div className="flex items-center justify-between pt-6 border-t border-red-900/30">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1 hover:text-red-400 transition-colors duration-300 cursor-pointer">
                            <User className="w-4 h-4" />
                            {document.author}
                          </span>
                          <span className="flex items-center gap-1 hover:text-red-400 transition-colors duration-300 cursor-pointer">
                            <Share2 className="w-4 h-4" />
                            {document.shares}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {document.date}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}