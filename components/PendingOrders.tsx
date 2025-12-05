
import React, { useState, useMemo, useContext } from 'react';
import { AppContext } from '../App';
import { Order } from '../types';
import { SortAscIcon, DownloadIcon, DocumentArrowDownIcon, SearchIcon } from './icons';
import { addLetterheadToDoc } from './pdfUtils';

type SortKey = 'name' | 'machineType' | 'deliveryDate';
type SortDirection = 'asc' | 'desc';

// Helper function to calculate delivery status
const getDeliveryStatus = (deliveryDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deliveryDateParts = deliveryDateStr.split('-').map(s => parseInt(s, 10));
    // new Date() month is 0-indexed, so -1
    const deliveryDate = new Date(deliveryDateParts[0], deliveryDateParts[1] - 1, deliveryDateParts[2]);
    
    if (isNaN(deliveryDate.getTime())) {
        return { text: 'Invalid Date', colorClass: 'bg-gray-100 text-gray-800' };
    }
    deliveryDate.setHours(0, 0, 0, 0);

    const diffTime = deliveryDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        const overdueDays = Math.abs(diffDays);
        return {
            text: `Overdue by ${overdueDays} day${overdueDays !== 1 ? 's' : ''}`,
            colorClass: 'bg-red-100 text-red-800'
        };
    }
    
    if (diffDays <= 5) {
        const text = diffDays === 0 ? 'Due Today' : `${diffDays} day${diffDays !== 1 ? 's' : ''} left`;
        return {
            text: text,
            colorClass: 'bg-yellow-100 text-yellow-800'
        };
    } 
    
    return {
        text: `${diffDays} days left`,
        colorClass: 'bg-green-100 text-green-800'
    };
};


const PendingOrders: React.FC = () => {
  const { orders } = useContext(AppContext);
  const [sortKey, setSortKey] = useState<SortKey>('deliveryDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const handleDownloadPdf = (order: Order) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    addLetterheadToDoc(doc);
    const topMargin = 60;

    const customerName = `${order.customerFirstName} ${order.customerFatherName} ${order.customerGrandfatherName}`;
    const formatCurrency = (val: number) => new Intl.NumberFormat().format(val) + ' ETB';
    const totalPaid = order.prepayment + (order.paymentHistory || []).reduce((sum, p) => sum + p.amount, 0);
    const remainingBalance = order.machinePrice - totalPaid;

    doc.setFontSize(20);
    doc.text(`Pending Order Summary - ID: ${order.id}`, 14, topMargin - 28);

    const didDrawPage = (data: any) => {
        addLetterheadToDoc(data.doc);
    };

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
        head: [['Order & Payment Details', '']],
        body: [
            ['Machine Type', order.machineType],
            ['Description', order.description],
            ['Salesperson', order.salesperson || 'N/A'],
            ['Delivery Date', order.deliveryDate],
            ['Machine Price', formatCurrency(order.machinePrice)],
            ['Total Paid', formatCurrency(totalPaid)],
            ['Remaining Balance', formatCurrency(remainingBalance)],
        ],
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
    if (order.customerIdCard || order.machineImage || order.prepaymentReceipt) {
        if(yPos > 250) { doc.addPage(); yPos = topMargin; }
        doc.setFontSize(16);
        doc.text('Attached Files', 14, yPos);
        yPos += 10;

        addFileToPdf('Customer ID Card', order.customerIdCard);
        addFileToPdf('Machine Image', order.machineImage);
        addFileToPdf('Prepayment Receipt', order.prepaymentReceipt);
    }


    doc.save(`Pending-Order-${order.id}.pdf`);
  };

  const filteredOrders = useMemo(() => {
      let result = orders.filter(order => order.status !== 'Completed');
      if (searchTerm) {
          result = result.filter(order => 
            `${order.customerFirstName} ${order.customerFatherName} ${order.customerGrandfatherName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.machineType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.salesperson && order.salesperson.toLowerCase().includes(searchTerm.toLowerCase()))
          );
      }
      return result;
  }, [orders, searchTerm]);

  const sortedOrders = useMemo(() => {
    const sorted = [...filteredOrders];
    sorted.sort((a, b) => {
      let valA: string | number;
      let valB: string | number;

      switch (sortKey) {
        case 'name':
          valA = `${a.customerFirstName} ${a.customerFatherName}`.toLowerCase();
          valB = `${b.customerFirstName} ${b.customerFatherName}`.toLowerCase();
          break;
        case 'machineType':
          valA = a.machineType.toLowerCase();
          valB = b.machineType.toLowerCase();
          break;
        case 'deliveryDate':
          valA = new Date(a.deliveryDate).getTime();
          valB = new Date(b.deliveryDate).getTime();
          break;
        default:
          return 0;
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredOrders, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };
  
  const handleExportCsv = () => {
    const headers = ['Order ID', 'Customer Name', 'Machine Type', 'Price (ETB)', 'Delivery Date', 'Salesperson', 'Status'];
    const data = sortedOrders.map(order => [
        order.id,
        `${order.customerFirstName} ${order.customerFatherName} ${order.customerGrandfatherName}`,
        order.machineType,
        order.machinePrice,
        order.deliveryDate,
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
        link.setAttribute('download', `pending_orders_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
    <>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Pending Delivery</h2>
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
            <button onClick={handleExportCsv} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-sm">
                <DocumentArrowDownIcon className="w-5 h-5" /> Export CSV
            </button>
            <div className="relative flex-grow sm:flex-grow-0">
                <input
                    type="text"
                    placeholder="Search pending orders..."
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
              <SortableHeader sortKey="name" label="Customer Name" />
              <SortableHeader sortKey="machineType" label="Machine Type" />
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
              <SortableHeader sortKey="deliveryDate" label="Delivery Date" />
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Salesperson</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Delivery Countdown</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order Status</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.length > 0 ? sortedOrders.map(order => {
              const status = getDeliveryStatus(order.deliveryDate);
              return (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{`${order.customerFirstName} ${order.customerFatherName} ${order.customerGrandfatherName}`}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{order.machineType}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{new Intl.NumberFormat().format(order.machinePrice)} ETB</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{order.deliveryDate}</p>
                  </td>
                   <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{order.salesperson || 'N/A'}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${status.colorClass}`}>
                        {status.text}
                    </span>
                  </td>
                   <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                        order.status === 'Ready for Completion' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        {order.status === 'Ready for Completion' ? 'Ready' : 'Manufacturing'}
                    </span>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <button onClick={() => handleDownloadPdf(order)} className="text-gray-500 hover:text-blue-600" title="Download Details">
                          <DownloadIcon className="w-5 h-5" />
                      </button>
                  </td>
                </tr>
              );
            }) : (
              <tr><td colSpan={8} className="text-center py-10 text-gray-500">No pending orders.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PendingOrders;
