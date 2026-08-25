import React from 'react';
import { useStore } from '../../context/StoreContext';
import { calculateAge } from '../../utils/helpers';
import { 
  User, 
  GraduationCap, 
  MapPin, 
  Calendar, 
  Music, 
  Code, 
  Wrench, 
  Award, 
  Sparkles, 
  BookOpen, 
  Compass,
  ArrowRight
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const { profile, timeline, setCurrentTab } = useStore();

  const dynamicAge = calculateAge(profile.dob);

  return (
    <div id="about-view" className="space-y-12 sm:space-y-16 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <span className="text-xs font-mono uppercase tracking-wider text-amber-500 font-semibold block">
          Personal Identity & Journey
        </span>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
          About Arjun Bharti Mina
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl">
          Independent Indian music artist, rapper, lyricist, composer, civil engineering graduate, and creative technologist.
        </p>
      </div>

      {/* Main Grid: Portrait + Extended Bio */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Portrait & Quick Stats */}
        <div className="md:col-span-5 space-y-4">
          <div className="rounded-3xl overflow-hidden shadow-xl border border-neutral-200 dark:border-neutral-800 aspect-[4/5] bg-neutral-950">
            <img 
              src={profile.profileImage} 
              alt={profile.name} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Quick Info Card */}
          <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-500 font-mono">Full Name</span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">{profile.name}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-500 font-mono">Artist Brand</span>
              <span className="font-semibold text-amber-500">{profile.brandName}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-500 font-mono">Age (Dynamic)</span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">{dynamicAge} Years</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-500 font-mono">Birthplace</span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">{profile.birthplace}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500 font-mono">Current Base</span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">{profile.location}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Bio Paragraphs & Academic Details */}
        <div className="md:col-span-7 space-y-6">
          
          <div className="space-y-4 text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
            {profile.extendedBio.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          {/* Education Card */}
          <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-500">
              <GraduationCap className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider font-mono">Academic Background</h3>
            </div>
            <div>
              <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                {profile.education.degree} — {profile.education.field}
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                {profile.education.college}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs font-mono text-neutral-500">
                <span>Period: {profile.education.period}</span>
                <span>•</span>
                <span className="text-emerald-500 font-semibold">{profile.education.status}</span>
              </div>
            </div>
          </div>

          {/* Multidisciplinary Identity Pills */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold">
              Creative Roles & Disciplines
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.creativeRoles.map((role, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold">
              Creative & Intellectual Pursuits
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-full text-xs font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                >
                  #{interest}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* VISUAL TIMELINE */}
      <section id="personal-timeline" className="space-y-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-500 font-semibold block">
            Milestones & Creative Eras
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-900 dark:text-neutral-100">
            Chronological Timeline
          </h2>
        </div>

        <div className="relative pl-6 sm:pl-8 border-l-2 border-neutral-200 dark:border-neutral-800 space-y-8 my-6">
          {timeline.map((item) => (
            <div key={item.id} className="relative group">
              {/* Timeline Dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-neutral-900 border-4 border-amber-500 group-hover:scale-125 transition-transform shadow-md"></div>

              <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-amber-500/50 shadow-sm transition-all space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    {item.year} • {item.subtitle}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-neutral-400">
                    {item.category}
                  </span>
                </div>

                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quote Banner */}
      <div className="p-8 rounded-3xl bg-neutral-950 text-white border border-neutral-800 text-center space-y-2">
        <Sparkles className="w-6 h-6 text-amber-400 mx-auto" />
        <blockquote className="text-base sm:text-xl font-display font-medium italic text-neutral-200">
          &ldquo;{profile.featuredQuote}&rdquo;
        </blockquote>
        <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block pt-1">
          — Arjun Bharti Mina (ABM)
        </span>
      </div>

    </div>
  );
};
