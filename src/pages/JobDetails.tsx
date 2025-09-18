import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobApi } from '../services/api';
import { formatTimestamp, formatDuration, getStatusColor, getStatusIcon } from '../utils/formatters';
import { config } from '../config';

const JobDetails = () => {
  const { uid } = useParams<{ uid: string }>();
  const queryClient = useQueryClient();

  // Fetch job details
  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', uid],
    queryFn: () => jobApi.getJob(uid!),
    enabled: !!uid,
    refetchInterval: config.ui.refreshInterval.jobDetails,
  });

  // Cancel job mutation
  const cancelJobMutation = useMutation({
    mutationFn: jobApi.cancelJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', uid] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  const handleCancelJob = async () => {
    if (window.confirm('Are you sure you want to cancel this job?')) {
      try {
        await cancelJobMutation.mutateAsync(uid!);
      } catch (error) {
        console.error('Failed to cancel job:', error);
        alert('Failed to cancel job. Please try again.');
      }
    }
  };

  const downloadFile = (filePath: string) => {
    // Extract filename from the full path
    const filename = filePath.split('/').pop() || filePath.split('\\').pop() || '';
    
    // Construct download URL using config
    const downloadUrl = `${config.api.baseUrl}/html/results/${job.service}/${filename}`;
    
    // Create temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="card">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-semibold mb-2">Error Loading Job</h2>
          <p>Failed to load job details. Please check the job UID and try again.</p>
          <Link to="/" className="btn-primary mt-4 inline-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const canCancel = job.status !== 'COMPLETE' && job.status !== 'FAILED';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              ← Back to Dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{job.reference}</h1>
          <p className="text-gray-600 mt-2">Job UID: {job.uid}</p>
        </div>
        
        <div className="flex space-x-3">
          {canCancel && (
            <button
              onClick={handleCancelJob}
              disabled={cancelJobMutation.isPending}
              className="btn-danger"
            >
              {cancelJobMutation.isPending ? 'Cancelling...' : 'Cancel Job'}
            </button>
          )}
        </div>
      </div>

      {/* Job Status Card */}
      <div className="card">
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-3xl">{getStatusIcon(job.status)}</span>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Job Status</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
              {job.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Basic Information</h3>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">Service:</span> {job.service}</div>
              <div><span className="font-medium">File:</span> {job.file}</div>
              <div><span className="font-medium">Reference:</span> {job.reference}</div>
              <div><span className="font-medium">Reporting Enabled:</span> {job.reportingEnabled ? 'Yes' : 'No'}</div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Record Counts</h3>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">Total Records:</span> {job.recordsTotal}</div>
              <div><span className="font-medium">Processed Records:</span> {job.recordsProcessed}</div>
              {job.lastRecordWritten && (
                <div><span className="font-medium">Last Written:</span> {job.lastRecordWritten}</div>
              )}
              {job.lastRecordProcessed && (
                <div><span className="font-medium">Last Processed:</span> {job.lastRecordProcessed}</div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Timing Information</h3>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">Submitted:</span> {formatTimestamp(job.timings.submitted)}</div>
              {job.timings.started && (
                <div><span className="font-medium">Started:</span> {formatTimestamp(job.timings.started)}</div>
              )}
              {job.timings.completed && (
                <div><span className="font-medium">Completed:</span> {formatTimestamp(job.timings.completed)}</div>
              )}
              {job.timings.totalElapsed && (
                <div><span className="font-medium">Total Time:</span> {formatDuration(job.timings.totalElapsed)}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Processing Progress (for PROCESSING jobs) */}
      {job.status === 'PROCESSING' && job.progress !== undefined && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Processing Progress</h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{job.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${job.progress}%` }}
                ></div>
              </div>
            </div>

            {job.etaString && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-900">Estimated Time Remaining:</span>
                  <p className="text-sm text-gray-600">{formatDuration(job.remaining || 0)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Estimated Completion:</span>
                  <p className="text-sm text-gray-600">{job.etaString}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detailed Timing Information */}
      {(job.timings.callsElapsed || job.timings.postProcessElapsed) && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Timing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {job.timings.callsElapsed && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Service Calls</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Calls Elapsed:</span> {formatDuration(job.timings.callsElapsed)}</div>
                  {job.timings.callsCompleted && (
                    <div><span className="font-medium">Calls Completed:</span> {formatTimestamp(job.timings.callsCompleted)}</div>
                  )}
                </div>
              </div>
            )}
            
            {job.timings.postProcessElapsed && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Post-Processing</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Post-Process Time:</span> {formatDuration(job.timings.postProcessElapsed)}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Output Files (for COMPLETE jobs) */}
      {job.status === 'COMPLETE' && job.output && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Results & Output Files</h2>
          <p className="text-gray-600 mb-6">
            Your job has completed successfully. Below are the server paths for all available output files.
          </p>
          
          <div className="space-y-6">
            {/* Full Report - Highlighted and Featured */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl">📊</span>
                <h3 className="text-lg font-semibold text-blue-900">Testing Report</h3>
              </div>
              <div className="flex items-center space-x-2">
                <code className="flex-1 text-sm bg-white border border-blue-200 p-3 rounded break-all shadow-sm">
                  {job.output.fullReport}
                </code>
                <button
                  onClick={() => downloadFile(job.output!.fullReport)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Download
                </button>
              </div>
            </div>

            {/* Other Files */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Raw Results</h3>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 text-sm bg-gray-100 p-2 rounded break-all">
                    {job.output.raw}
                  </code>
                  <button
                    onClick={() => downloadFile(job.output!.raw)}
                    className="btn-secondary text-xs px-2 py-1"
                  >
                    Download
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Delimited Results</h3>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 text-sm bg-gray-100 p-2 rounded break-all">
                    {job.output.results}
                  </code>
                  <button
                    onClick={() => downloadFile(job.output!.results)}
                    className="btn-secondary text-xs px-2 py-1"
                  >
                    Download
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Summary Report</h3>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 text-sm bg-gray-100 p-2 rounded break-all">
                    {job.output.summaryReport}
                  </code>
                  <button
                    onClick={() => downloadFile(job.output!.summaryReport)}
                    className="btn-secondary text-xs px-2 py-1"
                  >
                    Download
                  </button>
                </div>
              </div>

              {job.output.controlReport && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Control Report</h3>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 text-sm bg-gray-100 p-2 rounded break-all">
                      {job.output.controlReport}
                    </code>
                    <button
                      onClick={() => downloadFile(job.output!.controlReport!)}
                      className="btn-secondary text-xs px-2 py-1"
                    >
                      Download
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">📋 Note</h3>
              <p className="text-blue-800 text-sm">
                Click the "Download" button next to each file to download it directly from the server.
                The file paths shown are the server locations for reference.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Back to Dashboard */}
      <div className="text-center">
        <Link to="/" className="btn-secondary">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default JobDetails;
