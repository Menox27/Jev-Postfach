import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("login"); // login, dashboard, settings
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [classifications, setClassifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    imapHost: "imap.mail.me.com",
    imapPort: 993,
    imapUser: "",
    imapPass: "",
    jevApiKey: ""
  });

  // Load accounts on component mount
  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const response = await axios.get("/api/users");
      setAccounts(response.data.users);
      if (response.data.users.length > 0) {
        setSelectedAccount(response.data.users[0]);
      }
    } catch (err) {
      console.error("Failed to load accounts:", err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/users/register", loginForm);
      setAccounts([...accounts, response.data.user]);
      setSelectedAccount(response.data.user);
      setCurrentPage("dashboard");
      setError("");
    } catch (err) {
      setError("Failed to register account: " + (err.response?.data?.error || err.message));
    }
  };

  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
    loadClassifications(account.id);
  };

  const loadClassifications = async (accountId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/emails/${accountId}/classifications`);
      setClassifications(response.data);
    } catch (err) {
      console.error("Failed to load classifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessEmails = async () => {
    if (!selectedAccount) return;
    
    try {
      setLoading(true);
      await axios.post(`/api/emails/${selectedAccount.id}/process`);
      loadClassifications(selectedAccount.id);
      setError("");
    } catch (err) {
      setError("Failed to process emails: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage("login");
  };

  // Render login page
  if (currentPage === "login") {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Smart Email Labeling System</h1>
        </header>

        <main className="login-container">
          <div className="login-form">
            <h2>Add Email Account</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email Address:</label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>IMAP Host:</label>
                <input
                  type="text"
                  value={loginForm.imapHost}
                  onChange={(e) => setLoginForm({...loginForm, imapHost: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>IMAP Port:</label>
                <input
                  type="number"
                  value={loginForm.imapPort}
                  onChange={(e) => setLoginForm({...loginForm, imapPort: parseInt(e.target.value)})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>IMAP Username:</label>
                <input
                  type="text"
                  value={loginForm.imapUser}
                  onChange={(e) => setLoginForm({...loginForm, imapUser: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>IMAP Password:</label>
                <input
                  type="password"
                  value={loginForm.imapPass}
                  onChange={(e) => setLoginForm({...loginForm, imapPass: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Jev API Key (OpenRouter):</label>
                <input
                  type="password"
                  value={loginForm.jevApiKey}
                  onChange={(e) => setLoginForm({...loginForm, jevApiKey: e.target.value})}
                  required
                />
                <small className="help-text">Get your API key from OpenRouter.ai</small>
              </div>
              
              <div className="form-actions">
                <button type="submit" disabled={loading}>
                  {loading ? "Adding Account..." : "Add Account"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    );
  }

  // Render dashboard
  return (
    <div className="App">
      <header className="App-header">
        <h1>Smart Email Labeling System</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      <main className="dashboard-container">
        {/* Account Selection */}
        <section className="account-section">
          <h2>Email Accounts</h2>
          <div className="account-list">
            {accounts.map(account => (
              <div 
                key={account.id} 
                className={`account-card ${selectedAccount?.id === account.id ? "active" : ""}`}
                onClick={() => handleAccountSelect(account)}
              >
                <h3>{account.email}</h3>
                <p>{account.imapHost}:{account.imapPort}</p>
              </div>
            ))}
            
            <button className="add-account-btn" onClick={() => setCurrentPage("login")}>
              + Add Another Account
            </button>
          </div>
        </section>

        {/* Active Account Dashboard */}
        {selectedAccount && (
          <section className="dashboard">
            <div className="dashboard-header">
              <h2>{selectedAccount.email} - Dashboard</h2>
              <button 
                className="process-btn" 
                onClick={handleProcessEmails}
                disabled={loading}
              >
                {loading ? "Processing..." : "Process Emails"}
              </button>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
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
                        <span className="confidence">Confidence: {(classification.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <p className="reasoning">{classification.reasoning}</p>
                      <div className="classification-meta">
                        <span>Email UID: {classification.email_uid}</span>
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
