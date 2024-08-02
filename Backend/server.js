const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const schedule = require('node-schedule');
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

const port = 3000;

dotenv.config();


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5174'); 
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); 
    res.header('Access-Control-Allow-Headers', 'Content-Type'); 
    next();
});
app.use(cors());


const emailID = process.env.EMAIL;
const password = process.env.PASS;


app.use(bodyParser.json());

let scheduledEmails = {};

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: emailID, 
        pass: password  
    }
});

// POST /schedule-email
app.post('/schedule-email', (req, res) => {
    const { recipient, subject, body, scheduleTime, recurrence } = req.body;

    if (!recipient || !subject || !body || !scheduleTime || !recurrence) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const id = Date.now().toString();
    let job;

    const [hour, minute] = scheduleTime.split(':').map(num => parseInt(num, 10));

    if (recurrence === 'daily') {
        job = schedule.scheduleJob({ hour, minute }, () => sendEmail(id, recipient, subject, body));
    } else if (recurrence === 'weekly') {
        const dayOfWeek = new Date().getDay(); 
        job = schedule.scheduleJob({ hour, minute, dayOfWeek }, () => sendEmail(id, recipient, subject, body));
    } else if (recurrence === 'monthly') {
        const dayOfMonth = new Date().getDate(); 
        job = schedule.scheduleJob({ date: dayOfMonth, hour, minute }, () => sendEmail(id, recipient, subject, body));
    } else if (recurrence === 'quarterly') {
        const dayOfMonth = new Date().getDate(); 
        job = schedule.scheduleJob({ month: new schedule.Range(0, 11, 3), date: dayOfMonth, hour, minute }, () => sendEmail(id, recipient, subject, body));
    } else {
        return res.status(400).json({ error: 'Invalid recurrence type' });
    }

    scheduledEmails[id] = { recipient, subject, body, scheduleTime, recurrence };
    res.status(201).json({ id });
});

// GET /scheduled-emails
app.get('/scheduled-emails', (req, res) => {
    const response = {};
    for (const [id, email] of Object.entries(scheduledEmails)) {
        response[id] = { ...email }; 
    }
    res.json(response);
});

// GET /scheduled-emails/:id
app.get('/scheduled-emails/:id', (req, res) => {
    const id = req.params.id;
    const email = scheduledEmails[id];
    if (email) {
        res.json(email);
    } else {
        res.status(404).json({ error: 'Email not found' });
    }
});

// DELETE /scheduled-emails/:id
app.delete('/scheduled-emails/:id', (req, res) => {
    const id = req.params.id;
    const email = scheduledEmails[id];
    if (email) {
        const job = Object.values(schedule.scheduledJobs).find(job => job.id === id);
        if (job) {
            job.cancel();
        }
        delete scheduledEmails[id];
        res.status(204).end();
    } else {
        res.status(404).json({ error: 'Email not found' });
    }
});

const sendEmail = (id, recipient, subject, body) => {
    const mailOptions = {
        from: emailID,
        to: recipient,
        subject: subject,
        text: body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(`Error sending email ${id}: ${error}`);
        } else {
            console.log(`Email ${id} sent: ${info.response}`);
        }
    });
};

app.listen(port, () => {
    console.log(`Email scheduler API listening at http://localhost:${port}`);
});