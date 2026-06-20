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
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <div className="w-full max-w-md rounded-lg bg-background p-8 shadow-modal border border-border text-center">
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
              <details className="mt-6 text-left bg-background-secondary p-4 rounded-md border border-border max-h-48 overflow-y-auto">
                <summary className="text-xs font-black uppercase tracking-wider text-red-800 cursor-pointer select-none">
                  Error Details (Dev Only)
                </summary>
                <pre className="mt-2 text-[10px] text-foreground-secondary font-mono whitespace-pre-wrap leading-relaxed select-text">
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
