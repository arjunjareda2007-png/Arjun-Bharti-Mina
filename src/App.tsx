import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { GlobalAudioPlayer } from './components/GlobalAudioPlayer';
import { SearchModal } from './components/SearchModal';
import { ShareModal } from './components/ShareModal';
import { LightboxModal } from './components/LightboxModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { SongDetailModal } from './components/SongDetailModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { LyricDetailModal } from './components/LyricDetailModal';
import { AuthModal } from './components/AuthModal';
import { ToastContainer } from './components/ToastContainer';
import { ImageCropperModal } from './components/ImageCropperModal';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { ErrorBoundary } from './components/ErrorBoundary';

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
          <GlobalAudioPlayer />
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
      <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300 font-sans selection:bg-amber-500 selection:text-neutral-950">
        {/* Top Navigation */}
        <Navbar />

        {/* Main Page Container */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28 sm:pb-32">
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
        </main>

        {/* Global Interactive Elements & Modals */}
        <GlobalAudioPlayer />
        <SearchModal />
        <ShareModal />
        <LightboxModal />
        <VideoPlayerModal />
        <SongDetailModal />
        <ProjectDetailModal />
        <LyricDetailModal />
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

        {/* Footer */}
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}
