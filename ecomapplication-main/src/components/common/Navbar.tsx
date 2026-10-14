import TopHeader from './TopHeader';
import CategoryNav from './CategoryNav';
import BestDealsBadge from './BestDealsBadge';
import { authService } from '@/services';

function Navbar() {
  // Use unified authService for user profile
  const profile = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <header className="sticky top-0 z-[90] flex w-full flex-col bg-white/95 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="relative">
        <TopHeader profile={profile} handleLogout={handleLogout} />
        <BestDealsBadge className="absolute right-3 top-full z-[95] -translate-y-1/2 sm:right-8" />
      </div>
      <CategoryNav />
    </header>
  );
}

export default Navbar;
