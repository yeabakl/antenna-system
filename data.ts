
import { Order, Contact, Training, Letter, Task, Product } from './types';

// --- Base64 Placeholder Data ---
// A simple 16x16 pixel placeholder image
const placeholderImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAHBJREFUOE+tkgsKgDAMQ5Vz/0t75GKhVAqZvDT30/s0gvBo8d3owhCRfASEa3Ikyu2QGYrQpYn0e2H2A0s/A1seA0seA8t9A8t9A8t9A8sNA8vFA8vVA8vVA8vFA8vFA8sNA8t1A8t1A8t9A8t9A0sfA8seA8t9A0sfA0seA8vFA0seA8vVA8vFA0uXA8vVA8sXgGz4A8xJgG1/AAAAAElFTkSuQmCC';

// A minimal, valid PDF file
const placeholderPdf = 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PC9UeXBlIC9QYWdlCi9QYXJlbnQgMyAwIFIKL1Jlc291cmNlcyAyIDAgUgovQ29udGVudHMgNCAwIFI+PgplbmRvYmoKNCAwIG9iago8PC9MZW5ndGggNTc+PgplbmRzdHJlYW0KeE4rVUhSc0tTSy9KVVLBQcoszU1J/lBQUjBScv1gdwEz/ACZKYEgC2VuZHN0cmVhbQplbmRvYmoKMiAwIG9iago8PC9Gb250IDw8L0YxIDExIDAgUj4+L1Byb2NTZXQgWy9QREYgL1RleHQgL0ltYWdlQiAvSW1hZ2VDIC9JbWFnZUldPj4KZW5kb2JqCjExIDAgb2JqCjw8L1R5cGUgL0ZvbnQvU3VidHlwZSAvVHlwZTEvQmFzZUZvbnQgL0hlbHZldGljYT4+CmVuZG9iagozIDAgb2JqCjw8L1R5cGUgL1BhZ2VzCi9LaWRzIFsxIDAgUl0KL0NvdW50IDEKL01lZGlhQm94IFswIDAgNTk1IDg0Ml0+PgplbmRvYmoKNSAwIG9iago8PC9UeXBlIC9DYXRhbG9nCi9QYWdlcyAzIDAgUj4+CmVuZG9iago2IDAgb2JqCjw8L1NyZWF0b3IgKEFudGVubmEpCi9Qcm9kdWNlciAoU2FtcGxlIFBERikKL0NyZWF0aW9uRGF0ZSAoRDoyMDI0MDcyNzEwMDAwMC0wNScwMCcpPj4KZW5kb2JqCnhyZWYKMCA3CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMTIzIDAwMDAwIG4gCjAwMDAwMDAyNjEgMDAwMDAgbiAKMDAwMDAwMDA2NiAwMDAwMCBuIAowMDAwMDAwMzM1IDAwMDAwIG4gCjAwMDAwMDAzODMgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDcKL1Jvb3QgNSAwIFIKL0luZm8gNiAwIFI+PgpzdGFydHhyZWYKNTAwCjUlRU9GCg==';

// --- Sample Data Arrays ---

export const sampleOrders: Order[] = [
  {
    id: 'ANN001',
    customerFirstName: 'John',
    customerFatherName: 'Doe',
    customerGrandfatherName: 'Smith',
    machineType: 'Bar Soap Machine',
    phone1: '123-456-7890',
    machinePrice: 150000,
    prepayment: 75000,
    prepaymentReceipt: placeholderImage,
    paymentHistory: [{ amount: 25000, date: '2024-07-20' }],
    deliveryDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0], // Due in 5 days
    paymentDate: '2024-08-20',
    description: 'Standard bar soap line with custom cutter.',
    salesperson: 'Abebe Kebede',
    machineImage: placeholderImage,
    customerIdCard: placeholderPdf,
    status: 'Pending',
  },
  {
    id: 'ANN002',
    customerFirstName: 'Jane',
    customerFatherName: 'Roe',
    customerGrandfatherName: 'Miller',
    machineType: 'Plastic Crusher / Shredder',
    phone1: '987-654-3210',
    phone2: '987-654-3211',
    machinePrice: 220000,
    prepayment: 100000,
    paymentHistory: [],
    deliveryDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0], // Overdue by 2 days
    paymentDate: '2024-09-01',
    description: 'Heavy duty crusher.',
    salesperson: 'Chala Muhe',
    status: 'Pending',
  }
];

