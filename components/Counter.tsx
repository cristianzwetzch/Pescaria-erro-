
import React from 'react';

interface CounterProps {
  label: string;
  value: number;
  icon: string;
  color: string;
  onChange: (newValue: number) => void;
}

const Counter: React.FC<CounterProps> = ({ label, value, icon, color, onChange }) => {
  const isImageUrl = icon.startsWith('data:') || icon.startsWith('http') || icon.includes('/');

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center justify-between">
      <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-white mb-2 overflow-hidden`}>
        {isImageUrl ? (
          <img 
            src={icon} 
            alt={label} 
            className="w-9 h-9 object-contain" 
          />
        ) : (
          <i className={`fas ${icon} text-xl`}></i>
        )}
      </div>
      <span className="text-gray-500 text-sm font-medium">{label}</span>
      <div className="flex items-center space-x-2 mt-3">
        <button 
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 active:bg-gray-200 transition-colors"
          aria-label="Diminuir"
        >
          <i className="fas fa-minus"></i>
        </button>
        
        <input 
          type="number"
          value={value === 0 ? '' : value}
          placeholder="0"
          onChange={(e) => {
            const val = parseInt(e.target.value);
            onChange(isNaN(val) ? 0 : Math.max(0, val));
          }}
          className="text-2xl font-bold text-gray-800 w-16 text-center bg-transparent border-b-2 border-transparent focus:border-blue-500 focus:outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />

        <button 
          onClick={() => onChange(value + 1)}
          className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white active:bg-blue-700 shadow-md shadow-blue-200 transition-colors"
          aria-label="Aumentar"
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>
    </div>
  );
};

export default Counter;
