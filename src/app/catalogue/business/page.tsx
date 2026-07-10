// src/app/catalogue/business/page.tsx

import Navbar from '@/components/Navbar';
import BusinessCatalogue from '@/components/BusinessCatalogue';

export default function BusinessCataloguePage() {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-[#F3F4F6]">
      <Navbar />
      <BusinessCatalogue />
    </div>
  );
}
