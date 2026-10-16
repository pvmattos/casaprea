import React from 'react';
import {
  Waves,
  Sparkles,
  Flame,
  Trees,
  Wind,
  Moon,
  Droplets,
  Utensils,
  Coffee,
  Wifi,
  Tv,
  KeyRound,
  Heart,
  ShieldCheck,
  Clock,
  Users,
} from 'lucide-react';
import { PROPERTY_CONFIG, VERIFIED_AMENITIES } from '../config/property';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Waves,
  Sparkles,
  Flame,
  Trees,
  Wind,
  Moon,
  Droplets,
  Utensils,
  Coffee,
  Wifi,
  Tv,
  KeyRound,
  Heart,
  ShieldCheck,
};

export const AmenitiesSection: React.FC = () => {
  const categories = Array.from(new Set(VERIFIED_AMENITIES.map((a) => a.category)));

  return (
    <section
      aria-labelledby="amenities-heading"
      className="py-20 sm:py-28 lg:py-32 bg-[#EFE9DC] text-[#1C1917] border-t border-[#DFD6C3]"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-14 sm:mb-20">
          <div className="lg:col-span-7">
            <p className="text-xs uppercase tracking-[0.22em] text-[#8C5A32] font-semibold mb-3">
              Comodidades & Estrutura
            </p>
            <h2
              id="amenities-heading"
              className="font-editorial text-3xl sm:text-5xl font-normal leading-[1.12] text-[#1C1917]"
            >
              Tudo o que a casa oferece para uma estadia sem preocupações.
            </h2>
          </div>
          <div className="lg:col-span-5 text-sm sm:text-base text-[#44403C] font-light leading-relaxed">
            <p>
              Comodidades verificadas da propriedade, pensadas para estadias prolongadas em família,
              grupos de amigos e praticantes de kitesurf.
            </p>
          </div>
        </div>

        {/* Categorias de Comodidades */}
        <div className="space-y-12">
          {categories.map((category) => {
            const items = VERIFIED_AMENITIES.filter((a) => a.category === category);
            return (
              <div key={category} className="pt-8 border-t border-[#DFD6C3]">
                <h3 className="font-editorial text-2xl font-medium text-[#1C1917] mb-6">
                  {category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {items.map((item) => {
                    const IconComponent = ICON_MAP[item.iconName] || Sparkles;
                    return (
                      <div
                        key={item.id}
                        className="p-5 bg-[#F6F3EB] border border-[#DFD6C3] rounded-sm flex flex-col justify-between"
                      >
                        <div>
                          <div className="w-9 h-9 rounded-xs bg-[#EFE9DC] text-[#8C5A32] flex items-center justify-center mb-4">
                            <IconComponent className="w-4 h-4" aria-hidden="true" />
                          </div>
                          <h4 className="text-sm font-semibold text-[#1C1917] mb-1.5">
                            {item.title}
                          </h4>
                          {item.description && (
                            <p className="text-xs text-[#57534E] leading-relaxed">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Regras da Casa Confirmadas */}
        <div className="mt-16 pt-10 border-t border-[#DFD6C3] bg-[#F6F3EB] p-6 sm:p-10 rounded-sm border">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#8C5A32] font-semibold mb-2">
                Informações de Estadia
              </p>
              <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#1C1917]">
                Regras e horários da casa
              </h3>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#8C5A32] mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <span className="block text-xs uppercase tracking-wider text-[#57534E]">
                    Check-in
                  </span>
                  <span className="text-sm font-medium text-[#1C1917]">
                    {PROPERTY_CONFIG.rules.checkIn}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#8C5A32] mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <span className="block text-xs uppercase tracking-wider text-[#57534E]">
                    Checkout
                  </span>
                  <span className="text-sm font-medium text-[#1C1917]">
                    {PROPERTY_CONFIG.rules.checkOut}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-4 h-4 text-[#8C5A32] mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <span className="block text-xs uppercase tracking-wider text-[#57534E]">
                    Capacidade
                  </span>
                  <span className="text-sm font-medium text-[#1C1917]">
                    {PROPERTY_CONFIG.rules.maxGuests}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Heart className="w-4 h-4 text-[#8C5A32] mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <span className="block text-xs uppercase tracking-wider text-[#57534E]">
                    Pets
                  </span>
                  <span className="text-sm font-medium text-[#1C1917]">
                    {PROPERTY_CONFIG.rules.pets}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
