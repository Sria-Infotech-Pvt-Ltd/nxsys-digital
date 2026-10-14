import { Link } from 'react-router-dom';

type PromoOffer = {
  id: string;
  image: string;
  alt: string;
  href: string;
};

const MAIN_OFFER: PromoOffer = {
  id: 'thinkbook-14-g8-ial',
  image: '/Lenovo ThinkBook AI-Ready Business Banner.png',
  alt: 'Lenovo ThinkBook 14 G8 IAL - AI-Ready Business Laptop',
  href: '/product/388',
};

const SIDE_OFFER: PromoOffer = {
  id: 'qvs1260-pro-slim',
  image: '/QVS1260 Slim Business Desktop Banner.png',
  alt: 'Lenovo QVS1260 Pro Slim - Business Desktop',
  href: '/product/389',
};

function PromoOffers() {
  return (
    <section className="bg-white py-4 sm:py-6">
      <div className="container-shell">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Link
            to={MAIN_OFFER.href}
            className="group block overflow-hidden rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-shadow bg-slate-50"
          >
            <img
              src={MAIN_OFFER.image}
              alt={MAIN_OFFER.alt}
              className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              loading="eager"
            />
          </Link>

          <Link
            to={SIDE_OFFER.href}
            className="group block overflow-hidden rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-shadow bg-slate-50"
          >
            <img
              src={SIDE_OFFER.image}
              alt={SIDE_OFFER.alt}
              className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default PromoOffers;
