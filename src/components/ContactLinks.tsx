import { Mail, Github, Twitter } from 'lucide-react';

const contactLinks = [
  { icon: Mail, label: 'Email', value: 'hi@calmspark.com', href: 'mailto:hi@calmspark.com', color: 'text-blue-400' },
  { icon: Twitter, label: 'Twitter', value: '@CalmSpark', href: 'https://x.com/CalmSpark', color: 'text-sky-400' },
  { icon: Github, label: 'Github', value: 'CalmSpark', href: 'https://github.com/CalmSpark', color: 'text-white' },
];

export default function ContactLinks() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {contactLinks.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-6 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center gap-3 hover:-translate-y-1"
          >
            <Icon className={`w-8 h-8 ${link.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
            <div className="text-center">
              <div className="text-xs text-white/40 uppercase tracking-wider font-medium mb-1">
                {link.label}
              </div>
              <div className="text-white font-medium group-hover:text-blue-300 transition-colors">
                {link.value}
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}
