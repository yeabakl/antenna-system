import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { Letter } from '../types';
import { UploadIcon, FileIcon, FilePdfIcon, DownloadIcon } from './icons';
import FilePreviewModal from './FilePreviewModal';
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
                    <img src={fileData} alt="preview" className="w-full h-full object-cover" />
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

const Letters: React.FC = () => {
  const { letters, addLetter } = useContext(AppContext);

  const initialFormState: Omit<Letter, 'id' | 'status'> = {
    senderName: '',
    senderPhone: '',
    subject: '',
    dateReceived: '',
    letterFile: '',
    fileName: '',
    notes: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [fileName, setFileName] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData(prev => ({ ...prev, letterFile: result, fileName: file.name }));
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.senderName || !formData.subject || !formData.dateReceived || !formData.letterFile) {
      alert('Please fill out all required fields and upload the letter file.');
      return;
    }
    addLetter(formData);
    alert('Letter submitted successfully!');
    setFormData(initialFormState);
    setFileName('');
  };

  const handleViewFile = (letter: Letter) => {
    setSelectedLetter(letter);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setSelectedLetter(null);
  };
  
  const handleDownloadLetterPdf = (letter: Letter) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    addLetterheadToDoc(doc);
    const topMargin = 60;
    
    doc.setFontSize(20);
    doc.text(`Letter Summary - ${letter.subject}`, 14, topMargin - 28);

    const didDrawPage = (data: any) => {
        addLetterheadToDoc(data.doc);
    };

    doc.autoTable({
        startY: topMargin,
        head: [['Letter Details', '']],
        body: [
            ['Sender Name', letter.senderName],
            ['Sender Phone', letter.senderPhone],
            ['Subject', letter.subject],
            ['Date Received', letter.dateReceived],
            ['Status', letter.status],
            ['Notes', letter.notes || 'N/A'],
            ['Attached File', letter.fileName || 'N/A'],
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

    if(letter.letterFile) {
        yPos += 15;
        if(yPos > 250) { doc.addPage(); yPos = topMargin; }
        doc.setFontSize(16);
        doc.text('Attached Letter', 14, yPos);
        yPos += 10;
        addFileToPdf('', letter.letterFile, letter.fileName);
    }

    doc.save(`Letter-${letter.subject.replace(/\s/g, '_')}.pdf`);
  };

  return (
    <>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Submission Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Submit New Letter</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <InputField label="Sender's Name" name="senderName" value={formData.senderName} onChange={handleInputChange} required />
                <InputField label="Sender's Phone" name="senderPhone" type="tel" value={formData.senderPhone} onChange={handleInputChange} />
                <InputField label="Subject" name="subject" value={formData.subject} onChange={handleInputChange} required />
                <InputField label="Date Received" name="dateReceived" type="date" value={formData.dateReceived} onChange={handleInputChange} required InputLabelProps={{ shrink: true }} />

                <div>
                  <label className="block text-sm font-medium text-gray-700">Letter Document</label>
                  <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                          <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                              <label htmlFor="letterFile" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                              <span>Upload a file</span>
                              <input id="letterFile" name="letterFile" type="file" className="sr-only" onChange={handleFileChange} />
                              </label>
                          </div>
                          <p className="text-xs text-gray-500">{fileName || 'PDF, PNG, JPG up to 10MB'}</p>
                      </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
                  <textarea id="notes" name="notes" value={formData.notes || ''} onChange={handleInputChange} rows={3} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <div className="text-right">
                  <button type="submit" className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors">
                    Submit Letter
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Letters Table */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Received Letters</h2>
            <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
              <table className="min-w-full leading-normal">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sender</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date Received</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {letters.length > 0 ? letters.map(letter => (
                    <tr key={letter.id} className="hover:bg-gray-50">
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">{letter.senderName}</p>
                        <p className="text-gray-600 whitespace-no-wrap text-xs">{letter.senderPhone}</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">{letter.subject}</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">{letter.dateReceived}</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          letter.status === 'New' ? 'bg-blue-100 text-blue-800' :
                          letter.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {letter.status}
                        </span>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <div className="flex items-center gap-2">
                            <FileChip
                                fileData={letter.letterFile}
                                onView={() => handleViewFile(letter)}
                                label="View Letter"
                            />
                             <button onClick={() => handleDownloadLetterPdf(letter)} className="text-gray-500 hover:text-blue-600 p-1" title="Download Details">
                                <DownloadIcon className="w-5 h-5" />
                            </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5} className="text-center py-10 text-gray-500">No letters have been submitted yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <FilePreviewModal
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        fileDataUrl={selectedLetter?.letterFile || ''}
        fileName={selectedLetter?.fileName || ''}
      />
    </>
  );
};

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  required?: boolean;
  InputLabelProps?: object;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, type = 'text', required, InputLabelProps }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
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

export default Letters;
