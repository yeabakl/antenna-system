
import React, { useState, useContext, useRef, useEffect } from 'react';
import { AppContext } from '../App';
import { Order, Contact } from '../types';
import { UploadIcon, SearchIcon, UserPlusIcon } from './icons';

const Home: React.FC = () => {
  const { addOrder, machineTypes, orderPrefill, setOrderPrefill, contacts } = useContext(AppContext);
  const formRef = useRef<HTMLFormElement>(null);

  const initialFormState = {
    customerFirstName: '',
    customerFatherName: '',
    customerGrandfatherName: '',
    machineType: machineTypes[0] || '',
    phone1: '',
    phone2: '',
    machinePrice: '',
    prepayment: '',
    deliveryDate: '',
    paymentDate: '',
    description: '',
    salesperson: '',
    machineImage: undefined,
    customerIdCard: undefined,
    prepaymentReceipt: undefined,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [idCardPreview, setIdCardPreview] = useState<string | undefined>(undefined);
  const [prepaymentReceiptPreview, setPrepaymentReceiptPreview] = useState<string | undefined>(undefined);
  const [prepaymentReceiptFilename, setPrepaymentReceiptFilename] = useState<string>('');

  // Customer Lookup State
  const [showLookup, setShowLookup] = useState(false);
  const [lookupQuery, setLookupQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);

  // Use effect to check for prefilled data from products page
  useEffect(() => {
    if (orderPrefill) {
      setFormData(prev => ({
        ...prev,
        machineType: orderPrefill.machineType || prev.machineType,
        description: orderPrefill.description || prev.description,
        machinePrice: orderPrefill.machinePrice ? String(orderPrefill.machinePrice) : prev.machinePrice,
      }));
      // Clear the prefill data so it doesn't persist if navigating away and back
      setOrderPrefill(null);
    }
  }, [orderPrefill, setOrderPrefill]);

  // Filter contacts for lookup
  useEffect(() => {
    if (lookupQuery.length > 1) {
        const lowerQuery = lookupQuery.toLowerCase();
        const results = contacts.filter(c => 
            c.name.toLowerCase().includes(lowerQuery) || 
            c.phone.includes(lowerQuery)
        );
        setFilteredContacts(results);
    } else {
        setFilteredContacts([]);
    }
  }, [lookupQuery, contacts]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (['customerFirstName', 'customerFatherName', 'customerGrandfatherName'].includes(name)) {
        if (value.length > 0) {
            finalValue = value.charAt(0).toUpperCase() + value.slice(1);
        }
    }
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };
  
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/[^0-9]/g, '');
    setFormData(prev => ({...prev, [name]: numericValue}));
  };

  const formatCurrency = (value: string) => {
    if (!value) return '';
    return new Intl.NumberFormat('en-US').format(Number(value)) + ' ETB';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData(prev => ({ ...prev, machineImage: result }));
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdCardFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData(prev => ({ ...prev, customerIdCard: result }));
        if(file.type.startsWith('image/')) {
            setIdCardPreview(result);
        } else {
            setIdCardPreview(undefined);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrepaymentReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPrepaymentReceiptFilename(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData(prev => ({ ...prev, prepaymentReceipt: result }));
        if (file.type.startsWith('image/')) {
            setPrepaymentReceiptPreview(result);
        } else {
            setPrepaymentReceiptPreview(undefined);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
          e.preventDefault();
          const form = formRef.current;
          if (!form) return;

          const focusable = Array.from(form.elements).filter((el: any) =>
              !el.disabled &&
              (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') &&
              el.type !== 'file' &&
              el.type !== 'submit'
          ) as HTMLElement[];
          
          const index = focusable.indexOf(e.currentTarget as HTMLElement);
          const nextElement = focusable[index + 1];

          if (nextElement) {
              nextElement.focus();
          } else {
              const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
              if(submitButton) submitButton.focus();
          }
      }
  };

  const handleImportContact = (contact: Contact) => {
      const nameParts = contact.name.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const fatherName = nameParts[1] || '';
      const grandFatherName = nameParts.slice(2).join(' ') || '';

      setFormData(prev => ({
          ...prev,
          customerFirstName: firstName,
          customerFatherName: fatherName,
          customerGrandfatherName: grandFatherName,
          phone1: contact.phone,
          description: prev.description ? prev.description : (contact.productInterest ? `Interested in ${contact.productInterest}` : '')
      }));
      
      setLookupQuery('');
      setFilteredContacts([]);
      setShowLookup(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    for (const key in formData) {
        if (key !== 'machineImage' && key !== 'phone2' && key !== 'customerIdCard' && key !== 'prepaymentReceipt' && !(formData as any)[key]) {
            alert(`Please fill out the ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
            return;
        }
    }

    const newOrderData = {
        ...formData,
        machinePrice: parseFloat(formData.machinePrice) || 0,
        prepayment: parseFloat(formData.prepayment) || 0,
    };
    addOrder(newOrderData);
    alert('Order submitted successfully!');
    setFormData(initialFormState);
    setImagePreview(undefined);
    setIdCardPreview(undefined);
    setPrepaymentReceiptPreview(undefined);
    setPrepaymentReceiptFilename('');
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Create New Order</h2>
          <button 
            type="button"
            onClick={() => setShowLookup(!showLookup)}
            className="flex items-center gap-2 text-sm text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md transition-colors"
          >
            <SearchIcon className="w-4 h-4" />
            {showLookup ? 'Hide Lookup' : 'Lookup Existing Customer'}
          </button>
      </div>

      {/* Customer Lookup Section */}
      {showLookup && (
        <div className="mb-8 bg-blue-50 p-4 rounded-lg border border-blue-100 animate-fade-in">
            <label className="block text-sm font-medium text-blue-800 mb-2">Search Existing Office Visitors / Contacts</label>
            <div className="relative">
                <input 
                    type="text" 
                    value={lookupQuery}
                    onChange={(e) => setLookupQuery(e.target.value)}
                    placeholder="Start typing name or phone number..."
                    className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    autoFocus
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-blue-400" />
                </div>
            </div>
            {filteredContacts.length > 0 && (
                <ul className="mt-2 bg-white border border-gray-200 rounded-md shadow-md max-h-48 overflow-y-auto divide-y divide-gray-100">
                    {filteredContacts.map(contact => (
                        <li key={contact.id}>
                            <button 
                                type="button"
                                onClick={() => handleImportContact(contact)}
                                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex justify-between items-center"
                            >
                                <div>
                                    <p className="font-semibold text-gray-800">{contact.name}</p>
                                    <p className="text-xs text-gray-500">{contact.phone}</p>
                                </div>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Select</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            {lookupQuery.length > 1 && filteredContacts.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">No contacts found matching "{lookupQuery}".</p>
            )}
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <InputField label="Salesperson / Submitted By" name="salesperson" value={formData.salesperson} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="Enter name for commission tracking" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField label="First Name" name="customerFirstName" value={formData.customerFirstName} onChange={handleInputChange} onKeyDown={handleKeyDown} tooltip="Enter customer's first name."/>
          <InputField label="Father's Name" name="customerFatherName" value={formData.customerFatherName} onChange={handleInputChange} onKeyDown={handleKeyDown} />
          <InputField label="Grandfather's Name" name="customerGrandfatherName" value={formData.customerGrandfatherName} onChange={handleInputChange} onKeyDown={handleKeyDown} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Primary Phone" name="phone1" type="tel" value={formData.phone1} onChange={handleInputChange} onKeyDown={handleKeyDown} />
          <InputField label="Secondary Phone (Optional)" name="phone2" type="tel" value={formData.phone2} onChange={handleInputChange} onKeyDown={handleKeyDown} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="machineType" className="block text-sm font-medium text-gray-700 mb-1">Machine Type</label>
            <select id="machineType" name="machineType" value={formData.machineType} onChange={handleInputChange} onKeyDown={handleKeyDown} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
              {machineTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
           <InputField label="Machine Description" name="description" value={formData.description} onChange={handleInputChange} onKeyDown={handleKeyDown} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Machine Price" name="machinePrice" value={formatCurrency(formData.machinePrice)} onChange={handleCurrencyChange} onKeyDown={handleKeyDown} />
          <InputField label="Prepayment Amount" name="prepayment" value={formatCurrency(formData.prepayment)} onChange={handleCurrencyChange} onKeyDown={handleKeyDown} />
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Delivery Date" name="deliveryDate" type="date" value={formData.deliveryDate} onChange={handleInputChange} onKeyDown={handleKeyDown} InputLabelProps={{ shrink: true }} />
          <InputField label="Payment Date" name="paymentDate" type="date" value={formData.paymentDate} onChange={handleInputChange} onKeyDown={handleKeyDown} InputLabelProps={{ shrink: true }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer ID Card (Optional)</label>
              <div className="mt-2 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md h-full">
                <div className="space-y-1 text-center">
                  {idCardPreview ? (
                    <img src={idCardPreview} alt="ID Card Preview" className="mx-auto h-24 w-auto rounded-md object-cover"/>
                  ) : (
                    <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="customerIdCard" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Upload a file</span>
                      <input id="customerIdCard" name="customerIdCard" type="file" accept="image/*,application/pdf" className="sr-only" onChange={handleIdCardFileChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Machine Image (Optional)</label>
              <div className="mt-2 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md h-full">
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="mx-auto h-24 w-auto rounded-md object-cover"/>
                  ) : (
                    <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="machineImage" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Upload a file</span>
                      <input id="machineImage" name="machineImage" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Prepayment Receipt (Optional)</label>
              <div className="mt-2 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md h-full">
                <div className="space-y-1 text-center">
                  {prepaymentReceiptPreview ? (
                    <img src={prepaymentReceiptPreview} alt="Prepayment Receipt Preview" className="mx-auto h-24 w-auto rounded-md object-cover"/>
                  ) : (
                    <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="prepaymentReceipt" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Upload a file</span>
                      <input id="prepaymentReceipt" name="prepaymentReceipt" type="file" accept="image/*,application/pdf" className="sr-only" onChange={handlePrepaymentReceiptFileChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">{prepaymentReceiptFilename || 'PNG, JPG, PDF up to 10MB'}</p>
                </div>
              </div>
            </div>
        </div>
        <div className="text-right">
          <button type="submit" className="inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
            Submit Order
          </button>
        </div>
      </form>
    </div>
  );
};

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  tooltip?: string;
  placeholder?: string;
  InputLabelProps?: object;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, onKeyDown, type = 'text', tooltip, placeholder, InputLabelProps }) => (
  <div className="relative">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
      title={tooltip}
    />
  </div>
);

export default Home;
