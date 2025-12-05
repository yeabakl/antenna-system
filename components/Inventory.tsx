
import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../App';
import { InventoryItem, InventoryStatus } from '../types';
import { 
    SearchIcon, FilterIcon, TruckIcon, ShieldCheckIcon, 
    HomeIcon, ShoppingCartIcon, CheckCircleIcon, 
    ExclamationIcon, LockClosedIcon, UploadIcon, DocumentArrowDownIcon
} from './icons';

// --- Components ---

const StatusBadge: React.FC<{ status: InventoryStatus }> = ({ status }) => {
    const styles = {
        'Inbound': 'bg-blue-100 text-blue-800',
        'Quarantine': 'bg-orange-100 text-orange-800',
        'Available': 'bg-green-100 text-green-800',
        'Reserved': 'bg-purple-100 text-purple-800',
        'DeadStock': 'bg-gray-100 text-gray-800 border border-gray-300',
    };
    return (
        <span className={`px-2 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${styles[status]}`}>
            {status}
        </span>
    );
};

const GovernanceBadge: React.FC<{ item: InventoryItem }> = ({ item }) => {
    if (item.weightKg > 25) {
        return (
            <span className="flex items-center gap-1 text-[10px] font-bold bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded" title={`Heavy Lift: ${item.weightKg}kg`}>
                <ExclamationIcon className="w-3 h-3" /> &gt;25kg
            </span>
        );
    }
    if (item.hazardType !== 'None') {
        return (
            <span className="flex items-center gap-1 text-[10px] font-bold bg-yellow-50 text-yellow-600 border border-yellow-200 px-2 py-0.5 rounded">
                <LockClosedIcon className="w-3 h-3" /> {item.hazardType}
            </span>
        );
    }
    return null;
};

