import React, { useState, useEffect } from 'react';

const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const isHotTour = (startDate) => {
  if (!startDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const daysUntilStart = Math.ceil((start - today) / (1000 * 60 * 60 * 24));
  return daysUntilStart >= 0 && daysUntilStart <= 5;
};

function ToursManagementPage() {
  const [tours, setTours] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTour, setNewTour] = useState({
    name: '',
    city: '',
    price: '',
    start_date: '',
    end_date: '',
    services: '',
    available_count: '',
  });

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/tours');
      if (!response.ok) throw new Error('Ошибка загрузки туров');
      const data = await response.json();
      console.log('Loaded tours:', data);
      setTours(data);
      setError(null);
    } catch (err) {
      console.error('Ошибка загрузки туров:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tour) => {
    setEditingId(tour.id);
    setEditData({ ...tour });
  };

  const handleSave = async (id) => {
    try {
      console.log('Saving tour with ID:', id);
      console.log('Edit data:', editData);
      const duration = calculateDuration(editData.start_date, editData.end_date);
      const response = await fetch(`http://localhost:3000/api/tours/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editData.name,
          city: editData.city,
          price: parseFloat(editData.price),
          start_date: editData.start_date,
          end_date: editData.end_date,
          services: editData.services,
          available_count: parseInt(editData.available_count),
        }),
      });

      console.log('PUT response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server error:', errorData);
        throw new Error(`HTTP ${response.status}: ${errorData.message || 'Unknown error'}`);
      }
      
      setTours(tours.map(tour => 
        tour.id === id ? { ...editData, duration } : tour
      ));
      setEditingId(null);
      alert('Тур обновлен');
    } catch (err) {
      console.error('Error saving tour:', err);
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
        console.log('Deleting tour with ID:', id);
        const response = await fetch(`http://localhost:3000/api/tours/${id}`, {
          method: 'DELETE',
        });

        console.log('DELETE response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Server error:', errorData);
          throw new Error(`HTTP ${response.status}: ${errorData.message || 'Unknown error'}`);
        }
        
        setTours(tours.filter(tour => tour.id !== id));
        alert('Тур удален');
      } catch (err) {
        console.error('Error deleting tour:', err);
        alert('Ошибка при удалении: ' + err.message);
      }
    }
  };

  const handleAddTour = async (e) => {
    e.preventDefault();
    try {
      const duration = calculateDuration(newTour.start_date, newTour.end_date);
      const response = await fetch('http://localhost:3000/api/tours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newTour.name,
          city: newTour.city,
          price: parseFloat(newTour.price),
          
          start_date: newTour.start_date,
          end_date: newTour.end_date,
          services: newTour.services,
          available_count: parseInt(newTour.available_count),
        }),
      });

      if (!response.ok) throw new Error('Ошибка при создании тура');
      
      const createdTour = await response.json();
      setTours([...tours, createdTour]);
      setNewTour({
        name: '',
        city: '',
        price: '',
        start_date: '',
        end_date: '',
        services: '',
        available_count: '',
      });
      setShowAddForm(false);
      alert('Тур создан');
    } catch (err) {
      alert('Ошибка при создании: ' + err.message);
    }
  };

  if (loading) return <div><h1>Загрузка...</h1></div>;
  if (error) return <div><h1>Ошибка: {error}</h1></div>;

  return (
    <div>
      <h1 className="page-title">Управление турами</h1>

      <button 
        className="btn btn-success"
        onClick={() => setShowAddForm(!showAddForm)}
        style={{ marginBottom: '2rem' }}
      >
        {showAddForm ? 'Отмена' : 'Добавить новый тур'}
      </button>

      {showAddForm && (
        <div className="table-container" style={{ marginBottom: '2rem' }}>
          <form onSubmit={handleAddTour} style={{ padding: '2rem' }}>
            <h3>Новый тур</h3>
            
            <div className="form-group">
              <label className="form-label">Название</label>
              <input
                type="text"
                className="form-input"
                value={newTour.name}
                onChange={(e) => setNewTour({...newTour, name: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Город</label>
              <input
                type="text"
                className="form-input"
                value={newTour.city}
                onChange={(e) => setNewTour({...newTour, city: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Цена (₽)</label>
              <input
                type="number"
                className="form-input"
                value={newTour.price}
                onChange={(e) => setNewTour({...newTour, price: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Дата начала</label>
              <input
                type="date"
                className="form-input"
                value={newTour.start_date}
                onChange={(e) => setNewTour({...newTour, start_date: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Дата окончания</label>
              <input
                type="date"
                className="form-input"
                value={newTour.end_date}
                onChange={(e) => setNewTour({...newTour, end_date: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Услуги</label>
              <textarea
                className="form-textarea"
                value={newTour.services || ''}
                onChange={(e) => setNewTour({...newTour, services: e.target.value})}
                placeholder="Экскурсии, питание, трансфер..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Доступно мест</label>
              <input
                type="number"
                className="form-input"
                value={newTour.available_count}
                onChange={(e) => setNewTour({...newTour, available_count: e.target.value})}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Создать тур
            </button>
          </form>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Название</th>
              <th>Город</th>
              <th>Цена (₽)</th>
              <th>Длительность</th>
              <th>Дата начала</th>
              <th>Дата окончания</th>
              <th>Услуги</th>
              <th>Доступно мест</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {tours.map(tour => (
              <tr key={tour.id}>
                <td>
                  {editingId === tour.id ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    tour.name
                  )}
                </td>
                <td>
                  {editingId === tour.id ? (
                    <input
                      type="text"
                      value={editData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    tour.city
                  )}
                </td>
                <td>
                  {editingId === tour.id ? (
                    <input
                      type="number"
                      value={editData.price}
                      onChange={(e) => handleChange('price', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    parseFloat(tour.price).toLocaleString()
                  )}
                </td>
                <td>
                  {calculateDuration(tour.start_date, tour.end_date)} дн.
                </td>
                <td>
                  {editingId === tour.id ? (
                    <input
                      type="date"
                      value={editData.start_date}
                      onChange={(e) => handleChange('start_date', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    new Date(tour.start_date).toISOString().split('T')[0]
                  )}
                </td>
                <td>
                  {editingId === tour.id ? (
                    <input
                      type="date"
                      value={editData.end_date}
                      onChange={(e) => handleChange('end_date', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    new Date(tour.end_date).toISOString().split('T')[0]
                  )}
                </td>
                <td>
                  {editingId === tour.id ? (
                    <textarea
                      value={editData.services || ''}
                      onChange={(e) => handleChange('services', e.target.value)}
                      style={{ width: '100%', minHeight: '40px' }}
                    />
                  ) : (
                    tour.services || '-'
                  )}
                </td>
                <td>
                  {editingId === tour.id ? (
                    <input
                      type="number"
                      value={editData.available_count}
                      onChange={(e) => handleChange('available_count', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    tour.available_count
                  )}
                </td>
                <td>
                  <div className="table-actions">
                    {editingId === tour.id ? (
                      <>
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => handleSave(tour.id)}
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
                          onClick={() => handleEdit(tour)}
                        >
                          Редактировать
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(tour.id)}
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

export default ToursManagementPage;
