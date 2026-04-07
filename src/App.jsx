import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Users, Trash2, Edit3, DollarSign, Wallet, ArrowLeft, MoreVertical, CheckCircle, Clock } from 'lucide-react';
import Sidebar from './components/Sidebar';
import FreelanceDetail from './components/FreelanceDetail';
import './App.css';

function App() {
  // Persistence
  const [freelances, setFreelances] = useState(() => {
    const saved = localStorage.getItem('freelance_app_venders');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Ejemplo Vendedor' }
    ];
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('freelance_app_txs');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedFreelanceId, setSelectedFreelanceId] = useState(freelances[0]?.id || null);

  useEffect(() => {
    localStorage.setItem('freelance_app_venders', JSON.stringify(freelances));
  }, [freelances]);

  useEffect(() => {
    localStorage.setItem('freelance_app_txs', JSON.stringify(transactions));
  }, [transactions]);

  // Actions
  const addFreelance = (name) => {
    const newFreelance = { id: Date.now().toString(), name };
    setFreelances([...freelances, newFreelance]);
    setSelectedFreelanceId(newFreelance.id);
  };

  const updateFreelance = (id, newName) => {
    setFreelances(freelances.map(f => f.id === id ? { ...f, name: newName } : f));
  };

  const deleteFreelance = (id) => {
    setFreelances(freelances.filter(f => f.id !== id));
    setTransactions(transactions.filter(t => t.freelanceId !== id));
    if (selectedFreelanceId === id) {
      setSelectedFreelanceId(freelances.find(f => f.id !== id)?.id || null);
    }
  };

  const addTransaction = (tx) => {
    setTransactions([...transactions, { ...tx, id: Date.now().toString(), freelanceId: selectedFreelanceId, date: new Date().toISOString() }]);
  };

  const updateTransaction = (id, updatedTx) => {
    setTransactions(transactions.map(t => t.id === id ? { ...t, ...updatedTx } : t));
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const selectedFreelance = freelances.find(f => f.id === selectedFreelanceId);

  return (
    <div className="app-container">
      <Sidebar 
        freelances={freelances} 
        activeId={selectedFreelanceId} 
        onSelect={setSelectedFreelanceId}
        onAdd={addFreelance}
        onEdit={updateFreelance}
        onDelete={deleteFreelance}
      />
      <main className="main-content">
        {selectedFreelance ? (
          <FreelanceDetail
            freelance={selectedFreelance}
            transactions={transactions.filter(t => t.freelanceId === selectedFreelanceId)}
            onAddTransaction={addTransaction}
            onUpdateTransaction={updateTransaction}
            onDeleteTransaction={deleteTransaction}
          />
        ) : (
          <div className="empty-state">
            <Users size={64} className="text-muted" />
            <h2>Selecciona o agrega un vendedor</h2>
            <p className="text-muted">Gestiona tus cuentas de forma simple y visual.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