export const sampleHistory: Order[] = [
  {
    id: 'ANN004',
    customerFirstName: 'Emily',
    customerFatherName: 'Jones',
    customerGrandfatherName: 'Brown',
    machineType: 'Brick Making Machine',
    phone1: '321-654-9870',
    machinePrice: 310000,
    prepayment: 150000,
    paymentHistory: [{ amount: 160000, date: '2024-06-15' }],
    deliveryDate: '2024-07-01',
    paymentDate: '2024-06-15',
    description: 'Manual brick making machine.',
    salesperson: 'Abebe Kebede',
    machineImage: placeholderImage,
    customerIdCard: placeholderPdf,
    prepaymentReceipt: placeholderImage,
    status: 'Completed',
    restOfPaymentReceipt: placeholderImage,
    contractFile: placeholderPdf,
    warrantyFile: placeholderPdf,
    certificationFile: placeholderPdf,
  }
];

export const sampleContacts: Contact[] = [
  { id: 'c1', name: 'Potential Client A', phone: '111-222-3333', productInterest: 'Soap machines', description: 'Follow up next week.', address: '123 Main St, Addis Ababa', type: 'Lead', leadStatus: 'New' },
  { id: 'c2', name: 'Supplier B', phone: '444-555-6666', productInterest: 'Raw Materials', description: 'Contact for new plastic pellet prices.', address: '456 Industrial Zone', type: 'Customer' },
];

export const sampleTrainings: Training[] = [
  {
    id: 't1',
    name: 'Alice Johnson',
    phone: '222-333-4444',
    trainingType: 'Machine Operation',
    payment: 'Paid',
    paymentReceipt: placeholderImage,
    status: 'Ongoing',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString().split('T')[0],
  }
];

export const sampleLetters: Letter[] = [
  {
    id: 'l1',
    senderName: 'City Administration Office',
    senderPhone: '011-555-1234',
    subject: 'Business License Renewal',
    dateReceived: '2024-07-15',
    letterFile: placeholderPdf,
    fileName: 'License_Renewal_Notice.pdf',
    status: 'New',
    notes: 'Action required before end of month.',
  }
];

export const sampleTasks: Task[] = [
  {
    id: 'task1',
    title: 'Follow up with John Doe on payment',
    description: 'Call John Doe to remind him about the upcoming final payment.',
    assignee: 'Sales Team',
    department: 'Sales',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0],
    priority: 'High',
    status: 'To Do',
    reminder: '1_day_before',
  }
];

