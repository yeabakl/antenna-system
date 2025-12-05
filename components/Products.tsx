import React, { useState, useContext, useEffect, useMemo } from 'react';
import { AppContext } from '../App';
import { Product } from '../types';
import { SearchIcon, CubeIcon, VideoIcon, DownloadIcon, WrenchIcon, CheckCircleIcon, PencilIcon, TrashIcon, CloseIcon, UploadIcon, ChevronLeftIcon, ChevronRightIcon, BriefcaseIcon, TruckIcon, AcademicCapIcon, BeakerIcon, CogIcon, HomeIcon, ArchiveIcon, FireIcon, LeafIcon, ShoppingCartIcon, ChartBarIcon, BookOpenIcon, FilterIcon, ClipboardListIcon, ClipboardCheckIcon, FolderIcon } from './icons';

// --- Icons for Selection ---
const SquareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
);
const CheckSquareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
);

// --- Warehouse Theme Components ---

const WarehouseZoneCard: React.FC<{ title: string; icon: React.ReactNode; description: string; onClick: () => void; colorTheme: string }> = ({ title, icon, description, onClick, colorTheme }) => (
    <div 
        onClick={onClick}
        className={`relative overflow-hidden rounded-xl bg-white shadow-lg border-l-8 ${colorTheme} cursor-pointer group h-72 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}
    >
        <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-50"></div>
        <div className={`absolute top-0 right-0 w-40 h-40 ${colorTheme.replace('border-', 'bg-')} opacity-5 rounded-bl-full transform translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-500`}></div>
        
        <div className="p-8 h-full flex flex-col justify-between relative z-10">
            <div>
                <div className="flex justify-between items-start mb-6">
                    <div className={`p-4 rounded-xl bg-white border border-gray-100 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        {icon}
                    </div>
                    <span className="text-4xl font-black text-gray-100 select-none group-hover:text-gray-200 transition-colors tracking-tighter">ZONE</span>
                </div>
                <h3 className="text-3xl font-black text-gray-800 tracking-tight leading-none group-hover:text-gray-900 mb-4">{title}</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-xs">{description}</p>
            </div>
            <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest group-hover:text-gray-800 transition-colors">
                Enter Zone <ChevronRightIcon className="w-4 h-4 ml-2" />
            </div>
        </div>
    </div>
);

const WarehouseAisleCard: React.FC<{ title: string; icon: React.ReactNode; count: number; onClick: () => void }> = ({ title, icon, count, onClick }) => (
    <div 
        onClick={onClick}
        className="bg-white border border-gray-200 hover:border-blue-500 rounded-lg shadow-sm p-6 cursor-pointer hover:bg-blue-50 hover:shadow-md transition-all flex items-center justify-between group h-32"
    >
        <div className="flex items-center gap-6">
            <div className="h-20 w-20 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-lg text-4xl font-black text-gray-300 group-hover:bg-white group-hover:text-blue-200 transition-colors border border-gray-100">
                {title.charAt(0).toUpperCase()}
            </div>
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-200 text-gray-600 uppercase tracking-wider group-hover:bg-blue-200 group-hover:text-blue-800">Aisle</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors">{title}</h3>
                <p className="text-sm text-gray-500 mt-1 group-hover:text-blue-600">{count} Varieties Stocked</p>
            </div>
        </div>
        <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
            <ChevronRightIcon className="w-5 h-5 text-blue-600" />
        </div>
    </div>
);

const WarehouseShelfItem: React.FC<{ itemGroup: string; count: number; image?: string; onClick: () => void }> = ({ itemGroup, count, image, onClick }) => (
    <div 
        onClick={onClick}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-xl hover:border-blue-400 transition-all group flex flex-col h-full"
    >
        <div className="relative h-48 bg-gray-50 flex items-center justify-center overflow-hidden p-6 group-hover:bg-white transition-colors">
            {image ? (
                <img src={image} alt={itemGroup} className="w-full h-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-500" />
            ) : (
                <CubeIcon className="w-20 h-20 text-gray-200 group-hover:text-gray-300" />
            )}
            <div className="absolute top-3 left-3 bg-white bg-opacity-90 px-2 py-1 rounded text-[10px] font-mono font-bold text-gray-500 border border-gray-200 shadow-sm">
                BIN: {itemGroup.substring(0, 3).toUpperCase()}
            </div>
        </div>
        <div className="p-5 border-t border-gray-100 flex-grow flex flex-col justify-between bg-white">
            <h3 className="text-lg font-bold text-gray-800 leading-tight mb-2 group-hover:text-blue-700">{itemGroup}</h3>
            <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-full group-hover:bg-blue-50 group-hover:text-blue-600">{count} Models</span>
                <span className="text-blue-500 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider flex items-center gap-1">Inspect <ChevronRightIcon className="w-3 h-3"/></span>
            </div>
        </div>
    </div>
);

const ProductCard: React.FC<{ 
    product: Product; 
    onClick: () => void; 
    onOrder: (e: React.MouseEvent) => void;
    isSelected: boolean;
    onToggleSelect: (e: React.MouseEvent) => void; 
}> = ({ product, onClick, onOrder, isSelected, onToggleSelect }) => (
    <div 
        onClick={onClick}
        className={`bg-white rounded-xl shadow-md border ${isSelected ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' : 'border-gray-200'} overflow-hidden cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all group flex flex-col`}
    >
        <div className="relative h-64 bg-gray-100 overflow-hidden p-4">
            {/* Selection Checkbox */}
            <div 
                onClick={onToggleSelect}
                className="absolute top-3 left-3 z-20 cursor-pointer p-1 rounded-md bg-white bg-opacity-80 hover:bg-opacity-100 transition-all shadow-sm"
            >
                {isSelected ? <CheckCircleIcon className="w-6 h-6 text-blue-600" /> : <div className="w-6 h-6 rounded-full border-2 border-gray-400 hover:border-blue-500"></div>}
            </div>

            <div className="w-full h-full bg-white rounded-lg flex items-center justify-center overflow-hidden shadow-inner">
                {product.images && product.images.length > 0 ? (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        <CubeIcon className="w-16 h-16 opacity-20" />
                    </div>
                )}
            </div>
            {product.videoUrl && (
                <div className="absolute top-6 right-6 bg-red-600 text-white rounded-full p-2 shadow-lg hover:bg-red-700 transition-colors z-10">
                    <VideoIcon className="w-4 h-4" />
                </div>
            )}
            <div className="absolute bottom-6 left-6 bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded shadow-md">
                {product.model}
            </div>
        </div>
        <div className="p-6 flex-grow flex flex-col">
            <div className="mb-2">
                 <h3 className="text-xl font-bold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors">{product.name}</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6 line-clamp-2 flex-grow">{product.shortDescription}</p>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Unit Price</span>
                    <span className="text-lg font-black text-gray-900">{product.price ? `${new Intl.NumberFormat().format(product.price)} ETB` : 'Contact us'}</span>
                </div>
                <button 
                    onClick={onOrder}
                    className={`flex items-center gap-2 px-5 py-2.5 text-white text-sm font-bold rounded-lg shadow-md transition-all active:scale-95 hover:shadow-lg ${product.sector === 'Training' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {product.sector === 'Training' ? (
                        <>
                            <AcademicCapIcon className="w-4 h-4" />
                            Register
                        </>
                    ) : (
                        <>
                            <ShoppingCartIcon className="w-4 h-4" />
                            Order
                        </>
                    )}
                </button>
            </div>
        </div>
    </div>
);

interface BasketModalProps {
    isOpen: boolean;
    onClose: () => void;
    basketItems: Product[];
    onRemoveItem: (id: string) => void;
    onSubmit: (formData: any) => void;
    onClear: () => void;
}

const BasketModal: React.FC<BasketModalProps> = ({ isOpen, onClose, basketItems, onRemoveItem, onSubmit, onClear }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ name, phone, notes });
        onClose();
        setName('');
        setPhone('');
        setNotes('');
    };

    if (!isOpen) return null;

    const totalPrice = basketItems.reduce((acc, item) => acc + (item.price || 0), 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-up">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <ClipboardListIcon className="w-6 h-6 text-blue-600" />
                        Inquiry Basket ({basketItems.length})
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><CloseIcon className="w-6 h-6" /></button>
                </div>
                
                <div className="flex-grow overflow-y-auto p-6">
                    {basketItems.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">Your basket is empty. Select items to inquire about.</div>
                    ) : (
                        <div className="space-y-4">
                            {basketItems.map(item => (
                                <div key={item.id} className="flex items-center gap-4 bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
                                    <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                                        {item.images[0] ? <img src={item.images[0]} className="w-full h-full object-cover" /> : <CubeIcon className="w-full h-full p-4 text-gray-300" />}
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                                        <p className="text-xs text-gray-500">{item.model}</p>
                                        <p className="text-sm font-semibold text-blue-600">{item.price ? `${new Intl.NumberFormat().format(item.price)} ETB` : 'Price on Request'}</p>
                                    </div>
                                    <button onClick={() => onRemoveItem(item.id)} className="text-red-400 hover:text-red-600 p-2"><TrashIcon className="w-5 h-5" /></button>
                                </div>
                            ))}
                            
                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                <span className="font-bold text-gray-600">Estimated Total:</span>
                                <span className="font-black text-xl text-gray-900">{new Intl.NumberFormat().format(totalPrice)} ETB</span>
                            </div>
                        </div>
                    )}

                    {basketItems.length > 0 && (
                        <form id="inquiryForm" onSubmit={handleSubmit} className="mt-8 space-y-4 border-t pt-6">
                            <h4 className="font-bold text-gray-700">Submit Bulk Inquiry</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField label="Your Name" name="inquirerName" value={name} onChange={(e) => setName(e.target.value)} required />
                                <InputField label="Phone Number" name="inquirerPhone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                                <textarea className="w-full border-gray-300 rounded-md shadow-sm border p-2 text-sm" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any specific questions about these items?"></textarea>
                            </div>
                        </form>
                    )}
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 rounded-b-xl flex justify-between items-center">
                    <button onClick={onClear} className="text-sm text-red-600 hover:text-red-800 hover:underline">Clear Basket</button>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50">Keep Browsing</button>
                        {basketItems.length > 0 && (
                            <button type="submit" form="inquiryForm" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md">Send Inquiry</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const FilterSidebar: React.FC<{
    filters: Record<string, string[]>;
    activeFilters: Record<string, string[]>;
    onFilterChange: (label: string, value: string) => void;
    onClearFilters: () => void;
}> = ({ filters, activeFilters, onFilterChange, onClearFilters }) => {
    return (
        <div className="w-full md:w-64 flex-shrink-0 bg-white rounded-lg shadow-sm border border-gray-200 p-5 h-fit">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2"><FilterIcon className="w-4 h-4" /> Specifications</h3>
                <button onClick={onClearFilters} className="text-xs text-blue-600 hover:underline">Reset</button>
            </div>
            
            {Object.keys(filters).length === 0 ? (
                <p className="text-sm text-gray-400 italic">No specific specs available for this selection.</p>
            ) : (
                <div className="space-y-6">
                    {Object.entries(filters).map(([label, values]) => (
                        <div key={label}>
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{label}</h4>
                            <div className="space-y-2">
                                {(values as string[]).map(val => {
                                    const isActive = activeFilters[label]?.includes(val);
                                    return (
                                        <label key={val} className="flex items-center gap-2 cursor-pointer group">
                                            <div 
                                                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isActive ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300 group-hover:border-blue-400'}`}
                                                onClick={() => onFilterChange(label, val)}
                                            >
                                                {isActive && <CheckCircleIcon className="w-3 h-3 text-white" />}
                                            </div>
                                            <span className={`text-sm ${isActive ? 'text-blue-800 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>{val}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ... (Existing CategoryStatsChart and categoryIcons definitions remain unchanged) ...
const CategoryStatsChart: React.FC<{ data: { category: string; count: number }[] }> = ({ data }) => {
    const max = Math.max(...data.map(d => d.count), 1);
    
    return (
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200 mb-8 animate-fade-in">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <ChartBarIcon className="w-4 h-4" />
                    Inventory Distribution
                </h3>
            </div>
            <div className="relative h-48 sm:h-64">
                <div className="absolute inset-0 flex items-end justify-between gap-2 sm:gap-4 pl-0 sm:pl-4 pb-8">
                     {data.map((item, idx) => {
                        const heightPercentage = (item.count / max) * 100;
                        const displayName = item.category
                            .replace(' Machines', '')
                            .replace(' Equipment', '')
                            .replace(' Production', '')
                            .replace(' Materials', '')
                            .replace(' & ', '&');

                        return (
                            <div key={idx} className="flex-1 flex flex-col justify-end h-full group">
                                <div className="relative w-full bg-blue-100 rounded-t-sm overflow-hidden flex flex-col justify-end transition-all duration-500 hover:bg-blue-200 cursor-pointer border-t border-l border-r border-blue-200" style={{ height: `${heightPercentage}%` }}>
                                      <div className="absolute -top-6 w-full text-center text-xs font-bold text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {item.count}
                                     </div>
                                </div>
                                <div className="mt-2 text-center">
                                    <p className="text-[10px] text-gray-500 font-medium truncate w-full px-1" title={item.category}>
                                        {displayName}
                                    </p>
                                </div>
                            </div>
                        )
                     })}
                </div>
            </div>
        </div>
    );
};

const categoryIcons: Record<string, React.ReactNode> = {
    'Soap & detergent Production': <BeakerIcon className="w-10 h-10 text-blue-500" />,
    'Plastic Processing Machines': <CogIcon className="w-10 h-10 text-gray-500" />,
    'Food & Agro-Processing Machines': <LeafIcon className="w-10 h-10 text-green-500" />,
    'Cleaning & Household Equipment': <HomeIcon className="w-10 h-10 text-indigo-500" />,
    'Construction & Building Materials Machines': <TruckIcon className="w-10 h-10 text-orange-500" />,
    'Packaging Materials Machines': <ArchiveIcon className="w-10 h-10 text-yellow-500" />,
    'Candle & Straw/Chaff': <FireIcon className="w-10 h-10 text-red-500" />,
    'Chemicals': <BeakerIcon className="w-10 h-10 text-purple-500" />,
    'Plastics': <CubeIcon className="w-10 h-10 text-blue-400" />,
    'Woodworking': <CogIcon className="w-10 h-10 text-brown-500" />,
    'Business Planning': <BriefcaseIcon className="w-10 h-10 text-gray-600" />,
    'Vocational Courses': <AcademicCapIcon className="w-10 h-10 text-purple-500" />,
    'default': <CubeIcon className="w-10 h-10 text-gray-400" />
};

// --- Modals ---
interface ProductDetailModalProps { 
    product: Product | null; 
    isOpen: boolean; 
    onClose: () => void;
    isAdmin: boolean;
    onEdit: () => void;
    onOrder: () => void;
    onSwitchProduct: (p: Product) => void;
}

export const ProductDetailModal = ({ product, isOpen, onClose, isAdmin, onEdit, onOrder, onSwitchProduct }: ProductDetailModalProps) => {
    // Access context to find related products
    const { products } = useContext(AppContext);
    
    const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'context' | 'support'>('overview');
    const [activeIndex, setActiveIndex] = useState(0);

    // Only images for carousel
    const imageItems = React.useMemo(() => {
        if (!product) return [];
        return (product.images || []).map(img => ({ type: 'image' as const, url: img }));
    }, [product]);

    // Find related products (Context Logic)
    const relatedProducts = React.useMemo(() => {
        if (!product) return [];
        // Cluster Logic: Same Category, excluding current item
        return products
            .filter(p => p.category === product.category && p.id !== product.id)
            .slice(0, 5); // Limit to top 5 matches
    }, [product, products]);

    useEffect(() => {
        setActiveIndex(0);
        setActiveTab('overview'); // Reset tab on product switch
    }, [product]);

    const handleNext = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (imageItems.length <= 1) return;
        setActiveIndex((prev) => (prev + 1) % imageItems.length);
    };

    const handlePrev = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (imageItems.length <= 1) return;
        setActiveIndex((prev) => (prev - 1 + imageItems.length) % imageItems.length);
    };

    const currentImage = imageItems[activeIndex];

    if (!isOpen || !product) return null;

    const isRawVideo = product.videoUrl && (product.videoUrl.startsWith('data:video') || product.videoUrl.endsWith('.mp4'));

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4 overflow-y-auto backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col animate-fade-in-up overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b bg-gray-50 sticky top-0 z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded uppercase">{product.model}</span>
                            <span className="text-sm text-gray-500">{product.category}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                         {isAdmin && (
                            <button onClick={onEdit} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors shadow-sm">
                                <PencilIcon className="w-4 h-4" /> Edit
                            </button>
                        )}
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                            <CloseIcon className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 h-full">
                        <div className="lg:col-span-3 bg-gray-900 flex flex-col relative min-h-[400px]">
                            {/* Media Container: Flex column to show Image on top, Video on bottom if exists */}
                            <div className="flex flex-col h-full">
                                {/* Top: Image Gallery (60% if video exists, 100% otherwise) */}
                                <div className={`relative ${product.videoUrl ? 'h-3/5 border-b border-gray-700' : 'h-full'} w-full flex items-center justify-center p-4 bg-gray-900`}>
                                    {currentImage ? (
                                        <img src={currentImage.url} alt={product.name} className="max-w-full max-h-full object-contain drop-shadow-2xl" />
                                    ) : (
                                        <CubeIcon className="w-32 h-32 text-gray-700" />
                                    )}
                                    
                                    {/* Navigation Controls */}
                                    {imageItems.length > 1 && (
                                        <>
                                            <button onClick={handlePrev} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 p-3 rounded-full hover:bg-opacity-40 transition-all focus:outline-none text-white backdrop-blur-md">
                                                <ChevronLeftIcon className="w-8 h-8" />
                                            </button>
                                            <button onClick={handleNext} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 p-3 rounded-full hover:bg-opacity-40 transition-all focus:outline-none text-white backdrop-blur-md">
                                                <ChevronRightIcon className="w-8 h-8" />
                                            </button>
                                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                                                {imageItems.map((_, idx) => (
                                                    <button key={idx} onClick={() => setActiveIndex(idx)} className={`w-3 h-3 rounded-full transition-all ${idx === activeIndex ? 'bg-white scale-110' : 'bg-gray-600 hover:bg-gray-400'}`} />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Bottom: Video Player (40% if video exists) */}
                                {product.videoUrl && (
                                    <div className="h-2/5 w-full bg-black relative">
                                        <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs px-2 py-1 rounded shadow flex items-center gap-1">
                                            <VideoIcon className="w-3 h-3" /> Product Demo
                                        </div>
                                        {isRawVideo ? (
                                            <video 
                                                src={product.videoUrl} 
                                                className="w-full h-full object-contain" 
                                                controls
                                            />
                                        ) : (
                                            <iframe 
                                                src={product.videoUrl} 
                                                title="Product Video"
                                                className="w-full h-full" 
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                allowFullScreen
                                            ></iframe>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="lg:col-span-2 flex flex-col h-full bg-white border-l border-gray-200">
                            <div className="p-6 md:p-8 flex-grow overflow-y-auto">
                                <p className="text-gray-600 leading-relaxed mb-8 text-lg">{product.fullDescription}</p>
                                <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
                                    {['overview', 'specs', 'context', 'support'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab as any)}
                                            className={`pb-3 px-1 mr-6 text-sm font-bold uppercase tracking-wide transition-colors border-b-2 whitespace-nowrap ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                                        >
                                            {tab === 'context' ? 'Context' : tab === 'specs' ? 'Specs' : tab}
                                        </button>
                                    ))}
                                </div>
                                <div className="space-y-6">
                                    {activeTab === 'overview' && (
                                        <div className="space-y-6 animate-fade-in">
                                            <div>
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Key Features</h4>
                                                <ul className="space-y-3">
                                                    {product.features.map((feature, idx) => (
                                                        <li key={idx} className="flex items-start gap-3 text-gray-700">
                                                            <div className="mt-0.5"><CheckCircleIcon className="w-5 h-5 text-green-500" /></div>
                                                            <span className="font-medium">{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Use Cases</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {product.useCases.map((useCase, idx) => (
                                                        <span key={idx} className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-md text-sm font-medium border border-gray-200">
                                                            {useCase}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {activeTab === 'specs' && (
                                        <div className="bg-gray-50 rounded-lg p-1 border border-gray-200 animate-fade-in">
                                            <table className="w-full text-sm text-left">
                                                <tbody>
                                                    {product.specifications.map((spec, idx) => (
                                                        <tr key={idx} className="border-b border-gray-200 last:border-0">
                                                            <td className="py-3 px-4 font-medium text-gray-500 bg-gray-50 w-1/3">{spec.label}</td>
                                                            <td className="py-3 px-4 text-gray-900 font-semibold bg-white">{spec.value}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                    {activeTab === 'context' && (
                                        <div className="animate-fade-in space-y-2">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Related Context & Files</h4>
                                            {relatedProducts.length > 0 ? (
                                                <div className="space-y-3">
                                                    {relatedProducts.map(rel => (
                                                        <div 
                                                            key={rel.id} 
                                                            onClick={() => onSwitchProduct(rel)}
                                                            className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer"
                                                        >
                                                            <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden border border-gray-200">
                                                                {rel.images[0] ? (
                                                                    <img src={rel.images[0]} alt={rel.name} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <CubeIcon className="w-full h-full p-2 text-gray-300" />
                                                                )}
                                                            </div>
                                                            <div className="ml-3 flex-grow">
                                                                <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{rel.name}</h4>
                                                                <p className="text-xs text-blue-600 font-medium bg-blue-50 inline-block px-1.5 py-0.5 rounded mt-1">Same Category</p>
                                                            </div>
                                                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-100">
                                                                <ChevronRightIcon className="w-4 h-4" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                                    <FolderIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                                    <p className="text-sm text-gray-500 italic">No related context found for this item.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {activeTab === 'support' && (
                                        <div className="space-y-4 animate-fade-in">
                                            {product.sector === 'Machine Manufacturing' && (
                                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                                    <div className="flex items-start gap-3">
                                                        <WrenchIcon className="w-5 h-5 text-amber-600 mt-0.5" />
                                                        <div>
                                                            <h4 className="font-bold text-amber-800 mb-1 text-sm">Maintenance Note</h4>
                                                            <p className="text-sm text-amber-900 opacity-80 whitespace-pre-line">{product.troubleshooting}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
                                                <p className="font-bold mb-1">Need Technical Help?</p>
                                                <p>Contact our engineering team at <a href="mailto:support@antenna.com" className="underline hover:text-blue-600">support@antenna.com</a>.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="p-6 bg-white border-t border-gray-200 mt-auto sticky bottom-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-500 font-medium">Unit Price</span>
                                        <span className="text-2xl font-black text-gray-900">{product.price ? `${new Intl.NumberFormat().format(product.price)} ETB` : 'Call for Quote'}</span>
                                    </div>
                                    <button onClick={onOrder} className={`w-full py-4 rounded-lg font-bold text-lg text-white shadow-lg transform transition-transform active:scale-[0.98] flex items-center justify-center gap-2 ${product.sector === 'Training' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                        {product.sector === 'Training' ? (<><AcademicCapIcon className="w-6 h-6" /> Register Now</>) : (<><ShoppingCartIcon className="w-6 h-6" /> Place Order</>)}
                                    </button>
                                    <div className="grid grid-cols-2 gap-3 mt-1">
                                        {product.catalogFile && (
                                            <a href={product.catalogFile} download={product.catalogFileName || 'catalog.pdf'} className="flex items-center justify-center py-2 px-4 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md text-sm font-semibold transition-colors gap-2">
                                                <DownloadIcon className="w-4 h-4 text-gray-500" /> Catalog
                                            </a>
                                        )}
                                        {product.sector === 'Training' && product.trainingManual && (
                                            <a href={product.trainingManual} download={`${product.name.replace(/\s/g, '_')}_Manual.pdf`} className="flex items-center justify-center py-2 px-4 bg-white border border-green-300 text-green-700 hover:bg-green-50 rounded-md text-sm font-semibold transition-colors gap-2">
                                                <BookOpenIcon className="w-4 h-4 text-green-600" /> Manual
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface EditProductModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: Omit<Product, 'id'> | Product) => void;
    onDelete: (id: string) => void;
    categories: string[];
    initialSector?: string;
}

const EditProductModal = ({ product, isOpen, onClose, onSave, onDelete, categories, initialSector }: EditProductModalProps) => {
    // ... (This component implementation remains consistent, ensuring it matches previous definition)
    const initialFormState: Omit<Product, 'id'> = {
        name: '',
        itemGroup: '',
        model: '',
        shortDescription: '',
        fullDescription: '',
        category: categories[0] || 'General',
        sector: (initialSector as any) || 'Machine Manufacturing',
        price: 0,
        images: [],
        videoUrl: '',
        catalogFile: '',
        catalogFileName: '',
        features: [''],
        specifications: [{ label: '', value: '' }],
        useCases: [''],
        troubleshooting: ''
    };

    const [formData, setFormData] = useState(initialFormState);
    const [customCategory, setCustomCategory] = useState('');

    useEffect(() => {
        if (product) {
            setFormData(product);
        } else {
            setFormData({
                ...initialFormState,
                sector: (initialSector as any) || 'Machine Manufacturing'
            });
        }
        setCustomCategory('');
    }, [product, isOpen, initialSector]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, images: [...prev.images, reader.result as string] }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Basic size check to prevent crashing browser with huge base64 strings
            if (file.size > 25 * 1024 * 1024) { // 25MB limit
                alert("File is too large. Please upload a video smaller than 25MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, videoUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCatalogUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, catalogFile: reader.result as string, catalogFileName: file.name }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleArrayChange = (index: number, value: string, field: 'features' | 'useCases') => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const addArrayItem = (field: 'features' | 'useCases') => {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
    };

    const removeArrayItem = (index: number, field: 'features' | 'useCases') => {
        setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
    };

    const handleSpecChange = (index: number, field: 'label' | 'value', value: string) => {
        const newSpecs = [...formData.specifications];
        newSpecs[index] = { ...newSpecs[index], [field]: value };
        setFormData(prev => ({ ...prev, specifications: newSpecs }));
    };

    const addSpec = () => {
        setFormData(prev => ({ ...prev, specifications: [...prev.specifications, { label: '', value: '' }] }));
    };

    const removeSpec = (index: number) => {
        setFormData(prev => ({ ...prev, specifications: prev.specifications.filter((_, i) => i !== index) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || (!formData.category && !customCategory)) {
            alert('Name and Category are required');
            return;
        }
        
        const cleanedData = {
            ...formData,
            category: formData.category === 'Other' && customCategory ? customCategory : formData.category,
            itemGroup: formData.itemGroup || formData.name, 
            features: formData.features.filter(f => f.trim() !== ''),
            useCases: formData.useCases.filter(u => u.trim() !== ''),
            specifications: formData.specifications.filter(s => s.label.trim() !== '' || s.value.trim() !== '')
        };

        onSave(cleanedData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-fade-in-up">
                <div className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t-lg">
                    <h3 className="text-xl font-bold text-gray-800">{product ? 'Edit Product' : 'Add New Product'}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200"><CloseIcon className="w-6 h-6 text-gray-600" /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
                             <select name="sector" value={formData.sector} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 py-2 px-3 border">
                                 <option value="Machine Manufacturing">Machine Manufacturing</option>
                                 <option value="Training">Training</option>
                                 <option value="Raw Material Supply">Raw Material Supply</option>
                                 <option value="Machinery Import">Machinery Import</option>
                                 <option value="Business Consultancy">Business Consultancy</option>
                             </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Main Category</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 py-2 px-3 border">
                                {categories.map(type => <option key={type} value={type}>{type}</option>)}
                                <option value="Other">Other</option>
                            </select>
                            {formData.category === 'Other' && (
                                <input 
                                    type="text" 
                                    value={customCategory} 
                                    onChange={(e) => setCustomCategory(e.target.value)} 
                                    placeholder="Enter new category"
                                    className="mt-2 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 py-2 px-3 border"
                                />
                            )}
                        </div>
                        
                        <InputField label="Item Group (Generic Name)" name="itemGroup" value={formData.itemGroup} onChange={handleChange} placeholder="e.g. Bar Soap Machine" required />
                        <InputField label="Model Number/Code" name="model" value={formData.model} onChange={handleChange} placeholder="e.g. BSM-100" />

                        <div className="md:col-span-2">
                            <InputField label="Specific Product Name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Standard Bar Soap Machine (100kg)" required />
                        </div>

                        <div className="md:col-span-2">
                            <InputField label="Short Description" name="shortDescription" value={formData.shortDescription} onChange={handleChange} placeholder="Brief summary for the card view" />
                        </div>
                        <div className="md:col-span-2">
                             <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
                             <textarea name="fullDescription" rows={4} value={formData.fullDescription} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2" />
                        </div>
                        <InputField label="Price (ETB)" name="price" type="number" value={formData.price?.toString() || ''} onChange={handleChange} />
                    </div>

                    <div className="border-t pt-4">
                        <h4 className="text-lg font-semibold mb-3">Media Management</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Images Section */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Import Images</label>
                                <div className="flex flex-wrap gap-3 mb-2">
                                    {formData.images.map((img, idx) => (
                                        <div key={idx} className="relative w-20 h-20 border rounded overflow-hidden group">
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => removeImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl opacity-0 group-hover:opacity-100 transition-opacity">
                                                <CloseIcon className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                                        <UploadIcon className="w-6 h-6 text-gray-400 mb-1" />
                                        <span className="text-[10px] text-gray-500 font-bold uppercase">Import</span>
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                    </label>
                                </div>
                            </div>
                            
                            {/* Video & Catalog Section */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Video</label>
                                    <div className="space-y-2">
                                        <input 
                                            name="videoUrl" 
                                            value={formData.videoUrl?.startsWith('data:') ? '' : formData.videoUrl || ''}
                                            onChange={handleChange} 
                                            placeholder="Paste YouTube Embed URL here..." 
                                            className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500 border disabled:bg-gray-100 disabled:text-gray-400"
                                            disabled={!!formData.videoUrl?.startsWith('data:')}
                                        />
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500 font-bold">OR</span>
                                            <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                                <UploadIcon className="w-5 h-5 mr-2 text-gray-500" />
                                                Upload Raw Video
                                                <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
                                            </label>
                                            {formData.videoUrl?.startsWith('data:') && (
                                                <div className="flex items-center gap-2 ml-auto">
                                                    <span className="text-xs text-green-600 font-bold bg-green-100 px-2 py-1 rounded">Video Uploaded</span>
                                                    <button type="button" onClick={() => setFormData(prev => ({...prev, videoUrl: ''}))} className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"><CloseIcon className="w-4 h-4"/></button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Supports YouTube Embed URL or Raw Video Upload (max 25MB).</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Catalog (PDF)</label>
                                    <div className="flex items-center gap-4">
                                        <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                            <UploadIcon className="w-5 h-5 mr-2 text-gray-500" />
                                            {formData.catalogFileName ? 'Replace File' : 'Upload PDF'}
                                            <input type="file" accept="application/pdf" className="hidden" onChange={handleCatalogUpload} />
                                        </label>
                                        {formData.catalogFileName && <span className="text-sm text-gray-600 truncate max-w-[200px]">{formData.catalogFileName}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Key Features</label>
                            {formData.features.map((feature, idx) => (
                                <div key={idx} className="flex gap-2 mb-2">
                                    <input 
                                        type="text" 
                                        value={feature} 
                                        onChange={(e) => handleArrayChange(idx, e.target.value, 'features')}
                                        className="flex-grow border-gray-300 rounded-md shadow-sm border p-2 text-sm"
                                        placeholder="Feature..."
                                    />
                                    <button type="button" onClick={() => removeArrayItem(idx, 'features')} className="text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5" /></button>
                                </div>
                            ))}
                            <button type="button" onClick={() => addArrayItem('features')} className="text-sm text-blue-600 hover:underline">+ Add Feature</button>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Use Cases</label>
                            {formData.useCases.map((useCase, idx) => (
                                <div key={idx} className="flex gap-2 mb-2">
                                    <input 
                                        type="text" 
                                        value={useCase} 
                                        onChange={(e) => handleArrayChange(idx, e.target.value, 'useCases')}
                                        className="flex-grow border-gray-300 rounded-md shadow-sm border p-2 text-sm"
                                        placeholder="Use case..."
                                    />
                                    <button type="button" onClick={() => removeArrayItem(idx, 'useCases')} className="text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5" /></button>
                                </div>
                            ))}
                            <button type="button" onClick={() => addArrayItem('useCases')} className="text-sm text-blue-600 hover:underline">+ Add Use Case</button>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Technical Specifications</label>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            {formData.specifications.map((spec, idx) => (
                                <div key={idx} className="flex gap-4 mb-2 items-center">
                                    <input 
                                        type="text" 
                                        value={spec.label} 
                                        onChange={(e) => handleSpecChange(idx, 'label', e.target.value)}
                                        className="w-1/3 border-gray-300 rounded-md shadow-sm border p-2 text-sm"
                                        placeholder="Label (e.g. Power)"
                                    />
                                    <input 
                                        type="text" 
                                        value={spec.value} 
                                        onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                                        className="flex-grow border-gray-300 rounded-md shadow-sm border p-2 text-sm"
                                        placeholder="Value (e.g. 15kW)"
                                    />
                                    <button type="button" onClick={() => removeSpec(idx)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5" /></button>
                                </div>
                            ))}
                            <button type="button" onClick={addSpec} className="text-sm text-blue-600 hover:underline">+ Add Specification</button>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                         <label className="block text-sm font-medium text-gray-700 mb-1">Troubleshooting Guide</label>
                         <textarea name="troubleshooting" rows={4} value={formData.troubleshooting} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2" placeholder="Markdown or plain text supported..." />
                    </div>
                </form>

                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-b-lg">
                    {product && onDelete ? (
                         <button onClick={() => { if(confirm('Delete this product?')) onDelete(product.id) }} className="text-red-600 hover:text-red-800 text-sm font-semibold px-3 py-2 rounded hover:bg-red-50 transition-colors">
                            Delete Product
                        </button>
                    ) : <div></div>}
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">Cancel</button>
                        <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">Save Product</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Products: React.FC = () => {
    const { products, addProduct, updateProduct, deleteProduct, navigateTo, setOrderPrefill, setTrainingPrefill, activeSubPage, addLetter } = useContext(AppContext);
    
    const [viewStack, setViewStack] = useState<Array<{ view: 'sectors' | 'categories' | 'itemGroups' | 'products', title: string }>>([{ view: 'sectors', title: 'Warehouse Zones' }]);
    
    const [selectedSector, setSelectedSector] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedItemGroup, setSelectedItemGroup] = useState<string | null>(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    const [manualFilterActive, setManualFilterActive] = useState(false);

    // --- Basket & Filter State ---
    const [basket, setBasket] = useState<Set<string>>(new Set());
    const [isBasketOpen, setIsBasketOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

    const currentView = viewStack[viewStack.length - 1].view;

    // Handle Deep Linking
    useEffect(() => {
        if (activeSubPage && activeSubPage.startsWith('filter:')) {
            const filterParts = activeSubPage.replace('filter:', '').split('|');
            const sector = filterParts[0];
            const category = filterParts[1];

            if (sector) {
                setSelectedSector(sector);
                if (category) {
                    setSelectedCategory(category);
                    setViewStack([
                        { view: 'sectors', title: 'Warehouse Zones' },
                        { view: 'categories', title: `Zone: ${sector}` },
                        { view: 'itemGroups', title: `Aisle: ${category}` }
                    ]);
                } else {
                    setSelectedCategory(null);
                    setViewStack([
                        { view: 'sectors', title: 'Warehouse Zones' },
                        { view: 'categories', title: `Zone: ${sector}` }
                    ]);
                }
            }
        }
    }, [activeSubPage]);

    // Derived Data for Filters
    // We want to generate filters based on the CURRENT context (e.g. if I am in an Aisle, show specs for all products in that aisle)
    const productsInScope = useMemo(() => {
        let filtered = products;
        if (selectedSector) filtered = filtered.filter(p => p.sector === selectedSector);
        if (selectedCategory) filtered = filtered.filter(p => p.category === selectedCategory);
        if (selectedItemGroup) filtered = filtered.filter(p => p.itemGroup === selectedItemGroup);
        return filtered;
    }, [products, selectedSector, selectedCategory, selectedItemGroup]);

    const availableFilters = useMemo(() => {
        const filters: Record<string, Set<string>> = {};
        productsInScope.forEach(p => {
            p.specifications.forEach(spec => {
                if (spec.label && spec.value) {
                    if (!filters[spec.label]) filters[spec.label] = new Set();
                    filters[spec.label].add(spec.value);
                }
            });
        });
        // Convert sets to sorted arrays
        const result: Record<string, string[]> = {};
        Object.entries(filters).forEach(([key, set]) => {
            if (set.size > 1) { // Only show filters with more than 1 option
                result[key] = Array.from(set).sort();
            }
        });
        return result;
    }, [productsInScope]);

    // Sorted Derived Data for "Fixed Hierarchy"
    const availableCategories = useMemo<string[]>(() => {
        if (!selectedSector) return [];
        const sectorProducts = products.filter(p => p.sector === selectedSector);
        return Array.from(new Set(sectorProducts.map(p => p.category))).sort();
    }, [products, selectedSector]);

    const availableItemGroups = useMemo(() => {
        // Base filter
        let filtered = productsInScope;

        // Apply Spec Filters (only if we are NOT at 'products' level, 
        // effectively filtering which Item Groups show up based on their products content? 
        // Actually, filtering usually drills down to Products. 
        // If filters are active, we might want to bypass ItemGroups display and show products directly.
        // Let's implement that logic in render.)
        
        const groups: Record<string, { count: number, image: string }> = {};
        filtered.forEach(p => {
            if (!groups[p.itemGroup]) {
                groups[p.itemGroup] = { count: 0, image: p.images[0] || '' };
            }
            groups[p.itemGroup].count++;
        });
        return Object.entries(groups)
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [productsInScope]);

    const availableProducts = useMemo(() => {
        let filtered = productsInScope;
        
        // Apply Search
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(lower) || 
                p.model.toLowerCase().includes(lower) || 
                p.itemGroup.toLowerCase().includes(lower) ||
                (p.shortDescription && p.shortDescription.toLowerCase().includes(lower)) ||
                (p.fullDescription && p.fullDescription.toLowerCase().includes(lower))
            );
        }

        // Apply Spec Filters
        Object.entries(activeFilters).forEach(([label, values]) => {
            const vals = values as string[];
            if (vals.length > 0) {
                filtered = filtered.filter(p => 
                    p.specifications.some(s => s.label === label && vals.includes(s.value))
                );
            }
        });

        return filtered;
    }, [productsInScope, searchTerm, activeFilters]);

    const machineCategoryStats = useMemo(() => {
        if (selectedSector !== 'Machine Manufacturing') return [];
        const sectorProducts = products.filter(p => p.sector === 'Machine Manufacturing');
        const counts: Record<string, number> = {};
        sectorProducts.forEach(p => {
            counts[p.category] = (counts[p.category] || 0) + 1;
        });
        return Object.entries(counts)
            .map(([category, count]) => ({ category, count }))
            .sort((a, b) => b.count - a.count); 
    }, [products, selectedSector]);

    // Handlers
    const handleSectorClick = (sector: string) => {
        setSelectedSector(sector);
        setManualFilterActive(false);
        setActiveFilters({});
        setViewStack(prev => [...prev, { view: 'categories', title: `Zone: ${sector}` }]);
    };

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category);
        setManualFilterActive(false);
        setActiveFilters({});
        setViewStack(prev => [...prev, { view: 'itemGroups', title: `Aisle: ${category}` }]);
    };

    const handleItemGroupClick = (itemGroup: string) => {
        setSelectedItemGroup(itemGroup);
        setManualFilterActive(false);
        setActiveFilters({});
        setViewStack(prev => [...prev, { view: 'products', title: `Shelf: ${itemGroup}` }]);
    };

    const handleProductClick = (product: Product) => {
        setSelectedProductForDetail(product);
        setIsDetailOpen(true);
    };

    const handleOrder = (e: React.MouseEvent, product: Product) => {
        e.stopPropagation();
        if (product.sector === 'Training') {
            setTrainingPrefill(product.name);
            navigateTo('training');
        } else {
            setOrderPrefill({
                machineType: product.itemGroup,
                description: `${product.name} - ${product.model}`,
                machinePrice: product.price
            });
            navigateTo('orders', 'neworder');
        }
    };
    
    // Breadcrumb Navigation Handlers
    const navigateToRoot = () => {
        setSelectedSector(null);
        setSelectedCategory(null);
        setSelectedItemGroup(null);
        setActiveFilters({});
        setViewStack([{ view: 'sectors', title: 'Warehouse Zones' }]);
    };

    const navigateToSector = (sector: string) => {
        setSelectedCategory(null);
        setSelectedItemGroup(null);
        setActiveFilters({});
        setViewStack([
            { view: 'sectors', title: 'Warehouse Zones' },
            { view: 'categories', title: `Zone: ${sector}` }
        ]);
    };

    const navigateToCategory = (category: string) => {
        setSelectedItemGroup(null);
        setActiveFilters({});
        setViewStack([
            { view: 'sectors', title: 'Warehouse Zones' },
            { view: 'categories', title: `Zone: ${selectedSector}` },
            { view: 'itemGroups', title: `Aisle: ${category}` }
        ]);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setManualFilterActive(false);
        setActiveFilters({});
        navigateToRoot();
    };

    const handleAddProduct = () => {
        setProductToEdit(null);
        setIsEditOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setProductToEdit(product);
        setIsDetailOpen(false);
        setIsEditOpen(true);
    };

    const handleSaveProduct = (product: Omit<Product, 'id'> | Product) => {
        if ('id' in product) {
            updateProduct(product as Product);
        } else {
            addProduct(product);
        }
    };

    const handleDeleteProduct = (id: string) => {
        deleteProduct(id);
        setIsEditOpen(false);
    };

    // Filter Logic
    const toggleFilter = (label: string, value: string) => {
        setActiveFilters((prev: Record<string, string[]>) => {
            const current: string[] = prev[label] || [];
            const updated = current.includes(value) 
                ? current.filter(v => v !== value) 
                : [...current, value];
            
            // If checking a filter, we might want to auto-switch view to products to show results
            // if we are currently at 'itemGroups' (Bin) level.
            if (updated.length > 0 && viewStack[viewStack.length -1].view === 'itemGroups') {
                // We don't change the stack, but we will conditionally render the grid based on filter presence
            }

            return { ...prev, [label]: updated };
        });
    };

    const clearActiveFilters = () => setActiveFilters({});

    // Basket Logic
    const toggleBasket = (e: React.MouseEvent, productId: string) => {
        e.stopPropagation();
        setBasket(prev => {
            const newSet = new Set(prev);
            if (newSet.has(productId)) {
                newSet.delete(productId);
            } else {
                newSet.add(productId);
            }
            return newSet;
        });
    };

    const submitBulkInquiry = (formData: { name: string, phone: string, notes: string }) => {
        const selectedItems = products.filter(p => basket.has(p.id));
        const itemNames = selectedItems.map(p => `${p.name} (${p.model})`).join(', ');
        
        addLetter({
            senderName: formData.name,
            senderPhone: formData.phone,
            subject: 'Batch Inquiry - Website',
            dateReceived: new Date().toISOString().split('T')[0],
            letterFile: '', // Or generate a PDF of the basket
            fileName: 'inquiry_list.txt',
            notes: `Interested in: ${itemNames}.\n\nUser Notes: ${formData.notes}`
        });
        
        alert(`Inquiry sent for ${basket.size} items! A sales rep will contact you shortly.`);
        setBasket(new Set());
    };

    // --- Render Functions ---

    const renderSectors = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <WarehouseZoneCard 
                title="Machine Manufacturing" 
                icon={<CogIcon className="w-10 h-10 text-gray-700" />} 
                description="Heavy machinery for soap, plastic, and food processing. The core of our production line."
                onClick={() => handleSectorClick('Machine Manufacturing')} 
                colorTheme="border-blue-600"
            />
            <WarehouseZoneCard 
                title="Raw Material Supply" 
                icon={<BeakerIcon className="w-10 h-10 text-gray-700" />} 
                description="Bulk chemicals, plastics, and essential inputs for manufacturing processes."
                onClick={() => handleSectorClick('Raw Material Supply')} 
                colorTheme="border-green-600"
            />
             <WarehouseZoneCard 
                title="Machinery Import" 
                icon={<TruckIcon className="w-10 h-10 text-gray-700" />} 
                description="Specialty imported equipment including CNC routers and precision tools."
                onClick={() => handleSectorClick('Machinery Import')} 
                colorTheme="border-orange-600"
            />
             <WarehouseZoneCard 
                title="Business Consultancy" 
                icon={<BriefcaseIcon className="w-10 h-10 text-gray-700" />} 
                description="Feasibility studies, market research, and strategic planning services."
                onClick={() => handleSectorClick('Business Consultancy')} 
                colorTheme="border-indigo-600"
            />
            <WarehouseZoneCard 
                title="Training" 
                icon={<AcademicCapIcon className="w-10 h-10 text-gray-700" />} 
                description="Vocational courses on machine operation and product manufacturing."
                onClick={() => handleSectorClick('Training')} 
                colorTheme="border-purple-600"
            />
        </div>
    );

    const renderCategories = () => (
        <>
            {selectedSector === 'Machine Manufacturing' && machineCategoryStats.length > 0 && (
                 <CategoryStatsChart data={machineCategoryStats} />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableCategories.map((category) => {
                    const count = products.filter(p => p.sector === selectedSector && p.category === category).length;
                    return (
                        <WarehouseAisleCard 
                            key={category}
                            title={category}
                            icon={categoryIcons[category] || categoryIcons['default']}
                            count={count}
                            onClick={() => handleCategoryClick(category)}
                        />
                    );
                })}
                {availableCategories.length === 0 && <div className="col-span-full text-center text-gray-500 py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">No aisles found in this zone.</div>}
            </div>
        </>
    );

    const renderItemGroups = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {availableItemGroups.map(group => (
                <WarehouseShelfItem 
                    key={group.name}
                    itemGroup={group.name}
                    count={group.count}
                    image={group.image}
                    onClick={() => handleItemGroupClick(group.name)}
                />
            ))}
             {availableItemGroups.length === 0 && <div className="col-span-full text-center text-gray-500 py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">This shelf is empty.</div>}
        </div>
    );

    const renderProducts = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableProducts.map(product => (
                <ProductCard 
                    key={product.id} 
                    product={product} 
                    onClick={() => handleProductClick(product)}
                    onOrder={(e) => handleOrder(e, product)}
                    isSelected={basket.has(product.id)}
                    onToggleSelect={(e) => toggleBasket(e, product.id)}
                />
            ))}
            {availableProducts.length === 0 && <div className="col-span-full text-center text-gray-500 py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">No specific models found matching criteria.</div>}
        </div>
    );

    const isFiltering = searchTerm !== '' || manualFilterActive;
    
    // Check if any filters are currently active (values selected)
    const hasActiveFilters = Object.values(activeFilters).some((v: string[]) => v.length > 0);

    // Determine if we should show the filter sidebar
    // Show sidebar when we are in Category view (Aisle) or ItemGroup View (Shelf) or Product View
    const showSidebar = currentView === 'itemGroups' || currentView === 'products';

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in min-h-screen flex flex-col bg-gray-50">
            {/* 100% Navigation Header: Warehouse Location System */}
            <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg mb-8 flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
                {/* Background Texture/Effect */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gray-800 rounded-full mix-blend-overlay filter blur-3xl opacity-30 transform translate-x-1/2 -translate-y-1/2"></div>

                <div className="relative z-10 flex-grow w-full md:w-auto mb-4 md:mb-0">
                    <h2 className="text-gray-400 text-xs font-bold tracking-[0.2em] uppercase mb-2">Current Location</h2>
                    <div className="flex items-center flex-wrap gap-2 text-sm md:text-base font-black tracking-tight font-mono">
                        <button 
                            onClick={navigateToRoot} 
                            className={`hover:text-blue-400 transition-colors focus:outline-none flex items-center ${viewStack.length === 1 ? 'text-white' : 'text-gray-500'}`}
                        >
                            <HomeIcon className="w-5 h-5 mr-2 mb-1" />
                            MAIN WAREHOUSE
                        </button>
                        {selectedSector && (
                            <>
                                <span className="text-gray-600">/</span>
                                <button 
                                    onClick={() => navigateToSector(selectedSector)}
                                    className={`hover:text-blue-400 transition-colors focus:outline-none ${!selectedCategory ? 'text-white' : 'text-gray-500'}`}
                                >
                                    {selectedSector.toUpperCase()}
                                </button>
                            </>
                        )}
                        {selectedCategory && (
                            <>
                                <span className="text-gray-600">/</span>
                                <button 
                                    onClick={() => navigateToCategory(selectedCategory)}
                                    className={`hover:text-blue-400 transition-colors focus:outline-none ${!selectedItemGroup ? 'text-white' : 'text-gray-500'}`}
                                >
                                    {selectedCategory.toUpperCase()}
                                </button>
                            </>
                        )}
                        {selectedItemGroup && (
                            <>
                                <span className="text-gray-600">/</span>
                                <span className="text-blue-400">
                                    {selectedItemGroup.toUpperCase()}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* Right Side Actions: Search + Stock In (Side by Side) */}
                <div className="relative z-10 w-full md:w-auto flex items-center gap-3">
                    <div className="relative group flex-grow md:w-64">
                        <input
                            type="text"
                            placeholder="Quick Find SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all group-hover:bg-gray-750"
                        />
                        <SearchIcon className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white">
                                <CloseIcon className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    
                     <button 
                        onClick={handleAddProduct}
                        className="flex md:hidden items-center justify-center p-3 bg-blue-600 text-white rounded-lg flex-shrink-0"
                    >
                        <UploadIcon className="w-5 h-5" />
                    </button>

                    <button 
                        onClick={handleAddProduct}
                        className="hidden md:flex items-center gap-2 px-4 py-3 bg-gray-800 border border-gray-600 hover:bg-gray-700 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap h-full"
                    >
                        <UploadIcon className="w-3 h-3" /> STOCK IN
                    </button>
                </div>
            </div>

            {/* Main Content Flex */}
            <div className="flex flex-col md:flex-row gap-6 flex-grow">
                {/* Spec Filter Sidebar - Only show when relevant */}
                {showSidebar && (
                    <FilterSidebar 
                        filters={availableFilters} 
                        activeFilters={activeFilters} 
                        onFilterChange={toggleFilter} 
                        onClearFilters={clearActiveFilters} 
                    />
                )}

                {/* Grid Content */}
                <div className="flex-grow">
                    {isFiltering ? (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center px-2 border-b border-gray-200 pb-4">
                                <p className="text-lg font-bold text-gray-800">Search Results</p>
                                <p className="text-sm font-medium text-gray-500">Found {availableProducts.length} item{availableProducts.length !== 1 ? 's' : ''}.</p>
                                <button onClick={handleClearFilters} className="text-sm text-red-600 hover:underline font-bold">Clear Search</button>
                            </div>
                            {renderProducts()}
                        </div>
                    ) : (
                        <>
                            {currentView === 'sectors' && (
                                <div className="animate-fade-in">
                                    <div className="mb-4 flex items-center text-sm text-gray-500 font-bold uppercase tracking-wider">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span> Select a Zone to Enter
                                    </div>
                                    {renderSectors()}
                                </div>
                            )}
                            {currentView === 'categories' && (
                                <div className="animate-fade-in">
                                    <div className="mb-4 flex items-center text-sm text-gray-500 font-bold uppercase tracking-wider">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span> Select an Aisle
                                    </div>
                                    {renderCategories()}
                                </div>
                            )}
                            {currentView === 'itemGroups' && (
                                <div className="animate-fade-in">
                                    <div className="mb-4 flex items-center text-sm text-gray-500 font-bold uppercase tracking-wider">
                                        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span> Select a Shelf Bin
                                    </div>
                                    {/* If Filters are Active, show Products directly instead of Groups */}
                                    {hasActiveFilters ? renderProducts() : renderItemGroups()}
                                </div>
                            )}
                            {currentView === 'products' && (
                                <div className="animate-fade-in">
                                    <div className="mb-4 flex items-center text-sm text-gray-500 font-bold uppercase tracking-wider">
                                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span> Available Stock
                                    </div>
                                    {renderProducts()}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Inquiry Basket FAB */}
            <div className="fixed bottom-6 right-6 md:right-10 z-30">
                <button 
                    onClick={() => setIsBasketOpen(true)}
                    className="flex items-center justify-center gap-3 px-6 py-4 bg-gray-900 text-white rounded-full shadow-2xl hover:scale-105 hover:bg-gray-800 transition-all group border-2 border-white"
                >
                    <div className="relative">
                        <ClipboardListIcon className="w-6 h-6" />
                        {basket.size > 0 && (
                            <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full animate-pulse border-2 border-gray-900">
                                {basket.size}
                            </span>
                        )}
                    </div>
                    <span className="font-bold hidden md:inline">Inquiry Basket</span>
                </button>
            </div>

            {/* Modals */}
            <ProductDetailModal 
                product={selectedProductForDetail}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                isAdmin={true} 
                onEdit={() => selectedProductForDetail && handleEditProduct(selectedProductForDetail)}
                onOrder={() => selectedProductForDetail && handleOrder({ stopPropagation: () => {} } as any, selectedProductForDetail)}
                onSwitchProduct={(p) => setSelectedProductForDetail(p)}
            />

            <EditProductModal 
                product={productToEdit}
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                onSave={handleSaveProduct}
                onDelete={handleDeleteProduct}
                categories={availableCategories.length > 0 ? availableCategories : ['Soap & detergent Production', 'Plastic Processing Machines', 'Food & Agro-Processing Machines', 'Cleaning & Household Equipment', 'Construction & Building Materials Machines', 'Packaging Materials Machines', 'Candle & Straw/Chaff']}
                initialSector={selectedSector || 'Machine Manufacturing'}
            />

            <BasketModal 
                isOpen={isBasketOpen}
                onClose={() => setIsBasketOpen(false)}
                basketItems={products.filter(p => basket.has(p.id))}
                onRemoveItem={(id) => setBasket(prev => { const n = new Set(prev); n.delete(id); return n; })}
                onSubmit={submitBulkInquiry}
                onClear={() => setBasket(new Set())}
            />
        </div>
    );
};

const InputField: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void, required?: boolean, type?: string, placeholder?: string}> = ({label, name, value, onChange, required, type = 'text', placeholder}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

export default Products;