import React, { useState } from 'react';
import { PlusCircle, Users, GraduationCap, Phone, CheckSquare, Square, Shield } from 'lucide-react';
import { Teacher } from '../schoolData';
import { playInteractiveSound } from './AudioEngine';

interface TeacherSectionProps {
  teachers: Teacher[];
  onAddTeacher: (teacher: Teacher) => void;
  schoolConfig?: any;
}

export const TeacherSection: React.FC<TeacherSectionProps> = ({ teachers, onAddTeacher, schoolConfig }) => {
  const activeGradesList = schoolConfig?.schoolLevel === 'secondary'
    ? ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12']
    : ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'];

  const [name, setName] = useState('');
  const [educationLevel, setEducationLevel] = useState('Degree');
  const [phone, setPhone] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [assignedClass, setAssignedClass] = useState(activeGradesList[0] || 'Grade 1');
  const [assignedSection, setAssignedSection] = useState('A');
  const [isHomeroom, setIsHomeroom] = useState('No');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync default grade on schoolLevel change
  React.useEffect(() => {
    setAssignedClass(activeGradesList[0] || 'Grade 1');
  }, [schoolConfig?.schoolLevel]);

  const availableSubjects = schoolConfig?.subjects || [
    'Mathematics', 
    'English', 
    'Amharic', 
    'Science', 
    'Social Studies',
    'Physics',
    'Chemistry'
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
    if (!name.trim()) {
      alert('እባክዎን የመምህሩን ስም ያስገቡ (Please enter teacher name)');
      return;
    }
    if (!phone.trim()) {
      alert('እባክዎን ስልክ ቁጥር ያስገቡ (Please enter phone number)');
      return;
    }
    if (selectedSubjects.length === 0) {
      alert('እባክዎን ቢያንስ አንድ የሚያስተምሩት የትምህርት አይነት ይምረጡ (Select at least one subject)');
      return;
    }

    const randomId = 'TCH-' + Math.floor(1000 + Math.random() * 9000);
    const newTeacher: Teacher = {
      id: randomId,
      name: name.trim(),
      educationLevel,
      phone: phone.trim(),
      subjects: selectedSubjects,
      assignedClass,
      assignedSection,
      isHomeroomTeacher: isHomeroom === 'Yes',
      registeredBy: 'principal@school.com',
      timestamp: new Date().toISOString()
    };

    playInteractiveSound('register');
    onAddTeacher(newTeacher);
    setSuccessMsg(`✅ መምህር ${name} በተሳካ ሁኔታ ተመዝግቧል! መታወቂያው፡ ${randomId} ነው`);
    
    // Reset Form
    setName('');
    setPhone('');
    setSelectedSubjects([]);
    setEducationLevel('Degree');
    setIsHomeroom('No');
    
    setTimeout(() => setSuccessMsg(null), 6000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="teachers-module">
      
      {/* Registration Form */}
      <div className="lg:col-span-5 bg-white border border-stone-200 p-6 rounded-2xl space-y-4 shadow-xs">
        <div>
          <span className="text-[10px] bg-indigo-50 text-indigo-700 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">ርዕሰ መምህር ተግባር</span>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5 mt-1">
            <PlusCircle className="text-indigo-600 w-5 h-5" /> አዲስ መምህር መመዝገቢያ ፎርም
          </h3>
          <p className="text-stone-400 text-xs">Register and assign teaching staff roles and sections</p>
        </div>

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-semibold rounded-xl animate-pulse">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-stone-600 mb-1">የመምህሩ ሙሉ ስም (Teacher Name):</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="አቶ በቀለ አስማማው"
              className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none bg-stone-50/50"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-stone-600 mb-1">የትምህርት ደረጃ (Education):</label>
              <select 
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:border-indigo-600 outline-none bg-white font-medium"
              >
                <option value="Diploma">ዲፕሎማ (Diploma)</option>
                <option value="Degree">መጀመሪያ ዲግሪ (Degree)</option>
                <option value="Masters">ማስተርስ ዲግሪ (Masters)</option>
                <option value="PhD">ፒኤችዲ (PhD)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-600 mb-1">ስልክ ቁጥር (Phone):</label>
              <input 
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0911XXXXXX"
                className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none bg-stone-50/50 font-mono"
                required
              />
            </div>
          </div>

          {/* CHECKBOXES FOR SUBJECT SELECTION */}
          <div>
            <label className="block text-xs font-bold uppercase text-stone-600 mb-1.5">
              የሚያስተምረው የትምህርት አይነት (Subjects taught):
            </label>
            <div className="grid grid-cols-2 gap-2 bg-stone-50 p-3 rounded-xl border border-stone-200/50 max-h-40 overflow-y-auto">
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
                    <span className="truncate">{sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-stone-600 mb-1">ክፍል (Class Allocation):</label>
              <select 
                value={assignedClass}
                onChange={(e) => setAssignedClass(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:border-indigo-600 outline-none bg-white"
              >
                {activeGradesList.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-600 mb-1">ሴክሽን (Section):</label>
              <select 
                value={assignedSection}
                onChange={(e) => setAssignedSection(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:border-indigo-600 outline-none bg-white font-medium"
              >
                <option>A</option>
                <option>B</option>
                <option>C</option>
                <option>D</option>
              </select>
            </div>
          </div>

          {/* HOMEROOM TEACHER DROPDOWN */}
          <div>
            <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
              የክፍል አላፊ/ተጠሪ መምህር (Homeroom Teacher?):
            </label>
            <select 
              value={isHomeroom}
              onChange={(e) => setIsHomeroom(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:border-indigo-600 outline-none bg-white font-medium"
            >
              <option value="No">አይደለም (No)</option>
              <option value="Yes">አዎ የክፍል አላፊ ነው (Yes, Homeroom)</option>
            </select>
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-sm"
          >
            💾 መምህር መዝግብ (Register Teacher)
          </button>
        </form>
      </div>

      {/* Registered Teachers List */}
      <div className="lg:col-span-7 bg-white border border-stone-200 p-6 rounded-2xl space-y-4 shadow-xs">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
            <Users className="text-indigo-600 w-5 h-5" /> በሲስተሙ የተመዘገቡ መምህራን ዝርዝር
          </h3>
          <p className="text-stone-400 text-xs">Active Teaching Staff Database</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-500 uppercase text-[10px] tracking-wider font-bold">
                <th className="p-3 border-b border-stone-100">አይዲ (ID)</th>
                <th className="p-3 border-b border-stone-100">የመምህር ስም</th>
                <th className="p-3 border-b border-stone-100">የት/ት ደረጃ</th>
                <th className="p-3 border-b border-stone-100">ስልክ ቁጥር</th>
                <th className="p-3 border-b border-stone-100">ክፍል / ሴክሽን</th>
                <th className="p-3 border-b border-stone-100">የሚያስተምረው</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-indigo-50/20 border-b border-stone-100 text-stone-800 transition-colors">
                  <td className="p-3 font-mono font-bold text-indigo-700 text-xs">{teacher.id}</td>
                  <td className="p-3 font-semibold text-stone-900">
                    <div className="flex flex-col">
                      <span>{teacher.name}</span>
                      {teacher.isHomeroomTeacher && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 w-max px-1.5 py-0.5 rounded mt-0.5">
                          <Shield className="w-2.5 h-2.5" /> የክፍል አላፊ (Homeroom)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-semibold">
                      {teacher.educationLevel}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-xs text-stone-600">{teacher.phone}</td>
                  <td className="p-3">
                    <span className="text-xs font-bold text-stone-700">
                      {teacher.assignedClass} - {teacher.assignedSection}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1 max-w-40">
                      {teacher.subjects.map((sub, idx) => (
                        <span key={idx} className="bg-stone-100 text-[10px] px-1.5 py-0.5 rounded text-stone-600 truncate">
                          {sub.split(' ')[0]}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {teachers.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-stone-400 italic">ምንም መምህር አልተመዘገበም (No teachers registered yet)</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
