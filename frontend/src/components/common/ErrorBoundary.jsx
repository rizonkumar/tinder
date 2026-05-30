import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import FallbackState from "./FallbackState";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an exception:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-red-50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white/80 p-8 shadow-2xl backdrop-blur-md border border-pink-100 text-center">
            <FallbackState
              icon={AlertTriangle}
              title="Oops! Something went wrong"
              description="A critical error occurred while rendering this view. Please try reloading the application."
              actions={[
                {
                  label: "Reload Application",
                  onClick: this.handleReset,
                  variant: "primary",
                  icon: RefreshCw,
                },
              ]}
            />
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-left bg-gray-50 p-4 rounded-2xl border border-gray-100 max-h-48 overflow-y-auto">
                <summary className="text-xs font-black uppercase tracking-wider text-red-500 cursor-pointer select-none">
                  Error Details (Dev Only)
                </summary>
                <pre className="mt-2 text-[10px] text-gray-600 font-mono whitespace-pre-wrap leading-relaxed select-text">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
