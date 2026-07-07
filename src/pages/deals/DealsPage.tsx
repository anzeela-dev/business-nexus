import React, { useState } from 'react';
import { Search, Filter, DollarSign, TrendingUp, Users, Calendar, CreditCard, ShieldCheck, X, FileText, Download } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';

interface DealItem {
  id: number;
  startup: {
    name: string;
    logo: string;
    industry: string;
  };
  amount: string;
  equity: string;
  status: string;
  stage: string;
  lastActivity: string;
}

interface InvoiceItem {
  id: string;
  txHash: string;
  startupName: string;
  amount: string;
  date: string;
  method: string;
  status: 'Settled' | 'Processing';
}

export const DealsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  
  // Deals State
  const [dealsList, setDealsList] = useState<DealItem[]>([
    {
      id: 1,
      startup: {
        name: 'TechWave AI',
        logo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
        industry: 'FinTech'
      },
      amount: '$1.5M',
      equity: '15%',
      status: 'Due Diligence',
      stage: 'Series A',
      lastActivity: '2024-02-15'
    },
    {
      id: 2,
      startup: {
        name: 'GreenLife Solutions',
        logo: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
        industry: 'CleanTech'
      },
      amount: '$2M',
      equity: '20%',
      status: 'Term Sheet',
      stage: 'Seed',
      lastActivity: '2024-02-10'
    },
    {
      id: 3,
      startup: {
        name: 'HealthPulse',
        logo: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
        industry: 'HealthTech'
      },
      amount: '$800K',
      equity: '12%',
      status: 'Negotiation',
      stage: 'Pre-seed',
      lastActivity: '2024-02-05'
    }
  ]);

  // Invoice Logs State (Week 3 Milestone 2 Requirement)
  const [invoices, setInvoices] = useState<InvoiceItem[]>([
    { id: 'INV-2026-001', txHash: 'ch_3MvNyFLkd...', startupName: 'EcoDrive E-Bikes', amount: '$80,000', date: '2026-05-12', method: 'Stripe API', status: 'Settled' }
  ]);

  // Modal & Stripe states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDeal, setActiveDeal] = useState<DealItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const statuses = ['Due Diligence', 'Term Sheet', 'Negotiation', 'Closed', 'Passed'];
  
  const toggleStatus = (status: string) => {
    setSelectedStatus(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Due Diligence': return 'primary';
      case 'Term Sheet': return 'secondary';
      case 'Negotiation': return 'accent';
      case 'Closed': return 'success';
      case 'Passed': return 'error';
      default: return 'gray';
    }
  };

  const openStripeCheckout = (deal: DealItem) => {
    setActiveDeal(deal);
    setIsModalOpen(true);
  };

  // Upgraded processing to dynamically generate real-time ledger invoice receipt record logs
  const processStripePayment = () => {
    if (!activeDeal) return;
    setIsProcessing(true);

    setTimeout(() => {
      // 1. Update Deal status to Closed
      setDealsList(prev => prev.map(d => 
        d.id === activeDeal.id ? { ...d, status: 'Closed', lastActivity: new Date().toISOString().split('T')[0] } : d
      ));

      // 2. Generate and prepend dynamic invoice log audit record
      const newInvoiceId = `INV-2026-0${Math.floor(Math.random() * 900) + 100}`;
      const newHash = `ch_${Math.random().toString(36).substring(2, 11)}Lkd...`;
      
      setInvoices(prev => [
        {
          id: newInvoiceId,
          txHash: newHash,
          startupName: activeDeal.startup.name,
          amount: activeDeal.amount,
          date: new Date().toISOString().split('T')[0],
          method: 'Stripe API',
          status: 'Settled'
        },
        ...prev
      ]);

      setIsProcessing(false);
      setIsModalOpen(false);
      alert(`Stripe Transaction Successful!\n\nInvoice ${newInvoiceId} logged safely in transaction ledger.`);
    }, 2000);
  };
  
  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investment Deals</h1>
          <p className="text-gray-600">Track and manage your investment pipeline & secure transactions</p>
        </div>
        
        <Button onClick={() => alert("Creating custom investment intent frame...")}>
          Add Deal
        </Button>
      </div>
      
      {/* Stats Cards (100% Intact) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardBody><div className="flex items-center"><div className="p-3 bg-primary-100 rounded-lg mr-3"><DollarSign size={20} className="text-primary-600" /></div><div><p className="text-sm text-gray-600">Total Investment</p><p className="text-lg font-semibold text-gray-900">$4.3M</p></div></div></CardBody></Card>
        <Card><CardBody><div className="flex items-center"><div className="p-3 bg-secondary-100 rounded-lg mr-3"><TrendingUp size={20} className="text-secondary-600" /></div><div><p className="text-sm text-gray-600">Active Deals</p><p className="text-lg font-semibold text-gray-900">8</p></div></div></CardBody></Card>
        <Card><CardBody><div className="flex items-center"><div className="p-3 bg-accent-100 rounded-lg mr-3"><Users size={20} className="text-accent-600" /></div><div><p className="text-sm text-gray-600">Portfolio Companies</p><p className="text-lg font-semibold text-gray-900">12</p></div></div></CardBody></Card>
        <Card><CardBody><div className="flex items-center"><div className="p-3 bg-success-100 rounded-lg mr-3"><Calendar size={20} className="text-success-600" /></div><div><p className="text-sm text-gray-600">Closed This Month</p><p className="text-lg font-semibold text-gray-900">2</p></div></div></CardBody></Card>
      </div>
      
      {/* Filters Section */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3">
          <Input placeholder="Search deals by startup name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} startAdornment={<Search size={18} />} fullWidth />
        </div>
        <div className="w-full md:w-1/3">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <div className="flex flex-wrap gap-2">
              {statuses.map(status => (
                <Badge key={status} variant={selectedStatus.includes(status) ? getStatusColor(status) : 'gray'} className="cursor-pointer" onClick={() => toggleStatus(status)}>{status}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Active Deals Table */}
      <Card>
        <CardHeader><h2 className="text-lg font-medium text-gray-900">Active Pipeline</h2></CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Startup</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dealsList
                  .filter(d => searchQuery === '' || d.startup.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(deal => (
                    <tr key={deal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar src={deal.startup.logo} alt={deal.startup.name} size="sm" className="flex-shrink-0" />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{deal.startup.name}</div>
                            <div className="text-sm text-gray-500">{deal.startup.industry}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900 font-medium">{deal.amount}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{deal.equity}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><Badge variant={getStatusColor(deal.status)}>{deal.status}</Badge></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{deal.stage}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{new Date(deal.lastActivity).toLocaleDateString()}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        {deal.status !== 'Closed' ? (
                          <Button variant="primary" size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs text-white" onClick={() => openStripeCheckout(deal)}>Pay with Stripe</Button>
                        ) : (
                          <span className="text-xs text-emerald-600 font-semibold inline-flex items-center gap-1"><ShieldCheck size={14} /> Closed & Disbursed</span>
                        )}
                        <Button variant="outline" size="sm" onClick={() => alert("Loading audit document metadata...")}>Details</Button>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* NEW: Invoice Records & Escrow Audit Ledger UI (Week 3 Milestone 2 & 3 Requirement) */}
      <Card>
        <CardHeader className="flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-2">
            <FileText className="text-gray-500" size={18} />
            <h2 className="text-lg font-bold text-gray-900">Escrow Transaction Receipts & Invoice Logs</h2>
          </div>
          <Badge variant="success">Stripe Verified</Badge>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Invoice ID</th>
                  <th className="px-6 py-3 text-left">Stripe Charge Token / Hash</th>
                  <th className="px-6 py-3 text-left">Beneficiary Startup</th>
                  <th className="px-6 py-3 text-left">Fund Transferred</th>
                  <th className="px-6 py-3 text-left">Date Cleared</th>
                  <th className="px-6 py-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-700">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4 font-semibold text-blue-600">{inv.id}</td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-400">{inv.txHash}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{inv.startupName}</td>
                    <td className="px-6 py-4 font-mono font-medium text-emerald-600">{inv.amount}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(inv.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="outline" size="sm" className="inline-flex items-center gap-1 text-xs py-1 px-2" onClick={() => alert(`Downloading official PDF cryptographically sealed invoice receipt for ${inv.id}`)}>
                        <Download size={12} /> Receipt
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Stripe Checkout Overlay Simulation Modal */}
      {isModalOpen && activeDeal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden animate-scale-up">
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CreditCard className="text-blue-400" size={20} />
                <span className="font-bold tracking-tight text-base">Stripe Secure Checkout</span>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors"><X size={18} /></button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-gray-100">
                <span className="text-xs text-gray-400 uppercase font-bold block">Investment Target</span>
                <span className="font-bold text-gray-800 text-lg block">{activeDeal.startup.name}</span>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200/60 text-sm">
                  <span className="text-gray-500">Equity Transfer: <b>{activeDeal.equity}</b></span>
                  <span className="text-blue-600 font-mono font-bold text-base">{activeDeal.amount}</span>
                </div>
              </div>

              {/* Mock Stripe Card Element Input */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Card Number</label>
                  <div className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm font-mono flex items-center justify-between">
                    <span>•••• •••• •••• 4242</span>
                    <span className="text-xs text-gray-400 font-sans font-bold">VISA</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Expires</label>
                    <div className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm font-mono">12 / 29</div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">CVC</label>
                    <div className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm font-mono">***</div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button variant="primary" fullWidth className="bg-blue-600 hover:bg-blue-700 py-2.5 text-sm font-bold shadow-md flex justify-center items-center gap-2" onClick={processStripePayment} disabled={isProcessing}>
                  {isProcessing ? <span>Authorizing Escrow Token...</span> : <><ShieldCheck size={16} /><span>Authorize Payment ({activeDeal.amount})</span></>}
                </Button>
                <p className="text-[11px] text-gray-400 text-center mt-2.5">Secured by Stripe. Funds will be held in encrypted compliance escrow vault layers.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};