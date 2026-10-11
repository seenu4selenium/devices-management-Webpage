-- H2O Device Management Database Schema
CREATE DATABASE h2o_device_management;
USE h2o_device_management;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Normal User') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Devices table
CREATE TABLE devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type ENUM('Mobile', 'Tablet', 'Watch') NOT NULL,
    os ENUM('iOS', 'Android') NOT NULL,
    imei VARCHAR(20) UNIQUE NOT NULL,
    status ENUM('Available', 'In-Use') NOT NULL,
    until_use DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fashion products table
CREATE TABLE fashion_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Jewellery products table
CREATE TABLE jewellery_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category ENUM('Earrings', 'Ring', 'Bangles', 'Necklace', 'Chains', 'Oddiyaanam', 'Bracelets', 'Haaram') NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fashion cart table
CREATE TABLE fashion_cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_id INT,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES fashion_products(id) ON DELETE CASCADE
);

-- Jewellery cart table
CREATE TABLE jewellery_cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_id INT,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES jewellery_products(id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    order_type ENUM('Fashion', 'Jewellery') NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    delivery_address TEXT,
    payment_type ENUM('Credit Card', 'Debit Card', 'Cash on Delivery') NOT NULL,
    order_status ENUM('Pending', 'Confirmed', 'Shipped', 'Delivered') DEFAULT 'Pending',
    invoice_number VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order items table
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_name VARCHAR(100) NOT NULL,
    product_price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    item_total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Insert default users
INSERT INTO users (name, email, password, role) VALUES 
('admin', 'admin@h2o.com', 'admin123', 'Admin'),
('test', 'test@h2o.com', 'test', 'Normal User');

-- Insert sample devices
INSERT INTO devices (name, type, os, imei, status, until_use) VALUES 
('iPhone 14', 'Mobile', 'iOS', '123456789012345', 'Available', NULL),
('Samsung Galaxy S23', 'Mobile', 'Android', '234567890123456', 'In-Use', '2024-12-31 23:59:59'),
('iPad Pro', 'Tablet', 'iOS', '345678901234567', 'Available', NULL);

-- Insert sample jewellery products
INSERT INTO jewellery_products (name, category, price, image_path) VALUES 
('Traditional Gold Earrings', 'Earrings', 15000.00, 'images/earring1.jpg'),
('Designer Gold Studs', 'Earrings', 8500.00, 'images/earring2.jpg'),
('Classic Gold Band', 'Ring', 12000.00, 'images/ring1.jpg'),
('Diamond Gold Ring', 'Ring', 45000.00, 'images/ring2.jpg'),
('Traditional Gold Bangle', 'Bangles', 25000.00, 'images/bangle1.jpg');