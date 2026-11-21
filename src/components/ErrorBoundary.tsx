import React from 'react';
import { PixelAlertTriangle as AlertTriangle, PixelRotateCcw as RotateCcw } from './PixelIcons';

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    let readable = error.message || 'Unexpected application error.';
    try {
      const parsed = JSON.parse(error.message);
      if (parsed && typeof parsed.error === 'string') {
        readable = `${parsed.operationType?.toUpperCase() || 'DATA'} (${parsed.path || 'root'}): ${parsed.error}`;
      }
    } catch {
      // keep raw message
    }
    return { hasError: true, message: readable };
  }

  componentDidCatch(error: Error) {
    console.error('ErrorBoundary caught:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050608] text-white flex items-center justify-center p-6">
          <div className="max-w-lg w-full glass-surface rounded-md p-8 space-y-5">
            <div className="flex items-center gap-3 text-[#D9FF00]">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h2 className="font-display text-lg font-semibold">TALENT TO IMPACT — Runtime Notice</h2>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed break-words">{this.state.message}</p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, message: '' });
                window.location.reload();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#D9FF00] hover:bg-[#C6EA00] text-xs font-mono font-semibold uppercase tracking-wider text-[#050608] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reload Platform
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
