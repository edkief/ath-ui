Of course. Here are the high-level functional requirements for the new React-based UI based on the provided API documentation.

---

## 1. Dashboard Page (Job Queue Overview) 🖥️

This page will serve as the main landing view, providing users with a summary of all current and past processing jobs.

* [cite_start]**FR-1.1: Display Job Queue:** The system shall fetch and display a list of all jobs by calling the `GET /api/ath/queue` endpoint[cite: 1].
* **FR-1.2: Automatic Refresh:** The job list shall automatically refresh periodically to reflect the real-time status of all jobs.
* **FR-1.3: Core Job Information:** For each job in the list, the following information must be clearly displayed:
    * [cite_start]A user-friendly **Reference**[cite: 1].
    * [cite_start]The **Service** name being used[cite: 1].
    * [cite_start]The **Status** of the job (e.g., `PENDING`, `PROCESSING`, `COMPLETE`, `REPORTING`)[cite: 1, 4].
    * [cite_start]The job's submission timestamp (`timings.submitted`)[cite: 2, 4].
    * [cite_start]A visual **progress indicator** (e.g., a progress bar) for jobs in the `PROCESSING` state, derived from the `progress` field[cite: 16].
* **FR-1.4: Navigation to Details:** Each job entry in the list shall be a clickable link that navigates the user to the "Job Details Page" for that specific job, using its `uid`.
* **FR-1.5: Job Cancellation:** For any job that is not yet `COMPLETE`, the system shall provide a "Cancel" button. Clicking this will trigger a confirmation prompt and then call the `POST /api/ath/cancel` endpoint with the job's `uid`.
* [cite_start]**FR-1.6: Clear Completed Jobs:** The dashboard shall feature a "Clear Completed" button that calls the `DELETE /api/ath/queue/clear` endpoint[cite: 18]. [cite_start]This action should require user confirmation, as it is destructive[cite: 17].

---

## 2. Submit New Batch Journey 🚀

This user journey allows a user to submit a new file for processing.

* **FR-2.1: Submission Form:** The UI will provide a dedicated page with a form for submitting new jobs. [cite_start]This form will map to the `POST /api/ath/submit` endpoint[cite: 13].
* **FR-2.2: Form Fields:** The form must contain the following input fields, as required by the API:
    * [cite_start]**Service Name:** A text input for the service name[cite: 14].
    * [cite_start]**File Path:** A text input for the absolute path to the input file[cite: 14]. [cite_start]Helper text should inform the user that the file must already exist in a location accessible to the backend service[cite: 13].
    * [cite_start]**Reference:** A text input for a custom, user-friendly reference string for the job[cite: 14].
* **FR-2.3: Submission and Feedback:**
    * Upon submission, the system shall call the API and display a loading indicator.
    * [cite_start]On a successful response, the user shall be redirected to the dashboard and shown a success notification containing the new job's `uid`[cite: 15].
    * If the API returns an error, a clear and user-friendly error message must be displayed.

---

## 3. Job Details & Results Download Page 📊

This page provides a detailed view of a single job and the means to access its output files.

* **FR-3.1: Display Detailed Job Information:** The system shall fetch and display detailed information for a specific job by calling the `GET /api/ath/queue/:uid` endpoint. This includes:
    * All information from the dashboard view (Status, Reference, Service, etc.).
    * [cite_start]Detailed timing information: `submitted`, `started`, `completed`, and `totalElapsed` time[cite: 6, 7].
    * [cite_start]Record counts: `recordsTotal` and `recordsProcessed`[cite: 7].
    * [cite_start]For `PROCESSING` jobs, display the ETA (`etaString`) and estimated time remaining (`remaining`)[cite: 10].
* **FR-3.2: Access to Output Files (Phase 1):**
    * If a job's status is `COMPLETE`, a dedicated "Results" section shall be visible.
    * [cite_start]This section will display the server paths for all available output files as returned by the API[cite: 3]. Specifically, it will list the paths for:
        * Raw Results (`output.raw`)
        * Delimited Results (`output.results`)
        * [cite_start]Summary Report (`output.summaryReport`) [cite: 12]
        * [cite_start]Full Report (`output.fullReport`) [cite: 8]
    * The UI shall provide an easy way for the user to copy these paths.
* **FR-3.3: Direct Download of Results (Phase 2):**
    * *(Future Requirement)* When APIs for direct file downloads are available, the paths listed in **FR-3.2** will be replaced with direct download links. Each link will trigger the download of the corresponding file (e.g., summary report, raw results csv).