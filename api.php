<?php
include 'db_config.php';
header('Content-Type: application/json');

$action = $_POST['action'] ?? $_GET['action'] ?? '';

switch($action) {
    case 'login':
        $username = $_POST['username'];
        $password = $_POST['password'];
        
        $stmt = $pdo->prepare("SELECT * FROM users WHERE name = ? AND password = ?");
        $stmt->execute([$username, $password]);
        $user = $stmt->fetch();
        
        if($user) {
            echo json_encode(['success' => true, 'user' => $user]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
        }
        break;
        
    case 'signup':
        $name = $_POST['name'];
        $email = $_POST['email'];
        $password = $_POST['password'];
        $role = $_POST['role'];
        
        $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
        if($stmt->execute([$name, $email, $password, $role])) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Registration failed']);
        }
        break;
        
    case 'getUsers':
        $stmt = $pdo->query("SELECT * FROM users");
        $users = $stmt->fetchAll();
        echo json_encode($users);
        break;
        
    case 'addDevice':
        $name = $_POST['name'];
        $type = $_POST['type'];
        $os = $_POST['os'];
        $imei = $_POST['imei'];
        $status = $_POST['status'];
        $until_use = $_POST['until_use'];
        
        $stmt = $pdo->prepare("INSERT INTO devices (name, type, os, imei, status, until_use) VALUES (?, ?, ?, ?, ?, ?)");
        if($stmt->execute([$name, $type, $os, $imei, $status, $until_use])) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Device add failed']);
        }
        break;
        
    case 'getDevices':
        $stmt = $pdo->query("SELECT * FROM devices");
        $devices = $stmt->fetchAll();
        echo json_encode($devices);
        break;
        
    case 'addToCart':
        $user_id = $_POST['user_id'];
        $product_name = $_POST['product_name'];
        $price = $_POST['price'];
        $image_path = $_POST['image_path'];
        $category = $_POST['category'];
        
        // First insert product if not exists
        $stmt = $pdo->prepare("INSERT IGNORE INTO jewellery_products (name, category, price, image_path) VALUES (?, ?, ?, ?)");
        $stmt->execute([$product_name, $category, $price, $image_path]);
        
        // Get product ID
        $stmt = $pdo->prepare("SELECT id FROM jewellery_products WHERE name = ?");
        $stmt->execute([$product_name]);
        $product = $stmt->fetch();
        
        // Add to cart
        $stmt = $pdo->prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE quantity = quantity + 1");
        if($stmt->execute([$user_id, $product['id']])) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false]);
        }
        break;
        
    case 'getCart':
        $user_id = $_GET['user_id'];
        $stmt = $pdo->prepare("SELECT c.*, p.name, p.price, p.image_path FROM cart c JOIN jewellery_products p ON c.product_id = p.id WHERE c.user_id = ?");
        $stmt->execute([$user_id]);
        $cart = $stmt->fetchAll();
        echo json_encode($cart);
        break;
}
?>