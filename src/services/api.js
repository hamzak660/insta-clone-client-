import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://insta-clone-server-production.up.railway.app/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getPosts = () => api.get('/posts');
// ✅ FIXED togglePostLike
export const togglePostLike = async (postId) => {
  return api.post(`/posts/like/${postId}`);
};
// Add these exports
export const getAllPosts = () => api.get('/posts/all');
export const getUserPosts = (username) => api.get(`/posts/user/${username}`);
export const getUserProfile = (username) => api.get(`/users/${username}`);
export const updateProfile = (data) => api.put('/users/profile', data);
export const uploadPost = (formData) => api.post('/posts', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const changePassword = (data) => api.post('/users/password', data);
export const deleteAccount = () => api.delete('/users');
