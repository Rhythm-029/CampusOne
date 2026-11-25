import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CampusOne Runtime Error Caught by Boundary:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('campusone_jwt');
      localStorage.removeItem('campusone_user');
      localStorage.removeItem('campusone_role');
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: '#FBFBF9',
          color: '#111C2D',
          padding: '24px',
          textAlign: 'center',
        }}>
          <div style={{
            background: 'white',
            border: '1px solid #EBEAE5',
            borderRadius: '20px',
            padding: '36px',
            maxWidth: '520px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
          }}>
            <h2 style={{ margin: '0 0 12px 0', fontSize: '22px', fontWeight: 700, color: '#111C2D' }}>
              CampusOne Portal Recovered
            </h2>
            <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#666', lineHeight: 1.5 }}>
              A session refresh was detected. Click below to reload the clean interface.
            </p>
            <button
              onClick={this.handleReset}
              style={{
                background: '#1E3F30',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Reload CampusOne
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

