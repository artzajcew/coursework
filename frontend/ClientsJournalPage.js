import React, { useState, useEffect } from 'react';

function ClientsJournalPage() {
  const [clients, setClients] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const mockClients = [
      {
        id: 1,
        fullName: 'Иван Петров',
        email: 'ivan@example.com',
        phone: '+7 (999) 123-45-67',
        registrationDate: '2024-01-15',
        toursPurchased: 3,
        totalSpent: 135000,
        status: 'Активный',
      },
      {
        id: 2,
        fullName: 'Мария Сидорова',
        email: 'maria@example.com',
        phone: '+7 (999) 234-56-78',
        registrationDate: '2024-02-20',
        toursPurchased: 1,
        totalSpent: 55000,
        status: 'Активный',
      },
      {
        id: 3,
        fullName: 'Петр Иванов',
        email: 'petr@example.com',
        phone: '+7 (999) 345-67-89',
        registrationDate: '2024-03-10',
        toursPurchased: 2,
        totalSpent: 95000,
        status: 'Активный',
      },
      {
        id: 4,
        fullName: 'Анна Смирнова',
        email: 'anna@example.com',
        phone: '+7 (999) 456-78-90',
        registrationDate: '2024-01-05',
        toursPurchased: 0,
        totalSpent: 0,
        status: 'Неактивный',
      },
    ];
    setClients(mockClients);
  }, []);

  const handleEdit = (client) => {
    setEditingId(client.id);
    setEditData({ ...client });
  };

  const handleSave = (id) => {
    setClients(clients.map(client => 
      client.id === id ? editData : client
    ));
    setEditingId(null);
    alert('Запись обновлена');
  };

  const handleChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDelete = (id) => {
    if (window.confirm('Вы уверены?')) {
      setClients(clients.filter(client => client.id !== id));
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

  return (
    <div>
      <h1 className="page-title">Журнал клиентов</h1>
      <button className="btn btn-success" onClick={handleAddNew} style={{ marginBottom: '1rem' }}>
        + Добавить клиента
      </button>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ФИО</th>
              <th>Email</th>
              <th>Телефон</th>
              <th>Дата регистрации</th>
              <th>Куплено туров</th>
              <th>Потрачено (₽)</th>
              <th>Статус</th>
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
                      value={editData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    client.fullName
                  )}
                </td>
                <td>
                  {editingId === client.id ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    client.email
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
                      type="date"
                      value={editData.registrationDate}
                      onChange={(e) => handleChange('registrationDate', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    client.registrationDate
                  )}
                </td>
                <td>
                  {editingId === client.id ? (
                    <input
                      type="number"
                      value={editData.toursPurchased}
                      onChange={(e) => handleChange('toursPurchased', parseInt(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    client.toursPurchased
                  )}
                </td>
                <td>
                  {editingId === client.id ? (
                    <input
                      type="number"
                      value={editData.totalSpent}
                      onChange={(e) => handleChange('totalSpent', parseInt(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    client.totalSpent.toLocaleString()
                  )}
                </td>
                <td>
                  {editingId === client.id ? (
                    <select
                      value={editData.status}
                      onChange={(e) => handleChange('status', e.target.value)}
                      style={{ width: '100%' }}
                    >
                      <option>Активный</option>
                      <option>Неактивный</option>
                      <option>VIP</option>
                    </select>
                  ) : (
                    <span style={{
                      color: client.status === 'Активный' ? '#27ae60' : client.status === 'VIP' ? '#f39c12' : '#95a5a6',
                      fontWeight: 'bold',
                    }}>
                      {client.status}
                    </span>
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
