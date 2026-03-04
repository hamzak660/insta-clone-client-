import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

const Settings = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    bio: user?.bio || '',
  });

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="post_page">
      <Sidebar />
      <div className="second_container" style={{ padding: '20px', maxWidth: '600px' }}>
        <div className="main_section" style={{ flex: 1 }}>
          <h2>Settings</h2>
          
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button 
              className={activeTab === 'profile' ? 'active' : ''} 
              onClick={() => setActiveTab('profile')}
              style={{ padding: '10px 20px', border: '1px solid #dbdbdb' }}
            >
              Profile
            </button>
            <button 
              className={activeTab === 'privacy' ? 'active' : ''} 
              onClick={() => setActiveTab('privacy')}
              style={{ padding: '10px 20px', border: '1px solid #dbdbdb' }}
            >
              Privacy
            </button>
          </div>

          {activeTab === 'profile' && (
            <div>
              <h3>Edit Profile</h3>
              <input 
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                placeholder="Full Name"
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              />
              <textarea 
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                placeholder="Bio"
                style={{ width: '100%', padding: '10px', height: '100px' }}
              />
              <button style={{ background: '#0095f6', color: 'white', padding: '10px 20px' }}>
                Save Profile
              </button>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div>
              <h3>Danger Zone</h3>
              <button 
                onClick={handleLogout}
                style={{ 
                  background: '#ed4956', 
                  color: 'white', 
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px'
                }}
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
