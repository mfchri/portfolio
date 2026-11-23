import React from 'react';

interface BlinkingCursorProps {
  visible: boolean;
  className?: string;
}

export const BlinkingCursor: React.FC<BlinkingCursorProps> = ({ visible, className = '' }) => {
  if (!visible) return null;
  return (
    <span
      className={`inline-block w-[3px] sm:w-[4px] h-[0.85em] bg-primary ml-1 align-baseline animate-cursor-blink ${className}`}
      aria-hidden="true"
    />
  );
};

interface TypewriterGreetingProps {
  fullText: string;
  typedText: string;
  showCursor: boolean;
  isComplete?: boolean;
  className?: string;
}

export const TypewriterGreeting: React.FC<TypewriterGreetingProps> = ({
  fullText,
  typedText,
  showCursor,
  isComplete = false,
  className = '',
}) => {
  // If typing completed, render directly in flow without absolute positioning
  if (isComplete) {
    return (
      <span className={`inline-block ${className}`} aria-label={fullText}>
        {typedText || fullText}
        <BlinkingCursor visible={showCursor} />
      </span>
    );
  }

  return (
    <div className="relative inline-block" aria-label={fullText}>
      {/* Ghost text for zero layout shift (CLS = 0) */}
      <span className="invisible select-none opacity-0" aria-hidden="true">
        {fullText}
      </span>

      {/* Actual typed visible text */}
      <span className={`absolute top-0 left-0 ${className}`} aria-hidden="true">
        {typedText}
        <BlinkingCursor visible={showCursor} />
      </span>
    </div>
  );
};

interface TypewriterBioProps {
  fullPrefix: string;
  typedPrefix: string;
  currentRole: string;
  longestRole?: string;
  fullSuffix: string;
  typedSuffix: string;
  showCursor: boolean;
  fullAriaLabel: string;
  isComplete?: boolean;
  hasRoleRotation?: boolean;
  className?: string;
}

export const TypewriterBio: React.FC<TypewriterBioProps> = ({
  fullPrefix,
  typedPrefix,
  currentRole,
  longestRole,
  fullSuffix,
  typedSuffix,
  showCursor,
  fullAriaLabel,
  isComplete = false,
  hasRoleRotation = false,
  className = '',
}) => {
  const ghostRole = longestRole || currentRole;

  // When animation is complete and no roles need rotation, render directly in flow
  if (isComplete && !hasRoleRotation) {
    return (
      <div className={className} aria-label={fullAriaLabel}>
        <span>{fullPrefix}</span>
        {currentRole && <span className="text-primary font-medium">{currentRole}</span>}
        {fullSuffix && <span>{fullSuffix}</span>}
        <BlinkingCursor visible={showCursor} />
      </div>
    );
  }

  return (
    <div className="relative" aria-label={fullAriaLabel}>
      {/* Ghost layout-reserve text to guarantee zero layout shift */}
      <div className="invisible select-none opacity-0" aria-hidden="true">
        <span>{fullPrefix}</span>
        {ghostRole && <span className="font-medium">{ghostRole}</span>}
        {fullSuffix && <span>{fullSuffix}</span>}
      </div>

      {/* Active visible typed content */}
      <div className={`absolute top-0 left-0 w-full ${className}`} aria-hidden="true">
        <span>{typedPrefix}</span>
        {currentRole && <span className="text-primary font-medium">{currentRole}</span>}
        <span>{typedSuffix}</span>
        <BlinkingCursor visible={showCursor} />
      </div>
    </div>
  );
};
