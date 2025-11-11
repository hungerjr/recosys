"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  name: string;
  sku: string;
  qty: number;
}

interface PackageDetailsProps {
  packageNumber: number;
  deadWeight: number;
  volWeight: number;
  dimensions: string;
  products: Product[];
}

export default function PackageDetailsPopover({
  packageNumber,
  deadWeight,
  volWeight,
  dimensions,
  products,
}: PackageDetailsProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [position, setPosition] = React.useState<"top" | "bottom">("bottom");
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const popoverHeight = 220; // estimated popover height
      setPosition(spaceBelow < popoverHeight ? "top" : "bottom");
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger */}
      <button
        ref={buttonRef}
        className="text-blue-600 text-sm font-medium hover:underline"
      >
        Package Details
      </button>

      {/* Animated Popover */}
      <AnimatePresence>
        {isOpen && buttonRef.current && (
          <motion.div
            key="popover"
            initial={{
              opacity: 0,
              y: position === "bottom" ? -8 : 8,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 0.18, ease: "easeOut" },
            }}
            exit={{
              opacity: 0,
              y: position === "bottom" ? -6 : 6,
              scale: 0.98,
              transition: { duration: 0.15, ease: "easeIn" },
            }}
            className="fixed z-50 w-72 rounded-md border bg-white shadow-lg text-sm"
            style={{
              left:
                buttonRef.current.getBoundingClientRect().left +
                buttonRef.current.getBoundingClientRect().width / 2,
              top:
                position === "bottom"
                  ? buttonRef.current.getBoundingClientRect().bottom + 8
                  : buttonRef.current.getBoundingClientRect().top - 230,
              transform: "translateX(-50%)",
            }}
          >
            {/* Arrow */}
            <div
              className={`absolute left-4 w-4 h-4 rotate-45 bg-white border-l border-t ${
                position === "top"
                  ? "-bottom-2 border-b border-r"
                  : "-top-2 border-t border-l"
              }`}
            ></div>

            <div className="p-3">
              {/* Top Info */}
              <div className="grid justify-between text-gray-600 grid-cols-2 grid-rows-2 gap-y-1">
                <div>
                  <span>Package {packageNumber}</span>
                </div>
                <div>Dead wt.: {deadWeight} Kg</div>

                <div className="text-xs text-gray-500 mb-2">{dimensions}</div>
                <div>Vol. wt.: {volWeight} Kg</div>
              </div>

              {/* Products List */}
              <div className="max-h-32 overflow-y-auto border-t pt-2 mt-2 space-y-2">
                {products.map((p, i) => (
                  <div key={i} className="border-b pb-1 last:border-b-0">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-gray-600">SKU: {p.sku}</div>
                    <div className="text-xs text-gray-600">QTY: {p.qty}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
