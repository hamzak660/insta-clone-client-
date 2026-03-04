// src/components/Sidebar.jsx - FULL REPLACEMENT
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CreatePostModal from './CreatePostModal';

const Sidebar = () => {
  const { user, logout } = useAuth();  // ✅ FIXED: Added logout here
  const location = useLocation();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className="nav_menu">
        <div className="fix_top">
          {/* DESKTOP NAV */}
          <div className="nav">
            <div className="logo">
              <Link to="/">
                <img className="d-block d-lg-none small-logo" src="/images/instagram.png" alt="logo" />
                <img className="d-none d-lg-block" src="/images/logo_menu.png" alt="logo" />
              </Link>
            </div>
            
            <div className="menu">
              <ul>
                <li>
                  <Link to="/" className={isActive('/') ? 'active' : ''}>
                    <img src="/images/accueil.png" alt="Home" />
                    <span className="d-none d-lg-block">Home</span>
                  </Link>
                </li>
                
                <li>
                  <Link to="/explore">  {/* ✅ FIXED: lowercase "explore" */}
                    <img src="/images/compass.png" alt="Explore" />
                    <span className="d-none d-lg-block">Explore</span>
                  </Link>
                </li>

                <li>
                  <a href="#" onClick={() => setShowCreateModal(true)}>
                    <img src="/images/tab.png" alt="Create" />
                    <span className="d-none d-lg-block">Create</span>
                  </a>
                </li>

                <li>
                  <Link to="/profile">
                    <img className="circle story" src={user?.avatar_url || '/images/profile_img.jpg'} alt="Profile" />
                    <span className="d-none d-lg-block">Profile</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* ✅ FIXED DROPDOWN */}
            <div className="more">
              <div className="btn-group dropup">
                <button type="button" className="btn dropdown-toggle" data-bs-toggle="dropdown">
                  <img src="/images/menu.png" alt="More" />
                  <span className="d-none d-lg-block">More</span>
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/settings" className="dropdown-item" style={{justifyContent: 'left'}} >
                      <img src="/images/reglage.png" alt="Settings" style={{width: '16px', marginRight: '7px',marginLeft:'0px', verticalAlign: 'middle'}} />
                      Settings
                    </Link>
                  </li>
                  <li>
                    <a 
                      className="dropdown-item" 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        logout();  // ✅ NOW WORKS - logout is defined
                      }}
                    >
                      Log out
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* MOBILE BOTTOM NAV */}
          <div className="nav_bottom">
            <Link to="/"><img src="/images/accueil.png" alt="Home" /></Link>
            <Link to="/explore"><img src="/images/compass.png" alt="Explore" /></Link>
            <a href="#" onClick={() => setShowCreateModal(true)}><img src="/images/tab.png" alt="Create" /></a>
            <Link to="/profile"><img className="circle story" src={user?.avatar_url || '/images/profile_img.jpg'} alt="Profile" /></Link>
          </div>
        </div>
      </div>

      <CreatePostModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </>
  );
};

export default Sidebar;
