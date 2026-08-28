import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: '#f44336', background: '#ffebee', fontFamily: 'monospace', whiteSpace: 'pre-wrap', minHeight: '100vh' }}>
          <h2>Runtime Error Caught:</h2>
          <pre style={{ background: '#fafafa', padding: 10, border: '1px solid #ffcdd2', borderRadius: 4, overflow: 'auto' }}>
            {this.state.error ? this.state.error.toString() : 'Unknown error'}
          </pre>
          <h3>Stack Trace:</h3>
          <pre style={{ background: '#fafafa', padding: 10, border: '1px solid #ffcdd2', borderRadius: 4, overflow: 'auto', fontSize: '11px' }}>
            {this.state.error ? this.state.error.stack : 'No stack trace available'}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

console.log("main.tsx: script loaded");
const rootEl = document.getElementById('root');
console.log("main.tsx: root element found:", rootEl);
if (rootEl) {
  rootEl.style.border = '5px solid yellow'; // Add a yellow border to root to see if it's visible
}

ReactDOM.createRoot(rootEl!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)

