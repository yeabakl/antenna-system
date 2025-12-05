
import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../App';
import { Order } from '../types';
import { CheckCircleIcon, CloseIcon, DownloadIcon, FileIcon, FilePdfIcon, SearchIcon, DocumentArrowDownIcon } from './icons';
import FilePreviewModal from './FilePreviewModal';
import { addLetterheadToDoc } from './pdfUtils';

declare global {
    interface Window {
        jspdf: any;
    }
}

// Generate PDF Logic reused for modal and list view
const generateOrderPdf = (order: Order) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    addLetterheadToDoc(doc);
    const topMargin = 60;

    const customerName = `${order.customerFirstName} ${order.customerFatherName} ${order.customerGrandfatherName}`;
    const formatCurrency = (val: number) => new Intl.NumberFormat().format(val) + ' ETB';
    const totalPaid = order.prepayment + (order.paymentHistory || []).reduce((sum, p) => sum + p.amount, 0);
    const remainingBalance = order.machinePrice - totalPaid;

    const didDrawPage = (data: any) => {
        addLetterheadToDoc(data.doc);
    };

    doc.setFontSize(20);
    doc.text(`Order Summary - ID: ${order.id}`, 14, topMargin - 28);

    doc.autoTable({
        startY: topMargin,
        head: [['Customer Details', '']],
        body: [
            ['Name', customerName],
            ['Primary Phone', order.phone1],
            ['Secondary Phone', order.phone2 || 'N/A']
        ],
        theme: 'striped',
        headStyles: { fillColor: [37, 53, 71] },
        didDrawPage
    });

    doc.autoTable({
        startY: doc.autoTable.previous.finalY + 10,
        head: [['Order Details', '']],
        body: [
            ['Machine Type', order.machineType],
            ['Description', order.description],
            ['Salesperson', order.salesperson || 'N/A'],
            ['Delivery Date', order.deliveryDate],
            ['Final Payment Date', order.paymentDate],
        ],
        theme: 'striped',
        headStyles: { fillColor: [37, 53, 71] },
        didDrawPage
    });
    
    const paymentBody = [
        ['Machine Price', formatCurrency(order.machinePrice)],
        ['Prepayment', formatCurrency(order.prepayment)],
        ...(order.paymentHistory || []).map(p => [`Payment on ${p.date}`, formatCurrency(p.amount)]),
        ['Total Paid', formatCurrency(totalPaid)],
        ['Remaining Balance', formatCurrency(remainingBalance)],
    ];

    doc.autoTable({
        startY: doc.autoTable.previous.finalY + 10,
        head: [['Payment Summary', 'Amount']],
        body: paymentBody,
        theme: 'striped',
        headStyles: { fillColor: [37, 53, 71] },
        didDrawPage
    });

    let yPos = doc.autoTable.previous.finalY;

    const addFileToPdf = (label: string, fileData?: string, fileName?: string) => {
        if (!fileData) return;

        if (yPos > 250) { // Check if new page is needed
            doc.addPage();
            yPos = topMargin;
        }

        doc.setFontSize(12);
        doc.text(label, 14, yPos);
        yPos += 5;

        if (fileData.startsWith('data:image/')) {
            try {
                doc.addImage(fileData, 'PNG', 14, yPos, 60, 60);
                yPos += 65;
            } catch(e) {
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
    
    yPos += 15;
    if(yPos > 250) { doc.addPage(); yPos = topMargin; }
    doc.setFontSize(16);
    doc.text('Attached Files', 14, yPos);
    yPos += 10;

    addFileToPdf('Customer ID Card', order.customerIdCard);
    addFileToPdf('Machine Image', order.machineImage);
    addFileToPdf('Prepayment Receipt', order.prepaymentReceipt);
    addFileToPdf('Final Payment Receipt', order.restOfPaymentReceipt);
    addFileToPdf('Contract File', order.contractFile, 'contract.pdf');
    addFileToPdf('Warranty File', order.warrantyFile, 'warranty.pdf');
    addFileToPdf('Certification File', order.certificationFile, 'certification.pdf');

    doc.save(`Order-${order.id}.pdf`);
};

const DetailItem: React.FC<{label: string, value: string | React.ReactNode}> = ({label, value}) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold text-gray-800">{value || 'N/A'}</p>
    </div>
);

const FileLink: React.FC<{label: string, fileData: string | undefined, onPreview: (data: string, name: string) => void}> = ({label, fileData, onPreview}) => {
    const commonClasses = "w-full flex items-center p-2 rounded-md transition-colors text-left";

    if (!fileData) {
        return (
            <div className={`${commonClasses} bg-gray-100 opacity-60 cursor-not-allowed`}>
                <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center border">
                    <FileIcon className="w-6 h-6 text-gray-400" />
                </div>
                <div className="ml-3 flex-grow">
                    <p className="text-sm font-medium text-gray-500">{label}</p>
                    <p className="text-xs text-gray-400">Not provided</p>
                </div>
            </div>
        );
    }
    
    const mimeType = fileData.substring(fileData.indexOf(':') + 1, fileData.indexOf(';'));
    const extension = mimeType.split('/')[1]?.split('+')[0] || 'file';
    const fileName = `${label.replace(/\s/g, '_').toLowerCase()}.${extension}`;

    const isImage = mimeType.startsWith('image/');
    const isPdf = mimeType.includes('pdf');

    return (
        <button onClick={() => onPreview(fileData, fileName)} className={`${commonClasses} bg-white hover:bg-gray-50 border border-gray-200 group`}>
             <div className="flex-shrink-0 w-10 h-10 bg-white rounded-md flex items-center justify-center overflow-hidden border">
                {isImage ? (
                    <img src={fileData} alt="preview" className="w-full h-full object-cover" />
                ) : isPdf ? (
                    <FilePdfIcon className="w-6 h-6 text-red-500" />
                ) : (
                    <FileIcon className="w-6 h-6 text-gray-500" />
                )}
            </div>
            <div className="ml-3 flex-grow">
                <p className="text-sm font-medium text-gray-800 group-hover:text-blue-600">{label}</p>
                 <p className="text-xs text-gray-500">{fileName}</p>
            </div>
            <DownloadIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-500 ml-2 flex-shrink-0" />
        </button>
    );
};

const OrderDetailsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
    onViewFile: (url: string, name: string) => void;
}> = ({ isOpen, onClose, order, onViewFile }) => {
    if (!isOpen || !order) return null;

    const totalPaid = order.prepayment + (order.paymentHistory || []).reduce((sum, p) => sum + p.amount, 0);
    const remainingBalance = order.machinePrice - totalPaid;
    const formatCurrency = (val: number) => new Intl.NumberFormat().format(val) + ' ETB';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-fade-in-up">
                 <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-semibold text-gray-800">Completed Order Details</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors"><CloseIcon className="w-6 h-6 text-gray-600" /></button>
                </div>
                <div className="p-6 overflow-y-auto">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-3">
                            <h4 className="font-bold text-gray-700 border-b pb-1">Customer Info</h4>
                            <DetailItem label="Full Name" value={`${order.customerFirstName} ${order.customerFatherName} ${order.customerGrandfatherName}`} />
                            <DetailItem label="Phone" value={order.phone1} />
                            <DetailItem label="Secondary Phone" value={order.phone2} />
                             <DetailItem label="Salesperson" value={order.salesperson} />
                        </div>
                        <div className="space-y-3">
                            <h4 className="font-bold text-gray-700 border-b pb-1">Order Info</h4>
                            <DetailItem label="Order ID" value={order.id} />
                            <DetailItem label="Machine Type" value={order.machineType} />
                            <DetailItem label="Description" value={order.description} />
                            <DetailItem label="Completion Date" value={order.paymentDate} />
                        </div>
                    </div>

                     <div className="mb-6">
                        <h4 className="font-bold text-gray-700 border-b pb-1 mb-3">Payment Summary</h4>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-3 bg-gray-100 rounded-md"><p className="text-sm text-gray-600">Total Price</p><p className="font-bold text-lg">{formatCurrency(order.machinePrice)}</p></div>
                             <div className="p-3 bg-green-100 rounded-md"><p className="text-sm text-green-800">Total Paid</p><p className="font-bold text-lg text-green-900">{formatCurrency(totalPaid)}</p></div>
                             <div className="p-3 bg-gray-100 rounded-md"><p className="text-sm text-gray-600">Balance</p><p className="font-bold text-lg">{formatCurrency(remainingBalance)}</p></div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-700 border-b pb-1 mb-3">Documents & Files</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FileLink label="Customer ID Card" fileData={order.customerIdCard} onPreview={onViewFile} />
                            <FileLink label="Machine Image" fileData={order.machineImage} onPreview={onViewFile} />
                            <FileLink label="Prepayment Receipt" fileData={order.prepaymentReceipt} onPreview={onViewFile} />
                            <FileLink label="Final Payment Receipt" fileData={order.restOfPaymentReceipt} onPreview={onViewFile} />
                            <FileLink label="Contract" fileData={order.contractFile} onPreview={onViewFile} />
                            <FileLink label="Warranty" fileData={order.warrantyFile} onPreview={onViewFile} />
                             <FileLink label="Certification" fileData={order.certificationFile} onPreview={onViewFile} />
                        </div>
                    </div>
                </div>
                 <div className="flex justify-end items-center p-4 bg-gray-50 rounded-b-lg">
                    <button onClick={() => generateOrderPdf(order)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">
                        <DownloadIcon className="w-5 h-5" /> Download PDF Summary
                    </button>
                </div>
            </div>
        </div>
    );
}

