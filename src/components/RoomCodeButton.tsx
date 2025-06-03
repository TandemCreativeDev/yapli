interface RoomCodeButtonProps {
  code: string;
  onClick: (e: React.MouseEvent) => void;
  fullWidth?: boolean;
}

export default function RoomCodeButton({ code, onClick, fullWidth = false }: RoomCodeButtonProps) {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`px-2 py-1 bg-gray-300 text-gray-700 rounded text-base font-mono hover:bg-gray-200 cursor-pointer transition-colors ${
          fullWidth ? 'w-full text-center' : ''
        }`}
      >
        {code}
      </button>
      <div className={`absolute bottom-full mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap ${
        fullWidth ? 'left-4' : 'left-1/2 transform -translate-x-1/2'
      }`}>
        Copy room code to clipboard
      </div>
    </div>
  );
}