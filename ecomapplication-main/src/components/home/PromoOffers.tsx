import { memo, useEffect, useState } from 'react';
import thinkBookOffer from '../../assets/offers/Dussehra ThinkBook Business Power.png';
import qvs1260Offer from '../../assets/offers/Dell Pro Slim QVS1260 Business Desktop.png';

type Offer = {
  id: string;
  image: string;
  alt: string;
};

const OFFERS: Offer[] = [
  {
    id: 'thinkbook-14-g8-ial',
    image: thinkBookOffer,
    alt: 'Dussehra Special Offer - Lenovo ThinkBook 14 G8 IAL',
  },
  {
    id: 'qvs1260-pro-slim',
    image: qvs1260Offer,
    alt: 'Dell Pro Slim QVS1260 Business Desktop',
  },
];

const AUTO_ADVANCE_MS = 5000;

function PromoOffers() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (OFFERS.length < 2) return undefined;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % OFFERS.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="relative w-full aspect-[3.5/1] min-h-[120px] sm:min-h-[190px]">
        {OFFERS.map((offer, index) => (
          <div
            key={offer.id}
            aria-hidden={index !== activeIndex}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: index === activeIndex ? 1 : 0 }}
          >
            <img
              src={offer.image}
              alt={offer.alt}
              className="h-full w-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}

        {OFFERS.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-2">
            {OFFERS.map((offer, idx) => (
              <button
                key={offer.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`h-[4px] rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                  }`}
                aria-label={`View offer ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default memo(PromoOffers);
