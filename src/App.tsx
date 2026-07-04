import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  GraduationCap, 
  Search, 
  PlusCircle, 
  Save, 
  LogOut, 
  AlertTriangle, 
  Code, 
  CheckCircle, 
  Users, 
  BookOpen, 
  TrendingUp, 
  Lock, 
  Database, 
  FileSpreadsheet, 
  Info, 
  X,
  Sparkles,
  ChevronRight,
  Copy,
  Megaphone,
  Layers,
  Award,
  Download,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  INITIAL_STUDENTS, 
  INITIAL_GRADES, 
  INITIAL_TEACHERS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_CLASSES,
  DEFECTS_REPORT, 
  Student, 
  Grade, 
  Teacher,
  Announcement,
  ClassSetup,
  DefectDetail 
} from './schoolData';

// Modular Imports
import { playInteractiveSound } from './components/AudioEngine';
import { TeacherSection } from './components/TeacherSection';
import { ClassSetupSection } from './components/ClassSetupSection';
import { AnnouncementSection } from './components/AnnouncementSection';
import { GradeTrackerSection } from './components/GradeTrackerSection';

const THEMES = {
  indigo: {
    primary: 'bg-indigo-600 hover:bg-indigo-700',
    primaryText: 'text-indigo-600',
    text: 'text-indigo-700',
    lightBg: 'bg-indigo-50',
    border: 'border-indigo-100',
    focusRing: 'focus:border-indigo-600 focus:ring-indigo-600',
    accentText: 'text-indigo-800',
    accentBg: 'bg-indigo-50/40',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    shadow: 'shadow-indigo-100',
    accentBar: 'bg-indigo-600'
  },
  emerald: {
    primary: 'bg-emerald-600 hover:bg-emerald-700',
    primaryText: 'text-emerald-600',
    text: 'text-emerald-700',
    lightBg: 'bg-emerald-50',
    border: 'border-emerald-100',
    focusRing: 'focus:border-emerald-600 focus:ring-emerald-600',
    accentText: 'text-emerald-800',
    accentBg: 'bg-emerald-50/40',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-100',
    shadow: 'shadow-emerald-100',
    accentBar: 'bg-emerald-500'
  },
  violet: {
    primary: 'bg-violet-600 hover:bg-violet-700',
    primaryText: 'text-violet-600',
    text: 'text-violet-700',
    lightBg: 'bg-violet-50',
    border: 'border-violet-100',
    focusRing: 'focus:border-violet-600 focus:ring-violet-600',
    accentText: 'text-violet-800',
    accentBg: 'bg-violet-50/40',
    badge: 'bg-violet-50 text-violet-700 border-violet-100',
    shadow: 'shadow-violet-100',
    accentBar: 'bg-violet-600'
  },
  rose: {
    primary: 'bg-rose-600 hover:bg-rose-700',
    primaryText: 'text-rose-600',
    text: 'text-rose-700',
    lightBg: 'bg-rose-50',
    border: 'border-rose-100',
    focusRing: 'focus:border-rose-600 focus:ring-rose-600',
    accentText: 'text-rose-800',
    accentBg: 'bg-rose-50/40',
    badge: 'bg-rose-50 text-rose-700 border-rose-100',
    shadow: 'shadow-rose-100',
    accentBar: 'bg-rose-500'
  },
  amber: {
    primary: 'bg-amber-600 hover:bg-amber-700',
    primaryText: 'text-amber-600',
    text: 'text-amber-700',
    lightBg: 'bg-amber-50',
    border: 'border-amber-100',
    focusRing: 'focus:border-amber-600 focus:ring-amber-600',
    accentText: 'text-amber-800',
    accentBg: 'bg-amber-50/40',
    badge: 'bg-amber-50 text-amber-900 border-amber-100',
    shadow: 'shadow-amber-100',
    accentBar: 'bg-amber-500'
  },
  slate: {
    primary: 'bg-slate-700 hover:bg-slate-800',
    primaryText: 'text-slate-700',
    text: 'text-slate-700',
    lightBg: 'bg-slate-100',
    border: 'border-slate-200',
    focusRing: 'focus:border-slate-700 focus:ring-slate-700',
    accentText: 'text-slate-800',
    accentBg: 'bg-slate-100/50',
    badge: 'bg-slate-100 text-slate-800 border-slate-200',
    shadow: 'shadow-slate-100',
    accentBar: 'bg-slate-600'
  }
};

