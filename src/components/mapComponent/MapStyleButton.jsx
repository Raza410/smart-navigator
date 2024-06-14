export const MapStyleButton = ({ onClick, src, alt }) => (
  <button onClick={onClick} className="fixed z-[401] shadow-2xl bottom-8 right-4 w-14 h-14 rounded-full hover:scale-95 hover:bg-white transition-all cursor-pointer bg-white backdrop-blur-xl bg-opacity-80 p-1 flex items-center justify-center">
    <img src={src} alt={alt} className="w-full h-full rounded-full object-cover" />
  </button>
);