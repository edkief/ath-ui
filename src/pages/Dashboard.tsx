import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { jobApi } from '../services/api';
import type { Job } from '../types/api';
import { formatTimestamp, formatDuration, getStatusColor, getStatusIcon } from '../utils/formatters';
import { config } from '../config';

const Dashboard = () => {
  const queryClient = useQueryClient();

  // Fetch jobs with automatic refresh
  const { data: jobs = [], isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: jobApi.getJobs,
    refetchInterval: config.ui.refreshInterval.dashboard,
  });

  // Cancel job mutation
  const cancelJobMutation = useMutation({
    mutationFn: jobApi.cancelJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  // Clear queue mutation
  const clearQueueMutation = useMutation({
    mutationFn: () => jobApi.clearQueue(false), // Only remove completed jobs
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  const handleCancelJob = async (uid: string) => {
    if (window.confirm('Are you sure you want to cancel this job?')) {
      try {
        await cancelJobMutation.mutateAsync(uid);
      } catch (error) {
        console.error('Failed to cancel job:', error);
        alert('Failed to cancel job. Please try again.');
      }
    }
  };

  const handleClearCompleted = () => {
    if (window.confirm('Are you sure you want to clear all completed jobs? This action cannot be undone.')) {
      clearQueueMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-semibold mb-2">Error Loading Jobs</h2>
          <p>Failed to load job queue. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  const completedJobs = jobs.filter(job => job.status === 'COMPLETE');
  const activeJobs = jobs.filter(job => job.status !== 'COMPLETE');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Queue Overview</h1>
          <p className="text-gray-600 mt-2">
            {jobs.length} total jobs • {activeJobs.length} active • {completedJobs.length} completed
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Link to="/submit" className="btn-primary">
            Submit New Job
          </Link>
          
          {completedJobs.length > 0 && (
            <button
              onClick={handleClearCompleted}
              className="btn-secondary"
              disabled={clearQueueMutation.isPending}
            >
              {clearQueueMutation.isPending ? 'Clearing...' : 'Clear Completed'}
            </button>
          )}
        </div>
      </div>

      {/* Active Jobs */}
      {activeJobs.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Jobs</h2>
          <div className="space-y-4">
            {activeJobs.map((job) => (
              <JobCard
                key={job.uid}
                job={job}
                onCancel={handleCancelJob}
                isCancelling={cancelJobMutation.isPending && cancelJobMutation.variables === job.uid}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Jobs */}
      {completedJobs.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Completed Jobs</h2>
          <div className="space-y-4">
            {completedJobs.map((job) => (
              <JobCard
                key={job.uid}
                job={job}
                onCancel={handleCancelJob}
                isCancelling={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {jobs.length === 0 && (
        <div className="card text-center">
          <div className="text-gray-500">
            <h3 className="text-lg font-medium mb-2">No jobs found</h3>
            <p className="mb-4">Get started by submitting your first job.</p>
            <Link to="/submit" className="btn-primary">
              Submit New Job
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

// Job Card Component
interface JobCardProps {
  job: Job;
  onCancel: (uid: string) => void;
  isCancelling: boolean;
}

const JobCard = ({ job, onCancel, isCancelling }: JobCardProps) => {
  const canCancel = job.status !== 'COMPLETE' && job.status !== 'FAILED';

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-lg">{getStatusIcon(job.status)}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
              {job.status}
            </span>
            {job.progress !== undefined && job.status === 'PROCESSING' && (
              <span className="text-sm text-gray-600">
                {job.progress}% complete
              </span>
            )}
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            <Link to={`/job/${job.uid}`} className="hover:text-blue-600 transition-colors">
              {job.reference}
            </Link>
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Service:</span> {job.service}
            </div>
            <div>
              <span className="font-medium">File:</span> {job.file.split('/').pop()}
            </div>
            <div>
              <span className="font-medium">Records:</span> {job.recordsProcessed}/{job.recordsTotal}
            </div>
            <div>
              <span className="font-medium">Submitted:</span> {formatTimestamp(job.timings.submitted)}
            </div>
          </div>

          {/* Progress Bar for Processing Jobs */}
          {job.status === 'PROCESSING' && job.progress !== undefined && (
            <div className="mt-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{job.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${job.progress}%` }}
                ></div>
              </div>
              {job.etaString && (
                <p className="text-xs text-gray-500 mt-1">
                  ETA: {job.etaString}
                </p>
              )}
            </div>
          )}

          {/* Timing Information */}
          {job.timings.totalElapsed && (
            <div className="mt-2 text-sm text-gray-600">
              <span className="font-medium">Total Time:</span> {formatDuration(job.timings.totalElapsed)}
            </div>
          )}
        </div>
        
        <div className="flex flex-col space-y-2 ml-4">
          <Link
            to={`/job/${job.uid}`}
            className="btn-secondary text-sm"
          >
            View Details
          </Link>
          
          {canCancel && (
            <button
              onClick={() => onCancel(job.uid)}
              disabled={isCancelling}
              className="btn-danger text-sm"
            >
              {isCancelling ? 'Cancelling...' : 'Cancel'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
