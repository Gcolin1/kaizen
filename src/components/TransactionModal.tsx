import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { categoriesApi } from '../services/api';

interface TransactionData {
  amount: number;
  date: string;
  method?: string;
  type: 'income' | 'expense';
  client: string;
  status?: 'pago' | 'credito';
  categoryId?: string; // ID da categoria
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

export default function TransactionModal({ type, onClose, onSubmit }: TransactionModalProps) {
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [method, setMethod] = useState('');
  const [client, setClient] = useState('');
  const [status, setStatus] = useState<'pago' | 'credito'>('pago');
  const [categoryId, setCategoryId] = useState('');
  const [name, setName] = useState('');
  const [provider, setProvider] = useState('');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<TransactionData | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoriesApi.getAll();
      console.log('Categorias:', response);

      if (response.success && Array.isArray(response.data)) {
        setCategories(response.data); // ✅ popula o dropdown
      }
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
    }
  };

  const handleSubmit = () => {
    if (!amount || !date || !categoryId || (status === 'pago' && !method)) return;

    // Criar descrição baseada nos dados do formulário
    let description = '';
    if (type === 'expense') {
      description = name || provider || 'Despesa';
      if (provider && name) {
        description = `${name} - ${provider}`;
      }
    } else {
      description = client || 'Receita';
    }

    const transaction: TransactionData = {
      amount,
      date,
      method,
      type,
      client,
      status,
      categoryId,
      name,
      provider
    };

    // Dados para API seguindo validação do backend
    const apiData = {
      amount,
      description,
      date,
      category: categoryId, // Backend espera 'category', não 'categoryId'
      type,
      paymentMethod: method, // Incluindo método de pagamento
      status // Incluindo status da transação
    };

    console.log('Dados enviados para API:', apiData);
    setSubmittedData(apiData as any);
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

          <h2 className="text-lg font-semibold mb-4">{type === 'income' ? 'Criar Receita' : 'Nova despesa'}</h2>

          {/* Status: Pago / Crédito */}
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

          {/* Data */}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data do {type === 'income' ? 'recebimento' : 'gasto'}*
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full mb-4 px-4 py-2 border rounded-lg"
          />

          {/* Categoria */}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoria {type === 'expense' ? 'da despesa' : 'da receita'}*
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full mb-4 px-4 py-2 border rounded-lg"
          >
            <option value="">Selecione uma categoria</option>
            {categories
              .filter(cat => cat.type === type || cat.type === 'both')
              .map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>

          {/* Valor */}
          <label className="block text-sm font-medium text-gray-700 mb-1">Valor*</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full mb-4 px-4 py-2 border rounded-lg"
          />

          {/* Nome e fornecedor (despesa) */}
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

          {/* Método de pagamento */}
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

          {/* Cliente (receita) */}
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

          {/* Botão Criar */}
          <button
            onClick={handleSubmit}
            disabled={!amount || !date || !categoryId || (status === 'pago' && !method)}
            className={`w-full py-3 rounded-lg font-semibold text-white ${(!amount || !date || !categoryId || (status === 'pago' && !method)) ? 'bg-gray-300' : 'bg-black hover:bg-gray-800'}`}
          >
            Criar {type === 'income' ? 'Receita' : 'Despesa'}
          </button>
        </div>
      </div>

      {/* Modal de sucesso */}
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
