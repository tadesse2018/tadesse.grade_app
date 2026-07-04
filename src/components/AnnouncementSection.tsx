import React, { useState } from 'react';
import { PlusCircle, Megaphone, Target, Calendar, User } from 'lucide-react';
import { Announcement } from '../schoolData';
import { playInteractiveSound } from './AudioEngine';

interface AnnouncementSectionProps {
  announcements: Announcement[];
  onAddAnnouncement: (ann: Announcement) => void;
}

export const AnnouncementSection: React.FC<AnnouncementSectionProps> = ({ announcements, onAddAnnouncement }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [target, setTarget] = useState<'Parents' | 'Teachers' | 'Both'>('Both');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('እባክዎን ርዕስ እና ማብራሪያ ያስገቡ (Please fill all fields)');
      return;
    }

    const newAnn: Announcement = {
      id: 'ann-' + Math.floor(1000 + Math.random() * 9000),
      title: title.trim(),
      content: content.trim(),
      target,
      postedBy: 'principal@school.com',
      timestamp: new Date().toISOString()
    };

    playInteractiveSound('register');
    onAddAnnouncement(newAnn);
    setSuccessMsg(`✅ ማስታወቂያው በተሳካ ሁኔታ ተለጥፏል!`);
    
    // Reset form
    setTitle('');
    setContent('');
    setTarget('Both');

    setTimeout(() => setSuccessMsg(null), 5000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="announcements-module">
      
      {/* Post Announcement Form */}
      <div className="lg:col-span-5 bg-white border border-stone-200 p-6 rounded-2xl space-y-4 shadow-xs">
        <div>
          <span className="text-[10px] bg-amber-50 text-amber-700 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">ርዕሰ መምህር ተግባር</span>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5 mt-1">
            <PlusCircle className="text-amber-500 w-5 h-5" /> የማስታወቅያ መለጠፊያ ፎርም
          </h3>
          <p className="text-stone-400 text-xs">Broadcast urgent notices and newsletters to the community</p>
        </div>

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-semibold rounded-xl">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-stone-600 mb-1">የማስታወቂያው ርዕስ (Notice Title):</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="የወላጅና መምህራን ምክክር ስብሰባ"
              className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none bg-stone-50/50"
              required
            />
          </div>

          {/* TARGET AUDIENCE DROPDOWN (ድሮፕ ዳው ለወላጅ/ለመምህራን) */}
          <div>
            <label className="block text-xs font-bold uppercase text-stone-600 mb-1">የማስታወቂያው ተደራሽነት (Target Audience):</label>
            <select 
              value={target}
              onChange={(e) => setTarget(e.target.value as any)}
              className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:border-indigo-600 outline-none bg-white font-semibold text-stone-800"
            >
              <option value="Both">ለሁሉም - መምህራን እና ወላጆች (Both Parents & Teachers)</option>
              <option value="Parents">ለወላጆች ብቻ (Parents Only)</option>
              <option value="Teachers">ለመምህራን ብቻ (Teachers Only)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-stone-600 mb-1">ዝርዝር መግለጫ (Notice Description):</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder="ዝርዝር መልዕክቱን እዚህ ይጻፉ..."
              className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none bg-stone-50/50"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm transition-all shadow-sm"
          >
            📢 ማስታወቂያውን ልጥፍ (Post Announcement)
          </button>
        </form>
      </div>

      {/* Announcements Board list */}
      <div className="lg:col-span-7 bg-white border border-stone-200 p-6 rounded-2xl space-y-4 shadow-xs">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
            <Megaphone className="text-amber-500 w-5 h-5" /> የቀደሙ ማስታወቂያዎች ሰሌዳ (Notice Board)
          </h3>
          <p className="text-stone-400 text-xs">Urgent notices and memos currently active</p>
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
          {announcements.map((ann) => (
            <div 
              key={ann.id} 
              className={`p-4 rounded-2xl border transition-all ${
                ann.target === 'Parents' ? 'bg-amber-50/30 border-amber-100' :
                ann.target === 'Teachers' ? 'bg-indigo-50/30 border-indigo-100' :
                'bg-stone-50/50 border-stone-200/60'
              }`}
            >
              <div className="flex justify-between items-start gap-2 flex-wrap mb-2">
                <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-md border ${
                  ann.target === 'Parents' ? 'bg-amber-100 text-amber-900 border-amber-200' :
                  ann.target === 'Teachers' ? 'bg-indigo-100 text-indigo-900 border-indigo-200' :
                  'bg-stone-100 text-stone-800 border-stone-200'
                }`}>
                  <Target className="w-3 h-3" />
                  <span>
                    {ann.target === 'Parents' ? 'ለወላጆች (Parents)' :
                     ann.target === 'Teachers' ? 'ለመምህራን (Teachers)' :
                     'ለሁሉም (Everyone)'}
                  </span>
                </span>

                <span className="text-[10px] text-stone-400 font-semibold font-mono flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {new Date(ann.timestamp).toLocaleDateString()}
                </span>
              </div>

              <h4 className="font-extrabold text-stone-900 text-sm md:text-base mb-1.5">{ann.title}</h4>
              <p className="text-xs md:text-sm text-stone-600 leading-relaxed whitespace-pre-line">{ann.content}</p>

              <div className="pt-2.5 mt-2.5 border-t border-stone-100 flex justify-between items-center text-[10px] text-stone-400 font-semibold">
                <span className="flex items-center gap-1"><User className="w-3 h-3" /> ርዕሰ መምህር</span>
                <span>ID: {ann.id}</span>
              </div>
            </div>
          ))}

          {announcements.length === 0 && (
            <div className="text-center p-8 text-stone-400 italic">ምንም ማስታወቂያ አልተለጠፈም (No announcements posted)</div>
          )}
        </div>
      </div>
    </div>
  );
};
