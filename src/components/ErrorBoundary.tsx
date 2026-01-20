"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <div className="max-w-md w-full bg-red-900/20 border border-red-500 rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold text-red-400 mb-2">
              Something went wrong
            </h2>
            <p className="text-red-300 mb-4">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: undefined })}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
