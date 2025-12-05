
import React, { useRef } from 'react';
import { Training } from '../types';
import { CloseIcon, DownloadIcon } from './icons';

interface CertificateModalProps {
    isOpen: boolean;
    onClose: () => void;
    training: Training | null;
}

const CertificateModal: React.FC<CertificateModalProps> = ({ isOpen, onClose, training }) => {
    const certificateRef = useRef<HTMLDivElement>(null);

    if (!isOpen || !training) return null;

    const handlePrint = () => {
        const printContent = certificateRef.current;
        if (printContent) {
            const printWindow = window.open('', '', 'width=1123,height=794'); // A4 Landscape approx
            if (printWindow) {
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>Certificate - ${training.name}</title>
                            <script src="https://cdn.tailwindcss.com"></script>
                            <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Ethiopic:wght@400;700&display=swap" rel="stylesheet">
                            <style>
                                body { margin: 0; print-color-adjust: exact; -webkit-print-color-adjust: exact; font-family: 'Noto Serif Ethiopic', serif; }
                                @page { size: landscape; margin: 0; }
                            </style>
                        </head>
                        <body>
                            ${printContent.outerHTML}
                            <script>
                                setTimeout(() => { window.print(); window.close(); }, 500);
                            </script>
                        </body>
                    </html>
                `);
                printWindow.document.close();
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
             {/* Modal Container */}
             <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-semibold text-gray-800">Certificate Preview</h3>
                    <div className="flex gap-2">
                        <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                             <DownloadIcon className="w-5 h-5" /> Print / Save PDF
                        </button>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                            <CloseIcon className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>
                </div>
                
                <div className="p-8 overflow-auto bg-gray-100 flex justify-center">
                    {/* Certificate Area - A4 Landscape Ratio */}
                    <div ref={certificateRef} className="relative bg-white shadow-lg w-[1123px] h-[794px] flex-shrink-0 overflow-hidden text-gray-800" style={{ width: '1123px', height: '794px' }}>
                        
                        {/* Background Shapes - Layered Pentagons */}
                        <div className="absolute inset-0 z-0">
                            <svg width="100%" height="100%" viewBox="0 0 1123 794" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" style={{stopColor:'#EBF8FF', stopOpacity:1}} />
                                        <stop offset="100%" style={{stopColor:'#FFFFFF', stopOpacity:1}} />
                                    </linearGradient>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#grad1)" />
                                
                                {/* Pentagon Outline 1 (Outer) */}
                                <path d="M561 80 L1020 400 L870 730 L252 730 L102 400 Z" fill="none" stroke="#E2E8F0" strokeWidth="3" opacity="0.6" />
                                {/* Pentagon Outline 2 (Middle) */}
                                <path d="M561 130 L960 410 L830 690 L292 690 L162 410 Z" fill="none" stroke="#E2E8F0" strokeWidth="3" opacity="0.8" />
                                {/* Pentagon Outline 3 (Inner) */}
                                <path d="M561 180 L900 420 L790 650 L332 650 L222 420 Z" fill="none" stroke="#E2E8F0" strokeWidth="3" />
                                
                                {/* Decorative Corner Shapes */}
                                <path d="M0 0 L300 0 L150 150 L0 300 Z" fill="#2B6CB0" opacity="0.05" />
                                <path d="M1123 794 L823 794 L973 644 L1123 494 Z" fill="#2B6CB0" opacity="0.05" />
                            </svg>
                        </div>

                        {/* Border */}
                        <div className="absolute inset-4 border-2 border-gray-200 z-10 pointer-events-none"></div>
                        <div className="absolute inset-6 border border-blue-100 z-10 pointer-events-none"></div>

                        {/* Content */}
                        <div className="relative z-20 flex flex-col h-full items-center text-center py-16 px-24">
                            
                            {/* Top Badge */}
                            <div className="absolute top-16 right-20">
                                <div className="text-blue-800">
                                    <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" opacity="0.2"/>
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="none" stroke="currentColor" strokeWidth="1"/>
                                        <circle cx="12" cy="11" r="9" stroke="currentColor" strokeWidth="1" fill="none"/>
                                        <path d="M12 15 L12 22 M9 20 L12 22 L15 20" stroke="currentColor" strokeWidth="2" fill="none"/>
                                    </svg>
                                </div>
                            </div>

                            {/* Header */}
                            <h1 className="text-4xl font-bold text-gray-700 mb-2 font-serif tracking-wide uppercase border-b-2 border-blue-500 pb-2">
                                አንቴና ማኑፋክቸሪንግ እና ቢዝነስ አማካሪ
                            </h1>
                            <p className="text-gray-500 text-lg uppercase tracking-widest mb-12">Antenna Manufacturing & Business Consultancy</p>

                            {/* Certificate Title */}
                            <h2 className="text-5xl font-extrabold text-blue-900 mb-4">
                                የስልጠና የምስክር ወረቀት
                            </h2>
                            <h3 className="text-2xl font-light text-gray-500 mb-12 uppercase tracking-wider">
                                Certificate of Completion
                            </h3>

                            {/* Presentation Line */}
                            <p className="text-xl text-gray-600 mb-4">
                                ይህ የምስክር ወረቀት የተሰጠው ለ
                            </p>
                            
                            {/* Recipient Name */}
                            <div className="text-4xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2 min-w-[500px]">
                                {training.name}
                            </div>

                            {/* Description */}
                            <div className="max-w-3xl text-xl text-gray-600 leading-relaxed mb-16">
                                <p>
                                    የተባሉ ግለሰብ በድርጅታችን በ አንቴና ማኑፋክቸሪንግ እና ቢዝነስ አማካሪ የ
                                    <span className="font-bold text-blue-900 mx-2">{training.trainingType}</span>
                                    ስልጠና መውሰዳቸውን በዚህ ሰርተፍኬት ልናረጋግጥ እንወዳለን።
                                </p>
                                <p className="text-sm mt-4 text-gray-500 italic">
                                    This is to certify that the above mentioned individual has successfully completed the training course.
                                </p>
                            </div>

                            {/* Footer Signatures */}
                            <div className="flex justify-between w-full mt-auto px-12">
                                <div className="flex flex-col items-center">
                                    <div className="w-64 border-b border-gray-400 mb-2"></div>
                                    <p className="text-lg font-bold text-gray-700">ቸርነት ጥላሁን</p>
                                    <p className="text-sm text-gray-500">ዋና ስራ አስኪያጅ (General Manager)</p>
                                </div>

                                <div className="flex flex-col items-center">
                                     <div className="w-40 mb-4">
                                        {/* Optional Stamp Area */}
                                     </div>
                                </div>

                                <div className="flex flex-col items-center">
                                    <div className="w-64 border-b border-gray-400 mb-2"></div>
                                    <p className="text-lg font-bold text-gray-700">ዮሃንስ እሸቱ</p>
                                    <p className="text-sm text-gray-500">የስልጠና አስተባባሪ (Training Coordinator)</p>
                                </div>
                            </div>
                            
                            <div className="absolute bottom-6 text-gray-400 text-xs">
                                Date: {training.certificateIssueDate || new Date().toLocaleDateString()} | Cert ID: {training.certificateId || training.id}
                            </div>
                        </div>
                    </div>
                </div>
             </div>
        </div>
    );
};

export default CertificateModal;
