import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProjectItem } from '../../types';
import { DeleteConfirmModal } from '../DeleteConfirmModal';
import { 
  Code, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Github, 
  X
} from 'lucide-react';

const EMPTY_PROJECT: ProjectItem = {
  id: '',
  title: '',
  shortDescription: '',
  longDescription: '',
  category: 'Engineering Tool',
  technologies: ['TypeScript', 'React', 'Civil Engineering'],
  features: ['Real-time calculations', 'Interactive visual models'],
  year: 2026,
  status: 'Live',
  liveUrl: 'https://github.com',
  githubUrl: 'https://github.com',
  thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800',
  featured: false,
  published: true
};

export const ProjectsTab: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ProjectItem | null>(null);
  const [tagsInput, setTagsInput] = useState('');

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingProject({
      ...EMPTY_PROJECT,
      id: `proj-${Date.now()}`
    });
    setTagsInput('TypeScript, React, Civil Engineering');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: ProjectItem) => {
    setEditingProject({ ...p });
    setTagsInput(p.technologies?.join(', ') || '');
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title.trim()) return;

    const technologies = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const itemToSave = { ...editingProject, technologies };

    const exists = projects.some(p => p.id === itemToSave.id);
    if (exists) {
      await updateProject(itemToSave);
    } else {
      await addProject(itemToSave);
    }
    setIsModalOpen(false);
    setEditingProject(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-amber-500" />
            <span>Digital Projects & Engineering Software</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Manage your civil engineering calculation web apps, digital tools, and open-source GitHub repositories.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search projects & software..."
          className="w-full pl-10 pr-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-sm space-y-3 p-4"
          >
            <div className="aspect-video relative overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800">
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-black/70 text-[10px] font-semibold text-white backdrop-blur-sm">
                {project.category}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                {project.title}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1">
                {project.shortDescription}
              </p>
            </div>

            <div className="flex flex-wrap gap-1">
              {project.technologies?.map(t => (
                <span key={t} className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono text-neutral-600 dark:text-neutral-300">
                  {t}
                </span>
              ))}
            </div>

            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="p-1 text-neutral-400 hover:text-amber-500">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="p-1 text-neutral-400 hover:text-white">
                    <Github className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(project)}
                  className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteTarget(project)}
                  className="p-1 text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingProject && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-lg max-h-[90vh] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-2xl overflow-y-auto space-y-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-neutral-400"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              {projects.some(p => p.id === editingProject.id) ? 'Edit Digital Project' : 'Add New Project'}
            </h3>

            <form onSubmit={handleSaveModal} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Category</label>
                <input
                  type="text"
                  value={editingProject.category}
                  onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Thumbnail Image URL</label>
                <input
                  type="url"
                  value={editingProject.thumbnail}
                  onChange={(e) => setEditingProject({ ...editingProject, thumbnail: e.target.value })}
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Live Application URL</label>
                <input
                  type="url"
                  value={editingProject.liveUrl || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">GitHub Repo URL</label>
                <input
                  type="url"
                  value={editingProject.githubUrl || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Tech Stack (Comma-separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="React, TypeScript, Tailwind"
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={editingProject.shortDescription}
                  onChange={(e) => setEditingProject({ ...editingProject, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-1.5 text-xs text-neutral-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Project?"
        itemName={deleteTarget?.title || ''}
        itemType="Project"
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteProject(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
