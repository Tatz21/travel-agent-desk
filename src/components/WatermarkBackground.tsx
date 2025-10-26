import watermark from '@/assets/watermark-logo.png';

const WatermarkBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none opacity-[0.06] overflow-hidden -z-10">
      <div 
        className="absolute w-[200%] h-[200%] -left-1/2 -top-1/2"
        style={{
          backgroundImage: `url(${watermark})`,
          backgroundSize: '250px',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center',
          transform: 'rotate(45deg)',
          transformOrigin: 'center'
        }} 
      />
    </div>
  );
};

export default WatermarkBackground;
