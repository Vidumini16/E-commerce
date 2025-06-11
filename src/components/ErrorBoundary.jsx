import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    // Log error if needed
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-100 text-red-700 p-4 rounded">
          <h2>Something went wrong.</h2>
          <pre className="text-xs">{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
