import { useState, useEffect, useRef } from 'react';
import { ANIMATION_CONFIG } from '../config/animation';

export interface UseTypewriterProps {
  greetingText: string;
  bioText: string;
  roles?: string[];
  enabled?: boolean;
  speed?: 'slow' | 'normal' | 'fast';
  isReady?: boolean;
}

export interface UseTypewriterReturn {
  typedGreeting: string;
  typedBioPrefix: string;
  typedRole: string;
  typedBioSuffix: string;
  fullBioPrefix: string;
  fullBioSuffix: string;
  isGreetingComplete: boolean;
  isBioComplete: boolean;
  isInitialComplete: boolean;
  showGreetingCursor: boolean;
  showBioCursor: boolean;
  hasRoleRotation: boolean;
}

export function useTypewriter({
  greetingText = 'Hello',
  bioText = '',
  roles = [],
  enabled = true,
  speed = 'normal',
  isReady = true,
}: UseTypewriterProps): UseTypewriterReturn {
  const multiplier = ANIMATION_CONFIG.speedMultipliers[speed] || 1.0;
  const greetingSpeed = Math.round(ANIMATION_CONFIG.typewriter.charSpeedGreeting * multiplier);
  const bioSpeed = Math.round(ANIMATION_CONFIG.typewriter.charSpeedBio * multiplier);
  const roleTypeSpeed = Math.round(ANIMATION_CONFIG.typewriter.roleTypeSpeed * multiplier);
  const roleDeleteSpeed = Math.round(ANIMATION_CONFIG.typewriter.roleDeleteSpeed * multiplier);
  const rolePauseTime = ANIMATION_CONFIG.typewriter.rolePauseTime;
  const cursorHideAfter = ANIMATION_CONFIG.typewriter.cursorHideAfter;
  const initialDelay = ANIMATION_CONFIG.typewriter.initialDelay;

  const validRoles = Array.isArray(roles)
    ? roles.filter((r) => typeof r === 'string' && r.trim().length > 0)
    : [];
  const hasRoleRotation = enabled && validRoles.length > 1;

  // Split bioText into prefix and suffix if role rotation is active
  let fullBioPrefix = bioText;
  let fullBioSuffix = '';
  if (hasRoleRotation) {
    const firstRole = validRoles[0];
    if (bioText.includes(firstRole)) {
      const parts = bioText.split(firstRole);
      fullBioPrefix = parts[0];
      fullBioSuffix = parts.slice(1).join(firstRole);
    } else {
      fullBioPrefix = bioText.endsWith(' ') ? bioText : `${bioText} `;
      fullBioSuffix = '';
    }
  }

  // State initialization
  const [typedGreeting, setTypedGreeting] = useState(() => (enabled ? '' : greetingText));
  const [typedBioPrefix, setTypedBioPrefix] = useState(() => (enabled ? '' : fullBioPrefix));
  const [typedRole, setTypedRole] = useState(() =>
    enabled ? '' : hasRoleRotation ? validRoles[0] || '' : ''
  );
  const [typedBioSuffix, setTypedBioSuffix] = useState(() => (enabled ? '' : fullBioSuffix));

  const [isGreetingComplete, setIsGreetingComplete] = useState(() => !enabled);
  const [isBioComplete, setIsBioComplete] = useState(() => !enabled);
  const [isInitialComplete, setIsInitialComplete] = useState(() => !enabled);

  const [showGreetingCursor, setShowGreetingCursor] = useState(() => enabled);
  const [showBioCursor, setShowBioCursor] = useState(false);

  // Track completion across re-renders
  const isDoneRef = useRef(!enabled);

  // Stable key for roles to avoid re-triggering effects on array reference changes
  const rolesKey = validRoles.join('::');

  useEffect(() => {
    // If animations are disabled, immediately show full content
    if (!enabled) {
      isDoneRef.current = true;
      setTypedGreeting(greetingText);
      setTypedBioPrefix(fullBioPrefix);
      setTypedRole(hasRoleRotation ? validRoles[0] || '' : '');
      setTypedBioSuffix(fullBioSuffix);
      setIsGreetingComplete(true);
      setIsBioComplete(true);
      setIsInitialComplete(true);
      setShowGreetingCursor(false);
      setShowBioCursor(false);
      return;
    }

    // Wait until content has loaded from API
    if (!isReady) return;

    // If the sequence already finished on this page load, display full text
    if (isDoneRef.current) {
      setTypedGreeting(greetingText);
      setTypedBioPrefix(fullBioPrefix);
      setTypedRole(hasRoleRotation ? validRoles[0] || '' : '');
      setTypedBioSuffix(fullBioSuffix);
      setIsGreetingComplete(true);
      setIsBioComplete(true);
      setIsInitialComplete(true);
      return;
    }

    const timers: number[] = [];
    const addTimeout = (fn: () => void, ms: number): number => {
      const id = window.setTimeout(fn, ms);
      timers.push(id);
      return id;
    };

    // Emergency safety timeout: guarantees content is NEVER permanently blank
    const maxSafetyTime = Math.max(
      3800,
      initialDelay +
        greetingSpeed * (greetingText.length + 1) +
        bioSpeed * (bioText.length + 1) +
        1000
    );
    addTimeout(() => {
      if (!isDoneRef.current) {
        isDoneRef.current = true;
        setTypedGreeting(greetingText);
        setTypedBioPrefix(fullBioPrefix);
        setTypedRole(hasRoleRotation ? validRoles[0] || '' : '');
        setTypedBioSuffix(fullBioSuffix);
        setIsGreetingComplete(true);
        setIsBioComplete(true);
        setIsInitialComplete(true);
        setShowGreetingCursor(false);
      }
    }, maxSafetyTime);

    // ==========================================
    // Phase 1: Type Greeting ("Hello")
    // ==========================================
    setShowGreetingCursor(true);

    addTimeout(() => {
      let gIdx = 0;
      const typeGreeting = () => {
        gIdx++;
        setTypedGreeting(greetingText.slice(0, gIdx));
        if (gIdx < greetingText.length) {
          addTimeout(typeGreeting, greetingSpeed);
        } else {
          // Greeting finished
          setIsGreetingComplete(true);
          setShowGreetingCursor(false);

          // Brief pause before typing Bio
          addTimeout(() => {
            setShowBioCursor(true);
            startBioTyping();
          }, 180);
        }
      };

      addTimeout(typeGreeting, greetingSpeed);
    }, initialDelay);

    // ==========================================
    // Phase 2: Type Bio Statement
    // ==========================================
    const startBioTyping = () => {
      if (hasRoleRotation) {
        // 2a. Type prefix
        let pIdx = 0;
        const typePrefix = () => {
          pIdx++;
          setTypedBioPrefix(fullBioPrefix.slice(0, pIdx));
          if (pIdx < fullBioPrefix.length) {
            addTimeout(typePrefix, bioSpeed);
          } else {
            typeFirstRole();
          }
        };

        if (fullBioPrefix.length > 0) {
          addTimeout(typePrefix, bioSpeed);
        } else {
          typeFirstRole();
        }
      } else {
        // 2b. Standard single-line bio without role rotation
        let bIdx = 0;
        const typeBio = () => {
          bIdx++;
          setTypedBioPrefix(bioText.slice(0, bIdx));
          if (bIdx < bioText.length) {
            addTimeout(typeBio, bioSpeed);
          } else {
            finishInitialSequence();
          }
        };
        addTimeout(typeBio, bioSpeed);
      }
    };

    // Type the first role word
    const typeFirstRole = () => {
      const firstRole = validRoles[0] || '';
      let rIdx = 0;
      const typeRoleChar = () => {
        rIdx++;
        setTypedRole(firstRole.slice(0, rIdx));
        if (rIdx < firstRole.length) {
          addTimeout(typeRoleChar, roleTypeSpeed);
        } else {
          // First role complete -> type suffix
          if (fullBioSuffix.length > 0) {
            let sIdx = 0;
            const typeSuffix = () => {
              sIdx++;
              setTypedBioSuffix(fullBioSuffix.slice(0, sIdx));
              if (sIdx < fullBioSuffix.length) {
                addTimeout(typeSuffix, bioSpeed);
              } else {
                finishInitialSequence();
                scheduleNextRole(0);
              }
            };
            addTimeout(typeSuffix, bioSpeed);
          } else {
            finishInitialSequence();
            scheduleNextRole(0);
          }
        }
      };
      addTimeout(typeRoleChar, roleTypeSpeed);
    };

    // Schedule deletion and next role word in rotation loop
    const scheduleNextRole = (currentIdx: number) => {
      addTimeout(() => {
        const currentRole = validRoles[currentIdx] || '';
        let dIdx = currentRole.length;
        const deleteChar = () => {
          dIdx--;
          setTypedRole(currentRole.slice(0, Math.max(0, dIdx)));
          if (dIdx > 0) {
            addTimeout(deleteChar, roleDeleteSpeed);
          } else {
            const nextIdx = (currentIdx + 1) % validRoles.length;
            addTimeout(() => {
              typeNextRoleWord(nextIdx);
            }, 250);
          }
        };
        addTimeout(deleteChar, roleDeleteSpeed);
      }, rolePauseTime);
    };

    const typeNextRoleWord = (roleIdx: number) => {
      const nextRole = validRoles[roleIdx] || '';
      let rIdx = 0;
      const typeRoleChar = () => {
        rIdx++;
        setTypedRole(nextRole.slice(0, rIdx));
        if (rIdx < nextRole.length) {
          addTimeout(typeRoleChar, roleTypeSpeed);
        } else {
          scheduleNextRole(roleIdx);
        }
      };
      addTimeout(typeRoleChar, roleTypeSpeed);
    };

    const finishInitialSequence = () => {
      isDoneRef.current = true;
      setIsBioComplete(true);
      setIsInitialComplete(true);

      if (cursorHideAfter > 0 && !hasRoleRotation) {
        addTimeout(() => {
          setShowBioCursor(false);
        }, cursorHideAfter);
      }
    };

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [
    enabled,
    isReady,
    greetingText,
    bioText,
    rolesKey,
    speed,
    greetingSpeed,
    bioSpeed,
    roleTypeSpeed,
    roleDeleteSpeed,
    rolePauseTime,
    cursorHideAfter,
    initialDelay,
    hasRoleRotation,
    fullBioPrefix,
    fullBioSuffix,
  ]);

  return {
    typedGreeting,
    typedBioPrefix,
    typedRole,
    typedBioSuffix,
    fullBioPrefix,
    fullBioSuffix,
    isGreetingComplete,
    isBioComplete,
    isInitialComplete,
    showGreetingCursor,
    showBioCursor,
    hasRoleRotation,
  };
}
