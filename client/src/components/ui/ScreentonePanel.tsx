import React from 'react';

interface ScreentonePanelProps {
  children: React.ReactNode;
  className?: string;
  hasAccentBorder?: boolean;
  withSpeedLines?: boolean;
}

export const ScreentonePanel: React.FC<ScreentonePanelProps> = ({
  children,
  className = '',
  hasAccentBorder = false,
  withSpeedLines = false,
}) => {
  return (
    <div
      className={`relative bg-manga-surface border ${
        hasAccentBorder ? 'border-manga-accent shadow-panel-accent' : 'border-manga-border shadow-panel'
      } p-6 overflow-hidden ${className}`}
    >
      {/* Halftone texture background */}
      <div className="absolute inset-0 bg-screentone bg-screentone-sm opacity-15 pointer-events-none" />
      {withSpeedLines && (
        <div className="absolute inset-0 bg-speed-lines opacity-10 pointer-events-none" />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
