import React, { useState, useEffect } from 'react';

function ClientsJournalPage() {
  const [clients, setClients] = useState([]);
  const [clientActiveTours, setClientActiveTours] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchActiveTours = async (clientId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/clients/${clientId}/active-tours`);
      if (response.ok) {
        const data = await response.json();
        setClientActiveTours(prev => ({
          ...prev,
          [clientId]: data
        }));
      }
    } catch (err) {
      console.error('Ошибка загрузки путевок:', err);
    }
  };

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/clients');
      console.log('Fetch response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server error response:', errorData);
        throw new Error(`HTTP ${response.status}: ${errorData.message || 'Unknown error'}`);
      }
      const data = await response.json();
      console.log('Loaded clients:', data);
      console.log('First client structure:', data[0]);
      setClients(data);
      setError(null);
      
      // Загружаем активные путевки для каждого клиента
      data.forEach(client => fetchActiveTours(client.id));
    } catch (err) {
      console.error('Ошибка загрузки клиентов:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (client) => {
    setEditingId(client.id);
    setEditData({
      full_name: client.full_name,
      phone: client.phone,
      passport_number: client.passport_number,
      discount: client.discount || 0,
      total_tours_purchased: client.total_tours_purchased || 0,
    });
  };

  const handleSave = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: editData.full_name,
          phone: editData.phone,
          passport_number: editData.passport_number,
          discount: parseFloat(editData.discount) || 0,
          total_tours_purchased: parseInt(editData.total_tours_purchased) || 0,
        }),
      });

      if (!response.ok) throw new Error('Ошибка при сохранении');
      
      const updatedClient = await response.json();
      setClients(clients.map(client => 
        client.id === id ? updatedClient : client
      ));
      setEditingId(null);
      alert('Запись обновлена');
    } catch (err) {
      alert('Ошибка при сохранении: ' + err.message);
    }
  };

  const handleChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Ошибка при удалении');
        
        setClients(clients.filter(client => client.id !== id));
        alert('Запись удалена');
      } catch (err) {
        alert('Ошибка при удалении: ' + err.message);
      }
    }
  };

  const handleAddNew = () => {
    const newClient = {
      id: Date.now(),
      fullName: '',
      email: '',
      phone: '',
      registrationDate: new Date().toISOString().split('T')[0],
      toursPurchased: 0,
      totalSpent: 0,
      status: 'Активный',
    };
    setClients([...clients, newClient]);
  };

  if (loading) return <div><h1>Загрузка...</h1></div>;
  if (error) return <div><h1>Ошибка: {error}</h1></div>;

  return (
    <div>
      <h1 className="page-title">Журнал клиентов</h1>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ФИО</th>
              <th>Телефон</th>
              <th>Паспорт</th>
              <th>Дата регистрации</th>
              <th>Актуальные путевки</th>
              <th>Куплено путевок</th>
              <th>Скидка (%)</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id}>
                <td>
                  {editingId === client.id ? (
                    <input
                      type="text"
                      value={editData.full_name}
                      onChange={(e) => handleChange('full_name', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    client.full_name
                  )}
                </td>
                <td>
                  {editingId === client.id ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    client.phone
                  )}
                </td>
                <td>
                  {editingId === client.id ? (
                    <input
                      type="text"
                      value={editData.passport_number || ''}
                      onChange={(e) => handleChange('passport_number', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    client.passport_number || '-'
                  )}
                </td>
                <td>
                  {client.created_at ? new Date(client.created_at).toLocaleDateString('ru-RU') : '-'}
                </td>
                <td>
                  {clientActiveTours[client.id]?.map(tour => tour.name).join(', ') || '-'}
                </td>
                <td>
                  {editingId === client.id ? (
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={editData.total_tours_purchased || 0}
                      onChange={(e) => handleChange('total_tours_purchased', parseInt(e.target.value) || 0)}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    <>
                      {client.total_tours_purchased || 0}
                      {(client.total_tours_purchased || 0) >= 3 && ' ⭐'}
                    </>
                  )}
                </td>
                <td>
                  {editingId === client.id ? (
                    <input
                      type="number"
                      step="0.01"
                      value={editData.discount || 0}
                      onChange={(e) => handleChange('discount', parseFloat(e.target.value) || 0)}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    parseFloat(client.discount || 0).toFixed(2)
                  )}
                </td>
                <td>
                  <div className="table-actions">
                    {editingId === client.id ? (
                      <>
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => handleSave(client.id)}
                        >
                          Сохранить
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => setEditingId(null)}
                        >
                          Отмена
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => handleEdit(client)}
                        >
                          Редактировать
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(client.id)}
                        >
                          Удалить
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClientsJournalPage;
