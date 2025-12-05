import React, { useState, useEffect } from 'react';
import Home from './Home';
import Orders from './Orders';
import PendingOrders from './PendingOrders';
import History from './History';
import ReadyForCompletion from './ReadyForCompletion';

const OrdersPage: React.FC<{ defaultTab: string | null }> = ({ defaultTab }) => {
  const [activeTab, setActiveTab] = useState('manufacturing');

  useEffect(() => {
    const tabMap: { [key: string]: string } = {
      neworder: 'new',
      manufacturing: 'manufacturing',
      pending: 'pending',
      ready: 'ready',
      history: 'history',
    };
    if (defaultTab && tabMap[defaultTab]) {
      setActiveTab(tabMap[defaultTab]);
    } else {
      setActiveTab('manufacturing');
    }
  }, [defaultTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'new':
        return <Home />;
      case 'manufacturing':
        return <Orders />;
      case 'pending':
        return <PendingOrders />;
      case 'ready':
        return <ReadyForCompletion />;
      case 'history':
        return <History />;
      default:
        return <Orders />;
    }
  };

  const tabs = [
    { id: 'new', label: 'New Order' },
    { id: 'manufacturing', label: 'In Manufacturing' },
    { id: 'pending', label: 'Pending Delivery' },
    { id: 'ready', label: 'Ready for Completion' },
    { id: 'history', label: 'Completed History' },
  ];

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none`}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div>
        {renderContent()}
      </div>
    </div>
  );
};

export default OrdersPage;