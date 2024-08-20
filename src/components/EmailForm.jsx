import React, { useState } from 'react';
import axios from 'axios';

const EmailForm = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/email`, {
        email, subject, message
      });
      alert('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return (
    <div className="container">
     <h3>Send Email To Potential Buyers</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Recipient's Email / ALL"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><tr></tr>
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <textarea
          placeholder="Message to specific or ALL"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send Email</button>
      </form>
    </div>
  );
};

export default EmailForm;
