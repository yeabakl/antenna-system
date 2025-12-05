import React from 'react';
import { CloseIcon } from './icons';

interface FilePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    fileDataUrl: string;
    fileName: string;
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({ isOpen, onClose, fileDataUrl, fileName }) => {
    if (!isOpen) return null;

    const isImage = fileDataUrl.startsWith('data:image/');
    const isPdf = fileDataUrl.startsWith('data:application/pdf');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-semibold text-gray-800 truncate pr-4">{fileName}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                        <CloseIcon className="w-6 h-6 text-gray-600" />
                    </button>
                </div>
                <div className="p-2 flex-grow overflow-auto bg-gray-100">
                    {isImage ? (
                        <div className="flex justify-center items-center h-full">
                           <img src={fileDataUrl} alt={fileName} className="max-w-full max-h-full object-contain" />
                        </div>
                    ) : isPdf ? (
                        <embed src={fileDataUrl} type="application/pdf" className="w-full h-full" />
                    ) : (
                        <div className="flex flex-col justify-center items-center h-full text-center text-gray-600 p-10">
                            <p className="mb-4">Preview is not available for this file type.</p>
                            <a href={fileDataUrl} download={fileName} className="inline-flex items-center gap-2 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                                Download File
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FilePreviewModal;
