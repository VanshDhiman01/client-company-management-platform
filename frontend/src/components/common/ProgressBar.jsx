import React from 'react';

export const ProgressBar = ({
  progress,
  size = 'md',
  showLabel = true,
  labelPosition = 'right',
  color = 'auto',
  className = ''
}) => {
  const safeProgress = Math.min(100, Math.max(0, Math.round(progress)));

  const getColorClass = () => {
    if (color !== 'auto') {
      switch (color) {
        case 'emerald':
          return 'bg-emerald-500';
        case 'amber':
          return 'bg-amber-500';
        case 'indigo':
          return 'bg-indigo-600';
        case 'blue':
        default:
          return 'bg-blue-600';
      }
    }
    if (safeProgress === 100) return 'bg-emerald-500';
    if (safeProgress >= 60) return 'bg-blue-600';
    if (safeProgress >= 30) return 'bg-indigo-500';
    return 'bg-amber-500';
  };

  const getHeightClass = () => {
    switch (size) {
      case 'sm':
        return 'h-1.5';
      case 'lg':
        return 'h-3';
      case 'xl':
        return 'h-4';
      case 'md':
      default:
        return 'h-2';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && labelPosition === 'top' && (
        <div className="flex justify-between items-center mb-1 text-xs font-semibold text-slate-700">
          <span>Overall Progress</span>
          <span className="tabular-nums">{safeProgress}%</span>
        </div>
      )}
      <div className="flex items-center gap-3">
        <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${getHeightClass()}`}>
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${getColorClass()}`}
            style={{ width: `${safeProgress}%` }}
          />
        </div>
        {showLabel && labelPosition === 'right' && (
          <span className="text-xs font-semibold text-slate-700 w-9 text-right tabular-nums">
            {safeProgress}%
          </span>
        )}
      </div>
    </div>
  );
};

export const CircularProgress = ({ progress, size = 80, strokeWidth = 8, showText = true }) => {
  const safeProgress = Math.min(100, Math.max(0, Math.round(progress)));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (safeProgress / 100) * circumference;

  const getStrokeColor = () => {
    if (safeProgress === 100) return '#10b981'; // emerald-500
    if (safeProgress >= 60) return '#2563eb'; // blue-600
    if (safeProgress >= 30) return '#6366f1'; // indigo-500
    return '#f59e0b'; // amber-500
  };

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getStrokeColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {showText && (
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-sm font-bold text-slate-900 tabular-nums leading-none">
            {safeProgress}%
          </span>
        </div>
      )}
    </div>
  );
};
