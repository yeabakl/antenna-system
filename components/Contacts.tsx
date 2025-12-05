
import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../App';
import { Contact } from '../types';
import { UserPlusIcon, PencilIcon, TrashIcon, CloseIcon, SearchIcon, CheckCircleIcon, SortAscIcon } from './icons';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: Omit<Contact, 'id'> | Contact) => void;
  contactToEdit?: Contact | null;
  initialType: 'Customer' | 'Lead';
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, onSave, contactToEdit, initialType }) => {
  const initialFormState: Omit<Contact, 'id'> = {
    name: '',
    phone: '',
    productInterest: '',
    description: '',
    address: '',
    type: initialType,
    leadStatus: initialType === 'Lead' ? 'New' : undefined
  };
  const [formData, setFormData] = useState<Omit<Contact, 'id'>>(initialFormState);

  React.useEffect(() => {
    if (contactToEdit) {
      setFormData(contactToEdit);
    } else {
      setFormData({
          ...initialFormState,
          type: initialType, // Default to the active tab's type, but allow changing
          leadStatus: initialType === 'Lead' ? 'New' : undefined
      });
    }
  }, [contactToEdit, isOpen, initialType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Name and Phone are required.');
      return;
    }
    // Ensure leadStatus is set if type is Lead
    const finalData = {
        ...formData,
        leadStatus: formData.type === 'Lead' && !formData.leadStatus ? 'New' : formData.leadStatus
    };
    onSave(finalData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg animate-fade-in-up">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">
              {contactToEdit ? 'Edit Entry' : 'Add Entry'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200"><CloseIcon className="w-6 h-6 text-gray-600" /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
             <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Category</label>
                <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="Customer">Office Visitor / Customer</option>
                    <option value="Lead">Potential Customer (Lead)</option>
                </select>
            </div>

            <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
            <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
            <InputField label="Address" name="address" value={formData.address} onChange={handleChange} />
            <InputField label="Product of Interest" name="productInterest" value={formData.productInterest} onChange={handleChange} />
            
            {formData.type === 'Lead' && (
                <div>
                    <label htmlFor="leadStatus" className="block text-sm font-medium text-gray-700">Lead Status</label>
                    <select
                        id="leadStatus"
                        name="leadStatus"
                        value={formData.leadStatus}
                        onChange={handleChange}
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Lost">Lost</option>
                    </select>
                </div>
            )}

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Notes / Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end items-center p-4 bg-gray-50 rounded-b-lg space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputField: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void, required?: boolean, type?: string}> = ({label, name, value, onChange, required, type = 'text'}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

type SortKey = 'name' | 'status';

const Contacts: React.FC = () => {
  const { contacts, addContact, updateContact, deleteContact } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'customers' | 'leads'>('customers');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);
  
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const statusOrder = { 'New': 1, 'Contacted': 2, 'Qualified': 3, 'Lost': 4 };

  const filteredContacts = useMemo(() => {
    let result = contacts;

    // Tab Filtering Logic:
    // If 'customers' tab (Office Visitors): Show ALL contacts (Customers + Leads)
    // If 'leads' tab: Show ONLY Leads
    if (activeTab === 'leads') {
        result = result.filter(c => c.type === 'Lead');
    }

    // Search Filtering
    if (searchTerm) {
        result = result.filter(c =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.phone.includes(searchTerm) ||
            c.productInterest.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Sorting
    result.sort((a, b) => {
        let valA: any, valB: any;

        if (sortKey === 'status') {
             // Only relevant for leads, prioritize leads first if mixed
             const statusA = a.leadStatus ? statusOrder[a.leadStatus] : 99;
             const statusB = b.leadStatus ? statusOrder[b.leadStatus] : 99;
             valA = statusA;
             valB = statusB;
        } else {
             valA = a[sortKey].toLowerCase();
             valB = b[sortKey].toLowerCase();
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    return result;
  }, [contacts, searchTerm, activeTab, sortKey, sortDirection]);

  const handleEditClick = (contact: Contact) => {
    setContactToEdit(contact);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      deleteContact(id);
    }
  };

  const handleSaveContact = (contact: Omit<Contact, 'id'> | Contact) => {
    if ('id' in contact) {
      updateContact(contact as Contact);
    } else {
      addContact(contact);
    }
    
    // Automatically switch tab to show the new entry if needed
    if (contact.type === 'Lead' && activeTab !== 'leads') {
        // Don't force switch, as Leads show in Office Visitors too
    } else if (contact.type === 'Customer' && activeTab === 'leads') {
         setActiveTab('customers');
    }
  };
  
  const handleSort = (key: SortKey) => {
      if (sortKey === key) {
          setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
      } else {
          setSortKey(key);
          setSortDirection('asc');
      }
  };

  const SortableHeader: React.FC<{ sortKey: SortKey, label: string }> = ({ sortKey: key, label }) => (
    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
        <button onClick={() => handleSort(key)} className="flex items-center gap-2 hover:text-gray-800">
            {label}
            {sortKey === key && <SortAscIcon className={`w-4 h-4 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />}
        </button>
    </th>
  );

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {activeTab === 'customers' ? 'Office Visitors & Customers' : 'Potential Customers (Leads)'}
        </h2>
        <div className="flex gap-4 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
                <input
                    type="text"
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
            </div>
            <button onClick={() => { setContactToEdit(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap">
                <UserPlusIcon className="w-5 h-5" />
                Add New
            </button>
        </div>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('customers')}
            className={`${
              activeTab === 'customers'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Office Visitors (All)
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`${
              activeTab === 'leads'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Leads (Potential Customers)
          </button>
        </nav>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead className="bg-gray-100">
            <tr>
              <SortableHeader sortKey="name" label="Name" />
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Address</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Interest</th>
              {activeTab === 'leads' && <SortableHeader sortKey="status" label="Status" />}
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.length > 0 ? filteredContacts.map(contact => (
              <tr key={contact.id} className="hover:bg-gray-50">
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <div className="flex items-center">
                      <div className="ml-3">
                        <p className="text-gray-900 whitespace-no-wrap font-medium">{contact.name}</p>
                        {/* Badge for Leads in the main list */}
                        {activeTab === 'customers' && contact.type === 'Lead' && (
                             <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 mt-1">
                                Lead
                             </span>
                        )}
                      </div>
                  </div>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{contact.phone}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{contact.address || '-'}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{contact.productInterest}</p>
                </td>
                {activeTab === 'leads' && (
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            contact.leadStatus === 'New' ? 'bg-blue-100 text-blue-800' :
                            contact.leadStatus === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                            contact.leadStatus === 'Qualified' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                            {contact.leadStatus || 'New'}
                        </span>
                    </td>
                )}
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap truncate max-w-xs" title={contact.description}>{contact.description}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleEditClick(contact)} className="text-blue-600 hover:text-blue-900" title="Edit">
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDeleteClick(contact.id)} className="text-red-600 hover:text-red-900" title="Delete">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={activeTab === 'leads' ? 7 : 6} className="text-center py-10 text-gray-500">No entries found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveContact}
        contactToEdit={contactToEdit}
        initialType={activeTab === 'leads' ? 'Lead' : 'Customer'}
      />
    </div>
  );
};

export default Contacts;
