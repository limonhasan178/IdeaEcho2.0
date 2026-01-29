
import React, { useState, useEffect, useCallback } from 'react';
import { Brain, LayoutDashboard, History, Settings, Bell, Zap, Menu, X, Share2, Link } from 'lucide-react';
import { ContentSource, GeneratedIdea, InterestMapData, LearningStep } from './types';
import SourceFeed from './components/SourceFeed';
import InterestMap from './components/InterestMap';
import GeneratedIdeas from './components/GeneratedIdeas';
import LearningRoadmap from './components/LearningRoadmap';
import GithubSync from './components/GithubSync';
import { generateIdeasFromHistory } from './services/geminiService';

const App: React.FC = () => {
  const [sources, setSources] = useState<ContentSource[]>([
    { id: '1', title: 'The Future of AI Automation in 2025', type: 'youtube', timestamp: Date.now() - 3600000, tags: ['ai'] },
    { id: '2', title: 'Why Solana is Winning the L1 Race', type: 'article', timestamp: Date.now() - 86400000, tags: ['crypto'] },
    { id: '3', title: 'Building a SaaS in 30 Days: A Guide', type: 'podcast', timestamp: Date.now() - 172800000, tags: ['startup'] },
  ]);

  const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);
  const [interestMap, setInterestMap] = useState<InterestMapData>({ nodes: [], links: [] });
  const [learningPath, setLearningPath] = useState<LearningStep[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleRefreshIdeas = useCallback(async () => {
    if (sources.length === 0) return;
    setIsGenerating(true);
    try {
      const data = await generateIdeasFromHistory(sources);
      setIdeas(data.ideas);
      setInterestMap(data.interestMap);
      setLearningPath(data.learningPath);
    } catch (err) {
      console.error("Error refreshing ideas:", err);
    } finally {
      setIsGenerating(false);
    }
  }, [sources]);

  useEffect(() => {
    handleRefreshIdeas();
  }, []);

  const addSource = (newSource: Omit<ContentSource, 'id' | 'timestamp'>) => {
    const source: ContentSource = {
      ...newSource,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    setSources(prev => [...prev, source]);
    // Automatically trigger refresh when new source is added
    setTimeout(handleRefreshIdeas, 500);
  };

  const deleteSource = (id: string) => {
    setSources(prev => prev.filter(s => s.id !== id));
  };

  const handleGithubSync = (data: { title: string; tags: string[] }) => {
    addSource({
      title: data.title,
      type: 'github',
      tags: data.tags
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-100">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col fixed h-full z-50`}>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
            <Brain size={24} className="text-white" />
          </div>
          {isSidebarOpen && <span className="font-heading font-bold text-xl tracking-tight">IdeaEcho</span>}
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" active isOpen={isSidebarOpen} />
          <SidebarItem icon={<History size={20} />} label="History" isOpen={isSidebarOpen} />
          <SidebarItem icon={<Zap size={20} />} label="Ideas" isOpen={isSidebarOpen} />
          <SidebarItem icon={<Share2 size={20} />} label="Social Connect" isOpen={isSidebarOpen} />
          <SidebarItem icon={<Settings size={20} />} label="Settings" isOpen={isSidebarOpen} />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className={`bg-slate-950/50 rounded-xl p-3 border border-slate-800 mb-4 transition-all ${isSidebarOpen ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
             <div className="flex items-center gap-2 mb-2">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
               <span className="text-[10px] text-slate-400 font-bold uppercase">Sync Status</span>
             </div>
             <p className="text-[11px] text-slate-300">GitHub: Connected</p>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 text-slate-500 hover:text-white transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-20'}`}>
        {/* Header */}
        <header className="sticky top-0 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 p-6 flex justify-between items-center z-40">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold font-heading">Welcome back, Creator</h1>
            <p className="text-xs text-slate-500">Your digital memory is currently processing {sources.length} nodes.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="text-slate-400 cursor-pointer hover:text-white transition-colors" size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border-2 border-slate-800 p-0.5 shadow-lg shadow-blue-500/10">
              <img src="https://picsum.photos/seed/echo/100" className="w-full h-full rounded-full" alt="Avatar" />
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="p-8 max-w-[1400px] mx-auto space-y-12">
          
          {/* Top Section: Hero & Sync */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
             <div className="lg:col-span-1">
               <GithubSync onSync={handleGithubSync} />
             </div>
             <div className="lg:col-span-2">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 border border-white/10 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/10 transition-all duration-700"></div>
                  <div className="relative z-10">
                    <h2 className="text-3xl font-bold font-heading mb-3">Sync Your Entire Tech Stack</h2>
                    <p className="text-blue-100/80 max-w-xl mb-6">
                      IdeaEcho now supports GitHub synchronization. Pull in your latest commits, READMEs, and technical projects to generate high-value technical content ideas automatically.
                    </p>
                    <div className="flex items-center gap-4">
                      <button className="bg-white text-blue-700 px-6 py-2 rounded-xl font-bold text-sm shadow-xl hover:scale-105 transition-all">Documentation</button>
                      <button className="text-white/80 hover:text-white text-sm font-medium flex items-center gap-2">View Changelog <Link size={14}/></button>
                    </div>
                  </div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 order-2 lg:order-1">
              <GeneratedIdeas 
                ideas={ideas} 
                isGenerating={isGenerating} 
                onRefresh={handleRefreshIdeas} 
              />
            </div>
            <div className="lg:col-span-1 order-1 lg:order-2">
              <SourceFeed 
                sources={sources} 
                onAdd={addSource} 
                onDelete={deleteSource} 
              />
            </div>
          </div>

          {/* Analysis Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <InterestMap data={interestMap} />
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl overflow-hidden flex flex-col">
              <h3 className="text-xl font-bold mb-6 font-heading text-slate-100">Neural Sync Diagnostics</h3>
              <div className="flex-1 space-y-6">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-400">Technical Depth</span>
                    <span className="text-xs font-bold text-blue-400">82%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[82%]"></div>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-400">Content Potential</span>
                    <span className="text-xs font-bold text-purple-400">94%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-[94%]"></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">GitHub Health</p>
                    <p className="text-sm font-bold">Stable Sync</p>
                    <p className="text-[10px] text-slate-500 mt-1">Last sync: Just now</p>
                  </div>
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <p className="text-[10px] font-bold text-green-400 uppercase mb-1">New Patterns</p>
                    <p className="text-sm font-bold">{sources.filter(s => s.type === 'github').length} Repos</p>
                    <p className="text-[10px] text-slate-500 mt-1">Technical graph updated</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <LearningRoadmap steps={learningPath} />

          {/* Footer CTA */}
          <footer className="pt-12 pb-8 text-center border-t border-slate-900">
            <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">IdeaEcho Engine • Neural Sync v1.2</p>
            <p className="text-slate-600 text-[10px] mt-2 italic">Automatically syncing digital minds with physical codebases.</p>
          </footer>
        </div>
      </main>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  isOpen: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, isOpen }) => (
  <div className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
    active 
      ? 'bg-blue-600/10 text-blue-500 border border-blue-600/20 shadow-inner' 
      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
  }`}>
    {icon}
    {isOpen && <span className="text-sm font-medium">{label}</span>}
  </div>
);

export default App;
