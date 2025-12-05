
import React, { useState, createContext, useEffect } from 'react';
import { Order, Contact, Training, Letter, Task, Payment, Product } from './types';
import { sampleOrders, sampleHistory, sampleContacts, sampleTrainings, sampleLetters, sampleTasks, sampleProducts } from './data';

import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import OrdersPage from './components/OrdersPage';
import Contacts from './components/Contacts';
import TrainingComponent from './components/Training';
import Letters from './components/Letters';
import Tasks from './components/Tasks';
import Reports from './components/Reports';
import Products from './components/Products';
import SettingsModal from './components/SettingsModal';

interface AppContextType {
    orders: Order[];
    history: Order[];
    contacts: Contact[];
    trainings: Training[];
    letters: Letter[];
    tasks: Task[];
    products: Product[];
    machineTypes: string[];
    orderPrefill: Partial<Order> | null;
    trainingPrefill: string | null;
    activeSubPage: string | null;
    addOrder: (order: Omit<Order, 'id' | 'status' | 'paymentHistory' | 'restOfPaymentReceipt' | 'contractFile' | 'warrantyFile' | 'certificationFile'>) => void;
    updateOrder: (order: Order) => void;
    markAsReady: (orderId: string) => void;
    completeOrder: (orderId: string, restOfPaymentReceipt: string, contractFile: string, warrantyFile: string, certificationFile: string) => void;
    addContact: (contact: Omit<Contact, 'id'>) => void;
    updateContact: (contact: Contact) => void;
    deleteContact: (contactId: string) => void;
    addTraining: (training: Omit<Training, 'id' | 'status' | 'certificateFile'>) => void;
    completeTraining: (trainingId: string, certificateFile: string, issueDate?: string, certId?: string) => void;
    addLetter: (letter: Omit<Letter, 'id' | 'status'>) => void;
    addTask: (task: Omit<Task, 'id' | 'status'>) => void;
    updateTaskStatus: (taskId: string, newStatus: Task['status']) => void;
    addProduct: (product: Omit<Product, 'id'>) => void;
    updateProduct: (product: Product) => void;
    deleteProduct: (productId: string) => void;
    addMachineType: (type: string) => void;
    navigateTo: (page: string, subPage?: string) => void;
    setOrderPrefill: (data: Partial<Order> | null) => void;
    setTrainingPrefill: (courseName: string | null) => void;
}

export const AppContext = createContext<AppContextType>({
    orders: [],
    history: [],
    contacts: [],
    trainings: [],
    letters: [],
    tasks: [],
    products: [],
    machineTypes: [],
    orderPrefill: null,
    trainingPrefill: null,
    activeSubPage: null,
    addOrder: () => {},
    updateOrder: () => {},
    markAsReady: () => {},
    completeOrder: () => {},
    addContact: () => {},
    updateContact: () => {},
    deleteContact: () => {},
    addTraining: () => {},
    completeTraining: () => {},
    addLetter: () => {},
    addTask: () => {},
    updateTaskStatus: () => {},
    addProduct: () => {},
    updateProduct: () => {},
    deleteProduct: () => {},
    addMachineType: () => {},
    navigateTo: () => {},
    setOrderPrefill: () => {},
    setTrainingPrefill: () => {},
});

