import React, { useState, useMemo, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { 
  LayoutDashboard, Users, ClipboardList, Flame, 
  Droplets, DollarSign, AlertCircle, 
  Plus, CheckCircle, Trash2, Settings, BarChart3, PieChart, Search, Cloud, ChevronRight, Minus, LogOut, Lock, TrendingUp, TrendingDown, Store, ArrowUpCircle, ArrowDownCircle, MapPin, UserCheck, Package, ShoppingCart, ShoppingBag
} from 'lucide-react';

// ==========================================================
// 🚀 CREDENCIALES OFICIALES - PROYECTO: LAVOS-13433
// ==========================================================
const firebaseConfig = {
  apiKey: "AIzaSyCuNedhnzspVDSqwmv09fSjodUDgHS95-I",
  authDomain: "lavos-13433.firebaseapp.com",
  projectId: "lavos-13433",
  storageBucket: "lavos-13433.firebasestorage.app",
  messagingSenderId: "526488470697",
  appId: "1:526488470697:web:c459b2753849cf8f2f95b8",
  measurementId: "G-15K0XKNEHM"
};

// 🛡️ PARCHE ANTICHOQUE
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storeId = "sucursal_morales_1"; 

// --- UTILIDADES ---
const getLocalDateString = (d = new Date()) => {
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().split('T')[0];
};

const formatMoney = (amount: number) => {
  return amount.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const vibrate = () => { 
  try { if (typeof window !== 'undefined' && navigator && navigator.vibrate) navigator.vibrate(40); } 
  catch (e) {} 
};

// ==========================================================
// NÚCLEO DEL SISTEMA
// ==========================================================
function LavOSMain() {
  // --- ESTADOS NUBE ---
  const [currentUser, setCurrentUser] = useState<any>(null); 
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [loginPin, setLoginPin] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('panel');
  const [isCloudReady, setIsCloudReady] = useState(false);
  const [cloudError, setCloudError] = useState(false);

  // --- DATOS MAESTROS ---
  const [_clients, _setClients] = useState<any[]>([]);
  const [_servicesConfig, _setServicesConfig] = useState<any[]>([]);
  const [_orders, _setOrders] = useState<any[]>([]);
  const [_dryers, _setDryers] = useState<any[]>([]); // NUEVO ESTADO SECADORAS
  const [_gasCylinders, _setGasCylinders] = useState<any[]>([]);
  const [_supplies, _setSupplies] = useState<any[]>([]);
  const [_employees, _setEmployees] = useState<any[]>([]);
  const [_transactions, _setTransactions] = useState<any[]>([]);
  const [_txCategories, _setTxCategories] = useState({ in: ['Venta Producto', 'Otros Ingresos'], out: ['Insumos', 'Mantenimiento', 'Planilla', 'Luz / Agua', 'Otros'] });
  const [_pins, _setPins] = useState({ admin: '1234', employee: '0000' });

  // --- AUTH ---
  useEffect(() => {
    const initAuth = async () => { try { await signInAnonymously(auth); } catch (e) { setCloudError(true); setIsCloudReady(true); } };
    initAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) setCloudError(false); else { setCloudError(true); setIsCloudReady(true); }
    });
    return () => unsub();
  }, []);

  // --- SYNC ---
  useEffect(() => {
    if (!db || !firebaseUser) return;
    const docRef = doc(db, 'negocios', storeId, 'datos', 'estado_maestro');
    const unsub = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.clients) _setClients(data.clients);
        if (data.servicesConfig) _setServicesConfig(data.servicesConfig);
        if (data.orders) _setOrders(data.orders);
        if (data.dryers) _setDryers(data.dryers);
        if (data.gasCylinders) _setGasCylinders(data.gasCylinders);
        if (data.supplies) _setSupplies(data.supplies);
        if (data.employees) _setEmployees(data.employees);
        if (data.transactions) _setTransactions(data.transactions);
        if (data.txCategories) _setTxCategories(data.txCategories);
        if (data.pins) _setPins(data.pins);
      } else {
        setDoc(docRef, { 
          clients: [], servicesConfig: [], orders: [], dryers: [], gasCylinders: [], supplies: [], employees: [], transactions: [], 
          txCategories: { in: ['Venta Producto', 'Otros Ingresos'], out: ['Insumos', 'Mantenimiento', 'Planilla', 'Luz / Agua', 'Otros'] }, 
          pins: { admin: '1234', employee: '0000' } 
        }, { merge: true });
      }
      setIsCloudReady(true);
    }, () => { setCloudError(true); setIsCloudReady(true); });
    return () => unsub();
  }, [firebaseUser]);

  const saveToCloud = async (key: string, value: any) => {
    if (!firebaseUser) return;
    try { await setDoc(doc(db, 'negocios', storeId, 'datos', 'estado_maestro'), { [key]: value }, { merge: true }); } catch (e) {}
  };

  const setClients = (v: any) => { _setClients(v); saveToCloud('clients', v); };
  const setServicesConfig = (v: any) => { _setServicesConfig(v); saveToCloud('servicesConfig', v); };
  const setOrders = (v: any) => { _setOrders(v); saveToCloud('orders', v); };
  const setDryers = (v: any) => { _setDryers(v); saveToCloud('dryers', v); };
  const setGasCylinders = (v: any) => { _setGasCylinders(v); saveToCloud('gasCylinders', v); };
  const setSupplies = (v: any) => { _setSupplies(v); saveToCloud('supplies', v); };
  const setEmployees = (v: any) => { _setEmployees(v); saveToCloud('employees', v); };
  const setTransactions = (v: any) => { _setTransactions(v); saveToCloud('transactions', v); };
  const setTxCategories = (v: any) => { _setTxCategories(v); saveToCloud('txCategories', v); };
  const setPins = (v: any) => { _setPins(v); saveToCloud('pins', v); };

  // --- INTERFAZ & FORMS ---
  const [dateFilter, setDateFilter] = useState({ type: 'hoy', specificDate: getLocalDateString() });
  const [activeOrderTab, setActiveOrderTab] = useState('activas');
  const [activeInvTab, setActiveInvTab] = useState('insumos');
  const [activeGasTab, setActiveGasTab] = useState('activos');
  
  const [modals, setModals] = useState({ client: false, deliverOrder: false, employee: false, service: false, transaction: false, supply: false, gas: false, emptyGas: false, category: false, restockSupply: false, dryer: false, payGas: false });
  const [uiError, setUiError] = useState('');
  const [uiSuccess, setUiSuccess] = useState('');
  
  const [numpad, setNumpad] = useState({ isOpen: false, field: null as any, value: '', target: 'order' });
  const [posSearchTerm, setPosSearchTerm] = useState('');
  const [orderSearchTerm, setOrderSearchTerm] = useState(''); 
  
  const [forms, setForms] = useState({
    client: { name: '', phone: '' },
    pins: { admin: '', employee: '' },
    deliverOrder: { id: null as any, deliveredBy: '', dryerCycles: {} as Record<string, number> },
    employee: { name: '', phone: '' },
    service: { name: '', basePrice: '' },
    transaction: { type: 'SALIDA', amount: '', category: '', desc: '' },
    supply: { name: '', stock: '', minAlert: '' },
    restockSupply: { id: null as any, name: '', qty: '', cost: '', date: getLocalDateString() },
    gas: { dryerId: '', price: '', type: 'Contado', date: getLocalDateString() },
    payGas: { id: null as any, date: getLocalDateString() },
    emptyGas: { id: null as any },
    category: { type: 'SALIDA', name: '' },
    dryer: { name: '' }
  });
  const [orderForm, setOrderForm] = useState({ clientId: '', requestDate: getLocalDateString(), bags: '', serviceId: '', priority: 'Media', manualPrice: 0, receivedBy: '' });

  // --- LÓGICA DE FILTRADO ---
  const isDateInRange = (dateStr: string, filter = dateFilter) => {
    if (!dateStr || filter.type === 'historico') return true;
    const d = new Date(dateStr + 'T12:00:00'); 
    const t = new Date(); t.setHours(12, 0, 0, 0);
    switch (filter.type) {
      case 'hoy': return dateStr === getLocalDateString();
      case 'quincena': return d >= new Date(t.setDate(t.getDate() <= 15 ? 1 : 16)) && d <= new Date();
      case 'mes': return d.getMonth() === new Date().getMonth() && d.getFullYear() === new Date().getFullYear();
      default: return true;
    }
  };

  const filteredTransactions = useMemo(() => _transactions.filter(t => isDateInRange(t.date)), [_transactions, dateFilter]);
  
  const sortedAndFilteredOrders = useMemo(() => {
    const w: any = { 'Alta': 3, 'Media': 2, 'Baja': 1 };
    return _orders.filter(o => o.status !== 'Entregado' || isDateInRange(o.requestDate))
                  .filter(o => activeOrderTab === 'activas' ? o.status !== 'Entregado' : o.status === 'Entregado')
                  .filter(o => {
                    if (!orderSearchTerm) return true;
                    const clientName = _clients.find(c => c.id === o.clientId)?.name?.toLowerCase() || '';
                    return clientName.includes(orderSearchTerm.toLowerCase()) || o.id.toString().includes(orderSearchTerm);
                  })
                  .sort((a, b) => (w[b.priority] - w[a.priority]) || (new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime()));
  }, [_orders, activeOrderTab, dateFilter, orderSearchTerm, _clients]);

  // --- ACCIONES ---
  const handleLogin = (pin: string) => {
    vibrate();
    if (pin === _pins.admin) { setCurrentUser({ role: 'admin', name: 'Dueño' }); setActiveTab('panel'); }
    else if (pin === _pins.employee) { setCurrentUser({ role: 'employee', name: 'Mostrador' }); setActiveTab('mostrador'); }
    else { setLoginError('PIN Incorrecto'); setLoginPin(''); }
  };

  const showMsg = (msg: string, isErr = true) => { isErr ? setUiError(msg) : setUiSuccess(msg); setTimeout(() => {setUiError(''); setUiSuccess('')}, 3000); };
  const updateForm = (f: string, field: string, val: any) => setForms(prev => ({ ...prev, [f]: { ...(prev as any)[f], [field]: val } }));
  const toggleModal = (m: string) => setModals(prev => ({ ...prev, [m]: !(prev as any)[m] }));

  const handleNumpadAccept = () => {
    vibrate();
    if (numpad.target === 'order') setOrderForm({...orderForm, [numpad.field]: numpad.value});
    else if (numpad.target === 'transaction') updateForm('transaction', numpad.field, numpad.value);
    else if (numpad.target === 'gas') updateForm('gas', numpad.field, numpad.value);
    else if (numpad.target === 'supply') updateForm('supply', numpad.field, numpad.value);
    else if (numpad.target === 'restockSupply') updateForm('restockSupply', numpad.field, numpad.value);
    else if (numpad.target === 'service') updateForm('service', numpad.field, numpad.value);
    setNumpad({isOpen: false, value: '', field: null, target: 'order'});
  };

  const handleNumpadInput = (n: string) => { vibrate(); setNumpad(prev => ({ ...prev, value: n === 'DEL' ? prev.value.slice(0, -1) : prev.value + n })); };

  const handleAddClient = () => {
    if (!forms.client.name) return showMsg("Falta el nombre del cliente");
    const newClient = { id: Date.now(), ...forms.client };
    setClients([newClient, ..._clients]);
    setForms(prev => ({ ...prev, client: { name: '', phone: '' } }));
    toggleModal('client');
    if (activeTab === 'mostrador') setOrderForm(prev => ({ ...prev, clientId: newClient.id }));
    showMsg("Cliente registrado con éxito", false);
  };

  const handleSaveOrder = () => {
    vibrate();
    if (!orderForm.clientId || !orderForm.serviceId || !orderForm.receivedBy) return showMsg("Faltan datos en la orden");
    if (!orderForm.bags || orderForm.bags === '0') return showMsg("Añade la cantidad de bolsas/piezas");
    const newOrder = { id: Date.now(), ...orderForm, total: parseFloat(orderForm.manualPrice.toString()), status: 'Recibido', isPaid: false, deliveredBy: null };
    setOrders([newOrder, ..._orders]);
    setOrderForm({ clientId: '', requestDate: getLocalDateString(), bags: '', serviceId: '', priority: 'Media', manualPrice: 0, receivedBy: orderForm.receivedBy });
    showMsg("Orden procesada correctamente", false);
    setActiveTab('ordenes');
  };

  const handleCobrar = (order: any) => {
    vibrate();
    const client = _clients.find(c => c.id === order.clientId)?.name || 'Cliente';
    setOrders(_orders.map(o => o.id === order.id ? { ...o, isPaid: true, paidDate: getLocalDateString() } : o));
    setTransactions([{ id: Date.now(), type: 'ENTRADA', amount: order.total, category: 'Servicios', date: getLocalDateString(), desc: `Ticket #${order.id.toString().slice(-4)} - ${client}` }, ..._transactions]);
    showMsg("Cobro registrado en caja", false);
  };

  const confirmDelivery = () => {
    if (!forms.deliverOrder.deliveredBy) return showMsg("Selecciona quién entregó la ropa");
    
    // Auto-registrar ciclos en cilindros activos
    let updatedGas = [..._gasCylinders];
    let hasCycles = false;
    Object.entries(forms.deliverOrder.dryerCycles).forEach(([dId, count]) => {
      if (count > 0) {
        hasCycles = true;
        const activeGasIndex = updatedGas.findIndex(g => g.dryerId === parseInt(dId) && g.status === 'Activo');
        if (activeGasIndex >= 0) {
          updatedGas[activeGasIndex] = { ...updatedGas[activeGasIndex], cycles: (updatedGas[activeGasIndex].cycles || 0) + count };
        }
      }
    });
    if (hasCycles) setGasCylinders(updatedGas);

    setOrders(_orders.map(o => o.id === forms.deliverOrder.id ? { ...o, status: 'Entregado', deliveredBy: parseInt(forms.deliverOrder.deliveredBy) } : o));
    toggleModal('deliverOrder');
    showMsg("Ropa despachada al cliente", false);
  };

  const handleAddTransaction = () => {
    if (!forms.transaction.amount || !forms.transaction.category) return showMsg("Llena el monto y categoría");
    setTransactions([{ id: Date.now(), type: forms.transaction.type, amount: parseFloat(forms.transaction.amount), category: forms.transaction.category, date: getLocalDateString(), desc: forms.transaction.desc }, ..._transactions]);
    toggleModal('transaction');
    setForms(prev => ({ ...prev, transaction: { type: 'SALIDA', amount: '', category: '', desc: '' } }));
    showMsg("Movimiento guardado", false);
  };

  const handleAddCategory = () => {
    if (!forms.category.name) return showMsg("Escribe un nombre para la categoría");
    const target = forms.category.type === 'ENTRADA' ? 'in' : 'out';
    if (_txCategories[target].includes(forms.category.name)) return showMsg("Esa categoría ya existe");
    setTxCategories({ ..._txCategories, [target]: [..._txCategories[target], forms.category.name] });
    toggleModal('category');
    showMsg("Categoría agregada exitosamente", false);
  };

  const handleDeleteCategory = (type: 'in'|'out', name: string) => {
    vibrate();
    setTxCategories({ ..._txCategories, [type]: _txCategories[type].filter((c:string) => c !== name) });
  };

  const handleAddDryer = () => {
    if (!forms.dryer.name) return showMsg("Dale un nombre a la secadora");
    setDryers([..._dryers, { id: Date.now(), name: forms.dryer.name }]);
    toggleModal('dryer');
    showMsg("Secadora registrada", false);
  };

  const handleAddGas = () => {
    if (!forms.gas.price || !forms.gas.dryerId) return showMsg("Falta el precio o la secadora");
    const price = parseFloat(forms.gas.price);
    const isPaid = forms.gas.type === 'Contado';
    
    setGasCylinders([{ 
      id: Date.now(), dryerId: parseInt(forms.gas.dryerId), entryDate: forms.gas.date, price, 
      type: forms.gas.type, isPaid: isPaid, status: 'Activo', emptyDate: null, cycles: 0 
    }, ..._gasCylinders]);
    
    if (isPaid) {
      const catName = _txCategories.out.includes('Mantenimiento') ? 'Mantenimiento' : (_txCategories.out[0] || 'Gasto');
      setTransactions([{ id: Date.now(), type: 'SALIDA', amount: price, category: catName, date: forms.gas.date, desc: `Compra Cilindro (Contado)` }, ..._transactions]);
    }
    toggleModal('gas');
    showMsg(isPaid ? "Cilindro y gasto registrados" : "Cilindro instalado al Crédito", false);
  };

  const handlePayGas = () => {
    const cyl = _gasCylinders.find(g => g.id === forms.payGas.id);
    if(!cyl) return;
    setGasCylinders(_gasCylinders.map(g => g.id === forms.payGas.id ? { ...g, isPaid: true, payDate: forms.payGas.date } : g));
    
    const catName = _txCategories.out.includes('Mantenimiento') ? 'Mantenimiento' : (_txCategories.out[0] || 'Gasto');
    setTransactions([{ id: Date.now(), type: 'SALIDA', amount: cyl.price, category: catName, date: forms.payGas.date, desc: `Pago atrasado: Cilindro de Gas` }, ..._transactions]);
    
    toggleModal('payGas');
    showMsg("Pago registrado en caja", false);
  };

  const handleEmptyGas = () => {
    setGasCylinders(_gasCylinders.map(g => g.id === forms.emptyGas.id ? { ...g, status: 'Vacio', emptyDate: getLocalDateString() } : g));
    toggleModal('emptyGas');
    showMsg("Cilindro marcado como vacío y archivado", false);
  };

  const handleAddSupply = () => {
    if (!forms.supply.name) return showMsg("Falta el nombre del insumo");
    setSupplies([{ id: Date.now(), name: forms.supply.name, stock: parseInt(forms.supply.stock||'0'), minAlert: parseInt(forms.supply.minAlert||'0') }, ..._supplies]);
    toggleModal('supply');
    showMsg("Insumo agregado al catálogo", false);
  };

  const handleRestockSupply = () => {
    if (!forms.restockSupply.qty || parseFloat(forms.restockSupply.qty) <= 0) return showMsg("Agrega la cantidad comprada");
    if (!forms.restockSupply.cost || parseFloat(forms.restockSupply.cost) <= 0) return showMsg("Agrega el costo total");
    
    const cost = parseFloat(forms.restockSupply.cost);
    const qty = parseInt(forms.restockSupply.qty);

    setSupplies(_supplies.map(s => s.id === forms.restockSupply.id ? { ...s, stock: s.stock + qty } : s));
    const catName = _txCategories.out.includes('Insumos') ? 'Insumos' : (_txCategories.out[0] || 'Gasto');
    setTransactions([{ id: Date.now(), type: 'SALIDA', amount: cost, category: catName, date: forms.restockSupply.date, desc: `Compra: ${forms.restockSupply.name} (${qty} und.)` }, ..._transactions]);
    
    toggleModal('restockSupply');
    showMsg(`Bodega actualizada y -Q${cost} registrado en caja`, false);
  };

  // --- VISTAS ---
  const renderDashboard = () => {
    const totalIn = filteredTransactions.filter(t => t.type === 'ENTRADA').reduce((s,t) => s + t.amount, 0);
    const totalOut = filteredTransactions.filter(t => t.type === 'SALIDA').reduce((s,t) => s + t.amount, 0);
    const net = totalIn - totalOut;

    return (
      <div className="space-y-6 pb-24 md:pb-6 animate-in fade-in duration-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm flex flex-col justify-center border border-slate-100/50">
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Ingresos Brutos</p>
            <p className="text-3xl md:text-5xl font-black text-emerald-600 num-font mt-1">Q{formatMoney(totalIn)}</p>
          </div>
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm flex flex-col justify-center border border-slate-100/50">
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Gastos / Salidas</p>
            <p className="text-3xl md:text-5xl font-black text-rose-600 num-font mt-1">Q{formatMoney(totalOut)}</p>
          </div>
          <div className={`p-6 md:p-8 rounded-[2rem] shadow-xl flex flex-col justify-center ${net >= 0 ? 'bg-slate-900 border border-slate-800' : 'bg-rose-600 border border-rose-500'}`}>
            <p className="text-white/50 font-bold uppercase text-[10px] tracking-widest">Caja Fuerte (Líquido)</p>
            <p className="text-4xl md:text-6xl font-black text-white num-font mt-1">Q{formatMoney(net)}</p>
          </div>
        </div>
        
        <h3 className="font-black text-xl text-slate-800 mt-10 mb-4 px-2 tracking-tight">Acciones Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div onClick={() => {vibrate(); setActiveTab('insumos')}} className="bg-orange-50 p-6 rounded-[2rem] active:scale-95 transition-transform cursor-pointer border-2 border-orange-100 hover:border-orange-200 relative overflow-hidden group">
            <Flame className="w-8 h-8 text-orange-500 mb-3 group-hover:scale-110 transition-transform"/>
            <h4 className="font-black text-orange-950">Insumos</h4>
            {_supplies.filter(s => s.stock <= s.minAlert).length > 0 && <span className="absolute top-5 right-5 bg-rose-500 w-4 h-4 rounded-full border-2 border-orange-50 animate-pulse"></span>}
          </div>
          <div onClick={() => {vibrate(); setActiveTab('ordenes')}} className="bg-blue-50 p-6 rounded-[2rem] active:scale-95 transition-transform cursor-pointer border-2 border-blue-100 hover:border-blue-200 group">
            <ShoppingCart className="w-8 h-8 text-blue-500 mb-3 group-hover:scale-110 transition-transform"/>
            <h4 className="font-black text-blue-950">{_orders.filter(o => o.status !== 'Entregado').length} Órdenes</h4>
          </div>
          <div onClick={() => {vibrate(); setActiveTab('reportes')}} className="bg-purple-50 p-6 rounded-[2rem] active:scale-95 transition-transform cursor-pointer border-2 border-purple-100 hover:border-purple-200 group">
            <BarChart3 className="w-8 h-8 text-purple-500 mb-3 group-hover:scale-110 transition-transform"/>
            <h4 className="font-black text-purple-950">Reportes</h4>
          </div>
          <div onClick={() => {vibrate(); setActiveTab('ajustes')}} className="bg-emerald-50 p-6 rounded-[2rem] active:scale-95 transition-transform cursor-pointer border-2 border-emerald-100 hover:border-emerald-200 group">
            <Settings className="w-8 h-8 text-emerald-500 mb-3 group-hover:scale-110 transition-transform"/>
            <h4 className="font-black text-emerald-950">Catálogo</h4>
          </div>
        </div>
      </div>
    );
  };

  const renderMostrador = () => {
    const filteredClients = _clients.filter(c => c.name.toLowerCase().includes(posSearchTerm.toLowerCase()) || c.phone.includes(posSearchTerm));
    const selectedClient = _clients.find(c => c.id === orderForm.clientId);
    
    return (
      <div className="flex flex-col lg:flex-row gap-6 h-full pb-32 md:pb-6 relative animate-in fade-in duration-300">
        
        {/* COLUMNA 1: INFO Y CLIENTE */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col relative z-10">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-black text-slate-400 text-[11px] uppercase tracking-widest flex items-center"><UserCheck className="w-4 h-4 mr-2"/> 1. El Cliente</h3>
              {!orderForm.clientId && <button onClick={() => toggleModal('client')} className="bg-slate-900 text-white p-2 rounded-xl active:scale-90 transition-transform shadow-lg shadow-slate-200"><Plus className="w-5 h-5"/></button>}
            </div>
            {orderForm.clientId ? (
              <div className="bg-blue-600 border border-blue-700 p-5 rounded-2xl flex justify-between items-center shadow-lg shadow-blue-200">
                <div><p className="font-black text-white text-xl tracking-tight">{selectedClient?.name}</p><p className="text-sm font-bold text-blue-200">{selectedClient?.phone || 'Sin número'}</p></div>
                <button onClick={() => {vibrate(); setOrderForm({...orderForm, clientId: ''}); setPosSearchTerm('')}} className="bg-white/20 hover:bg-white/30 text-white px-4 py-3 rounded-xl font-black text-xs transition-colors backdrop-blur-md">Cambiar</button>
              </div>
            ) : (
              <div className="flex flex-col h-64 lg:h-[400px]">
                <div className="relative mb-4 shrink-0"><Search className="absolute left-4 top-4 w-5 h-5 text-slate-400"/><input type="text" placeholder="Buscar cliente..." className="w-full bg-slate-50 p-4 pl-12 rounded-2xl font-bold border-2 border-slate-100 outline-none focus:border-blue-500 transition-all text-lg placeholder:text-slate-300" value={posSearchTerm} onChange={e => setPosSearchTerm(e.target.value)} /></div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-2 touch-pan-y">
                  {filteredClients.map(c => <button key={c.id} onClick={() => {vibrate(); setOrderForm({...orderForm, clientId: c.id})}} className="w-full text-left p-4 border-2 border-slate-50 hover:border-slate-200 active:bg-slate-100 rounded-2xl font-bold text-slate-700 transition-all text-lg">{c.name}</button>)}
                  {filteredClients.length === 0 && <p className="text-center text-slate-400 font-bold mt-4">No hay resultados.</p>}
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 className="font-black text-slate-400 text-[11px] uppercase tracking-widest mb-4 flex items-center"><Users className="w-4 h-4 mr-2"/> 2. Recibido Por</h3>
            <div className="flex overflow-x-auto gap-3 pb-2 touch-pan-x snap-x">
              {_employees.map(e => (
                <button key={e.id} onClick={() => {vibrate(); setOrderForm({...orderForm, receivedBy: e.id})}} className={`snap-start whitespace-nowrap px-6 py-4 rounded-2xl font-black transition-all active:scale-95 text-lg ${orderForm.receivedBy === e.id ? 'bg-slate-900 text-white shadow-xl shadow-slate-300' : 'bg-slate-50 text-slate-500 border-2 border-slate-100'}`}>
                  {e.name}
                </button>
              ))}
              {_employees.length === 0 && <p className="text-rose-500 font-bold text-sm">Debes agregar empleados en la pestaña Ajustes.</p>}
            </div>
          </div>
        </div>

        {/* COLUMNA 2: DETALLES Y ACCIÓN */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4 relative">
           <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
             <div className="flex justify-between items-center mb-5">
                <h3 className="font-black text-slate-400 text-[11px] uppercase tracking-widest flex items-center"><Package className="w-4 h-4 mr-2"/> 3. Detalles del Servicio</h3>
                <input type="date" className="bg-slate-50 border-2 border-slate-100 p-2 rounded-xl font-bold text-sm text-slate-600 outline-none focus:border-blue-500" value={orderForm.requestDate} onChange={e => currentUser.role === 'admin' && setOrderForm({...orderForm, requestDate: e.target.value})} disabled={currentUser.role === 'employee'} />
             </div>
             
             <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
               {_servicesConfig.map(s => (
                 <button key={s.id} onClick={() => {vibrate(); setOrderForm({...orderForm, serviceId: s.id, manualPrice: s.basePrice})}} className={`p-5 rounded-2xl border-2 font-bold text-left transition-all active:scale-95 ${orderForm.serviceId === s.id ? 'bg-blue-100 border-blue-500 text-blue-900 shadow-inner' : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-300'}`}>
                   <p className="leading-tight text-lg mb-1">{s.name}</p>
                   <p className={`text-sm font-black num-font ${orderForm.serviceId === s.id ? 'text-blue-600' : 'text-slate-400'}`}>Q{formatMoney(Number(s.basePrice))}</p>
                 </button>
               ))}
               {_servicesConfig.length === 0 && <div className="col-span-full p-8 bg-slate-50 rounded-2xl text-center text-slate-400 font-bold border-2 border-dashed border-slate-200">No hay servicios configurados. Agrégalos en Ajustes.</div>}
             </div>

             <div className="grid grid-cols-2 gap-4">
               <button onClick={() => {vibrate(); setNumpad({isOpen: true, field: 'bags', value: orderForm.bags.toString(), target: 'order'})}} className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-[2rem] border-2 border-slate-100 active:bg-slate-200 transition-colors">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bolsas o Piezas</span>
                 <span className="text-5xl font-black text-slate-800 num-font tracking-tighter">{orderForm.bags || '0'}</span>
               </button>
               <button onClick={() => {if(currentUser.role === 'admin') { vibrate(); setNumpad({isOpen: true, field: 'manualPrice', value: orderForm.manualPrice.toString(), target: 'order'}); }}} className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 transition-colors ${currentUser.role === 'admin' ? 'bg-emerald-50 border-emerald-200 active:bg-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                 <span className="text-[10px] font-black text-emerald-600/70 uppercase tracking-widest mb-1">Precio Cobrado</span>
                 <span className="text-5xl font-black text-emerald-600 num-font tracking-tighter">Q{orderForm.manualPrice || '0'}</span>
               </button>
             </div>
           </div>

           <div className="flex bg-white p-2 rounded-[2rem] shadow-sm border border-slate-100 justify-between">
               {['Baja', 'Media', 'Alta'].map(p => <button key={p} onClick={() => {vibrate(); setOrderForm({...orderForm, priority: p})}} className={`flex-1 py-4 rounded-3xl font-black text-sm transition-all active:scale-95 ${orderForm.priority === p ? (p==='Alta'?'bg-rose-500 text-white shadow-lg shadow-rose-200':'bg-slate-900 text-white shadow-lg') : 'text-slate-400 hover:bg-slate-50'}`}>{p}</button>)}
           </div>

           <div className="fixed bottom-[85px] md:bottom-10 left-0 w-full px-4 md:static md:px-0 md:mt-auto z-20">
             <button onClick={handleSaveOrder} className={`w-full py-6 md:py-8 rounded-[2rem] font-black text-2xl transition-all active:scale-95 flex items-center justify-center ${(!orderForm.clientId || !orderForm.serviceId || !orderForm.receivedBy || !orderForm.bags || orderForm.bags === '0') ? 'bg-slate-200 text-slate-400' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-2xl shadow-blue-300'}`}>
               <CheckCircle className="w-8 h-8 mr-3" /> REGISTRAR ORDEN
             </button>
           </div>
        </div>
      </div>
    );
  };

  const renderOrdenes = () => (
    <div className="space-y-6 pb-24 md:pb-8 animate-in fade-in duration-300">
      
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex bg-slate-50 p-1.5 rounded-2xl w-full md:w-fit">
          {['activas', 'historial'].map(t => <button key={t} onClick={() => {vibrate(); setActiveOrderTab(t)}} className={`flex-1 px-8 py-3 rounded-xl font-black capitalize transition-all ${activeOrderTab === t ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>{t}</button>)}
        </div>
        <div className="relative w-full md:max-w-xs shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"/>
          <input type="text" placeholder="Buscar cliente o # ticket..." className="w-full bg-slate-50 py-3 px-12 rounded-2xl font-bold border-2 border-slate-50 outline-none focus:border-blue-500 transition-all text-sm placeholder:text-slate-400" value={orderSearchTerm} onChange={e => setOrderSearchTerm(e.target.value)} />
          {orderSearchTerm && <button onClick={() => setOrderSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 font-bold">X</button>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedAndFilteredOrders.map(o => {
          const client = _clients.find(c => c.id === o.clientId);
          const service = _servicesConfig.find(s => s.id === o.serviceId);
          const receiver = _employees.find(e => e.id === parseInt(o.receivedBy))?.name || 'Mostrador';
          return (
            <div key={o.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col relative overflow-hidden transition-all hover:shadow-lg">
              {o.status === 'Entregado' && <div className="absolute top-0 right-0 bg-slate-100 text-slate-400 text-[10px] font-black px-4 py-2 rounded-bl-2xl">ENTREGADO</div>}
              
              <div className="flex justify-between items-start mb-6">
                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${o.priority === 'Alta' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'}`}>{o.priority}</span>
                <span className="text-emerald-600 font-black text-3xl num-font tracking-tight">Q{formatMoney(Number(o.total))}</span>
              </div>
              
              <h4 className="text-2xl font-black text-slate-800 leading-tight mb-1">{client?.name || 'Cliente Genérico'}</h4>
              <p className="text-blue-600 font-bold mb-6 text-sm flex items-center"><Droplets className="w-4 h-4 mr-1"/> {service?.name}</p>
              
              <div className="flex justify-between items-center mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                 <div className="text-xs font-bold text-slate-500 space-y-2">
                    <p className="flex items-center text-slate-700"><Package className="w-4 h-4 mr-2 text-slate-400"/> {o.bags} {o.bags == 1 ? 'Bolsa/Pieza' : 'Bolsas/Piezas'}</p>
                    <p className="flex items-center"><UserCheck className="w-4 h-4 mr-2 text-slate-400"/> Recibió: {receiver}</p>
                 </div>
                 <p className="text-xs font-black text-slate-300 num-font bg-white px-2 py-1 rounded-lg border">#{o.id.toString().slice(-4)}</p>
              </div>

              <div className="mt-auto flex gap-3">
                {!o.isPaid ? 
                  <button onClick={() => handleCobrar(o)} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-200 active:scale-95 transition-all text-sm">COBRAR</button> 
                  : <div className="flex-1 bg-emerald-50 border-2 border-emerald-100 text-emerald-600 py-4 rounded-2xl font-black text-center flex items-center justify-center text-sm"><CheckCircle className="w-5 h-5 mr-2"/> PAGADO</div>
                }
                <button onClick={() => { vibrate(); setForms({...forms, deliverOrder: {id: o.id, deliveredBy: '', dryerCycles: {}}}); toggleModal('deliverOrder'); }} disabled={o.status === 'Entregado'} className={`px-6 py-4 rounded-2xl font-black text-xs transition-all ${o.status === 'Entregado' ? 'bg-slate-50 text-slate-300' : 'bg-slate-900 text-white active:scale-95 shadow-lg shadow-slate-300'}`}>{o.status === 'Entregado' ? 'LISTO' : 'ENTREGAR'}</button>
              </div>
            </div>
          )
        })}
        {sortedAndFilteredOrders.length === 0 && <div className="col-span-full py-32 flex flex-col items-center justify-center text-slate-300"><ClipboardList className="w-20 h-20 mb-4 opacity-30"/><p className="font-black text-2xl">{orderSearchTerm ? 'No hay coincidencias' : 'Sin órdenes aquí'}</p></div>}
      </div>
    </div>
  );

  const renderCajaFuerte = () => {
    const totalIn = filteredTransactions.filter(t => t.type === 'ENTRADA').reduce((s,t) => s + t.amount, 0);
    const totalOut = filteredTransactions.filter(t => t.type === 'SALIDA').reduce((s,t) => s + t.amount, 0);

    return (
      <div className="space-y-8 pb-32 max-w-5xl mx-auto animate-in fade-in duration-300">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm gap-6">
            <div><h3 className="text-2xl font-black text-slate-800 tracking-tight">Caja Fuerte / Movimientos</h3><p className="text-sm font-bold text-slate-400 mt-1">Registra pagos manuales, viáticos y proveedores aquí.</p></div>
            <button onClick={() => { vibrate(); setForms(p => ({...p, transaction: { ...p.transaction, category: _txCategories.out[0] || '' }})); toggleModal('transaction'); }} className="w-full md:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-black active:scale-95 transition-transform shadow-lg shadow-slate-300">+ Registrar Acción</button>
         </div>
         
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
            <div className="p-6 bg-emerald-50 border-b border-emerald-100 font-black text-emerald-800 flex items-center justify-between tracking-widest text-[10px] uppercase">
               <span className="flex items-center"><ArrowUpCircle className="w-5 h-5 mr-2"/> Entradas Registradas</span>
               <span className="text-lg num-font">Q{formatMoney(totalIn)}</span>
            </div>
            <div className="divide-y border-t-0">
               {filteredTransactions.filter(t => t.type === 'ENTRADA').map(t => <div key={t.id} className="p-6 flex justify-between items-center hover:bg-slate-50 transition-colors"><div><p className="font-black text-slate-800 text-lg leading-tight">{t.category}</p><p className="text-xs font-bold text-slate-400 mt-1">{t.desc || 'Cobro automático'}</p></div><p className="text-2xl font-black text-emerald-600 num-font">+Q{formatMoney(t.amount)}</p></div>)}
               {filteredTransactions.filter(t => t.type === 'ENTRADA').length === 0 && <p className="p-8 text-center text-slate-400 font-bold">Sin ingresos registrados</p>}
            </div>
          </div>
          <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
            <div className="p-6 bg-rose-50 border-b border-rose-100 font-black text-rose-800 flex items-center justify-between tracking-widest text-[10px] uppercase">
               <span className="flex items-center"><ArrowDownCircle className="w-5 h-5 mr-2"/> Salidas Registradas</span>
               <span className="text-lg num-font">Q{formatMoney(totalOut)}</span>
            </div>
            <div className="divide-y border-t-0">
               {filteredTransactions.filter(t => t.type === 'SALIDA').map(t => <div key={t.id} className="p-6 flex justify-between items-center hover:bg-slate-50 transition-colors"><div><p className="font-black text-slate-800 text-lg leading-tight">{t.category}</p><p className="text-xs font-bold text-slate-400 mt-1">{t.desc || 'Gasto registrado'}</p></div><p className="text-2xl font-black text-rose-600 num-font">-Q{formatMoney(t.amount)}</p></div>)}
               {filteredTransactions.filter(t => t.type === 'SALIDA').length === 0 && <p className="p-8 text-center text-slate-400 font-bold">Sin gastos registrados</p>}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderReportesAnaliticos = () => {
    const totalIn = filteredTransactions.filter(t => t.type === 'ENTRADA').reduce((s,t) => s + t.amount, 0);
    const totalOut = filteredTransactions.filter(t => t.type === 'SALIDA').reduce((s,t) => s + t.amount, 0);
    const netProfit = totalIn - totalOut;

    const categoriesIn = filteredTransactions.filter(t => t.type === 'ENTRADA').reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + t.amount; return acc; }, {} as Record<string, number>);
    const categoriesOut = filteredTransactions.filter(t => t.type === 'SALIDA').reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + t.amount; return acc; }, {} as Record<string, number>);

    return (
      <div className="space-y-8 pb-32 max-w-5xl mx-auto animate-in fade-in duration-300">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm gap-6">
            <div><h3 className="text-2xl font-black text-slate-800 tracking-tight">Estado de Resultados</h3><p className="text-sm font-bold text-slate-400 mt-1">Rentabilidad y desglose por categorías.</p></div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-2">Ingresos Brutos</p>
            <p className="text-4xl font-black text-emerald-600 num-font">Q{formatMoney(totalIn)}</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-2">Gastos Operativos</p>
            <p className="text-4xl font-black text-rose-600 num-font">Q{formatMoney(totalOut)}</p>
          </div>
          <div className={`p-8 rounded-[2rem] shadow-xl border ${netProfit >= 0 ? 'bg-slate-900 border-slate-800' : 'bg-rose-600 border-rose-500'}`}>
            <p className="text-white/50 font-black uppercase text-[10px] tracking-widest mb-2">Utilidad Neta</p>
            <p className="text-4xl font-black text-white num-font">Q{formatMoney(netProfit)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 bg-emerald-50 border-b border-emerald-100 font-black text-emerald-800 text-[11px] uppercase tracking-widest flex items-center"><PieChart className="w-4 h-4 mr-2"/> Origen de Ingresos</div>
            <div className="p-6 space-y-4 divide-y border-t-0 flex-1">
              {Object.keys(categoriesIn).length === 0 && <p className="text-slate-400 font-bold text-sm text-center py-4">No hay datos de ingresos en este periodo.</p>}
              {Object.entries(categoriesIn).map(([cat, amount]) => (
                <div key={cat} className="flex justify-between items-center pt-4 first:pt-0"><span className="font-bold text-slate-600 text-lg">{cat}</span><span className="font-black text-slate-800 text-xl num-font">Q{formatMoney(amount)}</span></div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 bg-rose-50 border-b border-rose-100 font-black text-rose-800 text-[11px] uppercase tracking-widest flex items-center"><PieChart className="w-4 h-4 mr-2"/> Destino de Gastos</div>
            <div className="p-6 space-y-4 divide-y border-t-0 flex-1">
              {Object.keys(categoriesOut).length === 0 && <p className="text-slate-400 font-bold text-sm text-center py-4">No hay datos de gastos en este periodo.</p>}
              {Object.entries(categoriesOut).map(([cat, amount]) => (
                <div key={cat} className="flex justify-between items-center pt-4 first:pt-0"><span className="font-bold text-slate-600 text-lg">{cat}</span><span className="font-black text-slate-800 text-xl num-font">Q{formatMoney(amount)}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderInsumos = () => (
    <div className="space-y-6 pb-24 md:pb-8 animate-in fade-in duration-300">
      <div className="flex bg-white p-1.5 rounded-2xl w-fit shadow-sm border border-slate-100">
        {['insumos', 'gas'].map(t => <button key={t} onClick={() => {vibrate(); setActiveInvTab(t)}} className={`px-8 py-3 rounded-xl font-black capitalize transition-all ${activeInvTab === t ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>{t}</button>)}
      </div>
      
      {activeInvTab === 'insumos' && (
        <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Jabones y Químicos</h3>
            <button onClick={() => toggleModal('supply')} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-black text-sm active:scale-95 transition-all shadow-md">+ Nuevo Catálogo</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {_supplies.map(s => (
              <div key={s.id} className={`p-6 rounded-[2rem] border-2 transition-colors flex flex-col ${s.stock <= s.minAlert ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-100'}`}>
                <h4 className="font-black text-xl text-slate-800 leading-tight mb-1">{s.name}</h4>
                <p className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-6">Alerta en: {s.minAlert} und.</p>
                
                <div className="flex items-center justify-between bg-white p-2 rounded-2xl shadow-sm border border-slate-100 mb-4 mt-auto">
                  <button onClick={() => {vibrate(); setSupplies(_supplies.map(x => x.id===s.id ? {...x, stock: Math.max(0, x.stock-1)} : x))}} className="w-12 h-12 bg-slate-50 hover:bg-slate-100 rounded-xl font-black text-xl text-slate-600 active:scale-90 transition-transform">-</button>
                  <span className={`text-3xl font-black num-font ${s.stock <= s.minAlert ? 'text-rose-600' : 'text-slate-800'}`}>{s.stock}</span>
                  <button onClick={() => {vibrate(); setSupplies(_supplies.map(x => x.id===s.id ? {...x, stock: x.stock+1} : x))}} className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl font-black text-xl active:scale-90 transition-transform shadow-sm">+</button>
                </div>
                
                <button onClick={() => {vibrate(); setForms(p => ({...p, restockSupply: {id: s.id, name: s.name, qty: '', cost: '', date: getLocalDateString()}})); toggleModal('restockSupply');}} className="w-full bg-slate-900 text-white py-3 rounded-xl font-black text-sm active:scale-95 transition-transform flex items-center justify-center shadow-lg shadow-slate-300">
                  <ShoppingBag className="w-4 h-4 mr-2" /> Comprar 
                </button>
              </div>
            ))}
            {_supplies.length === 0 && <p className="col-span-full text-slate-400 font-bold py-10 text-center">Inicia registrando tus galones de jabón.</p>}
          </div>
        </div>
      )}

      {activeInvTab === 'gas' && (
        <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Trazabilidad de Secadoras</h3>
            <div className="flex gap-2 w-full md:w-auto">
              <button onClick={() => {vibrate(); setForms(p=>({...p, dryer:{name:''}})); toggleModal('dryer');}} className="flex-1 md:flex-none bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-3 rounded-xl font-black text-sm active:scale-95 transition-all shadow-sm">+ Secadora</button>
              <button onClick={() => {vibrate(); setForms(p=>({...p, gas:{dryerId:'', price:'', type:'Contado', date: getLocalDateString()}})); toggleModal('gas');}} className="flex-1 md:flex-none bg-purple-600 hover:bg-purple-500 text-white px-5 py-3 rounded-xl font-black text-sm active:scale-95 transition-all shadow-md">+ Instalar Tambo</button>
            </div>
          </div>
          
          <div className="flex bg-slate-50 p-1 rounded-xl w-fit mb-6 border border-slate-100">
            {['activos', 'historial'].map(t => <button key={t} onClick={() => setActiveGasTab(t)} className={`px-6 py-2 rounded-lg font-black capitalize transition-all text-sm ${activeGasTab === t ? 'bg-white shadow text-purple-700' : 'text-slate-400'}`}>{t}</button>)}
          </div>

          {activeGasTab === 'activos' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {_dryers.map(d => {
                const activeCyl = _gasCylinders.find(g => g.dryerId === d.id && g.status === 'Activo');
                return (
                  <div key={d.id} className="bg-slate-50 rounded-[2rem] p-6 border-2 border-slate-100 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-black text-xl text-slate-800 flex items-center"><Flame className="w-5 h-5 mr-2 text-orange-500"/> {d.name}</h4>
                      {activeCyl && !activeCyl.isPaid && <span className="bg-rose-100 text-rose-700 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest animate-pulse">Deuda (Crédito)</span>}
                    </div>
                    
                    {activeCyl ? (
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-end mb-6">
                          <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Ciclos Actuales</p>
                            <p className="text-5xl font-black text-slate-800 num-font leading-none">{activeCyl.cycles}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-emerald-600 num-font text-lg">Q{formatMoney(Number(activeCyl.price))}</p>
                            <p className="text-xs font-bold text-slate-500">Instalado: {activeCyl.entryDate}</p>
                          </div>
                        </div>
                        
                        <div className="mt-auto flex gap-2">
                          {!activeCyl.isPaid && <button onClick={() => {vibrate(); setForms(p=>({...p, payGas:{id: activeCyl.id, date: getLocalDateString()}})); toggleModal('payGas');}} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-black shadow-lg shadow-rose-200 active:scale-95 transition-all text-sm">PAGAR</button>}
                          <button onClick={() => {vibrate(); setForms(p => ({...p, emptyGas: {id: activeCyl.id}})); toggleModal('emptyGas');}} className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-black active:scale-95 transition-transform shadow-lg shadow-slate-300 text-sm">Vaciar</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center py-8 text-slate-300">
                        <AlertCircle className="w-12 h-12 mb-2 opacity-50"/>
                        <p className="font-black text-lg">Sin Cilindro</p>
                      </div>
                    )}
                  </div>
                );
              })}
              {_dryers.length === 0 && <p className="col-span-full text-slate-400 font-bold text-center py-10">Agrega tu primera secadora para gestionar el gas.</p>}
            </div>
          )}

          {activeGasTab === 'historial' && (
            <div className="space-y-4">
              {_gasCylinders.filter(g => g.status === 'Vacio').map(g => {
                const dryerName = _dryers.find(d => d.id === g.dryerId)?.name || 'Secadora Eliminada';
                return (
                  <div key={g.id} className="flex justify-between items-center p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                    <div>
                      <p className="font-black text-slate-800 text-lg">{dryerName}</p>
                      <p className="text-xs font-bold text-slate-400 mt-1">{g.entryDate} {'->'} {g.emptyDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 inline-block mb-1">{g.cycles} ciclos</p>
                      <p className="text-xs font-bold text-slate-500">Q{(g.price / (g.cycles||1)).toFixed(2)} /ciclo (Q{g.price})</p>
                    </div>
                  </div>
                );
              })}
              {_gasCylinders.filter(g => g.status === 'Vacio').length === 0 && <p className="text-slate-400 font-bold text-center py-10">No hay cilindros vacíos en el historial.</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderAjustes = () => (
    <div className="space-y-8 pb-32 max-w-5xl mx-auto animate-in fade-in duration-300">
      
      {/* TARJETA DE CATEGORÍAS */}
      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col col-span-1 lg:col-span-2">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
           <div>
             <h3 className="font-black text-2xl flex items-center tracking-tight"><DollarSign className="w-6 h-6 mr-3 text-emerald-600"/> Categorías de Caja</h3>
             <p className="text-sm font-bold text-slate-400 mt-1">Personaliza cómo etiquetas tus ingresos y gastos.</p>
           </div>
           <button onClick={() => {vibrate(); setForms(p=>({...p, category: {type: 'SALIDA', name: ''}})); toggleModal('category');}} className="w-full md:w-auto bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest active:scale-95 transition-colors border border-emerald-200">+ Nueva Categoría</button>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
             <h4 className="text-[11px] font-black uppercase tracking-widest text-emerald-600 mb-4 flex items-center"><ArrowUpCircle className="w-4 h-4 mr-2"/> Ingresos Permitidos</h4>
             <div className="space-y-2">
               {_txCategories.in.map((c:string) => <div key={c} className="p-3 bg-white border border-slate-100 rounded-xl flex justify-between items-center group shadow-sm"><span className="font-bold text-slate-700 text-sm">{c}</span><button onClick={() => handleDeleteCategory('in', c)} className="text-rose-400 hover:text-rose-600 p-2 md:opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"><Trash2 className="w-4 h-4"/></button></div>)}
               {_txCategories.in.length === 0 && <p className="text-xs text-slate-400 font-bold p-2">Sin categorías de ingreso</p>}
             </div>
           </div>
           <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
             <h4 className="text-[11px] font-black uppercase tracking-widest text-rose-600 mb-4 flex items-center"><ArrowDownCircle className="w-4 h-4 mr-2"/> Gastos Permitidos</h4>
             <div className="space-y-2">
               {_txCategories.out.map((c:string) => <div key={c} className="p-3 bg-white border border-slate-100 rounded-xl flex justify-between items-center group shadow-sm"><span className="font-bold text-slate-700 text-sm">{c}</span><button onClick={() => handleDeleteCategory('out', c)} className="text-rose-400 hover:text-rose-600 p-2 md:opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"><Trash2 className="w-4 h-4"/></button></div>)}
               {_txCategories.out.length === 0 && <p className="text-xs text-slate-400 font-bold p-2">Sin categorías de gasto</p>}
             </div>
           </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-8 md:p-10 rounded-[2.5rem] shadow-2xl text-white">
          <h3 className="text-2xl font-black flex items-center mb-8 tracking-tight"><Lock className="w-7 h-7 mr-3 text-blue-400"/> Control de Acceso</h3>
          <div className="space-y-6">
            <div><label className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2 block">PIN Administrador</label><input type="password" placeholder="****" value={forms.pins.admin} onChange={e => updateForm('pins', 'admin', e.target.value)} className="w-full bg-white/10 border-2 border-white/5 p-5 rounded-2xl text-3xl font-black text-center tracking-[1em] outline-none focus:border-blue-500 transition-colors placeholder:text-white/20"/></div>
            <div><label className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2 block">PIN Mostrador</label><input type="password" placeholder="****" value={forms.pins.employee} onChange={e => updateForm('pins', 'employee', e.target.value)} className="w-full bg-white/10 border-2 border-white/5 p-5 rounded-2xl text-3xl font-black text-center tracking-[1em] outline-none focus:border-blue-500 transition-colors placeholder:text-white/20"/></div>
          </div>
          <button onClick={() => { vibrate(); setPins({admin: forms.pins.admin || _pins.admin, employee: forms.pins.employee || _pins.employee}); showMsg("PINs Actualizados de forma segura", false); setForms(p=>({...p, pins:{admin:'',employee:''}})); }} className="w-full mt-8 bg-blue-600 hover:bg-blue-500 text-white p-5 rounded-2xl font-black text-lg active:scale-95 transition-all shadow-lg shadow-blue-900/50">Guardar Nuevas Cerraduras</button>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-8"><h3 className="font-black text-2xl flex items-center tracking-tight"><Users className="w-6 h-6 mr-3 text-blue-600"/> Tu Personal</h3><button onClick={() => toggleModal('employee')} className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest active:scale-95 transition-colors">+ Añadir</button></div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {_employees.map(e => <div key={e.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center group"><span className="font-bold text-lg text-slate-700">{e.name}</span><button onClick={() => {vibrate(); setEmployees(_employees.filter(emp => emp.id !== e.id))}} className="text-rose-500 bg-white shadow-sm p-3 rounded-xl md:opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"><Trash2 className="w-5 h-5"/></button></div>)}
            {_employees.length === 0 && <div className="h-full flex items-center justify-center text-slate-300 font-black">Planilla Vacía</div>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8"><h3 className="font-black text-2xl flex items-center tracking-tight"><Store className="w-6 h-6 mr-3 text-emerald-600"/> Catálogo</h3><button onClick={() => toggleModal('service')} className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest active:scale-95 transition-colors">+ Añadir</button></div>
          <div className="space-y-3">
            {_servicesConfig.map(s => <div key={s.id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center group"><div className="flex flex-col"><span className="font-bold text-lg text-slate-800 leading-tight">{s.name}</span><span className="text-emerald-600 font-black text-sm mt-1 num-font">Q{formatMoney(Number(s.basePrice))}</span></div><button onClick={() => {vibrate(); setServicesConfig(_servicesConfig.filter(ser => ser.id !== s.id))}} className="text-rose-500 bg-white shadow-sm p-3 rounded-xl md:opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"><Trash2 className="w-5 h-5"/></button></div>)}
            {_servicesConfig.length === 0 && <p className="text-slate-400 font-bold text-center py-4">No hay servicios.</p>}
          </div>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-8"><h3 className="font-black text-2xl flex items-center tracking-tight"><ClipboardList className="w-6 h-6 mr-3 text-purple-600"/> Directorio de Clientes</h3></div>
          <div className="max-h-96 overflow-y-auto pr-2 space-y-3 touch-pan-y">
            {_clients.map(c => <div key={c.id} className="p-4 border-2 border-slate-50 rounded-2xl flex justify-between items-center"><div className="flex flex-col"><span className="font-bold text-slate-700 text-lg">{c.name}</span><span className="text-slate-400 text-sm font-bold num-font">{c.phone || 'Sin número'}</span></div><button onClick={() => {vibrate(); setClients(_clients.filter(x => x.id !== c.id))}} className="text-rose-400 hover:text-rose-600 p-2 active:scale-90 transition-transform"><Trash2 className="w-5 h-5"/></button></div>)}
            {_clients.length === 0 && <p className="text-slate-400 font-bold text-center py-4">Directorio vacío.</p>}
          </div>
        </div>
      </div>
    </div>
  );

  if (!isCloudReady) return <div className="h-screen bg-slate-900 flex flex-col items-center justify-center text-white font-black"><Cloud className="w-16 h-16 mb-4 text-blue-500 animate-pulse"/> Sincronizando LavOS...</div>;

  if (!currentUser) {
    return (
      <div className="h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-2xl w-full max-w-sm flex flex-col items-center relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full p-2 text-center text-[10px] font-black text-white uppercase tracking-widest ${cloudError ? 'bg-rose-500' : 'bg-emerald-500'}`}>{cloudError ? '⚠️ Sin Conexión a Nube' : 'Sistema Online'}</div>
          <Droplets className="w-16 h-16 text-blue-600 mb-2 mt-6" />
          <h1 className="text-4xl font-black text-slate-800 mb-8 tracking-tight">LavOS</h1>
          
          <div className="flex space-x-4 mb-10">
            {[0,1,2,3].map(i => <div key={i} className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-4 flex items-center justify-center text-2xl transition-all ${loginPin.length > i ? 'border-blue-600 bg-blue-600 text-white scale-110' : 'border-slate-100 text-transparent'}`}></div>)}
          </div>
          
          <div className="grid grid-cols-3 gap-4 w-full px-2">
            {[1,2,3,4,5,6,7,8,9,0].map(n => <button key={n} onClick={() => {vibrate(); loginPin.length < 4 && setLoginPin(loginPin + n.toString())}} className="bg-slate-50 hover:bg-slate-100 p-6 rounded-full text-3xl font-black text-slate-700 active:scale-90 transition-transform">{n}</button>)}
            <button onClick={() => {vibrate(); setLoginPin('')}} className="bg-rose-50 text-rose-600 p-6 rounded-full font-black active:scale-90 transition-transform"><Minus className="w-8 h-8 mx-auto"/></button>
            <button onClick={() => handleLogin(loginPin)} className="bg-blue-600 text-white p-6 rounded-full flex items-center justify-center shadow-lg shadow-blue-200 active:scale-90 transition-transform"><ChevronRight className="w-8 h-8"/></button>
          </div>
          {loginError && <p className="text-rose-600 font-black mt-6 text-sm bg-rose-50 px-4 py-2 rounded-full animate-bounce">{loginError}</p>}
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; -webkit-tap-highlight-color: transparent; }
        .num-font { font-feature-settings: "tnum"; font-variant-numeric: tabular-nums; }
        button { user-select: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
      `}</style>
      
      {/* NAVEGACIÓN PRINCIPAL */}
      <div className="h-screen bg-slate-50 flex flex-col md:flex-row overflow-hidden relative">
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[500] flex flex-col gap-2 w-full max-w-sm px-4">
          {uiError && <div className="bg-rose-600 text-white px-6 py-4 rounded-2xl font-black shadow-2xl animate-in slide-in-from-top-4 flex items-center"><AlertCircle className="w-5 h-5 mr-3 shrink-0"/>{uiError}</div>}
          {uiSuccess && <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl font-black shadow-2xl animate-in slide-in-from-top-4 flex items-center"><CheckCircle className="w-5 h-5 mr-3 text-emerald-400 shrink-0"/>{uiSuccess}</div>}
        </div>
        
        <nav className="fixed bottom-0 w-full md:static md:w-28 lg:w-64 bg-white border-t md:border-t-0 md:border-r border-slate-200 flex flex-row md:flex-col items-center p-2 md:p-6 gap-1 md:gap-3 z-50 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)] md:shadow-none">
          <div className="hidden lg:flex items-center mb-10 w-full justify-start pl-2"><Droplets className="text-blue-600 w-8 h-8 mr-3"/><h1 className="text-2xl font-black tracking-tight">LavOS</h1></div>
          
          <div className="flex flex-row md:flex-col gap-1 md:gap-2 w-full justify-around md:justify-start h-full overflow-x-auto no-scrollbar">
            <div className="flex flex-row md:flex-col gap-1 md:gap-2 w-full justify-around md:justify-start">
              {[
                {id:'panel', label: 'Panel', icon: LayoutDashboard, role:['admin']}, 
                {id:'mostrador', label: 'Caja', icon: Store, role:['admin','employee']}, 
                {id:'ordenes', label: 'Órdenes', icon: ClipboardList, role:['admin','employee']}, 
                {id:'finanzas', label: 'Caja Fuerte', icon: DollarSign, role:['admin']},
                {id:'reportes', label: 'Reportes', icon: BarChart3, role:['admin']},
                {id:'insumos', label: 'Inventario', icon: Flame, role:['admin','employee']}, 
                {id:'ajustes', label: 'Ajustes', icon: Settings, role:['admin']}
              ].filter(i => i.role.includes(currentUser.role)).map(item => (
                <button key={item.id} onClick={() => {vibrate(); setActiveTab(item.id)}} className={`flex-1 md:flex-none flex flex-col lg:flex-row items-center justify-center lg:justify-start p-3 lg:p-4 rounded-[1.2rem] lg:rounded-2xl font-bold transition-all w-full md:w-auto lg:w-full min-w-[60px] shrink-0 ${activeTab === item.id ? 'bg-slate-900 text-white shadow-lg shadow-slate-300' : 'text-slate-400 hover:bg-slate-50'}`}>
                  <item.icon className={`w-6 h-6 lg:mr-3 mb-1 lg:mb-0`}/><span className="text-[10px] lg:text-sm tracking-wide">{item.label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => {vibrate(); setCurrentUser(null); setLoginPin('');}} className="flex-1 md:flex-none flex flex-col lg:flex-row items-center justify-center lg:justify-start p-3 lg:p-4 rounded-[1.2rem] lg:rounded-2xl font-bold transition-all w-full md:w-auto lg:w-full min-w-[60px] shrink-0 text-rose-500 hover:bg-rose-50 md:mt-auto">
              <LogOut className="w-6 h-6 mb-1 lg:mb-0 lg:mr-3"/><span className="text-[10px] lg:text-sm tracking-wide">Salir</span>
            </button>
          </div>
        </nav>

        <main className="flex-1 flex flex-col h-[calc(100vh-75px)] md:h-screen overflow-hidden relative bg-slate-50/50">
          
          {activeTab !== 'mostrador' && activeTab !== 'ajustes' && (
            <header className="sticky top-0 z-30 bg-slate-50/90 backdrop-blur-md border-b border-slate-200/50 p-4 md:px-10 flex flex-col md:flex-row items-start md:items-center justify-between shrink-0 gap-4">
              <h2 className="font-black text-2xl text-slate-800 capitalize hidden md:flex items-center tracking-tight"><MapPin className="w-5 h-5 mr-2 text-blue-600"/> Morales / {activeTab === 'finanzas' ? 'Caja Fuerte' : activeTab}</h2>
              <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto no-scrollbar w-full md:w-auto snap-x">
                {['hoy', 'quincena', 'mes', 'historico'].map(t => (
                  <button key={t} onClick={() => {vibrate(); setDateFilter({...dateFilter, type: t})}} className={`snap-start flex-1 md:flex-none px-5 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all whitespace-nowrap ${dateFilter.type === t ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}>
                    {t==='hoy'?'Hoy':t==='quincena'?'Quincena':t==='mes'?'Mes':'Histórico'}
                  </button>
                ))}
              </div>
            </header>
          )}

          <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 scroll-smooth">
            <div className="max-w-7xl mx-auto h-full">
              {activeTab === 'panel' && renderDashboard()}
              {activeTab === 'mostrador' && renderMostrador()}
              {activeTab === 'ordenes' && renderOrdenes()}
              {activeTab === 'finanzas' && renderCajaFuerte()}
              {activeTab === 'reportes' && renderReportesAnaliticos()}
              {activeTab === 'insumos' && renderInsumos()}
              {activeTab === 'ajustes' && renderAjustes()}
            </div>
          </div>
        </main>

        {/* --- TECLADO UNIVERSAL --- */}
        {numpad.isOpen && (
          <div className="fixed inset-0 z-[1000] bg-slate-900/40 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-t-[2.5rem] md:rounded-[3rem] p-8 md:p-10 space-y-6 shadow-2xl animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-0 md:zoom-in-95 duration-200">
              <div className="flex justify-between items-center"><h3 className="font-black text-slate-800 uppercase text-[10px] tracking-widest">Ingrese Valor Numérico</h3><button onClick={() => {vibrate(); setNumpad({isOpen:false, field:null, value:'', target: 'order'})}} className="bg-slate-100 p-3 rounded-full text-slate-400 active:scale-90 transition-transform"><Minus className="w-5 h-5"/></button></div>
              <div className="text-6xl font-black text-center py-6 bg-slate-50 rounded-[2rem] border-2 border-slate-100 text-slate-800 tracking-tighter num-font overflow-hidden whitespace-nowrap">{numpad.value || '0'}</div>
              <div className="grid grid-cols-3 gap-3">
                {[1,2,3,4,5,6,7,8,9,'.',0,'DEL'].map(n => <button key={n} onClick={() => handleNumpadInput(n.toString())} className={`p-5 md:p-6 rounded-3xl text-3xl font-black active:scale-95 transition-transform ${n === 'DEL' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'}`}>{n}</button>)}
              </div>
              <button onClick={handleNumpadAccept} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-[2rem] font-black text-xl active:scale-95 shadow-xl shadow-blue-200 transition-all uppercase tracking-widest">Aceptar</button>
            </div>
          </div>
        )}

        {/* --- MODALES --- */}
        
        {modals.transaction && (
          <div className="fixed inset-0 z-[1000] bg-slate-900/40 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-t-[2.5rem] md:rounded-[3rem] p-8 md:p-10 space-y-6 shadow-2xl animate-in slide-in-from-bottom-10 md:zoom-in-95">
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">Caja Manual</h3>
              <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6">{['SALIDA', 'ENTRADA'].map(t => <button key={t} onClick={() => {vibrate(); updateForm('transaction', 'type', t); updateForm('transaction', 'category', t === 'ENTRADA' ? (_txCategories.in[0] || '') : (_txCategories.out[0] || ''));}} className={`flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${forms.transaction.type === t ? (t==='ENTRADA'?'bg-emerald-500 text-white shadow-md':'bg-rose-500 text-white shadow-md') : 'text-slate-400 hover:text-slate-600'}`}>{t==='ENTRADA'?'Ingreso':'Gasto'}</button>)}</div>
              
              <div onClick={() => {vibrate(); setNumpad({isOpen: true, field: 'amount', value: forms.transaction.amount, target: 'transaction'})}} className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 font-black text-2xl text-slate-700 cursor-pointer num-font">
                {forms.transaction.amount ? `Q ${forms.transaction.amount}` : <span className="text-slate-300">Monto Total (Q)</span>}
              </div>
              
              <select className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 font-bold outline-none focus:border-blue-500 text-slate-700 appearance-none" value={forms.transaction.category} onChange={e => updateForm('transaction', 'category', e.target.value)}>
                 {forms.transaction.type === 'ENTRADA' 
                  ? _txCategories.in.map((c:string) => <option key={c} value={c}>{c}</option>) 
                  : _txCategories.out.map((c:string) => <option key={c} value={c}>{c}</option>)}
              </select>
              
              <input type="text" placeholder="Concepto / Detalle (Opcional)" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 font-bold outline-none focus:border-blue-500 placeholder:text-slate-300" value={forms.transaction.desc} onChange={e => updateForm('transaction', 'desc', e.target.value)} />
              <div className="flex gap-4 pt-4"><button onClick={() => {vibrate(); toggleModal('transaction')}} className="flex-1 py-5 font-black text-slate-500 bg-slate-100 rounded-2xl active:scale-95 transition-transform">Cancelar</button><button onClick={() => {vibrate(); handleAddTransaction()}} className="flex-1 py-5 font-black bg-slate-900 text-white rounded-2xl active:scale-95 shadow-lg transition-transform">Guardar</button></div>
            </div>
          </div>
        )}

        {modals.category && (
          <div className="fixed inset-0 z-[1000] bg-slate-900/40 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-t-[2.5rem] md:rounded-[3rem] p-8 md:p-10 space-y-6 shadow-2xl animate-in slide-in-from-bottom-10 md:zoom-in-95">
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">Nueva Categoría</h3>
              <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6">{['SALIDA', 'ENTRADA'].map(t => <button key={t} onClick={() => {vibrate(); updateForm('category', 'type', t);}} className={`flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${forms.category.type === t ? (t==='ENTRADA'?'bg-emerald-500 text-white shadow-md':'bg-rose-500 text-white shadow-md') : 'text-slate-400 hover:text-slate-600'}`}>{t==='ENTRADA'?'Ingreso':'Gasto'}</button>)}</div>
              <input type="text" placeholder="Ej. Pago de Luz" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 font-bold outline-none focus:border-blue-500 text-lg placeholder:text-slate-300" value={forms.category.name} onChange={e => updateForm('category', 'name', e.target.value)} />
              <div className="flex gap-4 pt-4"><button onClick={() => {vibrate(); toggleModal('category')}} className="flex-1 py-5 font-black text-slate-500 bg-slate-100 rounded-2xl active:scale-95 transition-transform">Cancelar</button><button onClick={() => {vibrate(); handleAddCategory()}} className={`flex-1 py-5 font-black text-white rounded-2xl active:scale-95 shadow-lg transition-transform ${forms.category.type === 'ENTRADA' ? 'bg-emerald-600' : 'bg-rose-600'}`}>Agregar</button></div>
            </div>
          </div>
        )}

        {modals.deliverOrder && (
          <div className="fixed inset-0 z-[1000] bg-slate-900/40 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-t-[2.5rem] md:rounded-[3rem] p-8 md:p-10 space-y-6 shadow-2xl animate-in slide-in-from-bottom-10 md:zoom-in-95 max-h-[90vh] overflow-y-auto no-scrollbar">
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">Confirmar Salida</h3>
              
              <div>
                <p className="text-slate-400 font-bold mb-3 text-sm uppercase tracking-widest">¿Quién entrega?</p>
                <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto no-scrollbar touch-pan-y">
                  {_employees.map(e => <button key={e.id} onClick={() => {vibrate(); updateForm('deliverOrder', 'deliveredBy', e.id.toString())}} className={`p-4 rounded-2xl border-2 font-black transition-all active:scale-95 ${forms.deliverOrder.deliveredBy === e.id.toString() ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>{e.name}</button>)}
                </div>
              </div>

              {_dryers.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-slate-400 font-bold mb-3 text-sm uppercase tracking-widest flex items-center"><Flame className="w-4 h-4 mr-2"/> Ciclos de Secado (Opcional)</p>
                  <div className="space-y-2">
                    {_dryers.map(d => {
                      const count = forms.deliverOrder.dryerCycles[d.id] || 0;
                      return (
                        <div key={d.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                          <span className="font-bold text-slate-700">{d.name}</span>
                          <div className="flex items-center bg-white rounded-xl shadow-sm border border-slate-100 p-1">
                            <button onClick={() => {vibrate(); updateForm('deliverOrder', 'dryerCycles', {...forms.deliverOrder.dryerCycles, [d.id]: Math.max(0, count - 1)})}} className="w-8 h-8 rounded-lg font-black text-slate-500 bg-slate-50 active:scale-90">-</button>
                            <span className="w-10 text-center font-black text-slate-800 num-font">{count}</span>
                            <button onClick={() => {vibrate(); updateForm('deliverOrder', 'dryerCycles', {...forms.deliverOrder.dryerCycles, [d.id]: count + 1})}} className="w-8 h-8 rounded-lg font-black text-slate-700 bg-slate-100 active:scale-90">+</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4"><button onClick={() => {vibrate(); toggleModal('deliverOrder')}} className="flex-1 py-5 font-black text-slate-500 bg-slate-100 rounded-2xl active:scale-95 transition-transform">Volver</button><button onClick={() => {vibrate(); confirmDelivery()}} disabled={!forms.deliverOrder.deliveredBy} className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-slate-400">Despachar</button></div>
            </div>
          </div>
        )}

        {/* Modal Crear Secadora */}
        {modals.dryer && (
          <div className="fixed inset-0 z-[1000] bg-slate-900/40 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-t-[2.5rem] md:rounded-[3rem] p-8 md:p-10 space-y-6 shadow-2xl animate-in slide-in-from-bottom-10 md:zoom-in-95">
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">Nueva Secadora</h3>
              <input type="text" placeholder="Ej. Secadora 1 (Pequeña)" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 font-bold outline-none focus:border-blue-500 text-lg placeholder:text-slate-300" value={forms.dryer.name} onChange={e => updateForm('dryer', 'name', e.target.value)} />
              <div className="flex gap-4 pt-6"><button onClick={() => {vibrate(); toggleModal('dryer')}} className="flex-1 py-5 font-black text-slate-500 bg-slate-100 rounded-2xl active:scale-95 transition-transform">Cancelar</button><button onClick={() => {vibrate(); handleAddDryer()}} className="flex-1 py-5 font-black bg-slate-900 text-white rounded-2xl active:scale-95 shadow-lg shadow-slate-300 transition-transform">Registrar</button></div>
            </div>
          </div>
        )}

        {/* Modal Pago Gas Credito */}
        {modals.payGas && (
          <div className="fixed inset-0 z-[1000] bg-slate-900/40 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-t-[2.5rem] md:rounded-[3rem] p-8 md:p-10 space-y-6 shadow-2xl animate-in slide-in-from-bottom-10 md:zoom-in-95">
              <h3 className="text-3xl font-black text-slate-800 flex items-center tracking-tight"><DollarSign className="w-8 h-8 mr-3 text-rose-500"/> Pagar Cilindro</h3>
              <p className="font-bold text-slate-500 text-sm">Registra la fecha en la que estás liquidando este cilindro al proveedor.</p>
              <input type="date" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 font-bold outline-none focus:border-rose-500 text-lg text-slate-600" value={forms.payGas.date} onChange={e => updateForm('payGas', 'date', e.target.value)} />
              <div className="flex gap-4 pt-6"><button onClick={() => {vibrate(); toggleModal('payGas')}} className="flex-1 py-5 font-black text-slate-500 bg-slate-100 rounded-2xl active:scale-95 transition-transform">Cancelar</button><button onClick={() => {vibrate(); handlePayGas()}} className="flex-1 py-5 font-black bg-rose-600 text-white rounded-2xl active:scale-95 shadow-lg shadow-rose-200 transition-transform">Pagar Ahora</button></div>
            </div>
          </div>
        )}

        {/* Modal Comprar Gas */}
        {modals.gas && (
          <div className="fixed inset-0 z-[1000] bg-slate-900/40 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-t-[2.5rem] md:rounded-[3rem] p-8 md:p-10 space-y-6 shadow-2xl animate-in slide-in-from-bottom-10 md:zoom-in-95">
              <h3 className="text-3xl font-black text-slate-800 flex items-center tracking-tight"><Flame className="w-8 h-8 mr-3 text-purple-600"/> Instalar Gas</h3>
              
              <select className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 font-bold outline-none focus:border-purple-500 text-slate-700 appearance-none" value={forms.gas.dryerId} onChange={e => updateForm('gas', 'dryerId', e.target.value)}>
                <option value="" disabled>¿En qué secadora?</option>
                {_dryers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>

              <div className="flex bg-slate-100 p-1.5 rounded-2xl">{['Contado', 'Crédito'].map(t => <button key={t} onClick={() => {vibrate(); updateForm('gas', 'type', t);}} className={`flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${forms.gas.type === t ? 'bg-white text-purple-700 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>{t}</button>)}</div>
              
              <input type="date" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 font-bold outline-none focus:border-purple-500 text-lg text-slate-600" value={forms.gas.date} onChange={e => updateForm('gas', 'date', e.target.value)} />
              
              <div onClick={() => {vibrate(); setNumpad({isOpen: true, field: 'price', value: forms.gas.price, target: 'gas'})}} className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 font-black text-2xl text-slate-700 cursor-pointer num-font">
                {forms.gas.price ? `Q ${forms.gas.price}` : <span className="text-slate-300">Costo del Cilindro (Q)</span>}
              </div>

              <div className="flex gap-4 pt-4"><button onClick={() => {vibrate(); toggleModal('gas')}} className="flex-1 py-5 font-black text-slate-500 bg-slate-100 rounded-2xl active:scale-95 transition-transform">Cancelar</button><button onClick={() => {vibrate(); handleAddGas()}} className="flex-1 py-5 font-black bg-purple-600 text-white rounded-2xl active:scale-95 shadow-lg shadow-purple-200 transition-transform">Instalar</button></div>
            </div>
          </div>
        )}

        {/* Modal Vaciar Gas */}
        {modals.emptyGas && (
          <div className="fixed inset-0 z-[1000] bg-slate-900/40 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-t-[2.5rem] md:rounded-[3rem] p-8 md:p-10 space-y-6 shadow-2xl animate-in slide-in-from-bottom-10 md:zoom-in-95">
              <h3 className="text-3xl font-black text-slate-800 tracking-tight flex items-center"><Flame className="w-8 h-8 mr-3 text-slate-400"/> Fin de Cilindro</h3>
              <p className="font-bold text-slate-500 text-sm">¿Estás seguro de marcar este cilindro como vacío? Se enviará al historial con los ciclos registrados hasta ahora.</p>
              
              <div className="flex gap-4 pt-4"><button onClick={() => {vibrate(); toggleModal('emptyGas')}} className="flex-1 py-5 font-black text-slate-500 bg-slate-100 rounded-2xl active:scale-95 transition-transform">Cancelar</button><button onClick={() => {vibrate(); handleEmptyGas()}} className="flex-1 py-5 font-black bg-slate-900 text-white rounded-2xl active:scale-95 shadow-lg transition-transform">Marcar Vacío</button></div>
            </div>
          </div>
        )}

        {/* Modal Insumo */}
        {modals.supply && (
          <div className="fixed inset-0 z-[1000] bg-slate-900/40 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-t-[2.5rem] md:rounded-[3rem] p-8 md:p-10 space-y-6 shadow-2xl animate-in slide-in-from-bottom-10 md:zoom-in-95">
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">Nuevo Catálogo Insumo</h3>
              <input type="text" placeholder="Ej. Jabón Galón" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 font-bold outline-none focus:border-blue-500 text-lg placeholder:text-slate-300" value={forms.supply.name} onChange={e => updateForm('supply', 'name', e.target.value)} />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-2 block">Unidades Iniciales</label>
                  <div onClick={() => {vibrate(); setNumpad({isOpen: true, field: 'stock', value: forms.supply.stock, target: 'supply'})}} className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 font-black text-xl text-slate-700 cursor-pointer num-font">
                    {forms.supply.stock || <span className="text-slate-300">0</span>}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-rose-500 ml-2 mb-2 block">Avisar en (Min):</label>
                  <div onClick={() => {vibrate(); setNumpad({isOpen: true, field: 'minAlert', value: forms.supply.minAlert, target: 'supply'})}} className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 font-black text-xl text-rose-600 cursor-pointer num-font">
                    {forms.supply.minAlert || <span className="text-rose-300">Min.</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-4 pt-6"><button onClick={() => {vibrate(); toggleModal('supply')}} className="flex-1 py-5 font-black text-slate-500 bg-slate-100 rounded-2xl active:scale-95 transition-transform">Cancelar</button><button onClick={() => {vibrate(); handleAddSupply()}} className="flex-1 py-5 font-black bg-blue-600 text-white rounded-2xl active:scale-95 shadow-lg shadow-blue-200 transition-transform">Registrar</button></div>
            </div>
          </div>
        )}

        {/* Modal Reabastecer Insumo */}
        {modals.restockSupply && (
          <div className="fixed inset-0 z-[1000] bg-slate-900/40 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-t-[2.5rem] md:rounded-[3rem] p-8 md:p-10 space-y-6 shadow-2xl animate-in slide-in-from-bottom-10 md:zoom-in-95">
              <h3 className="text-3xl font-black text-slate-800 tracking-tight leading-tight flex flex-col">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center"><ShoppingBag className="w-4 h-4 mr-2"/> Comprar Insumo</span>
                {forms.restockSupply.name}
              </h3>
              
              <input type="date" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 font-bold outline-none focus:border-blue-500 text-lg text-slate-600" value={forms.restockSupply.date} onChange={e => updateForm('restockSupply', 'date', e.target.value)} />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-2 block">Cant. Comprada</label>
                  <div onClick={() => {vibrate(); setNumpad({isOpen: true, field: 'qty', value: forms.restockSupply.qty, target: 'restockSupply'})}} className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 font-black text-xl text-slate-700 cursor-pointer num-font">
                    {forms.restockSupply.qty ? `+ ${forms.restockSupply.qty}` : <span className="text-slate-300">0</span>}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-rose-500 ml-2 mb-2 block">Costo Total (Q)</label>
                  <div onClick={() => {vibrate(); setNumpad({isOpen: true, field: 'cost', value: forms.restockSupply.cost, target: 'restockSupply'})}} className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 font-black text-xl text-rose-600 cursor-pointer num-font">
                    {forms.restockSupply.cost ? `Q ${forms.restockSupply.cost}` : <span className="text-rose-300">Precio</span>}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6"><button onClick={() => {vibrate(); toggleModal('restockSupply')}} className="flex-1 py-5 font-black text-slate-500 bg-slate-100 rounded-2xl active:scale-95 transition-transform">Cancelar</button><button onClick={() => {vibrate(); handleRestockSupply()}} className="flex-1 py-5 font-black bg-slate-900 text-white rounded-2xl active:scale-95 shadow-lg shadow-slate-300 transition-transform">Registrar Compra</button></div>
            </div>
          </div>
        )}

        {/* Modal Cliente */}
        {modals.client && (
          <div className="fixed inset-0 z-[1000] bg-slate-900/40 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-t-[2.5rem] md:rounded-[3rem] p-8 md:p-10 space-y-6 shadow-2xl animate-in slide-in-from-bottom-10 md:zoom-in-95">
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">Nuevo Cliente</h3>
              <input type="text" placeholder="Nombre completo" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 font-bold outline-none focus:border-blue-500 text-lg placeholder:text-slate-300" value={forms.client.name} onChange={e => updateForm('client', 'name', e.target.value)} />
              <input type="tel" placeholder="Celular (Opcional)" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 font-bold outline-none focus:border-blue-500 text-lg placeholder:text-slate-300 num-font" value={forms.client.phone} onChange={e => updateForm('client', 'phone', e.target.value)} />
              <div className="flex gap-4 pt-6"><button onClick={() => {vibrate(); toggleModal('client')}} className="flex-1 py-5 font-black text-slate-500 bg-slate-100 rounded-2xl active:scale-95 transition-transform">Cancelar</button><button onClick={() => {vibrate(); handleAddClient()}} className="flex-1 py-5 font-black bg-blue-600 text-white rounded-2xl active:scale-95 shadow-lg shadow-blue-200 transition-transform">Guardar</button></div>
            </div>
          </div>
        )}

        {/* Modal Empleado */}
        {modals.employee && (
          <div className="fixed inset-0 z-[1000] bg-slate-900/40 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-t-[2.5rem] md:rounded-[3rem] p-8 md:p-10 space-y-6 shadow-2xl animate-in slide-in-from-bottom-10 md:zoom-in-95">
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">Alta de Personal</h3>
              <input type="text" placeholder="Nombre Corto (Ej. María)" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 font-bold outline-none focus:border-blue-500 text-lg placeholder:text-slate-300" value={forms.employee.name} onChange={e => updateForm('employee', 'name', e.target.value)} />
              <div className="flex gap-4 pt-6"><button onClick={() => {vibrate(); toggleModal('employee')}} className="flex-1 py-5 font-black text-slate-500 bg-slate-100 rounded-2xl active:scale-95 transition-transform">Cancelar</button><button onClick={() => { vibrate(); if(!forms.employee.name) return; setEmployees([{id: Date.now(), ...forms.employee}, ..._employees]); setForms(p=>({...p, employee:{name:'',phone:''}})); toggleModal('employee'); showMsg("Empleado activo", false); }} className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-200 active:scale-95 transition-transform">Ingresar</button></div>
            </div>
          </div>
        )}

        {/* Modal Servicio */}
        {modals.service && (
          <div className="fixed inset-0 z-[1000] bg-slate-900/40 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-t-[2.5rem] md:rounded-[3rem] p-8 md:p-10 space-y-6 shadow-2xl animate-in slide-in-from-bottom-10 md:zoom-in-95">
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">Crear Servicio</h3>
              <input type="text" placeholder="Ej. Lavado de Edredón" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 font-bold outline-none focus:border-emerald-500 text-lg placeholder:text-slate-300" value={forms.service.name} onChange={e => updateForm('service', 'name', e.target.value)} />
              
              <div onClick={() => {vibrate(); setNumpad({isOpen: true, field: 'basePrice', value: forms.service.basePrice, target: 'service'})}} className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 font-black text-2xl text-slate-700 cursor-pointer num-font mt-6">
                {forms.service.basePrice ? `Q ${forms.service.basePrice}` : <span className="text-slate-300">Precio Base (Q)</span>}
              </div>

              <div className="flex gap-4 pt-6"><button onClick={() => {vibrate(); toggleModal('service')}} className="flex-1 py-5 font-black text-slate-500 bg-slate-100 rounded-2xl active:scale-95 transition-transform">Cancelar</button><button onClick={() => { vibrate(); if(!forms.service.name || !forms.service.basePrice) return; setServicesConfig([..._servicesConfig, {id: Date.now(), ...forms.service}]); setForms(p=>({...p, service:{name:'',basePrice:''}})); toggleModal('service'); showMsg("Catálogo guardado", false); }} className="flex-1 py-5 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-200 active:scale-95 transition-transform">Crear</button></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ==========================================================
// 🛡️ BLINDAJE ANTIFALLOS
// ==========================================================
class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) { super(props); this.state = { hasError: false, errorInfo: null }; }
  static getDerivedStateFromError(error: any) { return { hasError: true, errorInfo: error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen bg-rose-50 flex flex-col items-center justify-center p-10 text-center">
          <AlertCircle className="w-20 h-20 text-rose-500 mb-6" />
          <h1 className="text-3xl font-black text-rose-900 mb-2">Error Crítico Detectado</h1>
          <p className="text-rose-700 font-bold mb-8">El sistema se detuvo para proteger los datos.</p>
          <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-rose-200 w-full max-w-lg text-left overflow-auto">
            <p className="font-mono text-sm text-rose-600">{this.state.errorInfo?.toString()}</p>
          </div>
          <button onClick={() => window.location.reload()} className="mt-8 bg-rose-600 text-white px-8 py-4 rounded-xl font-black shadow-lg active:scale-95">Reiniciar Sistema</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <LavOSMain />
    </ErrorBoundary>
  );
}