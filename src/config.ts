// Configuration for the ATH Job Manager application
export const config = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    timeout: 30000, // 30 seconds
  },
  
  // UI Configuration
  ui: {
    refreshInterval: {
      dashboard: 10000, // 10 seconds for dashboard
      jobDetails: 5000,  // 5 seconds for job details
    },
    maxRetries: 3,
  },
  
  // Feature Flags
  features: {
    autoRefresh: true,
    jobCancellation: true,
    queueClearing: true,
  },
};


