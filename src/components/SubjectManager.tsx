import { useState, useEffect } from 'react';
import { Subject } from '../types';
import { X, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface SubjectManagerProps {
  onClose: () => void;
}

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
  '#D4A5A5', '#9E9E9E', '#58B19F', '#FFB6B9', '#BAD7DF'
];

const STORAGE_KEY = 'subjects';

export default function SubjectManager({ onClose }: SubjectManagerProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: COLORS[0],
    goalHoursPerWeek: 5,
  });

  useEffect(() => {
    const storedSubjects = localStorage.getItem(STORAGE_KEY);
    if (storedSubjects) {
      setSubjects(JSON.parse(storedSubjects));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
  }, [subjects]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Please enter a subject name');
      return;
    }
  
    if (editingId) {
      const updatedSubjects = subjects.map((subject) =>
        subject.id === editingId ? { ...subject, ...formData } : subject
      );
      setSubjects(updatedSubjects);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSubjects));
      setEditingId(null);
      toast.success('Subject updated');
    } else {
      const newSubject = { id: Date.now().toString(), ...formData };
      const updatedSubjects = [...subjects, newSubject];
      setSubjects(updatedSubjects);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSubjects));
      toast.success('Subject added');
    }
  
    setFormData({ name: '', color: COLORS[0], goalHoursPerWeek: 5 });
  };

  const handleEdit = (subject: Subject) => {
    setEditingId(subject.id);
    setFormData({
      name: subject.name,
      color: subject.color,
      goalHoursPerWeek: subject.goalHoursPerWeek,
    });
  };

  const handleDelete = (id: string) => {
    const updatedSubjects = subjects.filter((subject) => subject.id !== id);
    setSubjects(updatedSubjects);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSubjects));
    toast.success('Subject deleted');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Manage Subjects</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter subject name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-8 h-8 rounded-full border-2 ${
                      formData.color === color ? 'border-black' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weekly Goal (hours)
              </label>
              <input
                type="number"
                value={formData.goalHoursPerWeek}
                onChange={(e) => {
                  const updatedHours = Math.max(0, parseInt(e.target.value) || 0);
                  setFormData({ ...formData, goalHoursPerWeek: updatedHours });
                  if (editingId) {
                    setSubjects((prevSubjects) => {
                      const updatedSubjects = prevSubjects.map(subject => 
                        subject.id === editingId ? { ...subject, goalHoursPerWeek: updatedHours } : subject
                      );
                      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSubjects));
                      return updatedSubjects;
                    });
                  }
                }}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                min="0"
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              {editingId ? 'Update Subject' : 'Add Subject'}
            </button>
          </div>
        </form>

        <div className="space-y-2">
          {subjects.map((subject) => (
            <div key={subject.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: subject.color }} />
                <span>{subject.name}</span>
                <span className="text-sm text-gray-500">{subject.goalHoursPerWeek}h/week</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleEdit(subject)} className="p-1 text-gray-500 hover:text-gray-700">
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(subject.id)}
                  className="p-1 text-gray-500 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}