import React, { useState } from 'react';
import { X } from 'lucide-react';

interface TransactionData {
  amount: number;
  date: string;
  method?: string;
  type: 'income' | 'expense';
  client: string;
  status?: 'pago' | 'credito';
  category?: string;
  name?: string;
  provider?: string;
}

interface TransactionModalProps {
  type: 'income' | 'expense';
  onClose: () => void;
  onSubmit: (data: TransactionData) => void;
}

const paymentMethods = [
  'Dinheiro',
  'Cartão',
  'Transferência bancária',
  'Outro',
  'PicPay',
  'Pix'
];

const expenseCategories = [
  'Serviços públicos',
  'Compra de produtos e insumos',
  'Aluguel',
  'Folha de pagamento'
];

export default function TransactionModal({ type, onClose, onSubmit }: TransactionModalProps) {
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [method, setMethod] = useState('');
  const [client, setClient] = useState('');
  const [status, setStatus] = useState<'pago' | 'credito'>('pago');
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [provider, setProvider] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<TransactionData | null>(null);

  const handleSubmit = () => {
    if (!amount || !date || (status === 'pago' && !method)) return;

    const transaction: TransactionData = {
      amount,
      date,
      method,
      type,
      client,
      status,
      category,
      name,
      provider
    };

    console.log('Dados enviados:', transaction);
    setSubmittedData(transaction);
    setShowSuccess(true);
  };

  const handleSuccessConfirm = () => {
    if (submittedData) onSubmit(submittedData);
    setShowSuccess(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full relative p-6">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <span>{type === 'income' ? 'Criar Receita' : 'Nova despesa'}</span>
          </h2>

          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setStatus('pago')}
              className={`flex-1 px-4 py-2 rounded ${status === 'pago' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Pago
            </button>
            <button
              onClick={() => setStatus('credito')}
              className={`flex-1 px-4 py-2 rounded ${status === 'credito' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {type === 'income' ? 'A crédito' : 'Em dívida'}
            </button>
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-1">Data do {type === 'income' ? 'recebimento' : 'gasto'}*</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full mb-4 px-4 py-2 border rounded-lg"
          />

          {type === 'expense' && (
            <>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria da despesa*</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full mb-4 px-4 py-2 border rounded-lg"
              >
                <option value="">Selecione uma categoria</option>
                {expenseCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </>
          )}

          <label className="block text-sm font-medium text-gray-700 mb-1">Valor*</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full mb-4 px-4 py-2 border rounded-lg"
          />

          {type === 'expense' && (
            <>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deseja dar um nome a este gasto?</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mb-4 px-4 py-2 border rounded-lg"
              />

              <label className="block text-sm font-medium text-gray-700 mb-1">Adicionar um fornecedor à despesa*</label>
              <input
                type="text"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full mb-4 px-4 py-2 border rounded-lg"
              />
            </>
          )}

          {status === 'pago' && (
            <>
              <label className="block text-sm font-medium text-gray-700 mb-1">Selecione o método de pagamento*</label>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {paymentMethods.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMethod(m)}
                    className={`border rounded-lg py-2 px-2 ${method === m ? 'border-green-600 bg-green-50' : 'border-gray-200'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </>
          )}

          {type === 'income' && (
            <>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente (opcional)</label>
              <input
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full mb-6 px-4 py-2 border rounded-lg"
              />
            </>
          )}

          <button
            onClick={handleSubmit}
            disabled={!amount || !date || (status === 'pago' && !method)}
            className={`w-full py-3 rounded-lg font-semibold text-white ${(!amount || !date || (status === 'pago' && !method)) ? 'bg-gray-300' : 'bg-black hover:bg-gray-800'}`}
          >
            Criar {type === 'income' ? 'Receita' : 'Despesa'}
          </button>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white px-6 py-5 rounded-xl shadow-xl text-center max-w-sm w-full">
            <p className="text-lg font-semibold text-green-700 mb-4">
              {type === 'income' ? 'Receita' : 'Despesa'} criada com sucesso!
            </p>
            <button
              onClick={handleSuccessConfirm}
              className="mt-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
