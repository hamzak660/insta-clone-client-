import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPosts, togglePostLike } from '../services/api';
import Sidebar from '../components/Sidebar';

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLikes, setUserLikes] = useState({});
  const [moreMenus, setMoreMenus] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data } = await getPosts();
      console.log('✅ Posts:', data);
      
      setPosts(data || []);
      
      // FIXED: Initialize likes from backend data
      const likesState = {};
      data.forEach(post => {
        likesState[post.id] = post.liked_by_current_user || false;
      });
      setUserLikes(likesState);
    } catch (error) {
      console.error('❌ Error:', error);
    } finally {
      setLoading(false);
    }
  };

const toggleLike = async (postId) => {
  const wasLiked = userLikes[postId] || false;
  const currentPost = posts.find(p => p.id === postId);
  const currentCount = currentPost?.likes_count || 0;
  
  // Atomic update - fixes 2/-1 bug
  const newCount = wasLiked ? Math.max(0, currentCount - 1) : currentCount + 1;
  
  setUserLikes(prev => ({ ...prev, [postId]: !wasLiked }));
  setPosts(prevPosts => prevPosts.map(post => 
    post.id === postId
      ? { ...post, likes_count: newCount, liked_by_current_user: !wasLiked }
      : post
  ));

  try {
    await togglePostLike(postId);
  } catch (error) {
    // Revert
    setUserLikes(prev => ({ ...prev, [postId]: wasLiked }));
    setPosts(prevPosts => prevPosts.map(post => 
      post.id === postId
        ? { ...post, likes_count: currentCount, liked_by_current_user: wasLiked }
        : post
    ));
    console.error('Like failed:', error);
  }
};

  const toggleMoreMenu = (postId) => {
    setMoreMenus(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffMs = now - postTime;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    return `${Math.floor(diffHours / 24)}d`;
  };

  if (loading) {
    return (
      <div className="post_page">
        <Sidebar />
        <div className="second_container">
          <div className="main_section">
            <div style={{ padding: '100px 20px', textAlign: 'center' }}>Loading feed...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="post_page">
      <Sidebar />
      
      <div className="second_container">
        <div className="main_section">
          <div className="posts_container">
            <div className="posts">
              {posts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '100px 20px' }}>
                  <h3>No posts yet</h3>
                  <p>Follow some accounts to see their posts</p>
                </div>
              ) : (
                posts.map(post => (
                  <div key={post.id} className="post">
                    <div className="info">
                      <div className="person">
                        <img 
                          src={post.users?.avatar_url || '/images/profile_img.jpg'} 
                          alt="Profile" 
                        />
                        <a href="#">{post.users?.username || 'user'}</a>
                        <span className="circle">.</span>
                        <span>{formatTime(post.created_at)}</span>
                      </div>
                      <div 
                        className="more" 
                        onClick={() => toggleMoreMenu(post.id)}
                        style={{ cursor: 'pointer', position: 'relative' }}
                      >
                        <img src="/images/show_more.png" alt="more" />
                        {moreMenus[post.id] && (
                          <ul style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            background: 'white',
                            border: '1px solid #dbdbdb',
                            borderRadius: '8px',
                            listStyle: 'none',
                            padding: '8px 0',
                            margin: 0,
                            minWidth: '120px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            zIndex: 1000
                          }}>
                            <li style={{ padding: '8px 16px', cursor: 'pointer' }}>Unfollow</li>
                            <li style={{ padding: '8px 16px', cursor: 'pointer' }}>Report</li>
                          </ul>
                        )}
                      </div>
                    </div>

                    <div className="image">
                      {post.media_urls?.[0] ? (
                        <img src={post.media_urls[0]} alt="Post" />
                      ) : (
                        <div style={{ 
                          height: '500px', 
                          background: '#efefef', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}>
                          No image
                        </div>
                      )}
                    </div>

                    <div className="desc">

<div className="icons">
  <div className="icon_left d-flex">
    <div 
      className="like" 
      onClick={() => toggleLike(post.id)}
      style={{ 
        cursor: 'pointer', 
        display: 'flex',
        position: 'relative',
        width: '24px',
        height: '24px'
      }}
    >
      {/* ❤️ FILLED HEART - Show ONLY when LIKED */}
      <img 
        src="/images/heart.png" 
        alt="Liked" 
        className={userLikes[post.id] ? 'loved' : 'd-none'}
        style={{ 
          position: 'absolute', 
          width: '24px', 
          height: '24px',
          opacity: 1
        }}
      />
      {/* 🤍 OUTLINE HEART - Show ONLY when NOT LIKED */}
      <img 
        src="/images/love.png" 
        alt="Like" 
        className={!userLikes[post.id] ? 'not_loved' : 'd-none'}
        style={{ 
          position: 'absolute', 
          width: '24px', 
          height: '24px',
          opacity: 1
        }}
      />
    </div>
  </div>

                      </div>
                      
                      {/* ✅ REAL LIKES COUNT */}
                      <div className="liked">
                        <a className="bold" href="#">{post.likes_count || 0} likes</a>
                      </div>
                      
                      <div className="post_desc">
                        <p>
                          <a className="bold" href="#">{post.users?.username}</a> {post.caption}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Suggestions Sidebar */}
        <div className="followers_container">
          <div className="suggestions">
            <div className="title">
              <h4>Suggestions for you</h4>
              <a className="dark" href="#">See All</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
