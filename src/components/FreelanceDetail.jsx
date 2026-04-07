import React, { useState } from 'react';
import { Plus, DollarSign, Wallet, FileText, Trash2, Edit3, Calendar, Clock, Download } from 'lucide-react';
import TransactionModal from './TransactionModal';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const FreelanceDetail = ({ freelance, transactions, onAddTransaction, onUpdateTransaction, onDeleteTransaction }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('booking'); // 'booking' or 'payment'
  const [editingTx, setEditingTx] = useState(null);

  // Calculations
  const totals = transactions.reduce((acc, tx) => {
    const amount = parseFloat(tx.amount) || 0;
    if (tx.type === 'booking') {
      acc[tx.currency] = (acc[tx.currency] || 0) + amount;
    } else {
      acc[tx.currency] = (acc[tx.currency] || 0) - amount;
    }
    return acc;
  }, { ARS: 0, USD: 0 });

  const handleOpenModal = (type, tx = null) => {
    setModalType(type);
    setEditingTx(tx);
    setModalOpen(true);
  };

  const formatDate = (isoStr) => {
    return new Date(isoStr).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(28, 194, 159); // Primary color
    doc.text('Resumen de Cuenta Freelance', 14, 20);
    
    doc.setFontSize(16);
    doc.setTextColor(51, 51, 51);
    doc.text(`Freelance: ${freelance.name}`, 14, 30);
    
    doc.setFontSize(10);
    doc.setTextColor(153, 153, 153);
    doc.text(`Fecha de emision: ${new Date().toLocaleString('es-AR')}`, 14, 38);

    // Balance Summary
    doc.setDrawColor(224, 224, 224);
    doc.line(14, 45, 196, 45);
    
    doc.setFontSize(12);
    doc.setTextColor(51, 51, 51);
    doc.setFont(undefined, 'bold');
    doc.text('SALDOS TOTALES:', 14, 55);
    
    doc.setFont(undefined, 'normal');
    doc.text(`Saldo ARS: $ ${totals.ARS.toLocaleString('es-AR')}`, 14, 65);
    doc.text(`Saldo USD: u$s ${totals.USD.toLocaleString('es-AR')}`, 14, 75);

    // Table
    const tableData = transactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(tx => [
        formatDate(tx.date),
        tx.type === 'booking' ? 'Reserva' : 'Pago',
        tx.bookingNumber || '-',
        tx.passengerName || '-',
        `${tx.currency === 'USD' ? 'u$s' : '$'} ${parseFloat(tx.amount).toLocaleString('es-AR')}`
      ]);

    autoTable(doc, {
      startY: 85,
      head: [['Fecha', 'Tipo', 'Reserva #', 'Pasajero', 'Monto']],
      body: tableData,
      headStyles: { fillColor: [28, 194, 159] },
      margin: { top: 85 },
      styles: { fontSize: 9 }
    });

    doc.save(`Resumen_${freelance.name.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="freelance-detail animate-fade-in">
      <header className="detail-header">
        <div className="header-info">
          <h2 className="text-xl font-bold">{freelance.name}</h2>
          <p className="text-muted text-sm">Resumen de cuenta activo</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={handleExportPDF} style={{borderColor: '#1cc29f', color: '#1cc29f'}}>
            <Download size={18} />
            <span>Exportar PDF</span>
          </button>
          <button className="btn-primary" onClick={() => handleOpenModal('booking')}>
            <Plus size={18} />
            <span>Nueva Reserva</span>
          </button>
          <button className="btn-secondary" onClick={() => handleOpenModal('payment')}>
            <Wallet size={18} />
            <span>Registrar Pago</span>
          </button>
        </div>
      </header>

      <section className="balance-grid">
        <div className={`balance-card ${totals.ARS > 0 ? 'positive' : ''}`}>
          <div className="card-label text-xs font-bold">SALDO PESOS (ARS)</div>
          <div className="card-value">$ {totals.ARS.toLocaleString('es-AR')}</div>
          <div className="card-footer text-xs">Total acumulado</div>
        </div>
        <div className={`balance-card usd ${totals.USD > 0 ? 'positive' : ''}`}>
          <div className="card-label text-xs font-bold">SALDO DÓLARES (USD)</div>
          <div className="card-value">u$s {totals.USD.toLocaleString('es-AR')}</div>
          <div className="card-footer text-xs">Total acumulado</div>
        </div>
      </section>

      <section className="transaction-history">
        <div className="section-title text-muted text-xs font-bold">MOVIMIENTOS RECIENTES</div>
        {transactions.length === 0 ? (
          <div className="empty-history text-muted">
            <Clock size={48} />
            <p>No hay movimientos registrados.</p>
          </div>
        ) : (
          <div className="history-list">
            {transactions.sort((a,b) => new Date(b.date) - new Date(a.date)).map(tx => (
              <div key={tx.id} className={`tx-item ${tx.type}`}>
                <div className="tx-date">
                  <span className="day">{new Date(tx.date).getDate()}</span>
                  <span className="month">{new Date(tx.date).toLocaleDateString('es-AR', { month: 'short' }).toUpperCase()}</span>
                </div>
                <div className="tx-icon">
                  {tx.type === 'booking' ? <FileText size={20} /> : <Wallet size={20} />}
                </div>
                <div className="tx-info">
                  <div className="tx-title">
                    {tx.type === 'booking' ? 'Reserva' : 'Pago'} #{tx.bookingNumber} - <span className="passenger">{tx.passengerName}</span>
                  </div>
                  <div className="tx-meta text-xs text-muted">
                    {formatDate(tx.date)}
                  </div>
                </div>
                <div className="tx-amount font-bold">
                   {tx.type === 'payment' && '-'} {tx.currency === 'USD' ? 'u$s' : '$'} {parseFloat(tx.amount).toLocaleString('es-AR')}
                </div>
                <div className="tx-actions">
                  <button className="btn-icon" onClick={() => handleOpenModal(tx.type, tx)}>
                    <Edit3 size={14} />
                  </button>
                  <button className="btn-icon text-secondary" onClick={() => onDeleteTransaction(tx.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {modalOpen && (
        <TransactionModal 
          type={modalType}
          tx={editingTx}
          onClose={() => setModalOpen(false)}
          onSave={(data) => {
            if (editingTx) {
              onUpdateTransaction(editingTx.id, data);
            } else {
              onAddTransaction({ ...data, type: modalType });
            }
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default FreelanceDetail;