const History: React.FC = () => {
  const { history } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [filePreview, setFilePreview] = useState<{ url: string, name: string } | null>(null);

  const filteredHistory = useMemo(() => {
    return history.filter(order =>
      `${order.customerFirstName} ${order.customerFatherName} ${order.customerGrandfatherName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.machineType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.salesperson && order.salesperson.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [history, searchTerm]);

  const handleViewDetails = (order: Order) => {
      setSelectedOrder(order);
  };

  const handleViewFile = (url: string, name: string) => {
      setFilePreview({ url, name });
      setIsPreviewOpen(true);
  };

  const handleExportCsv = () => {
    const headers = ['Order ID', 'Customer Name', 'Machine Type', 'Price (ETB)', 'Completion Date', 'Salesperson', 'Status'];
    const data = filteredHistory.map(order => [
        order.id,
        `${order.customerFirstName} ${order.customerFatherName} ${order.customerGrandfatherName}`,
        order.machineType,
        order.machinePrice,
        order.paymentDate,
        order.salesperson || '',
        order.status
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
        link.setAttribute('download', `order_history_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  return (
    <>
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Completed Orders History</h2>
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <button onClick={handleExportCsv} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-sm">
                    <DocumentArrowDownIcon className="w-5 h-5" /> Export CSV
                </button>
                <div className="relative flex-grow sm:flex-grow-0">
                    <input
                        type="text"
                        placeholder="Search history..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
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
                        <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                         <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Salesperson</th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Completion Date</th>
                         <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredHistory.length > 0 ? filteredHistory.map(order => (
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
                                <p className="text-gray-900 whitespace-no-wrap">{order.paymentDate}</p>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                    <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                                    <span className="relative">Completed</span>
                                </span>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => handleViewDetails(order)} className="text-blue-600 hover:text-blue-900 text-sm font-medium">View Details</button>
                                    <button onClick={() => generateOrderPdf(order)} className="text-gray-500 hover:text-blue-600" title="Download PDF Summary">
                                        <DownloadIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan={8} className="text-center py-10 text-gray-500">No history found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>

        <OrderDetailsModal 
            isOpen={!!selectedOrder}
            onClose={() => setSelectedOrder(null)}
            order={selectedOrder}
            onViewFile={handleViewFile}
        />

        <FilePreviewModal
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            fileDataUrl={filePreview?.url || ''}
            fileName={filePreview?.name || ''}
        />
    </>
  );
};

export default History;
