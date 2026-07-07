import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Wallet, ArrowUpRight, ArrowDownLeft, RefreshCcw } from 'lucide-react';

export const PaymentsPage: React.FC = () => {
  const [balance] = useState(45250);
  const transactions = [
    { id: 1, type: 'Deposit', amount: '$10,000', sender: 'External Bank', receiver: 'Nexus Wallet', status: 'Completed', date: '2026-07-01' },
    { id: 2, type: 'Funding Deal', amount: '$35,250', sender: 'Investor Capital', receiver: 'Startup Escrow', status: 'Secured', date: '2026-07-04' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Wallet & Payments Chamber</h1>
        <p className="text-gray-650">Simulate secure fund transfers and track investment escrow flows</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <CardBody className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-wider text-blue-100 font-semibold">Available Balance</span>
              <Wallet size={24} className="text-blue-200" />
            </div>
            <div className="text-3xl font-extrabold">${balance.toLocaleString()}</div>
            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10" onClick={() => alert("Deposit simulation...")}>
                Deposit
              </Button>
              <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10" onClick={() => alert("Withdraw simulation...")}>
                Withdraw
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <RefreshCcw size={18} className="text-blue-600" /> Transaction Ledger History
          </h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    {tx.type === 'Deposit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{tx.type}</h3>
                    <p className="text-xs text-gray-500">{tx.sender} → {tx.receiver} ({tx.date})</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">{tx.amount}</div>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">{tx.status}</span>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};