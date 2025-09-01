export interface JobTimings {
  submitted: number;
  started: number;
  completed: number;
  callsCompleted?: number;
  callsElapsed?: number;
  postProcessElapsed?: number;
  totalElapsed?: number;
}

export interface JobOutput {
  raw: string;
  results: string;
  summaryReport: string;
  fullReport: string;
  controlReport?: string;
}

export interface Job {
  uid: string;
  file: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETE' | 'REPORTING' | 'ABORTING' | 'FAILED';
  service: string;
  reference: string;
  reportingEnabled: boolean;
  timings: JobTimings;
  recordsTotal: number;
  recordsProcessed: number;
  output?: JobOutput;
  // Processing-specific fields
  progress?: number;
  remaining?: number;
  eta?: string;
  etaString?: string;
  lastRecordWritten?: number;
  lastRecordProcessed?: number;
}

export interface SubmitJobRequest {
  service: string;
  file: string;
  reference: string;
}

export interface SubmitJobResponse {
  uid: string;
  file: string;
  status: string;
  service: string;
  reference: string;
  reportingEnabled: boolean;
  timings: JobTimings;
}

export interface CancelJobRequest {
  uid: string;
}

export interface ClearQueueResponse {
  removed: string[];
  remaining: string[];
}

export interface ApiError {
  message: string;
  status?: number;
}


