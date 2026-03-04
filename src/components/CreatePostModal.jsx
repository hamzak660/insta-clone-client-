import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { uploadPost } from '../services/api';

const CreatePostModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState([]);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setStep(2); // Go to caption step
  };

  const handlePost = async () => {
    if (!files.length) return;
    
    setLoading(true);
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    formData.append('caption', caption);

    try {
      await uploadPost(formData);
      setStep(3); // Success
      setTimeout(() => {
        onClose();
        setStep(1);
        setFiles([]);
        setCaption('');
      }, 2000);
    } catch (error) {
      console.error('Post error:', error);
      alert('Failed to post');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="modal fade show d-block" 
      style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999 }}
      onClick={onClose}
    >
      <div 
        className="modal-dialog modal-dialog-centered" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '500px' }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5>Create Post</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          {/* STEP 1: Select Images */}
          {step === 1 && (
            <div className="modal-body text-center">
              <img src="/images/upload.png" alt="upload" style={{ width: '80px', opacity: 0.6 }} />
              <p style={{ margin: '20px 0' }}>Drag photos and videos here</p>
              <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
                Select from computer
                <input 
                  type="file" 
                  multiple 
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          )}

          {/* STEP 2: Add Caption */}
          {step === 2 && (
            <div className="modal-body">
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                {files.slice(0, 3).map((file, i) => (
                  <img 
                    key={i} 
                    src={URL.createObjectURL(file)} 
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                ))}
              </div>
              
              <textarea 
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption..."
                style={{ width: '100%', height: '120px', border: '1px solid #dbdbdb', borderRadius: '8px', padding: '12px' }}
              />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <button className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
                <button 
                  className="btn btn-primary" 
                  onClick={handlePost}
                  disabled={!files.length || loading}
                >
                  {loading ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Success */}
          {step === 3 && (
            <div className="modal-body text-center">
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>✅</div>
              <h4>Post Published!</h4>
              <p>Your post has been shared to your followers</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
