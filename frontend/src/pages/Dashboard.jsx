import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [postContent, setPostContent] = useState('')
  const [posts, setPosts] = useState([])
  const [postError, setPostError] = useState('')
  const [postSuccess, setPostSuccess] = useState('')
  const [posting, setPosting] = useState(false)
  const [editingPostId, setEditingPostId] = useState(null)
  const [editingContent, setEditingContent] = useState('')
  const [updating, setUpdating] = useState(false)

  // Check if user is logged in and fetch stored posts
  useEffect(() => {
    axios.get('/api/auth/me', { withCredentials: true })
      .then(res => {
        setUser(res.data.user)
        return axios.get('/api/posts', { withCredentials: true })
      })
      .then(res => {
        if (res?.data?.posts) {
          setPosts(res.data.posts)
        }
      })
      .catch(() => navigate('/login'))
  }, [navigate])

  const handleCreatePost = async (e) => {
    e.preventDefault()
    if (!postContent.trim()) return
    setPosting(true)
    setPostError('')
    setPostSuccess('')
    try {
      const res = await axios.post(
        '/api/posts/create',
        { content: postContent },
        { withCredentials: true }
      )
      setPosts(prev => [res.data.post, ...prev])
      setPostContent('')
      setPostSuccess('Post created and saved successfully!')
      setTimeout(() => setPostSuccess(''), 3000)
    } catch (err) {
      setPostError(err.response?.data?.message || 'Failed to create post')
    } finally {
      setPosting(false)
    }
  }

  const handleStartEdit = (post) => {
    setEditingPostId(post._id)
    setEditingContent(post.content)
  }

  const handleCancelEdit = () => {
    setEditingPostId(null)
    setEditingContent('')
  }

  const handleUpdatePost = async (postId) => {
    if (!editingContent.trim()) return
    setUpdating(true)
    try {
      const res = await axios.put(
        `/api/posts/${postId}`,
        { content: editingContent },
        { withCredentials: true }
      )
      setPosts(prev => prev.map(p => (p._id === postId ? res.data.post : p)))
      setEditingPostId(null)
      setEditingContent('')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update post')
    } finally {
      setUpdating(false)
    }
  }

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return
    try {
      await axios.delete(`/api/posts/${postId}`, { withCredentials: true })
      setPosts(prev => prev.filter(p => p._id !== postId))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete post')
    }
  }

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true })
    } catch (_) {}
    navigate('/login')
  }

  if (!user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <span className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }}></span>
      </div>
    )
  }

  const initials = user.username?.slice(0, 2).toUpperCase() || 'U'

  return (
    <div className="dashboard-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="navbar-logo-icon">🔐</div>
          <span className="navbar-brand-name">EchoVault</span>
        </div>
        <div className="navbar-actions">
          <div className="navbar-user">
            <div className="navbar-avatar">{initials}</div>
            <span className="navbar-username">{user.username}</span>
          </div>
          <button id="logout-btn" className="btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Hero */}
        <div className="dashboard-hero">
          <p className="dashboard-greeting">Dashboard</p>
          <h1 className="dashboard-title">
            Hello, <span>{user.username}</span> 👋
          </h1>
          <p className="dashboard-desc">
            You're successfully authenticated. This page is protected — only logged-in users can see it.
          </p>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-value">{posts.length}</div>
            <div className="stat-label">Posts Created</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-value">Active</div>
            <div className="stat-label">Session Status</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔑</div>
            <div className="stat-value">JWT</div>
            <div className="stat-label">Auth Method</div>
          </div>
        </div>

        {/* Create Post */}
        <div className="post-card">
          <div className="post-card-header">
            <h2 className="post-card-title">Create a Post</h2>
            <p className="post-card-subtitle">This calls a protected API route using your auth cookie</p>
          </div>

          {postError && <div className="alert alert-error">⚠️ {postError}</div>}
          {postSuccess && <div className="alert alert-success">✅ {postSuccess}</div>}

          <form onSubmit={handleCreatePost}>
            <div className="form-group">
              <textarea
                id="post-content"
                className="form-textarea"
                placeholder="What's on your mind?"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                required
              />
            </div>
            <div className="post-form-footer">
              <button id="post-submit" className="btn-post" type="submit" disabled={posting}>
                {posting ? <span className="spinner"></span> : <>✨ Publish Post</>}
              </button>
            </div>
          </form>
        </div>

        {/* Posts List */}
        {posts.length > 0 && (
          <div className="posts-section">
            <p className="posts-section-title">Your Posts ({posts.length})</p>
            {posts.map((post, i) => (
              <div key={post._id || i} className="post-item">
                {editingPostId === post._id ? (
                  <div className="post-edit-container">
                    <textarea
                      className="form-textarea"
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      rows={3}
                      autoFocus
                    />
                    <div className="post-edit-actions">
                      <button
                        type="button"
                        className="btn-sm-cancel"
                        onClick={handleCancelEdit}
                        disabled={updating}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn-sm-save"
                        onClick={() => handleUpdatePost(post._id)}
                        disabled={updating}
                      >
                        {updating ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="post-item-content">{post.content}</p>
                    <div className="post-footer">
                      <span className="post-item-meta">
                        {post.createdAt
                          ? new Date(post.createdAt).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                            }) +
                            ' at ' +
                            new Date(post.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Just now'}
                      </span>
                      <div className="post-actions">
                        <button
                          type="button"
                          className="btn-icon btn-icon-edit"
                          onClick={() => handleStartEdit(post)}
                          title="Edit post"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          type="button"
                          className="btn-icon btn-icon-delete"
                          onClick={() => handleDeletePost(post._id)}
                          title="Delete post"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
