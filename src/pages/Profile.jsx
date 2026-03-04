import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserPosts, getUserProfile, togglePostLike } from '../services/api';
import Sidebar from '../components/Sidebar';

const Profile = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const isOwnProfile = user?.username === username;
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [userLikes, setUserLikes] = useState({});

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      const [{ data: profileData }, { data: postsData }] = await Promise.all([
        getUserProfile(username),
        getUserPosts(username)
      ]);
      
      setProfile(profileData);
      setPosts(postsData || []);
      
      const likesState = {};
      postsData.forEach(post => {
        likesState[post.id] = post.liked_by_current_user || false;
      });
      setUserLikes(likesState);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleLike = async (postId) => {
    // Same toggleLike logic as Home/Explore
  };

  return (
    <div className="post_page">
      <Sidebar />
      <div className="profile_container">
        {/* Profile Header */}
        <div className="profile_info">
          <div className="profile_header">
            <div className="profile_avatar">
              <img src={profile?.avatar_url || '/images/profile_img.jpg'} alt="avatar" />
            </div>
            <div className="profile_details">
              <div className="username_section">
                <h1>{profile?.username}</h1>
                {isOwnProfile && (
                  <button className="edit_profile">Edit profile</button>
                )}
              </div>
              <div className="stats">
                <div><span>{posts.length}</span> posts</div>
                <div><span>{profile?.followers_count || 0}</span> followers</div>
                <div><span>{profile?.following_count || 0}</span> following</div>
              </div>
              <h2>{profile?.full_name}</h2>
              <p>{profile?.bio || 'No bio yet'}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="profile_tabs">
          <button className={activeTab === 'posts' ? 'active' : ''} onClick={() => setActiveTab('posts')}>
            <img src="/images/feed.png" alt="posts" /> POSTS
          </button>
          <button className={activeTab === 'saved' ? 'active' : ''} onClick={() => setActiveTab('saved')}>
            <img src="/images/save-instagram.png" alt="saved" /> SAVED
          </button>
          <button className={activeTab === 'tagged' ? 'active' : ''} onClick={() => setActiveTab('tagged')}>
            <img src="/images/tagged.png" alt="tagged" /> TAGGED
          </button>
        </div>

        {/* Posts Grid */}
        <div className="profile_posts_grid">
          {posts.map(post => (
            <div key={post.id} className="profile_post_item">
              <img src={post.media_urls?.[0]} alt="post" />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .profile_container { max-width: 975px; margin: 0 auto; padding: 88px 20px 20px; }
        .profile_header { display: flex; gap: 48px; align-items: center; padding-bottom: 44px; }
        .profile_avatar img { width: 150px; height: 150px; border-radius: 50%; object-fit: cover; }
        .username_section { display: flex; align-items: center; gap: 20px; margin-bottom: 24px; }
        .username_section h1 { margin: 0; font-size: 28px; font-weight: 300; }
        .edit_profile { 
          background: #0095f6; color: white; border: none; 
          padding: 8px 24px; border-radius: 8px; font-weight: 600; cursor: pointer;
        }
        .stats { display: flex; gap: 40px; margin-bottom: 24px; }
        .stats div { font-size: 16px; }
        .stats span { font-weight: 600; font-size: 18px; }
        .profile_details h2 { margin: 0 0 4px 0; font-weight: 400; }
        .profile_details p { margin: 0; color: #262626; }
        .profile_tabs { 
          display: flex; justify-content: center; 
          border-top: 1px solid #dbdbdb; padding-top: 20px; 
        }
        .profile_tabs button { 
          background: none; border: none; 
          display: flex; align-items: center; gap: 4px; 
          padding: 8px 16px; cursor: pointer; 
          font-size: 14px; font-weight: 600;
        }
        .profile_tabs button.active { color: #262626; }
        .profile_posts_grid { 
          display: grid; 
          grid-template-columns: repeat(3, 1fr); 
          gap: 2px; margin-top: 44px;
        }
        .profile_post_item { aspect-ratio: 1; overflow: hidden; }
        .profile_post_item img { width: 100%; height: 100%; object-fit: cover; }
      `}</style>
    </div>
  );
};

export default Profile;
