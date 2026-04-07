import React, { useState } from 'react';
import { Plus, User, Trash2, Edit3, X, Check } from 'lucide-react';

const Sidebar = ({ freelances, activeId, onSelect, onAdd, onEdit, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue('');
      setIsAdding(false);
    }
  };

  const handleEdit = (id, currentName) => {
    setEditingId(id);
    setInputValue(currentName);
  };

  const handleSaveEdit = () => {
    if (inputValue.trim() && editingId) {
      onEdit(editingId, inputValue.trim());
      setEditingId(null);
      setInputValue('');
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="text-xl font-bold text-primary">Freelance Ledger</h1>
      </div>
      
      <div className="sidebar-scroll">
        <div className="section-title text-muted text-xs font-bold upgrade-title">FREELANCES</div>
        
        <ul className="freelance-list">
          {freelances.map((f) => (
            <li 
              key={f.id} 
              className={`freelance-item ${f.id === activeId ? 'active' : ''}`}
              onClick={() => onSelect(f.id)}
            >
              <div className="freelance-item-content">
                <div className="avatar">
                  <User size={16} />
                </div>
                {editingId === f.id ? (
                  <div className="edit-input-wrapper" onClick={(e) => e.stopPropagation()}>
                    <input 
                      autoFocus
                      className="edit-input"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                    />
                    <button className="btn-icon text-primary" onClick={handleSaveEdit}><Check size={14}/></button>
                  </div>
                ) : (
                  <span className="freelance-name">{f.name}</span>
                )}
              </div>
              
              {editingId !== f.id && (
                <div className="item-actions">
                  <button className="btn-icon" onClick={(e) => { e.stopPropagation(); handleEdit(f.id, f.name); }}>
                    <Edit3 size={14} />
                  </button>
                  <button className="btn-icon delete-btn" onClick={(e) => { e.stopPropagation(); onDelete(f.id); }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>

        {isAdding ? (
          <div className="add-form animate-fade-in">
            <input 
              autoFocus
              className="add-input"
              placeholder="Nombre del vendedor..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <div className="add-form-actions">
              <button className="btn-icon text-primary" onClick={handleAdd}><Check size={18}/></button>
              <button className="btn-icon text-secondary" onClick={() => { setIsAdding(false); setInputValue(''); }}><X size={18}/></button>
            </div>
          </div>
        ) : (
          <button className="add-btn text-primary" onClick={() => setIsAdding(true)}>
            <Plus size={18} />
            <span>Agregar vendedor</span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
