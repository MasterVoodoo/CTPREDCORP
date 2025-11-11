import { ImageWithFallback } from './figma/ImageWithFallback';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  image: string;
}

const managementTeam: TeamMember[] = [
  {
    id: "1",
    name: "Sarah Rodriguez",
    position: "Chief Executive Officer",
    image: "https://images.unsplash.com/photo-1758599543125-0a927f1d7a3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBleGVjdXRpdmUlMjB3b21hbiUyMGJ1c2luZXNzfGVufDF8fHx8MTc1OTAzNDUyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: "2",
    name: "David Thompson",
    position: "Chief Financial Officer",
    image: "https://images.unsplash.com/photo-1758518727888-ffa196002e59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMGV4ZWN1dGl2ZSUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTAyNDI4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: "3",
    name: "Elena Martinez",
    position: "Chief Operations Officer",
    image: "https://images.unsplash.com/photo-1650784854945-264d5b0b6b07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBkaXJlY3RvciUyMGxlYWRlcnNoaXAlMjB0ZWFtfGVufDF8fHx8MTc1OTAzNDUzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: "4",
    name: "Marcus Chen",
    position: "VP of Development",
    image: "https://images.unsplash.com/photo-1758691737644-ef8be18256c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1hbmFnZXIlMjBwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NTkwMzQ1MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: "5",
    name: "Jennifer Park",
    position: "Director of Technology",
    image: "https://images.unsplash.com/photo-1758518729314-b02874db8c37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBleGVjdXRpdmUlMjBvZmZpY2UlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTkwMzQ1Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: "6",
    name: "Alex Kumar",
    position: "Chief Technology Officer",
    image: "https://images.unsplash.com/photo-1752118464988-2914fb27d0f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGV4ZWN1dGl2ZSUyMHRlY2hub2xvZ3klMjBsZWFkZXJ8ZW58MXx8fHwxNzU5MDM0NTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  }
];

export default function ModernManagementTeam() {
  return (
    <section className="bg-black py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">
            Our Management Team
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Meet the visionary leaders driving innovation and excellence across our organization
          </p>
        </div>

        {/* Team Grid - 2 rows × 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {managementTeam.map((member) => (
            <div
              key={member.id}
              className="group relative bg-gray-900 rounded-2xl p-8 transition-all duration-300 hover:bg-gray-800 hover:shadow-2xl hover:shadow-red-900/20"
              style={{
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
              }}
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-600/10 to-red-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Profile Image */}
              <div className="relative mb-6 flex justify-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-gray-700 group-hover:ring-red-600 transition-all duration-300">
                    <ImageWithFallback
                      src={member.image}
                      alt={`${member.name} - ${member.position}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Red accent dot */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-600 rounded-full border-4 border-gray-900 group-hover:bg-red-500 transition-colors duration-300" />
                </div>
              </div>

              {/* Member Info */}
              <div className="text-center relative z-10">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-50 transition-colors duration-300">
                  {member.name}
                </h3>
                <p className="text-gray-400 font-medium group-hover:text-gray-300 transition-colors duration-300">
                  {member.position}
                </p>
                
                {/* Red accent line */}
                <div className="w-16 h-0.5 bg-red-600 mx-auto mt-4 group-hover:w-20 transition-all duration-300" />
              </div>

              {/* Subtle border on hover */}
              <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-red-600/30 transition-colors duration-300" />
            </div>
          ))}
        </div>

        {/* Separator Line with Gradient */}
        <div className="mt-24 mb-8">
          <div 
            className="h-0.5 w-full mx-auto"
            style={{
              background: 'linear-gradient(90deg, #dc2626 0%, #6b7280 50%, #dc2626 100%)'
            }}
          />
        </div>
      </div>
    </section>
  );
}