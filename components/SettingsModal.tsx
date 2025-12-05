
import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { CloseIcon } from './icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { machineTypes, addMachineType, orders, history } = useContext(AppContext);
  const [newMachineType, setNewMachineType] = useState('');
  const [activeTab, setActiveTab] = useState<'machines' | 'customers'>('machines');

  const handleAddMachineType = () => {
    if (newMachineType && !machineTypes.includes(newMachineType)) {
      addMachineType(newMachineType);
      setNewMachineType('');
    } else {
        alert("Machine type cannot be empty or already exist.")
    }
  };

  const allOrders = [...orders, ...history];
  const uniqueCustomers = Array.from(new Set(allOrders.map(o => `${o.customerFirstName} ${o.customerFatherName}`)))
    .map(name => {
        return allOrders.find(o => `${o.customerFirstName} ${o.customerFatherName}` === name)!;
    });


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Settings</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
            <CloseIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-6 px-4" aria-label="Tabs">
                <button onClick={() => setActiveTab('machines')} className={`${activeTab === 'machines' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                    Machine Types
                </button>
                <button onClick={() => setActiveTab('customers')} className={`${activeTab === 'customers' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                    Customer Information
                </button>
            </nav>
        </div>

        <div className="p-6 overflow-y-auto">
          {activeTab === 'machines' && (
            <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Manage Machine Types</h3>
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={newMachineType}
                        onChange={(e) => setNewMachineType(e.target.value)}
                        placeholder="Enter new machine type"
                        className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                        onClick={handleAddMachineType}
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Add
                    </button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {machineTypes.map((type, index) => (
                        <div key={index} className="bg-gray-100 p-3 rounded-md text-gray-800">{type}</div>
                    ))}
                </div>
            </div>
          )}
          {activeTab === 'customers' && (
             <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Customer Directory</h3>
                 <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Name</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Phone</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                        {uniqueCustomers.map(customer => (
                             <tr key={customer.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-3 px-4">{`${customer.customerFirstName} ${customer.customerFatherName} ${customer.customerGrandfatherName}`}</td>
                                <td className="py-3 px-4">{customer.phone1}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                 </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
