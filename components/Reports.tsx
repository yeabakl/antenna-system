
import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../App';
import { DownloadIcon, ChartBarIcon, DocumentArrowDownIcon, CurrencyDollarIcon, ClipboardListIcon, UsersIcon, AcademicCapIcon, EnvelopeIcon, CheckCircleIcon } from './icons';
import { addLetterheadToDoc } from './pdfUtils';

declare global {
    interface Window {
        jspdf: any;
    }
}

const StatCard: React.FC<{
    title: string;
    value: string;
    icon: React.ReactNode;
    period?: string;
    colorClass: string;
}> = ({ title, value, icon, period, colorClass }) => (
    <div className={`bg-white p-6 rounded-xl shadow-lg border-l-4 ${colorClass}`}>
        <div className="flex items-start justify-between">
            <div>
                <h4 className="text-gray-500 font-medium">{title}</h4>
                <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
                 {period && <p className="text-xs text-gray-400 mt-1">Last {period === 'Weekly' ? '7' : '30'} days</p>}
            </div>
            {icon}
        </div>
    </div>
);


const BarChart: React.FC<{ title: string; data: Record<string, number>; colorClass: string }> = ({ title, data, colorClass }) => {
    const entries = Object.entries(data);
    const maxValue = Math.max(...entries.map(([, value]) => Number(value)), 1); // Avoid division by zero
    const chartHeight = 250;

    if (entries.length === 0) {
        return (
            <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <ChartBarIcon className="w-6 h-6 text-gray-500" /> {title}
                </h3>
                <div className="h-[250px] flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No data available for this period.</p>
                </div>
            </div>
        );
    }
    
    return (
        <div>
             <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <ChartBarIcon className="w-6 h-6 text-gray-500" /> {title}
            </h3>
             <div className="overflow-x-auto pb-4 bg-gray-50 p-4 rounded-lg">
                <svg width="100%" height={chartHeight + 40} aria-labelledby="title" role="img">
                    <title id="title">{title}</title>
                    {/* Grid Lines */}
                     {[...Array(5)].map((_, i) => (
                        <line
                            key={i}
                            x1="0"
                            y1={chartHeight - (i * chartHeight / 5)}
                            x2="100%"
                            y2={chartHeight - (i * chartHeight / 5)}
                            stroke="#e5e7eb"
                            strokeWidth="1"
                        />
                    ))}
                    <line x1="0" y1={chartHeight} x2="100%" y2={chartHeight} stroke="#d1d5db" strokeWidth="1" />
                    
                    {entries.map(([label, value], index) => {
                        const barHeight = (Number(value) / maxValue) * chartHeight;
                        const x = `${(index / entries.length) * 100}%`;
                        const barWidth = `${(1 / entries.length) * 80}%`; // 80% of available space for the bar
                        const y = chartHeight - barHeight;
                        return (
                            <g key={label} className="group" transform={`translate(${(index / entries.length) * 100}, 0)`}>
                                <rect
                                    x={x}
                                    y={y}
                                    width={barWidth}
                                    height={barHeight}
                                    className={`${colorClass} transition-all duration-300 group-hover:opacity-80`}
                                    style={{ transformOrigin: 'bottom', animation: 'bar-up 0.5s ease-out forwards' }}
                                />
                                {/* Tooltip */}
                                <text x={`calc(${x} + ${barWidth} / 2)`} y={y - 8} textAnchor="middle" className="text-sm font-bold fill-current text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">{String(value)}</text>
                                <text x={`calc(${x} + ${barWidth} / 2)`} y={chartHeight + 20} textAnchor="middle" className="text-xs fill-current text-gray-600 truncate">{label}</text>
                            </g>
                        );
                    })}
                </svg>
             </div>
        </div>
    );
};

