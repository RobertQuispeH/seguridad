-- Creación de la tabla de roles
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- Creación de la tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    role_id INT REFERENCES roles(id) ON DELETE SET NULL
);

-- Creación de la tabla de notas
CREATE TABLE IF NOT EXISTS grades (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    grade DECIMAL(5, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creación de la tabla de intentos de inicio de sesión
CREATE TABLE IF NOT EXISTS login_attempts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    success BOOLEAN NOT NULL
);


-- Creación de la tabla de datos sensibles
CREATE TABLE IF NOT EXISTS sensitive_data (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    data_type VARCHAR(50) NOT NULL,
    encrypted_data TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar roles iniciales
INSERT INTO roles (name, description) VALUES 
('admin', 'Administrador del sistema, acceso completo a todos los datos'),
('professor', 'Profesor, acceso a las notas de sus estudiantes'),
('student', 'Estudiante, acceso solo a sus propias notas');

INSERT INTO users (id, username, email, password_hash, created_at, updated_at, last_login, role_id)
VALUES
    (2, 'robert', 'robert@example.com', '$2b$12$Mdm6uxekZgAGDBFAo.C8n.Vvz/dTtOUg/qiui2SylcjPLDlgGOdsS', '2024-12-21 23:29:53.068', '2024-12-21 23:29:53.068', NULL, 1),
    (3, 'profe', 'profe@example.com', '$2b$12$0D80B9wG15wlbYpk96I/Bu.CQM5oU0avcXRx4LusBLPa6ju2HWtT.', '2024-12-22 19:42:34.933', '2024-12-22 19:42:34.933', NULL, 2);

