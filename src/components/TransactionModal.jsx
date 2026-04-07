import React, { useState, useEffect } from 'react';
import { X, Check, DollarSign, Wallet, FileText } from 'lucide-react';

const TransactionModal = ({ type, tx, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    bookingNumber: '',
    passengerName: '',
    amount: '',
    currency: 'USD',
    type: type
  });

  useEffect(() => {
    if (tx) {
      setFormData(tx);
    }
  }, [tx]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount) return alert('Por favor ingresa un monto');
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in">
        <header className="modal-header">
          <h3>
            {tx ? 'Editar' : 'Nuevo'} {type === 'booking' ? 'Reserva' : 'Pago'}
          </h3>
          <button className="btn-icon" onClick={onClose}><X size={20}/></button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="form-group row">
            <div className="col">
              <label className="text-xs font-bold text-muted"># RESERVA</label>
              <input 
                type="text" 
                value={formData.bookingNumber} 
                onChange={(e) => setFormData({...formData, bookingNumber: e.target.value})}
                required
              />
            </div>
            <div className="col">
              <label className="text-xs font-bold text-muted">PASAJERO</label>
              <input 
                type="text" 
                value={formData.passengerName} 
                onChange={(e) => setFormData({...formData, passengerName: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="text-xs font-bold text-muted">MONTO {type === 'payment' ? 'DEL PAGO' : ''}</label>
            <div className="amount-input">
              <input 
                type="number" 
                step="0.01"
                placeholder="0.00"
                value={formData.amount} 
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
              />
              <select 
                value={formData.currency} 
                onChange={(e) => setFormData({...formData, currency: e.target.value})}
              >
                <option value="USD">USD (u$s)</option>
                <option value="ARS">ARS ($)</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-icon text-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary">
              <Check size={18} />
              <span>Guardar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
