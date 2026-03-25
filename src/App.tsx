import React, { useState, useMemo, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { 
  LayoutDashboard, Users, ClipboardList, Flame, Droplets, DollarSign, AlertCircle, Plus, CheckCircle, Trash2, Settings, BarChart3, PieChart, Search, Cloud, ChevronRight, Minus, LogOut, Lock, Store, ArrowUpCircle, ArrowDownCircle, MapPin, UserCheck, Package, ShoppingCart, ShoppingBag, Download, Edit, FileText
} from 'lucide-react';

const firebaseConfig = {
  apiKey: "AIzaSyCuNedhnzspVDSqwmv09fSjodUDgHS95-I",
  authDomain: "lavos-13433.firebaseapp.com",
  projectId: "lavos-13433",
  storageBucket: "lavos-13433.firebasestorage.app",
  messagingSenderId: "526488470697",
  appId: "1:526488470697:web:c459b2753849cf8f2f95b8",
  measurementId: "G-15K0XKNEHM"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storeId = "sucursal_morales_1"; 

const formatMoney = (a: number) => a.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const getLocalDateString = (d = new Date()) => { const o = d.getTimezoneOffset() * 60000; return new Date(d.getTime() - o).toISOString().split('T')[0]; };
const vibrate = () => { try { if (typeof window !== 'undefined' && navigator && navigator.vibrate) navigator.vibrate(40); } catch (e) {} };

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const YEARS = [2024, 2025, 2026, 2027, 2028];

function LavOSMain() {
  const [currentUser, setCurrentUser] = useState<any>(null); 
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [loginPin, setLoginPin] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('panel');
  const [isCloudReady, setIsCloudReady] = useState(false);
  const [cloudError, setCloudError] = useState(false);

  const [_clients, _setClients] = useState<any[]>([]);
  const [_servicesConfig, _setServicesConfig] = useState<any[]>([]);
  const [_orders, _setOrders] = useState<any[]>([]);
  const [_dryers, _setDryers] = useState<any[]>([]);
  const [_gasCylinders, _setGasCylinders] = useState<any[]>([]);
  const [_supplies, _setSupplies] = useState<any[]>([]);
  const [_employees, _setEmployees] = useState<any[]>([]);
  const [_transactions, _setTransactions] = useState<any[]>([]);
  const [_txCategories, _setTxCategories] = useState({ in: ['Venta Producto', 'Otros Ingresos'], out: ['Insumos', 'Mantenimiento', 'Planilla', 'Luz / Agua', 'Otros'] });
  const [_pins, _setPins] = useState({ admin: '1234', employee: '0000' });

  useEffect(() => {
    const initAuth = async () => { try { await signInAnonymously(auth); } catch (e) { setCloudError(true); setIsCloudReady(true); } };
    initAuth();
    const unsub = onAuthStateChanged(auth, (user) => { setFirebaseUser(user); if (user) setCloudError(false); else { setCloudError(true); setIsCloudReady(true); } });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!db || !firebaseUser) return;
    const unsub = onSnapshot(doc(db, 'negocios', storeId, 'datos', 'estado_maestro'), (docSnap) => {
      if (docSnap.exists()) {
        const d = docSnap.data();
        if (d.clients) _setClients(d.clients);
        if (d.servicesConfig) _setServicesConfig(d.servicesConfig);
        if (d.orders) _setOrders(d.orders);
        if (d.dryers) _setDryers(d.dryers);
        if (d.gasCylinders) _setGasCylinders(d.gasCylinders);
        if (d.supplies) _setSupplies(d.supplies);
        if (d.employees) _setEmployees(d.employees);
        if (d.transactions) _setTransactions(d.transactions);
        if (d.txCategories) _setTxCategories(d.txCategories);
        if (d.pins) _setPins(d.pins);
      } else {
        setDoc(doc(db, 'negocios', storeId, 'datos', 'estado_maestro'), { clients: [], servicesConfig: [], orders: [], dryers: [], gasCylinders: [], supplies: [], employees: [], transactions: [], txCategories: { in: ['Venta Producto', 'Otros Ingresos'], out: ['Insumos', 'Mantenimiento', 'Planilla', 'Luz / Agua', 'Otros'] }, pins: { admin: '1234', employee: '0000' } }, { merge: true });
      }
      setIsCloudReady(true);
    }, () => { setCloudError(true); setIsCloudReady(true); });
    return () => unsub();
  }, [firebaseUser]);

  const saveToCloud = async (key: string, value: any) => { if (!firebaseUser) return; try { await setDoc(doc(db, 'negocios', storeId, 'datos', 'estado_maestro'), { [key]: value }, { merge: true }); } catch (e) {} };

  const setClients = (v:any) => { _setClients(v); saveToCloud('clients', v); };
  const setServicesConfig = (v:any) => { _setServicesConfig(v); saveToCloud('servicesConfig', v); };
  const setOrders = (v:any) => { _setOrders(v); saveToCloud('orders', v); };
  const setDryers = (v:any) => { _setDryers(v); saveToCloud('dryers', v); };
  const setGasCylinders = (v:any) => { _setGasCylinders(v); saveToCloud('gasCylinders', v); };
  const setSupplies = (v:any) => { _setSupplies(v); saveToCloud('supplies', v); };
  const setEmployees = (v:any) => { _setEmployees(v); saveToCloud('employees', v); };
  const setTransactions = (v:any) => { _setTransactions(v); saveToCloud('transactions', v); };
  const setTxCategories = (v:any) => { _setTxCategories(v); saveToCloud('txCategories', v); };
  const setPins = (v:any) => { _setPins(v); saveToCloud('pins', v); };

  const [dateFilter, setDateFilter] = useState({ type: 'día', dayType: 'hoy', specificDate: getLocalDateString(), month: new Date().getMonth() + 1, year: new Date().getFullYear() });
  const [activeOrderTab, setActiveOrderTab] = useState('activas');
  const [activeInvTab, setActiveInvTab] = useState('insumos');
  const [activeGasTab, setActiveGasTab] = useState('activos');
  
  const [modals, setModals] = useState({ client: false, deliverOrder: false, employee: false, service: false, transaction: false, supply: false, gas: false, emptyGas: false, category: false, restockSupply: false, dryer: false, payGas: false, wipeData: false, editOrder: false, deleteTx: false, deleteOrder: false, viewOrder: false });
  const [uiError, setUiError] = useState('');
  const [uiSuccess, setUiSuccess] = useState('');
  const [numpad, setNumpad] = useState({ isOpen: false, field: null as any, value: '', target: 'order' });
  const [posSearchTerm, setPosSearchTerm] = useState('');
  const [orderSearchTerm, setOrderSearchTerm] = useState(''); 
  
  const [forms, setForms] = useState({
    client: { name: '', phone: '' },
    pins: { admin: '', employee: '' },
    deliverOrder: { order: null as any, deliveredBy: '', dryerCycles: {} as Record<string, number> },
    employee: { name: '', phone: '' },
    service: { name: '', basePrice: '' },
    transaction: { id: null as any, type: 'ENTRADA', amount: '', category: '', desc: '', date: getLocalDateString() },
    supply: { name: '', stock: '', minAlert: '' },
    restockSupply: { id: null as any, name: '', qty: '', cost: '', date: getLocalDateString() },
    gas: { dryerId: '', price: '', type: 'Contado', date: getLocalDateString() },
    payGas: { id: null as any, date: getLocalDateString() },
    emptyGas: { id: null as any },
    category: { type: 'SALIDA', name: '' },
    dryer: { name: '' },
    wipe: { confirmText: '' },
    editOrder: { id: null as any, manualPrice: '', bags: '', status: '' },
    deleteTx: { id: null as any },
    deleteOrder: { order: null as any },
    viewOrder: null as any
  });
  const [orderForm, setOrderForm] = useState({ clientId: '', requestDate: getLocalDateString(), bags: '', serviceId: '', priority: 'Media', manualPrice: 0, receivedBy: '' });

  const isDateInRange = (dateStr: string, filter = dateFilter) => {
    if (!dateStr) return true;
    const d = new Date(dateStr + 'T12:00:00'); const t = new Date(); t.setHours(12, 0, 0, 0);
    switch (filter.type) {
      case 'día': 
        if (filter.dayType === 'hoy') return dateStr === getLocalDateString();
        if (filter.dayType === 'ayer') {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          return dateStr === getLocalDateString(yesterday);
        }
        if (filter.dayType === 'custom') return dateStr === filter.specificDate;
        return true;
      case 'quincena': return d >= new Date(t.setDate(t.getDate() <= 15 ? 1 : 16)) && d <= new Date();
      case 'mes': return (d.getMonth() + 1) === filter.month && d.getFullYear() === filter.year;
      case 'año': return d.getFullYear() === filter.year;
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
                  }).sort((a, b) => (w[b.priority] - w[a.priority]) || (new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime()));
  }, [_orders, activeOrderTab, dateFilter, orderSearchTerm, _clients]);

  const showMsg = (msg:string, isErr = true) => { isErr ? setUiError(msg) : setUiSuccess(msg); setTimeout(() => {setUiError(''); setUiSuccess('')}, 3000); };
  const updateForm = (f:string, field:string, val:any) => setForms(prev => ({ ...prev, [f]: { ...(prev as any)[f], [field]: val } }));
  const toggleModal = (m:string) => setModals(prev => ({ ...prev, [m]: !(prev as any)[m] }));

  const handlePinInput = (n:string) => {
    vibrate();
    if(n === 'DEL') { setLoginPin(loginPin.slice(0, -1)); return; }
    const newPin = loginPin + n;
    if (newPin.length <= 4) setLoginPin(newPin);
    if (newPin === _pins.admin) { setCurrentUser({ role: 'admin', name: 'Dueño' }); setActiveTab('panel'); setLoginPin(''); }
    else if (newPin === _pins.employee) { setCurrentUser({ role: 'employee', name: 'Mostrador' }); setActiveTab('mostrador'); setLoginPin(''); }
    else if (newPin.length === 4) { setLoginError('PIN Incorrecto'); setTimeout(() => {setLoginPin(''); setLoginError('');}, 1000); }
  };

  const handleNumpadAccept = () => {
    vibrate();
    if (numpad.target === 'order') setOrderForm({...orderForm, [numpad.field]: numpad.value});
    else if (numpad.target === 'transaction') updateForm('transaction', numpad.field, numpad.value);
    else if (numpad.target === 'gas') updateForm('gas', numpad.field, numpad.value);
    else if (numpad.target === 'supply') updateForm('supply', numpad.field, numpad.value);
    else if (numpad.target === 'restockSupply') updateForm('restockSupply', numpad.field, numpad.value);
    else if (numpad.target === 'service') updateForm('service', numpad.field, numpad.value);
    else if (numpad.target === 'editOrder') updateForm('editOrder', numpad.field, numpad.value);
    setNumpad({isOpen: false, value: '', field: null, target: 'order'});
  };

  const handleNumpadInput = (n:string) => { vibrate(); setNumpad(prev => ({ ...prev, value: n === 'DEL' ? prev.value.slice(0, -1) : prev.value + n })); };

  // --- REVERSIÓN AUTOMÁTICA (INTELIGENCIA DEL SISTEMA) ---
  const revertOrderEffects = (orderToRevert: any) => {
    const ticketId = orderToRevert.id.toString().slice(-4);
    const newTransactions = _transactions.filter(t => !t.desc.includes(`#${ticketId}`));
    setTransactions(newTransactions);
    
    if (orderToRevert.dryerCycles) {
      let updatedGas = [..._gasCylinders];
      Object.entries(orderToRevert.dryerCycles).forEach(([dId, count]) => {
        const activeGasIndex = updatedGas.findIndex(g => g.dryerId === parseInt(dId) && g.status === 'Activo');
        if (activeGasIndex >= 0) {
           updatedGas[activeGasIndex] = { ...updatedGas[activeGasIndex], cycles: Math.max(0, (updatedGas[activeGasIndex].cycles || 0) - Number(count)) };
        }
      });
      setGasCylinders(updatedGas);
    }
  };

  // --- LOGICA DE NEGOCIO ---
  const handleAddClient = () => {
    if (!forms.client.name) return showMsg("Falta el nombre");
    const newClient = { id: Date.now(), ...forms.client };
    setClients([newClient, ..._clients]);
    setForms(p => ({ ...p, client: { name: '', phone: '' } }));
    toggleModal('client');
    if (activeTab === 'mostrador') setOrderForm(p => ({ ...p, clientId: newClient.id }));
    showMsg("Cliente registrado", false);
  };

  const handleSaveOrder = () => {
    vibrate();
    if (!orderForm.clientId || !orderForm.serviceId || !orderForm.receivedBy) return showMsg("Faltan datos");
    if (!orderForm.bags || orderForm.bags === '0') return showMsg("Añade bolsas/piezas");
    const newOrder = { id: Date.now(), ...orderForm, total: parseFloat(orderForm.manualPrice.toString()), status: 'Pendiente', isPaid: false, deliveredBy: null };
    setOrders([newOrder, ..._orders]);
    setOrderForm({ clientId: '', requestDate: getLocalDateString(), bags: '', serviceId: '', priority: 'Media', manualPrice: 0, receivedBy: orderForm.receivedBy });
    showMsg("Orden procesada", false);
    setActiveTab('ordenes');
  };

  const confirmDelivery = () => {
    if (!forms.deliverOrder.deliveredBy) return showMsg("Selecciona quién entregó");
    const o = forms.deliverOrder.order;
    let updatedGas = [..._gasCylinders];
    Object.entries(forms.deliverOrder.dryerCycles).forEach(([dId, count]) => {
      if (count > 0) {
        const activeGasIndex = updatedGas.findIndex(g => g.dryerId === parseInt(dId) && g.status === 'Activo');
        if (activeGasIndex >= 0) updatedGas[activeGasIndex] = { ...updatedGas[activeGasIndex], cycles: (updatedGas[activeGasIndex].cycles || 0) + Number(count) };
      }
    });
    setGasCylinders(updatedGas);
    
    const client = _clients.find(c => c.id === o.clientId)?.name || 'Cliente';
    // Genera automáticamente el registro en la Caja (Movimientos) usando últimos 4 dígitos
    setTransactions([{ id: Date.now(), type: 'ENTRADA', amount: o.total, category: 'Servicios', date: getLocalDateString(), desc: `Ticket #${o.id.toString().slice(-4)} - ${client}` }, ..._transactions]);
    
    setOrders(_orders.map(x => x.id === o.id ? { ...x, status: 'Entregado', isPaid: true, paidDate: getLocalDateString(), deliveredBy: parseInt(forms.deliverOrder.deliveredBy), dryerCycles: forms.deliverOrder.dryerCycles } : x));
    
    toggleModal('deliverOrder');
    showMsg("Cobro registrado y orden entregada", false);
  };

  const handleUpdateOrderStatus = (id:number, newStatus:string) => { 
    const order = _orders.find(o => o.id === id);
    if (!order) return;

    if (order.status === 'Entregado' && newStatus !== 'Entregado') {
      // Reversión Automática al cambiar estado
      revertOrderEffects(order);
      setOrders(_orders.map(o => o.id === id ? { ...o, status: newStatus, isPaid: false, paidDate: null, deliveredBy: null, dryerCycles: null } : o));
      showMsg("Ingreso eliminado y orden revertida", false);
    } else {
      setOrders(_orders.map(o => o.id === id ? { ...o, status: newStatus } : o)); 
    }
  };
  
  const handleEditOrder = () => {
    const originalOrder = _orders.find(o => o.id === forms.editOrder.id);
    if (!originalOrder) return;

    if (originalOrder.status === 'Entregado' && forms.editOrder.status !== 'Entregado') {
       revertOrderEffects(originalOrder);
       setOrders(_orders.map(o => o.id === forms.editOrder.id ? { ...o, total: parseFloat(forms.editOrder.manualPrice), bags: forms.editOrder.bags, status: forms.editOrder.status, isPaid: false, paidDate: null, deliveredBy: null, dryerCycles: null } : o));
       showMsg("Orden revertida y actualizada", false);
    } else {
       if (originalOrder.isPaid && originalOrder.total !== parseFloat(forms.editOrder.manualPrice)) {
          const ticketId = originalOrder.id.toString().slice(-4);
          setTransactions(_transactions.map(t => t.desc.includes(`#${ticketId}`) ? { ...t, amount: parseFloat(forms.editOrder.manualPrice) } : t));
       }
       setOrders(_orders.map(o => o.id === forms.editOrder.id ? { ...o, total: parseFloat(forms.editOrder.manualPrice), bags: forms.editOrder.bags, status: forms.editOrder.status } : o));
       showMsg("Orden actualizada", false);
    }
    toggleModal('editOrder');
  };

  const handleAddTransaction = () => {
    if (!forms.transaction.amount || !forms.transaction.category) return showMsg("Llena monto y categoría");
    
    if (forms.transaction.id) {
      setTransactions(_transactions.map(t => t.id === forms.transaction.id ? { ...t, type: forms.transaction.type as any, amount: parseFloat(forms.transaction.amount), category: forms.transaction.category, date: forms.transaction.date || getLocalDateString(), desc: forms.transaction.desc } : t));
      showMsg("Movimiento actualizado", false);
    } else {
      setTransactions([{ id: Date.now(), type: forms.transaction.type, amount: parseFloat(forms.transaction.amount), category: forms.transaction.category, date: forms.transaction.date || getLocalDateString(), desc: forms.transaction.desc }, ..._transactions]);
      showMsg("Movimiento guardado", false);
    }
    
    if (modals.transaction) toggleModal('transaction');
    setForms(p => ({ ...p, transaction: { id: null, type: 'ENTRADA', amount: '', category: _txCategories.in[0] || '', desc: '', date: getLocalDateString() } }));
  };

  const handleViewTicket = (desc: string) => {
    vibrate();
    const match = desc.match(/Ticket #(\d+)/);
    if(match && match[1]) {
      const ticketId = match[1];
      const order = _orders.find(o => o.id.toString().slice(-4) === ticketId);
      if(order) {
         setForms(p => ({...p, viewOrder: order}));
         toggleModal('viewOrder');
      } else {
         showMsg("El ticket original ya no existe o fue eliminado");
      }
    }
  };

  const handleAddCategory = () => {
    if (!forms.category.name) return showMsg("Nombre vacío");
    const target = forms.category.type === 'ENTRADA' ? 'in' : 'out';
    if (_txCategories[target].includes(forms.category.name)) return showMsg("Ya existe");
    setTxCategories({ ..._txCategories, [target]: [..._txCategories[target], forms.category.name] });
    toggleModal('category');
    showMsg("Categoría agregada", false);
  };

  const handleDeleteCategory = (type:'in'|'out', name:string) => { vibrate(); setTxCategories({ ..._txCategories, [type]: _txCategories[type].filter((c:string) => c !== name) }); };

  const handleAddDryer = () => {
    if (!forms.dryer.name) return showMsg("Nombre vacío");
    setDryers([..._dryers, { id: Date.now(), name: forms.dryer.name }]);
    toggleModal('dryer');
    showMsg("Secadora guardada", false);
  };

  const handleAddGas = () => {
    if (!forms.gas.price || !forms.gas.dryerId) return showMsg("Faltan datos");
    const price = parseFloat(forms.gas.price);
    const isPaid = forms.gas.type === 'Contado';
    setGasCylinders([{ id: Date.now(), dryerId: parseInt(forms.gas.dryerId), entryDate: forms.gas.date, price, type: forms.gas.type, isPaid: isPaid, status: 'Activo', emptyDate: null, cycles: 0 }, ..._gasCylinders]);
    if (isPaid) setTransactions([{ id: Date.now(), type: 'SALIDA', amount: price, category: _txCategories.out.includes('Mantenimiento') ? 'Mantenimiento' : (_txCategories.out[0] || 'Gasto'), date: forms.gas.date, desc: `Gas (Contado)` }, ..._transactions]);
    toggleModal('gas');
    showMsg("Gas instalado", false);
  };

  const handlePayGas = () => {
    const cyl = _gasCylinders.find(g => g.id === forms.payGas.id);
    if(!cyl) return;
    setGasCylinders(_gasCylinders.map(g => g.id === forms.payGas.id ? { ...g, isPaid: true, payDate: forms.payGas.date } : g));
    setTransactions([{ id: Date.now(), type: 'SALIDA', amount: cyl.price, category: _txCategories.out.includes('Mantenimiento') ? 'Mantenimiento' : (_txCategories.out[0] || 'Gasto'), date: forms.payGas.date, desc: `Pago atrasado Gas` }, ..._transactions]);
    toggleModal('payGas');
    showMsg("Pago registrado", false);
  };

  const handleEmptyGas = () => {
    setGasCylinders(_gasCylinders.map(g => g.id === forms.emptyGas.id ? { ...g, status: 'Vacio', emptyDate: getLocalDateString() } : g));
    toggleModal('emptyGas');
    showMsg("Cilindro archivado", false);
  };

  const handleAddSupply = () => {
    if (!forms.supply.name) return showMsg("Falta el nombre");
    setSupplies([{ id: Date.now(), name: forms.supply.name, stock: parseInt(forms.supply.stock||'0'), minAlert: parseInt(forms.supply.minAlert||'0') }, ..._supplies]);
    toggleModal('supply');
    showMsg("Insumo agregado", false);
  };

  const handleRestockSupply = () => {
    if (!forms.restockSupply.qty || !forms.restockSupply.cost) return showMsg("Faltan datos");
    const cost = parseFloat(forms.restockSupply.cost);
    const qty = parseInt(forms.restockSupply.qty);
    setSupplies(_supplies.map(s => s.id === forms.restockSupply.id ? { ...s, stock: s.stock + qty } : s));
    setTransactions([{ id: Date.now(), type: 'SALIDA', amount: cost, category: _txCategories.out.includes('Insumos') ? 'Insumos' : (_txCategories.out[0] || 'Gasto'), date: forms.restockSupply.date, desc: `Compra: ${forms.restockSupply.name} (${qty} und.)` }, ..._transactions]);
    toggleModal('restockSupply');
    showMsg("Bodega actualizada", false);
  };

  // REPORTE CSV EMPRESARIAL Y PROFESIONAL
  const handleDownloadCSV = () => {
    vibrate();
    const totalIn = filteredTransactions.filter(t => t.type === 'ENTRADA').reduce((s,t) => s + t.amount, 0);
    const totalOut = filteredTransactions.filter(t => t.type === 'SALIDA').reduce((s,t) => s + t.amount, 0);
    const netProfit = totalIn - totalOut;

    // BOM UTF-8 para que Excel y Numbers lean los acentos correctamente
    let csvContent = '\uFEFF';
    
    // Cabecera Profesional
    csvContent += "LAVANDERIA MORALES - ESTADO DE RESULTADOS\n";
    csvContent += `Fecha de reporte:,${getLocalDateString()}\n\n`;
    
    csvContent += "RESUMEN FINANCIERO\n";
    csvContent += `Ingresos Brutos:,Q${totalIn.toFixed(2)}\n`;
    csvContent += `Gastos Operativos:,Q${totalOut.toFixed(2)}\n`;
    csvContent += `Utilidad Neta:,Q${netProfit.toFixed(2)}\n\n`;
    
    csvContent += "DETALLE DE MOVIMIENTOS\n";
    const headers = ['Fecha', 'Tipo', 'Categoria', 'Monto (Q)', 'Descripcion'];
    csvContent += headers.join(',') + '\n';
    
    // Filas de datos
    filteredTransactions.forEach(t => {
      const safeDesc = t.desc ? t.desc.replace(/"/g, '""') : '';
      csvContent += `${t.date},${t.type},${t.category},${t.amount},"${safeDesc}"\n`;
    });

    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Reporte_LavOS_Morales_${getLocalDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showMsg("Reporte Profesional Descargado", false);
  };

  // ==========================================================
  // 🎨 RENDERS DE VISTAS (Pestañas)
  // ==========================================================

  const renderDashboard = () => {
    const totalIn = filteredTransactions.filter(t => t.type === 'ENTRADA').reduce((s,t) => s + t.amount, 0);
    const totalOut = filteredTransactions.filter(t => t.type === 'SALIDA').reduce((s,t) => s + t.amount, 0);
    const net = totalIn - totalOut;

    return (
      <div className="space-y-6 pb-24 md:pb-6 animate-in fade-in duration-300 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100/50 min-w-0">
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest truncate">Ingresos Brutos</p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 num-font mt-1 break-all leading-tight">Q{formatMoney(totalIn)}</p>
          </div>
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100/50 min-w-0">
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest truncate">Gastos / Salidas</p>
            <p className="text-2xl sm:text-3xl font-black text-rose-600 num-font mt-1 break-all leading-tight">Q{formatMoney(totalOut)}</p>
          </div>
          <div className={`p-6 md:p-8 rounded-[2rem] shadow-xl flex flex-col justify-center min-w-0 ${net >= 0 ? 'bg-slate-900 border border-slate-800' : 'bg-rose-600 border border-rose-500'}`}>
            <p className="text-white/50 font-bold uppercase text-[10px] tracking-widest truncate">Caja Fuerte (Líquido)</p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-white num-font mt-1 break-all leading-tight">Q{formatMoney(net)}</p>
          </div>
        </div>
        
        <h3 className="font-black text-xl text-slate-800 mt-10 mb-4 px-2 tracking-tight">Acciones Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div onClick={() => {vibrate(); setActiveTab('insumos')}} className="bg-orange-50 p-6 rounded-[2rem] active:scale-95 transition-transform cursor-pointer border-2 border-orange-100 hover:border-orange-200 relative overflow-hidden group">
            <Flame className="w-8 h-8 text-orange-500 mb-3 group-hover:scale-110 transition-transform"/>
            <h4 className="font-black text-orange-950 truncate">Insumos</h4>
            {_supplies.filter(s => s.stock <= s.minAlert).length > 0 && <span className="absolute top-5 right-5 bg-rose-500 w-4 h-4 rounded-full border-2 border-orange-50 animate-pulse"></span>}
          </div>
          <div onClick={() => {vibrate(); setActiveTab('ordenes')}} className="bg-blue-50 p-6 rounded-[2rem] active:scale-95 transition-transform cursor-pointer border-2 border-blue-100 hover:border-blue-200 group">
            <ShoppingCart className="w-8 h-8 text-blue-500 mb-3 group-hover:scale-110 transition-transform"/>
            <h4 className="font-black text-blue-950 truncate">{_orders.filter(o => o.status !== 'Entregado').length} Órdenes</h4>
          </div>
          <div onClick={() => {vibrate(); setActiveTab('reportes')}} className="bg-purple-50 p-6 rounded-[2rem] active:scale-95 transition-transform cursor-pointer border-2 border-purple-100 hover:border-purple-200 group">
            <BarChart3 className="w-8 h-8 text-purple-500 mb-3 group-hover:scale-110 transition-transform"/>
            <h4 className="font-black text-purple-950 truncate">Reportes</h4>
          </div>
          <div onClick={() => {vibrate(); setActiveTab('ajustes')}} className="bg-emerald-50 p-6 rounded-[2rem] active:scale-95 transition-transform cursor-pointer border-2 border-emerald-100 hover:border-emerald-200 group">
            <Settings className="w-8 h-8 text-emerald-500 mb-3 group-hover:scale-110 transition-transform"/>
            <h4 className="font-black text-emerald-950 truncate">Catálogo</h4>
          </div>
        </div>
      </div>
    );
  };

  const renderMostrador = () => {
    const filteredClients = _clients.filter(c => c.name.toLowerCase().includes(posSearchTerm.toLowerCase()));
    const selectedClient = _clients.find(c => c.id === orderForm.clientId);
    
    return (
      <div className="flex flex-col lg:flex-row gap-6 h-full pb-40 md:pb-6 relative animate-in fade-in duration-300 w-full">
        
        {/* COLUMNA 1: INFO Y CLIENTE */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col relative z-10">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-black text-slate-400 text-[11px] uppercase tracking-widest flex items-center"><UserCheck className="w-4 h-4 mr-2"/> 1. El Cliente</h3>
              {!orderForm.clientId && <button onClick={() => toggleModal('client')} className="bg-slate-900 text-white p-2 rounded-xl active:scale-90 transition-transform shadow-lg shadow-slate-200"><Plus className="w-5 h-5"/></button>}
            </div>
            {orderForm.clientId ? (
              <div className="bg-blue-600 border border-blue-700 p-5 rounded-2xl flex justify-between items-center shadow-lg shadow-blue-200">
                <div className="min-w-0 flex-1"><p className="font-black text-white text-xl tracking-tight truncate pr-2">{selectedClient?.name}</p><p className="text-sm font-bold text-blue-200 truncate">{selectedClient?.phone || 'Sin número'}</p></div>
                <button onClick={() => {vibrate(); setOrderForm({...orderForm, clientId: ''}); setPosSearchTerm('')}} className="bg-white/20 hover:bg-white/30 text-white px-4 py-3 rounded-xl font-black text-xs transition-colors backdrop-blur-md shrink-0">Cambiar</button>
              </div>
            ) : (
              <div className="flex flex-col h-64 lg:h-[400px]">
                <div className="relative mb-4 shrink-0"><Search className="absolute left-4 top-4 w-5 h-5 text-slate-400"/><input type="text" placeholder="Buscar cliente..." className="w-full bg-slate-50 p-4 pl-12 rounded-2xl font-bold border-2 border-slate-100 outline-none focus:border-blue-500 transition-all text-lg placeholder:text-slate-300" value={posSearchTerm} onChange={e => setPosSearchTerm(e.target.value)} /></div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-2 touch-pan-y no-scrollbar">
                  {filteredClients.map(c => <button key={c.id} onClick={() => {vibrate(); setOrderForm({...orderForm, clientId: c.id})}} className="w-full text-left p-4 border-2 border-slate-50 hover:border-slate-200 active:bg-slate-100 rounded-2xl font-bold text-slate-700 transition-all text-lg truncate">{c.name}</button>)}
                  {filteredClients.length === 0 && <p className="text-center text-slate-400 font-bold mt-4">No hay resultados.</p>}
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 className="font-black text-slate-400 text-[11px] uppercase tracking-widest mb-4 flex items-center"><Users className="w-4 h-4 mr-2"/> 2. Recibido Por</h3>
            <div className="flex overflow-x-auto gap-3 pb-2 touch-pan-x snap-x no-scrollbar">
              {_employees.map(e => (
                <button key={e.id} onClick={() => {vibrate(); setOrderForm({...orderForm, receivedBy: e.id})}} className={`snap-start whitespace-nowrap px-6 py-4 rounded-2xl font-black transition-all active:scale-95 text-lg ${orderForm.receivedBy === e.id ? 'bg-slate-900 text-white shadow-xl shadow-slate-300' : 'bg-slate-50 text-slate-500 border-2 border-slate-100'}`}>
                  {e.name}
                </button>
              ))}
              {_employees.length === 0 && <p className="text-rose-500 font-bold text-sm">Debes agregar empleados en Ajustes.</p>}
            </div>
          </div>
        </div>

        {/* COLUMNA 2: DETALLES Y ACCIÓN */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4 relative">
           <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
             <div className="flex justify-between items-center mb-5 gap-2">
                <h3 className="font-black text-slate-400 text-[11px] uppercase tracking-widest flex items-center truncate"><Package className="w-4 h-4 mr-2 shrink-0"/> 3. Detalles del Servicio</h3>
                <input type="date" className="bg-slate-50 border-2 border-slate-100 p-2 rounded-xl font-bold text-sm text-slate-600 outline-none focus:border-blue-500 shrink-0" value={orderForm.requestDate} onChange={e => currentUser.role === 'admin' && setOrderForm({...orderForm, requestDate: e.target.value})} disabled={currentUser.role === 'employee'} />
             </div>
             
             <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
               {_servicesConfig.map(s => (
                 <button key={s.id} onClick={() => {vibrate(); setOrderForm({...orderForm, serviceId: s.id, manualPrice: s.basePrice})}} className={`p-4 rounded-2xl border-2 font-bold text-left transition-all active:scale-95 flex flex-col justify-center min-w-0 ${orderForm.serviceId === s.id ? 'bg-blue-100 border-blue-500 text-blue-900 shadow-inner' : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-300'}`}>
                   <p className="leading-tight text-sm md:text-base mb-1 truncate w-full">{s.name}</p>
                   <p className={`text-sm font-black num-font truncate w-full ${orderForm.serviceId === s.id ? 'text-blue-600' : 'text-slate-400'}`}>Q{formatMoney(Number(s.basePrice))}</p>
                 </button>
               ))}
               {_servicesConfig.length === 0 && <div className="col-span-full p-8 bg-slate-50 rounded-2xl text-center text-slate-400 font-bold border-2 border-dashed border-slate-200">No hay servicios configurados. Agrégalos en Ajustes.</div>}
             </div>

             <div className="grid grid-cols-2 gap-4">
               <button onClick={() => {vibrate(); setNumpad({isOpen: true, field: 'bags', value: orderForm.bags.toString(), target: 'order'})}} className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-[2rem] border-2 border-slate-100 active:bg-slate-200 transition-colors min-w-0">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 truncate w-full text-center">Bolsas o Piezas</span>
                 <span className="text-4xl md:text-5xl font-black text-slate-800 num-font tracking-tighter truncate w-full text-center">{orderForm.bags || '0'}</span>
               </button>
               
               <button onClick={() => {vibrate(); setNumpad({isOpen: true, field: 'manualPrice', value: orderForm.manualPrice.toString(), target: 'order'})}} className="flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 transition-colors min-w-0 bg-emerald-50 border-emerald-200 active:bg-emerald-100">
                 <span className="text-[10px] font-black text-emerald-600/70 uppercase tracking-widest mb-1 truncate w-full text-center">Precio Cobrado</span>
                 <span className="text-4xl md:text-5xl font-black text-emerald-600 num-font tracking-tighter truncate w-full text-center">Q{orderForm.manualPrice || '0'}</span>
               </button>
             </div>
           </div>

           <div className="flex bg-white p-2 rounded-[2rem] shadow-sm border border-slate-100 justify-between gap-1">
               {['Baja', 'Media', 'Alta'].map(p => <button key={p} onClick={() => {vibrate(); setOrderForm({...orderForm, priority: p})}} className={`flex-1 py-4 rounded-3xl font-black text-xs md:text-sm transition-all active:scale-95 truncate ${orderForm.priority === p ? (p==='Alta'?'bg-rose-500 text-white shadow-lg shadow-rose-200':'bg-slate-900 text-white shadow-lg') : 'text-slate-400 hover:bg-slate-50'}`}>{p}</button>)}
           </div>

           <div className="mt-4 w-full z-20">
             <button onClick={handleSaveOrder} className={`w-full py-6 md:py-8 rounded-[2rem] font-black text-xl md:text-2xl transition-all active:scale-95 flex items-center justify-center ${(!orderForm.clientId || !orderForm.serviceId || !orderForm.receivedBy || !orderForm.bags || orderForm.bags === '0') ? 'bg-slate-200 text-slate-400 shadow-none' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-300'}`}>
               <CheckCircle className="w-6 h-6 md:w-8 md:h-8 mr-3 shrink-0" /> REGISTRAR ORDEN
             </button>
           </div>
        </div>
      </div>
    );
  };

  const renderOrdenes = () => {
    const statusColors:any = { 'Pendiente': 'bg-slate-100 text-slate-600', 'Lavado': 'bg-blue-100 text-blue-700', 'Secado': 'bg-orange-100 text-orange-700', 'Doblado': 'bg-purple-100 text-purple-700' };
    return (
      <div className="space-y-6 pb-24 md:pb-8 animate-in fade-in duration-300 w-full">
        
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
            
            const deliverer = o.deliveredBy ? _employees.find(e => e.id === parseInt(o.deliveredBy))?.name || 'Desconocido' : null;

            return (
              <div key={o.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col relative overflow-hidden transition-all hover:shadow-lg">
                <div className="flex justify-between items-start mb-6 gap-2">
                  <div className="flex gap-2 flex-wrap items-center">
                    <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider shrink-0 ${o.priority === 'Alta' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'}`}>{o.priority}</span>
                    {activeOrderTab === 'activas' && (
                      <select value={o.status} onChange={e => handleUpdateOrderStatus(o.id, e.target.value)} className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase outline-none cursor-pointer ${statusColors[o.status] || statusColors['Pendiente']}`}>
                        <option value="Pendiente">Pendiente</option><option value="Lavado">Lavado</option><option value="Secado">Secado</option><option value="Doblado">Doblado</option>
                      </select>
                    )}
                    {o.status === 'Entregado' && <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-xl text-[10px] font-black uppercase">Entregado</span>}
                  </div>
                  
                  {/* MODIFICACIÓN: Íconos desplazados y limpios */}
                  {activeOrderTab === 'historial' && currentUser?.role === 'admin' && (
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => { setForms(p => ({...p, editOrder: { id: o.id, manualPrice: o.total, bags: o.bags, status: o.status }})); toggleModal('editOrder'); }} className="p-2 bg-slate-50 rounded-lg text-slate-500 hover:text-blue-500 active:scale-90 transition-transform"><Edit className="w-4 h-4"/></button>
                      <button onClick={() => { vibrate(); setForms(p => ({...p, deleteOrder: { order: o }})); toggleModal('deleteOrder'); }} className="p-2 bg-rose-50 rounded-lg text-rose-500 hover:bg-rose-100 active:scale-90 transition-transform"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  )}
                </div>
                
                <h4 className="text-2xl font-black text-slate-800 leading-tight mb-1 truncate">{client?.name || 'Cliente Genérico'}</h4>
                <p className="text-blue-600 font-bold mb-6 text-sm flex items-center truncate"><Droplets className="w-4 h-4 mr-1 shrink-0"/> {service?.name}</p>
                
                <div className="flex justify-between items-center mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100 gap-2">
                   <div className="text-xs font-bold text-slate-500 space-y-2 min-w-0">
                      <p className="flex items-center text-slate-700 truncate"><Package className="w-4 h-4 mr-2 text-slate-400 shrink-0"/> {o.bags} {o.bags == 1 ? 'Bolsa' : 'Bolsas'}</p>
                      <p className="flex items-center truncate"><UserCheck className="w-4 h-4 mr-2 text-slate-400 shrink-0"/> Recibió: {receiver}</p>
                      {o.status === 'Entregado' && <p className="flex items-center truncate text-emerald-600"><CheckCircle className="w-4 h-4 mr-2 shrink-0"/> Entregó: {deliverer}</p>}
                   </div>
                   <div className="text-right shrink-0">
                     <p className="text-xl font-black text-emerald-600 num-font leading-none mb-1">Q{formatMoney(Number(o.total))}</p>
                     <p className="text-[10px] font-black text-slate-300 num-font bg-white px-2 py-0.5 rounded border inline-block">#{o.id.toString().slice(-4)}</p>
                   </div>
                </div>

                <div className="mt-auto flex gap-3">
                  <button onClick={() => { vibrate(); setForms({...forms, deliverOrder: {order: o, deliveredBy: '', dryerCycles: {}}}); toggleModal('deliverOrder'); }} disabled={o.status === 'Entregado'} className={`w-full py-4 rounded-2xl font-black text-xs transition-all flex items-center justify-center ${o.status === 'Entregado' ? 'bg-slate-50 text-slate-300' : 'bg-slate-900 text-white active:scale-95 shadow-lg shadow-slate-300'}`}>{o.status === 'Entregado' ? 'ENTREGADO' : 'ENTREGAR Y COBRAR'}</button>
                </div>
              </div>
            )
          })}
          {sortedAndFilteredOrders.length === 0 && <div className="col-span-full py-32 flex flex-col items-center justify-center text-slate-300"><ClipboardList className="w-20 h-20 mb-4 opacity-30"/><p className="font-black text-2xl">{orderSearchTerm ? 'No hay coincidencias' : 'Sin órdenes aquí'}</p></div>}
        </div>
      </div>
    );
  };

  const renderCajaFuerte = () => {
    const totalIn = filteredTransactions.filter(t => t.type === 'ENTRADA').reduce((s,t) => s + t.amount, 0);
    const totalOut = filteredTransactions.filter(t => t.type === 'SALIDA').reduce((s,t) => s + t.amount, 0);

    return (
      <div className="space-y-8 pb-32 animate-in fade-in duration-300 w-full">
         {currentUser?.role === 'employee' ? (
           <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col gap-6 max-w-lg mx-auto mt-10">
              <div className="flex items-center justify-center mb-2"><DollarSign className="w-16 h-16 text-emerald-500 bg-emerald-50 p-3 rounded-full" /></div>
              <h3 className="font-black text-3xl text-slate-800 text-center tracking-tight">Registro de Movimiento</h3>
              <p className="text-center text-slate-400 font-bold text-sm mb-4">Ingresa salidas o entradas de efectivo a la caja.</p>
              <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                {['SALIDA', 'ENTRADA'].map(t => (
                  <button key={t} onClick={() => {vibrate(); updateForm('transaction', 'type', t); updateForm('transaction', 'category', t === 'ENTRADA' ? (_txCategories.in[0] || '') : (_txCategories.out[0] || ''));}} className={`flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${forms.transaction.type === t ? (t==='ENTRADA'?'bg-emerald-500 text-white shadow-md':'bg-rose-500 text-white shadow-md') : 'text-slate-400 hover:text-slate-600'}`}>{t==='ENTRADA'?'Ingreso':'Gasto'}</button>
                ))}
              </div>
              <input type="date" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 font-bold outline-none focus:border-blue-500 text-slate-600" value={forms.transaction.date} onChange={e => updateForm('transaction', 'date', e.target.value)} />
              <select className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 font-bold outline-none focus:border-blue-500 text-slate-700 appearance-none" value={forms.transaction.category} onChange={e => updateForm('transaction', 'category', e.target.value)}>
                 {forms.transaction.type === 'ENTRADA' ? _txCategories.in.map((c:any) => <option key={c} value={c}>{c}</option>) : _txCategories.out.map((c:any) => <option key={c} value={c}>{c}</option>)}
              </select>
              <div onClick={() => {vibrate(); setNumpad({isOpen: true, field: 'amount', value: forms.transaction.amount, target: 'transaction'})}} className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 font-black text-2xl text-slate-700 cursor-pointer num-font">
                {forms.transaction.amount ? `Q ${forms.transaction.amount}` : <span className="text-slate-300">Monto Total (Q)</span>}
              </div>
              <input type="text" placeholder="Comentario / Justificación" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 font-bold outline-none focus:border-blue-500 placeholder:text-slate-300" value={forms.transaction.desc} onChange={e => updateForm('transaction', 'desc', e.target.value)} />
              <button onClick={() => {vibrate(); handleAddTransaction()}} className="w-full py-6 font-black bg-slate-900 text-white rounded-2xl active:scale-95 shadow-xl transition-transform mt-4 text-xl uppercase tracking-widest">Registrar Movimiento</button>
           </div>
         ) : (
           <>
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm gap-6">
                <div><h3 className="text-2xl font-black text-slate-800 tracking-tight">Movimientos de Efectivo</h3><p className="text-sm font-bold text-slate-400 mt-1">Registra pagos manuales, viáticos y proveedores aquí.</p></div>
                <button onClick={() => { vibrate(); setForms(p => ({...p, transaction: { id: null, type: 'SALIDA', amount: '', desc: '', category: _txCategories.out[0] || '', date: getLocalDateString() }})); toggleModal('transaction'); }} className="w-full md:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-black active:scale-95 shadow-lg shadow-slate-300">+ Registrar Acción</button>
             </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm flex flex-col">
                <div className="p-6 bg-emerald-50 border-b border-emerald-100 font-black text-emerald-800 flex items-center justify-between tracking-widest text-[10px] uppercase gap-2">
                   <span className="flex items-center truncate"><ArrowUpCircle className="w-5 h-5 mr-2 shrink-0"/> Entradas Registradas</span>
                   <span className="text-base md:text-lg num-font break-all">Q{formatMoney(totalIn)}</span>
                </div>
                <div className="divide-y border-t-0 flex-1">
                   {filteredTransactions.filter(t => t.type === 'ENTRADA').map(t => {
                     // MODIFICACIÓN: Hacer clickeable si es un Ticket
                     const isTicket = t.desc && t.desc.includes('Ticket #');
                     return (
                       <div key={t.id} className="p-6 flex justify-between items-center hover:bg-slate-50 transition-colors gap-4">
                         <div className="min-w-0 flex-1">
                           <div className={`flex items-center gap-2 ${isTicket ? 'cursor-pointer hover:opacity-70' : ''}`} onClick={() => isTicket && handleViewTicket(t.desc)}>
                             <p className="font-black text-slate-800 text-lg leading-tight truncate">{t.category}</p>
                             {isTicket && <span className="bg-blue-100 text-blue-600 text-[9px] px-2 py-1 rounded-md font-black uppercase tracking-widest shrink-0">Ver Orden</span>}
                           </div>
                           <p className="text-xs font-bold text-slate-400 mt-1 truncate">{t.desc || 'Cobro automático'}</p>
                         </div>
                         <div className="flex items-center gap-3 shrink-0">
                           <p className="text-xl md:text-2xl font-black text-emerald-600 num-font">+Q{formatMoney(t.amount)}</p>
                           {currentUser?.role === 'admin' && (
                             <div className="flex gap-1">
                               <button onClick={() => {setForms(p => ({...p, transaction: { id: t.id, type: t.type, amount: t.amount.toString(), category: t.category, desc: t.desc || '', date: t.date }})); toggleModal('transaction');}} className="p-2 text-slate-400 hover:text-blue-500 active:scale-90"><Edit className="w-4 h-4"/></button>
                               <button onClick={() => {vibrate(); setForms(p => ({...p, deleteTx: { id: t.id }})); toggleModal('deleteTx');}} className="p-2 text-slate-400 hover:text-rose-500 active:scale-90"><Trash2 className="w-4 h-4"/></button>
                             </div>
                           )}
                         </div>
                       </div>
                     );
                   })}
                   {filteredTransactions.filter(t => t.type === 'ENTRADA').length === 0 && <p className="p-8 text-center text-slate-400 font-bold">Sin ingresos registrados</p>}
                </div>
              </div>
              <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm flex flex-col">
                <div className="p-6 bg-rose-50 border-b border-rose-100 font-black text-rose-800 flex items-center justify-between tracking-widest text-[10px] uppercase gap-2">
                   <span className="flex items-center truncate"><ArrowDownCircle className="w-5 h-5 mr-2 shrink-0"/> Salidas Registradas</span>
                   <span className="text-base md:text-lg num-font break-all">Q{formatMoney(totalOut)}</span>
                </div>
                <div className="divide-y border-t-0 flex-1">
                   {filteredTransactions.filter(t => t.type === 'SALIDA').map(t => (
                     <div key={t.id} className="p-6 flex justify-between items-center hover:bg-slate-50 transition-colors gap-4">
                       <div className="min-w-0 flex-1">
                         <p className="font-black text-slate-800 text-lg leading-tight truncate">{t.category}</p>
                         <p className="text-xs font-bold text-slate-400 mt-1 truncate">{t.desc || 'Gasto registrado'}</p>
                       </div>
                       <div className="flex items-center gap-3 shrink-0">
                         <p className="text-xl md:text-2xl font-black text-rose-600 num-font">-Q{formatMoney(t.amount)}</p>
                         {currentUser?.role === 'admin' && (
                           <div className="flex gap-1">
                             <button onClick={() => {setForms(p => ({...p, transaction: { id: t.id, type: t.type, amount: t.amount.toString(), category: t.category, desc: t.desc || '', date: t.date }})); toggleModal('transaction');}} className="p-2 text-slate-400 hover:text-blue-500 active:scale-90"><Edit className="w-4 h-4"/></button>
                             <button onClick={() => {vibrate(); setForms(p => ({...p, deleteTx: { id: t.id }})); toggleModal('deleteTx');}} className="p-2 text-slate-400 hover:text-rose-500 active:scale-90"><Trash2 className="w-4 h-4"/></button>
                           </div>
                         )}
                       </div>
                     </div>
                   ))}
                   {filteredTransactions.filter(t => t.type === 'SALIDA').length === 0 && <p className="p-8 text-center text-slate-400 font-bold">Sin gastos registrados</p>}
                </div>
              </div>
            </div>
           </>
         )}
      </div>
    );
  };

  const renderReportesAnaliticos = () => {
    const totalIn = filteredTransactions.filter(t => t.type === 'ENTRADA').reduce((s,t) => s + t.amount, 0);
    const totalOut = filteredTransactions.filter(t => t.type === 'SALIDA').reduce((s,t) => s + t.amount, 0);
    const netProfit = totalIn - totalOut;

    const categoriesIn = filteredTransactions.filter(t => t.type === 'ENTRADA').reduce((acc:any, t) => { acc[t.category] = (acc[t.category] || 0) + t.amount; return acc; }, {});
    const categoriesOut = filteredTransactions.filter(t => t.type === 'SALIDA').reduce((acc:any, t) => { acc[t.category] = (acc[t.category] || 0) + t.amount; return acc; }, {});

    return (
      <div className="space-y-8 pb-32 animate-in fade-in duration-300 w-full">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm gap-6">
            <div><h3 className="text-2xl font-black text-slate-800 tracking-tight">Estado de Resultados</h3><p className="text-sm font-bold text-slate-400 mt-1">Rentabilidad y desglose por categorías.</p></div>
            <button onClick={handleDownloadCSV} className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black active:scale-95 transition-transform shadow-lg shadow-emerald-200 flex items-center justify-center shrink-0">
              <Download className="w-5 h-5 mr-2 shrink-0" /> Generar Excel (Reporte)
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative min-w-0 flex flex-col justify-center">
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-2 break-words">Ingresos Brutos</p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-600 num-font leading-tight break-all">Q{formatMoney(totalIn)}</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative min-w-0 flex flex-col justify-center">
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-2 break-words">Gastos Operativos</p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-rose-600 num-font leading-tight break-all">Q{formatMoney(totalOut)}</p>
          </div>
          <div className={`p-8 rounded-[2rem] shadow-xl border min-w-0 flex flex-col justify-center ${netProfit >= 0 ? 'bg-slate-900 border-slate-800' : 'bg-rose-600 border-rose-500'}`}>
            <p className="text-white/50 font-black uppercase text-[10px] tracking-widest mb-2 break-words">Utilidad Neta</p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-white num-font leading-tight break-all">Q{formatMoney(netProfit)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 bg-emerald-50 border-b border-emerald-100 font-black text-emerald-800 text-[11px] uppercase tracking-widest flex items-center"><PieChart className="w-4 h-4 mr-2 shrink-0"/> Origen de Ingresos</div>
            <div className="p-6 space-y-4 divide-y border-t-0 flex-1">
              {Object.keys(categoriesIn).length === 0 && <p className="text-slate-400 font-bold text-sm text-center py-4">No hay datos de ingresos en este periodo.</p>}
              {Object.entries(categoriesIn).map(([cat, amount]:any) => (
                <div key={cat} className="flex justify-between items-center pt-4 first:pt-0 gap-4"><span className="font-bold text-slate-600 text-lg break-words">{cat}</span><span className="font-black text-slate-800 text-xl num-font shrink-0">Q{formatMoney(amount)}</span></div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 bg-rose-50 border-b border-rose-100 font-black text-rose-800 text-[11px] uppercase tracking-widest flex items-center"><PieChart className="w-4 h-4 mr-2 shrink-0"/> Destino de Gastos</div>
            <div className="p-6 space-y-4 divide-y border-t-0 flex-1">
              {Object.keys(categoriesOut).length === 0 && <p className="text-slate-400 font-bold text-sm text-center py-4">No hay datos de gastos en este periodo.</p>}
              {Object.entries(categoriesOut).map(([cat, amount]:any) => (
                <div key={cat} className="flex justify-between items-center pt-4 first:pt-0 gap-4"><span className="font-bold text-slate-600 text-lg break-words">{cat}</span><span className="font-black text-slate-800 text-xl num-font shrink-0">Q{formatMoney(amount)}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderInsumos = () => (
    <div className="space-y-6 pb-24 md:pb-8 animate-in fade-in duration-300 w-full">
      <div className="flex bg-white p-1.5 rounded-2xl w-fit shadow-sm border border-slate-100">
        {['insumos', 'gas'].map(t => <button key={t} onClick={() => {vibrate(); setActiveInvTab(t)}} className={`px-8 py-3 rounded-xl font-black capitalize transition-all ${activeInvTab === t ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>{t}</button>)}
      </div>
      
      {activeInvTab === 'insumos' && (
        <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Jabones y Químicos</h3>
            <button onClick={() => toggleModal('supply')} className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-black text-sm active:scale-95 transition-all shadow-md">+ Nuevo Catálogo</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {_supplies.map(s => (
              <div key={s.id} className={`p-6 rounded-[2rem] border-2 transition-colors flex flex-col min-w-0 ${s.stock <= s.minAlert ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-100'}`}>
                <h4 className="font-black text-xl text-slate-800 leading-tight mb-1 truncate">{s.name}</h4>
                <p className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-6">Alerta en: {s.minAlert} und.</p>
                
                <div className="flex items-center justify-between bg-white p-2 rounded-2xl shadow-sm border border-slate-100 mb-4 mt-auto">
                  <button onClick={() => {vibrate(); setSupplies(_supplies.map(x => x.id===s.id ? {...x, stock: Math.max(0, x.stock-1)} : x))}} className="w-12 h-12 bg-slate-50 hover:bg-slate-100 rounded-xl font-black text-xl text-slate-600 active:scale-90 transition-transform">-</button>
                  <span className={`text-3xl font-black num-font ${s.stock <= s.minAlert ? 'text-rose-600' : 'text-slate-800'}`}>{s.stock}</span>
                  <button onClick={() => {vibrate(); setSupplies(_supplies.map(x => x.id===s.id ? {...x, stock: x.stock+1} : x))}} className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl font-black text-xl active:scale-90 transition-transform shadow-sm">+</button>
                </div>
                
                <button onClick={() => {vibrate(); setForms(p => ({...p, restockSupply: {id: s.id, name: s.name, qty: '', cost: '', date: getLocalDateString()}})); toggleModal('restockSupply');}} className="w-full mt-2 bg-slate-900 text-white py-3 rounded-xl font-black text-sm active:scale-95 transition-transform flex items-center justify-center shadow-lg shadow-slate-300">
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {_dryers.map(d => {
                const activeCyl = _gasCylinders.find(g => g.dryerId === d.id && g.status === 'Activo');
                return (
                  <div key={d.id} className="bg-slate-50 rounded-[2rem] p-6 border-2 border-slate-100 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-black text-xl text-slate-800 flex items-center truncate"><Flame className="w-5 h-5 mr-2 text-orange-500 shrink-0"/> {d.name}</h4>
                      {activeCyl && !activeCyl.isPaid && <span className="bg-rose-100 text-rose-700 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest animate-pulse shrink-0">Deuda</span>}
                    </div>
                    
                    {activeCyl ? (
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-end mb-6">
                          <div className="min-w-0">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1 truncate">Ciclos Actuales</p>
                            <p className="text-5xl font-black text-slate-800 num-font leading-none truncate">{activeCyl.cycles}</p>
                          </div>
                          <div className="text-right shrink-0">
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
                  <div key={g.id} className="flex justify-between items-center p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 gap-4">
                    <div className="min-w-0">
                      <p className="font-black text-slate-800 text-lg truncate">{dryerName}</p>
                      <p className="text-xs font-bold text-slate-400 mt-1 truncate">{g.entryDate} {'->'} {g.emptyDate}</p>
                    </div>
                    <div className="text-right shrink-0">
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
    <div className="space-y-8 pb-32 animate-in fade-in duration-300 w-full">
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
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 no-scrollbar">
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
          <div className="max-h-96 overflow-y-auto pr-2 space-y-3 touch-pan-y no-scrollbar">
            {_clients.map(c => <div key={c.id} className="p-4 border-2 border-slate-50 rounded-2xl flex justify-between items-center"><div className="flex flex-col"><span className="font-bold text-slate-700 text-lg">{c.name}</span><span className="text-slate-400 text-sm font-bold num-font">{c.phone || 'Sin número'}</span></div><button onClick={() => {vibrate(); setClients(_clients.filter(x => x.id !== c.id))}} className="text-rose-400 hover:text-rose-600 p-2 active:scale-90 transition-transform"><Trash2 className="w-5 h-5"/></button></div>)}
            {_clients.length === 0 && <p className="text-slate-400 font-bold text-center py-4">Directorio vacío.</p>}
          </div>
        </div>
      </div>

      <div className="bg-rose-50 p-8 md:p-10 rounded-[2.5rem] border border-rose-200 shadow-sm flex flex-col items-center justify-center text-center mt-10">
         <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
         <h3 className="font-black text-2xl text-rose-800 mb-2">Zona de Peligro</h3>
         <p className="text-rose-600 font-bold mb-6">Borra absolutamente todas las órdenes, clientes, insumos, inventarios y finanzas del sistema.</p>
         <button onClick={() => {vibrate(); toggleModal('wipeData');}} className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-2xl font-black active:scale-95 transition-transform shadow-lg shadow-rose-300">Borrar Todo el Sistema</button>
      </div>
    </div>
  );

  if (!isCloudReady) return <div className="h-screen bg-slate-900 flex flex-col items-center justify-center text-white font-black"><Cloud className="w-16 h-16 mb-4 text-blue-500 animate-pulse"/> Conectando LavOS...</div>;

  if (!currentUser) {
    return (
      <div className="h-screen bg-slate-100 flex items-center justify-center p-4">
        <style>{`
          body, html, #root { margin: 0 !important; padding: 0 !important; width: 100% !important; height: 100% !important; max-width: none !important; background: #f1f5f9; display: block !important; }
        `}</style>
        <div className="bg-white p-8 rounded-[3rem] shadow-2xl w-full max-w-sm flex flex-col items-center relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full p-2 text-center text-[10px] font-black text-white uppercase tracking-widest ${cloudError ? 'bg-rose-500' : 'bg-emerald-500'}`}>{cloudError ? 'Sin Conexión' : 'Sistema Online'}</div>
          <Droplets className="w-16 h-16 text-blue-600 mb-6 mt-4" />
          <h1 className="text-4xl font-black mb-8 tracking-tight">LavOS</h1>
          <div className="grid grid-cols-3 gap-4 w-full px-2">
            {[1,2,3,4,5,6,7,8,9,0].map(n => <button key={n} onClick={() => handlePinInput(n.toString())} className="bg-slate-50 hover:bg-slate-100 p-6 rounded-full text-3xl font-black text-slate-700 active:scale-90 transition-transform">{n}</button>)}
            <button onClick={() => handlePinInput('DEL')} className="bg-rose-50 text-rose-600 p-6 rounded-full font-black active:scale-90 transition-transform"><Minus className="w-8 h-8 mx-auto"/></button>
          </div>
          {loginPin.length > 0 && <div className="flex gap-2 mt-6">{[0,1,2,3].map(i => <div key={i} className={`w-4 h-4 rounded-full ${loginPin.length > i ? 'bg-blue-600' : 'bg-slate-200'}`}></div>)}</div>}
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
      
      <div className="h-screen bg-slate-50 flex flex-col md:flex-row overflow-hidden relative">
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[6000] w-full max-w-sm px-4">
          {uiError && <div className="bg-rose-600 text-white px-6 py-4 rounded-2xl font-black shadow-2xl animate-in slide-in-from-top-4 flex items-center"><AlertCircle className="w-5 h-5 mr-3 shrink-0"/>{uiError}</div>}
          {uiSuccess && <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl font-black shadow-2xl animate-in slide-in-from-top-4 flex items-center"><CheckCircle className="w-5 h-5 mr-3 text-emerald-400 shrink-0"/>{uiSuccess}</div>}
        </div>
        
        <nav className="fixed bottom-0 w-full md:static md:w-28 lg:w-64 bg-white border-t md:border-t-0 md:border-r border-slate-200 flex flex-row md:flex-col items-center p-2 md:p-6 gap-1 md:gap-3 z-50 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)] md:shadow-none">
          <div className="hidden lg:flex items-center mb-10 w-full justify-start pl-2"><Droplets className="text-blue-600 w-8 h-8 mr-3"/><h1 className="text-2xl font-black tracking-tight">LavOS</h1></div>
          
          <div className="flex flex-row md:flex-col gap-1 md:gap-2 w-full justify-around md:justify-start h-full overflow-x-auto no-scrollbar">
            <div className="flex flex-row md:flex-col gap-1 md:gap-2 w-full justify-around md:justify-start">
              {[
                {id:'panel', label: 'Panel', icon: LayoutDashboard, role:['admin']}, 
                {id:'mostrador', label: 'Mostrador', icon: Store, role:['admin','employee']}, 
                {id:'ordenes', label: 'Órdenes', icon: ClipboardList, role:['admin','employee']}, 
                {id:'finanzas', label: 'Movimientos', icon: DollarSign, role:['admin', 'employee']},
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
              <h2 className="font-black text-2xl text-slate-800 capitalize hidden md:flex items-center tracking-tight"><MapPin className="w-5 h-5 mr-2 text-blue-600"/> Morales / {activeTab === 'finanzas' ? 'Movimientos' : activeTab}</h2>
              <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto no-scrollbar w-full md:w-auto snap-x items-center">
                {['día', 'quincena', 'mes', 'año'].map(t => (
                  <button key={t} onClick={() => {vibrate(); setDateFilter({...dateFilter, type: t})}} className={`snap-start flex-1 md:flex-none px-5 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all whitespace-nowrap ${dateFilter.type === t ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}>
                    {t}
                  </button>
                ))}
                
                {dateFilter.type === 'día' && (
                  <div className="flex gap-2 ml-2 border-l pl-2 border-slate-200 shrink-0">
                    <select value={dateFilter.dayType || 'hoy'} onChange={e => setDateFilter({...dateFilter, dayType: e.target.value})} className="p-2 bg-slate-50 rounded-xl text-xs font-bold outline-none text-slate-600 cursor-pointer">
                      <option value="hoy">Hoy</option>
                      <option value="ayer">Ayer</option>
                      <option value="custom">Específico</option>
                    </select>
                    {dateFilter.dayType === 'custom' && (
                      <input type="date" className="p-2 bg-slate-50 rounded-xl text-xs font-bold outline-none text-slate-500" value={dateFilter.specificDate} onChange={e => setDateFilter({...dateFilter, specificDate: e.target.value})} title="Fecha exacta" />
                    )}
                  </div>
                )}
                {dateFilter.type === 'mes' && (
                  <div className="flex gap-2 ml-2 border-l pl-2 border-slate-200 shrink-0">
                    <select value={dateFilter.month} onChange={e => setDateFilter({...dateFilter, month: parseInt(e.target.value)})} className="p-2 bg-slate-50 rounded-xl text-xs font-bold outline-none text-slate-600 cursor-pointer">
                      {MONTHS.map((m, i) => <option key={m} value={i+1}>{m}</option>)}
                    </select>
                    <select value={dateFilter.year} onChange={e => setDateFilter({...dateFilter, year: parseInt(e.target.value)})} className="p-2 bg-slate-50 rounded-xl text-xs font-bold outline-none text-slate-600 cursor-pointer">
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                )}
                {dateFilter.type === 'año' && (
                  <div className="flex gap-2 ml-2 border-l pl-2 border-slate-200 shrink-0">
                    <select value={dateFilter.year} onChange={e => setDateFilter({...dateFilter, year: parseInt(e.target.value)})} className="p-2 bg-slate-50 rounded-xl text-xs font-bold outline-none text-slate-600 cursor-pointer">
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </header>
          )}

          <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 scroll-smooth">
            <div className="w-full min-h-full">
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

        {/* --- TECLADO UNIVERSAL BLINDADO (Z-INDEX DIOS: 9999) --- */}
        {numpad.isOpen && (
          <div className="fixed inset-0 z-[9999] bg-slate-900/60 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 md:p-10 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
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
        {modals.viewOrder && forms.viewOrder && (() => {
          const o = forms.viewOrder;
          const client = _clients.find(c => c.id === o.clientId);
          const service = _servicesConfig.find(s => s.id === o.serviceId);
          const receiver = _employees.find(e => e.id === parseInt(o.receivedBy))?.name || 'N/A';
          const deliverer = o.deliveredBy ? _employees.find(e => e.id === parseInt(o.deliveredBy))?.name || 'N/A' : 'N/A';

          return (
            <div className="fixed inset-0 z-[1000] bg-slate-900/40 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
              <div className="bg-white w-full max-w-md rounded-t-[2.5rem] md:rounded-[3rem] p-8 md:p-10 space-y-6 shadow-2xl animate-in slide-in-from-bottom-10 md:zoom-in-95">
                <h3 className="text-3xl font-black text-slate-800 tracking-tight flex items-center"><ClipboardList className="w-8 h-8 mr-3 text-blue-600"/> Detalle de Orden</h3>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                  <p className="flex justify-between items-center"><span className="text-slate-400 font-bold text-sm uppercase tracking-widest">Ticket:</span><span className="font-black text-slate-700 text-xl bg-white px-3 py-1 rounded-xl shadow-sm">#{o.id.toString().slice(-4)}</span></p>
                  <p className="flex justify-between"><span className="text-slate-400 font-bold">Cliente:</span><span className="font-black text-slate-700 truncate max-w-[60%] text-right">{client?.name || 'Desconocido'}</span></p>
                  <p className="flex justify-between"><span className="text-slate-400 font-bold">Servicio:</span><span className="font-black text-blue-600 truncate max-w-[60%] text-right">{service?.name || 'Desconocido'}</span></p>
                  <p className="flex justify-between"><span className="text-slate-400 font-bold">Bolsas/Pzas:</span><span className="font-black text-slate-700">{o.bags}</span></p>
                  <p className="flex justify-between items-center"><span className="text-slate-400 font-bold">Cobrado:</span><span className="font-black text-emerald-600 text-2xl num-font">Q{formatMoney(o.total)}</span></p>
                  <div className="h-px w-full bg-slate-200 my-2"></div>
                  <p className="flex justify-between"><span className="text-slate-400 font-bold">Ingreso:</span><span className="font-black text-slate-700">{o.requestDate}</span></p>
                  <p className="flex justify-between"><span className="text-slate-400 font-bold">Recibió:</span><span className="font-black text-slate-700">{receiver}</span></p>
                  <p className="flex justify-between"><span className="text-slate-400 font-bold">Entregó:</span><span className="font-black text-slate-700">{deliverer}</span></p>
                </div>
                <button onClick={() => toggleModal('viewOrder')} className="w-full py-5 font-black bg-slate-900 text-white rounded-2xl active:scale-95 shadow-lg transition-transform">Cerrar Detalles</button>
              </div>
            </div>
          );
        })()}

        {modals.transaction && (
          <div className="fixed inset-0 z-[1000] bg-slate-900/40 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-t-[2.5rem] md:rounded-[3rem] p-8 md:p-10 space-y-6 shadow-2xl animate-in slide-in-from-bottom-10 md:zoom-in-95">
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">{forms.transaction.id ? 'Editar Registro' : 'Registro Manual'}</h3>
              <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6">{['SALIDA', 'ENTRADA'].map(t => <button key={t} onClick={() => {vibrate(); updateForm('transaction', 'type', t); updateForm('transaction', 'category', t === 'ENTRADA' ? (_txCategories.in[0] || '') : (_txCategories.out[0] || ''));}} className={`flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${forms.transaction.type === t ? (t==='ENTRADA'?'bg-emerald-500 text-white shadow-md':'bg-rose-500 text-white shadow-md') : 'text-slate-400 hover:text-slate-600'}`}>{t==='ENTRADA'?'Ingreso':'Gasto'}</button>)}</div>
              
              <input type="date" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 font-bold outline-none focus:border-blue-500 text-slate-600" value={forms.transaction.date} onChange={e => updateForm('transaction', 'date', e.target.value)} />
              
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

        {modals.deleteTx && (
          <div className="fixed inset-0 z-[1000] bg-slate-900/40 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-t-[2.5rem] md:rounded-[3rem] p-8 md:p-10 space-y-6 shadow-2xl animate-in slide-in-from-bottom-10 md:zoom-in-95 border-2 border-rose-100">
              <h3 className="text-3xl font-black text-slate-800 tracking-tight flex items-center"><AlertCircle className="w-8 h-8 mr-3 text-rose-500"/> Confirmar Borrado</h3>
              <p className="font-bold text-slate-500 text-sm">¿Estás absolutamente seguro de eliminar este registro financiero? Esta acción alterará tu cuadre de caja actual.</p>
              <div className="flex gap-4 pt-4">
                <button onClick={() => toggleModal('deleteTx')} className="flex-1 py-5 font-black text-slate-500 bg-slate-100 rounded-2xl active:scale-95 transition-transform">Cancelar</button>
                <button onClick={() => {
                  vibrate();
                  setTransactions(_transactions.filter(x => x.id !== forms.deleteTx.id));
                  toggleModal('deleteTx');
                  showMsg("Movimiento eliminado", false);
                }} className="flex-1 py-5 font-black bg-rose-600 text-white rounded-2xl active:scale-95 shadow-lg shadow-rose-200 transition-transform">Sí, Eliminar</button>
              </div>
            </div>
          </div>
        )}

        {modals.deleteOrder && (
          <div className="fixed inset-0 z-[1000] bg-slate-900/40 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-t-[2.5rem] md:rounded-[3rem] p-8 md:p-10 space-y-6 shadow-2xl animate-in slide-in-from-bottom-10 md:zoom-in-95 border-2 border-rose-100">
              <h3 className="text-3xl font-black text-slate-800 tracking-tight flex items-center"><AlertCircle className="w-8 h-8 mr-3 text-rose-500"/> Borrar Orden</h3>
              <p className="font-bold text-slate-500 text-sm">¿Seguro que quieres borrar esta orden? Si ya estaba entregada, su ingreso se borrará de la caja y los ciclos de gas se regresarán a la secadora.</p>
              <div className="flex gap-4 pt-4">
                <button onClick={() => toggleModal('deleteOrder')} className="flex-1 py-5 font-black text-slate-500 bg-slate-100 rounded-2xl active:scale-95 transition-transform">Cancelar</button>
                <button onClick={() => {
                  vibrate();
                  const o = forms.deleteOrder.order;
                  if (o.status === 'Entregado') revertOrderEffects(o);
                  setOrders(_orders.filter(x => x.id !== o.id));
                  toggleModal('deleteOrder');
                  showMsg("Orden eliminada", false);
                }} className="flex-1 py-5 font-black bg-rose-600 text-white rounded-2xl active:scale-95 shadow-lg shadow-rose-200 transition-transform">Eliminar Orden</button>
              </div>
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
              <p className="font-bold text-sm text-slate-500 bg-emerald-50 text-emerald-700 p-3 rounded-xl border border-emerald-100"><CheckCircle className="w-4 h-4 inline mr-1"/> Al despachar se registrará automáticamente el cobro de Q{forms.deliverOrder.order?.total}.</p>
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

              <div className="flex gap-4 pt-4"><button onClick={() => {vibrate(); toggleModal('deliverOrder')}} className="flex-1 py-5 font-black text-slate-500 bg-slate-100 rounded-2xl active:scale-95 transition-transform">Volver</button><button onClick={() => {vibrate(); confirmDelivery()}} disabled={!forms.deliverOrder.deliveredBy} className="flex-1 py-5 bg-emerald-600 text-white rounded-2xl font-black disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-emerald-200">Cobrar y Entregar</button></div>
            </div>
          </div>
        )}

        {modals.dryer && (
          <div className="fixed inset-0 z-[1000] bg-slate-900/40 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-t-[2.5rem] md:rounded-[3rem] p-8 md:p-10 space-y-6 shadow-2xl animate-in slide-in-from-bottom-10 md:zoom-in-95">
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">Nueva Secadora</h3>
              <input type="text" placeholder="Ej. Secadora 1 (Pequeña)" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 font-bold outline-none focus:border-blue-500 text-lg placeholder:text-slate-300" value={forms.dryer.name} onChange={e => updateForm('dryer', 'name', e.target.value)} />
              <div className="flex gap-4 pt-6"><button onClick={() => {vibrate(); toggleModal('dryer')}} className="flex-1 py-5 font-black text-slate-500 bg-slate-100 rounded-2xl active:scale-95 transition-transform">Cancelar</button><button onClick={() => {vibrate(); handleAddDryer()}} className="flex-1 py-5 font-black bg-slate-900 text-white rounded-2xl active:scale-95 shadow-lg shadow-slate-300 transition-transform">Registrar</button></div>
            </div>
          </div>
        )}

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

        {modals.emptyGas && (
          <div className="fixed inset-0 z-[1000] bg-slate-900/40 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-t-[2.5rem] md:rounded-[3rem] p-8 md:p-10 space-y-6 shadow-2xl animate-in slide-in-from-bottom-10 md:zoom-in-95">
              <h3 className="text-3xl font-black text-slate-800 tracking-tight flex items-center"><Flame className="w-8 h-8 mr-3 text-slate-400"/> Fin de Cilindro</h3>
              <p className="font-bold text-slate-600 text-lg">¿Marcar este cilindro como vacío?</p>
              <p className="font-bold text-slate-400 text-sm">El sistema lo archivará automáticamente con los ciclos que tenga registrados actualmente.</p>
              <div className="flex gap-4 pt-4"><button onClick={() => {vibrate(); toggleModal('emptyGas')}} className="flex-1 py-5 font-black text-slate-500 bg-slate-100 rounded-2xl active:scale-95 transition-transform">Cancelar</button><button onClick={() => {vibrate(); handleEmptyGas()}} className="flex-1 py-5 font-black bg-slate-900 text-white rounded-2xl active:scale-95 shadow-lg transition-transform">Marcar Vacío</button></div>
            </div>
          </div>
        )}

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

        {modals.employee && (
          <div className="fixed inset-0 z-[1000] bg-slate-900/40 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-t-[2.5rem] md:rounded-[3rem] p-8 md:p-10 space-y-6 shadow-2xl animate-in slide-in-from-bottom-10 md:zoom-in-95">
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">Alta de Personal</h3>
              <input type="text" placeholder="Nombre Corto (Ej. María)" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 font-bold outline-none focus:border-blue-500 text-lg placeholder:text-slate-300" value={forms.employee.name} onChange={e => updateForm('employee', 'name', e.target.value)} />
              <div className="flex gap-4 pt-6"><button onClick={() => {vibrate(); toggleModal('employee')}} className="flex-1 py-5 font-black text-slate-500 bg-slate-100 rounded-2xl active:scale-95 transition-transform">Cancelar</button><button onClick={() => { vibrate(); if(!forms.employee.name) return; setEmployees([{id: Date.now(), ...forms.employee}, ..._employees]); setForms(p=>({...p, employee:{name:'',phone:''}})); toggleModal('employee'); showMsg("Empleado activo", false); }} className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-200 active:scale-95 transition-transform">Ingresar</button></div>
            </div>
          </div>
        )}

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

        {modals.editOrder && (
          <div className="fixed inset-0 z-[1000] bg-slate-900/40 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-t-[2.5rem] md:rounded-[3rem] p-8 md:p-10 space-y-6 shadow-2xl animate-in slide-in-from-bottom-10 md:zoom-in-95">
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">Editar Orden</h3>
              <p className="text-sm font-bold text-slate-400">Modifica datos de la orden seleccionada.</p>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 block">Bolsas/Pzas</label><div onClick={() => {vibrate(); setNumpad({isOpen: true, field: 'bags', value: forms.editOrder.bags, target: 'editOrder'})}} className="w-full p-5 bg-slate-50 rounded-2xl border-2 font-black text-xl text-slate-700 cursor-pointer num-font">{forms.editOrder.bags || '0'}</div></div>
                <div><label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 block">Monto (Q)</label><div onClick={() => {vibrate(); setNumpad({isOpen: true, field: 'manualPrice', value: forms.editOrder.manualPrice, target: 'editOrder'})}} className="w-full p-5 bg-slate-50 rounded-2xl border-2 font-black text-xl text-emerald-600 cursor-pointer num-font">{forms.editOrder.manualPrice || '0'}</div></div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 block">Estado Actual</label>
                <select value={forms.editOrder.status} onChange={(e) => updateForm('editOrder', 'status', e.target.value)} className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 font-bold outline-none text-slate-700 cursor-pointer">
                  <option value="Pendiente">Pendiente</option><option value="Lavado">Lavado</option><option value="Secado">Secado</option><option value="Doblado">Doblado</option><option value="Entregado">Entregado</option>
                </select>
              </div>
              <div className="flex gap-4 pt-6"><button onClick={() => toggleModal('editOrder')} className="flex-1 py-5 font-black text-slate-500 bg-slate-100 rounded-2xl active:scale-95 transition-transform">Cancelar</button><button onClick={() => {vibrate(); handleEditOrder()}} className="flex-1 py-5 font-black bg-blue-600 text-white rounded-2xl active:scale-95 shadow-lg shadow-blue-200 transition-transform">Actualizar</button></div>
            </div>
          </div>
        )}

        {modals.wipeData && (
          <div className="fixed inset-0 z-[6000] bg-slate-900/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-t-[2.5rem] md:rounded-[3rem] p-8 md:p-10 space-y-6 shadow-2xl animate-in slide-in-from-bottom-10 md:zoom-in-95 border-4 border-rose-500">
              <h3 className="text-3xl font-black text-rose-600 tracking-tight flex items-center"><AlertCircle className="mr-3 w-8 h-8"/> Peligro</h3>
              <p className="font-bold text-slate-600 text-sm">Estás a punto de BORRAR TODA LA BASE DE DATOS. Esta acción es irreversible.</p>
              <p className="font-bold text-slate-500 text-xs">Escribe la palabra <span className="text-rose-600 font-black">BORRAR</span> para confirmar:</p>
              <input type="text" className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 font-black outline-none focus:border-rose-500 text-center uppercase text-xl text-rose-600" value={forms.wipe?.confirmText || ''} onChange={e => updateForm('wipe', 'confirmText', e.target.value.toUpperCase())} />
              <div className="flex gap-4 pt-4">
                <button onClick={() => {toggleModal('wipeData'); updateForm('wipe', 'confirmText', '');}} className="flex-1 py-5 font-black text-slate-500 bg-slate-100 rounded-2xl active:scale-95 transition-transform">Cancelar</button>
                <button disabled={forms.wipe?.confirmText !== 'BORRAR'} onClick={() => {
                  vibrate();
                  setClients([]); setServicesConfig([]); setOrders([]); setDryers([]); setGasCylinders([]); setSupplies([]); setEmployees([]); setTransactions([]);
                  toggleModal('wipeData');
                  updateForm('wipe', 'confirmText', '');
                  showMsg("SISTEMA FORMATEADO", false);
                }} className="flex-1 py-5 font-black bg-rose-600 text-white rounded-2xl active:scale-95 disabled:opacity-30 shadow-lg shadow-rose-200 transition-transform">Eliminar Todo</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

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
          <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-rose-200 w-full max-w-lg text-left overflow-auto"><p className="font-mono text-sm text-rose-600">{this.state.errorInfo?.toString()}</p></div>
          <button onClick={() => window.location.reload()} className="mt-8 bg-rose-600 text-white px-8 py-4 rounded-xl font-black shadow-lg active:scale-95">Reiniciar Sistema</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() { return (<ErrorBoundary><LavOSMain /></ErrorBoundary>); }