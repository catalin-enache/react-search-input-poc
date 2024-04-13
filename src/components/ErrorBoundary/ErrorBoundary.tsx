import { Component, ReactNode, ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  fallback?: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary<
  P extends ErrorBoundaryProps
> extends Component<P, ErrorBoundaryState> {
  constructor(props: Readonly<P>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <p>Something went wrong</p>;
    }
    return this.props.children;
  }
}
