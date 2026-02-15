import { useState, useEffect } from 'react';
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, LineChart, Line, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { DollarSign, TrendingUp, Target, Download, Eye, Calendar, Clock, FileText, Search, Filter, RefreshCw, ExternalLink, AlertCircle, BarChart3, PieChart as PieChartIcon, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { 
  getKeyMetrics, 
  quarterlyRevenueData, 
  financialReports, 
  searchReports, 
  getReportTypeCounts,
  downloadReport,
  getLastUpdated,
  type FinancialReport 
} from '../../data/financialData';
import { toast } from "sonner";

interface FinancialReportsProps {
  onBack?: () => void;
  onNavigateToInvestorRelations?: () => void;
}

export default function FinancialReports({ onBack, onNavigateToInvestorRelations }: FinancialReportsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReportType, setSelectedReportType] = useState<string>('All');
  const [filteredReports, setFilteredReports] = useState<FinancialReport[]>(financialReports);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(getLastUpdated());
  
  // Get dynamic metrics from the data service
  const keyMetrics = getKeyMetrics();
  const reportTypeCounts = getReportTypeCounts();

  // Additional chart data for enhanced visualizations
  const trendData = quarterlyRevenueData.map(item => ({
    quarter: item.quarter,
    revenue: item.revenue,
    profit: item.profit,
    expenses: item.expenses
  }));

  const portfolioData = [
    { name: 'CTP Red Corp', value: 35, color: '#dc2626' },
    { name: 'CTP Alpha Tower', value: 42, color: '#1a1a1a' },
    { name: 'CTP BF Building', value: 23, color: '#6b7280' }
  ];

  const COLORS = ['#dc2626', '#1a1a1a', '#6b7280'];

  // Financial highlights data
  const financialHighlights = [
    {
      title: 'Strong Portfolio Performance',
      value: '96.4%',
      description: 'Average occupancy rate across all properties',
      trend: 'up',
      change: '+2.1%'
    },
    {
      title: 'Revenue Growth',
      value: '15.8%',
      description: 'Year-over-year revenue growth',
      trend: 'up',
      change: '+3.2%'
    },
    {
      title: 'Operating Efficiency',
      value: '$37.2M',
      description: 'Net Operating Income (NOI)',
      trend: 'up',
      change: '+8.7%'
    }
  ];

  // Filter reports based on search and type filter
  useEffect(() => {
    let filtered = financialReports;
    
    // Apply search filter
    if (searchQuery.trim()) {
      filtered = searchReports(searchQuery);
    }
    
    // Apply type filter
    if (selectedReportType !== 'All') {
      filtered = filtered.filter(report => report.type === selectedReportType);
    }
    
    setFilteredReports(filtered);
  }, [searchQuery, selectedReportType]);

  // Handle report download
  const handleDownload = async (report: FinancialReport) => {
    setIsLoading(true);
    try {
      await downloadReport(report);
      toast.success(`${report.title} downloaded successfully`);
    } catch (error) {
      toast.error('Download failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle data refresh
  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsLoading(false);
      toast.success('Financial data updated');
    }, 1000);
  };

  // Get unique report types for filter
  const reportTypes = ['All', ...Array.from(new Set(financialReports.map(report => report.type)))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
          
          {onNavigateToInvestorRelations && (
            <button
              onClick={onNavigateToInvestorRelations}
              className="flex items-center px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Investor Relations
            </button>
          )}
        </div>

        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="bg-gradient-to-r from-black to-gray-900 rounded-2xl p-12 mb-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent"></div>
            <div className="relative z-10">
              <h1 className="text-5xl font-bold text-white mb-6">
                Financial Reports
              </h1>
              <div className="w-24 h-1 bg-red-600 mx-auto mb-6"></div>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
                Access our comprehensive financial reports, including annual reports, quarterly results, 
                and ESG performance data. We are committed to transparency and providing stakeholders 
                with timely, accurate financial information.
              </p>
              
              {/* Data freshness indicator */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>Last updated: {lastUpdated.toLocaleString()}</span>
                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="ml-2 p-1 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Highlights Panel */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 mb-12 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Financial Highlights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {financialHighlights.map((highlight, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-medium">{highlight.title}</h3>
                  <div className={`flex items-center gap-1 text-sm ${highlight.trend === 'up' ? 'text-green-300' : 'text-red-300'}`}>
                    {highlight.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {highlight.change}
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{highlight.value}</div>
                <p className="text-white/80 text-sm">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {keyMetrics.map((metric, index) => {
            const IconComponent = metric.icon === 'DollarSign' ? DollarSign : 
                                 metric.icon === 'TrendingUp' ? TrendingUp : Target;
            return (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent rounded-xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100"></div>
                <div className="relative bg-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-50 to-red-100 rounded-xl flex items-center justify-center group-hover:from-red-100 group-hover:to-red-200 transition-colors">
                      <IconComponent className="w-6 h-6 text-red-600" />
                    </div>
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                      metric.isPositive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {metric.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {metric.change}
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.title}</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {metric.period}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Data Visualization Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Quarterly Revenue Chart */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Revenue Trends</h2>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <AlertCircle className="w-4 h-4" />
                <span>Live data</span>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="quarter" 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    label={{ value: 'Amount ($M)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6b7280' } }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Line 
                    type="monotone"
                    dataKey="revenue" 
                    stroke="#dc2626" 
                    strokeWidth={3}
                    dot={{ fill: '#dc2626', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, fill: '#dc2626' }}
                  />
                  <Line 
                    type="monotone"
                    dataKey="profit" 
                    stroke="#1a1a1a" 
                    strokeWidth={2}
                    dot={{ fill: '#1a1a1a', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Portfolio Distribution Pie Chart */}
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center">
                <PieChartIcon className="w-5 h-5 text-red-400" />
              </div>
              <h2 className="text-xl font-semibold">Portfolio Distribution</h2>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {portfolioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#374151', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ color: '#fff' }}
                    formatter={(value) => `${value}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 gap-3 mt-6">
              {portfolioData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-300">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Download Actions */}
        <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-8 border border-gray-200 shadow-lg mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Quick Downloads</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <button 
              onClick={() => {
                const annualReport = financialReports.find(r => r.type === 'Annual Report' && r.featured);
                if (annualReport) handleDownload(annualReport);
              }}
              className="flex items-center justify-center gap-3 p-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
            >
              <FileText className="w-5 h-5" />
              <span className="font-medium">Latest Annual Report</span>
            </button>
            <button 
              onClick={() => {
                const quarterlyReport = financialReports.find(r => r.type === 'Quarterly Report' && r.featured);
                if (quarterlyReport) handleDownload(quarterlyReport);
              }}
              className="flex items-center justify-center gap-3 p-4 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors shadow-md hover:shadow-lg"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Q3 2024 Results</span>
            </button>
            <button 
              onClick={() => {
                const esgReport = financialReports.find(r => r.type === 'ESG Report');
                if (esgReport) handleDownload(esgReport);
              }}
              className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-colors shadow-md hover:shadow-lg"
            >
              <Activity className="w-5 h-5" />
              <span className="font-medium">ESG Report</span>
            </button>
            <button 
              onClick={() => {
                const statements = financialReports.find(r => r.type === 'Financial Statement');
                if (statements) handleDownload(statements);
              }}
              className="flex items-center justify-center gap-3 p-4 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors shadow-md hover:shadow-lg"
            >
              <Target className="w-5 h-5" />
              <span className="font-medium">Financial Statements</span>
            </button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports by title, period, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none bg-gray-50 hover:bg-white transition-colors"
              />
            </div>
            
            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none bg-gray-50 hover:bg-white transition-colors"
              >
                {reportTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            {/* Results count */}
            <div className="flex items-center text-sm text-gray-500 whitespace-nowrap bg-gray-100 px-4 py-3 rounded-xl">
              {filteredReports.length} of {financialReports.length} reports
            </div>
          </div>
        </div>

        {/* Download Reports Section */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">Download Reports</h2>
            {searchQuery && (
              <div className="text-sm text-gray-500">
                Showing results for "{searchQuery}"
              </div>
            )}
          </div>
          
          {filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
              <p className="text-gray-500">
                {searchQuery ? `No reports match "${searchQuery}". Try adjusting your search.` : 'No reports available for the selected filters.'}
              </p>
              {(searchQuery || selectedReportType !== 'All') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedReportType('All');
                  }}
                  className="mt-4 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Table Layout for Reports */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Report Title</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Period</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Release Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Size</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((report) => (
                      <tr key={report.id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-red-50/50 hover:to-transparent transition-all duration-200 group">
                        <td className="py-6 px-4">
                          <div className="flex items-center">
                            <div className="relative mr-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-red-50 to-red-100 rounded-xl flex items-center justify-center group-hover:from-red-100 group-hover:to-red-200 transition-colors">
                                <FileText className="w-6 h-6 text-red-600" />
                              </div>
                              {report.featured && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border-2 border-white"></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">{report.title}</div>
                                {report.featured && (
                                  <span className="text-xs bg-gradient-to-r from-red-100 to-red-200 text-red-700 px-2 py-1 rounded-full font-medium">Featured</span>
                                )}
                              </div>
                              <div className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{report.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-6 px-4">
                          <span className="inline-block bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-full font-medium border border-gray-200">
                            {report.type}
                          </span>
                        </td>
                        <td className="py-6 px-4">
                          <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                            <Calendar className="w-4 h-4 mr-2 text-red-600" />
                            {report.period}
                          </div>
                        </td>
                        <td className="py-6 px-4">
                          <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                            <Clock className="w-4 h-4 mr-2 text-red-600" />
                            {report.releaseDate}
                          </div>
                        </td>
                        <td className="py-6 px-4">
                          <div className="text-sm text-gray-600 font-medium bg-gray-50 rounded-lg px-3 py-2 text-center">
                            {report.size}
                          </div>
                        </td>
                        <td className="py-6 px-4">
                          <div className="flex justify-center gap-2">
                            <button 
                              onClick={() => handleDownload(report)}
                              disabled={isLoading}
                              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-105"
                            >
                              {isLoading ? (
                                <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                              ) : (
                                <Download className="w-4 h-4 mr-1" />
                              )}
                              Download
                            </button>
                            {report.previewUrl && (
                              <button 
                                onClick={() => window.open(report.previewUrl, '_blank')}
                                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm flex items-center shadow-sm hover:shadow-md"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Preview
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Featured Reports Card Layout */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-gray-900 to-black rounded-2xl p-8 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-2xl font-semibold text-white">Featured Reports</h2>
              </div>
              <div className="text-sm text-gray-400">
                Highlighted reports for stakeholders
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {financialReports.filter(report => report.featured).map((report) => (
              <div 
                key={report.id}
                className="group relative bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 p-6 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4">
                  <div className="w-3 h-3 bg-red-600 rounded-full border-2 border-white shadow-md"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-red-50 to-red-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-red-100 group-hover:to-red-200 transition-colors">
                      <FileText className="w-7 h-7 text-red-600" />
                    </div>
                    <span className="inline-block bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-full font-medium border border-gray-200">
                      {report.type}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-3 text-lg group-hover:text-red-600 transition-colors">{report.title}</h3>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed">{report.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                      <Calendar className="w-3 h-3 mr-2 text-red-600" />
                      {report.period}
                    </div>
                    <div className="flex items-center text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                      <Clock className="w-3 h-3 mr-2 text-red-600" />
                      Released: {report.releaseDate}
                    </div>
                    <div className="flex items-center text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                      <FileText className="w-3 h-3 mr-2 text-red-600" />
                      Size: {report.size}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleDownload(report)}
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 text-sm flex items-center justify-center disabled:opacity-50 shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4 mr-2" />
                      )}
                      Download
                    </button>
                    {report.previewUrl && (
                      <button 
                        onClick={() => window.open(report.previewUrl, '_blank')}
                        className="border border-gray-300 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm flex items-center justify-center shadow-sm hover:shadow-md"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Type Analytics */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 border border-gray-200 shadow-lg mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Report Analytics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reportTypeCounts.map((item, index) => (
              <div key={index} className="group text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105">
                <div className="w-14 h-14 bg-gradient-to-br from-red-50 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-red-100 group-hover:to-red-200 transition-colors">
                  <FileText className="w-7 h-7 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">{item.type}</h3>
                <p className="text-3xl font-bold text-red-600 mb-1">{item.count}</p>
                <p className="text-sm text-gray-600">Available Reports</p>
              </div>
            ))}
          </div>
        </div>

        {/* Investor Relations Cross-link */}
        {onNavigateToInvestorRelations && (
          <div className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-red-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Complete Investor Information
                </h3>
                <p className="text-gray-300 mb-6 max-w-lg leading-relaxed">
                  Access comprehensive investor relations materials, corporate governance information, 
                  and stakeholder communications in our dedicated investor portal.
                </p>
                <button
                  onClick={onNavigateToInvestorRelations}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <ExternalLink className="w-5 h-5 mr-3" />
                  Visit Investor Relations
                </button>
              </div>
              <div className="hidden md:block">
                <div className="w-28 h-28 bg-gradient-to-br from-red-600/20 to-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                  <TrendingUp className="w-14 h-14 text-red-400" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}