import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Code2, Download, ExternalLink, Sparkles } from 'lucide-react';
import { experience, skills } from '../data/siteData';

type Job = (typeof experience)[number];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5 },
};

export default function InteractiveResume() {
  const yearsOfExperience = useMemo(() => {
    const first = experience.at(-1)?.period;
    if (!first) return '5+';
    const year = Number(first.match(/\d{4}/)?.[0] || 0);
    if (!year) return '5+';
    return `${Math.max(new Date().getFullYear() - year, 1)}+`;
  }, []);

  const stats = [
    { label: 'Years', value: yearsOfExperience },
    { label: 'Experience', value: `${experience.length}` },
    { label: 'Skills', value: `${skills.length}` },
  ];

  const skillGroups = [
    {
      title: 'Frontend',
      items: skills.filter((s) => ['React', 'TypeScript', 'Astro', 'Next.js', 'Tailwind CSS'].includes(s.name)),
    },
    {
      title: 'Engineering',
      items: skills.filter((s) => ['Node.js', 'Git'].includes(s.name)),
    },
    {
      title: 'Design',
      items: skills.filter((s) => ['Figma'].includes(s.name)),
    },
  ];

  return (
    <div className="relative min-h-screen pb-20 pt-24 text-white">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-20 top-0 h-[460px] w-[460px] rounded-full bg-cyan-500/10 blur-[110px]" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-indigo-500/12 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.section
          className="rounded-3xl border border-white/12 bg-black/35 p-6 backdrop-blur-md md:p-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="grid gap-8 md:grid-cols-[1.1fr_1.6fr] md:items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs tracking-wider text-white/75">
                <Sparkles size={14} />
                RESUME
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-xl font-bold">CS</div>
                <div>
                  <h1 className="text-2xl font-bold md:text-3xl">CalmSpark</h1>
                  <p className="text-sm text-white/65">Full Stack Developer · Product-minded Builder</p>
                </div>
              </div>

              <p className="text-sm leading-7 text-white/72 md:text-base">
                专注于把复杂需求拆解成可交付系统。擅长前端架构、交互体验、以及工程化落地，追求“好看且能维护”。
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <a href="mailto:hi@calmspark.com" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90">
                  联系我
                </a>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-4 py-2 text-sm text-white/90 hover:bg-white/14"
                >
                  <Download size={15} /> 打印 / 导出
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {stats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-5 text-center">
                  <p className="text-2xl font-bold md:text-3xl">{item.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/55">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section className="mt-10" {...fadeUp}>
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl border border-white/12 bg-white/6 p-2 text-cyan-300">
              <Briefcase size={18} />
            </div>
            <h2 className="text-2xl font-bold md:text-3xl">Experience</h2>
          </div>

          <div className="relative space-y-6 pl-5 md:pl-8">
            <div className="absolute left-[7px] top-1 h-[calc(100%-10px)] w-px bg-gradient-to-b from-cyan-300/50 via-white/16 to-transparent md:left-[11px]" />
            {experience.map((job: Job, index) => (
              <motion.article
                key={`${job.company}-${index}`}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="relative rounded-2xl border border-white/10 bg-black/28 p-5 md:p-6"
              >
                <span className="absolute -left-[22px] top-6 h-3.5 w-3.5 rounded-full border-2 border-cyan-300/80 bg-[#0e121b] shadow-[0_0_12px_rgba(34,211,238,0.45)] md:-left-[29px]" />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold md:text-xl">{job.role}</h3>
                  <span className="rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs font-medium text-white/75">{job.period}</span>
                </div>
                <p className="mt-2 text-sm text-cyan-200/85">{job.company}</p>
                <p className="mt-4 text-sm leading-7 text-white/72 md:text-base">{job.description}</p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section className="mt-12" {...fadeUp}>
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl border border-white/12 bg-white/6 p-2 text-violet-300">
              <Code2 size={18} />
            </div>
            <h2 className="text-2xl font-bold md:text-3xl">Skills</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {skillGroups.map((group) => (
              <article key={group.title} className="rounded-2xl border border-white/10 bg-black/28 p-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/62">{group.title}</h3>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {group.items.map((skill) => (
                    <a
                      key={skill.name}
                      href={skill.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/14 bg-white/7 px-3 py-1.5 text-sm text-white/86 transition hover:border-cyan-300/50 hover:bg-white/12"
                    >
                      {skill.name}
                      <ExternalLink size={12} className="opacity-75" />
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
