import React, { useState } from 'react';
import { PlusCircle, BookOpen, Layers, CheckSquare, Square } from 'lucide-react';
import { ClassSetup } from '../schoolData';
import { playInteractiveSound } from './AudioEngine';

interface ClassSetupSectionProps {
  classes: ClassSetup[];
  onAddClass: (classObj: ClassSetup) => void;
  schoolConfig?: any;
}

export const ClassSetupSection: React.FC<ClassSetupSectionProps> = ({ classes, onAddClass, schoolConfig }) => {
  const activeGradesList = schoolConfig?.schoolLevel === 'secondary'
    ? ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12']
    : ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'];

  const [grade, setGrade] = useState(activeGradesList[0] || 'Grade 1');
  const [section, setSection] = useState('A');
  const [stream, setStream] = useState('General');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync default grade on schoolLevel change
  React.useEffect(() => {
    setGrade(activeGradesList[0] || 'Grade 1');
  }, [schoolConfig?.schoolLevel]);

  const availableSubjects = schoolConfig?.subjects || [
    'Mathematics', 
    'English', 
    'Amharic', 
    'Science', 
    'Social Studies',
    'Physics',
    'Chemistry',
    'Biology',
    'Civics'
  ];

  const handleSubjectToggle = (subject: string) => {
    playInteractiveSound('click');
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSubjects.length === 0) {
      alert('እባክዎን ቢያንስ አንድ የትምህርት አይነት ይምረጡ (Select at least one subject)');
      return;
    }

    // Check if class with same grade and section exists
    const duplicate = classes.find(c => c.grade === grade && c.section === section);
    if (duplicate) {
      alert('ይህ ክፍል እና ሴክሽን ቀድሞ ተመዝግቧል (This Class and Section combo already exists)');
      return;
    }

    const newClass: ClassSetup = {
      id: 'cls-' + Math.floor(1000 + Math.random() * 9000),
      grade,
      section,
      stream,
      subjects: selectedSubjects
    };

    playInteractiveSound('register');
    onAddClass(newClass);
    setSuccessMsg(`✅ የ ${grade} - ${section} ክፍል የትምህርት መመዝገቢያ በተሳካ ሁኔታ ተፈጥሯል!`);
    
    // Reset subjects
    setSelectedSubjects([]);
    
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="class-setup-module">
      
      {/* Subject Registration Form */}
      <div className="lg:col-span-5 bg-white border border-stone-200 p-6 rounded-2xl space-y-4 shadow-xs">
        <div>
          <span className="text-[10px] bg-indigo-50 text-indigo-700 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">ርዕሰ መምህር ተግባር</span>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5 mt-1">
            <PlusCircle className="text-indigo-600 w-5 h-5" /> በክፍል የትምህርት መመዝገቢያ ፎርም
          </h3>
          <p className="text-stone-400 text-xs">Configure grade levels, streams, and academic subjects</p>
        </div>

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-semibold rounded-xl animate-pulse">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-stone-600 mb-1">ክፍል (Grade Level):</label>
              <select 
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:border-indigo-600 outline-none bg-white font-medium"
              >
                {activeGradesList.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-600 mb-1">ሴክሽን (Section):</label>
              <select 
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:border-indigo-600 outline-none bg-white font-medium"
              >
                <option>A</option>
                <option>B</option>
                <option>C</option>
                <option>D</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-stone-600 mb-1">የትምህርት ዘርፍ (Stream):</label>
            <select 
              value={stream}
              onChange={(e) => setStream(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:border-indigo-600 outline-none bg-white font-medium"
            >
              <option value="General">ጠቅላላ (General)</option>
              <option value="Natural Science">የተፈጥሮ ሳይንስ (Natural Science)</option>
              <option value="Social Science">የማህበራዊ ሳይንስ (Social Science)</option>
            </select>
          </div>

          {/* CHECKBOXES FOR SUBJECT LIST SELECTION */}
          <div>
            <label className="block text-xs font-bold uppercase text-stone-600 mb-1.5">
              የትምህርት አይነቶች (Select Academic Subjects):
            </label>
            <div className="grid grid-cols-2 gap-2 bg-stone-50 p-3 rounded-xl border border-stone-200/50 max-h-48 overflow-y-auto">
              {availableSubjects.map((sub) => {
                const isChecked = selectedSubjects.includes(sub);
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => handleSubjectToggle(sub)}
                    className="flex items-center gap-2 text-left p-1.5 hover:bg-stone-100 rounded-lg text-xs text-stone-700 transition-colors"
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-indigo-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-stone-400 shrink-0" />
                    )}
                    <span>{sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-sm"
          >
            ➕ የክፍል ትምህርት ፍጠር (Create Class Setup)
          </button>
        </form>
      </div>

      {/* Class List Table */}
      <div className="lg:col-span-7 bg-white border border-stone-200 p-6 rounded-2xl space-y-4 shadow-xs">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
            <BookOpen className="text-indigo-600 w-5 h-5" /> በክፍል የትምህርት ምዝገባዎች ዝርዝር
          </h3>
          <p className="text-stone-400 text-xs">Currently Configured Class academic configurations</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-500 uppercase text-[10px] tracking-wider font-bold">
                <th className="p-3 border-b border-stone-100">የክፍል ኮድ (Code)</th>
                <th className="p-3 border-b border-stone-100">ክፍል እና ሴክሽን</th>
                <th className="p-3 border-b border-stone-100">ዘርፍ (Stream)</th>
                <th className="p-3 border-b border-stone-100">የተመደቡ የትምህርት አይነቶች</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls) => (
                <tr key={cls.id} className="hover:bg-indigo-50/20 border-b border-stone-100 text-stone-800 transition-colors">
                  <td className="p-3 font-mono font-bold text-indigo-700 text-xs">{cls.id}</td>
                  <td className="p-3 font-semibold text-stone-900">
                    {cls.grade} - {cls.section}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-semibold">
                      {cls.stream}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1 max-w-sm">
                      {cls.subjects.map((sub, idx) => (
                        <span key={idx} className="bg-stone-100 text-[10px] px-2 py-0.5 rounded text-stone-600 font-medium">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {classes.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-stone-400 italic">ምንም ክፍል አልተዋቀረም (No class setups found)</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
