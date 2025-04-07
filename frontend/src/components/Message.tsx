interface MessageProps {
  variant?: 'success' | 'danger' | 'info' | 'warning';
  children: React.ReactNode;
}

const Message = ({ variant = 'info', children }: MessageProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-100 text-green-700 border-green-400';
      case 'danger':
        return 'bg-red-100 text-red-700 border-red-400';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700 border-yellow-400';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-400';
    }
  };

  return (
    <div
      className={`p-4 mb-4 rounded-lg border ${getVariantStyles()}`}
      role="alert"
    >
      {children}
    </div>
  );
};

export default Message; 