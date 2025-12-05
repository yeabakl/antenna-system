
import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../App';
import { 
    ClipboardListIcon, CurrencyDollarIcon, UsersIcon, CheckCircleIcon, 
    AcademicCapIcon, EnvelopeIcon, ClipboardCheckIcon, DocumentArrowDownIcon, 
    FolderIcon, FileIcon, FileTextIcon, ChevronRightIcon, FilePdfIcon,
    ShoppingCartIcon, ClockIcon, ArchiveIcon
} from './icons';
import FilePreviewModal from './FilePreviewModal';

const DashboardStatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    action: () => void;
    actionLabel: string;
    borderClass?: string;
}> = ({ title, value, icon, action, actionLabel, borderClass = "border-blue-500" }) => (
    <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${borderClass} transition-transform hover:-translate-y-1`}>
        <div className="flex items-start justify-between mb-4">
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">{value}</h3>
            </div>
            <div className="p-3 bg-gray-50 rounded-full">
                {icon}
            </div>
        </div>
        <button 
            onClick={action}
            className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center gap-1 transition-colors"
        >
            {actionLabel} <ChevronRightIcon className="w-4 h-4" />
        </button>
    </div>
);

const QuickActionButton: React.FC<{ 
    label: string; 
    icon: React.ReactNode; 
    onClick: () => void; 
    bgClass: string;
    textClass: string;
}> = ({ label, icon, onClick, bgClass, textClass }) => (
    <button 
        onClick={onClick}
        className="flex items-center gap-3 px-5 py-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all group text-left w-full"
    >
        <div className={`p-3 rounded-lg ${bgClass} ${textClass} group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <span className="font-semibold text-gray-700 group-hover:text-gray-900 text-sm md:text-base">{label}</span>
    </button>
);

