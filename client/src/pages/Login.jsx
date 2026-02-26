import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import ToastMessage from "../components/ToastMessage";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiLogin(username, password);
      login(data.access, data.refresh);
      setToast({ show: true, message: "Login Successful!", type: "success" });
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      console.error("Login Error:", error);
      setToast({ 
        show: true, 
        message: error.response?.data?.detail || "Login Failed. Please check your credentials.", 
        type: "danger" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setUsername("coder123");
    setPassword("12345");
  };

  return (
    <div className="row justify-content-center mt-5 page-enter">
      <div className="col-md-5 col-lg-4">
        <ToastMessage 
          show={toast.show} 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ ...toast, show: false })} 
        />
        <div className="card shadow-sm">
          <div className="card-body p-5">
            <h3 className="card-title text-center mb-4">Login</h3>

            <div 
              className="alert alert-info py-2 small mb-4" 
              style={{ cursor: "pointer" }}
              onClick={handleFillDemo}
              title="Click to auto-fill"
            >
              <strong>Demo Credentials:</strong> (Click to fill)<br />
              Username: <code>coder123</code><br />
              Password: <code>12345</code>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-muted">Username</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label text-muted">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
