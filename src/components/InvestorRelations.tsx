interface InvestorUpdate {
  id: string;
  title: string;
  date: string;
  type: "Earnings" | "Announcement" | "Presentation" | "Press Release";
  summary: string;
}

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: string;
  location: string;
}

interface InvestorRelationsProps {
  onBack?: () => void;
  onNavigateToFinancialReports?: () => void;
}

const recentUpdates: InvestorUpdate[] = [
  {
    id: "1",
    title: "Q4 2023 Earnings Call Results",
    date: "March 15, 2024",
    type: "Earnings",
    summary: "CTP Red Corp reported strong Q4 2023 results with 12.5% NOI growth and 95.2% occupancy rate across portfolio."
  },
  {
    id: "2",
    title: "New Tenant Partnership Announcement",
    date: "February 28, 2024",
    type: "Announcement",
    summary: "Strategic partnership with leading technology companies for long-term lease agreements in CTP Alpha Tower."
  },
  {
    id: "3",
    title: "Sustainability Initiative Launch",
    date: "February 15, 2024",
    type: "Press Release",
    summary: "CTP Red Corp announces comprehensive sustainability program targeting carbon neutrality by 2030."
  },
  {
    id: "4",
    title: "Investor Day 2024 Presentation",
    date: "January 25, 2024",
    type: "Presentation",
    summary: "Annual investor presentation covering strategic outlook, development pipeline, and market opportunities."
  }
];

const upcomingEvents: UpcomingEvent[] = [
  {
    id: "1",
    title: "Q1 2024 Earnings Call",
    date: "April 30, 2024",
    time: "2:00 PM EST",
    type: "Earnings Call",
    location: "Webcast"
  },
  {
    id: "2",
    title: "Real Estate Investment Summit",
    date: "May 15, 2024",
    time: "9:00 AM EST",
    type: "Industry Conference",
    location: "New York, NY"
  },
  {
    id: "3",
    title: "Annual Shareholder Meeting",
    date: "June 12, 2024",
    time: "10:00 AM EST",
    type: "Annual Meeting",
    location: "CTP Red Corp Headquarters"
  }
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "Earnings":
      return "bg-green-100 text-green-800";
    case "Announcement":
      return "bg-blue-100 text-blue-800";
    case "Presentation":
      return "bg-purple-100 text-purple-800";
    case "Press Release":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function InvestorRelations({ onBack, onNavigateToFinancialReports }: InvestorRelationsProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Back button and navigation */}
        <div className="flex items-center justify-between mb-8">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>
          )}
          
          {onNavigateToFinancialReports && (
            <button
              onClick={onNavigateToFinancialReports}
              className="flex items-center px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Financial Reports
            </button>
          )}
        </div>

        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Investor Relations
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Stay informed with the latest investor updates, financial results, and corporate announcements. 
            We are committed to transparent communication with our shareholders and the investment community.
          </p>
        </div>

        {/* Key Investment Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-primary/5 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">$47.3M</div>
            <div className="text-sm font-medium text-gray-900">Annual Revenue</div>
            <div className="text-xs text-gray-600 mt-1">↑ 8.2% YoY</div>
          </div>
          
          <div className="bg-primary/5 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">95.2%</div>
            <div className="text-sm font-medium text-gray-900">Occupancy Rate</div>
            <div className="text-xs text-gray-600 mt-1">Industry Leading</div>
          </div>
          
          <div className="bg-primary/5 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">$2.85</div>
            <div className="text-sm font-medium text-gray-900">FFO per Share</div>
            <div className="text-xs text-gray-600 mt-1">↑ 12.5% YoY</div>
          </div>
          
          <div className="bg-primary/5 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">7.2%</div>
            <div className="text-sm font-medium text-gray-900">Dividend Yield</div>
            <div className="text-xs text-gray-600 mt-1">Quarterly Distribution</div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Recent Updates */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Updates</h2>
            <div className="space-y-4">
              {recentUpdates.map((update) => (
                <div 
                  key={update.id}
                  className="bg-white rounded-lg shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(update.type)}`}>
                      {update.type}
                    </span>
                    <span className="text-sm text-gray-500">{update.date}</span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-3">{update.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{update.summary}</p>
                  
                  <button className="text-primary hover:text-accent font-medium text-sm flex items-center transition-colors">
                    Read More
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upcoming Events</h2>
            <div className="space-y-4 mb-8">
              {upcomingEvents.map((event) => (
                <div 
                  key={event.id}
                  className="bg-white rounded-lg shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium">
                      {event.type}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-3">{event.title}</h3>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {event.date} at {event.time}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition-colors font-medium text-sm">
                      Add to Calendar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Investor Relations Contact</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-medium">Sarah Rodriguez</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>investors@ctpredcorp.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Reports Cross-link */}
        {onNavigateToFinancialReports && (
          <div className="bg-gradient-to-r from-red-50 to-gray-50 rounded-lg p-8 border border-red-100 mb-12">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Detailed Financial Reports
                </h3>
                <p className="text-gray-600 mb-4">
                  Access comprehensive financial statements, quarterly reports, and interactive data visualizations 
                  with advanced search and filtering capabilities.
                </p>
                <button
                  onClick={onNavigateToFinancialReports}
                  className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  View Financial Reports
                </button>
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Investor Resources
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-3">Financial Reports</h3>
              <p className="text-gray-600 text-sm mb-4">
                Access quarterly and annual financial reports, SEC filings, and earnings presentations.
              </p>
              <button 
                onClick={onNavigateToFinancialReports}
                className="text-primary hover:text-accent font-medium text-sm"
              >
                View Reports →
              </button>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-3">Stock Information</h3>
              <p className="text-gray-600 text-sm mb-4">
                Real-time stock quotes, historical data, and dividend information for CTP Red Corp shares.
              </p>
              <button className="text-primary hover:text-accent font-medium text-sm">
                Stock Data →
              </button>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-3">Corporate Governance</h3>
              <p className="text-gray-600 text-sm mb-4">
                Board information, governance policies, and compliance documentation for investors.
              </p>
              <button className="text-primary hover:text-accent font-medium text-sm">
                Governance →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}