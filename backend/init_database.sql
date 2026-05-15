-- ===============================================
-- ИНИЦИАЛИЗАЦИЯ БД ДЛЯ ТУРИСТИЧЕСКОГО АГЕНТСТВА
-- ===============================================

-- ============ УДАЛЕНИЕ СТАРЫХ ТАБЛИЦ ============
DROP TABLE IF EXISTS client_tour CASCADE;
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS tours CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS clients CASCADE;

-- ============ ТАБЛИЦА КЛИЕНТОВ ============
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    passport_number VARCHAR(20),
    discount NUMERIC(5,2) DEFAULT 0,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============ ТАБЛИЦА РАБОТНИКОВ ============
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'employee',  -- employee, manager, admin
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============ ТАБЛИЦА ТУРОВ ============
CREATE TABLE tours (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    city VARCHAR(100) NOT NULL,
    services TEXT,
    price NUMERIC(10,2) NOT NULL,
    available_count INT NOT NULL,
    is_hot BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============ ТАБЛИЦА ПРОДАЖ ============
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    tour_id INT NOT NULL,
    quantity INT NOT NULL,
    available_left INT NOT NULL,
    sale_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
);

-- ============ ТАБЛИЦА СВЯЗИ КЛИЕНТОВ И ТУРОВ (M:M) ============
CREATE TABLE client_tour (
    client_id INT NOT NULL,
    tour_id INT NOT NULL,
    applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (client_id, tour_id),
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
);

-- ============ ИНДЕКСЫ ДЛЯ ПРОИЗВОДИТЕЛЬНОСТИ ============
CREATE INDEX idx_clients_phone ON clients(phone);
CREATE INDEX idx_employees_phone ON employees(phone);
CREATE INDEX idx_tours_start_date ON tours(start_date);
CREATE INDEX idx_tours_is_hot ON tours(is_hot);
CREATE INDEX idx_client_tour_client_id ON client_tour(client_id);
CREATE INDEX idx_client_tour_tour_id ON client_tour(tour_id);
CREATE INDEX idx_sales_tour_id ON sales(tour_id);
CREATE INDEX idx_sales_sale_date ON sales(sale_date);

-- ============ ВСТАВКА ПРИМЕРОВ ТУРОВ ============
INSERT INTO tours (name, start_date, end_date, city, services, price, available_count, is_hot)
VALUES
    ('Тур в Барселону', '2026-05-15', '2026-05-22', 'Барселона', 'Отель 4*, Завтрак, Экскурсии', 85000.00, 10, TRUE),
    ('Отдых в Анталье', '2026-05-20', '2026-05-27', 'Анталья', 'Отель 5*, All Inclusive', 65000.00, 15, TRUE),
    ('Горы Кавказа', '2026-05-25', '2026-06-05', 'Сочи', 'Горные походы, Базовый лагерь', 45000.00, 20, FALSE),
    ('Экскурсия по Европе', '2026-06-01', '2026-06-15', 'Париж', 'Франция, Люксембург, Бельгия', 120000.00, 8, FALSE),
    ('Туры по России', '2026-05-10', '2026-05-17', 'Москва', 'Красная площадь, Кремль, Музеи', 35000.00, 25, TRUE);

-- ============ ПРИМЕЧАНИЯ ДЛЯ СОЗДАНИЯ ТЕСТОВЫХ КЛИЕНТОВ И РАБОТНИКОВ ============
-- 
-- Для создания клиента используйте POST /api/register с пароль, который будет захеширован bcrypt
-- Пример запроса:
-- POST /api/register
-- {
--   "full_name": "Иван Петров",
--   "phone": "+7 (999) 123-45-67",
--   "password": "password123",
--   "passport_number": "1234567890"
-- }
--
-- Для создания работника используйте POST /api/employees
-- Пример запроса:
-- POST /api/employees
-- {
--   "full_name": "Мария Сидорова",
--   "phone": "+7 (999) 987-65-43",
--   "password": "admin123",
--   "role": "manager"
-- }
--
-- Для входа используйте POST /api/login
-- {
--   "phone": "+7 (999) 123-45-67",
--   "password": "password123"
-- }
