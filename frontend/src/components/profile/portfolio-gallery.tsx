import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Modal } from "@/components/ui/modal";

export function PortfolioGallery({ images }: { images: string[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {images.map((img, i) => (
          <div
            key={i}
            onClick={() => setSelectedIndex(i)}
            className="group relative aspect-square overflow-hidden rounded-md bg-surface cursor-pointer border border-border"
          >
            <img
              src={img}
              alt={`Portfolio image ${i + 1}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/20" />
          </div>
        ))}
      </div>

      <Modal open={selectedIndex !== null} onClose={() => setSelectedIndex(null)} className="max-w-5xl bg-transparent border-none shadow-none p-0 overflow-hidden">
        {selectedIndex !== null && (
          <div className="relative flex items-center justify-center group h-[80vh]">
            <img
              src={images[selectedIndex]}
              alt={`Portfolio image ${selectedIndex + 1}`}
              className="max-h-full max-w-full object-contain rounded-md"
            />
            
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex((prev) => (prev! === 0 ? images.length - 1 : prev! - 1));
                  }}
                  className="absolute left-4 rounded-full bg-ink/50 p-2 text-paper hover:bg-ink/70 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex((prev) => (prev! === images.length - 1 ? 0 : prev! + 1));
                  }}
                  className="absolute right-4 rounded-full bg-ink/50 p-2 text-paper hover:bg-ink/70 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