export const sampleProducts: Product[] = [
    // --- Soap & detergent Production ---
    {
        id: 'p1-a',
        itemGroup: 'Bar Soap Machine',
        name: 'Bar Soap Machine (Standard)',
        model: 'BSM-100',
        shortDescription: 'Standard line for solid soap production (100kg/hr).',
        fullDescription: 'Our Standard Bar Soap Machine sets the standard for solid soap production. This comprehensive unit includes a high-capacity mixer to blend ingredients thoroughly and a powerful plodder to extrude the soap into continuous bars. Ideal for small enterprises.',
        category: 'Soap & detergent Production',
        sector: 'Machine Manufacturing',
        price: 250000,
        images: [placeholderImage, placeholderImage, placeholderImage], // Added multiple images for gallery demo
        catalogFileName: 'Bar_Soap_Standard.pdf',
        features: ['Stainless steel mixer', 'Adjustable extrusion speed', 'Manual Cutter'],
        specifications: [{ label: 'Capacity', value: '100 kg/hr' }, { label: 'Power', value: '380V 3-Phase' }],
        useCases: ['Laundry Soap', 'Bath Soap'],
        troubleshooting: 'Check belts if extrusion is uneven.'
    },
    {
        id: 'p1-b',
        itemGroup: 'Bar Soap Machine',
        name: 'Bar Soap Machine (Industrial)',
        model: 'BSM-500',
        shortDescription: 'High capacity line for mass production (500kg/hr).',
        fullDescription: 'The Industrial Bar Soap Machine is designed for large scale factories. Features a double-stage plodder and automated stamping machine.',
        category: 'Soap & detergent Production',
        sector: 'Machine Manufacturing',
        price: 550000,
        images: [placeholderImage, placeholderImage],
        catalogFileName: 'Bar_Soap_Industrial.pdf',
        features: ['Double vacuum plodder', 'Automated Stamping', 'Water Cooling System'],
        specifications: [{ label: 'Capacity', value: '500 kg/hr' }, { label: 'Power', value: '15kW' }],
        useCases: ['Commercial Laundry Soap', 'Hotel Soap'],
        troubleshooting: 'Ensure cooling water is circulating.'
    },
    {
        id: 'p2',
        itemGroup: 'Liquid Soap Machine',
        name: 'Liquid Soap Mixer',
        model: 'LSM-500',
        shortDescription: 'High-speed mixer for liquid detergents and soaps.',
        fullDescription: 'This machine is specialized for mixing liquid detergents, hand soaps, and dishwashing liquids. The tank is made of 304 grade stainless steel to prevent corrosion and ensure hygiene.',
        category: 'Soap & detergent Production',
        sector: 'Machine Manufacturing',
        price: 120000,
        images: [],
        catalogFileName: 'Liquid_Soap_Catalog.pdf',
        features: ['Variable speed motor', 'Anti-corrosion tank', 'Easy discharge valve'],
        specifications: [{ label: 'Volume', value: '500 Liters' }, { label: 'Motor', value: '3kW' }],
        useCases: ['Dishwashing Liquid', 'Hand Soap', 'Shampoo'],
        troubleshooting: 'Ensure proper grounding.'
    },
     {
        id: 'p3',
        itemGroup: 'Powder Soap Machine',
        name: 'Powder Soap Mixer',
        model: 'PSM-300',
        shortDescription: 'Mixer and blender for powder detergent production.',
        fullDescription: 'Efficiently mixes chemical powders to create high-quality detergent powder. Includes a dust-free discharge system.',
        category: 'Soap & detergent Production',
        sector: 'Machine Manufacturing',
        price: 180000,
        images: [],
        features: ['Dust containment', 'Homogeneous mixing'],
        specifications: [{ label: 'Capacity', value: '300 kg/batch' }],
        useCases: ['Laundry Powder'],
        troubleshooting: ''
    },
    {
        id: 'p4',
        itemGroup: 'Detergent Paste Machine',
        name: 'Detergent Paste Mixer',
        model: 'DPM-200',
        shortDescription: 'Heavy duty mixer for high viscosity pastes.',
        fullDescription: 'Designed to handle the high resistance of detergent paste, ensuring a smooth and uniform product.',
        category: 'Soap & detergent Production',
        sector: 'Machine Manufacturing',
        price: 200000,
        images: [],
        features: ['High torque motor', 'Reinforced paddles'],
        specifications: [{ label: 'Capacity', value: '200 kg/batch' }],
        useCases: ['Cleaning Pastes'],
        troubleshooting: ''
    },
    {
        id: 'p5',
        itemGroup: 'Soap Noodle Machine',
        name: 'Soap Noodle Plant',
        model: 'SNM-500',
        shortDescription: 'Production line for creating soap noodles from raw oils.',
        fullDescription: 'The foundational machine for soap making, converting oils and caustic soda into soap noodles.',
        category: 'Soap & detergent Production',
        sector: 'Machine Manufacturing',
        price: 450000,
        images: [],
        features: ['Vacuum drying', 'Automated finishing'],
        specifications: [{ label: 'Output', value: '500 kg/hr' }],
        useCases: ['Raw Material Production'],
        troubleshooting: ''
    },

    // --- Plastic Processing Machines ---
    {
        id: 'p6',
        itemGroup: 'Plastic Crusher',
        name: 'Plastic Crusher / Shredder',
        model: 'PCS-1500',
        shortDescription: 'Powerful shredder for recycling plastic waste.',
        fullDescription: 'Crushes bottles, containers, and other plastic waste into small flakes suitable for recycling or melting.',
        category: 'Plastic Processing Machines',
        sector: 'Machine Manufacturing',
        price: 160000,
        images: [],
        features: ['Hardened steel blades', 'Safety hopper'],
        specifications: [{ label: 'Blade Speed', value: '1500 RPM' }, { label: 'Input Size', value: 'Max 30cm' }],
        useCases: ['Recycling Centers', 'Plastic Manufacturing'],
        troubleshooting: 'Sharpen blades regularly.'
    },
    {
        id: 'p7',
        itemGroup: 'Plastic Washing Machine',
        name: 'Plastic Friction Washer',
        model: 'PWM-5KW',
        shortDescription: 'Friction washer for cleaning plastic flakes.',
        fullDescription: 'Removes dirt, labels, and glue from plastic flakes after crushing.',
        category: 'Plastic Processing Machines',
        sector: 'Machine Manufacturing',
        price: 140000,
        images: [],
        features: ['High speed friction', 'Water recycling option'],
        specifications: [{ label: 'Motor', value: '5kW' }],
        useCases: ['Recycling'],
        troubleshooting: ''
    },
    {
        id: 'p8',
        itemGroup: 'Plastic Dryer',
        name: 'Centrifugal Plastic Dryer',
        model: 'PDM-100',
        shortDescription: 'Centrifugal dryer for plastic flakes.',
        fullDescription: 'Rapidly dries washed plastic flakes to prepare them for pelletizing.',
        category: 'Plastic Processing Machines',
        sector: 'Machine Manufacturing',
        price: 130000,
        images: [],
        features: ['Stainless steel screen', 'High RPM'],
        specifications: [{ label: 'Moisture Content', value: '<1%' }],
        useCases: ['Recycling'],
        troubleshooting: ''
    },

    // --- Food & Agro-Processing Machines ---
    {
        id: 'p9',
        itemGroup: 'Animal Feed Chopper',
        name: 'Standard Feed Chopper',
        model: 'AFC-500',
        shortDescription: 'Chops grass and straw for animal feed.',
        fullDescription: 'Essential for preparing fodder for cattle and other livestock.',
        category: 'Food & Agro-Processing Machines',
        sector: 'Machine Manufacturing',
        price: 45000,
        images: [],
        features: ['Safety guard', 'Portable'],
        specifications: [{ label: 'Capacity', value: '500 kg/hr' }],
        useCases: ['Farms'],
        troubleshooting: ''
    },
    {
        id: 'p10',
        itemGroup: 'Animal Feed Mixer',
        name: 'Vertical Feed Mixer',
        model: 'AFM-1000',
        shortDescription: 'Mixes various grains and nutrients.',
        fullDescription: 'Ensures a uniform blend of feed ingredients for optimal animal nutrition.',
        category: 'Food & Agro-Processing Machines',
        sector: 'Machine Manufacturing',
        price: 70000,
        images: [],
        features: ['Vertical mixing', 'Timer'],
        specifications: [{ label: 'Volume', value: '1000 Liters' }],
        useCases: ['Feed Production'],
        troubleshooting: ''
    },
    {
        id: 'p11-a',
        itemGroup: 'Animal Feed Pelletizer',
        name: 'Feed Pelletizer (Small)',
        model: 'AFP-S',
        shortDescription: 'Small scale pelletizer for farm use.',
        fullDescription: 'Produces dense feed pellets suitable for poultry and small livestock.',
        category: 'Food & Agro-Processing Machines',
        sector: 'Machine Manufacturing',
        price: 95000,
        images: [],
        features: ['Interchangeable dies', 'Compact design'],
        specifications: [{ label: 'Pellet Size', value: '2mm - 6mm' }, { label: 'Capacity', value: '100 kg/hr' }],
        useCases: ['Small Farms'],
        troubleshooting: ''
    },
    {
        id: 'p11-b',
        itemGroup: 'Animal Feed Pelletizer',
        name: 'Feed Pelletizer (Commercial)',
        model: 'AFP-L',
        shortDescription: 'Large scale pelletizer for commercial production.',
        fullDescription: 'Heavy duty machine with ring die technology for continuous production.',
        category: 'Food & Agro-Processing Machines',
        sector: 'Machine Manufacturing',
        price: 250000,
        images: [],
        features: ['Ring Die', 'Steam Conditioner Option'],
        specifications: [{ label: 'Pellet Size', value: '2mm - 10mm' }, { label: 'Capacity', value: '1 Ton/hr' }],
        useCases: ['Feed Mills'],
        troubleshooting: ''
    },
    {
        id: 'p12',
        itemGroup: 'Alcohol Distiller',
        name: 'Araki Distillation Unit',
        model: 'AD-100',
        shortDescription: 'Modern distillation unit for traditional Araki.',
        fullDescription: 'Improves the efficiency and hygiene of traditional alcohol production.',
        category: 'Food & Agro-Processing Machines',
        sector: 'Machine Manufacturing',
        price: 85000,
        images: [],
        features: ['Copper condenser', 'Temperature gauge'],
        specifications: [{ label: 'Boiler Capacity', value: '100 Liters' }],
        useCases: ['Beverage Production'],
        troubleshooting: ''
    },
    {
        id: 'p13',
        itemGroup: 'Grain Mill',
        name: 'Universal Grain Mill',
        model: 'GM-7.5',
        shortDescription: 'Versatile grinder for teff, wheat, and corn.',
        fullDescription: 'A staple machine for milling various grains into flour.',
        category: 'Food & Agro-Processing Machines',
        sector: 'Machine Manufacturing',
        price: 55000,
        images: [],
        features: ['Adjustable fineness', 'Heavy duty stones'],
        specifications: [{ label: 'Power', value: '7.5 kW' }],
        useCases: ['Flour Mills'],
        troubleshooting: ''
    },
    {
        id: 'p14',
        itemGroup: 'Coffee Roaster',
        name: 'Electric Coffee Roaster',
        model: 'CR-5',
        shortDescription: 'Precision roasting for coffee beans.',
        fullDescription: 'Electric or gas-powered roaster with temperature control.',
        category: 'Food & Agro-Processing Machines',
        sector: 'Machine Manufacturing',
        price: 110000,
        images: [],
        features: ['Drum roaster', 'Cooling tray'],
        specifications: [{ label: 'Batch Size', value: '5 kg' }],
        useCases: ['Cafes', 'Roasteries'],
        troubleshooting: ''
    },
     {
        id: 'p15',
        itemGroup: 'Oil Press',
        name: 'Screw Oil Press',
        model: 'OP-50',
        shortDescription: 'Extracts oil from seeds like sesame and peanut.',
        fullDescription: 'Screw press mechanism for high yield oil extraction.',
        category: 'Food & Agro-Processing Machines',
        sector: 'Machine Manufacturing',
        price: 180000,
        images: [],
        features: ['Temperature control', 'Filter included'],
        specifications: [{ label: 'Rate', value: '50 kg/hr' }],
        useCases: ['Edible Oil Production'],
        troubleshooting: ''
    },

    // --- Cleaning & Household Equipment ---
    {
        id: 'p16',
        itemGroup: 'Washing Machine',
        name: 'Industrial Washer Extractor',
        model: 'WM-25',
        shortDescription: 'Industrial laundry machine for hotels and hospitals.',
        fullDescription: 'Heavy-duty washer extractor.',
        category: 'Cleaning & Household Equipment',
        sector: 'Machine Manufacturing',
        price: 280000,
        images: [],
        features: ['Programmable cycles', 'High G-force extraction'],
        specifications: [{ label: 'Capacity', value: '25 kg' }],
        useCases: ['Hotels', 'Hospitals', 'Laundromats'],
        troubleshooting: ''
    },
    {
        id: 'p17',
        itemGroup: 'Carpet Washer',
        name: 'Auto Carpet Washer',
        model: 'CW-250',
        shortDescription: 'Automated carpet cleaner.',
        fullDescription: 'Scrubs and rinses carpets efficiently.',
        category: 'Cleaning & Household Equipment',
        sector: 'Machine Manufacturing',
        price: 150000,
        images: [],
        features: ['Multiple brushes', 'Adjustable pressure'],
        specifications: [{ label: 'Width', value: '2.5 meters' }],
        useCases: ['Cleaning Services'],
        troubleshooting: ''
    },

    // --- Construction & Building Materials Machines ---
    {
        id: 'p18',
        itemGroup: 'Block Machine',
        name: 'Vibrating Block Machine',
        model: 'BM-V1',
        shortDescription: 'Vibrating table for hollow block production.',
        fullDescription: 'Robust machine for manufacturing concrete blocks.',
        category: 'Construction & Building Materials Machines',
        sector: 'Machine Manufacturing',
        price: 90000,
        images: [],
        features: ['Interchangeable molds', 'Vibration motor'],
        specifications: [{ label: 'Cycle Time', value: '45 seconds' }],
        useCases: ['Construction Sites'],
        troubleshooting: ''
    },
    {
        id: 'p19',
        itemGroup: 'Concrete Mixer',
        name: 'Portable Concrete Mixer',
        model: 'CM-350',
        shortDescription: 'Portable concrete mixer.',
        fullDescription: 'Standard mixer for preparing concrete on site.',
        category: 'Construction & Building Materials Machines',
        sector: 'Machine Manufacturing',
        price: 65000,
        images: [],
        features: ['Diesel or Electric option', 'Tilt drum'],
        specifications: [{ label: 'Volume', value: '350 Liters' }],
        useCases: ['Construction'],
        troubleshooting: ''
    },
    {
        id: 'p20',
        itemGroup: 'Terrazzo Machine',
        name: 'Terrazzo Tile Press',
        model: 'TM-150',
        shortDescription: 'Grinding and polishing machine for tiles.',
        fullDescription: 'Produces high quality terrazzo tiles.',
        category: 'Construction & Building Materials Machines',
        sector: 'Machine Manufacturing',
        price: 120000,
        images: [],
        features: ['High pressure', 'Polishing heads'],
        specifications: [{ label: 'Pressure', value: '150 Tons' }],
        useCases: ['Tile Manufacturing'],
        troubleshooting: ''
    },

    // --- Packaging Materials Machines ---
    {
        id: 'p21',
        itemGroup: 'Paper Bag Machine',
        name: 'Auto Paper Bag Maker',
        model: 'PBM-100',
        shortDescription: 'Automated line for paper bags.',
        fullDescription: 'Produces various sizes of paper bags for groceries and cement.',
        category: 'Packaging Materials Machines',
        sector: 'Machine Manufacturing',
        price: 350000,
        images: [],
        features: ['Printing unit', 'Auto-folding'],
        specifications: [{ label: 'Speed', value: '100 bags/min' }],
        useCases: ['Packaging'],
        troubleshooting: ''
    },

    // --- Candle & Straw/Chaff ---
    {
        id: 'p22',
        itemGroup: 'Candle Machine',
        name: 'Candle Molding Machine',
        model: 'CMM-200',
        shortDescription: 'Molding machine for household candles.',
        fullDescription: 'Water-cooled molding system for fast production.',
        category: 'Candle & Straw/Chaff',
        sector: 'Machine Manufacturing',
        price: 60000,
        images: [],
        features: ['Copper molds', 'Quick ejection'],
        specifications: [{ label: 'Output', value: '200 candles/cycle' }],
        useCases: ['Candle Production'],
        troubleshooting: ''
    },
    {
        id: 'p23',
        itemGroup: 'Straw Processor',
        name: 'Straw/Chaff Cutter',
        model: 'SCC-400',
        shortDescription: 'Processes straw for fuel or feed.',
        fullDescription: 'Chops and compresses straw.',
        category: 'Candle & Straw/Chaff',
        sector: 'Machine Manufacturing',
        price: 50000,
        images: [],
        features: ['Durable blades'],
        specifications: [{ label: 'Capacity', value: '400 kg/hr' }],
        useCases: ['Fuel Production', 'Feed'],
        troubleshooting: ''
    },

    // --- Raw Material Supply Samples ---
    {
        id: 'rm1',
        itemGroup: 'Caustic Soda',
        name: 'Caustic Soda Flakes',
        model: 'CSF-99',
        shortDescription: 'High purity sodium hydroxide for soap making.',
        fullDescription: 'Essential raw material for saponification in soap and detergent manufacturing.',
        category: 'Chemicals',
        sector: 'Raw Material Supply',
        price: 1500,
        images: [],
        features: ['99% Purity', 'Industrial Grade'],
        specifications: [{label: 'Pack Size', value: '25kg Bag'}],
        useCases: ['Soap Production'],
        troubleshooting: ''
    },
    {
        id: 'rm2',
        itemGroup: 'Plastic Pellets',
        name: 'HDPE Pellets',
        model: 'HDPE-REC',
        shortDescription: 'Recycled HDPE pellets for plastic manufacturing.',
        fullDescription: 'High density polyethylene pellets suitable for injection molding and extrusion.',
        category: 'Plastics',
        sector: 'Raw Material Supply',
        price: 120,
        images: [],
        features: ['Washed', 'Uniform Size'],
        specifications: [{label: 'Melt Index', value: '0.3 - 0.7'}],
        useCases: ['Plastic Manufacturing'],
        troubleshooting: ''
    },

    // --- Machinery Import Samples ---
    {
        id: 'imp1',
        itemGroup: 'CNC Router',
        name: 'Industrial CNC Router',
        model: 'CNC-3A',
        shortDescription: 'High precision woodworking machine.',
        fullDescription: 'Imported 3-axis CNC router for furniture and cabinetry.',
        category: 'Woodworking',
        sector: 'Machinery Import',
        price: 850000,
        images: [],
        features: ['Vacuum table', 'DSP Controller'],
        specifications: [{label: 'Working Area', value: '1300x2500mm'}],
        useCases: ['Furniture'],
        troubleshooting: ''
    },

    // --- Consultancy Samples ---
    {
        id: 'cons1',
        itemGroup: 'Feasibility Study',
        name: 'Feasibility Study Service',
        model: 'FS-STD',
        shortDescription: 'Comprehensive business plan and market analysis.',
        fullDescription: 'We provide detailed feasibility studies for new manufacturing plants.',
        category: 'Business Planning',
        sector: 'Business Consultancy',
        price: 15000,
        images: [],
        features: ['Market Research', 'Financial Projection'],
        specifications: [{label: 'Duration', value: '2 Weeks'}],
        useCases: ['Startups'],
        troubleshooting: ''
    },

    // --- Training Courses ---
    {
        id: 'tr1',
        itemGroup: 'Bar Soap Training',
        name: 'Bar Soap Production Training',
        model: 'TR-BSP',
        shortDescription: 'Learn the art and science of making bar soap.',
        fullDescription: 'A comprehensive 5-day course covering raw material selection, saponification process, molding, and cutting. Includes practical sessions with our standard bar soap machines.',
        category: 'Vocational Courses',
        sector: 'Training',
        price: 5000,
        images: [],
        trainingManual: placeholderPdf, // Added manual
        features: ['Practical Demonstration', 'Safety Protocols', 'Certificate of Completion'],
        specifications: [{label: 'Duration', value: '5 Days'}, {label: 'Level', value: 'Beginner'}],
        useCases: ['Entrepreneurs', 'Factory Workers'],
        troubleshooting: ''
    },
    {
        id: 'tr2',
        itemGroup: 'Liquid Soap Training',
        name: 'Liquid Detergent Manufacturing',
        model: 'TR-LSM',
        shortDescription: 'Master the formulation of liquid soaps and detergents.',
        fullDescription: 'Learn to formulate dishwashing liquid, hand soap, and multipurpose cleaners. Focuses on chemical ratios, mixing techniques, and pH balancing.',
        category: 'Vocational Courses',
        sector: 'Training',
        price: 4000,
        images: [],
        trainingManual: placeholderPdf, // Added manual
        features: ['Formulation Guides', 'Chemical Handling', 'Certificate'],
        specifications: [{label: 'Duration', value: '3 Days'}, {label: 'Level', value: 'Beginner'}],
        useCases: ['Small Business Startups'],
        troubleshooting: ''
    },
    {
        id: 'tr3',
        itemGroup: 'Machine Operation',
        name: 'Machine Operation & Maintenance',
        model: 'TR-MOM',
        shortDescription: 'Technical training for machine operators.',
        fullDescription: 'Hands-on training for operating, cleaning, and basic maintenance of industrial soap and plastic processing machines.',
        category: 'Vocational Courses',
        sector: 'Training',
        price: 6000,
        images: [],
        trainingManual: placeholderPdf, // Added manual
        features: ['On-site Training', 'Maintenance Manuals', 'Safety Certification'],
        specifications: [{label: 'Duration', value: '1 Week'}, {label: 'Level', value: 'Intermediate'}],
        useCases: ['Factory Technicians'],
        troubleshooting: ''
    },
    {
        id: 'tr4',
        itemGroup: 'Fiberglass Training',
        name: 'Fiberglass Production Training',
        model: 'TR-FGP',
        shortDescription: 'Techniques for mold making and fiberglass layering.',
        fullDescription: 'Learn to create fiberglass products like water tanks, chairs, and car parts. Covers resin mixing, mat application, and finishing.',
        category: 'Vocational Courses',
        sector: 'Training',
        price: 7000,
        images: [],
        trainingManual: placeholderPdf, // Added manual
        features: ['Mold Making', 'Safety Gear Usage', 'Certificate'],
        specifications: [{label: 'Duration', value: '2 Weeks'}, {label: 'Level', value: 'Advanced'}],
        useCases: ['Manufacturing'],
        troubleshooting: ''
    },
    {
        id: 'tr5',
        itemGroup: 'Paper Bag Training',
        name: 'Paper Bag Production',
        model: 'TR-PBP',
        shortDescription: 'Training on operating paper bag making machines.',
        fullDescription: 'Operational training for paper bag machinery, including paper selection, glue application, and printing setup.',
        category: 'Vocational Courses',
        sector: 'Training',
        price: 4500,
        images: [],
        trainingManual: placeholderPdf, // Added manual
        features: ['Machine Setup', 'Quality Control', 'Certificate'],
        specifications: [{label: 'Duration', value: '4 Days'}, {label: 'Level', value: 'Beginner'}],
        useCases: ['Packaging Business'],
        troubleshooting: ''
    }
];