const App: React.FC = () => {
    const [page, setPage] = useState('home');
    const [subPage, setSubPage] = useState<string | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [orderPrefill, setOrderPrefill] = useState<Partial<Order> | null>(null);
    const [trainingPrefill, setTrainingPrefill] = useState<string | null>(null);

    // State management with localStorage persistence and sample data fallback
    const [orders, setOrders] = useState<Order[]>(() => {
        const saved = localStorage.getItem('orders');
        return saved ? JSON.parse(saved) : sampleOrders;
    });
    const [history, setHistory] = useState<Order[]>(() => {
        const saved = localStorage.getItem('history');
        return saved ? JSON.parse(saved) : sampleHistory;
    });
    const [contacts, setContacts] = useState<Contact[]>(() => {
        const saved = localStorage.getItem('contacts');
        if (saved) {
            // Migration: Ensure all contacts have a type
            const parsed = JSON.parse(saved);
            return parsed.map((c: any) => ({
                ...c,
                type: c.type || 'Customer'
            }));
        }
        return sampleContacts;
    });
     const [trainings, setTrainings] = useState<Training[]>(() => {
        const saved = localStorage.getItem('trainings');
        return saved ? JSON.parse(saved) : sampleTrainings;
    });
    const [letters, setLetters] = useState<Letter[]>(() => {
        const saved = localStorage.getItem('letters');
        return saved ? JSON.parse(saved) : sampleLetters;
    });
     const [tasks, setTasks] = useState<Task[]>(() => {
        const saved = localStorage.getItem('tasks');
        return saved ? JSON.parse(saved) : sampleTasks;
    });
    const [products, setProducts] = useState<Product[]>(() => {
        const saved = localStorage.getItem('products');
        return saved ? JSON.parse(saved) : sampleProducts;
    });

    const [machineTypes, setMachineTypes] = useState<string[]>(() => {
        const saved = localStorage.getItem('machineTypes');
        return saved ? JSON.parse(saved) : [
            'Bar Soap Machine',
            'Liquid Soap Machine',
            'Powder Soap Machine',
            'Detergent Paste Machine',
            'Soap Noodle Machine',
            'Plastic Crusher / Shredder',
            'Plastic Washing Machine',
            'Plastic Dryer Machine',
            'Animal Feed Chopper',
            'Animal Feed Mixer',
            'Animal Feed Pelletizer',
            'Alcohol Distiller',
            'Almond Crusher',
            'Milk Separator',
            'Corn Sheller',
            'Grain Mill',
            'Coffee Roaster',
            'Coffee Grinder',
            'Onion Crusher',
            'Oil Press Machine',
            'Bread Slicing Machine',
            'Washing Machine (Laundry)',
            'Carpet Dust Remover',
            'Carpet Washing Machine',
            'Carpet Dryer',
            'Terrazzo Making Machine',
            'Concrete Mixer',
            'Brick Making Machine',
            'Block Making Machine',
            'Gypsum Block Mold',
            'Gypsum Partition Machine',
            'Aggafar Making Machine',
            'Gold Washing Machine',
            'Wood Lathe Machine',
            'Paper Bag Making Machine',
            'Candle Making Machine',
            'Straw/Chaff Processing Machine'
        ];
    });

    // Persist state to localStorage on change
    useEffect(() => { localStorage.setItem('orders', JSON.stringify(orders)); }, [orders]);
    useEffect(() => { localStorage.setItem('history', JSON.stringify(history)); }, [history]);
    useEffect(() => { localStorage.setItem('contacts', JSON.stringify(contacts)); }, [contacts]);
    useEffect(() => { localStorage.setItem('trainings', JSON.stringify(trainings)); }, [trainings]);
    useEffect(() => { localStorage.setItem('letters', JSON.stringify(letters)); }, [letters]);
    useEffect(() => { localStorage.setItem('tasks', JSON.stringify(tasks)); }, [tasks]);
    useEffect(() => { localStorage.setItem('products', JSON.stringify(products)); }, [products]);
    useEffect(() => { localStorage.setItem('machineTypes', JSON.stringify(machineTypes)); }, [machineTypes]);
    
    // Notification Logic
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        const checkReminders = () => {
            if (!('Notification' in window) || Notification.permission !== 'granted') return;

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            tasks.forEach(task => {
                if (task.status === 'Done' || !task.reminder || task.reminder === 'none') return;

                // Parse YYYY-MM-DD explicitly to avoid timezone issues
                const [year, month, day] = task.dueDate.split('-').map(Number);
                const taskDate = new Date(year, month - 1, day);
                let reminderDate = new Date(taskDate);

                switch (task.reminder) {
                    case '1_day_before':
                        reminderDate.setDate(taskDate.getDate() - 1);
                        break;
                    case '2_days_before':
                        reminderDate.setDate(taskDate.getDate() - 2);
                        break;
                    case '1_week_before':
                        reminderDate.setDate(taskDate.getDate() - 7);
                        break;
                    case 'on_due_date':
                        // reminderDate is same as taskDate
                        break;
                    default:
                        return;
                }

                if (today.getTime() === reminderDate.getTime()) {
                    new Notification(`Task Reminder: ${task.title}`, {
                        body: `Due: ${task.dueDate}\nPriority: ${task.priority}\n${task.description || ''}`,
                        tag: task.id // Prevents duplicate notifications for the same task visual
                    });
                }
            });
        };

        checkReminders();
    }, [tasks]);

    // Context functions
    const addOrder = (orderData: Omit<Order, 'id' | 'status' | 'paymentHistory' | 'restOfPaymentReceipt' | 'contractFile' | 'warrantyFile' | 'certificationFile'>) => {
        const nextOrderNumber = orders.length + history.length + 1;
        const newOrderId = `ANN${String(nextOrderNumber).padStart(3, '0')}`;

        const newOrder: Order = {
            ...orderData,
            id: newOrderId,
            status: 'Pending',
            paymentHistory: [],
        };
        setOrders(prev => [...prev, newOrder]);
        navigateTo('orders', 'manufacturing'); // Navigate to manufacturing orders after creating one
    };

    const updateOrder = (updatedOrder: Order) => {
        setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    };
    
    const markAsReady = (orderId: string) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Ready for Completion' } : o));
    };

    const completeOrder = (orderId: string, restOfPaymentReceipt: string, contractFile: string, warrantyFile: string, certificationFile: string) => {
        const orderToComplete = orders.find(o => o.id === orderId);
        if (orderToComplete) {
            const completedOrder = { 
                ...orderToComplete, 
                status: 'Completed' as const, 
                restOfPaymentReceipt, 
                contractFile,
                warrantyFile,
                certificationFile
            };
            setHistory(prev => [...prev, completedOrder]);
            setOrders(prev => prev.filter(o => o.id !== orderId));
        }
    };
    
    const addContact = (contact: Omit<Contact, 'id'>) => {
        const newContact = { ...contact, id: Date.now().toString() };
        setContacts(prev => [...prev, newContact]);
    };
    
    const updateContact = (updatedContact: Contact) => {
        setContacts(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c));
    };

    const deleteContact = (contactId: string) => {
        setContacts(prev => prev.filter(c => c.id !== contactId));
    };
     const addTraining = (training: Omit<Training, 'id' | 'status' | 'certificateFile'>) => {
        const newTraining: Training = { ...training, id: Date.now().toString(), status: 'Ongoing' };
        setTrainings(prev => [...prev, newTraining]);
    };

    const completeTraining = (trainingId: string, certificateFile: string, issueDate?: string, certId?: string) => {
        setTrainings(prev => prev.map(t => 
            t.id === trainingId 
                ? { ...t, status: 'Completed', certificateFile, certificateIssueDate: issueDate, certificateId: certId } 
                : t
        ));
    };

    const addLetter = (letter: Omit<Letter, 'id' | 'status'>) => {
        const newLetter = { ...letter, id: Date.now().toString(), status: 'New' as const };
        setLetters(prev => [...prev, newLetter]);
    };

    const addTask = (task: Omit<Task, 'id' | 'status'>) => {
        const newTask = { ...task, id: Date.now().toString(), status: 'To Do' as const };
        setTasks(prev => [...prev, newTask]);
    };

    const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    };

    const addProduct = (product: Omit<Product, 'id'>) => {
        const newProduct = { ...product, id: Date.now().toString() };
        setProducts(prev => [...prev, newProduct]);
    };

    const updateProduct = (updatedProduct: Product) => {
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    };

    const deleteProduct = (productId: string) => {
        setProducts(prev => prev.filter(p => p.id !== productId));
    };
    
    const addMachineType = (type: string) => {
        if (type && !machineTypes.includes(type)) {
            setMachineTypes(prev => [...prev, type]);
        }
    };

    const navigateTo = (page: string, subPageParam?: string) => {
        setPage(page);
        setSubPage(subPageParam || null);
    };

    const renderPage = () => {
        switch(page) {
            case 'home': return <Dashboard />;
            case 'orders': return <OrdersPage defaultTab={subPage} />;
            case 'tasks': return <Tasks />;
            case 'contacts': return <Contacts />;
            case 'training': return <TrainingComponent />;
            case 'letters': return <Letters />;
            case 'reports': return <Reports />;
            case 'products': return <Products />;
            default: return <Dashboard />;
        }
    };

    const contextValue = {
        orders,
        history,
        contacts,
        trainings,
        letters,
        tasks,
        products,
        machineTypes,
        orderPrefill,
        trainingPrefill,
        activeSubPage: subPage,
        addOrder,
        updateOrder,
        markAsReady,
        completeOrder,
        addContact,
        updateContact,
        deleteContact,
        addTraining,
        completeTraining,
        addLetter,
        addTask,
        updateTaskStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        addMachineType,
        navigateTo,
        setOrderPrefill,
        setTrainingPrefill,
    };

    return (
        <AppContext.Provider value={contextValue}>
            <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
                <Header onNavigate={setPage} onOpenSettings={() => setIsSettingsOpen(true)} activePage={page} />
                <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
                    {renderPage()}
                </main>
                <Footer />
                <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
            </div>
        </AppContext.Provider>
    );
};

export default App;
