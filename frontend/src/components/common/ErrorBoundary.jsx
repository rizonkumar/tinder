import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { EmptyState } from "../ui/EmptyState";

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
          <div className="w-full max-w-md rounded-xl border border-border bg-surface p-2 shadow-card">
            <EmptyState
              icon={AlertTriangle}
              title="Something went wrong"
              description="This screen failed to load. Reloading usually fixes it."
              actions={[
                {
                  label: "Reload",
                  onClick: this.handleReset,
                  variant: "primary",
                  icon: RefreshCw,
                },
              ]}
            />
            {import.meta.env.DEV && this.state.error && (
              <details className="m-3 max-h-48 overflow-y-auto rounded-md border border-border bg-background-secondary p-3 text-left">
                <summary className="cursor-pointer text-xs font-medium text-danger">Error details</summary>
                <pre className="mt-2 whitespace-pre-wrap font-mono text-xs leading-5 text-foreground-secondary">
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
