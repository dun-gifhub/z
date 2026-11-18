import React from 'react';

interface AtmosphericBackgroundProps {
  lowGraphics?: boolean;
}

/** Flat table surface behind the game. Colour comes from the theme tokens. */
export const AtmosphericBackground: React.FC<AtmosphericBackgroundProps> = () => (
  <div
    aria-hidden="true"
    className="fixed inset-0 pointer-events-none"
    style={{ backgroundColor: 'var(--surface-page)' }}
  />
);
