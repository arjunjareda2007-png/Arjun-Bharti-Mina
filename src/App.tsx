import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StoreProvider, useStore } from './context/StoreContext';
import { ClerkProviderWrapper } from './components/ClerkProviderWrapper';
import { Navbar } from './components/Navbar';
import { MenuDrawer } from './components/MenuDrawer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { ShareModal } from './components/ShareModal';
import { LightboxModal } from './components/LightboxModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { FullscreenPlayerModal } from './components/FullscreenPlayerModal';
import { SongDetailModal } from './components/SongDetailModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { LyricDetailModal } from './components/LyricDetailModal';
import { BookDetailModal } from './components/BookDetailModal';
import { AuthModal } from './components/AuthModal';
import { ToastContainer } from './components/ToastContainer';
import { ImageCropperModal } from './components/ImageCropperModal';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { ErrorBoundary } from './components/ErrorBoundary';
import { CustomCursor } from './components/motion/CustomCursor';
import { CINEMATIC_EASE } from './utils/motion';

// Views
import { HomeView } from './components/views/HomeView';
import { AboutView } from './components/views/AboutView';
import { MusicView } from './components/views/MusicView';
import { LyricsView } from './components/views/LyricsView';
import { GalleryView } from './components/views/GalleryView';
import { VideosView } from './components/views/VideosView';
import { ProjectsView } from './components/views/ProjectsView';
import { BooksView } from './components/views/BooksView';
import { SocialHubView } from './components/views/SocialHubView';
import { ContactView } from './components/views/ContactView';
import { AdminDashboard } from './components/AdminDashboard';

const MainLayout: React.FC = () => {
  const { currentTab, isCropperOpen, cropperOptions, closeCropper } = useStore();

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  if (currentTab === 'admin') {
    return (
      <ErrorBoundary fallbackTitle="Admin Dashboard Refreshed">
        <div className="min-h-screen bg-neutral-950 font-sans selection:bg-amber-500 selection:text-neutral-950">
          <AdminDashboard />
          <FullscreenPlayerModal />
          <LightboxModal />
          <VideoPlayerModal />
          <ToastContainer />
          <AuthModal />
          {cropperOptions && (
            <ImageCropperModal
              isOpen={isCropperOpen}
              onClose={closeCropper}
              onCropComplete={cropperOptions.onCropComplete}
              initialImageUrl={cropperOptions.initialImageUrl}
              title={cropperOptions.title}
              aspectRatioPreset={cropperOptions.aspectRatioPreset}
              outputWidth={cropperOptions.outputWidth}
              outputHeight={cropperOptions.outputHeight}
            />
          )}
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary fallbackTitle="Website View Refreshed">
      <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50 transition-colors duration-300 font-sans selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-950 overflow-x-hidden">
        {/* Subtle Desktop Custom Cursor */}
        <CustomCursor />

        {/* Top Navigation */}
        <Navbar />

        {/* Main Page Container with Smooth Motion Transition */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28 sm:pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.32, ease: CINEMATIC_EASE }}
            >
              {currentTab === 'home' && <HomeView />}
              {currentTab === 'about' && <AboutView />}
              {currentTab === 'music' && <MusicView />}
              {currentTab === 'lyrics' && <LyricsView />}
              {currentTab === 'gallery' && <GalleryView />}
              {currentTab === 'videos' && <VideosView />}
              {currentTab === 'projects' && <ProjectsView />}
              {currentTab === 'books' && <BooksView />}
              {currentTab === 'social' && <SocialHubView />}
              {currentTab === 'contact' && <ContactView />}
              
              {/* Safe Fallback if currentTab is unknown or reset */}
              {!['home', 'about', 'music', 'lyrics', 'gallery', 'videos', 'projects', 'books', 'social', 'contact', 'admin'].includes(currentTab) && (
                <HomeView />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Global Interactive Elements & Modals */}
        <MenuDrawer />
        <FullscreenPlayerModal />
        <SearchModal />
        <VideoPlayerModal />
        <SongDetailModal />
        <ProjectDetailModal />
        <LyricDetailModal />
        <BookDetailModal />
        <LightboxModal />
        <ShareModal />
        <AuthModal />
        <ToastContainer />
        <PWAInstallPrompt />

        {/* Image Cropper Modal */}
        {cropperOptions && (
          <ImageCropperModal
            isOpen={isCropperOpen}
            onClose={closeCropper}
            onCropComplete={cropperOptions.onCropComplete}
            initialImageUrl={cropperOptions.initialImageUrl}
            title={cropperOptions.title}
            aspectRatioPreset={cropperOptions.aspectRatioPreset}
            outputWidth={cropperOptions.outputWidth}
            outputHeight={cropperOptions.outputHeight}
          />
        )}

        {/* Mobile Persistent Navigation */}
        <MobileBottomNav />

        {/* Footer */}
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <ClerkProviderWrapper>
        <MainLayout />
      </ClerkProviderWrapper>
    </StoreProvider>
  );
}