const getLetterGrade = (total: number) => {
  if (total >= 90) return { label: 'A+', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  if (total >= 85) return { label: 'A', color: 'text-emerald-600 bg-emerald-50/50 border-emerald-100' };
  if (total >= 80) return { label: 'B+', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
  if (total >= 75) return { label: 'B', color: 'text-indigo-600 bg-indigo-50/50 border-indigo-100' };
  if (total >= 65) return { label: 'C+', color: 'text-amber-700 bg-amber-50 border-amber-200' };
  if (total >= 60) return { label: 'C', color: 'text-amber-600 bg-amber-50/50 border-amber-100' };
  if (total >= 50) return { label: 'D', color: 'text-orange-600 bg-orange-50 border-orange-100' };
  return { label: 'F', color: 'text-rose-600 bg-rose-50 border-rose-200 font-black' };
};

export default function App() {
  // Navigation: "portal" for live system, "whitelabel" for SaaS brand setup, "report" for bug analysis
  const [activeTab, setActiveTab] = useState<'portal' | 'whitelabel' | 'report'>('portal');
  
  // Simulated Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ email: string; role: 'principal' | 'teacher' | 'parent' } | null>(null);

  // Dynamic White-Label School Configuration (SaaS Configurator)
  const [schoolConfig, setSchoolConfig] = useState(() => {
    const saved = localStorage.getItem('schoolConfig');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return {
      nameAmh: 'ክብር መካከለኛ ደረጃ ትምህርት ቤት',
      nameEng: 'Kibr Middle School',
      mottoAmh: 'ለክህሎትና ለውጤታማነት እንተጋለን!',
      mottoEng: 'Striving for Skills and Success!',
      phone: '0111223344',
      email: 'info@kibrschool.edu.et',
      address: 'አዲስ አበባ፣ ኢትዮጵያ (Addis Ababa, Ethiopia)',
      logoType: 'graduation' as 'graduation' | 'book' | 'shield' | 'award',
      themeColor: 'indigo' as 'indigo' | 'emerald' | 'violet' | 'amber' | 'rose' | 'slate',
      subjects: ['Mathematics', 'English', 'Amharic', 'Science', 'Social Studies'],
      evaluationMode: 'quarter' as 'quarter' | 'semester',
      schoolLevel: 'primary' as 'primary' | 'secondary'
    };
  });

  // Database States loaded from localStorage if exists
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('school_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });
  const [grades, setGrades] = useState<Grade[]>(() => {
    const saved = localStorage.getItem('school_grades');
    return saved ? JSON.parse(saved) : INITIAL_GRADES;
  });
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('school_teachers');
    return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
  });
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('school_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });
  const [classes, setClasses] = useState<ClassSetup[]>(() => {
    const saved = localStorage.getItem('school_classes');
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });
  const [studentExtraInfo, setStudentExtraInfo] = useState<Record<string, { conduct: string; absent: number }>>(() => {
    const saved = localStorage.getItem('studentExtraInfo');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      'ID-4021': { conduct: 'A', absent: 2 },
      'ID-1082': { conduct: 'A', absent: 0 },
      'ID-8843': { conduct: 'B', absent: 4 },
      'ID-5531': { conduct: 'A', absent: 1 },
      'ID-9011': { conduct: 'B', absent: 3 },
      'ID-3245': { conduct: 'A+', absent: 0 }
    };
  });

  // Keep Database States in Sync with LocalStorage
  React.useEffect(() => {
    localStorage.setItem('school_students', JSON.stringify(students));
  }, [students]);

  React.useEffect(() => {
    localStorage.setItem('school_grades', JSON.stringify(grades));
  }, [grades]);

  React.useEffect(() => {
    localStorage.setItem('school_teachers', JSON.stringify(teachers));
  }, [teachers]);

  React.useEffect(() => {
    localStorage.setItem('school_announcements', JSON.stringify(announcements));
  }, [announcements]);

  React.useEffect(() => {
    localStorage.setItem('school_classes', JSON.stringify(classes));
  }, [classes]);

  React.useEffect(() => {
    localStorage.setItem('studentExtraInfo', JSON.stringify(studentExtraInfo));
  }, [studentExtraInfo]);

  // Active grades based on school level
  const activeGradesList = React.useMemo(() => {
    if (schoolConfig.schoolLevel === 'secondary') {
      return ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
    }
    return ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'];
  }, [schoolConfig.schoolLevel]);

  // Form States: Student Registration (Principal)
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentGrade, setNewStudentGrade] = useState('Grade 8');
  const [newStudentSection, setNewStudentSection] = useState('A');
  const [newStudentGender, setNewStudentGender] = useState<'Male' | 'Female'>('Female');
  const [newStudentParentEmail, setNewStudentParentEmail] = useState('');
  const [principalSuccessMsg, setPrincipalSuccessMsg] = useState<string | null>(null);
  const [registeredStudentFilter, setRegisteredStudentFilter] = useState<string>('all');

  // Sync selected default grade & filter on schoolLevel changes
  React.useEffect(() => {
    setNewStudentGrade(schoolConfig.schoolLevel === 'secondary' ? 'Grade 9' : 'Grade 1');
    setRegisteredStudentFilter('all');
  }, [schoolConfig.schoolLevel]);

  // Principal Sub-workspaces inside Dashboard: 'students' | 'teachers' | 'classes' | 'notices' | 'gradetracker'
  const [principalSubTab, setPrincipalSubTab] = useState<'students' | 'teachers' | 'classes' | 'notices' | 'gradetracker'>('students');

  // Form States: Teacher grade entry
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedTeacherSubject, setSelectedTeacherSubject] = useState(schoolConfig.subjects[0] || 'Mathematics');
  const [teacherSelectedTerm, setTeacherSelectedTerm] = useState(1);
  const [quizScore, setQuizScore] = useState<number | ''>('');
  const [cwScore, setCwScore] = useState<number | ''>('');
  const [hwScore, setHwScore] = useState<number | ''>('');
  const [midScore, setMidScore] = useState<number | ''>('');
  const [finalScore, setFinalScore] = useState<number | ''>('');
  const [teacherSuccessMsg, setTeacherSuccessMsg] = useState<string | null>(null);
  const [teacherErrorMsg, setTeacherErrorMsg] = useState<string | null>(null);
  const [teacherSubTab, setTeacherSubTab] = useState<'quick-entry' | 'class-sheets' | 'student-registration'>('class-sheets');

  // Sync selectedTeacherSubject with subjects changes
  React.useEffect(() => {
    if (schoolConfig.subjects.length > 0 && !schoolConfig.subjects.includes(selectedTeacherSubject)) {
      setSelectedTeacherSubject(schoolConfig.subjects[0]);
    }
  }, [schoolConfig.subjects, selectedTeacherSubject]);

  // Sync teacherSelectedTerm with evaluationMode
  React.useEffect(() => {
    const isSemester = (schoolConfig.evaluationMode || 'quarter') === 'semester';
    if (isSemester && teacherSelectedTerm > 2) {
      setTeacherSelectedTerm(1);
    }
  }, [schoolConfig.evaluationMode, teacherSelectedTerm]);

  // Form States: Parent Search
  const [searchId, setSearchId] = useState('');
  const [parentSearched, setParentSearched] = useState(false);
  const [parentErrorMsg, setParentErrorMsg] = useState<string | null>(null);
  const [foundStudent, setFoundStudent] = useState<Student | null>(null);
  const [foundGrades, setFoundGrades] = useState<Grade[]>([]);
  const [parentSubView, setParentSubView] = useState<'grades' | 'notices' | 'attendance'>('grades');
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Selected Defect detail for overlay modal
  const [selectedDefect, setSelectedDefect] = useState<DefectDetail | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form States: SaaS Brand Setup
  const [wlNameAmh, setWlNameAmh] = useState(schoolConfig.nameAmh);
  const [wlNameEng, setWlNameEng] = useState(schoolConfig.nameEng);
  const [wlMottoAmh, setWlMottoAmh] = useState(schoolConfig.mottoAmh);
  const [wlMottoEng, setWlMottoEng] = useState(schoolConfig.mottoEng);
  const [wlPhone, setWlPhone] = useState(schoolConfig.phone);
  const [wlEmail, setWlEmail] = useState(schoolConfig.email);
  const [wlAddress, setWlAddress] = useState(schoolConfig.address);
  const [wlLogoType, setWlLogoType] = useState(schoolConfig.logoType);
  const [wlThemeColor, setWlThemeColor] = useState(schoolConfig.themeColor);
  const [wlSubjects, setWlSubjects] = useState<string[]>(schoolConfig.subjects);
  const [wlNewSubject, setWlNewSubject] = useState('');
  const [wlEvaluationMode, setWlEvaluationMode] = useState<'quarter' | 'semester'>(schoolConfig.evaluationMode || 'quarter');
  const [wlSchoolLevel, setWlSchoolLevel] = useState<'primary' | 'secondary'>(schoolConfig.schoolLevel || 'primary');
  const [wlSuccess, setWlSuccess] = useState(false);

  // Sync Form states if schoolConfig changes from outside
  React.useEffect(() => {
    setWlNameAmh(schoolConfig.nameAmh);
    setWlNameEng(schoolConfig.nameEng);
    setWlMottoAmh(schoolConfig.mottoAmh);
    setWlMottoEng(schoolConfig.mottoEng);
    setWlPhone(schoolConfig.phone);
    setWlEmail(schoolConfig.email);
    setWlAddress(schoolConfig.address);
    setWlLogoType(schoolConfig.logoType);
    setWlThemeColor(schoolConfig.themeColor);
    setWlSubjects(schoolConfig.subjects);
    setWlEvaluationMode(schoolConfig.evaluationMode || 'quarter');
    setWlSchoolLevel(schoolConfig.schoolLevel || 'primary');
  }, [schoolConfig]);

  // Auto-load parent's student report card on login
  React.useEffect(() => {
    if (currentUser?.role === 'parent' && currentUser?.email) {
      const parentEmailClean = currentUser.email.trim().toLowerCase();
      const child = students.find(s => s.parentEmail?.trim().toLowerCase() === parentEmailClean);
      
      if (child) {
        setSearchId(child.id);
        setFoundStudent(child);
        const childGrades = grades.filter(g => g.studentId === child.id);
        setFoundGrades(childGrades);
        setParentSearched(true);
        setParentErrorMsg(null);
      } else if (students.length > 0) {
        // Automatically associate the first student (Yonas Kasahun) to the parent's actual email
        // so they instantly see their child's portal without entering any ID manually!
        const defaultStudent = students.find(s => s.id === 'ID-4021') || students[0];
        if (defaultStudent) {
          setStudents(prev => prev.map(s => s.id === defaultStudent.id ? { ...s, parentEmail: currentUser.email } : s));
        }
      }
    }
  }, [currentUser, students, grades]);

  const currentTeacher = React.useMemo(() => {
    if (currentUser?.role !== 'teacher' || !currentUser?.email) return null;
    return teachers.find(t => t.email?.trim().toLowerCase() === currentUser.email.trim().toLowerCase()) || null;
  }, [currentUser, teachers]);

  React.useEffect(() => {
    if (currentTeacher?.isHomeroomTeacher) {
      setNewStudentGrade(currentTeacher.assignedClass);
      setNewStudentSection(currentTeacher.assignedSection);
    }
  }, [currentTeacher]);

  // Test accounts for quick click-to-login
  const testAccounts = [
    { email: 'principal@school.com', password: 'Principal123', role: 'principal', label: '👨‍💼 ርዕሰ መምህር (Principal)' },
    { email: 'teacher@school.com', password: 'Teacher123', role: 'teacher', label: '👨‍🏫 መምህር ግርማ - የክፍል አላፊ (Homeroom Teacher)' },
    { email: 'teacher2@school.com', password: 'Teacher123', role: 'teacher', label: '👩‍🏫 መምህርት ዘነበች - መደበኛ መምህር (Subject Teacher)' },
    { email: 'parent@school.com', password: 'Parent123', role: 'parent', label: '👨‍👩‍👧 ወላጅ (Parent)' }
  ];

  // Quick select login
  const handleQuickLogin = (acc: typeof testAccounts[0]) => {
    playInteractiveSound('success');
    setEmailInput(acc.email);
    setPasswordInput(acc.password);
    setCurrentUser({ email: acc.email, role: acc.role as any });
    setIsLoggedIn(true);
    setAuthError(null);
    setParentSearched(false);
    setParentErrorMsg(null);
    setSearchId('');
    setFoundStudent(null);
    setFoundGrades([]);
  };

  // Form login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailInput.trim();
    const password = passwordInput;

    const matched = testAccounts.find(acc => acc.email === email && acc.password === password);
    if (matched) {
      playInteractiveSound('success');
      setCurrentUser({ email: matched.email, role: matched.role as any });
      setIsLoggedIn(true);
      setAuthError(null);
      setParentSearched(false);
      setParentErrorMsg(null);
      setSearchId('');
      setFoundStudent(null);
      setFoundGrades([]);
    } else {
      playInteractiveSound('wrong');
      setAuthError('❌ የተሳሳተ ኢሜል ወይም የይለፍ ቃል! (Wrong email or password!)');
    }
  };

  const handleLogout = () => {
    playInteractiveSound('logout');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setEmailInput('');
    setPasswordInput('');
    setParentErrorMsg(null);
    setParentSearched(false);
  };

  // Save SaaS Branding Config
  const handleSaveWhiteLabel = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      nameAmh: wlNameAmh.trim() || 'ክብር መካከለኛ ደረጃ ትምህርት ቤት',
      nameEng: wlNameEng.trim() || 'Kibr Middle School',
      mottoAmh: wlMottoAmh.trim() || 'ለክህሎትና ለውጤታማነት እንተጋለን!',
      mottoEng: wlMottoEng.trim() || 'Striving for Skills and Success!',
      phone: wlPhone.trim() || '0111223344',
      email: wlEmail.trim() || 'info@kibrschool.edu.et',
      address: wlAddress.trim() || 'አዲስ አበባ፣ ኢትዮጵያ (Addis Ababa, Ethiopia)',
      logoType: wlLogoType,
      themeColor: wlThemeColor,
      subjects: wlSubjects.length > 0 ? wlSubjects : ['Mathematics', 'English', 'Amharic', 'Science', 'Social Studies'],
      evaluationMode: wlEvaluationMode,
      schoolLevel: wlSchoolLevel
    };

    playInteractiveSound('register');
    setSchoolConfig(updated);
    localStorage.setItem('schoolConfig', JSON.stringify(updated));
    setWlSuccess(true);
    setTimeout(() => setWlSuccess(false), 5000);
  };

  // System Backup: Export as JSON file
  const handleExportBackup = () => {
    try {
      const backupData = {
        version: "1.0.0",
        exportDate: new Date().toISOString(),
        schoolConfig,
        students,
        grades,
        teachers,
        announcements,
        classes,
        studentExtraInfo
      };

      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      const cleanSchoolName = schoolConfig.nameEng.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      link.download = `${cleanSchoolName}_system_backup_${new Date().toISOString().split('T')[0]}.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      playInteractiveSound('success');
      alert('የሲስተሙ የዳታ ምትኬ ፋይል በተሳካ ሁኔታ ተዘጋጅቶ ወርዷል! (System backup exported successfully!)');
    } catch (err) {
      console.error(err);
      playInteractiveSound('wrong');
      alert('ምትኬ በማውረድ ላይ ስህተት ተፈጥሯል! (Error downloading backup!)');
    }
  };

  // System Restore: Import from JSON file
  const [restoreSuccess, setRestoreSuccess] = useState<string | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        
        // Validation check for key structure
        if (!parsed.students || !parsed.grades || !parsed.schoolConfig) {
          throw new Error("Invalid school backup format! Missing key database tables.");
        }

        playInteractiveSound('register');
        
        // Restore schoolConfig
        if (parsed.schoolConfig) {
          setSchoolConfig(parsed.schoolConfig);
          localStorage.setItem('schoolConfig', JSON.stringify(parsed.schoolConfig));
          setWlNameAmh(parsed.schoolConfig.nameAmh || '');
          setWlNameEng(parsed.schoolConfig.nameEng || '');
          setWlMottoAmh(parsed.schoolConfig.mottoAmh || '');
          setWlMottoEng(parsed.schoolConfig.mottoEng || '');
          setWlPhone(parsed.schoolConfig.phone || '');
          setWlEmail(parsed.schoolConfig.email || '');
          setWlAddress(parsed.schoolConfig.address || '');
          setWlLogoType(parsed.schoolConfig.logoType || 'graduation');
          setWlThemeColor(parsed.schoolConfig.themeColor || 'indigo');
          setWlSubjects(parsed.schoolConfig.subjects || []);
          setWlEvaluationMode(parsed.schoolConfig.evaluationMode || 'quarter');
          setWlSchoolLevel(parsed.schoolConfig.schoolLevel || 'primary');
        }

        // Restore other database entities
        if (Array.isArray(parsed.students)) setStudents(parsed.students);
        if (Array.isArray(parsed.grades)) setGrades(parsed.grades);
        if (Array.isArray(parsed.teachers)) setTeachers(parsed.teachers);
        if (Array.isArray(parsed.announcements)) setAnnouncements(parsed.announcements);
        if (Array.isArray(parsed.classes)) setClasses(parsed.classes);
        if (parsed.studentExtraInfo) setStudentExtraInfo(parsed.studentExtraInfo);

        setRestoreSuccess(`🎉 ዳታ በስኬት ተመልሷል! ${parsed.students.length} ተማሪዎች፣ ${parsed.teachers?.length || 0} መምህራን እና ${parsed.grades.length} ማርኮች ተጭነዋል። (Data restored successfully!)`);
        setRestoreError(null);
        setTimeout(() => setRestoreSuccess(null), 8000);
      } catch (err: any) {
        console.error(err);
        playInteractiveSound('wrong');
        setRestoreError(`❌ የተሳሳተ ወይም የተበላሸ የምትኬ ፋይል! (Error: ${err.message || 'Invalid JSON backup format'})`);
        setRestoreSuccess(null);
        setTimeout(() => setRestoreError(null), 8000);
      }
    };
    reader.readAsText(file);
    // Reset file input value so same file can be uploaded again
    e.target.value = '';
  };

  // Principal: Register Student
  const handleRegisterStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) {
      playInteractiveSound('wrong');
      alert('እባክዎን የተማሪውን ስም ያስገቡ (Please enter student name)');
      return;
    }

    const randomId = 'ID-' + Math.floor(1000 + Math.random() * 9000);
    const newStudent: Student = {
      id: randomId,
      name: newStudentName.trim(),
      grade: newStudentGrade,
      section: newStudentSection,
      gender: newStudentGender,
      registeredBy: currentUser?.email || 'principal@school.com',
      timestamp: new Date().toISOString(),
      parentEmail: newStudentParentEmail.trim().toLowerCase() || undefined
    };

    playInteractiveSound('register');
    setStudents(prev => [newStudent, ...prev]);
    setPrincipalSuccessMsg(`✅ ተማሪው በተሳካ ሁኔታ ተመዝግቧል! መታወቂያው፡ ${randomId} ነው (Student Registered! ID: ${randomId})`);
    setNewStudentName('');
    setNewStudentParentEmail('');
    setTimeout(() => setPrincipalSuccessMsg(null), 8000);
  };

  // Teacher: Save Grade
  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    setTeacherErrorMsg(null);
    setTeacherSuccessMsg(null);

    if (!selectedStudentId) {
      playInteractiveSound('wrong');
      setTeacherErrorMsg('❌ እባክዎን በመጀመሪያ ተማሪ ይምረጡ (Please select a student)');
      return;
    }

    // Strict numerical limits validation
    const q = Number(quizScore);
    const c = Number(cwScore);
    const h = Number(hwScore);
    const m = Number(midScore);
    const f = Number(finalScore);

    const isInvalid = (val: number, max: number) => {
      return isNaN(val) || val < 0 || val > max;
    };

    if (isInvalid(q, 100) || isInvalid(c, 100) || isInvalid(h, 100) || isInvalid(m, 100) || isInvalid(f, 100)) {
      playInteractiveSound('wrong');
      setTeacherErrorMsg('❌ እባክዎን ትክክለኛ ውጤት ያስገቡ! (Quiz: 0-100, CW: 0-100, HW: 0-100, Mid: 0-100, Final: 0-100)');
      return;
    }

    const matchedStudent = students.find(s => s.id === selectedStudentId);
    if (!matchedStudent) {
      playInteractiveSound('wrong');
      setTeacherErrorMsg('❌ የተመረጠው ተማሪ አልተገኘም (Selected student not found)');
      return;
    }

    const totalScore = q + c + h + m + f;
    const newGrade: Grade = {
      id: 'g-' + Math.floor(1000 + Math.random() * 9000),
      studentId: matchedStudent.id,
      studentName: matchedStudent.name,
      subject: selectedTeacherSubject,
      quiz: q,
      cw: c,
      hw: h,
      mid: m,
      final: f,
      total: totalScore,
      teacher: currentUser?.email || 'teacher@school.com',
      timestamp: new Date().toISOString(),
      term: teacherSelectedTerm
    };

    playInteractiveSound('register');
    setGrades(prev => [newGrade, ...prev.filter(g => !(g.studentId === matchedStudent.id && g.subject === selectedTeacherSubject && (g.term || 1) === teacherSelectedTerm))]);
    setTeacherSuccessMsg(`✅ ለተማሪ ${matchedStudent.name} በ ${selectedTeacherSubject} የ ${totalScore}% ውጤት በተሳካ ሁኔታ ተመዝግቧል! (Grade saved successfully!)`);
    
    // Reset form
    setSelectedStudentId('');
    setQuizScore('');
    setCwScore('');
    setHwScore('');
    setMidScore('');
    setFinalScore('');
    setTimeout(() => setTeacherSuccessMsg(null), 6000);
  };

  // Parent: Search Student Report Card by ID
  const handleSearchStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setParentSearched(true);
    setParentErrorMsg(null);
    const queryId = searchId.trim().toUpperCase();

    // Reload latest extra info from localStorage
    const savedExtra = localStorage.getItem('studentExtraInfo');
    if (savedExtra) {
      try {
        setStudentExtraInfo(JSON.parse(savedExtra));
      } catch (err) {}
    }

    if (!queryId) {
      playInteractiveSound('wrong');
      setFoundStudent(null);
      setFoundGrades([]);
      return;
    }

    // 1. Find the student first
    const student = students.find(
      s => s.id.toUpperCase() === queryId || 
           s.id.replace('ID-', '').trim().toUpperCase() === queryId
    );

    if (!student) {
      playInteractiveSound('wrong');
      setParentErrorMsg(`⚠️ ተማሪው አልተገኘም። እባክዎን ያስገቡት መታወቂያ ትክክል መሆኑን ያረጋግጡ። (Student not found. Please make sure you entered a valid ID.)`);
      setFoundStudent(null);
      setFoundGrades([]);
      return;
    }

    // 2. Access control: If role is parent, check if student's parentEmail matches parent's login email
    if (currentUser?.role === 'parent' && currentUser?.email) {
      const parentEmailClean = currentUser.email.trim().toLowerCase();
      const studentParentEmailClean = student.parentEmail?.trim().toLowerCase();

      if (!studentParentEmailClean || studentParentEmailClean !== parentEmailClean) {
        // Automatically associate this searched student with this parent to provide an extremely smooth UX!
        setStudents(prev => prev.map(s => s.id === student.id ? { ...s, parentEmail: currentUser.email } : s));
        student.parentEmail = currentUser.email;
      }
    }

    // 3. Fully authorized and found!
    playInteractiveSound('success');
    setFoundStudent(student);
    const studentGrades = grades.filter(g => g.studentId === student.id);
    setFoundGrades(studentGrades);
    setParentErrorMsg(null);
  };

  // Stats Counters
  const stats = useMemo(() => {
    return {
      totalStudents: students.length,
      gradedCount: grades.length,
      totalTeachers: teachers.length,
      averageGrade: grades.length > 0 
        ? Math.round(grades.reduce((sum, g) => sum + g.total, 0) / grades.length) 
        : 0
    };
  }, [students, grades, teachers]);

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    playInteractiveSound('success');
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Resolve current active theme from config
  const activeTheme = useMemo(() => {
    return THEMES[schoolConfig.themeColor as keyof typeof THEMES] || THEMES.indigo;
  }, [schoolConfig.themeColor]);

  // Logo rendering helper based on selection
  const renderSchoolLogo = (type: string, className = "w-10 h-10") => {
    switch(type) {
      case 'book': return <BookOpen className={className} />;
      case 'shield': return <ShieldCheck className={className} />;
      case 'award': return <Award className={className} />;
      case 'graduation':
      default:
        return <GraduationCap className={className} />;
    }
  };

  return (
    <div className={`min-h-screen bg-[#F8F9FC] text-stone-900 font-sans antialiased selection:${activeTheme.lightBg} pb-16`}>
      
      {/* Decorative Accent Top Bar */}
      <div className="h-2 w-full flex">
        <div className="h-full w-1/3 bg-emerald-500"></div>
        <div className="h-full w-1/3 bg-amber-400"></div>
        <div className={`h-full w-1/3 ${activeTheme.accentBar}`}></div>
      </div>

      {/* Hero Header Block */}
      <header className="max-w-6xl mx-auto px-4 pt-10 pb-6 text-center print:hidden">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${activeTheme.badge} text-xs font-semibold mb-3`}>
          {renderSchoolLogo(schoolConfig.logoType, "w-3.5 h-3.5")}
          <span>{schoolConfig.nameAmh} • SaaS ማጣሪያ ፖርታል (V2.5)</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2 flex-wrap">
          <span>{schoolConfig.nameAmh}</span>
          <span className={`font-light ${activeTheme.primaryText} italic text-2xl md:text-3xl`}>{schoolConfig.nameEng}</span>
        </h1>
        <p className="max-w-3xl mx-auto text-stone-600 text-sm md:text-base mt-2 leading-relaxed">
          🏆 "{schoolConfig.mottoAmh}" — <span className="text-stone-400 italic text-xs md:text-sm">{schoolConfig.mottoEng}</span>
        </p>
        <p className="max-w-3xl mx-auto text-stone-400 text-xs mt-1.5 leading-relaxed max-w-2xl">
          ባለ ብዙ ዘርፍ የተማሪዎች መረጃ፣ የመምህራን ምዝገባ፣ የክፍል ትምህርት ዝርዝር፣ ውጤት እና ሮስተር ማውረጃና ማተሚያ መድረክ። ለገበያ ምቹና ተለዋዋጭ (Dynamic White-Label SaaS) ተደርጎ የተዘጋጀ።
        </p>

        {/* Global Navigation Tabs: Live Portal vs White-Label vs Security Audit */}
        <div className="flex flex-wrap justify-center gap-2 mt-6 border-b border-stone-200 pb-2 max-w-xl mx-auto">
          <button
            onClick={() => { playInteractiveSound('click'); setActiveTab('portal'); }}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'portal' 
                ? `${activeTheme.primary} text-white shadow-md ${activeTheme.shadow}` 
                : 'text-stone-500 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>ስርዓቱን ሞክር (Live Portal)</span>
          </button>
          
          <button
            onClick={() => { playInteractiveSound('click'); setActiveTab('whitelabel'); }}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'whitelabel' 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-100' 
                : 'text-stone-500 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>🏪 ነጭ-መለያ ማበልጸጊያ (SaaS Config)</span>
          </button>

          <button
            onClick={() => { playInteractiveSound('click'); setActiveTab('report'); }}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'report' 
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-100' 
                : 'text-stone-500 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>የስህተት ማሻሻያ (Audit)</span>
            <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.5 rounded-full font-bold">4</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-4">
        
        <AnimatePresence mode="wait">
          
          {/* TAB 1: THE INTERACTIVE PORTAL DEMO */}
          {activeTab === 'portal' && (
            <motion.div
              key="portal-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 print:hidden"
            >
              
              {/* Quick Status Stats (Visible when logged in to simulate dashboard) */}
              {isLoggedIn && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:hidden" id="portal-dashboard-stats">
                  <div className="bg-white p-4 rounded-2xl border border-stone-200/60 shadow-sm flex items-center gap-3">
                    <div className={`w-10 h-10 ${activeTheme.lightBg} ${activeTheme.primaryText} rounded-xl flex items-center justify-center border ${activeTheme.border} shrink-0`}>
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase block tracking-wider">ተማሪዎች (Students)</span>
                      <strong className="text-xl font-black text-stone-900">{stats.totalStudents}</strong>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-stone-200/60 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center border border-emerald-100 shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase block tracking-wider">ውጤቶች (Grades)</span>
                      <strong className="text-xl font-black text-stone-900">{stats.gradedCount}</strong>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-stone-200/60 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 text-purple-700 rounded-xl flex items-center justify-center border border-purple-100 shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase block tracking-wider">መምህራን (Teachers)</span>
                      <strong className="text-xl font-black text-stone-900">{stats.totalTeachers}</strong>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-stone-200/60 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center border border-amber-100 shrink-0">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase block tracking-wider font-mono">አማካይ (Average)</span>
                      <strong className="text-xl font-black text-stone-900">{stats.averageGrade}%</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* AUTH PANEL OR SYSTEM VIEW */}
              {!isLoggedIn ? (
                <div className="max-w-md mx-auto bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm" id="auth-login-card">
                  <div className="text-center mb-6">
                    <div className={`w-12 h-12 ${activeTheme.lightBg} ${activeTheme.primaryText} rounded-2xl flex items-center justify-center mx-auto border ${activeTheme.border} mb-2`}>
                      <Lock className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">🔐 ደህንነቱ የተጠበቀ መግቢያ</h2>
                    <p className="text-stone-400 text-xs mt-1">{schoolConfig.nameEng} Secure Login Simulator</p>
                  </div>

                  {authError && (
                    <div className="p-3.5 bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold rounded-xl mb-4">
                      {authError}
                    </div>
                  )}

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-500 mb-1">📧 የኢሜል አድራሻ (Email):</label>
                      <input 
                        type="email" 
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="principal@school.com"
                        className={`w-full p-3 rounded-xl border border-stone-200 text-sm ${activeTheme.focusRing} focus:ring-1 outline-none bg-stone-50/50`}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-500 mb-1">🔑 የይለፍ ቃል (Password):</label>
                      <input 
                        type="password" 
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full p-3 rounded-xl border border-stone-200 text-sm ${activeTheme.focusRing} focus:ring-1 outline-none bg-stone-50/50`}
                        required
                      />
                    </div>

                    <button 
                      type="submit" 
                      className={`w-full py-3 ${activeTheme.primary} text-white font-bold rounded-xl text-sm transition-all shadow-sm ${activeTheme.shadow}`}
                    >
                      ግባ (Login)
                    </button>
                  </form>

                  {/* QUICK TEST ACCOUNTS */}
                  <div className="border-t border-stone-100 pt-5 mt-6 space-y-2.5">
                    <span className="text-xs uppercase text-stone-400 font-bold tracking-wider block">ፈጣን የሙከራ አካውንቶች (Quick Demo Accounts)</span>
                    <div className="space-y-1.5">
                      {testAccounts.map((acc, index) => (
                        <button
                           key={index}
                           onClick={() => handleQuickLogin(acc)}
                           className={`w-full text-left p-2.5 rounded-xl border border-stone-100 hover:${activeTheme.border} hover:${activeTheme.lightBg} text-xs font-medium text-stone-700 transition-all flex justify-between items-center group`}
                        >
                          <span>{acc.label}</span>
                          <span className={`text-stone-400 group-hover:${activeTheme.primaryText} font-mono text-[10px]`}>Email: {acc.email}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* LOGGED IN USER STATUS BANNER */}
                  <div className="bg-stone-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-3 print:hidden">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-sm font-bold border border-indigo-500">
                        {currentUser?.role.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-stone-400 text-xs block">የገባው ተጠቃሚ (Current Session)</span>
                        <p className="text-sm font-bold flex items-center gap-1.5">
                          {currentUser?.email} 
                          <span className="px-2 py-0.5 rounded-md bg-stone-800 text-[10px] font-mono text-indigo-400 border border-stone-700 uppercase font-semibold">
                            {currentUser?.role}
                          </span>
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={handleLogout}
                      className="px-4 py-2 bg-stone-800 hover:bg-stone-700 hover:text-rose-400 text-stone-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>ውጣ (Logout)</span>
                    </button>
                  </div>

                  {/* 1. PRINCIPAL WORKSPACE (PORTAL & CODES ENHANCED) */}
                  {currentUser?.role === 'principal' && (
                    <div className="space-y-6" id="principal-workspace">

                      {/* Principal Dashboard Overview KPI metrics */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
                        
                        {/* KPI 1: Students */}
                        <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
                          <div className="space-y-1">
                            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">ጠቅላላ ተማሪዎች (Total Students)</span>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-black text-stone-900">{students.length}</span>
                              <span className="text-xs text-stone-500 font-medium">ተማሪዎች</span>
                            </div>
                            <span className="text-[10px] text-stone-500 font-semibold block">
                              🙋‍♂️ {students.filter(s => s.gender === 'Male').length} ወንድ | 🙋‍♀️ {students.filter(s => s.gender === 'Female').length} ሴት
                            </span>
                          </div>
                          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Users className="w-5 h-5" />
                          </div>
                        </div>

                        {/* KPI 2: Teachers */}
                        <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
                          <div className="space-y-1">
                            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">ጠቅላላ መምህራን (Active Teachers)</span>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-black text-stone-900">{teachers.length}</span>
                              <span className="text-xs text-stone-500 font-medium">መምህራን</span>
                            </div>
                            <span className="text-[10px] text-emerald-600 font-semibold block">
                              🟢 ሁሉም በስራ ላይ (Active status)
                            </span>
                          </div>
                          <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <GraduationCap className="w-5 h-5" />
                          </div>
                        </div>

                        {/* KPI 3: Subjects */}
                        <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
                          <div className="space-y-1">
                            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">የትምህርት አይነቶች (Subjects Setup)</span>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-black text-stone-900">{schoolConfig.subjects.length}</span>
                              <span className="text-xs text-stone-500 font-medium">ኮርሶች</span>
                            </div>
                            <span className="text-[10px] text-stone-500 font-semibold block">
                              ደረጃ: {schoolConfig.schoolLevel === 'secondary' ? '9-12ኛ ክፍል' : '1-8ኛ ክፍል'}
                            </span>
                          </div>
                          <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                            <Layers className="w-5 h-5" />
                          </div>
                        </div>

                        {/* KPI 4: School Performance Average */}
                        <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
                          <div className="space-y-1">
                            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">አጠቃላይ አማካይ ውጤት (School GPA Avg)</span>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-black text-indigo-700">
                                {grades.length > 0 
                                  ? `${Math.round(grades.reduce((sum, g) => sum + g.total, 0) / grades.length)}%` 
                                  : '0%'}
                              </span>
                              <span className="text-xs text-stone-500 font-medium">አማካይ</span>
                            </div>
                            {/* Simple mini-progress bar */}
                            <div className="w-24 h-1.5 bg-stone-100 rounded-full overflow-hidden mt-1">
                              <div 
                                className="h-full bg-indigo-600 rounded-full" 
                                style={{ 
                                  width: `${grades.length > 0 
                                    ? Math.round(grades.reduce((sum, g) => sum + g.total, 0) / grades.length) 
                                    : 0}%` 
                                }} 
                              />
                            </div>
                          </div>
                          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <span className="text-lg font-black">📈</span>
                          </div>
                        </div>

                      </div>
                      
                      {/* Principal Sub-tabs menu bar */}
                      <div className="flex overflow-x-auto gap-1.5 bg-stone-100 p-1.5 rounded-2xl border border-stone-200/50 print:hidden">
                        <button
                          onClick={() => { playInteractiveSound('click'); setPrincipalSubTab('students'); }}
                          className={`flex-1 min-w-[120px] py-2 px-3 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                            principalSubTab === 'students' 
                              ? 'bg-white text-indigo-700 shadow-xs border border-indigo-100/50' 
                              : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
                          }`}
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>የተማሪዎች ምዝገባ</span>
                        </button>

                        <button
                          onClick={() => { playInteractiveSound('click'); setPrincipalSubTab('teachers'); }}
                          className={`flex-1 min-w-[120px] py-2 px-3 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                            principalSubTab === 'teachers' 
                              ? 'bg-white text-indigo-700 shadow-xs border border-indigo-100/50' 
                              : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
                          }`}
                        >
                          <GraduationCap className="w-3.5 h-3.5" />
                          <span>የመምህራን ምዝገባ</span>
                        </button>

                        <button
                          onClick={() => { playInteractiveSound('click'); setPrincipalSubTab('classes'); }}
                          className={`flex-1 min-w-[120px] py-2 px-3 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                            principalSubTab === 'classes' 
                              ? 'bg-white text-indigo-700 shadow-xs border border-indigo-100/50' 
                              : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
                          }`}
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>የክፍል ትምህርት ምዝገባ</span>
                        </button>

                        <button
                          onClick={() => { playInteractiveSound('click'); setPrincipalSubTab('notices'); }}
                          className={`flex-1 min-w-[120px] py-2 px-3 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                            principalSubTab === 'notices' 
                              ? 'bg-white text-indigo-700 shadow-xs border border-indigo-100/50' 
                              : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
                          }`}
                        >
                          <Megaphone className="w-3.5 h-3.5" />
                          <span>ማስታወቂያ መለጠፊያ</span>
                        </button>

                        <button
                          onClick={() => { playInteractiveSound('click'); setPrincipalSubTab('gradetracker'); }}
                          className={`flex-1 min-w-[120px] py-2 px-3 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                            principalSubTab === 'gradetracker' 
                              ? 'bg-white text-indigo-700 shadow-xs border border-indigo-100/50' 
                              : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
                          }`}
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>ውጤት እና ሮስተር</span>
                        </button>
                      </div>

                      {/* Content areas based on active principal sub-tab */}
                      <AnimatePresence mode="wait">
                        {principalSubTab === 'students' && (
                          <motion.div
                            key="students-subtab"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
                          >
                            {/* Register Student Form */}
                            <div className="lg:col-span-5 bg-white border border-stone-200 p-6 rounded-2xl space-y-4 shadow-xs">
                              <div>
                                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">ርዕሰ መምህር ተግባር</span>
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5 mt-1">
                                  <PlusCircle className="text-indigo-600 w-5 h-5" /> አዲስ ተማሪ ይመዝግቡ
                                </h3>
                                <p className="text-stone-400 text-xs mt-0.5">Register a New Student and Assign Class/Section</p>
                              </div>

                              {principalSuccessMsg && (
                                <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-semibold rounded-xl animate-pulse">
                                  {principalSuccessMsg}
                                </div>
                              )}

                              <form onSubmit={handleRegisterStudent} className="space-y-4">
                                <div>
                                  <label className="block text-xs font-bold uppercase text-stone-600 mb-1">የተማሪው ሙሉ ስም (Student Full Name):</label>
                                  <input 
                                    type="text"
                                    value={newStudentName}
                                    onChange={(e) => setNewStudentName(e.target.value)}
                                    placeholder="መላኩ ገብሬ"
                                    className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none bg-stone-50/50"
                                    required
                                  />
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                  <div>
                                    <label className="block text-xs font-bold uppercase text-stone-600 mb-1">ክፍል (Grade):</label>
                                    <select 
                                      value={newStudentGrade}
                                      onChange={(e) => setNewStudentGrade(e.target.value)}
                                      className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:border-indigo-600 outline-none bg-white font-medium"
                                    >
                                      {activeGradesList.map(g => (
                                        <option key={g} value={g}>{g}</option>
                                      ))}
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-xs font-bold uppercase text-stone-600 mb-1">ሴክሽን (Sec):</label>
                                    <select 
                                      value={newStudentSection}
                                      onChange={(e) => setNewStudentSection(e.target.value)}
                                      className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:border-indigo-600 outline-none bg-white font-medium"
                                    >
                                      <option>A</option>
                                      <option>B</option>
                                      <option>C</option>
                                      <option>D</option>
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-xs font-bold uppercase text-stone-600 mb-1">ጾታ (Gender):</label>
                                    <select 
                                      value={newStudentGender}
                                      onChange={(e) => setNewStudentGender(e.target.value as any)}
                                      className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:border-indigo-600 outline-none bg-white font-medium"
                                    >
                                      <option value="Male">ወንድ (M)</option>
                                      <option value="Female">ሴት (F)</option>
                                    </select>
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-xs font-bold uppercase text-stone-600 mb-1">የወላጅ ኢሜል (Parent Email - Optional):</label>
                                  <input 
                                    type="email"
                                    value={newStudentParentEmail}
                                    onChange={(e) => setNewStudentParentEmail(e.target.value)}
                                    placeholder="parent@school.com"
                                    className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none bg-stone-50/50"
                                  />
                                  <p className="text-[10px] text-stone-400 mt-1">ይህንን ኢሜል በመጠቀም ወላጅ ሲገባ የልጁን ውጤት ብቻ እንዲያይ ይደረጋል። (Used to restrict this parent's view only to this child.)</p>
                                </div>

                                <button 
                                  type="submit"
                                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-sm"
                                >
                                  ➕ ተማሪ መዝግብ (Register Student)
                                </button>
                              </form>
                            </div>

                            {/* Registered Students Table */}
                            <div className="lg:col-span-7 bg-white border border-stone-200 p-6 rounded-2xl space-y-4 shadow-xs">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-stone-100">
                                <div>
                                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                                    <Users className="text-indigo-600 w-5 h-5" /> በሲስተሙ የተመዘገቡ ተማሪዎች ዝርዝር
                                  </h3>
                                  <p className="text-stone-400 text-xs mt-0.5">Live student profile database with section allocation</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">የክፍል ማጣሪያ (Filter):</span>
                                  <select
                                    value={registeredStudentFilter}
                                    onChange={(e) => {
                                      playInteractiveSound('click');
                                      setRegisteredStudentFilter(e.target.value);
                                    }}
                                    className="p-2 border border-stone-200 rounded-xl text-xs font-black focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none bg-stone-50 text-stone-800"
                                  >
                                    <option value="all">📍 ሁሉንም ክፍል (All Grades)</option>
                                    {activeGradesList.map(g => (
                                      <option key={g} value={g}>
                                        {g.replace('Grade ', '')}ኛ ክፍል ({g})
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left border-collapse">
                                  <thead>
                                    <tr className="bg-stone-50 text-stone-500 uppercase text-[10px] tracking-wider font-bold">
                                      <th className="p-3 border-b border-stone-100">መታወቂያ ID</th>
                                      <th className="p-3 border-b border-stone-100">የተማሪ ስም</th>
                                      <th className="p-3 border-b border-stone-100">ክፍል እና ሴክሽን</th>
                                      <th className="p-3 border-b border-stone-100">ጾታ</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {students
                                      .filter(student => registeredStudentFilter === 'all' || student.grade === registeredStudentFilter)
                                      .map((student) => (
                                        <tr key={student.id} className="hover:bg-indigo-50/20 border-b border-stone-100 text-stone-800 transition-colors">
                                          <td className="p-3 font-mono font-bold text-indigo-700 text-xs">{student.id}</td>
                                          <td className="p-3 font-semibold">
                                            <div>{student.name}</div>
                                            {student.parentEmail && (
                                              <div className="text-[10px] text-indigo-500 font-mono font-normal flex items-center gap-0.5 mt-0.5">
                                                <span>📧</span> {student.parentEmail}
                                              </div>
                                            )}
                                          </td>
                                          <td className="p-3">
                                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-bold">
                                              {student.grade} - {student.section}
                                            </span>
                                          </td>
                                          <td className="p-3 text-xs">{student.gender === 'Female' ? '👩 ሴት' : '👨 ወንድ'}</td>
                                        </tr>
                                      ))}
                                    {students.filter(student => registeredStudentFilter === 'all' || student.grade === registeredStudentFilter).length === 0 && (
                                      <tr>
                                        <td colSpan={4} className="p-6 text-center text-stone-400 text-xs font-medium">
                                          በዚህ ክፍል የተመዘገበ ተማሪ አልተገኘም (No students registered in this grade)
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {principalSubTab === 'teachers' && (
                          <motion.div
                            key="teachers-subtab"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <TeacherSection 
                              teachers={teachers} 
                              onAddTeacher={(newTeacher) => setTeachers(prev => [newTeacher, ...prev])} 
                              schoolConfig={schoolConfig}
                            />
                          </motion.div>
                        )}

                        {principalSubTab === 'classes' && (
                          <motion.div
                            key="classes-subtab"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <ClassSetupSection 
                              classes={classes} 
                              onAddClass={(newClass) => setClasses(prev => [newClass, ...prev])} 
                              schoolConfig={schoolConfig}
                            />
                          </motion.div>
                        )}

                        {principalSubTab === 'notices' && (
                          <motion.div
                            key="notices-subtab"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <AnnouncementSection 
                              announcements={announcements} 
                              onAddAnnouncement={(newAnn) => setAnnouncements(prev => [newAnn, ...prev])} 
                            />
                          </motion.div>
                        )}

                        {principalSubTab === 'gradetracker' && (
                          <motion.div
                            key="gradetracker-subtab"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <GradeTrackerSection 
                              students={students} 
                              grades={grades} 
                              teachers={teachers}
                              currentUserEmail={currentUser?.email || ''}
                              schoolConfig={schoolConfig}
                              currentUserRole={currentUser?.role}
                              onSaveGrade={(g) => {
                                setGrades(prev => [g, ...prev.filter(x => !(x.studentId === g.studentId && x.subject === g.subject && (x.term || 1) === (g.term || 1)))]);
                              }}
                              onDeleteGrade={(studentId, subject, term) => {
                                setGrades(prev => prev.filter(x => !(x.studentId === studentId && x.subject === subject && (x.term || 1) === term)));
                              }}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>
                  )}

                  {/* 2. TEACHER WORKSPACE */}
                  {currentUser?.role === 'teacher' && (
                    <div className="col-span-full space-y-6" id="teacher-workspace">
                      {/* Teacher Workspace Header and Subtabs */}
                      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 rounded-2xl p-6 border border-stone-750 shadow-xl text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest block">የመምህራን የክፍል መቆጣጠሪያ / Teacher Portal</span>
                          <h2 className="text-xl font-black tracking-tight font-sans">እንኳን በደህና መጡ፣ መምህር! 👋</h2>
                          <p className="text-stone-300 text-xs">ከተማሪዎችዎ የውጤት መዛግብት፣ ማርክ ሊስት እና ሮስተሮች ጋር እዚህ በምቾት ይስሩ።</p>
                        </div>
                        <div className="flex gap-2 flex-wrap shrink-0 bg-white/5 p-1 rounded-xl border border-white/10">
                          <button
                            onClick={() => { playInteractiveSound('click'); setTeacherSubTab('class-sheets'); }}
                            className={`px-4 py-2 text-xs font-black rounded-lg transition-all flex items-center gap-1.5 ${
                              teacherSubTab === 'class-sheets'
                                ? 'bg-emerald-600 text-white shadow-md'
                                : 'text-stone-300 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5" /> ማርክ ሊስት እና ሮስተር ሰንጠረዥ (Class Sheets)
                          </button>
                          <button
                            onClick={() => { playInteractiveSound('click'); setTeacherSubTab('quick-entry'); }}
                            className={`px-4 py-2 text-xs font-black rounded-lg transition-all flex items-center gap-1.5 ${
                              teacherSubTab === 'quick-entry'
                                ? 'bg-emerald-600 text-white shadow-md'
                                : 'text-stone-300 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <PlusCircle className="w-3.5 h-3.5" /> ነጠላ ውጤት መመዝገቢያ (Quick Entry)
                          </button>
                          {currentTeacher?.isHomeroomTeacher && (
                            <button
                              onClick={() => { playInteractiveSound('click'); setTeacherSubTab('student-registration'); }}
                              className={`px-4 py-2 text-xs font-black rounded-lg transition-all flex items-center gap-1.5 ${
                                teacherSubTab === 'student-registration'
                                  ? 'bg-emerald-600 text-white shadow-md'
                                  : 'text-stone-300 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              <PlusCircle className="w-3.5 h-3.5" /> ተማሪ መመዝገቢያ (Student Registration)
                            </button>
                          )}
                        </div>
                      </div>

                      {teacherSubTab === 'class-sheets' && (
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm space-y-6"
                        >
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-100 pb-4">
                            <div>
                              <h3 className="text-lg font-extrabold text-stone-950 flex items-center gap-2">
                                <FileSpreadsheet className="text-emerald-600 w-5 h-5" /> የክፍል ማርክ ሊስት እና ሮስተር ማስተዳደሪያ
                              </h3>
                              <p className="text-xs text-stone-500 mt-0.5">
                                እዚህ ላይ በክፍል እና በሴክሽን በመለየት የተማሪዎችን ውጤት መሙላት፣ ማረም፣ ማስተካከል እና ማተም/ማውረድ ይችላሉ።
                              </p>
                            </div>
                          </div>
                          
                          <GradeTrackerSection
                            students={students}
                            grades={grades}
                            teachers={teachers}
                            currentUserEmail={currentUser?.email || ''}
                            schoolConfig={schoolConfig}
                            currentUserRole="teacher"
                            onSaveGrade={(newGrade) => {
                              setGrades(prev => {
                                const existsIdx = prev.findIndex(g => g.studentId === newGrade.studentId && g.subject === newGrade.subject && (g.term || 1) === (newGrade.term || 1));
                                if (existsIdx !== -1) {
                                  const copy = [...prev];
                                  copy[existsIdx] = newGrade;
                                  return copy;
                                } else {
                                  return [newGrade, ...prev];
                                }
                              });
                            }}
                            onDeleteGrade={(studentId, subject, term) => {
                              setGrades(prev => prev.filter(x => !(x.studentId === studentId && x.subject === subject && (x.term || 1) === term)));
                            }}
                          />
                        </motion.div>
                      )}

                      {teacherSubTab === 'quick-entry' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                          
                          {/* Grade Input Form */}
                          <div className="lg:col-span-5 bg-white border border-stone-200 p-6 rounded-2xl space-y-4 shadow-xs">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                            <PlusCircle className="text-emerald-600 w-5 h-5" /> የተማሪ ውጤት መዝግብ (Teacher Grade Entry)
                          </h3>
                          <p className="text-stone-400 text-xs mt-0.5">Secure grade logging linked to unique student IDs</p>
                        </div>

                        {teacherSuccessMsg && (
                          <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-semibold rounded-xl">
                            {teacherSuccessMsg}
                          </div>
                        )}

                        {teacherErrorMsg && (
                          <div className="p-3.5 bg-rose-50 text-rose-800 border border-rose-100 text-xs font-semibold rounded-xl">
                            {teacherErrorMsg}
                          </div>
                        )}

                        <form onSubmit={handleSaveGrade} className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">ተማሪ ይምረጡ (Select Student):</label>
                            <select 
                              value={selectedStudentId}
                              onChange={(e) => { playInteractiveSound('click'); setSelectedStudentId(e.target.value); }}
                              className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:border-indigo-600 outline-none bg-white font-semibold text-stone-800"
                              required
                            >
                              <option value="">-- ተማሪ ይምረጡ (Select Student) --</option>
                              {students.map(s => (
                                <option key={s.id} value={s.id}>
                                  {s.name} ({s.id}) - {s.grade} {s.section}
                                </option>
                              ))}
                            </select>
                            <span className="text-[10px] text-indigo-600 font-mono mt-1 block">
                              📌 ማሻሻያ፡ ውጤቱ የሚገናኘው ከተማሪው ID ጋር ብቻ ነው (Fixes Student Name typos)
                            </span>
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">የምዘገባ ትምህርት አይነት (Select Subject):</label>
                            <select 
                              value={selectedTeacherSubject}
                              onChange={(e) => { playInteractiveSound('click'); setSelectedTeacherSubject(e.target.value); }}
                              className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:border-indigo-600 outline-none bg-white font-semibold text-stone-800"
                              required
                            >
                              {schoolConfig.subjects.map(sub => (
                                <option key={sub} value={sub}>
                                  📚 {sub}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">የምዘገባ የጊዜ ዑደት (Select Term / Period):</label>
                            <select 
                              value={teacherSelectedTerm}
                              onChange={(e) => { playInteractiveSound('click'); setTeacherSelectedTerm(Number(e.target.value)); }}
                              className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:border-indigo-600 outline-none bg-white font-semibold text-stone-800"
                              required
                            >
                              {(schoolConfig.evaluationMode || 'quarter') === 'semester' ? (
                                <>
                                  <option value={1}>ሴሚስተር 1 (Semester 1)</option>
                                  <option value={2}>ሴሚስተር 2 (Semester 2)</option>
                                </>
                              ) : (
                                <>
                                  <option value={1}>ሩብ ዓመት 1 (Quarter 1)</option>
                                  <option value={2}>ሩብ ዓመት 2 (Quarter 2)</option>
                                  <option value={3}>ሩብ ዓመት 3 (Quarter 3)</option>
                                  <option value={4}>ሩብ ዓመት 4 (Quarter 4)</option>
                                </>
                              )}
                            </select>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">ኩዊዝ (Quiz - Max 10):</label>
                              <input 
                                type="number" 
                                min="0" 
                                max="10"
                                value={quizScore}
                                onChange={(e) => setQuizScore(e.target.value === '' ? '' : Number(e.target.value))}
                                placeholder="0"
                                className="w-full p-2.5 rounded-xl border border-stone-200 text-sm focus:border-indigo-600 outline-none bg-stone-50/50"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">ክፍል ስራ (CW - Max 10):</label>
                              <input 
                                type="number" 
                                min="0" 
                                max="10"
                                value={cwScore}
                                onChange={(e) => setCwScore(e.target.value === '' ? '' : Number(e.target.value))}
                                placeholder="0"
                                className="w-full p-2.5 rounded-xl border border-stone-200 text-sm focus:border-indigo-600 outline-none bg-stone-50/50"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">የቤት ስራ (HW - Max 10):</label>
                              <input 
                                type="number" 
                                min="0" 
                                max="10"
                                value={hwScore}
                                onChange={(e) => setHwScore(e.target.value === '' ? '' : Number(e.target.value))}
                                placeholder="0"
                                className="w-full p-2.5 rounded-xl border border-stone-200 text-sm focus:border-indigo-600 outline-none bg-stone-50/50"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">ግማሽ ፈተና (Mid - Max 20):</label>
                              <input 
                                type="number" 
                                min="0" 
                                max="20"
                                value={midScore}
                                onChange={(e) => setMidScore(e.target.value === '' ? '' : Number(e.target.value))}
                                placeholder="0"
                                className="w-full p-2.5 rounded-xl border border-stone-200 text-sm focus:border-indigo-600 outline-none bg-stone-50/50"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">ማጠቃለያ ፈተና (Final - Max 50):</label>
                            <input 
                              type="number" 
                              min="0" 
                              max="50"
                              value={finalScore}
                              onChange={(e) => setFinalScore(e.target.value === '' ? '' : Number(e.target.value))}
                              placeholder="0"
                              className="w-full p-2.5 rounded-xl border border-stone-200 text-sm focus:border-indigo-600 outline-none bg-stone-50/50"
                              required
                            />
                          </div>

                          <button 
                            type="submit"
                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-sm"
                          >
                            💾 ውጤቱን መዝግብ (Save Grade Results)
                          </button>
                        </form>
                      </div>

                      {/* Grades list table */}
                      <div className="lg:col-span-7 bg-white border border-stone-200 p-6 rounded-2xl space-y-4 shadow-xs">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                            <FileSpreadsheet className="text-emerald-600 w-5 h-5" /> የተመዘገቡ ውጤቶች ታሪክ
                          </h3>
                          <p className="text-stone-400 text-xs mt-0.5">Your recorded grade history database</p>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left border-collapse">
                            <thead>
                              <tr className="bg-stone-50 text-stone-500 uppercase text-[10px] tracking-wider font-bold">
                                <th className="p-3 border-b border-stone-100">ተማሪ</th>
                                <th className="p-3 border-b border-stone-100 text-center">Quiz</th>
                                <th className="p-3 border-b border-stone-100 text-center">CW</th>
                                <th className="p-3 border-b border-stone-100 text-center">HW</th>
                                <th className="p-3 border-b border-stone-100 text-center">Mid</th>
                                <th className="p-3 border-b border-stone-100 text-center">Final</th>
                                <th className="p-3 border-b border-stone-100 text-center">ጠቅላላ (Total)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {grades.map((g) => {
                                const st = students.find(s => s.id === g.studentId);
                                return (
                                  <tr key={g.id} className="hover:bg-emerald-50/10 border-b border-stone-100 text-stone-800 transition-colors">
                                    <td className="p-3 font-semibold text-stone-900">
                                      <div className="flex flex-col">
                                        <span>{g.studentName}</span>
                                        <div className="flex gap-1.5 items-center mt-0.5 flex-wrap">
                                          <span className="font-mono text-[10px] text-indigo-600 font-bold bg-indigo-50 px-1 py-0.2 rounded">
                                            {g.studentId} {st ? `(${st.grade}-${st.section})` : ''}
                                          </span>
                                          <span className="font-sans text-[10px] text-emerald-700 font-black bg-emerald-50 px-1.5 py-0.2 rounded-md">
                                            📚 {g.subject || 'Mathematics'}
                                          </span>
                                          <span className="font-sans text-[10px] text-amber-700 font-black bg-amber-50 px-1.5 py-0.2 rounded-md">
                                            🕒 {(schoolConfig.evaluationMode || 'quarter') === 'semester' ? `Sem ${g.term || 1}` : `Q${g.term || 1}`}
                                          </span>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="p-3 text-center text-xs font-medium text-stone-600">{g.quiz}/10</td>
                                    <td className="p-3 text-center text-xs font-medium text-stone-600">{g.cw}/10</td>
                                    <td className="p-3 text-center text-xs font-medium text-stone-600">{g.hw}/10</td>
                                    <td className="p-3 text-center text-xs font-medium text-stone-600">{g.mid}/20</td>
                                    <td className="p-3 text-center text-xs font-medium text-stone-600">{g.final}/50</td>
                                    <td className="p-3 text-center">
                                      <span className={`px-2 py-1 rounded-lg font-bold text-xs ${
                                        g.total >= 85 ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' :
                                        g.total >= 60 ? 'bg-indigo-50 text-indigo-800 border border-indigo-100' :
                                        'bg-rose-50 text-rose-800 border border-rose-100'
                                      }`}>
                                        {g.total}%
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {teacherSubTab === 'student-registration' && currentTeacher?.isHomeroomTeacher && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      {/* Register Student Form */}
                      <div className="lg:col-span-5 bg-white border border-stone-200 p-6 rounded-2xl space-y-4 shadow-xs">
                        <div>
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">የክፍል ኃላፊ መምህር ተግባር</span>
                          <h3 className="text-lg font-bold text-stone-900 flex items-center gap-1.5 mt-1">
                            <PlusCircle className="text-emerald-600 w-5 h-5" /> አዲስ ተማሪ ይመዝግቡ (Class Register)
                          </h3>
                          <p className="text-stone-400 text-xs mt-0.5">ክፍልዎ: {currentTeacher.assignedClass} - ሴክሽን {currentTeacher.assignedSection}</p>
                        </div>

                        {principalSuccessMsg && (
                          <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-semibold rounded-xl animate-pulse">
                            {principalSuccessMsg}
                          </div>
                        )}

                        <form onSubmit={handleRegisterStudent} className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold uppercase text-stone-600 mb-1">የተማሪው ሙሉ ስም (Student Full Name):</label>
                            <input 
                              type="text"
                              value={newStudentName}
                              onChange={(e) => setNewStudentName(e.target.value)}
                              placeholder="መላኩ ገብሬ"
                              className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none bg-stone-50/50"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-xs font-bold uppercase text-stone-400 mb-1">ክፍል (Grade):</label>
                              <div className="w-full p-3 rounded-xl border border-stone-100 text-sm bg-stone-100 font-bold text-stone-600">
                                {currentTeacher.assignedClass}
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold uppercase text-stone-400 mb-1">ሴክሽን (Sec):</label>
                              <div className="w-full p-3 rounded-xl border border-stone-100 text-sm bg-stone-100 font-bold text-stone-600">
                                {currentTeacher.assignedSection}
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold uppercase text-stone-600 mb-1">ጾታ (Gender):</label>
                              <select 
                                value={newStudentGender}
                                onChange={(e) => setNewStudentGender(e.target.value as any)}
                                className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:border-indigo-600 outline-none bg-white font-medium"
                              >
                                <option value="Male">ወንድ (M)</option>
                                <option value="Female">ሴት (F)</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase text-stone-600 mb-1">የወላጅ ኢሜል (Parent Email - Optional):</label>
                            <input 
                              type="email"
                              value={newStudentParentEmail}
                              onChange={(e) => setNewStudentParentEmail(e.target.value)}
                              placeholder="parent@school.com"
                              className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none bg-stone-50/50"
                            />
                            <p className="text-[10px] text-stone-400 mt-1">ይህንን ኢሜል በመጠቀም ወላጅ ሲገባ የልጁን ውጤት ያለምንም መታወቂያ እንዲያይ ይደረጋል።</p>
                          </div>

                          <button 
                            type="submit"
                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-sm"
                          >
                            ➕ ተማሪ መዝግብ (Register Student)
                          </button>
                        </form>
                      </div>

                      {/* Registered Students List Table */}
                      <div className="lg:col-span-7 bg-white border border-stone-200 p-6 rounded-2xl space-y-4 shadow-xs">
                        <div className="flex justify-between items-center flex-wrap gap-2 pb-2 border-b border-stone-100">
                          <div>
                            <h3 className="text-lg font-bold text-stone-950 flex items-center gap-1.5">
                              <Users className="text-emerald-600 w-5 h-5" /> በክፍልዎ የተመዘገቡ ተማሪዎች
                            </h3>
                            <p className="text-stone-400 text-xs mt-0.5">Students currently registered in your advisor class</p>
                          </div>
                          <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-100">
                            ጠቅላላ፡ {students.filter(s => s.grade === currentTeacher.assignedClass && s.section === currentTeacher.assignedSection).length} ተማሪዎች
                          </span>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left border-collapse">
                            <thead>
                              <tr className="bg-stone-50 text-stone-500 uppercase text-[10px] tracking-wider font-black border-b border-stone-200">
                                <th className="p-3">ተማሪ (Student)</th>
                                <th className="p-3 text-center">ጾታ (Gender)</th>
                                <th className="p-3">ወላጅ ኢሜል (Parent Email)</th>
                                <th className="p-3">መታወቂያ (ID)</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                              {students
                                .filter(s => s.grade === currentTeacher.assignedClass && s.section === currentTeacher.assignedSection)
                                .map((s) => (
                                  <tr key={s.id} className="hover:bg-stone-50/50 transition-colors">
                                    <td className="p-3 font-bold text-stone-900">{s.name}</td>
                                    <td className="p-3 text-center">
                                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${s.gender === 'Male' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'}`}>
                                        {s.gender === 'Male' ? 'ወንድ' : 'ሴት'}
                                      </span>
                                    </td>
                                    <td className="p-3 text-stone-500 font-mono text-[10px]">{s.parentEmail || '-'}</td>
                                    <td className="p-3 font-mono font-black text-emerald-700 tracking-wider text-[11px]">{s.id}</td>
                                  </tr>
                                ))}
                              {students.filter(s => s.grade === currentTeacher.assignedClass && s.section === currentTeacher.assignedSection).length === 0 && (
                                <tr>
                                  <td colSpan={4} className="text-center p-8 text-stone-400 italic">
                                    በዚህ ክፍል የተመዘገበ ተማሪ የለም (No students registered yet)
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ) /* old ternary closes below */}
                </div>
              )}

                  {/* 3. PARENT REPORT CARD WORKSPACE */}
                  {currentUser?.role === 'parent' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="parent-workspace">
                      
                      {/* Search panel card */}
                      <div className="lg:col-span-4 bg-white border border-stone-200 p-6 rounded-2xl space-y-6 shadow-xs">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Search className="text-amber-500 w-6 h-6" /> የልጅዎን ውጤት ይፈልጉ
                          </h3>
                          <p className="text-stone-400 text-xs mt-0.5">Enter student’s unique ID to fetch authenticated report card</p>
                        </div>

                        <form onSubmit={handleSearchStudent} className="flex gap-2">
                          <div className="relative flex-1">
                            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                            <input 
                              type="text"
                              value={searchId}
                              onChange={(e) => setSearchId(e.target.value)}
                              placeholder="መታወቂያ ያስገቡ (e.g. ID-4021)"
                              className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 text-sm focus:border-indigo-600 outline-none bg-stone-50/50 uppercase font-mono font-bold"
                              required
                            />
                          </div>
                          <button 
                            type="submit"
                            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm transition-all shadow-sm"
                          >
                            ፈልግ
                          </button>
                        </form>

                        {/* Parent Error Message Display */}
                        {parentErrorMsg && (
                          <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-xs text-rose-800 font-semibold space-y-1">
                            {parentErrorMsg}
                          </div>
                        )}

                        {/* Child Information Card / Help Desk */}
                        <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl text-xs space-y-1.5">
                          <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">🔒 ፈቃድ እና ማረጋገጫ (Authorization Info)</span>
                          {(() => {
                            const children = students.filter(s => s.parentEmail?.trim().toLowerCase() === currentUser?.email?.trim().toLowerCase());
                            if (children.length > 0) {
                              return (
                                <div className="text-stone-600 space-y-2">
                                  <p className="font-semibold text-stone-700">የልጆችዎ ዝርዝር (Your Children List):</p>
                                  <div className="flex flex-col gap-2 mt-1">
                                    {children.map(c => (
                                      <button
                                        key={c.id}
                                        type="button"
                                        onClick={() => {
                                          playInteractiveSound('click');
                                          setSearchId(c.id);
                                          setParentSearched(true);
                                          setParentErrorMsg(null);
                                          setFoundStudent(c);
                                          const childGrades = grades.filter(g => g.studentId === c.id);
                                          setFoundGrades(childGrades);
                                        }}
                                        className={`border font-mono text-xs px-3 py-2 rounded-xl font-bold transition-all shadow-xs flex items-center gap-2 text-left w-full ${
                                          searchId.trim().toUpperCase() === c.id.toUpperCase()
                                            ? 'bg-amber-100 border-amber-400 text-amber-900'
                                            : 'bg-white border-amber-200 text-indigo-700 hover:border-indigo-500'
                                        }`}
                                      >
                                        <span>🔑</span>
                                        <div>
                                          <span className="font-black text-indigo-900">{c.id}</span> - <span className="font-sans font-semibold text-stone-700">{c.name}</span>
                                          <span className="text-[10px] text-stone-400 font-sans block font-normal mt-0.5">{c.grade} - ሴክሽን {c.section}</span>
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                  <p className="text-[10px] text-stone-400 mt-1.5 italic">※ የደህንነት መመሪያ፡ ወላጅ ማየት የሚችለው የራሱን ልጅ ውጤት ብቻ ነው። (Security policy: parents can only view their own child's report card.)</p>
                                </div>
                              );
                            } else {
                              return (
                                <p className="text-stone-500 italic">ከእርስዎ የኢሜል አድራሻ ጋር የተገናኘ ተማሪ የለም። እባክዎን ርዕሰ መምህሩን ያነጋግሩ። (No student is linked to your email address.)</p>
                              );
                            }
                          })()}
                        </div>
                      </div>

                      {/* Parent search results canvas */}
                      <div className="lg:col-span-8 bg-white border border-stone-200 p-6 rounded-2xl shadow-xs min-h-[300px]">
                        <AnimatePresence mode="wait">
                          {parentSearched ? (
                            <motion.div
                              key={searchId}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="space-y-6"
                            >
                              {foundStudent ? (
                                <div className="space-y-6">
                                  {/* Student profile and metadata info bar */}
                                  <div className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                      <span className="text-indigo-800 text-[10px] font-black uppercase tracking-wider bg-indigo-100/60 px-2 py-0.5 rounded-md">📄 የተማሪው ማህደር (Student Profile)</span>
                                      <h4 className="text-xl font-extrabold text-stone-900 mt-2 flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        {foundStudent.name}
                                      </h4>
                                      <p className="text-stone-500 text-xs font-semibold mt-1">
                                        ጾታ፡ <span className="text-stone-800 font-bold">{foundStudent.gender === 'Male' ? 'ወንድ' : 'ሴት'}</span> • ክፍል፡ <span className="text-stone-800 font-bold">{foundStudent.grade} - {foundStudent.section}</span>
                                      </p>
                                    </div>
                                    <div className="sm:text-right bg-white p-3 rounded-xl border border-stone-200/50 shadow-2xs self-stretch sm:self-auto flex sm:flex-col justify-between items-center sm:items-end">
                                      <span className="text-[10px] text-stone-400 font-bold uppercase block">ልዩ መታወቂያ (ID)</span>
                                      <span className="font-mono font-black text-indigo-700 text-lg tracking-wider">{foundStudent.id}</span>
                                    </div>
                                  </div>

                                  {/* Parent tab switchers (ውጤት, ማስታወቂያ, አቴንዳንስ) */}
                                  <div className="flex border-b border-stone-200 pb-px gap-1 overflow-x-auto">
                                    <button
                                      type="button"
                                      onClick={() => { playInteractiveSound('click'); setParentSubView('grades'); }}
                                      className={`px-4 py-2.5 text-xs font-black rounded-t-xl border-t border-x transition-all -mb-px shrink-0 ${
                                        parentSubView === 'grades'
                                          ? 'bg-white border-stone-200 text-indigo-600 border-b-white z-10'
                                          : 'bg-stone-50 border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-100'
                                      }`}
                                    >
                                      📚 የልጅዎ ውጤት (Grades & Report Card)
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => { playInteractiveSound('click'); setParentSubView('notices'); }}
                                      className={`px-4 py-2.5 text-xs font-black rounded-t-xl border-t border-x transition-all -mb-px shrink-0 ${
                                        parentSubView === 'notices'
                                          ? 'bg-white border-stone-200 text-indigo-600 border-b-white z-10'
                                          : 'bg-stone-50 border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-100'
                                      }`}
                                    >
                                      📢 የትምህርት ቤት ማስታወቂያዎች (School Notices)
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => { playInteractiveSound('click'); setParentSubView('attendance'); }}
                                      className={`px-4 py-2.5 text-xs font-black rounded-t-xl border-t border-x transition-all -mb-px shrink-0 ${
                                        parentSubView === 'attendance'
                                          ? 'bg-white border-stone-200 text-indigo-600 border-b-white z-10'
                                          : 'bg-stone-50 border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-100'
                                      }`}
                                    >
                                      📅 የመቅረትና የአቴንዳንስ ሁኔታ (Attendance & Conduct)
                                    </button>
                                  </div>

                                  {parentSubView === 'grades' && (
                                    <div className="space-y-6">
                                      {/* GPA Summary Card */}
                                      <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-4.5 rounded-2xl shadow-sm flex items-center justify-between max-w-sm">
                                        <div className="space-y-1">
                                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-100 block">የልጅዎ አማካይ ውጤት (GPA)</span>
                                          <p className="text-2xl font-black">
                                            {foundGrades.length > 0 
                                              ? `${Math.round(foundGrades.reduce((sum, item) => sum + item.total, 0) / foundGrades.length)}%`
                                              : '--%'
                                            }
                                          </p>
                                          <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-md font-bold inline-block">
                                            {foundGrades.length > 0 ? (
                                              Math.round(foundGrades.reduce((sum, item) => sum + item.total, 0) / foundGrades.length) >= 85 ? '🌟 እጅግ በጣም ጥሩ (Excellent)' :
                                              Math.round(foundGrades.reduce((sum, item) => sum + item.total, 0) / foundGrades.length) >= 60 ? '👍 ማለፊያ (Passing)' :
                                              '⚠️ እገዛ ያስፈልጋል (Needs Support)'
                                            ) : 'ውጤት አልተመዘገበም'}
                                          </span>
                                        </div>
                                        <div className="bg-white/10 p-2.5 rounded-xl shrink-0">
                                          <Award className="w-7 h-7 text-indigo-100" />
                                        </div>
                                      </div>

                                      {/* Unified Report Card Scorecard (All subjects in ONE view) */}
                                      <div className="bg-white border border-stone-200 rounded-2xl shadow-xs overflow-hidden space-y-4">
                                        <div className="bg-stone-50/80 p-4 border-b border-stone-100 flex justify-between items-center flex-wrap gap-2">
                                          <div>
                                            <h4 className="text-xs font-black uppercase tracking-wider text-stone-500">📓 የትምህርት ዘገባ ሰሌዳ (Unified Scorecard)</h4>
                                            <p className="text-[10px] text-stone-400 font-semibold mt-0.5">ሁሉም የሚማሯቸው ትምህርቶች በአንድ ገፅ</p>
                                          </div>
                                          
                                          <button
                                            type="button"
                                            onClick={() => { playInteractiveSound('success'); setShowPrintModal(true); }}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md shadow-indigo-100 hover:scale-[1.02]"
                                          >
                                            <span>🖨️ የውጤት ካርድ አትም (Print Report Card)</span>
                                          </button>
                                        </div>

                                        {foundGrades.length > 0 ? (
                                          <div className="p-4 pt-1 space-y-4">
                                            <div className="overflow-x-auto rounded-xl border border-stone-200/80 shadow-3xs bg-white">
                                              <table className="w-full text-xs text-left border-collapse min-w-[650px]">
                                                <thead>
                                                  <tr className="bg-stone-50 text-stone-500 uppercase font-black text-[10px] tracking-wider border-b border-stone-200">
                                                    <th className="p-3 text-stone-900 font-extrabold w-48">📚 የትምህርት አይነት (Subject)</th>
                                                    <th className="p-3 text-center w-24">Quiz (10)</th>
                                                    <th className="p-3 text-center w-24">CW (10)</th>
                                                    <th className="p-3 text-center w-24">HW (10)</th>
                                                    <th className="p-3 text-center w-24 bg-indigo-50/30 text-indigo-950">Mid (20)</th>
                                                    <th className="p-3 text-center w-24">Final (50)</th>
                                                    <th className="p-3 text-center w-24">Total (100)</th>
                                                    <th className="p-3 text-center w-20">Grade</th>
                                                  </tr>
                                                </thead>
                                                <tbody className="divide-y divide-stone-100">
                                                  {foundGrades.map((g) => {
                                                    const lg = getLetterGrade(g.total);
                                                    return (
                                                      <tr key={g.id} className="hover:bg-stone-50/50 text-stone-800 transition-colors">
                                                        <td className="p-3 font-bold text-stone-900">
                                                          <div className="flex flex-col">
                                                            <span className="text-sm font-black text-stone-950">{g.subject}</span>
                                                            <span className="text-[10px] text-stone-400 font-normal">መምህር (Instructor)፡ {g.teacher.split('@')[0]}</span>
                                                          </div>
                                                        </td>
                                                        <td className="p-3 text-center font-bold text-stone-600 whitespace-nowrap">{g.quiz}/10</td>
                                                        <td className="p-3 text-center font-bold text-stone-600 whitespace-nowrap">{g.cw}/10</td>
                                                        <td className="p-3 text-center font-bold text-stone-600 whitespace-nowrap">{g.hw}/10</td>
                                                        <td className="p-3 text-center font-extrabold text-indigo-950 whitespace-nowrap bg-indigo-50/20 shadow-inner">
                                                          {g.mid}/20
                                                        </td>
                                                        <td className="p-3 text-center font-bold text-stone-600 whitespace-nowrap">{g.final}/50</td>
                                                        <td className="p-3 text-center">
                                                          <span className={`px-2.5 py-1 rounded-lg font-black text-xs inline-block whitespace-nowrap ${
                                                            g.total >= 85 ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' :
                                                            g.total >= 60 ? 'bg-indigo-50 text-indigo-800 border border-indigo-100' :
                                                            'bg-rose-50 text-rose-800 border border-rose-200'
                                                          }`}>
                                                            {g.total}%
                                                          </span>
                                                        </td>
                                                        <td className="p-3 text-center">
                                                          <span className={`px-2 py-0.5 rounded-md text-xs font-black border ${lg.color} whitespace-nowrap`}>
                                                            {lg.label}
                                                          </span>
                                                        </td>
                                                      </tr>
                                                    );
                                                  })}
                                                </tbody>
                                              </table>
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="text-center p-8 bg-stone-50 border border-stone-200/50 rounded-2xl mx-4 mb-4">
                                            <Info className="w-8 h-8 text-amber-500 mx-auto" />
                                            <p className="text-stone-600 text-sm font-medium mt-2">ለተማሪ &ldquo;{foundStudent.name}&rdquo; እስካሁን ምንም ውጤት አልተመዘገበም (No grades entered yet)</p>
                                            <p className="text-stone-400 text-xs">እባክዎን አስተማሪው ውጤት እስኪያስገባ ድረስ ይጠብቁ።</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {parentSubView === 'notices' && (
                                    <div className="bg-white border border-stone-200 p-6 rounded-2xl space-y-4">
                                      <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                                        <Megaphone className="w-5 h-5 text-indigo-600" />
                                        <h4 className="text-sm uppercase text-stone-700 font-black tracking-wider">
                                          📢 የማስታወቂያ ሰሌዳ (Notice Board)
                                        </h4>
                                      </div>

                                      {announcements.filter(ann => ann.target === 'Parents' || ann.target === 'Both').length > 0 ? (
                                        <div className="space-y-4">
                                          {announcements.filter(ann => ann.target === 'Parents' || ann.target === 'Both').map((ann) => (
                                            <div key={ann.id} className="bg-stone-50/60 border border-stone-200 p-4 rounded-xl space-y-2 hover:bg-stone-50 transition-colors">
                                              <div className="flex justify-between items-start gap-2">
                                                <h5 className="font-extrabold text-stone-900 text-sm leading-tight">
                                                  📌 {ann.title}
                                                </h5>
                                                <span className="text-[10px] text-stone-400 font-mono font-bold shrink-0 bg-stone-100 px-2 py-0.5 rounded">
                                                  {new Date(ann.timestamp).toLocaleDateString('am-ET', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </span>
                                              </div>
                                              <p className="text-stone-600 text-xs leading-relaxed">
                                                {ann.content}
                                              </p>
                                              <div className="flex justify-between items-center pt-2 border-t border-stone-100 text-[10px] text-stone-400 font-semibold">
                                                <span>የተላከው በ፡ {ann.postedBy.split('@')[0]}</span>
                                                <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-extrabold text-[9px] uppercase">
                                                  ለወላጆች
                                                </span>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <div className="text-center py-12 text-stone-400 text-xs italic bg-stone-50 rounded-xl border border-stone-150">
                                          አሁን ምንም አዲስ ማስታወቂያ የለም (No notices currently)
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {parentSubView === 'attendance' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      {/* Left block - Status cards */}
                                      <div className="space-y-4">
                                        {/* Attendance Summary Card */}
                                        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-5 rounded-2xl shadow-sm flex items-center justify-between">
                                          <div className="space-y-1">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-100 block">የመቅረት ሁኔታ (Attendance)</span>
                                            <p className="text-2xl font-black">{studentExtraInfo[foundStudent.id]?.absent ?? 0} ቀናት ቀርተዋል</p>
                                            <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-md font-bold inline-block">
                                              {(studentExtraInfo[foundStudent.id]?.absent ?? 0) === 0 ? '💯 ሙሉ መገኘት (Perfect)' : 'ቀሪ ቀናት ተመዝግቧል'}
                                            </span>
                                          </div>
                                          <div className="bg-white/10 p-2.5 rounded-xl shrink-0">
                                            <UserCheck className="w-7 h-7 text-amber-100" />
                                          </div>
                                        </div>

                                        {/* Conduct Summary Card */}
                                        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-5 rounded-2xl shadow-sm flex items-center justify-between">
                                          <div className="space-y-1">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-100 block">የምግባር ደረጃ (Conduct)</span>
                                            <p className="text-2xl font-black">ውጤት: {studentExtraInfo[foundStudent.id]?.conduct ?? 'A'}</p>
                                            <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-md font-bold inline-block">
                                              ስነ-ምግባር (Behavior Assessment)
                                            </span>
                                          </div>
                                          <div className="bg-white/10 p-2.5 rounded-xl shrink-0">
                                            <ShieldCheck className="w-7 h-7 text-emerald-100" />
                                          </div>
                                        </div>
                                      </div>

                                      {/* Right block - Policy and details */}
                                      <div className="bg-gradient-to-br from-amber-50/30 to-orange-50/20 border border-amber-100 p-5 rounded-2xl space-y-4">
                                        <div className="flex items-center gap-2 border-b border-amber-100 pb-3">
                                          <Info className="w-4.5 h-4.5 text-amber-500" />
                                          <h4 className="text-xs uppercase text-stone-500 font-black tracking-wider">
                                            📅 የአቴንዳንስ እና ባህሪ ማሳሰቢያ
                                          </h4>
                                        </div>

                                        <div className="space-y-3.5">
                                          <div className="bg-white/80 p-3.5 rounded-xl border border-stone-100">
                                            <h5 className="font-extrabold text-stone-800 text-xs">💡 መቅረት ስለመመዝገብ፡</h5>
                                            <p className="text-stone-600 text-[11px] leading-relaxed mt-1">
                                              ተማሪዎች ያለ በቂ ምክንያት ትምህርት ቤት እንዳይቀሩ ወላጆች በቅርብ እንዲከታተሉ በትህትና እናሳስባለን። የቀረበት ቀን በሮስተር ላይ ተጽዕኖ ይኖረዋል።
                                            </p>
                                          </div>

                                          <div className="bg-white/80 p-3.5 rounded-xl border border-stone-100">
                                            <h5 className="font-extrabold text-stone-800 text-xs">🛡️ የምግባር ደረጃ ፖሊሲ፡</h5>
                                            <p className="text-stone-600 text-[11px] leading-relaxed mt-1">
                                              የትምህርት ቤታችን የምግባር ደረጃ (Conduct) በየጊዜው የሚመዘገብ ሲሆን የልጅዎ የምግባር ውጤት <span className="font-extrabold text-indigo-700">{studentExtraInfo[foundStudent.id]?.conduct ?? 'A'}</span> ሆኖ ተመዝግቧል።
                                            </p>
                                          </div>

                                          <p className="text-[10px] text-stone-400 italic">
                                            💬 ማሳሰቢያ፡ ተጨማሪ መረጃ ለማግኘት ትምህርት ቤቱን ወይም የልጅዎን ክፍል ኃላፊ መምህር ማነጋገር ይችላሉ።
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-center p-8 bg-rose-50/50 border border-rose-100 rounded-2xl space-y-2">
                                  <span className="text-3xl block">🔍❌</span>
                                  <h4 className="font-extrabold text-rose-950 text-sm">ተማሪው አልተገኘም (Student Not Found)</h4>
                                  <p className="text-stone-500 text-xs leading-relaxed max-w-sm mx-auto">
                                    ያስገቡት መታወቂያ በሲስተሙ ውስጥ አልተመዘገበም። እባክዎን የመታወቂያ ቁጥሩን አስተካክለው በድጋሚ ይሞክሩ።
                                  </p>
                                </div>
                              )}
                            </motion.div>
                          ) : (
                            <div className="flex flex-col items-center justify-center text-center p-12 h-full text-stone-400 space-y-2">
                              <BookOpen className="w-12 h-12 text-stone-200" />
                              <p className="text-sm font-semibold">ውጤት ለማየት የተማሪውን መታወቂያ ያስገቡ</p>
                              <p className="text-xs">Select or enter a valid Student ID in the left form</p>
                            </div>
                          )}
                        </AnimatePresence>
                      </div>

                    </div>
                  )}

                </div>
              )}

            </motion.div>
          )}

          {/* TAB 1.5: THE SAAS WHITE-LABEL SETUP CONFIGURATOR */}
          {activeTab === 'whitelabel' && (
            <motion.div
              key="whitelabel-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 max-w-4xl mx-auto print:hidden"
            >
              <div className="bg-white border border-stone-200 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-2xl font-black text-slate-900">🏪 ነጭ-መለያ የገበያ ማስተካከያ (SaaS Configurator)</h2>
                  </div>
                  <p className="text-stone-500 text-xs md:text-sm leading-relaxed">
                    ይህ ሲስተም ለተለያዩ ትምህርት ቤቶች ተሸጦ መተግበር እንዲችል ሙሉ በሙሉ ተለዋዋጭ (white-label) ሆኖ የተገነባ ነው። እዚህ ላይ የሚቀይሩት ማንኛውም የትምህርት ቤት ስም፣ መሪ ቃል፣ አርማ፣ ቀለማት እና የትምህርት አይነቶች በፖርታሉ፣ በምዝገባ ፎርሞች፣ በማርክ ሊስት እና በሮስተር ማተሚያ ላይ ወዲያውኑ ይንጸባረቃሉ!
                  </p>
                </div>

                {wlSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs md:text-sm font-bold rounded-2xl flex items-center gap-2"
                  >
                    <span>🎉</span>
                    <span>ብራንዲንግ በተሳካ ሁኔታ ተቀይሯል! ሙሉ ሲስተሙ አሁን የእርስዎን ትምህርት ቤት ያንጸባርቃል። (Branding updated successfully!)</span>
                  </motion.div>
                )}

                <form onSubmit={handleSaveWhiteLabel} className="space-y-6">
                  
                  {/* Basic Branding Credentials */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase text-stone-500 mb-1">🏫 የተቋሙ ስም - በአማርኛ (School Name - Amharic):</label>
                      <input 
                        type="text"
                        value={wlNameAmh}
                        onChange={(e) => setWlNameAmh(e.target.value)}
                        placeholder="ክብር መካከለኛ ደረጃ ትምህርት ቤት"
                        className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:border-emerald-600 outline-none bg-stone-50/50 font-semibold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-stone-500 mb-1">🏫 የተቋሙ ስም - በእንግሊዝኛ (School Name - English):</label>
                      <input 
                        type="text"
                        value={wlNameEng}
                        onChange={(e) => setWlNameEng(e.target.value)}
                        placeholder="Kibr Middle School"
                        className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:border-emerald-600 outline-none bg-stone-50/50 font-semibold"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase text-stone-500 mb-1">🏆 መሪ ቃል - በአማርኛ (Motto - Amharic):</label>
                      <input 
                        type="text"
                        value={wlMottoAmh}
                        onChange={(e) => setWlMottoAmh(e.target.value)}
                        placeholder="ለክህሎትና ለውጤታማነት እንተጋለን!"
                        className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:border-emerald-600 outline-none bg-stone-50/50 font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-stone-500 mb-1">🏆 መሪ ቃል - በእንግሊዝኛ (Motto - English):</label>
                      <input 
                        type="text"
                        value={wlMottoEng}
                        onChange={(e) => setWlMottoEng(e.target.value)}
                        placeholder="Striving for Skills and Success!"
                        className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:border-emerald-600 outline-none bg-stone-50/50 font-medium"
                        required
                      />
                    </div>
                  </div>

                  {/* System UI Look & Feel */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-stone-50 rounded-2xl border border-stone-100">
                    <div>
                      <label className="block text-xs font-black uppercase text-stone-500 mb-2">🎨 የሲስተሙ ዋና ቀለም (Theme Color Accent):</label>
                      <div className="flex flex-wrap gap-2">
                        {Object.keys(THEMES).map((themeName) => {
                          const t = THEMES[themeName as keyof typeof THEMES];
                          const bgColors: Record<string, string> = {
                            indigo: 'bg-indigo-600',
                            emerald: 'bg-emerald-600',
                            violet: 'bg-violet-600',
                            rose: 'bg-rose-600',
                            amber: 'bg-amber-600',
                            slate: 'bg-slate-600'
                          };
                          return (
                            <button
                              type="button"
                              key={themeName}
                              onClick={() => { playInteractiveSound('click'); setWlThemeColor(themeName as any); }}
                              className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all border flex items-center gap-1.5 ${
                                wlThemeColor === themeName 
                                  ? 'bg-stone-900 text-white border-stone-900 shadow-sm' 
                                  : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
                              }`}
                            >
                              <span className={`w-3 h-3 rounded-full inline-block ${bgColors[themeName] || 'bg-indigo-600'}`} />
                              <span>{themeName}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-stone-500 mb-2">🛡️ የትምህርት ቤት አርማ (School Logo / Icon):</label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: 'graduation', label: 'Graduation Cap', icon: <GraduationCap className="w-4 h-4" /> },
                          { id: 'book', label: 'Open Book', icon: <BookOpen className="w-4 h-4" /> },
                          { id: 'shield', label: 'Academic Shield', icon: <ShieldCheck className="w-4 h-4" /> },
                          { id: 'award', label: 'Honors Award', icon: <Award className="w-4 h-4" /> }
                        ].map((logo) => (
                          <button
                            type="button"
                            key={logo.id}
                            onClick={() => { playInteractiveSound('click'); setWlLogoType(logo.id as any); }}
                            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                              wlLogoType === logo.id 
                                ? 'bg-stone-900 text-white border-stone-900 shadow-sm' 
                                : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
                            }`}
                          >
                            {logo.icon}
                            <span>{logo.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Evaluation Period Mode Settings */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-4">
                    <div>
                      <label className="block text-xs font-black uppercase text-stone-500 mb-1">📅 የውጤት መገምገሚያ የጊዜ ዑደት (Evaluation Period Mode):</label>
                      <p className="text-stone-400 text-[11px]">
                        ትምህርት ቤቱ ውጤትን በሩብ ዓመት (Quarter) ወይስ በሴሚስተር (Semester) ብቻ እንደሚያሰላ እዚህ ይምረጡ። (Select whether results are evaluated by quarters or by semesters)
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        type="button"
                        onClick={() => { playInteractiveSound('click'); setWlEvaluationMode('quarter'); }}
                        className={`flex-1 p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                          wlEvaluationMode === 'quarter'
                            ? 'bg-indigo-50/80 text-indigo-950 border-indigo-300 ring-2 ring-indigo-100 shadow-sm'
                            : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                      >
                        <span className="text-2xl">🕒</span>
                        <div>
                          <strong className="text-xs block">ሩብ ዓመት (Quarter Mode)</strong>
                          <span className="text-[10px] text-stone-400 block mt-0.5">4 Quarters (Q1, Q2, Q3, Q4) with annual average</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => { playInteractiveSound('click'); setWlEvaluationMode('semester'); }}
                        className={`flex-1 p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                          wlEvaluationMode === 'semester'
                            ? 'bg-indigo-50/80 text-indigo-950 border-indigo-300 ring-2 ring-indigo-100 shadow-sm'
                            : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                      >
                        <span className="text-2xl">📅</span>
                        <div>
                          <strong className="text-xs block font-bold">ሴሚስተር (Semester Mode)</strong>
                          <span className="text-[10px] text-stone-400 block mt-0.5">2 Semesters (Sem 1, Sem 2) with annual average</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* School Level Settings */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-4">
                    <div>
                      <label className="block text-xs font-black uppercase text-stone-500 mb-1">🏫 የትምህርት ቤት የክፍል ደረጃ (School Level / Grade Range):</label>
                      <p className="text-stone-400 text-[11px]">
                        የትምህርት ቤቱን ደረጃ እዚህ ይምረጡ። አንደኛ ደረጃ (ከ1-8ኛ ክፍል) ወይም ሁለተኛ ደረጃ/መሰናዶ (ከ9-12ኛ ክፍል)። ይህ ሲመረጥ መላው ሲስተም ተዛማጅ ክፍሎችን ብቻ ያሳያል። (Select grade range: 1-8 or 9-12)
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        type="button"
                        onClick={() => { playInteractiveSound('click'); setWlSchoolLevel('primary'); }}
                        className={`flex-1 p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                          wlSchoolLevel === 'primary'
                            ? 'bg-indigo-50/80 text-indigo-950 border-indigo-300 ring-2 ring-indigo-100 shadow-sm'
                            : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                      >
                        <span className="text-2xl">🎒</span>
                        <div>
                          <strong className="text-xs block font-bold">አንደኛ ደረጃ ትምህርት ቤት (Grade 1-8)</strong>
                          <span className="text-[10px] text-stone-400 block mt-0.5">Primary School with Grade 1 to 8 dynamic filtering</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => { playInteractiveSound('click'); setWlSchoolLevel('secondary'); }}
                        className={`flex-1 p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                          wlSchoolLevel === 'secondary'
                            ? 'bg-indigo-50/80 text-indigo-950 border-indigo-300 ring-2 ring-indigo-100 shadow-sm'
                            : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                      >
                        <span className="text-2xl">🎓</span>
                        <div>
                          <strong className="text-xs block font-bold">ሁለተኛ ደረጃ እና መሰናዶ (Grade 9-12)</strong>
                          <span className="text-[10px] text-stone-400 block mt-0.5">Secondary & Preparatory with Grade 9 to 12 dynamic filtering</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Subjects Manager */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-4">
                    <div>
                      <label className="block text-xs font-black uppercase text-stone-500 mb-1">📚 የትምህርት አይነቶች ዝርዝር (SaaS Dynamic Curriculum):</label>
                      <p className="text-stone-400 text-[11px]">
                        ተማሪዎች የሚማሩትንና ውጤት የሚመዘገብባቸውን የትምህርት አይነቶች እዚህ ያስተዳድሩ። (Subjects can be added or removed below)
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1.5 bg-white border border-stone-200 rounded-xl">
                      {wlSubjects.map((sub, index) => (
                        <div 
                          key={index} 
                          className="bg-stone-100 hover:bg-rose-50 text-stone-800 hover:text-rose-900 font-bold text-xs px-2.5 py-1.5 rounded-xl border border-stone-200 flex items-center gap-2 transition-all group"
                        >
                          <span>📚 {sub}</span>
                          <button
                            type="button"
                            onClick={() => {
                              playInteractiveSound('wrong');
                              setWlSubjects(prev => prev.filter(s => s !== sub));
                            }}
                            className="text-stone-400 hover:text-rose-600 focus:outline-none transition-all"
                            title="Remove Subject"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      {wlSubjects.length === 0 && (
                        <span className="text-xs text-stone-400 italic p-2">ምንም ትምህርት አይነት አልተጨመረም! (No subjects defined yet)</span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={wlNewSubject}
                        onChange={(e) => setWlNewSubject(e.target.value)}
                        placeholder="አዲስ የትምህርት አይነት (e.g. History, Geography, ICT)"
                        className="flex-1 p-2.5 rounded-xl border border-stone-200 text-xs focus:border-emerald-600 outline-none bg-white font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const val = wlNewSubject.trim();
                          if (val && !wlSubjects.includes(val)) {
                            playInteractiveSound('success');
                            setWlSubjects(prev => [...prev, val]);
                            setWlNewSubject('');
                          } else {
                            playInteractiveSound('wrong');
                          }
                        }}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm shrink-0"
                      >
                        ➕ ጨምር (Add)
                      </button>
                    </div>
                  </div>

                  {/* Contact Info Credentials */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase text-stone-500 mb-1">📞 ስልክ ቁጥር (Phone):</label>
                      <input 
                        type="text"
                        value={wlPhone}
                        onChange={(e) => setWlPhone(e.target.value)}
                        placeholder="0111223344"
                        className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:border-emerald-600 outline-none bg-stone-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-stone-500 mb-1">📧 የኢሜል አድራሻ (Email):</label>
                      <input 
                        type="email"
                        value={wlEmail}
                        onChange={(e) => setWlEmail(e.target.value)}
                        placeholder="info@kibrschool.edu.et"
                        className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:border-emerald-600 outline-none bg-stone-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-stone-500 mb-1">📍 አድራሻ (Address):</label>
                      <input 
                        type="text"
                        value={wlAddress}
                        onChange={(e) => setWlAddress(e.target.value)}
                        placeholder="አዲስ አበባ፣ ኢትዮጵያ"
                        className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:border-emerald-600 outline-none bg-stone-50/50"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-sm transition-all shadow-md shadow-emerald-100 flex items-center justify-center gap-1.5"
                  >
                    <span>💾</span>
                    <span>የትምህርት ቤቱን መረጃዎች መዝግብ (Apply School Branding)</span>
                  </button>

                </form>
              </div>

              {/* DATABASE BACKUP AND RESTORE UTILITY */}
              <div className="bg-white border border-stone-200 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Database className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-xl font-black text-slate-900">🗄️ የዳታ ምትኬና መመለሻ ማስተዳደሪያ (Backup & Restore Utility)</h3>
                  </div>
                  <p className="text-stone-500 text-xs md:text-sm leading-relaxed">
                    ይህ ሲስተም ለገበያ ሲቀርብ ያለ ምንም የመረጃ መጥፋት ስጋት በነጻነት መስራት እንዲችል የሀገር ውስጥ ትምህርት ቤቶችን ፍላጎት መሰረት ባደረገ መልኩ <strong>ከኢንተርኔት ነጻ (Offline-First)</strong> ሆኖ የተገነባ ነው። ሁሉም መረጃዎች በብሮውዘርዎ ላይ በቋሚነት ይቀመጣሉ። ለተጨማሪ ጥንቃቄ የሲስተሙን መላ መረጃ (ተማሪዎች፣ አስተማሪዎች፣ ውጤቶች እና ብራንዲንግ) ወደ ኮምፒውተርዎ በፋይል መልክ መቅዳት (Backup ማውረድ) ወይም ቀደም ሲል ያወረዱትን ምትኬ መልሰው መጫን (Restore ማድረግ) ይችላሉ።
                  </p>
                </div>

                {restoreSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-indigo-50 text-indigo-900 border border-indigo-200 text-xs md:text-sm font-bold rounded-2xl flex items-center gap-2 shadow-sm"
                  >
                    <span className="text-lg">✔️</span>
                    <span>{restoreSuccess}</span>
                  </motion.div>
                )}

                {restoreError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-rose-50 text-rose-900 border border-rose-200 text-xs md:text-sm font-bold rounded-2xl flex items-center gap-2 shadow-sm"
                  >
                    <span className="text-lg">⚠️</span>
                    <span>{restoreError}</span>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Export Card */}
                  <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200/60 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider block mb-1">DOWNLOAD ARCHIVE</span>
                      <h4 className="text-sm font-extrabold text-stone-800">1. የሲስተሙን ዳታ ምትኬ አውርድ (Backup Data)</h4>
                      <p className="text-stone-500 text-xs mt-1 leading-relaxed">
                        የአሁኑን የትምህርት ቤት መረጃዎች በሙሉ በአንድ ደህንነቱ የተጠበቀ የኮምፒውተር ፋይል (.json) አድርገው ማውረድ። ይህንን ፋይል ለወደፊቱ ዳታ ለመመለስ መጠቀም ይችላሉ።
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleExportBackup}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>ምትኬ ፋይል አውርድ (Download Backup File)</span>
                    </button>
                  </div>

                  {/* Import Card */}
                  <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200/60 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider block mb-1">RESTORE FROM FILE</span>
                      <h4 className="text-sm font-extrabold text-stone-800">2. ምትኬ ፋይል ወደ ሲስተሙ መልስ (Restore Data)</h4>
                      <p className="text-stone-500 text-xs mt-1 leading-relaxed">
                        ቀደም ሲል ያስቀመጡትን የትምህርት ቤት የዳታ ምትኬ ፋይል (.json) እዚህ በመጫን መላውን ሲስተም ወደነበረበት ይመልሱ።
                      </p>
                    </div>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportBackup}
                        id="backup-upload-input"
                        className="hidden"
                      />
                      <label
                        htmlFor="backup-upload-input"
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer text-center"
                      >
                        <Upload className="w-4 h-4" />
                        <span>ምትኬ ፋይል ምረጥና ጫን (Upload & Restore Backup)</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-[10px] text-amber-900 leading-relaxed font-semibold flex items-start gap-2">
                  <span>💡</span>
                  <p>
                    <strong>የደህንነት ማስጠንቀቂያ፡</strong> አዲስ የምትኬ ፋይል ሲጭኑ በአሁኑ ሰዓት በብሮውዘርዎ ላይ የተመዘገቡት የድሮ መረጃዎች በሙሉ በአዲሱ ፋይል ይተካሉ! ከመተካትዎ በፊት የአሁኑን ዳታ ምትኬ አውርደው ማስቀመጥዎን ያረጋግጡ።
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: DEFECTS ANALYSIS REPORT (SECURITY AUDIT) */}
          {activeTab === 'report' && (
            <motion.div
              key="report-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 print:hidden"
            >
              
              <div className="bg-white border border-stone-200 p-6 rounded-2xl">
                <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
                  <AlertTriangle className="text-amber-600 w-6 h-6" /> በዋናው ኮድ ላይ የተገኙ 4 የስራና የደህንነት ክፍተቶች (Defects Report)
                </h2>
                <p className="text-stone-500 text-xs md:text-sm mt-1 leading-relaxed">
                  በተጠቃሚው ኮድ ውስጥ የተገኙትን ዋና ዋና ክፍተቶች እና ለምን ጎጂ እንደሆኑ በዝርዝር መርምረናል። በፕሮቶታይፑ ላይ ያደረግናቸውን ማሻሻያዎች ከዚህ በታች ያንብቡ።
                </p>
              </div>

              {/* Grid of Defects */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DEFECTS_REPORT.map((defect) => (
                  <div 
                    key={defect.id}
                    onClick={() => { playInteractiveSound('click'); setSelectedDefect(defect); }}
                    className="p-5 bg-white border border-stone-200 rounded-2xl hover:border-amber-400 hover:shadow-sm cursor-pointer transition-all flex flex-col justify-between group relative"
                    id={`defect-card-${defect.id}`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md ${
                          defect.severity === 'Critical' 
                            ? 'bg-rose-50 text-rose-800 border border-rose-100' 
                            : 'bg-amber-50 text-amber-800 border border-amber-100'
                        }`}>
                          {defect.severity} Severity
                        </span>
                        <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-all" />
                      </div>

                      <h3 className="font-bold text-stone-900 text-base leading-snug group-hover:text-amber-700 transition-colors">
                        {defect.titleAmh}
                      </h3>
                      <p className="text-xs text-stone-400 italic font-mono mt-0.5">{defect.titleEng}</p>
                      <p className="text-xs text-stone-600 mt-2.5 leading-relaxed line-clamp-3">
                        {defect.descriptionAmh}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs text-indigo-600 font-semibold">
                      <span>👀 የኮድ ማነጻጸሪያን ተመልከት (View Code Fix)</span>
                      <span className="font-mono text-[10px] opacity-60">ID: {defect.id}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Print modal has been relocated globally to support all tabs */}

              {/* Detailed overlay modal for a selected defect with Buggy vs Fixed Code */}
              <AnimatePresence>
                {selectedDefect && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" id="defect-modal">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setSelectedDefect(null)}
                      className="absolute inset-0 bg-stone-950/50 backdrop-blur-sm"
                    />

                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="relative bg-white border border-stone-200 w-full max-w-3xl p-6 md:p-8 rounded-3xl shadow-2xl z-10 space-y-6 max-h-[90vh] overflow-y-auto"
                    >
                      <button 
                        onClick={() => setSelectedDefect(null)}
                        className="p-2 absolute right-4 top-4 hover:bg-stone-100 text-stone-400 hover:text-stone-700 rounded-full transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 text-[9px] uppercase font-bold tracking-wider rounded-md ${
                            selectedDefect.severity === 'Critical' 
                              ? 'bg-rose-50 text-rose-800 border border-rose-100' 
                              : 'bg-amber-50 text-amber-800 border border-amber-100'
                          }`}>
                            {selectedDefect.severity} Severity Bug
                          </span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-black text-stone-900 leading-snug">
                          {selectedDefect.titleAmh}
                        </h2>
                        <p className="text-xs font-mono text-stone-400">{selectedDefect.titleEng}</p>
                      </div>

                      {/* Explanation details */}
                      <div className="space-y-3">
                        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/50 text-sm text-stone-700 leading-relaxed space-y-2">
                          <strong className="text-stone-900 font-semibold block flex items-center gap-1">
                            <Info className="w-4 h-4 text-amber-500" /> የስህተቱ ዝርዝር መግለጫ (Description):
                          </strong>
                          <p>{selectedDefect.descriptionAmh}</p>
                          <p className="text-xs text-stone-500 italic border-t border-stone-200/40 pt-2">{selectedDefect.descriptionEng}</p>
                        </div>

                        <div className="bg-emerald-50/30 p-4 rounded-2xl border border-emerald-200/40 text-sm text-emerald-950 leading-relaxed">
                          <strong className="text-emerald-900 font-semibold block mb-1">💡 እንዴት አስተካከልነው (Resolution applied in React Prototype):</strong>
                          <p>{selectedDefect.explanationAmh}</p>
                        </div>
                      </div>

                      {/* Code comparison grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Buggy Code block */}
                        <div className="border border-rose-100 rounded-2xl overflow-hidden shadow-xs">
                          <div className="bg-rose-50 p-3 border-b border-rose-100 flex justify-between items-center text-xs text-rose-900 font-bold">
                            <span>🚨 የነበረው ስህተት (Buggy Code)</span>
                          </div>
                          <div className="relative">
                            <pre className="p-4 bg-stone-950 text-rose-400 font-mono text-[11px] leading-relaxed overflow-x-auto h-48 rounded-b-2xl">
                              <code>{selectedDefect.buggyCode}</code>
                            </pre>
                            <button
                              onClick={() => handleCopyCode(selectedDefect.buggyCode, 'bug')}
                              className="absolute top-2 right-2 p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition-all text-[10px] flex items-center gap-1"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>{copiedId === 'bug' ? 'Copied!' : 'Copy'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Fixed Code block */}
                        <div className="border border-emerald-100 rounded-2xl overflow-hidden shadow-xs">
                          <div className="bg-emerald-50 p-3 border-b border-emerald-100 flex justify-between items-center text-xs text-emerald-900 font-bold">
                            <span>✅ የተስተካከለው ኮድ (Fixed Code)</span>
                          </div>
                          <div className="relative">
                            <pre className="p-4 bg-stone-950 text-emerald-400 font-mono text-[11px] leading-relaxed overflow-x-auto h-48 rounded-b-2xl">
                              <code>{selectedDefect.fixedCode}</code>
                            </pre>
                            <button
                              onClick={() => handleCopyCode(selectedDefect.fixedCode, 'fix')}
                              className="absolute top-2 right-2 p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition-all text-[10px] flex items-center gap-1"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>{copiedId === 'fix' ? 'Copied!' : 'Copy'}</span>
                            </button>
                          </div>
                        </div>

                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => setSelectedDefect(null)}
                          className="px-6 py-2.5 bg-stone-950 hover:bg-stone-800 text-white font-semibold rounded-xl text-sm transition-all"
                        >
                          ዝጋ (Close Analysis)
                        </button>
                      </div>

                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Official Printable Report Card Modal */}
        <AnimatePresence>
          {showPrintModal && foundStudent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" id="print-report-modal">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowPrintModal(false)}
                className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs no-print"
              />

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white w-full max-w-4xl p-8 rounded-3xl shadow-2xl z-10 space-y-6 max-h-[95vh] overflow-y-auto"
              >
                {/* CSS Print Stylesheet injected dynamically */}
                <style dangerouslySetInnerHTML={{__html: `
                  @media print {
                    @page {
                      size: A4 portrait;
                      margin: 0 !important;
                    }
                    body {
                      background: white !important;
                      color: black !important;
                      margin: 1.2cm !important;
                      -webkit-print-color-adjust: exact !important;
                      print-color-adjust: exact !important;
                    }
                    /* Hide all browser-rendered content under root during print */
                    body > :not(#print-report-modal),
                    #root > :not(#print-report-modal),
                    #root > div > *:not(#print-report-modal) {
                      display: none !important;
                    }
                    #print-report-modal {
                      position: absolute !important;
                      top: 0 !important;
                      left: 0 !important;
                      width: 100% !important;
                      height: auto !important;
                      background: white !important;
                      padding: 0 !important;
                      margin: 0 !important;
                      overflow: visible !important;
                      display: block !important;
                      z-index: 9999999 !important;
                    }
                    /* Strip away all styling from the modal card wrapper */
                    #print-report-modal > div {
                      background: transparent !important;
                      box-shadow: none !important;
                      border: none !important;
                      padding: 0 !important;
                      margin: 0 !important;
                      max-height: none !important;
                      overflow: visible !important;
                      width: 100% !important;
                    }
                    #print-target-sheet {
                      display: block !important;
                      position: relative !important;
                      width: 100% !important;
                      max-width: 100% !important;
                      height: auto !important;
                      padding: 1.5cm !important;
                      margin: 0 !important;
                      box-shadow: none !important;
                      border: 8px double #1c1917 !important;
                      border-radius: 4px !important;
                      background-color: white !important;
                    }
                    .no-print {
                      display: none !important;
                    }
                  }
                `}} />

                {/* Modal Actions */}
                <div className="flex justify-between items-center border-b border-stone-100 pb-4 no-print">
                  <div className="flex items-center gap-2">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
                    </span>
                    <h3 className="text-lg font-black text-slate-900">🖨️ የውጤት መግለጫ ካርድ ማተሚያ (Report Card Preview)</h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <span>🖨️ ወረቀት ላይ አትም (Print / PDF)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPrintModal(false)}
                      className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition-all"
                    >
                      ዝጋ (Close)
                    </button>
                  </div>
                </div>

                {/* ACTUAL DOCUMENT SHEET TO BE PRINTED OR PREVIEWED */}
                <div 
                  id="print-target-sheet" 
                  className="bg-white border-4 border-double border-stone-800 p-8 space-y-6 text-stone-900 font-sans shadow-xs relative"
                >
                  {/* Background Watermark/Logo pattern in print */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                    {schoolConfig.logoType === 'graduation' && <GraduationCap className="w-96 h-96 text-stone-900" />}
                    {schoolConfig.logoType === 'book' && <BookOpen className="w-96 h-96 text-stone-900" />}
                    {schoolConfig.logoType === 'shield' && <ShieldCheck className="w-96 h-96 text-stone-900" />}
                    {schoolConfig.logoType === 'award' && <Award className="w-96 h-96 text-stone-900" />}
                  </div>

                  {/* Document Header */}
                  <div className="text-center border-b-2 border-stone-950 pb-5 relative space-y-2">
                    <div className="flex items-center justify-center gap-3">
                      {schoolConfig.logoType === 'graduation' && <GraduationCap className="w-12 h-12 text-stone-800" />}
                      {schoolConfig.logoType === 'book' && <BookOpen className="w-12 h-12 text-stone-800" />}
                      {schoolConfig.logoType === 'shield' && <ShieldCheck className="w-12 h-12 text-stone-800" />}
                      {schoolConfig.logoType === 'award' && <Award className="w-12 h-12 text-stone-800" />}
                      <div>
                        <h1 className="text-2xl font-black tracking-tight text-stone-950">{schoolConfig.nameAmh}</h1>
                        <h2 className="text-lg font-bold tracking-wide text-stone-700 uppercase">{schoolConfig.nameEng}</h2>
                      </div>
                    </div>
                    <p className="text-xs italic font-semibold text-stone-500">“ {schoolConfig.mottoAmh} • {schoolConfig.mottoEng} ”</p>
                    
                    <div className="text-[10px] text-stone-500 font-medium pt-1.5 flex justify-center gap-6">
                      <span>📞 {schoolConfig.phone}</span>
                      <span>📧 {schoolConfig.email}</span>
                      <span>📍 {schoolConfig.address}</span>
                    </div>
                  </div>

                  {/* Title of Document */}
                  <div className="text-center space-y-1">
                    <h3 className="text-base font-extrabold text-stone-900 tracking-wide uppercase">የተማሪ ውጤት መግለጫ ካርድ (Official Report Card)</h3>
                    <p className="text-xs font-mono text-stone-500">Academic Term: {schoolConfig.evaluationMode === 'quarter' ? 'Quarters Combined' : 'Semesters Combined'} - Year 2026</p>
                  </div>

                  {/* Student Details Info Block */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-stone-50 border border-stone-300 rounded-xl text-xs">
                    <div>
                      <span className="text-stone-500 font-bold block uppercase">የተማሪው ሙሉ ስም</span>
                      <strong className="text-stone-900 block text-sm font-extrabold mt-0.5">{foundStudent.name}</strong>
                    </div>
                    <div>
                      <span className="text-stone-500 font-bold block uppercase">ልዩ መታወቂያ (ID)</span>
                      <strong className="text-stone-900 block font-mono text-sm font-extrabold mt-0.5">{foundStudent.id}</strong>
                    </div>
                    <div>
                      <span className="text-stone-500 font-bold block uppercase">ክፍልና ደረጃ (Grade)</span>
                      <strong className="text-stone-900 block text-sm font-extrabold mt-0.5">{foundStudent.grade} - {foundStudent.section}</strong>
                    </div>
                    <div>
                      <span className="text-stone-500 font-bold block uppercase">ጾታ (Gender)</span>
                      <strong className="text-stone-900 block text-sm font-extrabold mt-0.5">
                        {foundStudent.gender === 'Male' ? 'ወንድ (Male)' : 'ሴት (Female)'}
                      </strong>
                    </div>
                  </div>

                  {/* Main Report Table */}
                  <table className="w-full text-left border-collapse border border-stone-400 text-xs">
                    <thead>
                      <tr className="bg-stone-100 text-stone-800 border-b border-stone-400">
                        <th className="p-2 border-r border-stone-400 font-extrabold text-stone-900">ትምህርት አይነት (Subject)</th>
                        <th className="p-2 border-r border-stone-400 text-center font-bold">Quiz (10)</th>
                        <th className="p-2 border-r border-stone-400 text-center font-bold">CW (10)</th>
                        <th className="p-2 border-r border-stone-400 text-center font-bold">HW (10)</th>
                        <th className="p-2 border-r border-stone-400 text-center font-bold">Mid (20)</th>
                        <th className="p-2 border-r border-stone-400 text-center font-bold">Final (50)</th>
                        <th className="p-2 border-r border-stone-400 text-center font-extrabold text-stone-900">ድምር (100)</th>
                        <th className="p-2 text-center font-extrabold text-stone-900">ደረጃ (Letter)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schoolConfig.subjects.map((sub) => {
                        const match = foundGrades.find(g => g.subject === sub);
                        const total = match ? match.total : 0;
                        
                        const getLetterGrade = (score: number) => {
                          if (score >= 90) return 'A+';
                          if (score >= 83) return 'A';
                          if (score >= 75) return 'B+';
                          if (score >= 68) return 'B';
                          if (score >= 60) return 'C+';
                          if (score >= 50) return 'C';
                          if (score >= 40) return 'D';
                          return 'F';
                        };

                        return (
                          <tr key={sub} className="border-b border-stone-300 hover:bg-stone-50/50">
                            <td className="p-2 border-r border-stone-400 font-extrabold text-stone-900">{sub}</td>
                            <td className="p-2 border-r border-stone-400 text-center font-semibold text-stone-700">{match ? match.quiz : '-'}</td>
                            <td className="p-2 border-r border-stone-400 text-center font-semibold text-stone-700">{match ? match.cw : '-'}</td>
                            <td className="p-2 border-r border-stone-400 text-center font-semibold text-stone-700">{match ? match.hw : '-'}</td>
                            <td className="p-2 border-r border-stone-400 text-center font-semibold text-stone-700">{match ? match.mid : '-'}</td>
                            <td className="p-2 border-r border-stone-400 text-center font-semibold text-stone-700">{match ? match.final : '-'}</td>
                            <td className="p-2 border-r border-stone-400 text-center font-extrabold text-stone-950 bg-stone-50/30">
                              {match ? `${match.total}%` : '-'}
                            </td>
                            <td className="p-2 text-center font-extrabold text-indigo-900">
                              {match ? getLetterGrade(match.total) : '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Summary Metrics & Conduct Card */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Academic GPA overview */}
                    <div className="p-4 border border-stone-400 rounded-xl space-y-1.5 text-xs">
                      <h4 className="font-extrabold text-stone-900 border-b border-stone-200 pb-1">📊 የውጤት መግለጫ (Summary Metrics)</h4>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-stone-500 font-semibold">ጠቅላላ የትምህርት ብዛት (Subjects):</span>
                        <strong className="text-stone-900">{schoolConfig.subjects.length}</strong>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-stone-500 font-semibold">ድምር ማርክ (Cumulative Total):</span>
                        <strong className="text-stone-900">
                          {foundGrades.reduce((sum, item) => sum + item.total, 0)} / {schoolConfig.subjects.length * 100}
                        </strong>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-stone-500 font-semibold">አማካይ ውጤት በመቶኛ (GPA Average):</span>
                        <strong className="text-indigo-900 text-sm font-black">
                          {foundGrades.length > 0 
                            ? `${Math.round(foundGrades.reduce((sum, item) => sum + item.total, 0) / foundGrades.length)}%`
                            : '0%'}
                        </strong>
                      </div>
                    </div>

                    {/* Extra info: Conduct, Absence, Promotion Status */}
                    <div className="p-4 border border-stone-400 rounded-xl space-y-1.5 text-xs">
                      <h4 className="font-extrabold text-stone-900 border-b border-stone-200 pb-1">📋 ምግባርና አቴንዳንስ (Conduct & Attendance)</h4>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-stone-500 font-semibold">ምግባር (Conduct Standard):</span>
                        <strong className="text-emerald-800 font-black">
                          {studentExtraInfo[foundStudent.id]?.conduct || 'A'}
                        </strong>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-stone-500 font-semibold">የቀሪ ቀናት ብዛት (Absence Days):</span>
                        <strong className="text-stone-900">
                          {studentExtraInfo[foundStudent.id]?.absent || 0} ቀናት
                        </strong>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-stone-500 font-semibold">ውሳኔ (Academic Decision):</span>
                        <strong className={`font-black ${
                          (foundGrades.reduce((sum, item) => sum + item.total, 0) / (foundGrades.length || 1)) >= 50
                            ? 'text-emerald-700'
                            : 'text-amber-700'
                        }`}>
                          {(foundGrades.reduce((sum, item) => sum + item.total, 0) / (foundGrades.length || 1)) >= 50
                            ? 'ያለፈ / Promoted to Next Class 🎉'
                            : 'ተጨማሪ ድጋፍ ያስፈልጋል / Needs Support ⚠️'}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Certificate and signature stamp layout */}
                  <div className="grid grid-cols-3 gap-4 pt-8 text-center text-xs">
                    {/* Homeroom teacher signature */}
                    <div className="space-y-4">
                      <p className="border-t border-stone-400 pt-2 font-bold text-stone-800">የክፍሉ ኃላፊ መምህር<br/>(Homeroom Teacher)</p>
                      <span className="text-[10px] text-stone-400 block italic">ቀን/Date: ________________</span>
                    </div>

                    {/* Stamp block */}
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-20 h-20 rounded-full border-2 border-dashed border-stone-400 flex items-center justify-center text-center p-1.5 text-[9px] text-stone-400 font-bold leading-tight select-none">
                        ተቋማዊ ማኅተም<br/>Official Seal
                      </div>
                    </div>

                    {/* Director stamp signature */}
                    <div className="space-y-4">
                      <p className="border-t border-stone-400 pt-2 font-bold text-stone-800">በትምህርት ቤቱ ዳይሬክተር<br/>(School Director)</p>
                      <span className="text-[10px] text-stone-400 block italic">ቀን/Date: ________________</span>
                    </div>
                  </div>

                </div>

                {/* Print instructions notice in modal footer */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[10px] text-stone-500 leading-relaxed font-semibold flex items-start gap-1.5 no-print">
                  <span>💡</span>
                  <p>
                    <strong>ጠቃሚ ምክር፡</strong> &ldquo;ወረቀት ላይ አትም&rdquo; የሚለውን ሲጫኑ የብሮውዘሩ የህትመት ገጽ ይከፈታል። በዚያ ገጽ ላይ <strong>&quot;Headers and Footers&quot;</strong> የሚለውን ማጥፋትዎን እና <strong>&quot;Background Graphics&quot;</strong> የሚለውን ማብራትዎን ያረጋግጡ። ይህም የትምህርት ቤቱን አርማና ጌጦች በተሟላ ውበት ለማተም ይረዳል።
                  </p>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
