interface WaitingOpenCardBoxProps {
  playersLength: number;
  flippedPlayers: number;
}
export const WaitingOpenCardBox: React.FC<WaitingOpenCardBoxProps> = ({
  playersLength,
  flippedPlayers,
}) => {
  return (
    <div className="text-center mt-8 animate-fade-in">
      <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-6 inline-block min-w-[300px]">
        <i className="pi pi-spin pi-spinner text-3xl text-blue-400 mb-3" />
        <p className="text-lg text-blue-300 font-semibold mb-3">
          รอผู้เล่นคนอื่นเปิดการ์ด...
        </p>

        {/* Player counter */}
        <div className="bg-blue-800/50 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-center gap-2 text-2xl font-bold">
            <span className="text-green-400">{flippedPlayers}</span>
            <span className="text-gray-400">/</span>
            <span className="text-white">{playersLength}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">ผู้เล่นที่เปิดการ์ดแล้ว</p>
        </div>

        {/* Progress indicators */}
        <div className="flex justify-center gap-2">
          {Array.from({ length: playersLength }).map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index < flippedPlayers
                  ? "bg-green-500 scale-110"
                  : "bg-gray-600"
              }`}
            />
          ))}
        </div>

        <p className="text-sm text-gray-400 mt-4">
          เกมจะเริ่มอัตโนมัติเมื่อทุกคนพร้อม
        </p>
      </div>
    </div>
  );
};
