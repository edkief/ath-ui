# ATH Job Manager

A modern React-based web UI for managing ATH (Automated Testing Hub) job processing workflows.

## Features

### 🖥️ Dashboard Page
- **Real-time Job Queue Overview**: Displays all current and past processing jobs
- **Automatic Refresh**: Updates every 10 seconds to show real-time status
- **Job Information**: Shows reference, service, status, timestamps, and progress
- **Interactive Actions**: Click jobs to view details, cancel active jobs
- **Queue Management**: Clear completed jobs with confirmation

### 🚀 Submit New Batch Journey
- **Simple Form**: Submit new jobs with service name, file path, and reference
- **Validation**: Ensures all required fields are completed
- **Success Feedback**: Shows job UID and redirects to dashboard
- **Error Handling**: Clear error messages for failed submissions

### 📊 Job Details & Results
- **Comprehensive View**: Detailed job information, timing, and record counts
- **Progress Tracking**: Real-time progress bars and ETA for processing jobs
- **Output Access**: Server paths for all result files (raw, delimited, reports)
- **Copy to Clipboard**: Easy copying of file paths for server access

## Technology Stack

- **React 18** with **TypeScript** for type safety
- **Vite** for fast development and building
- **Tailwind CSS v4** for modern, utility-first styling
- **React Router** for client-side navigation
- **React Query** for efficient data fetching and caching
- **Axios** for HTTP API communication

## Prerequisites

- Node.js 18+ and npm
- Access to ATH API service (see API documentation)

## Installation & Setup

1. **Clone and Install Dependencies**
   ```bash
   cd ath-ui
   npm install
   ```

2. **Configure API Endpoint**
   Create a `.env` file in the root directory:
   ```bash
   VITE_API_BASE_URL=http://your-ath-api-server:port
   ```
   
   **Default**: `http://localhost:3000` (if no .env file is present)

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173`

4. **Build for Production**
   ```bash
   npm run build
   npm run preview
   ```

## API Requirements

This UI requires the following ATH API endpoints to be available:

- `GET /api/ath/queue` - List all jobs
- `GET /api/ath/queue/:uid` - Get specific job details
- `POST /api/ath/submit` - Submit new job
- `POST /api/ath/cancel` - Cancel job
- `DELETE /api/ath/queue/clear` - Clear completed jobs

See `docs/ath-apis.txt` for complete API documentation.

## Usage

### Dashboard
- View all jobs in the queue with real-time updates
- Click on any job to view detailed information
- Cancel active jobs that haven't completed
- Clear completed jobs to keep the queue organized

### Submit Job
- Fill in service name, file path, and reference
- Submit and receive confirmation with job UID
- Automatically redirected to dashboard to monitor progress

### Job Details
- Comprehensive view of job status and progress
- Real-time updates for processing jobs
- Access to all output file paths
- Copy paths to clipboard for server access

## Development

### Project Structure
```
src/
├── components/          # Reusable UI components
├── pages/              # Main application pages
├── services/           # API service layer
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── App.tsx            # Main application component
```

### Key Components
- **Dashboard**: Main job queue overview
- **SubmitJob**: Job submission form
- **JobDetails**: Detailed job information view
- **Navigation**: Top navigation bar

### Styling
- Uses Tailwind CSS v4 with custom component classes
- Responsive design for mobile and desktop
- Consistent button and form styling
- Status-based color coding for job states

## Configuration

### Environment Variables
- `VITE_API_BASE_URL`: Base URL for ATH API service

### Tailwind Configuration
- Custom color schemes for job statuses
- Responsive breakpoints for mobile-first design
- Custom component classes for consistent styling

## Browser Support

- Modern browsers with ES2020+ support
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## Contributing

1. Follow TypeScript best practices
2. Use Tailwind utility classes for styling
3. Implement proper error handling
4. Add loading states for better UX
5. Test with different job statuses and scenarios

## License

This project is part of the ATH (Automated Testing Hub) system.
