import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [emails, setEmails] = useState([]);
  const [form, setForm] = useState({
    recipient: '',
    subject: '',
    body: '',
    scheduleTime: '',
    recurrence: ''
  });

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const response = await axios.get('http://localhost:3000/scheduled-emails');
      setEmails(Object.entries(response.data).map(([id, email]) => ({ id, ...email })));
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/schedule-email', form);
      fetchEmails();
      setForm({
        recipient: '',
        subject: '',
        body: '',
        scheduleTime: '',
        recurrence: ''
      });
    } catch (error) {
      console.error('Error scheduling email:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/scheduled-emails/${id}`);
      fetchEmails();
    } catch (error) {
      console.error('Error deleting email:', error);
    }
  };

  return (
    <div className="App">
      <h1>Email Scheduler</h1>
      <form onSubmit={handleSubmit}>
        <br />
        <input
          type="email"
          name="recipient"
          value={form.recipient}
          onChange={handleChange}
          placeholder="Recipient"
          required
        />
        <br />
        <input
          type="text"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          placeholder="Subject"
          required
        />
        <br />
        <textarea
          name="body"
          value={form.body}
          onChange={handleChange}
          placeholder="Body"
          required
        />
        <br />
        <input
          type="time"
          name="scheduleTime"
          value={form.scheduleTime}
          onChange={handleChange}
          required
        />
        <br />
        <select
          name="recurrence"
          value={form.recurrence}
          onChange={handleChange}
          required
        >
          <br />
          <option value="">Select Recurrence</option> <br />
          <option value="daily">Daily</option> <br />
          <option value="weekly">Weekly</option> <br />
          <option value="monthly">Monthly</option> <br />
          <option value="quarterly">Quarterly</option> <br />
        </select>
        <br />
        <button type="submit">Schedule Email</button>
      </form>
      <h2>Scheduled Emails</h2>
      <ul>
        {emails.map(email => (
          <li key={email.id}>
            <strong>{email.subject}</strong> - {email.scheduleTime}
            <button onClick={() => handleDelete(email.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
