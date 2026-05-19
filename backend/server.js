const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const pool = require('./db');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = 3000;

// Конфигурация Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Туристического Агентства',
      version: '1.0.0',
      description: 'API для управления клиентами, путевками и продажами туристического агентства',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Локальный сервер',
      },
    ],
  },
  apis: ['./server.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(cors());
app.use(bodyParser.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ========== ПОЛУЧЕНИЕ СПИСКОВ ==========

/**
 * @swagger
 * /api/clients:
 *   get:
 *     summary: Получить список всех клиентов
 *     tags: [Клиенты]
 *     responses:
 *       200:
 *         description: Список клиентов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   full_name:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   passport_number:
 *                     type: string
 *                   discount:
 *                     type: number
 */
// 1. Сведения о клиентах
app.get('/api/clients', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, full_name, phone, passport_number, discount, created_at FROM clients ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/tours:
 *   get:
 *     summary: Получить список всех путевок
 *     tags: [Путевки]
 *     responses:
 *       200:
 *         description: Список путевок
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
// 2. Сведения о путевках
app.get('/api/tours', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tours ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tours', async (req, res) => {
  const { name, city, price, start_date, end_date, services, available_count } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO tours (name, city, price, start_date, end_date, services, available_count) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, city, price, start_date, end_date, services || null, available_count]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('POST tour error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/tours/:id', async (req, res) => {
  const { id } = req.params;
  const { name, city, price, start_date, end_date, services, available_count } = req.body;

  try {
    const result = await pool.query(
      `UPDATE tours SET name=$1, city=$2, price=$3, start_date=$4, end_date=$5, services=$6, available_count=$7 
       WHERE id=$8 RETURNING *`,
      [name, city, price, start_date, end_date, services || null, available_count, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Тур не найден' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT tour error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/tours/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM tours WHERE id=$1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Тур не найден' });
    }

    res.json({ message: 'Тур удален' });
  } catch (err) {
    console.error('DELETE tour error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/sales:
 *   get:
 *     summary: Получить список всех продаж
 *     tags: [Продажи]
 *     responses:
 *       200:
 *         description: Список продаж
 */
// 3. Сведения о продажах
app.get('/api/sales', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sales ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/clients/:id/active-tours', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(`
      DELETE FROM client_tour 
      WHERE client_id = $1
    `, [id]);
    res.json({ message: 'Старая путевка удалена' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/sales', async (req, res) => {
  const { client_id, tour_id, quantity, sale_date } = req.body;

  try {
    // Добавляем продажу
    const salesResult = await pool.query(
  `INSERT INTO sales (tour_id, quantity, sale_date, available_left)
   VALUES ($1, $2, $3, $4) RETURNING *`,
  [tour_id, quantity, sale_date, 0]
);



    // Обновляем счетчик купленных путевок
    await pool.query(
      `UPDATE clients SET total_tours_purchased = total_tours_purchased + $1 
       WHERE id = $2`,
      [quantity, client_id]
    );

    // Если уже 3+ путевки, даем скидку 10%
    const clientResult = await pool.query(
      `SELECT total_tours_purchased FROM clients WHERE id = $1`,
      [client_id]
    );

    if (clientResult.rows[0].total_tours_purchased >= 3) {
      await pool.query(
        `UPDATE clients SET discount = 10 WHERE id = $1`,
        [client_id]
      );
    }

    res.json(salesResult.rows[0]);
  } catch (err) {
    console.error('POST sales error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/clients/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM clients WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Клиент не найден' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/clients/:id', async (req, res) => {
  const { id } = req.params;
  const { full_name, phone, passport_number, discount, total_tours_purchased } = req.body;

  try {
    // Автоматически устанавливаем скидку 10% если 3+ тура
    const calculatedDiscount = total_tours_purchased >= 3 ? 10 : (discount || 0);

    const result = await pool.query(
      `UPDATE clients SET full_name=$1, phone=$2, passport_number=$3, discount=$4, total_tours_purchased=$5 
       WHERE id=$6 RETURNING *`,
      [full_name, phone, passport_number || null, calculatedDiscount, total_tours_purchased, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Клиент не найден' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT client error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/clients/:id/active-tours', async (req, res) => {
  const { id } = req.params;
  try {
    const today = new Date().toISOString().split('T')[0];
    const result = await pool.query(`
      SELECT t.* FROM tours t
      JOIN client_tour ct ON t.id = ct.tour_id
      WHERE ct.client_id = $1 AND t.end_date >= $2
      LIMIT 1
    `, [id, today]);
    res.json(result.rows[0] || null);
  } catch (err) {
    console.error('GET active tours error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ========== ЗАПРОСЫ ПО ЗАДАНИЮ ==========

/**
 * @swagger
 * /api/clients/by-city/{city}:
 *   get:
 *     summary: Получить клиентов по выбранному городу
 *     tags: [Клиенты]
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: Название города
 *     responses:
 *       200:
 *         description: Список клиентов, выбравших данный город
 */
// 4. Кто из клиентов выбрал заданный город
app.get('/api/clients/by-city/:city', async (req, res) => {
  const { city } = req.params;
  try {
    const result = await pool.query(`
      SELECT c.*, t.city, t.name as tour_name 
      FROM clients c
      JOIN client_tour ct ON c.id = ct.client_id
      JOIN tours t ON ct.tour_id = t.id
      WHERE t.city = $1
    `, [city]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/tours/by-date/{date}:
 *   get:
 *     summary: Проверить наличие путевок с заданной датой
 *     tags: [Путевки]
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Дата начала путевки (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Результат поиска путевок
 */
// 5. Есть ли путевки с заданной датой начала
app.get('/api/tours/by-date/:date', async (req, res) => {
  const { date } = req.params;
  try {
    const result = await pool.query(`
      SELECT * FROM tours 
      WHERE start_date::date = $1::date
      ORDER BY start_date ASC
    `, [date]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/tours/hot:
 *   get:
 *     summary: Получить горящие путевки
 *     tags: [Путевки]
 *     description: Путевки с датой отправления не более чем на 5 дней позже текущей даты
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Базовая дата для расчета (по умолчанию - текущая)
 *     responses:
 *       200:
 *         description: Список горящих путевок
 */
// 6. Горящие путевки (дата отправления не более чем на 5 дней больше текущей)
app.get('/api/tours/hot', async (req, res) => {
  const currentDate = req.query.date || new Date().toISOString().split('T')[0];
  try {
    const result = await pool.query(`
      SELECT * FROM tours 
      WHERE start_date >= $1 
        AND start_date <= $1::date + INTERVAL '5 days'
      ORDER BY start_date
    `, [currentDate]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/loss-from-discounts:
 *   get:
 *     summary: Потери фирмы из-за скидок
 *     tags: [Аналитика]
 *     description: Расчет суммы потерь от предоставления скидок постоянным клиентам
 *     responses:
 *       200:
 *         description: Общая сумма потерь
 */
// 7. Сколько теряет фирма из-за скидок для постоянных клиентов
app.get('/api/loss-from-discounts', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(DISTINCT c.id) as clients_with_discount,
        COALESCE(SUM(s.quantity * t.price * c.discount / 100), 0) as total_losses
      FROM clients c
      LEFT JOIN sales s ON c.id = (SELECT client_id FROM client_tour WHERE tour_id = s.tour_id LIMIT 1)
      LEFT JOIN tours t ON s.tour_id = t.id
      WHERE c.discount > 0
    `);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/tours/most-expensive:
 *   get:
 *     summary: Самая дорогая путевка в продаже
 *     tags: [Путевки]
 *     responses:
 *       200:
 *         description: Информация о самой дорогой путевке
 */
// 8. Самая дорогая путевка из имеющихся в продаже на текущий день
app.get('/api/tours/most-expensive', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM tours 
      WHERE available_count > 0
      ORDER BY price DESC 
      LIMIT 1
    `);
    res.json(result.rows[0] || { message: 'Нет путевок в продаже' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/tours/top-demand:
 *   get:
 *     summary: Путевки с наибольшим спросом
 *     tags: [Аналитика]
 *     description: Топ-5 путевок по количеству продаж
 *     responses:
 *       200:
 *         description: Список популярных путевок
 */
// 9. Путевки, пользующиеся наибольшим спросом (по количеству продаж)
app.get('/api/tours/top-demand', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        t.id,
        t.name,
        t.city,
        t.price,
        SUM(s.quantity) as total_sold
      FROM tours t
      JOIN sales s ON t.id = s.tour_id
      GROUP BY t.id, t.name, t.city, t.price
      ORDER BY total_sold DESC
      LIMIT 5
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ========== ДОБАВЛЕНИЕ И УДАЛЕНИЕ КЛИЕНТОВ ДЛЯ ЗАДАННОЙ ПУТЕВКИ ==========

/**
 * @swagger
 * /api/client-tour:
 *   post:
 *     summary: Добавить клиента к путевке
 *     tags: [Клиенты и Путевки]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               client_id:
 *                 type: integer
 *               tour_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Клиент успешно добавлен
 */
// Добавить клиента к путевке
app.post('/api/client-tour', async (req, res) => {
  const { client_id, tour_id } = req.body;
  try {
    await pool.query(
      'INSERT INTO client_tour (client_id, tour_id) VALUES ($1, $2)',
      [client_id, tour_id]
    );
    res.json({ message: 'Клиент добавлен к путевке' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/client-tour/{client_id}/{tour_id}:
 *   delete:
 *     summary: Удалить клиента из путевки
 *     tags: [Клиенты и Путевки]
 *     parameters:
 *       - in: path
 *         name: client_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: tour_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Клиент успешно удален из путевки
 */
// Удалить клиента из путевки
app.delete('/api/client-tour/:client_id/:tour_id', async (req, res) => {
  const { client_id, tour_id } = req.params;
  try {
    await pool.query(
      'DELETE FROM client_tour WHERE client_id = $1 AND tour_id = $2',
      [client_id, tour_id]
    );
    res.json({ message: 'Клиент удален из путевки' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== ДОБАВЛЕНИЕ И УДАЛЕНИЕ КЛИЕНТОВ ==========

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Авторизация клиента или работника
 *     tags: [Авторизация]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешная авторизация
 *       401:
 *         description: Неверные учетные данные
 */
app.post('/api/login', async (req, res) => {
  const { phone, password } = req.body;
  
  if (!phone || !password) {
    return res.status(400).json({ error: 'Требуются номер телефона и пароль' });
  }

  try {
    console.log('Login attempt with phone:', phone);
    
    // Проверка в таблице клиентов
    let user = await pool.query('SELECT * FROM clients WHERE phone = $1', [phone]);
    let userType = 'client';

    // Если не найден в клиентах, проверить в работниках
    if (user.rows.length === 0) {
      user = await pool.query('SELECT * FROM employees WHERE phone = $1', [phone]);
      userType = 'employee';
    }

    // Если пользователь не найден
    if (user.rows.length === 0) {
      console.log('User not found with phone:', phone);
      return res.status(401).json({ error: 'Пользователь с этим номером телефона не найден' });
    }

    const userData = user.rows[0];
    console.log('User found:', userData.full_name, userData.phone);

    // Проверка пароля
    console.log('Checking password with hash:', userData.password_hash.substring(0, 10) + '...');
    const validPassword = await bcrypt.compare(password, userData.password_hash);
    console.log('Password valid:', validPassword);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Неверный пароль' });
    }

    // Успешная авторизация
    console.log('Login successful for:', userData.full_name);
    res.json({
      success: true,
      user: {
        id: userData.id,
        full_name: userData.full_name,
        phone: userData.phone,
        type: userType,
        role: userData.role || 'client'
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', (req, res) => {
  res.json({ valid: true });
});

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Регистрация нового клиента
 *     tags: [Авторизация]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               passport_number:
 *                 type: string
 *     responses:
 *       200:
 *         description: Клиент успешно зарегистрирован
 */
app.post('/api/register', async (req, res) => {
  const { full_name, phone, password, passport_number } = req.body;

  if (!full_name || !phone || !password) {
    return res.status(400).json({ error: 'Требуются имя, номер телефона и пароль' });
  }

  try {
    // Проверка, существует ли уже клиент с таким номером
    const existing = await pool.query('SELECT id FROM clients WHERE phone = $1', [phone]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Клиент с этим номером телефона уже существует' });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание клиента
    const result = await pool.query(
      'INSERT INTO clients (full_name, phone, passport_number, password_hash) VALUES ($1, $2, $3, $4) RETURNING *',
      [full_name, phone, passport_number || null, hashedPassword]
    );

    res.json({
      success: true,
      user: {
        id: result.rows[0].id,
        full_name: result.rows[0].full_name,
        phone: result.rows[0].phone,
        type: 'client',
        role: 'client'
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/employees:
 *   post:
 *     summary: Создать нового работника (админ)
 *     tags: [Работники]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Работник успешно создан
 */
app.post('/api/employees', async (req, res) => {
  const { full_name, phone, password, role } = req.body;

  if (!full_name || !phone || !password) {
    return res.status(400).json({ error: 'Требуются имя, номер телефона и пароль' });
  }

  try {
    // Проверка, существует ли уже работник с таким номером
    const existing = await pool.query('SELECT id FROM employees WHERE phone = $1', [phone]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Работник с этим номером телефона уже существует' });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание работника
    const result = await pool.query(
      'INSERT INTO employees (full_name, phone, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [full_name, phone, hashedPassword, role || 'employee']
    );

    res.json({
      success: true,
      employee: {
        id: result.rows[0].id,
        full_name: result.rows[0].full_name,
        phone: result.rows[0].phone,
        role: result.rows[0].role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/clients/{id}:
 *   delete:
 *     summary: Удалить клиента
 *     tags: [Клиенты]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Клиент успешно удален
 */
app.delete('/api/clients/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM clients WHERE id = $1', [id]);
    res.json({ message: 'Клиент удален' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Временный endpoint для генерации bcrypt хешей (для отладки)
app.post('/api/hash-password', async (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Требуется пароль' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    res.json({ password, hash: hashedPassword });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});