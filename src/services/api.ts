import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'
const STATIC_TOKEN = 'test_token_123'

function getAuthToken() {
  return localStorage.getItem('authToken')
}

function getAuthHeaders(hybrid = false) {
  const token = getAuthToken()
  if (token) {
    return { Authorization: `Bearer ${token}` }
  }
  if (hybrid) {
    return { Authorization: `Bearer ${STATIC_TOKEN}` }
  }
  return {}
}

// --- Auth ---
export async function login(email: string, password: string) {
  const res = await axios.post(`${API_BASE_URL}/login`, { email, password })
  return res.data
}

export async function logout() {
  return axios.post(`${API_BASE_URL}/logout`, {}, {
    headers: getAuthHeaders(),
  })
}

export async function getCurrentUser() {
  const res = await axios.get(`${API_BASE_URL}/user`, {
    headers: getAuthHeaders(),
  })
  return res.data
}

// --- Profile ---
export async function getProfile() {
  const res = await axios.get(`${API_BASE_URL}/profile`, {
    headers: getAuthHeaders(),
  })
  return res.data;
}

// --- Posts ---
export async function getPosts() {
  const res = await axios.get(`${API_BASE_URL}/posts`, {
    headers: getAuthHeaders(),
  })
  return res.data
}

// --- Users ---
export async function getUsers(params = {}) {
  const res = await axios.get(`${API_BASE_URL}/users`, {
    headers: getAuthHeaders(true),
    params,
  })
  return res.data
}

// --- Comments ---
export async function getComments() {
  const res = await axios.get(`${API_BASE_URL}/comments`, {
    headers: getAuthHeaders(),
  })
  return res.data
}

export async function createComment(comment: { post_id: number; text: string }) {
  const res = await axios.post(`${API_BASE_URL}/comments`, comment, {
    headers: getAuthHeaders(),
  })
  return res.data
}

export async function updateComment(commentId: number, data: { text: string }) {
  const res = await axios.put(`${API_BASE_URL}/comments/${commentId}`, data, {
    headers: getAuthHeaders(),
  })
  return res.data
}

export async function deleteComment(commentId: number) {
  return axios.delete(`${API_BASE_URL}/comments/${commentId}`, {
    headers: getAuthHeaders(),
  })
}

// Delete a comment belonging to a specific post
export async function deleteCommentForPost(postId: number, commentId: number) {
  return axios.delete(`${API_BASE_URL}/posts/${postId}/comments/${commentId}`, {
    headers: getAuthHeaders(),
  })
}


export async function getCommentsForPost(postId: number) {
  const res = await axios.get(`${API_BASE_URL}/posts/${postId}/comments`, {
    headers: getAuthHeaders(),
  });
  return res.data;
}


// --- Post Likes ---
export async function likePost(postId: number) {
  const res = await axios.post(`${API_BASE_URL}/posts/${postId}/like`, {}, {
    headers: getAuthHeaders(),
  })
  return res.data
}

export async function unlikePost(postId: number, likeId: number) {
  const res = await axios.delete(`${API_BASE_URL}/posts/${postId}/like/${likeId}`, {
    headers: getAuthHeaders(),
  })
  return res.data
}

// --- Likes ---
export async function likeComment(commentId: number) {
  return axios.post(`${API_BASE_URL}/comments/${commentId}/likes`, {}, {
    headers: getAuthHeaders(),
  })
}

export async function unlikeComment(commentId: number, likeId: number) {
  return axios.delete(`${API_BASE_URL}/comments/${commentId}/likes/${likeId}`, {
    headers: getAuthHeaders(),
  })
}