const LineChart: React.FC<{ title: string; data: { date: string; revenue: number }[]; colorClass: string; gradientClass: string }> = ({ title, data, colorClass, gradientClass }) => {
    const chartHeight = 250;
    const chartWidth = 600; // Fixed width for consistent proportions
    const padding = 40;

    if (data.length < 2) {
        return (
             <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2"><ChartBarIcon className="w-6 h-6 text-gray-500" /> {title}</h3>
                <div className="h-[250px] flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">{data.length === 0 ? "No revenue data for this period." : "Not enough data to draw a chart."}</p>
                </div>
            </div>
        )
    }

    const maxRevenue = Math.max(...data.map(d => d.revenue), 1);
    const timestamps = data.map(d => new Date(d.date).getTime());
    const minTimestamp = Math.min(...timestamps);
    const maxTimestamp = Math.max(...timestamps);

    const getX = (timestamp: number) => {
        if (maxTimestamp === minTimestamp) return padding;
        return ((timestamp - minTimestamp) / (maxTimestamp - minTimestamp)) * (chartWidth - 2 * padding) + padding;
    };
    const getY = (revenue: number) => {
        return chartHeight - ((revenue / maxRevenue) * (chartHeight - 2 * padding)) - padding;
    };

    const pathData = data.map(d => `${getX(new Date(d.date).getTime())},${getY(d.revenue)}`).join(' L ');
    const areaPathData = `M ${getX(minTimestamp)},${chartHeight - padding} L ${pathData} L ${getX(maxTimestamp)},${chartHeight - padding} Z`;
    
    return (
        <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2"><ChartBarIcon className="w-6 h-6 text-gray-500" /> {title}</h3>
            <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="min-w-[600px]" aria-labelledby="title" role="img">
                    <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" className={`${gradientClass}`} stopOpacity="0.4"/>
                            <stop offset="100%" className={`${gradientClass}`} stopOpacity="0"/>
                        </linearGradient>
                    </defs>
                    {/* Grid Lines */}
                    {[...Array(4)].map((_, i) => (
                        <line key={i} x1={padding} y1={padding + (i * (chartHeight - 2 * padding) / 4)} x2={chartWidth-padding} y2={padding + (i * (chartHeight - 2 * padding) / 4)} className="stroke-current text-gray-200" />
                    ))}
                    
                    {/* Axes */}
                    <line x1={padding} y1={padding} x2={padding} y2={chartHeight - padding} className="stroke-current text-gray-300" />
                    <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} className="stroke-current text-gray-300" />
                    
                    {/* Labels */}
                    <text x="10" y={padding + 5} className="text-xs fill-current text-gray-500">{new Intl.NumberFormat().format(maxRevenue)}</text>
                    <text x="10" y={chartHeight - padding} className="text-xs fill-current text-gray-500">0</text>
                    <text x={padding} y={chartHeight - padding + 20} textAnchor="start" className="text-xs fill-current text-gray-500">{data[0].date}</text>
                    <text x={chartWidth - padding} y={chartHeight - padding + 20} textAnchor="end" className="text-xs fill-current text-gray-500">{data[data.length - 1].date}</text>
                    
                    {/* Area and Line */}
                    <path d={areaPathData} fill="url(#areaGradient)" />
                    <path d={`M ${pathData}`} fill="none" strokeWidth="2" className={`stroke-current ${colorClass}`} style={{ animation: 'line-draw 1s ease-out forwards' }}/>
                    
                    {/* Data Points and Tooltips */}
                    {data.map((d, index) => {
                        const cx = getX(new Date(d.date).getTime());
                        const cy = getY(d.revenue);
                        return (
                            <g key={index} className="group">
                                <circle cx={cx} cy={cy} r="8" fill="transparent" />
                                <circle cx={cx} cy={cy} r="4" className={`fill-current ${colorClass} group-hover:scale-150 transition-transform`} />
                                <g transform={`translate(${cx}, ${cy - 15})`} className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <rect x="-50" y="-22" width="100" height="20" rx="4" className="fill-current text-gray-800" />
                                    <text textAnchor="middle" className="text-xs fill-current text-white font-semibold">{`${new Intl.NumberFormat().format(d.revenue)} ETB`}</text>
                                </g>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};


const Reports: React.FC = () => {
  const { orders, history, contacts, trainings, letters } = useContext(AppContext);
  const [reportType, setReportType] = useState<'Weekly' | 'Monthly'>('Weekly');

  const { filteredOrders, filteredHistory } = useMemo(() => {
    const now = new Date();
    const daysToSubtract = reportType === 'Weekly' ? 7 : 30;
    const cutoffDate = new Date(new Date().setDate(now.getDate() - daysToSubtract));

    const fHistory = history.filter(order => new Date(order.paymentDate) >= cutoffDate);
    const fOrders = orders.filter(order => new Date(order.deliveryDate) >= cutoffDate); // Check delivery date for active orders
    
    return { filteredOrders: fOrders, filteredHistory: fHistory };
  }, [orders, history, reportType]);
  
  const totalRevenue = filteredHistory.reduce((acc, order) => acc + order.machinePrice, 0);
  const totalPaymentsReceived = [...filteredOrders, ...filteredHistory].reduce((acc, order) => {
    const historyPayments = (order.paymentHistory || []).reduce((sum, p) => sum + p.amount, 0);
    return acc + order.prepayment + historyPayments;
  }, 0);

  const machineTypeCounts = [...filteredOrders, ...filteredHistory].reduce((acc, order) => {
      acc[order.machineType] = (acc[order.machineType] || 0) + 1;
      return acc;
  }, {} as Record<string, number>);

  const trainingTypeCounts = useMemo(() => {
    return trainings.reduce((acc, training) => {
        acc[training.trainingType] = (acc[training.trainingType] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
  }, [trainings]);

  const letterStatusCounts = useMemo(() => {
    return letters.reduce((acc, letter) => {
        acc[letter.status] = (acc[letter.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
  }, [letters]);
  
  const revenueData = useMemo(() => {
    if (filteredHistory.length === 0) return [];

    const salesByDate: Record<string, number> = {};
    filteredHistory.forEach(order => {
        const date = order.paymentDate;
        salesByDate[date] = (salesByDate[date] || 0) + order.machinePrice;
    });

    const dataPoints = Object.entries(salesByDate)
        .map(([date, revenue]) => ({ date, revenue, timestamp: new Date(date).getTime() }))
        .sort((a, b) => a.timestamp - b.timestamp);

    return dataPoints;
  }, [filteredHistory]);


  const handleDownloadPdf = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    addLetterheadToDoc(doc);
    const topMargin = 60;

    const didDrawPage = (data: any) => {
        addLetterheadToDoc(data.doc);
    };
    
    doc.setFontSize(22);
    doc.text("Antenna Business Report", 14, topMargin - 28);
    doc.setFontSize(12);
    doc.text(`Period: ${reportType}`, 14, topMargin - 20);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, topMargin - 14);

    const statsData = [
      ["Completed Orders", filteredHistory.length.toString()],
      ["Active Orders", filteredOrders.length.toString()],
      ["Total Contacts", contacts.length.toString()],
      ["Total Training Registrations", trainings.length.toString()],
      ["Total Received Letters", letters.length.toString()],
      ["Revenue (Completed)", `${new Intl.NumberFormat().format(totalRevenue)} ETB`],
      ["Total Payments Received", `${new Intl.NumberFormat().format(totalPaymentsReceived)} ETB`],
    ];
    
    doc.autoTable({
        startY: topMargin,
        head: [['Metric', 'Value']],
        body: statsData,
        theme: 'striped',
        headStyles: { fillColor: [37, 53, 71] },
        didDrawPage
    });
    
    const tableData = filteredHistory.map(order => [
        order.id,
        `${order.customerFirstName} ${order.customerFatherName}`,
        order.machineType,
        `${new Intl.NumberFormat().format(order.machinePrice)} ETB`,
        order.deliveryDate,
    ]);

    if (tableData.length > 0) {
        doc.autoTable({
            startY: doc.autoTable.previous.finalY + 10,
            head: [['Order ID', 'Customer', 'Machine Type', 'Price', 'Delivery Date']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [37, 53, 71] },
            didDrawPage
        });
    }
    
    doc.save(`report-${reportType.toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`);
  };
  
  const handleExportCsv = () => {
    const escapeCsvCell = (cellData: any) => {
        let cell = cellData === null || cellData === undefined ? '' : String(cellData);
        cell = cell.replace(/"/g, '""'); // Escape double quotes
        if (cell.search(/("|,|\n)/g) >= 0) {
            cell = `"${cell}"`; // Enclose in double quotes if it contains commas, double quotes, or newlines
        }
        return cell;
    };

    const arrayToCsv = (data: any[][]) => {
        return data.map(row =>
            row.map(escapeCsvCell).join(',')
        ).join('\n');
    };

    let csvContent = "";

    const summaryData = [
        ['Metric', 'Value'],
        ['Report Period', reportType],
        ['Generated On', new Date().toLocaleString()],
        [], 
        ['Completed Orders (in period)', filteredHistory.length.toString()],
        ['Active Orders (in period)', filteredOrders.length.toString()],
        ['Total Contacts (all time)', contacts.length.toString()],
        ['Total Training Registrations (all time)', trainings.length.toString()],
        ['Total Received Letters (all time)', letters.length.toString()],
        ['Revenue (Completed, in period)', `${new Intl.NumberFormat().format(totalRevenue)} ETB`],
        ['Total Payments Received (in period)', `${new Intl.NumberFormat().format(totalPaymentsReceived)} ETB`],
    ];
    csvContent += 'Summary Report\n' + arrayToCsv(summaryData) + '\n\n';

    const machineTypeData = Object.entries(machineTypeCounts);
    if (machineTypeData.length > 0) {
        csvContent += 'Orders by Machine Type (in period)\n';
        const machineTypeHeader = [['Machine Type', 'Count']];
        const machineTypeDataAsString = machineTypeData.map(([type, count]) => [type, String(count)]);
        csvContent += arrayToCsv(machineTypeHeader.concat(machineTypeDataAsString)) + '\n\n';
    }

    if (filteredHistory.length > 0) {
        csvContent += 'Completed Orders (in period)\n';
        const completedOrdersHeader = [['Order ID', 'Customer', 'Machine Type', 'Price (ETB)', 'Delivery Date']];
        const completedOrdersData = filteredHistory.map(order => [
            order.id, `${order.customerFirstName} ${order.customerFatherName}`, order.machineType, order.machinePrice.toString(), order.deliveryDate,
        ]);
        csvContent += arrayToCsv(completedOrdersHeader.concat(completedOrdersData)) + '\n\n';
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `report-${reportType.toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  const handleExportContactsCsv = () => {
    const escapeCsvCell = (cellData: any) => {
        let cell = cellData === null || cellData === undefined ? '' : String(cellData);
        cell = cell.replace(/"/g, '""');
        if (cell.search(/("|,|\n)/g) >= 0) {
            cell = `"${cell}"`;
        }
        return cell;
    };

    const arrayToCsv = (data: any[][]) => {
        return data.map(row =>
            row.map(escapeCsvCell).join(',')
        ).join('\n');
    };

    const header = [['Category', 'Name', 'Phone', 'Address', 'Product Interest', 'Lead Status', 'Notes']];
    const data = contacts.map(contact => [
        contact.type,
        contact.name,
        contact.phone,
        contact.address || '',
        contact.productInterest || '',
        contact.type === 'Lead' ? (contact.leadStatus || 'New') : 'N/A',
        contact.description || ''
    ]);

    const csvContent = arrayToCsv(header.concat(data));
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `contacts_leads_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
        <style>{`
            @keyframes bar-up { from { transform: scaleY(0); } to { transform: scaleY(1); } }
            @keyframes line-draw { from { stroke-dasharray: 1000; stroke-dashoffset: 1000; } to { stroke-dasharray: 1000; stroke-dashoffset: 0; } }
            svg .truncate { max-width: 60px; }
        `}</style>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Business Reports</h2>
        <div className="flex items-center gap-4 flex-wrap">
            <div className="flex rounded-md shadow-sm">
                <button onClick={() => setReportType('Weekly')} className={`px-4 py-2 text-sm font-medium rounded-l-md transition-colors ${reportType === 'Weekly' ? 'bg-blue-600 text-white z-10' : 'bg-white text-gray-700 hover:bg-gray-50'} border border-gray-300`}>Weekly</button>
                <button onClick={() => setReportType('Monthly')} className={`px-4 py-2 text-sm font-medium rounded-r-md transition-colors ${reportType === 'Monthly' ? 'bg-blue-600 text-white z-10' : 'bg-white text-gray-700 hover:bg-gray-50'} border border-gray-300 -ml-px`}>Monthly</button>
            </div>
             <button onClick={handleExportCsv} className="inline-flex items-center gap-2 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors">
                <DocumentArrowDownIcon className="w-5 h-5"/>
                Export CSV
            </button>
            <button onClick={handleExportContactsCsv} className="inline-flex items-center gap-2 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                <UsersIcon className="w-5 h-5"/>
                Export Contacts
            </button>
            <button onClick={handleDownloadPdf} className="inline-flex items-center gap-2 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-800 transition-colors">
                <DownloadIcon className="w-5 h-5"/>
                Download PDF
            </button>
        </div>
      </div>
      
      {/* Key Metrics Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b-2">Key Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Revenue (Completed)" value={`${new Intl.NumberFormat().format(totalRevenue)} ETB`} period={reportType} icon={<CurrencyDollarIcon className="w-8 h-8 text-green-500"/>} colorClass="border-green-500" />
            <StatCard title="Payments Received" value={`${new Intl.NumberFormat().format(totalPaymentsReceived)} ETB`} period={reportType} icon={<CurrencyDollarIcon className="w-8 h-8 text-teal-500"/>} colorClass="border-teal-500" />
            <StatCard title="Completed Orders" value={filteredHistory.length.toString()} period={reportType} icon={<CheckCircleIcon className="w-8 h-8 text-blue-500"/>} colorClass="border-blue-500" />
            <StatCard title="Active Orders" value={filteredOrders.length.toString()} period={reportType} icon={<ClipboardListIcon className="w-8 h-8 text-yellow-500"/>} colorClass="border-yellow-500" />
        </div>
      </div>
      
       {/* Performance Charts Section */}
       <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b-2">Performance Charts</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <LineChart title={`Revenue Over Time (${reportType})`} data={revenueData} colorClass="text-green-500" gradientClass="text-green-500"/>
            <BarChart title={`Orders by Machine Type (${reportType})`} data={machineTypeCounts} colorClass="fill-current text-blue-500" />
       </div>
      </div>

       {/* Operational Overview Section */}
       <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b-2">Operational Overview (All Time)</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                 <div className="grid grid-cols-1 gap-6">
                    <StatCard title="Total Contacts" value={contacts.length.toString()} icon={<UsersIcon className="w-8 h-8 text-indigo-500"/>} colorClass="border-indigo-500" />
                    <StatCard title="Training Registrations" value={trainings.length.toString()} icon={<AcademicCapIcon className="w-8 h-8 text-purple-500"/>} colorClass="border-purple-500" />
                    <StatCard title="Received Letters" value={letters.length.toString()} icon={<EnvelopeIcon className="w-8 h-8 text-orange-500"/>} colorClass="border-orange-500" />
                </div>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                <BarChart title="Trainings by Type" data={trainingTypeCounts} colorClass="fill-current text-purple-500" />
                <BarChart title="Letters by Status" data={letterStatusCounts} colorClass="fill-current text-orange-500" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
