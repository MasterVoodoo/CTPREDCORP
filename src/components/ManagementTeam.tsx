import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface Manager {
  id: string;
  name: string;
  title: string;
  department: string;
  quote: string;
  description: string;
  biography: string;
  image: string;
}

interface ManagementTeamProps {
  onBack?: () => void;
}

// Reduced to 6 team members for 2x3 grid layout
const managementTeam: Manager[] = [
  {
    id: "1",
    name: "Sarah Rodriguez",
    title: "Chief Executive Officer",
    department: "Strategy",
    quote: "Leadership is about empowering others to achieve extraordinary outcomes.",
    description: "Sarah leads CTP Red Corp with over 20 years of experience in commercial real estate management. Her strategic vision focuses on sustainable growth and operational excellence across our portfolio.",
    biography: "Sarah Rodriguez brings over 20 years of extensive experience in commercial real estate management, strategic planning, and organizational leadership. As CEO of CTP Red Corp, she has transformed the company into a leading commercial real estate investment firm, overseeing a diverse portfolio of premium office spaces. Her strategic vision emphasizes sustainable growth, operational excellence, and innovation in property management. Prior to joining CTP Red Corp, Sarah held senior executive positions at major real estate firms where she successfully managed billion-dollar portfolios and led cross-functional teams. She holds an MBA in Real Estate Finance and is a certified member of the International Council of Shopping Centers (ICSC).",
    image: "https://images.unsplash.com/photo-1565688527174-775059ac429c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBtYW5hZ2VtZW50JTIwdGVhbSUyMGV4ZWN1dGl2ZXN8ZW58MXx8fHwxNzU4NTIwMTI4fDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: "2",
    name: "David Thompson",
    title: "Chief Financial Officer",
    department: "Finance",
    quote: "Financial excellence is the foundation of sustainable business growth.",
    description: "David oversees all financial operations with expertise in real estate finance and strategic planning. His leadership ensures robust financial performance and sustainable growth strategies.",
    biography: "David Thompson oversees all financial operations at CTP Red Corp with over 18 years of expertise in real estate finance, strategic planning, and risk management. His comprehensive approach to financial leadership has been instrumental in achieving consistent revenue growth and maintaining strong investor relations. David's background includes extensive experience in capital markets, portfolio optimization, and financial modeling for commercial real estate investments. He previously served as CFO at several major property development companies where he successfully managed complex financial restructuring projects and led multiple capital raising initiatives. David is a CPA and holds a Master's degree in Finance from a top-tier business school.",
    image: "https://images.unsplash.com/photo-1603252112050-5ee77b4b4fde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGV4ZWN1dGl2ZSUyMG1hbmFnZW1lbnQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTg1MjAxMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: "3",
    name: "Elena Martinez",
    title: "Chief Operations Officer",
    department: "Operations",
    quote: "Operational excellence creates exceptional experiences for every tenant.",
    description: "Elena manages day-to-day operations across all properties, ensuring exceptional tenant experiences and operational efficiency through innovative property management practices.",
    biography: "Elena Martinez manages comprehensive day-to-day operations across all CTP Red Corp properties, ensuring exceptional tenant experiences and optimal operational efficiency. With over 16 years of experience in property management and operations, she has developed innovative systems and processes that have significantly improved tenant satisfaction rates and operational performance metrics. Elena's expertise spans facility management, vendor relations, lease administration, and strategic planning for operational improvements. She has successfully implemented cost-reduction initiatives that have saved millions while enhancing service quality. Elena holds professional certifications in property management and is an active member of the Building Owners and Managers Association (BOMA).",
    image: "https://images.unsplash.com/photo-1553028826-defa0c2187d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBidXNpbmVzcyUyMGV4ZWN1dGl2ZSUyMGxlYWRlcnxlbnwxfHx8fDE3NTg1MjAxMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: "4",
    name: "Marcus Chen",
    title: "VP of Development",
    department: "Strategy",
    quote: "Innovation in design creates spaces where businesses thrive.",
    description: "Marcus leads development initiatives and construction projects, focusing on sustainable building practices and innovative design solutions for modern commercial spaces.",
    biography: "Marcus Chen leads all development initiatives and construction projects at CTP Red Corp, with a specialized focus on sustainable building practices and innovative design solutions for modern commercial spaces. With over 14 years of experience in real estate development and construction management, he has overseen the successful completion of numerous high-profile projects totaling over $500 million in value. Marcus's expertise includes project planning, design coordination, construction oversight, and sustainable building certification processes. He has been instrumental in achieving LEED certification for multiple CTP Red Corp properties and implementing green building technologies that reduce operational costs and environmental impact. Marcus holds a degree in Civil Engineering and is a LEED Accredited Professional.",
    image: "https://images.unsplash.com/photo-1553830591-fddf9c6e2ed1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBtYW5hZ2VyJTIwYnVzaW5lc3MlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzU4NTIwMTM5fDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: "5",
    name: "Jennifer Park",
    title: "Director of Sustainability",
    department: "Sustainability",
    quote: "Sustainable practices today create a better tomorrow for all.",
    description: "Jennifer leads our sustainability initiatives, implementing eco-friendly practices and ensuring our properties meet the highest environmental standards.",
    biography: "Jennifer Park serves as Director of Sustainability at CTP Red Corp, leading comprehensive environmental, social, and governance (ESG) initiatives across our entire portfolio. With over 12 years of experience in sustainability consulting and green building practices, she has developed and implemented strategic sustainability programs that have significantly reduced our environmental footprint while enhancing operational efficiency. Jennifer's expertise includes energy management, waste reduction, water conservation, and sustainable building certifications. She has successfully led initiatives that resulted in 30% energy reduction across our portfolio and achieved multiple green building certifications. Jennifer holds a Master's degree in Environmental Science and is a certified sustainability professional.",
    image: "https://images.unsplash.com/photo-1745970347703-687874c5ddbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGV4ZWN1dGl2ZSUyMGxlYWRlcnNoaXAlMjB0ZWFtfGVufDF8fHx8MTc1ODUxOTc0M3ww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: "6",
    name: "Alex Kumar",
    title: "Chief Technology Officer",
    department: "Technology",
    quote: "Technology should seamlessly enhance human experiences.",
    description: "Alex drives digital transformation initiatives, implementing smart building technologies and innovative solutions to enhance tenant experiences.",
    biography: "Alex Kumar serves as Chief Technology Officer at CTP Red Corp, driving comprehensive digital transformation initiatives and implementing cutting-edge smart building technologies to enhance tenant experiences and operational efficiency. With over 15 years of experience in enterprise technology and real estate tech solutions, Alex has successfully modernized our entire technology infrastructure and introduced innovative systems that have revolutionized property management operations. His expertise includes IoT implementation, building automation systems, data analytics, and cybersecurity. Alex has led initiatives that resulted in significant operational cost savings and improved tenant satisfaction through technology-enabled services. He holds a Master's degree in Computer Science and multiple technology certifications.",
    image: "https://images.unsplash.com/photo-1684779094050-f5ca0a6b32c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1hbiUyMHRlY2hub2xvZ3klMjBleGVjdXRpdmV8ZW58MXx8fHwxNzU4NTI0MDQzfDA&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

// Department filter options
const departments = ['All', 'Operations', 'Finance', 'Strategy', 'Sustainability', 'Technology'];

// Timeline milestones
const timelineMilestones = [
  {
    year: "2018",
    title: "Expanded Global Operations",
    description: "Opened new regional offices and expanded international presence"
  },
  {
    year: "2020",
    title: "Digital Transformation Initiative",
    description: "Implemented comprehensive smart building technologies"
  },
  {
    year: "2021",
    title: "Launched Sustainability Program",
    description: "Achieved LEED certification across portfolio and launched ESG initiatives"
  },
  {
    year: "2023",
    title: "Technology Innovation Hub",
    description: "Established dedicated innovation lab for emerging technologies"
  },
  {
    year: "2024",
    title: "Carbon Neutral Commitment",
    description: "Committed to achieving carbon neutrality across all properties by 2030"
  }
];

export default function ManagementTeam({ onBack }: ManagementTeamProps) {
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');

  // Filter managers based on selected department
  const filteredManagers = activeFilter === 'All' 
    ? managementTeam 
    : managementTeam.filter(manager => manager.department === activeFilter);

  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(180deg, #7f1d1d 0%, #0f0f0f 70%, #000000 100%)'
      }}
    >
      {/* Main Content Section */}
      <div className="py-20 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back button */}
          {onBack && (
            <button
              onClick={onBack}
              className="mb-12 flex items-center px-6 py-3 rounded-lg border border-white/30 text-white hover:bg-white/15 hover:border-white/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-600 backdrop-blur-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>
          )}

          {/* Section Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-white mb-6 tracking-tight">
              Our Management Team
            </h1>
            <p className="text-lg text-gray-100 max-w-3xl mx-auto leading-relaxed">
              Meet the visionary leaders driving innovation, excellence, and strategic growth across all aspects of our organization. Our diverse management team brings decades of combined expertise in real estate, technology, sustainability, and operations.
            </p>
          </div>

          {/* Department Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-20">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setActiveFilter(dept)}
                className={`px-7 py-3 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-600 backdrop-blur-sm ${
                  activeFilter === dept
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg border border-red-500/50'
                    : 'bg-white/15 text-white hover:bg-white/25 border border-white/30 hover:border-white/50'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Management Team Grid - 2x3 Layout with Larger Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {filteredManagers.map((manager) => (
              <div 
                key={manager.id}
                className="group bg-black/90 rounded-xl overflow-hidden transition-all duration-300 ease-in-out cursor-pointer transform hover:-translate-y-1.5 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-red-600"
                onClick={() => setSelectedManager(manager)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedManager(manager);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`View profile for ${manager.name}`}
                style={{
                  boxShadow: '0 6px 20px rgba(0,0,0,0.6)',
                  transition: 'all 250ms ease-in-out'
                }}
              >
                {/* Manager Photo Container */}
                <div className="flex flex-col items-center p-8 space-y-5">
                  {/* Avatar with Gradient Border */}
                  <div className="relative">
                    <div 
                      className="w-44 h-44 rounded-full p-1 group-hover:animate-pulse transition-all duration-300"
                      style={{
                        background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                        boxShadow: '0 0 25px rgba(220, 38, 38, 0.4)'
                      }}
                    >
                      <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                        <ImageWithFallback
                          src={manager.image}
                          alt={`${manager.name} - ${manager.title}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Manager Information */}
                  <div className="text-center space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {manager.name}
                      </h3>
                      <p className="text-base text-gray-200 mb-3">
                        {manager.title}
                      </p>
                      {/* Accent Line */}
                      <div className="w-14 h-0.5 bg-red-600 mx-auto mb-4"></div>
                    </div>
                    
                    <p className="text-sm italic text-gray-300 leading-relaxed px-3">
                      "{manager.quote}"
                    </p>

                    {/* Highlight Badge */}
                    <div className="pt-3">
                      <span 
                        className="inline-block px-4 py-1.5 rounded-full text-xs font-medium text-white"
                        style={{
                          background: 'linear-gradient(135deg, #dc2626, #991b1b)'
                        }}
                      >
                        {manager.department}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <Dialog open={!!selectedManager} onOpenChange={() => setSelectedManager(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
          {selectedManager && (
            <div className="p-6">
              <DialogHeader className="sr-only">
                <DialogTitle>{selectedManager.name} - Profile</DialogTitle>
                <DialogDescription>
                  Detailed profile information for {selectedManager.name}, {selectedManager.title} at CTP Red Corp.
                </DialogDescription>
              </DialogHeader>

              <div className="flex items-start gap-6 mb-6">
                {/* Large Headshot */}
                <div 
                  className="w-40 h-40 rounded-full p-1 flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #dc2626, #ef4444)'
                  }}
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                    <ImageWithFallback
                      src={selectedManager.image}
                      alt={`${selectedManager.name} - ${selectedManager.title}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Name and Title */}
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedManager.name}
                  </h2>
                  <p className="text-xl text-gray-600 mb-3">
                    {selectedManager.title}
                  </p>
                  <p className="text-lg italic text-red-600 mb-4">
                    "{selectedManager.quote}"
                  </p>
                  <div className="inline-block bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedManager.department}
                  </div>
                </div>
              </div>

              {/* Biography */}
              <div className="max-w-2xl">
                <h3 className="font-semibold text-gray-900 mb-3">Biography</h3>
                <p className="text-gray-600 leading-relaxed">
                  {selectedManager.biography}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}