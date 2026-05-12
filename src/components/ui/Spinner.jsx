export default function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`
          ${sizes[size]}
          border-2 border-surface-lighter
          border-t-primary
          rounded-full animate-spin
        `}
      />
    </div>
  );
}
