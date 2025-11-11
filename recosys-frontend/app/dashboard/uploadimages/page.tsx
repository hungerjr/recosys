"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Loader2,
  Camera,
  Keyboard,
  PackageSearch,
  AlertCircle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ImagePlus,
  X,
} from "lucide-react";
import { toast } from "sonner";
import API from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";

const BarcodeScannerComponent = dynamic(
  () => import("react-qr-barcode-scanner"),
  { ssr: false }
);

type AwbOrder = {
  productName: string;
  awb: string;
  courier: string;
  quantity: number;
  createdAt: string;
};

export default function UploadImages() {
  const [awb, setAwb] = useState("");
  const [order, setOrder] = useState<AwbOrder | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [autoTrigger, setAutoTrigger] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const awbInputRef = useRef<HTMLInputElement>(null);

  // --- Fetch order info ---
  const fetchOrder = async (awbValue: string) => {
    if (!awbValue.trim()) {
      toast.error("Please enter or scan an AWB number");
      return;
    }

    setIsLoading(true);
    setNotFound(false);
    setOrder(null);
    setIsExpanded(false);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await API.get(`${baseUrl}/order/check-awb`, {
        params: { awb: awbValue },
      });

      if (response.data.exists && response.data.order) {
        setOrder(response.data.order);
        toast.success(`Order found for AWB ${awbValue}`);
        setIsLocked(true); // Disable input and buttons when found
      } else {
        setNotFound(true);
        toast.error(`No order found for AWB ${awbValue}`);
        setIsCameraOpen(false);
        setTimeout(() => awbInputRef.current?.focus(), 300);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error checking AWB. Please try again.");
      setIsCameraOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Beep sound ---
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = "sine";
      oscillator.frequency.value = 700;
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(
        0.0001,
        audioCtx.currentTime + 0.15
      );
      oscillator.stop(audioCtx.currentTime + 0.15);
    } catch {
      console.warn("Audio not supported");
    }
  };

  // --- Vibration ---
  const vibrate = (duration = 150) => {
    if (navigator.vibrate) navigator.vibrate(duration);
  };

  // --- Handle scan ---
  const handleScan = (err: any, result: any) => {
    if (result) {
      const scannedCode = result.text.trim();
      if (scannedCode && scannedCode !== awb) {
        setAwb(scannedCode);
        playBeep();
        vibrate();
        toast.success(`Scanned: ${scannedCode}`);
        setIsCameraOpen(false);
        setAutoTrigger(true);
      }
    }
  };

  // --- Auto trigger lookup after scan ---
  useEffect(() => {
    if (autoTrigger && awb) {
      fetchOrder(awb);
      setAutoTrigger(false);
    }
  }, [awb, autoTrigger]);

  // --- Start again handler ---
  const handleStartAgain = () => {
    setAwb("");
    setOrder(null);
    setNotFound(false);
    setIsCameraOpen(false);
    setIsLocked(false);
    setIsExpanded(true);
    setImages([]);
    setTimeout(() => awbInputRef.current?.focus(), 300);
  };

  // --- Allow pressing Enter to trigger check ---
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && awb.trim()) {
      if (isLocked) handleStartAgain();
      else fetchOrder(awb);
    }
  };

  // --- Handle image selection ---
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      if (images.length >= 5) {
        toast.error("You can upload a maximum of 5 images.");
        return;
      }
      setImages((prev) => [...prev, files[0]]);
    }
  };
  // --- Remove selected image ---
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen flex flex-col items-start bg-slate-50 dark:bg-slate-900 px-4 py-6 space-y-6">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 space-y-6 border border-slate-200 dark:border-slate-700">
        <h1 className="text-2xl font-semibold text-center text-slate-800 dark:text-white">
          AWB Order Lookup
        </h1>

        {/* AWB Input */}
        <div className="space-y-2">
          <label
            htmlFor="awb"
            className="block text-sm font-medium text-slate-600 dark:text-slate-300"
          >
            Enter or Scan AWB
          </label>
          <input
            ref={awbInputRef}
            id="awb"
            type="text"
            value={awb}
            onChange={(e) => setAwb(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter AWB number..."
            disabled={isLocked}
            className={`w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isLocked ? "opacity-60 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setIsCameraOpen(!isCameraOpen)}
            disabled={isLocked}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 px-3 py-2 text-sm font-medium text-slate-800 dark:text-white transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isCameraOpen ? (
              <>
                <Keyboard className="h-4 w-4" /> Type Manually
              </>
            ) : (
              <>
                <Camera className="h-4 w-4" /> Scan Barcode
              </>
            )}
          </button>

          {!isLocked ? (
            <button
              onClick={() => fetchOrder(awb)}
              disabled={isLoading}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 text-sm font-medium disabled:opacity-60 transition"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Checking...
                </>
              ) : (
                "Check Order"
              )}
            </button>
          ) : (
            <button
              onClick={handleStartAgain}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-green-600 hover:bg-green-700 text-white px-3 py-2 text-sm font-medium transition"
            >
              <RotateCcw className="h-4 w-4" />
              Start Again
            </button>
          )}
        </div>

        {/* Camera Scanner */}
        {isCameraOpen && (
          <div className="mt-4 border border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden">
            <BarcodeScannerComponent
              width="100%"
              height={240}
              onUpdate={handleScan}
            />
            <p className="text-center text-xs text-slate-500 dark:text-slate-400 p-2">
              Point your camera at the AWB barcode
            </p>
          </div>
        )}

        {/* Result */}
        <AnimatePresence>
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-lg border border-green-300 bg-green-50 dark:bg-green-900/30 dark:border-green-700 shadow-sm"
            >
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex w-full items-center justify-between p-4"
              >
                <div className="flex items-center gap-2">
                  <PackageSearch className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <h3 className="font-semibold text-green-700 dark:text-green-300">
                    Order Found
                  </h3>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-slate-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                )}
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden border-t border-green-200 dark:border-green-700 p-4 text-sm text-slate-800 dark:text-slate-200 space-y-3"
                  >
                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="font-medium w-20 inline-block">
                          Product:
                        </span>
                        {order.productName}
                      </div>
                      <div>
                        <span className="font-medium w-20 inline-block">
                          AWB:
                        </span>
                        {order.awb}
                      </div>
                      <div>
                        <span className="font-medium w-20 inline-block">
                          Courier:
                        </span>
                        {order.courier || "-"}
                      </div>
                      <div>
                        <span className="font-medium w-20 inline-block">
                          Quantity:
                        </span>
                        {order.quantity}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Created on: {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {notFound && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-lg border border-red-300 bg-red-50 dark:bg-red-900/30 dark:border-red-700 shadow-sm"
            >
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex w-full items-center justify-between p-4"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <h3 className="font-semibold text-red-700 dark:text-red-300">
                    Order Not Found
                  </h3>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-slate-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                )}
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden border-t border-red-200 dark:border-red-700 p-4 text-sm text-red-700 dark:text-red-300 space-y-3"
                  >
                    <p>Please verify the AWB number and try again manually.</p>

                    <button
                      onClick={() => handleStartAgain()}
                      className="mt-2 flex items-center gap-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-900/30 px-3 py-2 text-sm font-medium transition"
                    >
                      <Keyboard className="h-4 w-4" />
                      Type Again
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {order && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 space-y-6 border border-slate-200 dark:border-slate-700"
        >
          {/* 🖼️ Upload Images Section */}
          <div className="border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-900/40">
            <h3 className="text-base font-semibold text-slate-700 dark:text-slate-200 mb-3">
              Upload Images (max 5)
            </h3>

            <div className="flex flex-wrap gap-3">
              {images.map((file, index) => (
                <div
                  key={index}
                  className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
                    title="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {images.length < 5 && (
                <label className="w-24 h-24 border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:border-blue-500 hover:text-blue-500 transition cursor-pointer bg-white dark:bg-slate-800">
                  <ImagePlus className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">Add Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </label>
              )}
            </div>
          </div>

          <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 text-sm font-medium disabled:opacity-60 transition"
          >Upload
          </button>
        </motion.div>
      )}
    </div>
  );
}
