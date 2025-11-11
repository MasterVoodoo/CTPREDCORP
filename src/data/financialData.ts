// Financial Data Service for CTP RED CORP
// This centralizes all financial data and provides auto-updating metrics

export interface FinancialMetric {
  title: string;
  value: string;
  rawValue: number;
  change: string;
  changePercent: number;
  period: string;
  icon: string;
  isPositive: boolean;
}

export interface QuarterlyData {
  quarter: string;
  revenue: number;
  profit: number;
  occupancy: number;
  expenses: number;
}

export interface FinancialReport {
  id: string;
  title: string;
  type: 'Annual Report' | 'Quarterly Report' | 'ESG Report' | 'Financial Statement';
  period: string;
  releaseDate: string;
  description: string;
  size: string;
  downloadUrl: string;
  previewUrl?: string;
  tags: string[];
  featured: boolean;
}

// Simulated real-time financial data
const currentFinancialData = {
  totalRevenue: 52.7,
  profitMargin: 28.3,
  growthRate: 15.8,
  occupancyRate: 96.4,
  netOperatingIncome: 37.2,
  totalAssets: 185.6,
  lastUpdated: new Date('2024-12-20T10:30:00Z')
};

// Historical quarterly data for charts
export const quarterlyRevenueData: QuarterlyData[] = [
  { quarter: 'Q1 2023', revenue: 11.2, profit: 3.1, occupancy: 92.5, expenses: 8.1 },
  { quarter: 'Q2 2023', revenue: 12.1, profit: 3.4, occupancy: 94.2, expenses: 8.7 },
  { quarter: 'Q3 2023', revenue: 11.8, profit: 3.2, occupancy: 93.8, expenses: 8.6 },
  { quarter: 'Q4 2023', revenue: 12.2, profit: 3.5, occupancy: 95.1, expenses: 8.7 },
  { quarter: 'Q1 2024', revenue: 12.8, profit: 3.7, occupancy: 94.8, expenses: 9.1 },
  { quarter: 'Q2 2024', revenue: 13.4, profit: 3.9, occupancy: 95.6, expenses: 9.5 },
  { quarter: 'Q3 2024', revenue: 13.1, profit: 3.8, occupancy: 96.2, expenses: 9.3 },
  { quarter: 'Q4 2024', revenue: 13.4, profit: 4.0, occupancy: 96.4, expenses: 9.4 }
];

// Calculate key financial metrics with real-time updates
export const getKeyMetrics = (): FinancialMetric[] => {
  const currentYear = new Date().getFullYear();
  const previousYearRevenue = 47.3;
  const previousYearProfitMargin = 26.2;
  const previousYearGrowth = 12.6;

  return [
    {
      title: "Revenue",
      value: `$${currentFinancialData.totalRevenue.toFixed(1)}M`,
      rawValue: currentFinancialData.totalRevenue,
      change: `+${((currentFinancialData.totalRevenue - previousYearRevenue) / previousYearRevenue * 100).toFixed(1)}%`,
      changePercent: (currentFinancialData.totalRevenue - previousYearRevenue) / previousYearRevenue * 100,
      period: `${currentYear} YTD`,
      icon: "DollarSign",
      isPositive: true
    },
    {
      title: "Profit Margin",
      value: `${currentFinancialData.profitMargin.toFixed(1)}%`,
      rawValue: currentFinancialData.profitMargin,
      change: `+${(currentFinancialData.profitMargin - previousYearProfitMargin).toFixed(1)}%`,
      changePercent: currentFinancialData.profitMargin - previousYearProfitMargin,
      period: `Q4 ${currentYear}`,
      icon: "TrendingUp",
      isPositive: true
    },
    {
      title: "Growth",
      value: `${currentFinancialData.growthRate.toFixed(1)}%`,
      rawValue: currentFinancialData.growthRate,
      change: `+${(currentFinancialData.growthRate - previousYearGrowth).toFixed(1)}%`,
      changePercent: currentFinancialData.growthRate - previousYearGrowth,
      period: "Year-over-Year",
      icon: "Target",
      isPositive: true
    }
  ];
};

