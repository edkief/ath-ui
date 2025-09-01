import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { jobApi } from '../services/api';
import type { SubmitJobRequest } from '../types/api';

const SubmitJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SubmitJobRequest>({
    service: '',
    file: '',
    reference: '',
  });

  const submitJobMutation = useMutation({
    mutationFn: jobApi.submitJob,
    onSuccess: (data) => {
      // Show success notification with job UID
      alert(`Job submitted successfully! Job UID: ${data.uid}`);
      // Redirect to dashboard
      navigate('/');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to submit job. Please try again.';
      alert(`Error: ${errorMessage}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.service.trim() || !formData.file.trim() || !formData.reference.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    submitJobMutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Submit New Job</h1>
        <p className="text-gray-600 mt-2">
          Submit a new file for processing by the ATH service.
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Name */}
          <div>
            <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
              Service Name *
            </label>
            <input
              type="text"
              id="service"
              name="service"
              value={formData.service}
              onChange={handleInputChange}
              className="form-input"
              placeholder="e.g., HB-ATH, CAP"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter the name of the service to call. Must match one of the defined services in the config folder.
            </p>
          </div>

          {/* File Path */}
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
              File Path *
            </label>
            <input
              type="text"
              id="file"
              name="file"
              value={formData.file}
              onChange={handleInputChange}
              className="form-input"
              placeholder="/var/data/sandbox/example.csv"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter the absolute path to the input file. The file must already exist in a location accessible to the backend service.
            </p>
          </div>

          {/* Reference */}
          <div>
            <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-2">
              Reference *
            </label>
            <input
              type="text"
              id="reference"
              name="reference"
              value={formData.reference}
              onChange={handleInputChange}
              className="form-input"
              placeholder="My test file"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter a custom, user-friendly reference string for the job. This will be displayed in the queue details.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitJobMutation.isPending}
              className="btn-primary"
            >
              {submitJobMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                'Submit Job'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Help Information */}
      <div className="card mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Important Notes</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <span className="text-red-500 mr-2">•</span>
            The input file must already exist on the server before submitting the job.
          </li>
          <li className="flex items-start">
            <span className="text-red-500 mr-2">•</span>
            Use absolute file paths when possible to avoid path resolution issues.
          </li>
          <li className="flex items-start">
            <span className="text-red-500 mr-2">•</span>
            The service name must exactly match one of the configured services.
          </li>
          <li className="flex items-start">
            <span className="text-red-500 mr-2">•</span>
            After successful submission, you'll be redirected to the dashboard where you can monitor your job's progress.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SubmitJob;
