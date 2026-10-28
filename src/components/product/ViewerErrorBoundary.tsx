import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ViewerErrorBoundaryProps {
  onError: (error: Error) => void
  children: ReactNode
}

interface ViewerErrorBoundaryState {
  failed: boolean
}

/** Catches failures in the 3D viewer (chunk or model load, WebGL errors) so the page falls back to the illustration. */
export class ViewerErrorBoundary extends Component<ViewerErrorBoundaryProps, ViewerErrorBoundaryState> {
  state: ViewerErrorBoundaryState = { failed: false }

  static getDerivedStateFromError(): ViewerErrorBoundaryState {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('3D viewer failed, falling back to the illustration.', error, info.componentStack)
    this.props.onError(error)
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}