const Dashboard: React.FC = () => {
    const { orders, history, contacts, trainings, letters, tasks, products, navigateTo } = useContext(AppContext);
    const [filePreview, setFilePreview] = useState<{ url: string, name: string } | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    
    // State for Taxonomy Accordion
    const [expandedSector, setExpandedSector] = useState<string | null>(null);

    const totalRevenue = history.reduce((acc, order) => acc + order.machinePrice, 0);
    const pendingTasks = tasks.filter(t => t.status !== 'Done').length;
    const inManufacturingCount = orders.filter(o => o.status === 'Pending').length;
    const readyForCompletionCount = orders.filter(o => o.status === 'Ready for Completion').length;

    // --- Taxonomy Tree Data ---
    const taxonomyTree = useMemo(() => {
        const tree: Record<string, Set<string>> = {};
        products.forEach(p => {
            if (!tree[p.sector]) {
                tree[p.sector] = new Set();
            }
            tree[p.sector].add(p.category);
        });
        return Object.entries(tree).map(([sector, categories]) => ({
            sector,
            categories: Array.from(categories)
        }));
    }, [products]);

    // --- Recent Files / Context Data ---
    const recentFiles = useMemo(() => {
        const allFiles: { name: string; type: string; date: string; url: string; source: string; id: string }[] = [];

        // Orders
        [...orders, ...history].forEach(o => {
            if (o.contractFile) allFiles.push({ name: `Contract - ${o.customerFirstName}`, type: 'contract', date: o.paymentDate || o.deliveryDate, url: o.contractFile, source: `Order #${o.id}`, id: o.id + 'cont' });
            if (o.prepaymentReceipt) allFiles.push({ name: `Receipt - ${o.customerFirstName}`, type: 'receipt', date: o.deliveryDate, url: o.prepaymentReceipt, source: `Order #${o.id}`, id: o.id + 'pre' });
            if (o.restOfPaymentReceipt) allFiles.push({ name: `Final Receipt - ${o.customerFirstName}`, type: 'receipt', date: o.paymentDate, url: o.restOfPaymentReceipt, source: `Order #${o.id}`, id: o.id + 'rest' });
        });

        // Letters
        letters.forEach(l => {
            if (l.letterFile) allFiles.push({ name: l.subject, type: 'letter', date: l.dateReceived, url: l.letterFile, source: `Letter from ${l.senderName}`, id: l.id });
        });

        // Trainings
        trainings.forEach(t => {
            if (t.certificateFile && t.certificateFile !== 'SYSTEM_GENERATED') {
                 allFiles.push({ name: `Certificate - ${t.name}`, type: 'certificate', date: t.certificateIssueDate || t.dueDate, url: t.certificateFile, source: `Training: ${t.trainingType}`, id: t.id });
            }
        });

        // Sort by date descending (approximate as some dates might be future due dates)
        return allFiles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);
    }, [orders, history, letters, trainings]);

    const handleFileClick = (file: { url: string; name: string }) => {
        setFilePreview(file);
        setIsPreviewOpen(true);
    };

    const handleTaxonomyClick = (sector: string, category: string) => {
        navigateTo('products', `filter:${sector}|${category}`);
    };

    const toggleSector = (sector: string) => {
        if (expandedSector === sector) {
            setExpandedSector(null);
        } else {
            setExpandedSector(sector);
        }
    };

    // Quick Actions Handlers
    const handleCreateOrder = () => navigateTo('orders', 'neworder');
    const handleAssignTask = () => navigateTo('tasks');
    const handleAddContact = () => navigateTo('contacts');
    const handleRegisterTraining = () => navigateTo('training');
    const handleAddLetter = () => navigateTo('letters');

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
            <p className="text-gray-500 mb-8">Welcome to Antenna Manufacturing & Business Consultancy</p>

            {/* Quick Actions */}
            <div className="mb-10">
                <h2 className="text-lg font-bold text-gray-700 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <QuickActionButton 
                        label="Create New Order" 
                        icon={<ShoppingCartIcon className="w-6 h-6"/>} 
                        onClick={handleCreateOrder} 
                        bgClass="bg-blue-50" textClass="text-blue-600" 
                    />
                    <QuickActionButton 
                        label="Assign New Task" 
                        icon={<ClipboardCheckIcon className="w-6 h-6"/>} 
                        onClick={handleAssignTask} 
                        bgClass="bg-teal-50" textClass="text-teal-600" 
                    />
                    <QuickActionButton 
                        label="Add New Contact" 
                        icon={<UsersIcon className="w-6 h-6"/>} 
                        onClick={handleAddContact} 
                        bgClass="bg-indigo-50" textClass="text-indigo-600" 
                    />
                    <QuickActionButton 
                        label="Register for Training" 
                        icon={<AcademicCapIcon className="w-6 h-6"/>} 
                        onClick={handleRegisterTraining} 
                        bgClass="bg-purple-50" textClass="text-purple-600" 
                    />
                    <QuickActionButton 
                        label="Add New Letter" 
                        icon={<EnvelopeIcon className="w-6 h-6"/>} 
                        onClick={handleAddLetter} 
                        bgClass="bg-orange-50" textClass="text-orange-600" 
                    />
                </div>
            </div>

            {/* Dashboard Stat Cards */}
            <h2 className="text-lg font-bold text-gray-700 mb-4">Operational Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                <DashboardStatCard
                    title="In Manufacturing"
                    value={inManufacturingCount}
                    icon={<ClipboardListIcon className="w-8 h-8 text-yellow-500" />}
                    action={() => navigateTo('orders', 'manufacturing')}
                    actionLabel="View Orders"
                    borderClass="border-yellow-500"
                />
                 <DashboardStatCard
                    title="Ready for Completion"
                    value={readyForCompletionCount}
                    icon={<CheckCircleIcon className="w-8 h-8 text-blue-500" />}
                    action={() => navigateTo('orders', 'ready')}
                    actionLabel="Finalize Orders"
                    borderClass="border-blue-500"
                />
                <DashboardStatCard
                    title="Completed Orders"
                    value={history.length}
                    icon={<ArchiveIcon className="w-8 h-8 text-green-500" />}
                    action={() => navigateTo('orders', 'history')}
                    actionLabel="View History"
                    borderClass="border-green-500"
                />
                 <DashboardStatCard
                    title="Pending Tasks"
                    value={pendingTasks}
                    icon={<ClockIcon className="w-8 h-8 text-teal-500" />}
                    action={() => navigateTo('tasks')}
                    actionLabel="Manage Tasks"
                    borderClass="border-teal-500"
                />
                <DashboardStatCard
                    title="Total Contacts"
                    value={contacts.length}
                    icon={<UsersIcon className="w-8 h-8 text-indigo-500" />}
                    action={() => navigateTo('contacts')}
                    actionLabel="Manage Contacts"
                    borderClass="border-indigo-500"
                />
                <DashboardStatCard
                    title="Training Registrations"
                    value={trainings.length}
                    icon={<AcademicCapIcon className="w-8 h-8 text-purple-500" />}
                    action={() => navigateTo('training')}
                    actionLabel="View Registrations"
                    borderClass="border-purple-500"
                />
                <DashboardStatCard
                    title="Received Letters"
                    value={letters.length}
                    icon={<EnvelopeIcon className="w-8 h-8 text-orange-500" />}
                    action={() => navigateTo('letters')}
                    actionLabel="View Letters"
                    borderClass="border-orange-500"
                />
                {/* Keeping Revenue as an extra card to balance the grid */}
                <DashboardStatCard
                    title="Total Revenue"
                    value={`${(totalRevenue / 1000).toFixed(1)}k`}
                    icon={<CurrencyDollarIcon className="w-8 h-8 text-gray-500" />}
                    action={() => navigateTo('reports')}
                    actionLabel="View Reports"
                    borderClass="border-gray-500"
                />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Product Taxonomy (Collapsible Tree) */}
                <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-6 h-fit">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <CheckCircleIcon className="w-5 h-5 text-gray-500" /> Product Taxonomy
                    </h2>
                    <div className="space-y-2">
                        {taxonomyTree.map((sector) => (
                            <div key={sector.sector} className="border border-gray-100 rounded-lg overflow-hidden">
                                <button 
                                    onClick={() => toggleSector(sector.sector)}
                                    className={`w-full flex justify-between items-center px-4 py-3 text-left font-semibold transition-colors ${
                                        expandedSector === sector.sector 
                                        ? 'bg-blue-50 text-blue-700' 
                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    {sector.sector}
                                    <ChevronRightIcon className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${expandedSector === sector.sector ? 'rotate-90' : ''}`} />
                                </button>
                                {expandedSector === sector.sector && (
                                    <div className="bg-white border-t border-gray-100 animate-fade-in">
                                        {sector.categories.map((category) => (
                                            <button 
                                                key={category} 
                                                onClick={() => handleTaxonomyClick(sector.sector, category)}
                                                className="w-full text-left px-4 py-2 pl-8 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors flex justify-between items-center group border-l-4 border-transparent hover:border-blue-500"
                                            >
                                                {category}
                                                <span className="opacity-0 group-hover:opacity-100 text-blue-400">&rarr;</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Context / Recent Files Section */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <FolderIcon className="w-5 h-5 text-gray-500" /> Context (Files & History)
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr>
                                    <th className="px-5 py-3 border-b-2 border-gray-100 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">File Name</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-100 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-100 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Source</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-100 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentFiles.length > 0 ? recentFiles.map((file) => (
                                    <tr key={file.id} onClick={() => handleFileClick(file)} className="hover:bg-blue-50 cursor-pointer transition-colors">
                                        <td className="px-5 py-4 border-b border-gray-100 text-sm">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded flex items-center justify-center mr-3">
                                                    {file.type === 'contract' ? <FileTextIcon className="w-4 h-4 text-blue-500" /> :
                                                     file.type === 'receipt' ? <FileIcon className="w-4 h-4 text-green-500" /> :
                                                     file.type === 'certificate' ? <AcademicCapIcon className="w-4 h-4 text-purple-500" /> :
                                                     file.type === 'letter' ? <EnvelopeIcon className="w-4 h-4 text-orange-500" /> :
                                                     <FileIcon className="w-4 h-4 text-gray-500" />}
                                                </div>
                                                <p className="text-gray-900 font-medium truncate max-w-xs">{file.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 border-b border-gray-100 text-sm capitalize text-gray-600">{file.type}</td>
                                        <td className="px-5 py-4 border-b border-gray-100 text-sm text-gray-600">{file.source}</td>
                                        <td className="px-5 py-4 border-b border-gray-100 text-sm text-gray-500">{file.date}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="px-5 py-8 text-center text-gray-500">No recent files found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <FilePreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                fileDataUrl={filePreview?.url || ''}
                fileName={filePreview?.name || ''}
            />
        </div>
    );
};

export default Dashboard;
