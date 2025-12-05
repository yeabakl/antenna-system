
import React, { useState, useContext, useMemo, useEffect } from 'react';
import { AppContext } from '../App';
import { Training, Product } from '../types';
import { UploadIcon, CloseIcon, SortAscIcon, FilePdfIcon, FileIcon, DownloadIcon, BadgeCheckIcon, SearchIcon, AcademicCapIcon, UserPlusIcon, CheckCircleIcon, BookOpenIcon, ClockIcon, DocumentArrowDownIcon } from './icons';
import FilePreviewModal from './FilePreviewModal';
import CertificateModal from './CertificateModal';
import { ProductDetailModal } from './Products';
import { addLetterheadToDoc } from './pdfUtils';

// A compact, reusable component for displaying a file preview button
const FileChip: React.FC<{
    fileData: string;
    onView: () => void;
    label: string;
}> = ({ fileData, onView, label }) => {
    const isImage = fileData.startsWith('data:image/');
    const isPdf = fileData.startsWith('data:application/pdf');

    return (
        <button onClick={onView} className="group inline-flex items-center gap-2 text-left bg-gray-100 hover:bg-gray-200 text-blue-700 font-medium py-1 px-2 rounded-full transition-colors">
            <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow">
                {isImage ? (
                    <img src={fileData} alt={label} className="w-full h-full object-cover" />
                ) : isPdf ? (
                    <FilePdfIcon className="w-4 h-4 text-red-500" />
                ) : (
                    <FileIcon className="w-4 h-4 text-gray-500" />
                )}
            </div>
            <span className="text-xs group-hover:underline">{label}</span>
        </button>
    );
};

