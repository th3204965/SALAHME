"use client";

import type { ReactNode } from "react";
import { Component } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 flex items-center justify-center bg-background text-foreground">
                    <div className="text-center max-w-md px-6">
                        <div className="text-6xl mb-6">🕌</div>
                        <h1 className="text-2xl font-bold mb-3 tracking-wide">
                            Something went wrong
                        </h1>
                        <p className="text-slate-400 mb-8 text-sm leading-relaxed">
                            Prayer times could not be loaded. Please refresh to try again.
                        </p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="px-8 py-3 bg-teal-500/20 border border-teal-500/30 text-teal-400 text-sm font-bold uppercase tracking-[0.2em] rounded-full hover:bg-teal-500/30 transition-colors"
                        >
                            Refresh
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