const FlowCard: React.FC<{ 
    title: string; 
    count: number; 
    icon: React.ReactNode; 
    colorClass: string; 
    subtext: string;
    onClick?: () => void;
    isActive?: boolean;
}> = ({ title, count, icon, colorClass, subtext, onClick, isActive }) => (
    <div 
        onClick={onClick}
        className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${colorClass} cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg ${isActive ? 'ring-2 ring-offset-2 ring-blue-400' : ''}`}
    >
        <div className="flex justify-between items-start">
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
                <h3 className="text-3xl font-black text-gray-800">{count}</h3>
                <p className="text-xs text-gray-400 mt-2">{subtext}</p>
            </div>
            <div className={`p-3 rounded-full bg-opacity-10 ${colorClass.replace('border-', 'bg-')} ${colorClass.replace('border-', 'text-')}`}>
                {icon}
            </div>
        </div>
    </div>
);

const Inventory: React.FC = () => {
    const { inventory, updateInventoryItem } = useContext(AppContext);
    const [filterStatus, setFilterStatus] = useState<InventoryStatus | 'All'>('All');
    const [searchTerm, setSearchTerm] = useState('');

    // --- Derived Data for Dashboard ---
    const inboundCount = inventory.filter(i => i.status === 'Inbound').length;
    const quarantineCount = inventory.filter(i => i.status === 'Quarantine').length;
    const availableCount = inventory.filter(i => i.status === 'Available').length;
    const reservedCount = inventory.filter(i => i.status === 'Reserved').length;

    // --- Filtering Logic ---
    const filteredInventory = useMemo(() => {
        return inventory.filter(item => {
            const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
            const matchesSearch = 
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.locationZone.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [inventory, filterStatus, searchTerm]);

    // --- Actions ---
    const handleMoveStock = (item: InventoryItem, newStatus: InventoryStatus, newZone?: string) => {
        // Simple state update simulation
        const updatedItem = { 
            ...item, 
            status: newStatus,
            locationZone: newZone || item.locationZone
        };
        updateInventoryItem(updatedItem);
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in bg-gray-50 min-h-screen">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Inventory Flow Control</h1>
                    <p className="text-gray-500 mt-1">Real-time visibility from Receiving to Dispatch</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition-colors">
                        <UploadIcon className="w-4 h-4" /> Receive Stock (GRN)
                    </button>
                    <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-sm">
                        <DocumentArrowDownIcon className="w-4 h-4" /> Audit
                    </button>
                </div>
            </div>

            {/* 1. FLOW DASHBOARD (The Pipeline) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <FlowCard 
                    title="1. Inbound" 
                    count={inboundCount} 
                    icon={<TruckIcon className="w-6 h-6" />} 
                    colorClass="border-blue-500" 
                    subtext="Pending Arrivals"
                    onClick={() => setFilterStatus('Inbound')}
                    isActive={filterStatus === 'Inbound'}
                />
                <FlowCard 
                    title="2. Inspection (QC)" 
                    count={quarantineCount} 
                    icon={<ShieldCheckIcon className="w-6 h-6" />} 
                    colorClass="border-orange-500" 
                    subtext="Awaiting QC Check"
                    onClick={() => setFilterStatus('Quarantine')}
                    isActive={filterStatus === 'Quarantine'}
                />
                <FlowCard 
                    title="3. Storage" 
                    count={availableCount} 
                    icon={<HomeIcon className="w-6 h-6" />} 
                    colorClass="border-green-500" 
                    subtext="On Shelves (Available)"
                    onClick={() => setFilterStatus('Available')}
                    isActive={filterStatus === 'Available'}
                />
                <FlowCard 
                    title="4. Outbound" 
                    count={reservedCount} 
                    icon={<ShoppingCartIcon className="w-6 h-6" />} 
                    colorClass="border-purple-500" 
                    subtext="Reserved for Orders"
                    onClick={() => setFilterStatus('Reserved')}
                    isActive={filterStatus === 'Reserved'}
                />
            </div>

            {/* 2. MASTER RECORD LIST */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Table Header / Toolbar */}
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50">
                    <h3 className="font-bold text-gray-700 flex items-center gap-2">
                        <FilterIcon className="w-5 h-5 text-gray-500" /> 
                        Stock Records ({filteredInventory.length})
                    </h3>
                    
                    <div className="relative w-full sm:w-64">
                        <input 
                            type="text" 
                            placeholder="Search SKU, Item or Zone..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead>
                            <tr className="bg-white text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                                <th className="px-6 py-4 font-semibold">SKU / Item Details</th>
                                <th className="px-6 py-4 font-semibold">Location</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-center">Stock Level</th>
                                <th className="px-6 py-4 font-semibold">Governance</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredInventory.map(item => {
                                const isLowStock = item.quantityOnHand <= item.reorderPoint;
                                return (
                                    <tr key={item.id} className="hover:bg-blue-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-800">{item.name}</span>
                                                <span className="text-xs text-gray-400 font-mono mt-0.5">{item.sku}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                                                    {item.locationZone}
                                                </span>
                                                <span className="text-xs text-gray-400">{item.locationBin}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={item.status} />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className={`text-lg font-bold ${isLowStock ? 'text-red-600' : 'text-gray-700'}`}>
                                                    {item.quantityOnHand}
                                                </span>
                                                {isLowStock && (
                                                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide animate-pulse">Low Stock</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1 items-start">
                                                <GovernanceBadge item={item} />
                                                {item.expiryDate && (
                                                    <span className="text-[10px] text-gray-500">Exp: {item.expiryDate}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {item.status === 'Quarantine' && (
                                                <button 
                                                    onClick={() => handleMoveStock(item, 'Available', 'Zone A (Machines)')}
                                                    className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded shadow-sm font-bold transition-colors"
                                                >
                                                    Pass QC
                                                </button>
                                            )}
                                            {item.status === 'Inbound' && (
                                                <button 
                                                    onClick={() => handleMoveStock(item, 'Quarantine', 'Quarantine Area')}
                                                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded shadow-sm font-bold transition-colors"
                                                >
                                                    Receive
                                                </button>
                                            )}
                                            {item.status === 'Available' && (
                                                <button className="text-xs text-gray-500 hover:text-blue-600 underline font-medium">
                                                    Move / Adjust
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredInventory.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-gray-400 italic">
                                        No inventory records match your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Inventory;
