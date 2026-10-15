import { memo, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';

const SCALLOP_COUNT = 10;

// Every size below is `calc(var(--u) * factor)`, so the whole badge scales
// smoothly with viewport width instead of jumping between fixed breakpoints.
const badgeStyle = { '--u': 'clamp(52px, 6.5vw, 88px)' } as CSSProperties;

const u = (factor: number) => `calc(var(--u) * ${factor})`;

function BestDealsBadge({ className = '' }: { className?: string }) {
  const scallops = Array.from({ length: SCALLOP_COUNT });

  return (
    <Link
      to="/products"
      aria-label="Best price deals - browse products"
      className={`group block select-none ${className}`}
      style={badgeStyle}
    >
      <div className="relative flex flex-col items-center">
        {/* Ribbon tails */}
        <div
          className="absolute left-1/2 -translate-x-1/2 flex"
          style={{ top: u(0.722) }}
        >
          <div
            className="-mr-1 rotate-[-10deg] bg-textMain"
            style={{ height: u(0.556), width: u(0.389), clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 72%, 0 100%)' }}
          />
          <div
            className="-ml-1 rotate-[10deg] bg-textMain"
            style={{ height: u(0.556), width: u(0.389), clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 72%, 0 100%)' }}
          />
        </div>

        {/* Scalloped seal */}
        <div
          className="relative transition-transform duration-300 group-hover:scale-105"
          style={{ height: u(1), width: u(1), filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.35))' }}
        >
          {/* Petal bumps - centers sit on the main circle's edge and are sized to touch their
              neighbours, so each one bulges past the main circle and creates a scalloped edge. */}
          {scallops.map((_, i) => {
            const angle = (360 / SCALLOP_COUNT) * i;
            return (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 rounded-full bg-red-600"
                style={{
                  height: u(0.306),
                  width: u(0.306),
                  transform: `rotate(${angle}deg) translate(0, ${u(-0.5)}) rotate(${-angle}deg)`,
                  marginLeft: u(-0.153),
                  marginTop: u(-0.153),
                }}
              />
            );
          })}

          <div className="absolute inset-0 m-auto flex h-full w-full items-center justify-center rounded-full bg-red-600">
            <div className="flex h-[80%] w-[80%] flex-col items-center justify-center rounded-full border-2 border-dashed border-white/80 text-center leading-none">
              <span className="font-black uppercase tracking-wide text-white" style={{ fontSize: u(0.111) }}>Best</span>
              <span className="font-black uppercase tracking-wide text-white" style={{ fontSize: u(0.125) }}>Deals</span>
              <span className="font-black uppercase tracking-wide text-white" style={{ fontSize: u(0.111) }}>Here</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default memo(BestDealsBadge);
