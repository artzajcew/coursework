-- Миграция: Добавление поля email в таблицу clients
-- Если поле email уже существует, этот скрипт будет работать без ошибок

-- Проверяем, есть ли поле email и добавляем его, если его нет
ALTER TABLE clients ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Если нужно сделать email уникальным
ALTER TABLE clients ADD CONSTRAINT clients_email_unique UNIQUE (email);

-- Проверяем, что поле exists
-- SELECT * FROM clients LIMIT 1;
