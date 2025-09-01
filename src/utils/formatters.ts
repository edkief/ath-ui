export const formatTimestamp = (timestamp: number): string => {
  if (!timestamp) return 'N/A';
  return new Date(timestamp).toLocaleString();
};

export const formatDuration = (milliseconds: number): string => {
  if (!milliseconds) return 'N/A';
  
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

export const formatProgress = (progress?: number): string => {
  if (progress === undefined || progress === null) return 'N/A';
  return `${progress}%`;
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'PROCESSING':
      return 'bg-blue-100 text-blue-800';
    case 'COMPLETE':
      return 'bg-green-100 text-green-800';
    case 'REPORTING':
      return 'bg-purple-100 text-purple-800';
    case 'ABORTING':
      return 'bg-red-100 text-red-800';
    case 'FAILED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusIcon = (status: string): string => {
  switch (status) {
    case 'PENDING':
      return '⏳';
    case 'PROCESSING':
      return '🔄';
    case 'COMPLETE':
      return '✅';
    case 'REPORTING':
      return '📊';
    case 'ABORTING':
      return '⏹️';
    case 'FAILED':
      return '❌';
    default:
      return '❓';
  }
};


