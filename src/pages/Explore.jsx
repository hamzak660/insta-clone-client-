import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllPosts, togglePostLike } from '../services/api';
import Sidebar from '../components/Sidebar';

const Explore = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLikes, setUserLikes] = useState({});

  useEffect(() => {
    fetchExplorePosts();
  }, []);

  const fetchExplorePosts = async () => {
    try {
      setLoading(true);
      const { data } = await getAllPosts();
      setPosts(data || []);
      
      const likesState = {};
      data.forEach(post => {
        likesState[post.id] = post.liked_by_current_user || false;
      });
      setUserLikes(likesState);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (postId) => {
    try {
      await togglePostLike(postId);
      setUserLikes(prev => ({
        ...prev,
        [postId]: !prev[postId]
      }));
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, likes_count: prev.find(p => p.id === postId)?.likes_count + 1 }
          : post
      ));
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  if (loading) return <div className="post_page"><Sidebar /><div className="explore_container"><div>Loading...</div></div></div>;

  return (
    <div className="post_page">
      <Sidebar />
      <div className="explore_container">
        <div className="explore-grid">
          {posts.map(post => (
            <div key={post.id} className="explore-post">
              <div className="explore-post-image">
                <img src={post.media_urls?.[0] || 'https://picsum.photos/300/300'} alt="post" />
                <div className="explore-overlay">
                  <div className="explore-like" onClick={() => toggleLike(post.id)}>
                    <img src={userLikes[post.id] ? "/images/heart.png" : "/images/love.png"} alt="like" />
                    <span>{post.likes_count}</span>
                  </div>
                </div>
              </div>
              <div className="explore-post-info">
                <h6>{post.users?.username}</h6>
                <p>{post.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .explore_container { padding: 88px 20px 20px; max-width: 1200px; margin: 0 auto; }
        .explore-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); 
          gap: 28px; 
        }
        .explore-post { 
          border-radius: 12px; 
          overflow: hidden; 
          background: white; 
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }
        .explore-post:hover { transform: scale(1.02); }
        .explore-post-image { position: relative; height: 280px; overflow: hidden; }
        .explore-post-image img { width: 100%; height: 100%; object-fit: cover; }
        .explore-overlay { 
          position: absolute; top: 12px; right: 12px; 
          background: rgba(0,0,0,0.6); border-radius: 50%; 
          width: 44px; height: 44px; display: flex; align-items: center; 
          justify-content: center; opacity: 0; transition: opacity 0.3s;
        }
        .explore-post:hover .explore-overlay { opacity: 1; }
        .explore-like { 
          display: flex; flex-direction: column; 
          align-items: center; color: white; font-weight: 600; cursor: pointer;
        }
        .explore-like img { width: 20px; height: 20px; filter: brightness(0) invert(1); }
        .explore-post-info { padding: 12px; }
        .explore-post-info h6 { margin: 0 0 4px 0; font-weight: 600; }
        .explore-post-info p { margin: 0; font-size: 14px; color: #262626; }
      `}</style>
    </div>
  );
};

export default Explore;