// Modal for completing training and uploading certificate
const CompleteTrainingModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onComplete: (certificateFile: string, issueDate?: string, certId?: string) => void;
    training: Training | null;
}> = ({ isOpen, onClose, onComplete, training }) => {
    const [mode, setMode] = useState<'generate' | 'upload'>('generate');
    const [certificateFile, setCertificateFile] = useState<string>('');
    const [certificateName, setCertificateName] = useState('');
    
    // Generation Form State
    const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
    const [certId, setCertId] = useState('');

    useEffect(() => {
        if (isOpen && training) {
            // Generate a default Certificate ID based on training ID
            setCertId(`CERT-${training.id.slice(-6).toUpperCase()}`);
            setIssueDate(new Date().toISOString().split('T')[0]);
            setMode('generate'); // Default to generate mode
            setCertificateFile('');
            setCertificateName('');
        }
    }, [isOpen, training]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setCertificateName(file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                setCertificateFile(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadSubmit = () => {
        if (!certificateFile) {
            alert('Please upload the certificate file.');
            return;
        }
        onComplete(certificateFile);
        onClose();
    };

    const handleGenerateSubmit = () => {
        // We pass a special flag string to indicate the system should generate/render it on demand
        // and also pass the form data (Issue Date, Cert ID)
        onComplete('SYSTEM_GENERATED', issueDate, certId);
        onClose();
    };

    if (!isOpen || !training) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg animate-fade-in-up flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-semibold text-gray-800">Complete Training</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors"><CloseIcon className="w-6 h-6 text-gray-600" /></button>
                </div>
                
                <div className="p-4 border-b bg-gray-50 flex gap-4">
                    <button 
                        onClick={() => setMode('generate')}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${mode === 'generate' ? 'bg-white text-blue-600 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Generate Certificate
                    </button>
                    <button 
                        onClick={() => setMode('upload')}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${mode === 'upload' ? 'bg-white text-blue-600 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Upload Existing
                    </button>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto">
                    {mode === 'generate' ? (
                        <div className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                                <h4 className="font-semibold text-blue-900 mb-2">Review Details</h4>
                                <div className="text-sm text-blue-800 space-y-1">
                                    <p><span className="font-medium">Trainee:</span> {training.name}</p>
                                    <p><span className="font-medium">Course:</span> {training.trainingType}</p>
                                    {training.trainingCategory && <p><span className="font-medium">Specific Focus:</span> {training.trainingCategory}</p>}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                                <input 
                                    type="date" 
                                    value={issueDate}
                                    onChange={(e) => setIssueDate(e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Certificate ID (Auto-generated)</label>
                                <input 
                                    type="text" 
                                    value={certId}
                                    onChange={(e) => setCertId(e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2 bg-gray-50"
                                />
                            </div>
                            <p className="text-xs text-gray-500 italic mt-2">
                                Clicking "Generate" will mark the training as complete and enable certificate printing in the Certifications tab.
                            </p>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Upload Certificate File</label>
                            <div className="mt-2 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                                            <span>Upload a file</span>
                                            <input type="file" className="sr-only" onChange={handleFileChange} />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500">{certificateName || 'No file selected'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end items-center p-4 bg-gray-50 rounded-b-lg space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                    <button 
                        onClick={mode === 'generate' ? handleGenerateSubmit : handleUploadSubmit} 
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
                    >
                        {mode === 'generate' ? 'Generate & Mark Complete' : 'Upload & Mark Complete'}
                    </button>
                </div>
            </div>
        </div>
    );
};


const TrainingComponent: React.FC = () => {
  const { trainings, addTraining, completeTraining, trainingPrefill, setTrainingPrefill, products } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState<'registration' | 'certifications' | 'history'>('registration');
  const [searchTerm, setSearchTerm] = useState('');
  
  const trainingOptions = [
    'Bar Soap Production Training',
    'Liquid Detergent Manufacturing',
    'Machine Operation & Maintenance',
    'Fiberglass Production Training',
    'Paper Bag Production',
    'Other',
  ];

  const trainingCategories = [
    'Liquid laundry soap',
    'Liquid dish soap',
    'Liquid hand soap',
    'Omo/powder soap',
    'Ajax',
    'Dry laundry soap',
    'Herbal soap',
    'Glycerin',
    'Lotion',
    'Paraffin ointment',
    'Vaseline',
    'Hair ointments',
    'Shampoos',
    'Conditioners',
    'Toilet cleaner',
    'Bleach',
    'Dettol',
    'Vim',
    'Denatured alcohol',
    'Nail polish remover',
    'Sanitizer',
    'Shower gel',
    'Car wash',
    'Cockroach and insect repellent',
    'Rust remover',
    'Hair gel',
    'Ceramic cleaner',
    'Paint thinner',
    'Soap scum and water stain'
  ];

  const initialFormState: Omit<Training, 'id' | 'status' | 'certificateFile'> = {
    name: '',
    phone: '',
    trainingType: trainingOptions[0],
    trainingCategory: '',
    payment: 'Unpaid',
    paymentReceipt: '',
    dueDate: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [otherTrainingType, setOtherTrainingType] = useState('');
  const [receiptName, setReceiptName] = useState('');
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [fileToPreview, setFileToPreview] = useState<{url: string, name: string} | null>(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [certificateTraining, setCertificateTraining] = useState<Training | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Effect to handle pre-filled training type from Products page
  useEffect(() => {
      if (trainingPrefill) {
          if (trainingOptions.includes(trainingPrefill)) {
              setFormData(prev => ({ ...prev, trainingType: trainingPrefill }));
          } else {
              setFormData(prev => ({ ...prev, trainingType: 'Other' }));
              setOtherTrainingType(trainingPrefill);
          }
          setTrainingPrefill(null); // Clear the prefill state
          setActiveTab('registration'); // Ensure we are on the registration tab
      }
  }, [trainingPrefill, setTrainingPrefill]);

  
  type SortKey = 'name' | 'trainingType' | 'dueDate';
  type SortDirection = 'asc' | 'desc';
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const filteredTrainings = useMemo(() => {
      let filtered = trainings;
      
      // Tab Filtering
      if (activeTab === 'certifications') {
          filtered = filtered.filter(t => t.status === 'Completed');
      } else if (activeTab === 'history') {
          filtered = filtered.filter(t => t.status === 'Completed');
      } else if (activeTab === 'registration') {
          filtered = filtered.filter(t => t.status === 'Ongoing');
      }

      // Search Filtering
      if (searchTerm) {
          filtered = filtered.filter(t => 
            t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.phone.includes(searchTerm) ||
            t.trainingType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (t.trainingCategory && t.trainingCategory.toLowerCase().includes(searchTerm.toLowerCase()))
          );
      }
      return filtered;
  }, [trainings, activeTab, searchTerm]);

  const sortedTrainings = useMemo(() => {
    const sorted = [...filteredTrainings];
    sorted.sort((a, b) => {
        let valA: string | number;
        let valB: string | number;

        if(sortKey === 'dueDate') {
            valA = new Date(a.dueDate).getTime();
            valB = new Date(b.dueDate).getTime();
        } else {
            valA = a[sortKey].toLowerCase();
            valB = b[sortKey].toLowerCase();
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });
    return sorted;
  }, [filteredTrainings, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
        setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
        setSortKey(key);
        setSortDirection('asc');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReceiptName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, paymentReceipt: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTrainingType = formData.trainingType === 'Other' ? otherTrainingType : formData.trainingType;

    if (!formData.name || !formData.phone || !finalTrainingType || !formData.dueDate) {
      alert('Please fill out all required fields.');
      return;
    }
    
    const submissionData = {
        ...formData,
        trainingType: finalTrainingType,
    };

    addTraining(submissionData);
    alert('Training registration submitted successfully!');
    setFormData(initialFormState);
    setReceiptName('');
    setOtherTrainingType('');
  };

  const handleCompleteClick = (training: Training) => {
    setSelectedTraining(training);
    setIsCompleteModalOpen(true);
  };
  
  const handleCompleteTraining = (certificateFile: string, issueDate?: string, certId?: string) => {
    if (selectedTraining) {
      completeTraining(selectedTraining.id, certificateFile, issueDate, certId);
    }
  };
  
  const handleViewFile = (url: string, name: string) => {
    setFileToPreview({ url, name });
    setIsPreviewOpen(true);
  };

  const handleGenerateCertificate = (training: Training) => {
      setCertificateTraining(training);
      setIsCertificateModalOpen(true);
  };

  const handleDownloadManual = (training: Training) => {
    const relatedProduct = products.find(p => p.name === training.trainingType && p.sector === 'Training');
    if (relatedProduct && relatedProduct.trainingManual) {
        // Trigger download
        const link = document.createElement('a');
        link.href = relatedProduct.trainingManual;
        link.download = `${training.trainingType.replace(/\s/g, '_')}_Manual.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        alert("Training manual not available for this course.");
    }
  };

  const handleCourseClick = (courseName: string) => {
    // Find the product that corresponds to this training type
    const product = products.find(p => p.name === courseName && p.sector === 'Training');
    if (product) {
        setViewProduct(product);
        setIsProductModalOpen(true);
    } else {
        // Optional: Alert or inform user if detailed product view isn't available
        console.log("No detailed product view available for this course.");
    }
  };
  
  const handleDownloadTrainingPdf = (training: Training) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    addLetterheadToDoc(doc);
    const topMargin = 60;
    
    doc.setFontSize(20);
    doc.text(`Training Registration Summary`, 14, topMargin - 28);

    const didDrawPage = (data: any) => {
        addLetterheadToDoc(data.doc);
    };

    doc.autoTable({
        startY: topMargin,
        head: [['Trainee Details', '']],
        body: [
            ['Name', training.name],
            ['Phone', training.phone],
            ['Training Type', training.trainingType],
            ['Specific Focus', training.trainingCategory || 'N/A'],
            ['Due Date', training.dueDate],
            ['Payment Status', training.payment],
            ['Training Status', training.status],
        ],
        theme: 'striped',
        headStyles: { fillColor: [37, 53, 71] },
        didDrawPage
    });
    
    let yPos = doc.autoTable.previous.finalY;

    const addFileToPdf = (label: string, fileData?: string, fileName?: string) => {
        if (!fileData) return;
        if (yPos > 250) { doc.addPage(); yPos = topMargin; }
        doc.setFontSize(12);
        doc.text(label, 14, yPos);
        yPos += 5;
        if (fileData.startsWith('data:image/')) {
            try {
                doc.addImage(fileData, 'PNG', 14, yPos, 60, 60);
                yPos += 65;
            } catch (e) {
                doc.setFontSize(10);
                doc.text('Could not embed image.', 14, yPos);
                yPos += 10;
            }
        } else {
            doc.setFontSize(10);
            doc.text(`- A file is attached (${fileName || 'file.pdf'}). Preview in app.`, 14, yPos);
            yPos += 10;
        }
    };

    if(training.paymentReceipt || (training.certificateFile && training.certificateFile !== 'SYSTEM_GENERATED')) {
        yPos += 15;
        if(yPos > 250) { doc.addPage(); yPos = topMargin; }
        doc.setFontSize(16);
        doc.text('Attached Files', 14, yPos);
        yPos += 10;
        addFileToPdf('Payment Receipt', training.paymentReceipt, `${training.name}_receipt`);
        
        if (training.certificateFile && training.certificateFile !== 'SYSTEM_GENERATED') {
             addFileToPdf('Certificate File', training.certificateFile, `${training.name}_certificate`);
        }
    }

    doc.save(`Training-${training.name.replace(/\s/g, '_')}.pdf`);
  };

  const handleExportHistoryCsv = () => {
    const headers = ['Trainee Name', 'Phone', 'Training Type', 'Specific Focus', 'Completion Date', 'Certificate ID'];
    const data = sortedTrainings.map(t => [
        t.name,
        t.phone,
        t.trainingType,
        t.trainingCategory || '',
        t.certificateIssueDate || t.dueDate,
        t.certificateId || 'N/A'
    ]);

    const escape = (cell: any) => {
        let s = String(cell ?? '');
        if (s.includes(',') || s.includes('"') || s.includes('\n')) {
            return `"${s.replace(/"/g, '""')}"`;
        }
        return s;
    };

    const csvContent = [
        headers.map(escape).join(','),
        ...data.map(row => row.map(escape).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `training_history_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  const SortableHeader: React.FC<{ sortKey: SortKey; label: string }> = ({ sortKey: key, label }) => (
    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
        <button onClick={() => handleSort(key)} className="flex items-center gap-2 hover:text-gray-800">
            {label}
            {sortKey === key && <SortAscIcon className={`w-4 h-4 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />}
        </button>
    </th>
  );

  return (
    <>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
        {/* Top Header & Search */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
             <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Training & Certifications</h2>
             <div className="relative w-full sm:w-64">
                <input
                    type="text"
                    placeholder="Search trainees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
            </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                    onClick={() => setActiveTab('registration')}
                    className={`${
                        activeTab === 'registration'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2`}
                >
                    <UserPlusIcon className="w-5 h-5"/>
                    Active Registrations
                </button>
                <button
                    onClick={() => setActiveTab('certifications')}
                    className={`${
                        activeTab === 'certifications'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2`}
                >
                    <BadgeCheckIcon className="w-5 h-5"/>
                    Certifications
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`${
                        activeTab === 'history'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2`}
                >
                    <ClockIcon className="w-5 h-5"/>
                    History
                </button>
            </nav>
        </div>

        {activeTab === 'registration' && (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Registration Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-8 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Register New Trainee</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <InputField label="Full Name" name="name" value={formData.name} onChange={handleInputChange} required />
                        <InputField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required />
                        <InputField label="Due Date" name="dueDate" type="date" value={formData.dueDate} onChange={handleInputChange} required />
                        <div>
                        <label htmlFor="trainingType" className="block text-sm font-medium text-gray-700 mb-1">Training Type</label>
                        <select
                            id="trainingType"
                            name="trainingType"
                            value={formData.trainingType}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                            {trainingOptions.map(option => <option key={option} value={option}>{option}</option>)}
                        </select>
                        </div>
                        {formData.trainingType === 'Other' && (
                            <InputField 
                                label="Specify Other Training" 
                                name="otherTrainingType" 
                                value={otherTrainingType} 
                                onChange={(e) => setOtherTrainingType(e.target.value)} 
                                placeholder="Enter training name"
                                required 
                            />
                        )}
                        <div>
                            <label htmlFor="trainingCategory" className="block text-sm font-medium text-gray-700 mb-1">Specific Product Focus</label>
                            <select
                                id="trainingCategory"
                                name="trainingCategory"
                                value={formData.trainingCategory}
                                onChange={handleInputChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            >
                                <option value="">Select specific product (Optional)</option>
                                {trainingCategories.sort().map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                        <label htmlFor="payment" className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                        <select
                            id="payment"
                            name="payment"
                            value={formData.payment}
                            onChange={handleInputChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                            <option value="Unpaid">Unpaid</option>
                            <option value="Paid">Paid</option>
                        </select>
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-700">Payment Receipt (Optional)</label>
                        <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="paymentReceipt" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                                    <span>Upload a file</span>
                                    <input id="paymentReceipt" name="paymentReceipt" type="file" className="sr-only" onChange={handleFileChange} />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500">{receiptName || 'No file selected'}</p>
                            </div>
                        </div>
                        </div>
                        <div className="text-right">
                        <button type="submit" className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                            Register
                        </button>
                        </div>
                    </form>
                    </div>
                </div>

                {/* Registrations Table */}
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Active Registrations</h2>
                    <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead className="bg-gray-100">
                        <tr>
                            <SortableHeader sortKey="name" label="Name" />
                            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                            <SortableHeader sortKey="trainingType" label="Training Type" />
                            <SortableHeader sortKey="dueDate" label="Due Date" />
                            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Course Material</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sortedTrainings.length > 0 ? sortedTrainings.map(training => {
                            const relatedProduct = products.find(p => p.name === training.trainingType && p.sector === 'Training');
                            const hasManual = !!relatedProduct?.trainingManual;

                            return (
                                <tr key={training.id} className="hover:bg-gray-50">
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap font-medium">{training.name}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{training.phone}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <button 
                                        onClick={() => handleCourseClick(training.trainingType)}
                                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-left focus:outline-none"
                                        title="View Course Details"
                                    >
                                        {training.trainingType}
                                    </button>
                                    {training.trainingCategory && <p className="text-xs text-gray-500 mt-1">{training.trainingCategory}</p>}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{training.dueDate}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    training.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {training.status}
                                    </span>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {hasManual ? (
                                        <button 
                                            onClick={() => handleDownloadManual(training)}
                                            className="flex items-center gap-1 text-xs text-indigo-600 font-medium hover:text-indigo-800 hover:underline"
                                            title="Download Training Module / Manual"
                                        >
                                            <BookOpenIcon className="w-4 h-4" /> Download Manual
                                        </button>
                                    ) : (
                                        <span className="text-xs text-gray-400">Unavailable</span>
                                    )}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <div className="flex items-center gap-2">
                                        {training.status === 'Ongoing' ? (
                                            <button onClick={() => handleCompleteClick(training)} className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full hover:bg-green-600 whitespace-nowrap">
                                                Mark Complete
                                            </button>
                                        ) : (
                                            <span className="text-xs text-green-600 font-medium">Certified</span>
                                        )}
                                        <button onClick={() => handleDownloadTrainingPdf(training)} className="text-gray-500 hover:text-blue-600 p-1" title="Download Info">
                                            <DownloadIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                                </tr>
                            );
                        }) : (
                            <tr><td colSpan={7} className="text-center py-10 text-gray-500">No active registrations found.</td></tr>
                        )}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'certifications' && (
            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Issued Certifications</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage and print certificates for completed trainees.</p>
                    </div>
                </div>
                 <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead className="bg-white border-b border-gray-200">
                        <tr>
                            <SortableHeader sortKey="name" label="Trainee Name" />
                            <SortableHeader sortKey="trainingType" label="Course Completed" />
                            <SortableHeader sortKey="dueDate" label="Completion Date" />
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Certificate Status</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sortedTrainings.length > 0 ? sortedTrainings.map(training => (
                            <tr key={training.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-5 py-5 border-b border-gray-100 bg-white text-sm">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                                            {training.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-gray-900 font-semibold">{training.name}</p>
                                            <p className="text-gray-500 text-xs">{training.phone}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-100 bg-white text-sm">
                                    <button 
                                        onClick={() => handleCourseClick(training.trainingType)}
                                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-left focus:outline-none"
                                        title="View Course Details"
                                    >
                                        {training.trainingType}
                                    </button>
                                    {training.trainingCategory && <p className="text-xs text-gray-500 mt-1">{training.trainingCategory}</p>}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-100 bg-white text-sm">
                                    <p className="text-gray-900">{training.certificateIssueDate || training.dueDate}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-100 bg-white text-sm">
                                    {training.certificateFile === 'SYSTEM_GENERATED' ? (
                                        <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-1 rounded text-xs font-medium">
                                            <BadgeCheckIcon className="w-3 h-3" /> System Generated
                                        </span>
                                    ) : training.certificateFile ? (
                                         <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2 py-1 rounded text-xs font-medium">
                                            <CheckCircleIcon className="w-3 h-3" /> Uploaded
                                         </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                                            No Certificate
                                        </span>
                                    )}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-100 bg-white text-sm">
                                    <div className="flex items-center gap-3">
                                        {(training.certificateFile === 'SYSTEM_GENERATED' || !training.certificateFile) && (
                                            <button 
                                                onClick={() => handleGenerateCertificate(training)} 
                                                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 transition-colors shadow-sm"
                                            >
                                                <AcademicCapIcon className="w-4 h-4" />
                                                {training.certificateFile === 'SYSTEM_GENERATED' ? 'Print Certificate' : 'Create Certificate'}
                                            </button>
                                        )}
                                        {training.certificateFile && training.certificateFile !== 'SYSTEM_GENERATED' && (
                                             <button 
                                                onClick={() => handleViewFile(training.certificateFile!, `${training.name}_Cert`)}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded hover:bg-gray-200 transition-colors shadow-sm"
                                                title="View Uploaded File"
                                             >
                                                <FileIcon className="w-4 h-4" /> View Uploaded
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="text-center py-12">
                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                        <BadgeCheckIcon className="w-12 h-12 mb-3 opacity-50" />
                                        <p>No completed certifications found.</p>
                                        <p className="text-sm mt-1">Complete a training in the Registration tab to see it here.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                 </div>
            </div>
        )}
        
        {activeTab === 'history' && (
             <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gray-50 flex flex-wrap justify-between items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Training History</h2>
                        <p className="text-sm text-gray-500 mt-1">Archive of all completed training sessions.</p>
                    </div>
                    <button onClick={handleExportHistoryCsv} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-sm">
                        <DocumentArrowDownIcon className="w-5 h-5" /> Export CSV
                    </button>
                </div>
                 <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead className="bg-white border-b border-gray-200">
                        <tr>
                            <SortableHeader sortKey="name" label="Trainee Name" />
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                            <SortableHeader sortKey="trainingType" label="Course" />
                            <SortableHeader sortKey="dueDate" label="Completed Date" />
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Course Material</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sortedTrainings.length > 0 ? sortedTrainings.map(training => {
                            const relatedProduct = products.find(p => p.name === training.trainingType && p.sector === 'Training');
                            const hasManual = !!relatedProduct?.trainingManual;

                            return (
                                <tr key={training.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-5 border-b border-gray-100 bg-white text-sm">
                                        <p className="text-gray-900 font-semibold">{training.name}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-100 bg-white text-sm">
                                        <p className="text-gray-900">{training.phone}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-100 bg-white text-sm">
                                        <button 
                                            onClick={() => handleCourseClick(training.trainingType)}
                                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-left focus:outline-none"
                                            title="View Course Details"
                                        >
                                            {training.trainingType}
                                        </button>
                                        {training.trainingCategory && <p className="text-xs text-gray-500 mt-1">{training.trainingCategory}</p>}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-100 bg-white text-sm">
                                        <p className="text-gray-900">{training.certificateIssueDate || training.dueDate}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-100 bg-white text-sm">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Completed
                                        </span>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-100 bg-white text-sm">
                                        {hasManual ? (
                                            <button 
                                                onClick={() => handleDownloadManual(training)}
                                                className="flex items-center gap-1 text-xs text-indigo-600 font-medium hover:text-indigo-800 hover:underline"
                                                title="Download Training Module / Manual"
                                            >
                                                <BookOpenIcon className="w-4 h-4" /> Manual
                                            </button>
                                        ) : (
                                            <span className="text-xs text-gray-400">Unavailable</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-100 bg-white text-sm">
                                        <button 
                                            onClick={() => handleDownloadTrainingPdf(training)} 
                                            className="text-gray-500 hover:text-blue-600 p-1 transition-colors" 
                                            title="Download Record PDF"
                                        >
                                            <DownloadIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan={7} className="text-center py-12">
                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                        <ClockIcon className="w-12 h-12 mb-3 opacity-50" />
                                        <p>No training history available.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                 </div>
            </div>
        )}

      </div>
      <CompleteTrainingModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        onComplete={handleCompleteTraining}
        training={selectedTraining}
      />
      <FilePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        fileDataUrl={fileToPreview?.url || ''}
        fileName={fileToPreview?.name || ''}
      />
      <CertificateModal 
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        training={certificateTraining}
      />
      <ProductDetailModal
        product={viewProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        isAdmin={false}
        onEdit={() => {}} 
        onOrder={() => setIsProductModalOpen(false)}
        onSwitchProduct={(p) => setViewProduct(p)}
      />
    </>
  );
};

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, type = 'text', placeholder, required }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

export default TrainingComponent;
