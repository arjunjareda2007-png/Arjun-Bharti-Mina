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
  ArrowRight,
  School,
  CheckCircle2
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const { profile, timeline, setCurrentTab } = useStore();

  const dynamicAge = calculateAge(profile.dob);

  const schoolTenth = profile.schoolEducation?.tenth || {
    level: 'Class 10th (Secondary)',
    standard: '10th',
    schoolName: 'Stanford Global Academy Sr. Sec. School, Jagatpura, Jaipur',
    percentage: '69.86%',
    stream: 'Secondary School Examination',
    period: '2020 – 2021',
    board: 'State Board / Secondary',
    status: 'Completed (69.86%)',
    location: 'Jagatpura, Jaipur'
  };

  const schoolTwelfth = profile.schoolEducation?.twelfth || {
    level: 'Class 12th (Senior Secondary)',
    standard: '12th',
    schoolName: 'Stanford Global Academy Sr. Sec. School, Jagatpura, Jaipur',
    percentage: '72%',
    stream: 'Senior Secondary (Science)',
    period: '2022 – 2023',
    board: 'State Board / Senior Secondary',
    status: 'Completed (72%)',
    location: 'Jagatpura, Jaipur'
  };

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

          {/* Education & Academic Foundation */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-500">
              <GraduationCap className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-neutral-900 dark:text-white">
                Education & Academic Foundation
              </h3>
            </div>

            {/* Higher Education Card (B.Tech) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 hover:border-amber-500/40 transition-all space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Higher Education
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {profile.education.status}
                </span>
              </div>
              <div>
                <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  {profile.education.degree} — {profile.education.field}
                </h4>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                  {profile.education.college}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs font-mono text-neutral-500">
                  <span>Batch: {profile.education.period}</span>
                </div>
              </div>
            </div>

            {/* School Education Cards Grid: 12th & 10th */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <School className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-mono uppercase font-bold tracking-wider">
                  Schooling Credentials
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 12th Standard Card */}
                <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-amber-500/40 shadow-xs transition-all space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                        {schoolTwelfth.level || 'Class 12th (Senior Sec.)'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                        {schoolTwelfth.percentage || '72%'}
                      </span>
                    </div>

                    <h5 className="text-sm font-bold text-neutral-900 dark:text-white leading-snug">
                      {schoolTwelfth.schoolName}
                    </h5>

                    {schoolTwelfth.stream && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                        {schoolTwelfth.stream}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                    <span>Year: {schoolTwelfth.period}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{schoolTwelfth.status || 'Completed'}</span>
                    </span>
                  </div>
                </div>

                {/* 10th Standard Card */}
                <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-amber-500/40 shadow-xs transition-all space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                        {schoolTenth.level || 'Class 10th (Secondary)'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-black bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                        {schoolTenth.percentage || '69.86%'}
                      </span>
                    </div>

                    <h5 className="text-sm font-bold text-neutral-900 dark:text-white leading-snug">
                      {schoolTenth.schoolName}
                    </h5>

                    {schoolTenth.stream && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                        {schoolTenth.stream}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                    <span>Year: {schoolTenth.period}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{schoolTenth.status || 'Completed'}</span>
                    </span>
                  </div>
                </div>
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
