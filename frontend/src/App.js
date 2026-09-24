import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [emailAccounts, setEmailAccounts] = useState([]);
  const [activeAccount, setActiveAccount] = useState(null);
  const [classifications, setClassifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Registration form state
  const [registerForm, setRegisterForm] = useState({
    email: "",
    imapHost: "imap.mail.me.com",
    imapPort: 993,
    imapUser: "",
    imapPass: "",
    jevApiKey: ""
  });

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      setUsers(response.data.users);
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/users/register", registerForm);
      setUsers([...users, response.data.user]);
      setShowRegister(false);
      setRegisterForm({
        email: "",
        imapHost: "imap.mail.me.com",
        imapPort: 993,
        imapUser: "",
        imapPass: "",
        jevApiKey: ""
      });
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const handleAccountSelect = (account) => {
    setActiveAccount(account);
    loadClassifications(account.id);
  };

  const loadClassifications = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/emails/${userId}/classifications`);
      setClassifications(response.data);
    } catch (error) {
      console.error("Failed to load classifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessEmails = async () => {
    if (!activeAccount) return;
    
    try {
      setLoading(true);
      await axios.post(`/api/emails/${activeAccount.id}/process`);
      loadClassifications(activeAccount.id);
    } catch (error) {
      console.error("Failed to process emails:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Smart Email Labeling System</h1>
      </header>

      <main>
        {/* User Selection */}
        <section className="user-selection">
          <h2>Email Accounts</h2>
          <div className="account-list">
            {users.map(user => (
              <div 
                key={user.id} 
                className={`account-card ${activeAccount?.id === user.id ? "active" : ""}`}
                onClick={() => handleAccountSelect(user)}
              >
                <h3>{user.email}</h3>
                <p>{user.imapHost}:{user.imapPort}</p>
              </div>
            ))}
            
            <button className="add-account-btn" onClick={() => setShowRegister(true)}>
              + Add Account
            </button>
          </div>
        </section>

        {/* Registration Form */}
        {showRegister && (
          <section className="registration-form">
            <h2>Add New Email Account</h2>
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>IMAP Host:</label>
                <input
                  type="text"
                  value={registerForm.imapHost}
                  onChange={(e) => setRegisterForm({...registerForm, imapHost: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>IMAP Port:</label>
                <input
                  type="number"
                  value={registerForm.imapPort}
                  onChange={(e) => setRegisterForm({...registerForm, imapPort: parseInt(e.target.value)})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>IMAP Username:</label>
                <input
                  type="text"
                  value={registerForm.imapUser}
                  onChange={(e) => setRegisterForm({...registerForm, imapUser: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>IMAP Password:</label>
                <input
                  type="password"
                  value={registerForm.imapPass}
                  onChange={(e) => setRegisterForm({...registerForm, imapPass: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Jev API Key:</label>
                <input
                  type="password"
                  value={registerForm.jevApiKey}
                  onChange={(e) => setRegisterForm({...registerForm, jevApiKey: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-actions">
                <button type="submit">Add Account</button>
                <button type="button" onClick={() => setShowRegister(false)}>Cancel</button>
              </div>
            </form>
          </section>
        )}

        {/* Active Account Dashboard */}
        {activeAccount && (
          <section className="dashboard">
            <div className="dashboard-header">
              <h2>{activeAccount.email} - Dashboard</h2>
              <button 
                className="process-btn" 
                onClick={handleProcessEmails}
                disabled={loading}
              >
                {loading ? "Processing..." : "Process Emails"}
              </button>
            </div>
            
            <div className="classifications">
              <h3>Recent Classifications</h3>
              {loading ? (
                <p>Loading...</p>
              ) : classifications.length === 0 ? (
                <p>No classifications yet. Click "Process Emails" to start.</p>
              ) : (
                <div className="classification-list">
                  {classifications.map(classification => (
                    <div key={classification.id} className="classification-item">
                      <div className="classification-header">
                        <span className="label">{classification.label}</span>
                        <span className="confidence">Confidence: {classification.confidence}</span>
                      </div>
                      <p className="reasoning">{classification.reasoning}</p>
                      <div className="classification-meta">
                        <span>UID: {classification.email_uid}</span>
                        <span>{new Date(classification.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
