import * as React from 'react';
import { Maximize2 } from 'lucide-react';

const images = [
  {
    url: "https://images.unsplash.com/photo-1517747614396-d21a78b850e8?q=80&w=2076&auto=format&fit=crop",
    title: "Ground Level View",
    category: "Arena",
    span: "col-span-12 md:col-span-8 row-span-2"
  },
  {
    url: "https://images.unsplash.com/photo-1570498839593-e565b39455fc?q=80&w=2076&auto=format&fit=crop",
    title: "Match Quality",
    category: "Equipment",
    span: "col-span-12 md:col-span-4 row-span-1"
  },
  {
    url: "https://images.unsplash.com/photo-1647118868186-70d38e10b0dc?q=80&w=2076&auto=format&fit=crop",
    title: "Night Sessions",
    category: "Lights",
    span: "col-span-12 md:col-span-4 row-span-1"
  }
];

export const Gallery = () => {
  return (
    <section id="arena" className="py-32 bg-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-lime-400">The Arena</h2>
          <h3 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white uppercase leading-none">
            CAPTURED IN <span className="text-lime-400">ACTION</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-4 md:gap-6 h-auto md:h-[700px]">
          {images.map((img, idx) => (
            <div 
              key={idx} 
              className={`${img.span} relative group overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-slate-800 shadow-2xl h-[300px] md:h-auto`}
            >
              <img 
                src={img.url} 
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-lime-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{img.category}</span>
                <div className="flex items-center justify-between gap-4">
                  <h4 className="text-3xl font-black italic text-white tracking-tighter uppercase">{img.title}</h4>
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity scale-75 group-hover:scale-100 duration-500">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
