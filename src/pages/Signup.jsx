import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '', full_name: '', username: '', password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup, user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('📤 Signup data:', formData); // ✅ Frontend debug
    setLoading(true);
    setError('');
    
    try {
      const result = await signup(formData);
      console.log('✅ Signup success:', result); // ✅ Success
      navigate('/');
    } catch (error) {
      console.error('❌ Signup error:', error);
      setError(error.response?.data?.error || 'Signup failed');
      alert('Signup failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (user) return <Navigate to="/" />;

  return (
    <>
      <div className="container">
        <div className="sign_up">
          <div className="content">
            <div className="log-on border_insc">
              <div className="logo">
                <img src="/images/logo.png" alt="Instagram logo" />
                <p>Sign up to see photos and videos from your friends.</p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div><input type="email" name="email" placeholder="Email address" onChange={handleChange} required /></div>
                <div><input type="text" name="full_name" placeholder="Full Name" onChange={handleChange} required /></div>
                <div><input type="text" name="username" placeholder="Username" onChange={handleChange} required /></div>
                <div><input type="password" name="password" placeholder="Password" onChange={handleChange} required /></div>
                <div className="info">
                   <p>By signing up, you agree to our <a href="#">Terms, Privacy Policy and Cookies Policy.</a></p>
               </div>
                
                {/* ✅ FIXED: Button INSIDE form */}
                <button 
                  type="submit" 
                  className="log_btn" 
                  disabled={loading}
                  style={{ width: '100%', marginTop: '10px' }}
                >
                  {loading ? 'Signing up...' : 'Sign Up'}
                </button>
              </form>

              {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
            </div>
            <div className="sing-in border_insc">
              <p>
                Have an account? <a href="/login">Log in</a>
              </p>
            </div>
            <div className="download">
              <p>Get the app.</p>
              <div>
                <img src="/images/google_play_icon.png" alt="download app from google play" />
                <img src="/images/microsoft-icon.png" alt="download app from microsoft" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
