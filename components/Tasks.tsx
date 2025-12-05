
import React, { useState, useContext, useMemo, useEffect } from 'react';
import { AppContext } from '../App';
import { Task } from '../types';
import { CloseIcon, ClockIcon, BellIcon, CheckCircleIcon, SortAscIcon, ClipboardListIcon } from './icons';

const priorityStyles = {
    High: 'bg-red-500',
    Medium: 'bg-yellow-500',
    Low: 'bg-green-500',
};

const departmentOptions = [
    'General',
    'Management',
    'Chemical Engineering Trainer',
    'Fiberglass Trainer',
    'Paper Bag Trainer',
    'Operations',
    'Sales',
];

const AddTaskModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: Omit<Task, 'id' | 'status'>) => void;
}> = ({ isOpen, onClose, onSave }) => {
    const initialFormState: Omit<Task, 'id' | 'status'> = {
        title: '',
        description: '',
        assignee: '',
        department: departmentOptions[0],
        dueDate: '',
        priority: 'Medium',
        reminder: 'none',
    };
    const [formData, setFormData] = useState(initialFormState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value as any }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.assignee || !formData.dueDate) {
            alert('Title, Assignee, and Due Date are required.');
            return;
        }
        onSave(formData);
        onClose();
        setFormData(initialFormState);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg animate-fade-in-up">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-semibold text-gray-800">Add New Task</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200"><CloseIcon className="w-6 h-6 text-gray-600" /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <InputField label="Task Title" name="title" value={formData.title} onChange={handleChange} required />
                        <InputField label="Assignee" name="assignee" value={formData.assignee} onChange={handleChange} placeholder="e.g., John Doe" required />
                        <div>
                            <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                            <select id="department" name="department" value={formData.department} onChange={handleChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500">
                                {departmentOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <InputField label="Due Date" name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} required />
                        <div>
                             <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
                             <select id="priority" name="priority" value={formData.priority} onChange={handleChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500">
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                         <div>
                            <label htmlFor="reminder" className="block text-sm font-medium text-gray-700">Reminder</label>
                            <select id="reminder" name="reminder" value={formData.reminder} onChange={handleChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500">
                                <option value="none">None</option>
                                <option value="on_due_date">On due date</option>
                                <option value="1_day_before">1 day before</option>
                                <option value="2_days_before">2 days before</option>
                                <option value="1_week_before">1 week before</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </div>
                    <div className="flex justify-end items-center p-4 bg-gray-50 rounded-b-lg space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">Save Task</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const InputField: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void, required?: boolean, type?: string, placeholder?: string}> = ({label, name, value, onChange, required, type = 'text', placeholder}) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
      <input type={type} id={name} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500" />
    </div>
);


const getDueDateStatus = (dueDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(dueDateStr);
    dueDate.setHours(0,0,0,0);
    // Adjust for timezone differences by getting time in UTC
    const utcDueDate = new Date(dueDate.getUTCFullYear(), dueDate.getUTCMonth(), dueDate.getUTCDate());
    
    if (utcDueDate < today) return { text: 'Overdue', color: 'border-red-500', iconColor: 'text-red-500' };
    if (utcDueDate.getTime() === today.getTime()) return { text: 'Due Today', color: 'border-yellow-500', iconColor: 'text-yellow-500' };
    return null;
}

const getReminderText = (reminder?: Task['reminder']) => {
    if (!reminder || reminder === 'none') return '';
    const map = {
        'on_due_date': 'On the due date',
        '1_day_before': '1 day before the due date',
        '2_days_before': '2 days before the due date',
        '1_week_before': '1 week before the due date',
    };
    return `Reminder set for: ${map[reminder]}`;
}


const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
    const { updateTaskStatus } = useContext(AppContext);
    const dueDateStatus = getDueDateStatus(task.dueDate);

    return (
        <div
            draggable
            onDragStart={(e) => e.dataTransfer.setData('taskId', task.id)}
            className={`bg-white p-4 rounded-lg shadow-md mb-4 border-l-4 ${dueDateStatus ? dueDateStatus.color : 'border-transparent'} cursor-grab active:cursor-grabbing`}
        >
            <div className="flex justify-between items-start">
                <h4 className="font-semibold text-gray-800">{task.title}</h4>
                <div className={`w-3 h-3 rounded-full ${priorityStyles[task.priority]}`} title={`Priority: ${task.priority}`}></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">{task.description}</p>
            <div className="mt-4">
                <p className="text-xs text-gray-500">
                    <span className="font-semibold">Assignee:</span> {task.assignee}
                </p>
                <p className="text-xs text-gray-500">
                    <span className="font-semibold">Department:</span> {task.department}
                </p>
            </div>
            <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                    <ClockIcon className="w-4 h-4" />
                    <span>{task.dueDate}</span>
                </div>
                 <div className="flex items-center gap-2">
                    {task.reminder && task.reminder !== 'none' && (
                        <div title={getReminderText(task.reminder)}>
                            <BellIcon className="w-4 h-4 text-blue-500" />
                        </div>
                    )}
                    {dueDateStatus && <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${dueDateStatus.iconColor.replace('text', 'bg').replace('500', '100')} ${dueDateStatus.iconColor}`}>{dueDateStatus.text}</span>}
                     {task.status !== 'Done' && (
                        <button 
                            onClick={() => updateTaskStatus(task.id, 'Done')}
                            className="text-green-600 hover:text-green-800 transition-colors p-1 rounded-full -mr-1"
                            title="Mark as Done"
                        >
                            <CheckCircleIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const TaskColumn: React.FC<{ title: string; tasks: Task[]; status: Task['status']; }> = ({ title, tasks, status }) => {
    const { updateTaskStatus } = useContext(AppContext);
    const [isOver, setIsOver] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsOver(true);
    };
    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsOver(false);
    }
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        if (taskId) {
            updateTaskStatus(taskId, status);
        }
        setIsOver(false);
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`bg-gray-100 rounded-lg p-4 w-full md:w-1/3 transition-colors ${isOver ? 'bg-blue-100' : ''}`}
        >
            <h3 className="text-lg font-bold text-gray-700 mb-4 border-b-2 pb-2 flex justify-between items-center">
                <span>{title}</span>
                <span className="text-sm font-normal text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">{tasks.length}</span>
            </h3>
            <div className="space-y-4 h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {tasks.length > 0 ? tasks.map(task => <TaskCard key={task.id} task={task} />) : <p className="text-sm text-gray-500 text-center pt-10">No tasks here.</p>}
            </div>
        </div>
    );
};

const Tasks: React.FC = () => {
    const { tasks, addTask, updateTaskStatus } = useContext(AppContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState<'default' | 'high-low' | 'low-high'>('default');

     useEffect(() => {
        if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
     }, []);

    const priorityValue: Record<string, number> = { 'High': 3, 'Medium': 2, 'Low': 1 };

    const sortTasks = (tasksToSort: Task[]) => {
        if (sortOrder === 'default') return tasksToSort;
        
        return [...tasksToSort].sort((a, b) => {
            const valA = priorityValue[a.priority] || 0;
            const valB = priorityValue[b.priority] || 0;
            return sortOrder === 'high-low' ? valB - valA : valA - valB;
        });
    };

    const todoTasks = useMemo(() => sortTasks(tasks.filter(t => t.status === 'To Do')), [tasks, sortOrder]);
    const inProgressTasks = useMemo(() => sortTasks(tasks.filter(t => t.status === 'In Progress')), [tasks, sortOrder]);
    const doneTasks = useMemo(() => sortTasks(tasks.filter(t => t.status === 'Done')), [tasks, sortOrder]);

    const handleSaveTask = (task: Omit<Task, 'id' | 'status'>) => {
        addTask(task);
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
             <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Task Management</h2>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-start sm:items-center">
                    {/* Sorting Control */}
                    <div className="flex items-center gap-2 bg-white p-1 rounded-lg shadow-sm border border-gray-200">
                        <span className="text-xs font-semibold text-gray-500 uppercase px-2">Sort Priority:</span>
                        <div className="flex">
                            <button
                                onClick={() => setSortOrder('default')}
                                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${sortOrder === 'default' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                Default
                            </button>
                            <button
                                onClick={() => setSortOrder('high-low')}
                                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${sortOrder === 'high-low' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                High &darr;
                            </button>
                            <button
                                onClick={() => setSortOrder('low-high')}
                                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${sortOrder === 'low-high' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                Low &uarr;
                            </button>
                        </div>
                    </div>

                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition-colors shadow-sm whitespace-nowrap"
                    >
                        <ClipboardListIcon className="w-5 h-5" />
                        Add New Task
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <TaskColumn title="To Do" tasks={todoTasks} status="To Do" />
                <TaskColumn title="In Progress" tasks={inProgressTasks} status="In Progress" />
                <TaskColumn title="Done" tasks={doneTasks} status="Done" />
            </div>

            <AddTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTask}
            />
        </div>
    );
};

export default Tasks;
