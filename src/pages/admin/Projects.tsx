import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Edit, Trash2, Eye, FolderKanban, CheckCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Project {
  id: string;
  name: string;
  client: string;
  status: 'Development' | 'Testing' | 'Review' | 'Completed';
  progress: number;
  due: string;
}

const INITIAL_PROJECTS: Project[] = [];

export function Projects() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [filter, setFilter] = useState('All');

  const filteredProjects = filter === 'All' ? projects : projects.filter(p => filter === 'Completed' ? p.status === 'Completed' : filter === 'Active' ? p.status !== 'Completed' : true);

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Project Management</h2>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          {['All', 'Active', 'Completed'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition-colors whitespace-nowrap",
                filter === f ? "bg-neutral-900 text-white" : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm flex flex-col hover:border-indigo-300 transition-colors group">
             <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-neutral-900 text-lg">{project.name}</h3>
                  <div className="text-sm font-medium text-neutral-500">{project.client} • Due {project.due}</div>
                </div>
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md",
                  project.status === 'Development' ? "bg-purple-100 text-purple-700" : 
                  project.status === 'Testing' ? "bg-sky-100 text-sky-700" : 
                  project.status === 'Completed' ? "bg-emerald-100 text-emerald-700" : 
                  "bg-orange-100 text-orange-700"
                )}>
                  {project.status}
                </span>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-3 bg-neutral-100 rounded-full overflow-hidden">
                  <div className={cn(
                    "h-full rounded-full transition-all duration-500",
                    project.progress === 100 ? "bg-emerald-500" : "bg-indigo-600"
                  )} style={{ width: `${project.progress}%` }}></div>
                </div>
                <span className="text-sm font-bold text-neutral-700 w-10 text-right">{project.progress}%</span>
              </div>

              <div className="mt-auto pt-4 border-t border-neutral-100 flex gap-2">
                <button className="flex-1 bg-white border border-neutral-200 text-neutral-700 font-bold py-2 rounded-xl text-sm hover:bg-neutral-50 transition-colors">
                  Assign Developer
                </button>
                <button className="flex-1 bg-indigo-50 text-indigo-700 font-bold py-2 rounded-xl text-sm hover:bg-indigo-100 transition-colors">
                  View Timeline
                </button>
              </div>
          </div>
        ))}
        {filteredProjects.length === 0 && (
          <div className="col-span-full py-12 text-center text-neutral-500">
            No projects found matching the filter.
          </div>
        )}
      </div>
    </div>
  );
}
