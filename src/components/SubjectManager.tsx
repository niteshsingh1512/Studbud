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

export default function SubjectManager({ onClose }: SubjectManagerProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: COLORS[0],
    goalHoursPerWeek: 5
  });

  useEffect(() => {
    const storedSubjects = localStorage.getItem('subjects');
    if (storedSubjects) {
      setSubjects(JSON.parse(storedSubjects));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }, [subjects]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Please enter a subject name');
      return;
    }

    if (editingId) {
      setSubjects(prev => prev.map(sub => sub.id === editingId ? { ...sub, ...formData } : sub));
      setEditingId(null);
      toast.success('Subject updated');
    } else {
      const newSubject = { id: Date.now().toString(), ...formData };
      setSubjects(prev => [...prev, newSubject]);
      toast.success('Subject added');
    }

    setFormData({ name: '', color: COLORS[0], goalHoursPerWeek: 5 });
  };

  const handleEdit = (subject: Subject) => {
    setEditingId(subject.id);
    setFormData({
      name: subject.name,
      color: subject.color,
      goalHoursPerWeek: subject.goalHoursPerWeek
    });
  };

  const handleDelete = (id: string) => {
    setSubjects(prev => prev.filter(sub => sub.id !== id));
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
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter subject name"
            className="w-full px-3 py-2 border rounded-lg"
          />
          <button type="submit" className="w-full mt-4 px-4 py-2 text-white bg-indigo-600 rounded-lg">
            {editingId ? 'Update Subject' : 'Add Subject'}
          </button>
        </form>

        <div className="space-y-2">
          {subjects.map((subject) => (
            <div key={subject.id} className="flex justify-between p-3 border rounded-lg">
              <span>{subject.name}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => handleEdit(subject)}><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(subject.id)}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
