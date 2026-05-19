import React, { useState, useEffect } from 'react';

function SalesJournalPage() {
  const [sales, setSales] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/sales');
      if (!response.ok) throw new Error('Ошибка загрузки продаж');
      const data = await response.json();
      setSales(data);
      setError(null);
    } catch (err) {
      console.error('Ошибка загрузки продаж:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sale) => {
    setEditingId(sale.id);
    setEditData({ ...sale });
  };

  const handleSave = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/sales/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: editData.quantity,
          available_left: editData.available_left,
          sale_date: editData.sale_date,
        }),
      });

      if (!response.ok) throw new Error('Ошибка при сохранении');
      
      setSales(sales.map(sale => 
        sale.id === id ? editData : sale
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
        const response = await fetch(`http://localhost:3000/api/sales/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Ошибка при удалении');
        
        setSales(sales.filter(sale => sale.id !== id));
        alert('Запись удалена');
      } catch (err) {
        alert('Ошибка при удалении: ' + err.message);
      }
    }
  };

  if (loading) return <div><h1>Загрузка...</h1></div>;
  if (error) return <div><h1>Ошибка: {error}</h1></div>;

  return (
    <div>
      <h1 className="page-title">Журнал продаж</h1>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID Тура</th>
              <th>Количество</th>
              <th>Осталось</th>
              <th>Дата продажи</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(sale => (
              <tr key={sale.id}>
                <td>
                  {editingId === sale.id ? (
                    <input
                      type="number"
                      value={editData.tour_id}
                      onChange={(e) => handleChange('tour_id', parseInt(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    sale.tour_id
                  )}
                </td>
                <td>
                  {editingId === sale.id ? (
                    <input
                      type="number"
                      value={editData.quantity}
                      onChange={(e) => handleChange('quantity', parseInt(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    sale.quantity
                  )}
                </td>
                <td>
                  {editingId === sale.id ? (
                    <input
                      type="number"
                      value={editData.available_left}
                      onChange={(e) => handleChange('available_left', parseInt(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    sale.available_left
                  )}
                </td>
                <td>
                  {editingId === sale.id ? (
                    <input
                      type="date"
                      value={editData.sale_date}
                      onChange={(e) => handleChange('sale_date', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    sale.sale_date
                  )}
                </td>
                <td>
                  <div className="table-actions">
                    {editingId === sale.id ? (
                      <>
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => handleSave(sale.id)}
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
                          onClick={() => handleEdit(sale)}
                        >
                          Редактировать
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(sale.id)}
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

export default SalesJournalPage;
