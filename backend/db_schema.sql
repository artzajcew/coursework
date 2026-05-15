-- ============ УДАЛЕНИЕ СТАРЫХ ТАБЛИЦ ============
DROP TABLE IF EXISTS client_tour CASCADE;
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS tours CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS employees CASCADE;

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
    tour_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    available_left INT NOT NULL,
    sale_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
CREATE INDEX idx_client_tour_client_id ON client_tour(client_id);
CREATE INDEX idx_client_tour_tour_id ON client_tour(tour_id);
