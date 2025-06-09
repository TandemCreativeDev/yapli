import { LinkIcon } from "@heroicons/react/24/outline";

interface CopyUrlButtonProps {
  onClick: (e: React.MouseEvent) => void;
  roomTitle: string;
  fullWidth?: boolean;
  showText?: boolean;
  className?: string;
}

export default function CopyUrlButton({ 
  onClick, 
  roomTitle, 
  fullWidth = false, 
  showText = false,
  className = ""
}: CopyUrlButtonProps) {
  return (
    <div className={`relative group ${className}`}>
      <button
        onClick={onClick}
        className={`p-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 cursor-pointer transition-colors ${
          fullWidth ? 'w-full' : ''
        } ${showText ? 'flex items-center justify-center text-base' : ''}`}
        aria-label={`Copy URL for ${roomTitle} chatroom`}
      >
        <LinkIcon className="w-4 h-4" />
        {showText && <span className="ml-2">Copy URL</span>}
      </button>
      <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        Copy full URL to clipboard
      </div>
    </div>
  );
}