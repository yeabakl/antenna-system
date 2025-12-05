
import React, { useState, useContext, useMemo, useEffect } from 'react';
import { AppContext } from '../App';
import { Order, Payment } from '../types';
import { CloseIcon, SearchIcon, PencilIcon, CheckCircleIcon } from './icons';

const EditOrderModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedOrder: Order) => void;
    order: Order | null;
}> = ({ isOpen, onClose, onSave, order }) => {
    const { machineTypes } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState<'details' | 'payments'>('details');
    const [editedOrder, setEditedOrder] = useState<Order | null>(order);
    const [newPayment, setNewPayment] = useState({ amount: '', date: new Date().toISOString().split('T')[0] });

    useEffect(() => {
        if (order) {
            setEditedOrder(JSON.parse(JSON.stringify(order))); // Deep copy to avoid mutating original state
        }
        setActiveTab('details');
    }, [order]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedOrder(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numericValue = value.replace(/[^0-9]/g, '');
        const parsedValue = parseFloat(numericValue) || 0;
        setEditedOrder(prev => prev ? { ...prev, [name]: parsedValue } : null);
    };

    const formatCurrency = (value: number | string) => {
        if (!value) return '';
        return new Intl.NumberFormat('en-US').format(Number(value)) + ' ETB';
    };

    const handleAddPayment = () => {
        const amount = parseFloat(newPayment.amount);
        if (!amount || amount <= 0 || !newPayment.date) {
            alert('Please enter a valid amount and date for the payment.');
            return;
        }

        const payment: Payment = {
            amount: amount,
            date: newPayment.date,
        };

        setEditedOrder(prev => prev ? {
            ...prev,
            paymentHistory: [...(prev.paymentHistory || []), payment]
        } : null);
        setNewPayment({ amount: '', date: new Date().toISOString().split('T')[0] });
    };

    const handleSave = () => {
        if (editedOrder) {
            onSave(editedOrder);
            onClose();
        }
    };
    
    if (!isOpen || !editedOrder) return null;

    const totalPaid = editedOrder.prepayment + (editedOrder.paymentHistory || []).reduce((sum, p) => sum + p.amount, 0);
    const remainingBalance = editedOrder.machinePrice - totalPaid;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-fade-in-up">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-semibold text-gray-800">Edit Order {order?.id}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors"><CloseIcon className="w-6 h-6 text-gray-600" /></button>
                </div>

                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-6 px-4">
                        <button onClick={() => setActiveTab('details')} className={`${activeTab === 'details' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Order Details</button>
                        <button onClick={() => setActiveTab('payments')} className={`${activeTab === 'payments' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Payments</button>
                    </nav>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto">
                    {activeTab === 'details' && (
                        <div className="space-y-4">
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <InputField label="First Name" name="customerFirstName" value={editedOrder.customerFirstName} onChange={handleInputChange} />
                                <InputField label="Father's Name" name="customerFatherName" value={editedOrder.customerFatherName} onChange={handleInputChange} />
                                <InputField label="Grandfather's Name" name="customerGrandfatherName" value={editedOrder.customerGrandfatherName} onChange={handleInputChange} />
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label="Primary Phone" name="phone1" type="tel" value={editedOrder.phone1} onChange={handleInputChange} />
                                <InputField label="Secondary Phone (Optional)" name="phone2" type="tel" value={editedOrder.phone2 || ''} onChange={handleInputChange} />
                            </div>
                            <div>
                                <label htmlFor="machineType" className="block text-sm font-medium text-gray-700 mb-1">Machine Type</label>
                                <select id="machineType" name="machineType" value={editedOrder.machineType} onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                                    {machineTypes.map(type => <option key={type} value={type}>{type}</option>)}
                                </select>
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label="Machine Price" name="machinePrice" value={formatCurrency(editedOrder.machinePrice)} onChange={(e) => handleCurrencyChange(e as any)} />
                                <InputField label="Prepayment Amount" name="prepayment" value={formatCurrency(editedOrder.prepayment)} onChange={(e) => handleCurrencyChange(e as any)} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label="Delivery Date" name="deliveryDate" type="date" value={editedOrder.deliveryDate} onChange={handleInputChange} />
                                <InputField label="Payment Date" name="paymentDate" type="date" value={editedOrder.paymentDate} onChange={handleInputChange} />
                            </div>
                            <InputField label="Salesperson" name="salesperson" value={editedOrder.salesperson || ''} onChange={handleInputChange} />
                        </div>
                    )}
                    {activeTab === 'payments' && (
                        <div>
                            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                                <div className="p-3 bg-gray-100 rounded-md"><h4 className="text-sm text-gray-600">Total Price</h4><p className="font-bold text-lg">{formatCurrency(editedOrder.machinePrice)}</p></div>
                                <div className="p-3 bg-green-100 rounded-md"><h4 className="text-sm text-green-800">Total Paid</h4><p className="font-bold text-lg text-green-900">{formatCurrency(totalPaid)}</p></div>
                                <div className="p-3 bg-red-100 rounded-md"><h4 className="text-sm text-red-800">Remaining</h4><p className="font-bold text-lg text-red-900">{formatCurrency(remainingBalance)}</p></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Payment History</h4>
                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                        <div className="flex justify-between p-2 bg-gray-50 rounded-md">
                                            <span>Prepayment</span>
                                            <span className="font-semibold">{formatCurrency(editedOrder.prepayment)}</span>
                                        </div>
                                        {[...(editedOrder.paymentHistory || [])].map((p, i) => (
                                            <div key={i} className="flex justify-between p-2 bg-gray-50 rounded-md">
                                                <span>{p.date}</span>
                                                <span className="font-semibold">{formatCurrency(p.amount)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Add New Payment</h4>
                                    <div className="space-y-3">
                                        <InputField label="Amount (ETB)" name="amount" value={newPayment.amount} onChange={(e) => setNewPayment(p => ({...p, amount: e.target.value.replace(/[^0-9]/g, '')}))}/>
                                        <InputField label="Payment Date" name="date" type="date" value={newPayment.date} onChange={(e) => setNewPayment(p => ({...p, date: e.target.value}))}/>
                                        <button onClick={handleAddPayment} className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors">Add Payment</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end items-center p-4 bg-gray-50 rounded-b-lg space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

const InputField: React.FC<{label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void; type?: string;}> = ({ label, name, value, onChange, type = 'text' }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type={type} id={name} name={name} value={value} onChange={onChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500" />
    </div>
);

const Orders: React.FC = () => {
    const { orders, updateOrder, markAsReady } = useContext(AppContext);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleEditClick = (order: Order) => {
        setSelectedOrder(order);
        setIsEditModalOpen(true);
    };

    const handleSaveOrder = (updatedOrder: Order) => {
        updateOrder(updatedOrder);
    };

    const filteredOrders = useMemo(() => {
        return orders.filter(order =>
            order.status === 'Pending' &&
            (`${order.customerFirstName} ${order.customerFatherName} ${order.customerGrandfatherName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.machineType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [orders, searchTerm]);

    return (
        <>
             <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Orders In Manufacturing</h2>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                </div>
            </div>
            <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer Name</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Machine Type</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Price</th>
                             <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Salesperson</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Remaining Payment</th>
                             <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Delivery Date</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length > 0 ? filteredOrders.map(order => {
                            const totalPaid = order.prepayment + (order.paymentHistory || []).reduce((sum, p) => sum + p.amount, 0);
                            const remainingPayment = order.machinePrice - totalPaid;
                            return (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-600 whitespace-no-wrap font-mono">{order.id}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{`${order.customerFirstName} ${order.customerFatherName}`}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{order.machineType}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{new Intl.NumberFormat().format(order.machinePrice)} ETB</p>
                                    </td>
                                     <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{order.salesperson || 'N/A'}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-red-600 font-semibold whitespace-no-wrap">{new Intl.NumberFormat().format(remainingPayment)} ETB</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{order.deliveryDate}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <div className="flex items-center gap-4">
                                            <button onClick={() => handleEditClick(order)} className="text-blue-600 hover:text-blue-900" title="Edit Order">
                                                <PencilIcon className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => markAsReady(order.id)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full hover:bg-yellow-600 transition-colors"
                                            >
                                                <CheckCircleIcon className="w-4 h-4" />
                                                Mark as Ready
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }) : (
                            <tr><td colSpan={8} className="text-center py-10 text-gray-500">No orders currently in manufacturing.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <EditOrderModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveOrder}
                order={selectedOrder}
            />
        </>
    );
};

export default Orders;