// Financial reports database
export const financialReports: FinancialReport[] = [
  {
    id: "1",
    title: "Annual Report 2024",
    type: "Annual Report",
    period: "Year End 2024",
    releaseDate: "March 15, 2025",
    description: "Comprehensive annual report including audited financial statements, management discussion, and strategic outlook for CTP Red Corp.",
    size: "14.2 MB",
    downloadUrl: "/reports/annual-report-2024.pdf",
    previewUrl: "/reports/previews/annual-report-2024-preview.pdf",
    tags: ["annual", "financial statements", "strategy", "2024"],
    featured: true
  },
  {
    id: "2",
    title: "Q3 2024 Financial Results",
    type: "Quarterly Report",
    period: "Q3 2024",
    releaseDate: "November 30, 2024",
    description: "Third quarter 2024 financial performance, including revenue, occupancy rates, and key operational metrics.",
    size: "4.8 MB",
    downloadUrl: "/reports/q3-2024-results.pdf",
    previewUrl: "/reports/previews/q3-2024-preview.pdf",
    tags: ["quarterly", "Q3", "2024", "operational metrics"],
    featured: true
  },
  {
    id: "3",
    title: "Q2 2024 Financial Results",
    type: "Quarterly Report",
    period: "Q2 2024",
    releaseDate: "August 31, 2024",
    description: "Second quarter 2024 financial performance with detailed analysis of property portfolio performance and market conditions.",
    size: "4.5 MB",
    downloadUrl: "/reports/q2-2024-results.pdf",
    tags: ["quarterly", "Q2", "2024", "portfolio analysis"],
    featured: false
  },
  {
    id: "4",
    title: "2024 ESG Report",
    type: "ESG Report",
    period: "Year 2024",
    releaseDate: "April 22, 2025",
    description: "Environmental, social, and governance achievements, including sustainability initiatives and corporate responsibility metrics.",
    size: "9.3 MB",
    downloadUrl: "/reports/esg-report-2024.pdf",
    tags: ["ESG", "sustainability", "2024", "governance"],
    featured: true
  },
  {
    id: "5",
    title: "Q1 2024 Financial Results",
    type: "Quarterly Report",
    period: "Q1 2024",
    releaseDate: "May 31, 2024",
    description: "First quarter 2024 financial results with focus on leasing activity and property development updates.",
    size: "4.1 MB",
    downloadUrl: "/reports/q1-2024-results.pdf",
    tags: ["quarterly", "Q1", "2024", "leasing"],
    featured: false
  },
  {
    id: "6",
    title: "Annual Report 2023",
    type: "Annual Report",
    period: "Year End 2023",
    releaseDate: "March 20, 2024",
    description: "Previous year's comprehensive annual report providing historical performance data and strategic insights.",
    size: "12.9 MB",
    downloadUrl: "/reports/annual-report-2023.pdf",
    tags: ["annual", "2023", "historical data"],
    featured: false
  },
  {
    id: "7",
    title: "Financial Statements Q4 2024",
    type: "Financial Statement",
    period: "Q4 2024",
    releaseDate: "January 31, 2025",
    description: "Detailed financial statements including balance sheet, income statement, and cash flow analysis for Q4 2024.",
    size: "2.8 MB",
    downloadUrl: "/reports/financial-statements-q4-2024.xlsx",
    tags: ["financial statements", "Q4", "2024", "balance sheet"],
    featured: false
  },
  {
    id: "8",
    title: "Investor Presentation Q3 2024",
    type: "Quarterly Report",
    period: "Q3 2024",
    releaseDate: "December 5, 2024",
    description: "Executive presentation covering Q3 2024 performance highlights, market outlook, and strategic initiatives.",
    size: "8.1 MB",
    downloadUrl: "/reports/investor-presentation-q3-2024.pdf",
    tags: ["presentation", "investor", "Q3", "2024"],
    featured: false
  }
];

// Utility functions
export const getReportsByType = (type: FinancialReport['type']) => {
  return financialReports.filter(report => report.type === type);
};

export const getFeaturedReports = () => {
  return financialReports.filter(report => report.featured);
};

export const searchReports = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return financialReports.filter(report => 
    report.title.toLowerCase().includes(lowercaseQuery) ||
    report.description.toLowerCase().includes(lowercaseQuery) ||
    report.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    report.type.toLowerCase().includes(lowercaseQuery) ||
    report.period.toLowerCase().includes(lowercaseQuery)
  );
};

export const getReportTypeCounts = () => {
  const counts = financialReports.reduce((acc, report) => {
    acc[report.type] = (acc[report.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(counts).map(([type, count]) => ({ type, count }));
};

// Simulated file download function
export const downloadReport = async (report: FinancialReport): Promise<void> => {
  try {
    // In a real application, this would make an API call to get the actual file
    // For now, we'll simulate the download with a blob
    
    const content = `CTP RED CORP - ${report.title}\n\nThis is a simulated download of ${report.title}.\n\nReport Details:\n- Period: ${report.period}\n- Release Date: ${report.releaseDate}\n- Description: ${report.description}\n\nThis would contain the actual financial report content in a real application.`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.title.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
    throw new Error('Download failed. Please try again.');
  }
};

// Get the last update time for data freshness indicator
export const getLastUpdated = (): Date => {
  return currentFinancialData.lastUpdated;
};

// Performance indicators for dashboard
export const getPerformanceIndicators = () => {
  return {
    occupancyRate: {
      current: currentFinancialData.occupancyRate,
      target: 95.0,
      status: currentFinancialData.occupancyRate >= 95.0 ? 'excellent' : 'good'
    },
    noi: {
      current: currentFinancialData.netOperatingIncome,
      previous: 32.8,
      growth: ((currentFinancialData.netOperatingIncome - 32.8) / 32.8 * 100)
    },
    totalAssets: currentFinancialData.totalAssets
  };
};