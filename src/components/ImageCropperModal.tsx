import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, 
  Crop, 
  RotateCw, 
  RotateCcw, 
  FlipHorizontal, 
  ZoomIn, 
  ZoomOut, 
  Check, 
  Upload, 
  RefreshCw,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';

export type CropAspectRatio = '1:1' | '16:9' | '4:3' | '3:1' | '9:16' | 'free';

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedDataUrl: string) => void;
  initialImageUrl?: string;
  title?: string;
  aspectRatioPreset?: CropAspectRatio;
  outputWidth?: number;
  outputHeight?: number;
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  onClose,
  onCropComplete,
  initialImageUrl = '',
  title = 'Crop & Refine Image',
  aspectRatioPreset = '1:1',
  outputWidth = 800,
  outputHeight = 800
}) => {
  const [imageSrc, setImageSrc] = useState<string>(initialImageUrl);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [isFlippedH, setIsFlippedH] = useState<boolean>(false);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [aspectRatio, setAspectRatio] = useState<CropAspectRatio>(aspectRatioPreset);
  const [urlInput, setUrlInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageElementRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (initialImageUrl) {
      setImageSrc(initialImageUrl);
    }
  }, [initialImageUrl]);

  useEffect(() => {
    setAspectRatio(aspectRatioPreset);
  }, [aspectRatioPreset]);

  // Reset transform state when new image loaded
  useEffect(() => {
    setZoom(1);
    setRotation(0);
    setIsFlippedH(false);
    setPan({ x: 0, y: 0 });
  }, [imageSrc]);

  // Load image element when imageSrc changes
  useEffect(() => {
    if (!imageSrc) return;
    setLoading(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageElementRef.current = img;
      setLoading(false);
    };
    img.onerror = () => {
      setLoading(false);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlLoad = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      setImageSrc(urlInput.trim());
      setUrlInput('');
    }
  };

  // Drag pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile pan
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Calculate crop aspect ratio dimensions
  const getAspectRatioValue = useCallback((): number => {
    switch (aspectRatio) {
      case '1:1': return 1;
      case '16:9': return 16 / 9;
      case '4:3': return 4 / 3;
      case '3:1': return 3 / 1;
      case '9:16': return 9 / 16;
      case 'free': return 1;
      default: return 1;
    }
  }, [aspectRatio]);

  // Generate cropped output canvas
  const handleApplyCrop = () => {
    const img = imageElementRef.current;
    if (!img) return;

    const ratio = getAspectRatioValue();
    let targetW = outputWidth;
    let targetH = Math.round(outputWidth / ratio);

    if (aspectRatio === '3:1') {
      targetW = 1200;
      targetH = 400;
    } else if (aspectRatio === '16:9') {
      targetW = 1280;
      targetH = 720;
    } else if (aspectRatio === '1:1') {
      targetW = 800;
      targetH = 800;
    }

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Clear background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, targetW, targetH);

    ctx.save();
    // Translate to center
    ctx.translate(targetW / 2, targetH / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(isFlippedH ? -zoom : zoom, zoom);

    // Factor pan based on display scale vs actual canvas
    const displayFactor = targetW / 360;
    const drawX = (pan.x * displayFactor) - (img.width / 2);
    const drawY = (pan.y * displayFactor) - (img.height / 2);

    // Draw scaled image centered
    const imgAspect = img.width / img.height;
    let drawWidth = targetW;
    let drawHeight = targetW / imgAspect;

    if (drawHeight < targetH) {
      drawHeight = targetH;
      drawWidth = targetH * imgAspect;
    }

    ctx.drawImage(img, -drawWidth / 2 + (pan.x * displayFactor), -drawHeight / 2 + (pan.y * displayFactor), drawWidth, drawHeight);
    ctx.restore();

    try {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      onCropComplete(dataUrl);
      onClose();
    } catch (err) {
      console.error('Failed to export cropped canvas:', err);
      // Fallback: pass imageSrc directly
      onCropComplete(imageSrc);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      id="image-cropper-backdrop"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in"
      onClick={onClose}
    >
      <div 
        id="image-cropper-card"
        className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Crop className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          
          {/* Image Input Options */}
          <div className="flex flex-wrap items-center gap-2 pb-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              onChange={handleFileUpload} 
              className="hidden" 
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold rounded-xl flex items-center gap-2 border border-neutral-700 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>Upload New File</span>
            </button>

            {/* Quick URL load */}
            <form onSubmit={handleUrlLoad} className="flex-1 min-w-[200px] flex items-center gap-1.5">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Or paste image URL here..."
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-medium rounded-xl border border-neutral-700 transition-colors"
              >
                Load
              </button>
            </form>
          </div>

          {/* Crop Area & Viewport */}
          <div className="space-y-2">
            <div 
              ref={containerRef}
              className="relative w-full h-72 sm:h-80 bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-800 flex items-center justify-center select-none cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Grid overlay */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none z-10 opacity-20 border border-amber-500/40">
                <div className="border-r border-b border-amber-500/40" />
                <div className="border-r border-b border-amber-500/40" />
                <div className="border-b border-amber-500/40" />
                <div className="border-r border-b border-amber-500/40" />
                <div className="border-r border-b border-amber-500/40" />
                <div className="border-b border-amber-500/40" />
                <div className="border-r border-amber-500/40" />
                <div className="border-r border-amber-500/40" />
                <div />
              </div>

              {/* Crop Frame Mask */}
              <div 
                className={`absolute pointer-events-none z-10 border-2 border-amber-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] ${
                  aspectRatio === '1:1' ? 'w-56 h-56 rounded-2xl' :
                  aspectRatio === '16:9' ? 'w-64 h-36 rounded-xl' :
                  aspectRatio === '3:1' ? 'w-72 h-24 rounded-lg' :
                  aspectRatio === '4:3' ? 'w-60 h-44 rounded-xl' :
                  aspectRatio === '9:16' ? 'w-36 h-64 rounded-xl' :
                  'w-56 h-56 rounded-xl'
                }`}
              />

              {/* Rendered Image with Transform */}
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt="Crop preview"
                  draggable={false}
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${isFlippedH ? -zoom : zoom}, ${zoom}) rotate(${rotation}deg)`,
                    transformOrigin: 'center center',
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                    maxHeight: '100%',
                    maxWidth: '100%'
                  }}
                  className="pointer-events-none"
                />
              ) : (
                <div className="text-center p-6 text-neutral-500 space-y-2">
                  <ImageIcon className="w-8 h-8 mx-auto opacity-40" />
                  <p className="text-xs">No image loaded. Upload a file or paste a URL.</p>
                </div>
              )}

              {loading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                  <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
                </div>
              )}
            </div>

            <p className="text-[11px] text-neutral-400 text-center font-mono">
              Tip: Click and drag on the image to position it inside the crop box
            </p>
          </div>

          {/* Aspect Ratio Presets */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-neutral-400 block">Aspect Ratio</span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { id: '1:1', label: '1:1 Square (Avatar/Logo)' },
                { id: '16:9', label: '16:9 Video/Banner' },
                { id: '3:1', label: '3:1 Wide Header' },
                { id: '4:3', label: '4:3 Standard' },
                { id: '9:16', label: '9:16 Story/Reel' },
                { id: 'free', label: 'Freeform' },
              ].map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setAspectRatio(preset.id as CropAspectRatio)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-medium text-center border transition-all ${
                    aspectRatio === preset.id
                      ? 'bg-amber-500 text-neutral-950 border-amber-500 font-bold shadow-md'
                      : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  {preset.id}
                </button>
              ))}
            </div>
          </div>

          {/* Controls: Zoom & Rotate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-800">
            {/* Zoom Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                  <span>Zoom Scale ({zoom.toFixed(1)}x)</span>
                </span>
                <button 
                  type="button" 
                  onClick={() => setZoom(1)} 
                  className="text-[10px] text-neutral-500 hover:text-white"
                >
                  Reset
                </button>
              </div>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
              />
            </div>

            {/* Rotation & Flip */}
            <div className="space-y-1.5">
              <span className="text-xs text-neutral-400 block">Rotate & Transform</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r - 90) % 360)}
                  className="flex-1 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl text-xs flex items-center justify-center gap-1 transition-colors"
                  title="Rotate Left 90°"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>-90°</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="flex-1 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl text-xs flex items-center justify-center gap-1 transition-colors"
                  title="Rotate Right 90°"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>+90°</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsFlippedH(!isFlippedH)}
                  className={`p-2 rounded-xl border text-xs transition-colors ${
                    isFlippedH ? 'bg-amber-500 text-neutral-950 border-amber-500 font-bold' : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700'
                  }`}
                  title="Flip Horizontal"
                >
                  <FlipHorizontal className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setZoom(1);
                    setRotation(0);
                    setIsFlippedH(false);
                    setPan({ x: 0, y: 0 });
                  }}
                  className="p-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl text-xs text-neutral-400 hover:text-white"
                  title="Reset All Adjustments"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-800 bg-neutral-950/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!imageSrc}
            onClick={handleApplyCrop}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>Apply & Save Cropped Image</span>
          </button>
        </div>
      </div>
    </div>
  );
};
