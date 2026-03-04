import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔐 Login attempt:', { email }); // ✅ Debug
    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
      console.log('✅ Login success!'); // ✅ Success
      navigate('/');
    } catch (error) {
      console.error('❌ Login error:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Login failed';
      setError(errorMsg);
      alert('Login failed: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (user) return <Navigate to="/" />;

  return (
    <>
      <div className="container">
        <div className="login">
          {/* LEFT SIDE - Phones + Carousel (unchanged) */}
          <div className="images d-none d-lg-block">
            <div className="frame">
              <img src="/images/home-phones.png" alt="picture frame" />
            </div>
            <div className="sliders">
              <div id="carouselExampleSlidesOnly" className="carousel slide carousel-fade" data-bs-ride="carousel">
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <img src="/images/screenshot1.png" className="d-block" alt="screenshot1" />
                  </div>
                  <div className="carousel-item">
                    <img src="/images/screenshot2.png" className="d-block" alt="screenshot2" />
                  </div>
                  <div className="carousel-item">
                    <img src="/images/screenshot3.png" className="d-block" alt="screenshot3" />
                  </div>
                  <div className="carousel-item">
                    <img src="/images/screenshot4.png" className="d-block" alt="screenshot4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - FIXED LOGIN FORM */}
          <div className="content">
            <div className="log-on border_insc">
              <div className="logo">
                <img src="/images/logo.png" alt="Instagram logo" />
              </div>
              
              {/* ✅ FIXED: Form + Button TOGETHER */}
              <form onSubmit={handleSubmit}>
                <div>
                  <input 
                    type="email" 
                    name="email" 
                    id="email"  // ✅ Fixed ID typo
                    placeholder="e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <input 
                    type="password" 
                    name="password" 
                    id="password" 
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                {/* ✅ FIXED: Button INSIDE form, type="submit" */}
                <button 
                  type="submit"  // ✅ CRITICAL FIX!
                  className="log_btn" 
                  disabled={loading}
                  style={{ width: '100%', marginTop: '10px' }}
                >
                  {loading ? 'Logging in...' : 'Log in'}
                </button>
              </form>

              {/* ✅ Error display */}
              {error && (
                <div style={{ 
                  color: '#ed4956', 
                  textAlign: 'center', 
                  marginTop: '10px',
                  fontSize: '14px'
                }}>
                  {error}
                </div>
              )}

              <div className="other-ways">
                <div className="seperator">
                  <span className="ligne"></span>
                  <span className="ou">OR</span>
                  <span className="ligne"></span>
                </div>
                <div className="facebook-connection">
                
                </div>
                <div className="forget-password">
                  <a href="#">Forgot password?</a>
                </div>
              </div>
            </div>
            <div className="sing-up border_insc">
              <p>
                Don't have an account? 
                <a href="/signup">Sign up</a>
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

export default Login;
