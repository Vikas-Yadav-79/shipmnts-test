# shipmnts-test
Email Scheduler
Overview
Email Scheduler is a full-stack application that allows users to schedule emails for automatic delivery. The backend is built using Node.js with Express, and the frontend is developed using React with Vite. The application supports scheduling emails at specific times, as well as recurring emails on a daily, weekly, monthly, or quarterly basis.

Features
Schedule One-Time Emails: Specify a date and time for one-time email delivery.
Recurring Emails: Set up emails to recur daily, weekly, monthly, or quarterly.
Manage Scheduled Emails: View, delete, and modify scheduled emails.
Send Email with Attachments: Include attachments in scheduled emails.
Technologies Used
Backend:

Node.js
Express
Mongoose (for MongoDB)
Node-Schedule
Nodemailer
Frontend:

React
Vite
Axios (for HTTP requests)
Getting Started
Prerequisites
Node.js and npm (Node Package Manager) installed.
MongoDB instance (local or cloud-based).
Setup
Backend
Clone the repository:
git clone https://github.com/your-username/email-scheduler-backend.git

cd backend
Install dependencies:

npm install
Create a .env file in the root directory with the following content:

EMAIL=your-email@gmail.com
PASS=your-email-password
MONGO_URI=mongodb://localhost:27017/emailScheduler
Start the backend server:

bash
Copy code
npm start
The backend will be running at http://localhost:3000.

Frontend
Clone the repository:


git clone https://github.com/your-username/email-scheduler-frontend.git
cd email-scheduler-frontend
Install dependencies:


npm install
Start the frontend development server:

bash
Copy code
npm run dev
The frontend will be running at http://localhost:5173.

API Endpoints
POST /schedule-email
![image](https://github.com/user-attachments/assets/ccefc42b-6d6b-4c0f-8e37-7027e8c3eafa)


Schedule a new email.

![image](https://github.com/user-attachments/assets/7798b687-adf6-494f-8cc8-03eb4e555d3a)


Request Body:

{
  "recipient": "example@example.com",
  "subject": "Email Subject",
  "body": "Email Body",
  "scheduleTime": "14:00",
  "recurrence": "daily"
}
GET /scheduled-emails

![image](https://github.com/user-attachments/assets/8ed700d3-9ec0-4bf0-81e9-4d228c31756d)
![image](https://github.com/user-attachments/assets/24042b3f-e475-4581-975d-08ff55ce9416)



Retrieve a list of all scheduled emails.
GET /scheduled-emails/
![image](https://github.com/user-attachments/assets/64b5f8fe-3848-4813-bc30-b340a8187706)


Retrieve details of a specific scheduled email.
DELETE /scheduled-emails/

Cancel a scheduled email.
Frontend Usage
Schedule an Email:

Fill in the recipient, subject, body, schedule time, and recurrence type in the form on the main page.
View Scheduled Emails:

The list of scheduled emails is displayed below the form.
Delete an Email:

Click the "Delete" button next to the email you want to remove.
