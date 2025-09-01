import axios from 'axios';
import type { Job, SubmitJobRequest, SubmitJobResponse, CancelJobRequest, ClearQueueResponse } from '../types/api';
import { config } from '../config';

const api = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service functions
export const jobApi = {
  // Get all jobs in the queue
  getJobs: async (): Promise<Job[]> => {
    const response = await api.get('/api/ath/queue');
    return response.data;
  },

  // Get a specific job by UID
  getJob: async (uid: string): Promise<Job> => {
    const response = await api.get(`/api/ath/job/${uid}`);
    return response.data;
  },

  // Submit a new job
  submitJob: async (jobData: SubmitJobRequest): Promise<SubmitJobResponse> => {
    const response = await api.post('/api/ath/submit', jobData);
    return response.data;
  },

  // Cancel a job
  cancelJob: async (uid: string): Promise<Job> => {
    const response = await api.post('/api/ath/cancel', { uid } as CancelJobRequest);
    return response.data;
  },

  // Clear completed jobs from queue
  clearQueue: async (removePending: boolean = false): Promise<ClearQueueResponse> => {
    const response = await api.delete(`/api/ath/queue/clear?removePending=${removePending}`);
    return response.data;
  },
};

export default api;
