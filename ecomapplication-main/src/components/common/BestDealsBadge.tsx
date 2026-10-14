import { memo } from 'react';
import { Link } from 'react-router-dom';

const SCALLOP_COUNT = 10;

function BestDealsBadge({ className = '' }: { className?: string }) {
  const scallops = Array.from({ length: SCALLOP_COUNT });

  return (
    <Link
      to="/products"
      aria-label="Best price deals - browse products"
      className={`group block select-none ${className}`}
    >
      <div className="relative flex flex-col items-center">
        {/* Ribbon tails */}
        <div className="absolute top-[52px] left-1/2 -translate-x-1/2 flex sm:top-[62px]">
          <div
            className="h-10 w-7 -mr-1 rotate-[-10deg] bg-textMain sm:h-12 sm:w-8"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 72%, 0 100%)' }}
          />
          <div
            className="h-10 w-7 -ml-1 rotate-[10deg] bg-textMain sm:h-12 sm:w-8"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 72%, 0 100%)' }}
          />
        </div>

        {/* Scalloped seal */}
        <div
          className="relative h-[72px] w-[72px] transition-transform duration-300 group-hover:scale-105 sm:h-[88px] sm:w-[88px]"
          style={{ filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.35))' }}
        >
          {/* Petal bumps - centers sit on the main circle's edge and are sized to touch their
              neighbours, so each one bulges past the main circle and creates a scalloped edge. */}
          {scallops.map((_, i) => {
            const angle = (360 / SCALLOP_COUNT) * i;
            return (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 h-[22px] w-[22px] rounded-full bg-red-600 sm:h-7 sm:w-7"
                style={{
                  transform: `rotate(${angle}deg) translate(0, -36px) rotate(${-angle}deg)`,
                  marginLeft: '-11px',
                  marginTop: '-11px',
                }}
              />
            );
          })}

          <div className="absolute inset-0 m-auto flex h-full w-full items-center justify-center rounded-full bg-red-600">
            <div className="flex h-[80%] w-[80%] flex-col items-center justify-center rounded-full border-2 border-dashed border-white/80 text-center leading-none">
              <span className="text-[8px] font-black uppercase tracking-wide text-white sm:text-[10px]">Best</span>
              <span className="text-[9px] font-black uppercase tracking-wide text-white sm:text-[11px]">Deals</span>
              <span className="text-[8px] font-black uppercase tracking-wide text-white sm:text-[10px]">Here</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default memo(BestDealsBadge);
