import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, ExternalLink, Github, CheckCircle2, Layers, Calendar, Share2 } from 'lucide-react';

export const ProjectDetailModal: React.FC = () => {
  const { selectedProjectId, setSelectedProjectId, projects, openShare } = useStore();

  if (!selectedProjectId) return null;
  const project = projects.find(p => p.id === selectedProjectId);
  if (!project) return null;

  const handleShare = () => {
    openShare({
      title: `${project.title} — Digital Project by Arjun Bharti Mina`,
      text: project.shortDescription,
      url: project.liveUrl || window.location.href
    });
  };

  return (
    <div 
      id="project-detail-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in"
      onClick={() => setSelectedProjectId(null)}
    >
      <div 
        id="project-detail-card"
        className="w-full max-w-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-950/80">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-semibold">
              {project.category}
            </span>
            <span className="text-xs text-neutral-500 font-mono">• {project.year}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-800"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedProjectId(null)}
              className="p-2 rounded-full text-neutral-500 hover:text-red-500 hover:bg-neutral-200 dark:hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* Banner Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg border border-neutral-200 dark:border-neutral-800 aspect-video bg-neutral-950">
            <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
          </div>

          {/* Title & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-neutral-900 dark:text-neutral-100">
                {project.title}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">{project.shortDescription}</p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity"
                >
                  <span>Visit Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  title="View Source on GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Tech Stack Badges */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              <span className="text-xs font-mono text-neutral-400 mr-2 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> Technologies:
              </span>
              {project.technologies.map(tech => (
                <span 
                  key={tech}
                  className="px-2.5 py-1 rounded-md text-xs font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Deep Concept & Problem Solved */}
          <div className="space-y-4 pt-2">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold mb-1">
                Concept & Overview
              </h3>
              <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {project.longDescription}
              </p>
            </div>

            {project.problemSolved && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm">
                <span className="font-semibold text-amber-600 dark:text-amber-400 block mb-1">Engineering Problem Solved:</span>
                <p className="text-xs leading-relaxed">{project.problemSolved}</p>
              </div>
            )}
          </div>

          {/* Key Features */}
          {project.features && project.features.length > 0 && (
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold mb-2">
                Core Architectural Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {project.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-950 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
