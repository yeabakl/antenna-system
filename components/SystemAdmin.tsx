
import React from 'react';
import { CheckCircleIcon, ShieldCheckIcon, ServerIcon, DatabaseIcon, BookOpenIcon, ChartBarIcon, LockClosedIcon, FolderIcon } from './icons';

const SystemAdmin = () => {
  return (
     <div className="container mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
        {/* Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">System Administration & Status Hub</h1>
            <p className="text-gray-500 mt-2">Operational status, governance, and resource management for Atenna AI.</p>
        </div>

        {/* 1. System Health & 2. Security (Combined Row) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* System Health */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-600">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <ServerIcon className="w-6 h-6 text-blue-600" /> System Health & Configuration
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 font-medium uppercase">Current Version</p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">Atenna 2.0</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 font-medium uppercase">Model Engine</p>
                        <p className="text-2xl font-bold text-indigo-600 mt-1">Gemini 1.5 Pro</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 font-medium uppercase">Context Window</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">1 Million Tokens</p>
                    </div>
                </div>
            </div>

            {/* Security Compliance */}
            <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-gray-800">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <ShieldCheckIcon className="w-6 h-6 text-gray-800" /> Data Governance
                </h2>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                        <LockClosedIcon className="w-5 h-5 text-red-600" />
                        <div>
                            <p className="font-bold text-red-700 text-sm">Internal Eyes Only</p>
                            <p className="text-xs text-red-600">Strict Access Control</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                        <CheckCircleIcon className="w-5 h-5 text-green-600" />
                        <div>
                            <p className="font-bold text-green-700 text-sm">PII Redaction Active</p>
                            <p className="text-xs text-green-600">Auto-anonymization</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
                        <div>
                            <p className="font-bold text-blue-700 text-sm">GDPR Compliant</p>
                            <p className="text-xs text-blue-600">EU Data Standards</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* 3. Usage Analytics */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <ChartBarIcon className="w-6 h-6 text-gray-600" /> Token Usage Dashboard
            </h2>
            <div className="overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Queries (Mo)</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Avg. Tokens/Query</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Est. Cost</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { dept: 'IT / Engineering', queries: 1200, tokens: '45k', cost: '$120.00', status: 'High' },
                            { dept: 'Marketing', queries: 500, tokens: '12k', cost: '$35.50', status: 'Normal' },
                            { dept: 'HR & Admin', queries: 300, tokens: '5k', cost: '$12.00', status: 'Low' },
                            { dept: 'Sales', queries: 850, tokens: '8k', cost: '$45.00', status: 'Normal' },
                        ].map((row, idx) => (
                            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="px-5 py-4 text-sm font-bold text-gray-800">{row.dept}</td>
                                <td className="px-5 py-4 text-sm text-gray-600">{row.queries}</td>
                                <td className="px-5 py-4 text-sm text-gray-600">{row.tokens}</td>
                                <td className="px-5 py-4 text-sm font-mono text-gray-800">{row.cost}</td>
                                <td className="px-5 py-4 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        row.status === 'High' ? 'bg-orange-100 text-orange-700' : 
                                        row.status === 'Low' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                    }`}>{row.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* 4. Documentation & Prompts */}
        <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <BookOpenIcon className="w-6 h-6 text-gray-600" /> Prompt Library & Guides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: 'How to Summarize PDFs', desc: 'Best practices for extracting key insights from long manufacturing reports.', color: 'bg-yellow-500' },
                    { title: 'How to Write Code', desc: 'Using Atenna to generate Python scripts for inventory automation.', color: 'bg-blue-500' },
                    { title: 'System Rules & Ethics', desc: 'Core directives governing AI behavior and output safety.', color: 'bg-red-500' },
                ].map((card, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                        <div className={`h-2 ${card.color}`}></div>
                        <div className="p-6">
                            <h3 className="font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{card.title}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{card.desc}</p>
                            <div className="mt-4 flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest group-hover:text-gray-800">
                                Read Guide <span className="ml-1">&rarr;</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* 5. Knowledge Map */}
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <DatabaseIcon className="w-6 h-6 text-gray-600" /> Data Source Visualization
                </h2>
                <span className="text-sm text-green-600 font-bold flex items-center bg-green-50 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span> Live Sync Active
                </span>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
                    {/* Central Brain */}
                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-blue-100">
                            <img src="https://www.gstatic.com/lamda/images/sparkle_resting_v2_darkmode_2bdb7df2724e450073ede.gif" alt="AI" className="w-16 h-16 opacity-80" /> 
                        </div>
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 font-bold text-gray-700 whitespace-nowrap">Atenna Core</div>
                    </div>

                    {/* Connections */}
                    <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                        {[
                            { name: 'Q3 Financials', type: 'Spreadsheet', status: 'Connected' },
                            { name: 'HR Policy', type: 'Document', status: 'Connected' },
                            { name: 'Legal Archive', type: 'Folder', status: 'Connected' },
                            { name: 'Inventory DB', type: 'Database', status: 'Syncing...' }
                        ].map((node, idx) => (
                            <div key={idx} className="flex flex-col items-center group">
                                <div className="w-16 h-16 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center mb-3 group-hover:border-blue-400 group-hover:shadow-md transition-all relative">
                                    <FolderIcon className="w-8 h-8 text-blue-300" />
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                </div>
                                <span className="text-xs font-bold text-gray-700">{node.name}</span>
                                <span className="text-[10px] text-gray-500">{node.type}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <p className="text-center text-gray-400 text-sm mt-8">Visual representation of currently mounted Knowledge Bases.</p>
            </div>
        </div>
     </div>
  );
};

export default SystemAdmin;
