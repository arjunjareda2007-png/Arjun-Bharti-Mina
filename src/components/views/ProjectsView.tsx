import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProjectItem } from '../../types';
import { Globe, ExternalLink, Github, Layers, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const { projects, setSelectedProjectId } = useStore();
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const categories = ['All', 'Web Application', 'Creative Tech', 'Engineering Tool', 'AI & Media'];

  const filteredProjects = projects.filter(p => 
    selectedFilter === 'All' || p.category === selectedFilter
  );

  return (
    <div id="projects-view" className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="space-y-2 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <span className="text-xs font-mono uppercase tracking-wider text-amber-500 font-semibold block">
          Creative Technology & Engineering Software
        </span>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
          Websites & Digital Projects
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-3xl">
          Digital platforms, 3D WebGL exhibition spaces, civil engineering structural analysis tools, and creator utilities architected by Arjun Bharti Mina.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedFilter === cat
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold shadow-sm'
                : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => setSelectedProjectId(project.id)}
            className="group rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-amber-500/50 shadow-sm hover:shadow-2xl transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
          >
            {/* Screenshot Header */}
            <div className="relative aspect-video w-full bg-neutral-950 overflow-hidden">
              <img 
                src={project.thumbnail} 
                alt={project.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase bg-neutral-950/80 backdrop-blur-md text-white border border-neutral-700">
                  {project.category}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {project.status}
                </span>
              </div>
            </div>

            {/* Project Details */}
            <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span>Year: {project.year}</span>
                  <span>SKIT / ABM Labs</span>
                </div>

                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-amber-500 transition-colors">
                  {project.title}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {project.shortDescription}
                </p>
              </div>

              {/* Technologies */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {project.technologies.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1 group-hover:underline">
                  <span>View Project Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-full text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      title="Visit Live Site"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-full text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      title="View GitHub Repository"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
