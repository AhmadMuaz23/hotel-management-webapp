import { useState } from 'react';
import { UserIcon } from '@heroicons/react/24/solid';

/**
 * SmartAvatar - A robust avatar component with automatic fallback to initials.
 * Handles broken URLs (Railway ephemeral storage issues) gracefully.
 */
const SmartAvatar = ({ src, name, size = '10', className = '' }) => {
  const [error, setError] = useState(!src);

  // Get initials from name
  const initials = name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  // Sizing map for consistency
  const sizeClasses = {
    '8': 'w-8 h-8 text-[10px]',
    '10': 'w-10 h-10 text-xs',
    '11': 'w-11 h-11 text-sm',
    '12': 'w-12 h-12 text-base',
    '14': 'w-14 h-14 text-lg',
    '16': 'w-16 h-16 text-xl',
    '20': 'w-20 h-20 text-2xl',
  };

  const selectedSize = sizeClasses[size] || 'w-10 h-10';

  if (!src || error) {
    return (
      <div 
        className={`${selectedSize} rounded-full bg-brand-500 flex items-center justify-center text-white font-black shadow-inner border-2 border-white/20 ${className}`}
        title={name}
      >
        <span className="tracking-tighter">{initials}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setError(true)}
      className={`${selectedSize} rounded-full object-cover shadow-md ${className}`}
    />
  );
};

export default SmartAvatar;
