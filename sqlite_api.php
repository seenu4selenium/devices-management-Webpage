<?php
include 'sqlite_config.php';
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
}
?>