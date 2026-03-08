let devices = JSON.parse(localStorage.getItem('devices')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [];

// Initialize default users if no users exist
if (users.length === 0) {
    users = [
        {
            id: Date.now(),
            name: 'admin',
            email: 'admin@example.com',
            password: 'admin123',
            role: 'Admin'
        },
        {
            id: Date.now() + 1,
            name: 'test',
            email: 'test@example.com',
            password: 'test',
            role: 'User'
        }
    ];
    localStorage.setItem('users', JSON.stringify(users));
}

// Initialize sample devices if no devices exist
if (devices.length === 0) {
    const now = new Date();
    const futureDate1 = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
    const futureDate2 = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
    const futureDate3 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
    
    devices = [
        {
            id: Date.now(),
            name: 'iPhone 14 Pro',
            type: 'Mobile',
            os: 'iOS',
            imei: '123456789012345',
            status: 'In-Use',
            untilUse: futureDate1
        },
        {
            id: Date.now() + 1,
            name: 'Samsung Galaxy S23',
            type: 'Mobile',
            os: 'Android',
            imei: '234567890123456',
            status: 'Available',
            untilUse: ''
        },
        {
            id: Date.now() + 2,
            name: 'iPad Air',
            type: 'Tablet',
            os: 'iOS',
            imei: '345678901234567',
            status: 'In-Use',
            untilUse: futureDate2
        },
        {
            id: Date.now() + 3,
            name: 'Samsung Tab S8',
            type: 'Tablet',
            os: 'Android',
            imei: '456789012345678',
            status: 'Available',
            untilUse: ''
        },
        {
            id: Date.now() + 4,
            name: 'Apple Watch Series 8',
            type: 'Watch',
            os: 'iOS',
            imei: '567890123456789',
            status: 'In-Use',
            untilUse: futureDate3
        },
        {
            id: Date.now() + 5,
            name: 'Google Pixel 7',
            type: 'Mobile',
            os: 'Android',
            imei: '678901234567890',
            status: 'Available',
            untilUse: ''
        }
    ];
    localStorage.setItem('devices', JSON.stringify(devices));
}

function addUser() {
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const password = document.getElementById('userPassword').value.trim();
    const role = document.getElementById('userRole').value;

    if (!name || !email || !password || !role) {
        alert('Please fill all fields');
        return;
    }

    const user = {
        id: Date.now(),
        name,
        email,
        password,
        role
    };

    users.push(user);
    saveUsers();
    renderUsers();
    clearUserInputs();
}

function deleteUser(id) {
    users = users.filter(user => user.id !== id);
    saveUsers();
    renderUsers();
}

function renderUsers() {
    const tbody = document.getElementById('userTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${'*'.repeat(user.password ? user.password.length : 3)}</td>
            <td>${user.role}</td>
            <td>
                <button class="edit-btn" onclick="editUser(${user.id})">Edit</button>
                <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

function clearUserInputs() {
    document.getElementById('userName').value = '';
    document.getElementById('userEmail').value = '';
    document.getElementById('userPassword').value = '';
    document.getElementById('userRole').value = '';
}

function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (!username || !password) {
        alert('Please fill all fields');
        return;
    }
    
    // Reload users from localStorage to ensure we have latest data
    users = JSON.parse(localStorage.getItem('users')) || [];
    
    const user = users.find(u => u.name === username && u.password === password);
    
    if (user) {
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('userDisplay').textContent = `Logged in as: ${username}`;
        
        const userMgmtTab = document.querySelector('button[onclick="openTab(event, \'userManagement\')"]');
        if (userMgmtTab) {
            if (user.role === 'Admin') {
                userMgmtTab.style.display = 'inline-block';
            } else {
                userMgmtTab.style.display = 'none';
                openTab({currentTarget: document.querySelector('button[onclick="openTab(event, \'deviceManagement\')"]')}, 'deviceManagement');
            }
        }
    } else {
        alert('Invalid credentials! Please try again.');
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    }
}

function logout() {
    document.getElementById('mainApp').style.display = 'none';
    document.getElementById('loginModal').style.display = 'flex';
    // Clear the input fields when logging out
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

function showResetPassword() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('resetPasswordModal').style.display = 'flex';
}

function closeResetPassword() {
    document.getElementById('resetPasswordModal').style.display = 'none';
    document.getElementById('loginModal').style.display = 'flex';
    document.getElementById('resetUsername').value = '';
    document.getElementById('newPassword').value = '';
}

function resetPassword() {
    const username = document.getElementById('resetUsername').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    
    if (!username || !newPassword) {
        alert('Please fill all fields');
        return;
    }
    
    // Find user and update password
    const userIndex = users.findIndex(user => user.name === username);
    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        saveUsers();
        renderUsers();
        alert('Password updated successfully!');
        closeResetPassword();
    } else {
        alert('User not found!');
    }
}

function showSignUp() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('signUpModal').style.display = 'flex';
}

function resetLocalStorage() {
    if (confirm('This will reset all data. Continue?')) {
        localStorage.clear();
        location.reload();
    }
}

function closeSignUp() {
    document.getElementById('signUpModal').style.display = 'none';
    document.getElementById('loginModal').style.display = 'flex';
    document.getElementById('signUpName').value = '';
    document.getElementById('signUpPassword').value = '';
    document.getElementById('signUpEmail').value = '';
    document.getElementById('signUpRole').value = '';
}

function signUp() {
    const name = document.getElementById('signUpName').value.trim();
    const password = document.getElementById('signUpPassword').value.trim();
    const email = document.getElementById('signUpEmail').value.trim();
    const role = document.getElementById('signUpRole').value;
    
    if (!name || !password || !email || !role) {
        alert('Please fill all fields');
        return;
    }
    
    if (users.find(u => u.email === email)) {
        alert('User with this email already exists!');
        return;
    }
    
    const user = {
        id: Date.now(),
        name,
        email,
        password,
        role
    };
    
    users.push(user);
    saveUsers();
    alert('Account created successfully! You can now login.');
    closeSignUp();
}

function editUser(id) {
    const user = users.find(u => u.id === id);
    if (!user) return;
    
    // Store the user ID for updating
    window.editingUserId = id;
    
    // Pre-fill the edit form with existing values
    document.getElementById('editUserName').value = user.name;
    document.getElementById('editUserEmail').value = user.email;
    document.getElementById('editUserPassword').value = user.password;
    document.getElementById('editUserRole').value = user.role;
    
    // Show the edit modal
    document.getElementById('editUserModal').style.display = 'flex';
}

function closeEditUser() {
    document.getElementById('editUserModal').style.display = 'none';
    window.editingUserId = null;
}

function updateUser() {
    const name = document.getElementById('editUserName').value.trim();
    const email = document.getElementById('editUserEmail').value.trim();
    const password = document.getElementById('editUserPassword').value.trim();
    const role = document.getElementById('editUserRole').value;
    
    if (!name || !email || !password || !role) {
        alert('Please fill all fields');
        return;
    }
    
    // Find and update the user
    const userIndex = users.findIndex(u => u.id === window.editingUserId);
    if (userIndex !== -1) {
        users[userIndex] = {
            id: window.editingUserId,
            name,
            email,
            password,
            role
        };
        
        saveUsers();
        renderUsers();
        closeEditUser();
        alert('User updated successfully!');
    }
}

function openTab(evt, tabName) {
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }
    
    const tabButtons = document.getElementsByClassName('tab-button');
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }
    
    document.getElementById(tabName).classList.add('active');
    if (evt && evt.currentTarget) {
        evt.currentTarget.classList.add('active');
    }
    
    // Load data when tabs are opened
    if (tabName === 'userManagement') {
        setTimeout(loadUsers, 100);
    }
    
    if (tabName === 'deviceManagement') {
        setTimeout(loadDevices, 100);
    }
    
    if (tabName === 'automationExercise') {
        const subTabButtons = document.querySelectorAll('#automationExercise .sub-tab-button');
        const subTabContents = document.querySelectorAll('#automationExercise .sub-tab-content');
        
        subTabButtons.forEach(btn => btn.classList.remove('active'));
        subTabContents.forEach(content => content.classList.remove('active'));
        
        if (subTabButtons[0]) subTabButtons[0].classList.add('active');
        if (subTabContents[0]) subTabContents[0].classList.add('active');
        
        setTimeout(loadProducts, 50);
    }
}

function openSubTab(evt, subTabName) {
    const subTabContents = document.getElementsByClassName('sub-tab-content');
    for (let i = 0; i < subTabContents.length; i++) {
        subTabContents[i].classList.remove('active');
    }
    
    const subTabButtons = document.getElementsByClassName('sub-tab-button');
    for (let i = 0; i < subTabButtons.length; i++) {
        subTabButtons[i].classList.remove('active');
    }
    
    document.getElementById(subTabName).classList.add('active');
    evt.currentTarget.classList.add('active');
    
    // Render users when User Management tab is opened
    if (subTabName === 'userManagementSub') {
        setTimeout(() => {
            renderUsers();
        }, 100);
    }
    
    // Load products when Products tab is opened
    if (subTabName === 'products') {
        loadProducts();
    }
    
    // Update cart display when Cart tab is opened
    if (subTabName === 'cart') {
        updateCartDisplay();
    }
    
    // Render devices when Device Details tab is opened
    if (subTabName === 'deviceDetails') {
        setTimeout(() => {
            renderDevices2();
        }, 200);
    }
}

function addDevice() {
    const name = document.getElementById('deviceName').value.trim();
    const type = document.getElementById('deviceType').value.trim();
    const status = document.getElementById('deviceStatus').value.trim();

    if (!name || !type || !status) {
        alert('Please fill all fields');
        return;
    }

    const device = {
        id: Date.now(),
        name,
        type,
        status
    };

    devices.push(device);
    saveDevices();
    renderDevices();
    renderDevices2();
    clearInputs();
}

let editingDeviceId = null;

function editDevice(id) {
    const device = devices.find(d => d.id === id);
    if (!device) return;
    
    editingDeviceId = id;
    
    document.getElementById('deviceName2').value = device.name;
    document.getElementById('deviceType2').value = device.type || '';
    document.getElementById('deviceOS2').value = device.os || '';
    document.getElementById('deviceIMEI2').value = device.imei || '';
    document.getElementById('deviceUntilUse2').value = device.untilUse || '';
    document.getElementById('deviceStatus2').value = device.status;
    
    document.getElementById('addDeviceBtn').style.display = 'none';
    document.getElementById('updateDeviceBtn').style.display = 'inline-block';
    document.getElementById('cancelEditBtn').style.display = 'inline-block';
}

function updateDevice() {
    const name = document.getElementById('deviceName2').value.trim();
    const type = document.getElementById('deviceType2').value;
    const os = document.getElementById('deviceOS2').value;
    const imei = document.getElementById('deviceIMEI2').value.trim();
    const untilUse = document.getElementById('deviceUntilUse2').value;
    const status = document.getElementById('deviceStatus2').value;

    if (!name || !type || !os || !imei || !untilUse || !status) {
        alert('Please fill all fields');
        return;
    }
    
    // Validate until use date is not in the past
    const selectedDate = new Date(untilUse);
    const currentDate = new Date();
    if (selectedDate <= currentDate) {
        alert('Until Use date must be in the future');
        return;
    }

    const deviceIndex = devices.findIndex(d => d.id === editingDeviceId);
    if (deviceIndex !== -1) {
        devices[deviceIndex] = {
            id: editingDeviceId,
            name,
            type,
            os,
            imei,
            untilUse,
            status
        };
        
        saveDevices();
        renderDevices2();
        cancelEdit();
    }
}

function cancelEdit() {
    editingDeviceId = null;
    
    document.getElementById('deviceName2').value = '';
    document.getElementById('deviceType2').value = '';
    document.getElementById('deviceOS2').value = '';
    document.getElementById('deviceIMEI2').value = '';
    document.getElementById('deviceUntilUse2').value = '';
    document.getElementById('deviceStatus2').value = '';
    
    // Reset min date to current date/time
    const now = new Date();
    const minDateTime = now.toISOString().slice(0, 16);
    document.getElementById('deviceUntilUse2').min = minDateTime;
    
    document.getElementById('addDeviceBtn').style.display = 'inline-block';
    document.getElementById('updateDeviceBtn').style.display = 'none';
    document.getElementById('cancelEditBtn').style.display = 'none';
}

function addDevice2() {
    const now = new Date();
    const minDateTime = now.toISOString().slice(0, 16);
    document.getElementById('deviceUntilUse2').min = minDateTime;
    
    const name = document.getElementById('deviceName2').value.trim();
    const type = document.getElementById('deviceType2').value;
    const os = document.getElementById('deviceOS2').value;
    const imei = document.getElementById('deviceIMEI2').value.trim();
    const untilUse = document.getElementById('deviceUntilUse2').value;
    const status = document.getElementById('deviceStatus2').value;

    if (!name || !type || !os || !imei || !untilUse || !status) {
        alert('Please fill all fields');
        return;
    }
    
    const selectedDate = new Date(untilUse);
    const currentDate = new Date();
    if (selectedDate <= currentDate) {
        alert('Until Use date must be in the future');
        return;
    }

    const device = {
        id: Date.now(),
        name,
        type,
        os,
        imei,
        untilUse,
        status
    };

    devices.push(device);
    saveDevices();
    renderDevices2();
    
    document.getElementById('deviceName2').value = '';
    document.getElementById('deviceType2').value = '';
    document.getElementById('deviceOS2').value = '';
    document.getElementById('deviceIMEI2').value = '';
    document.getElementById('deviceUntilUse2').value = '';
    document.getElementById('deviceStatus2').value = '';
}

function deleteDevice(id) {
    if (confirm('Are you sure you want to delete this device?')) {
        devices = devices.filter(device => device.id !== id);
        saveDevices();
        setTimeout(() => {
            renderDevices2();
        }, 100);
    }
}

function renderDevices() {
    const tbody = document.getElementById('deviceTableBody');
    tbody.innerHTML = '';

    devices.forEach(device => {
        const row = document.createElement('tr');
        const statusClass = device.status.toLowerCase() === 'active' ? 'status-active' : 'status-inactive';
        
        row.innerHTML = `
            <td>${device.name}</td>
            <td>${device.type}</td>
            <td class="${statusClass}">${device.status}</td>
            <td>
                <button class="delete-btn" onclick="deleteDevice(${device.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function checkExpiredDevices() {
    const currentDate = new Date();
    let updated = false;
    
    devices.forEach(device => {
        if (device.untilUse && new Date(device.untilUse) < currentDate) {
            device.status = 'Available';
            device.untilUse = '';
            updated = true;
        }
    });
    
    if (updated) {
        saveDevices();
        renderDevices2();
    }
}

function renderDevices2() {
    checkExpiredDevices();
    
    const tbody = document.getElementById('deviceTableBody2');
    if (!tbody) return;
    tbody.innerHTML = '';

    devices.forEach(device => {
        const row = document.createElement('tr');
        let statusClass = '';
        if (device.status.toLowerCase() === 'available') {
            statusClass = 'status-available';
        } else if (device.status.toLowerCase() === 'in-use') {
            statusClass = 'status-in-use';
        }
        
        row.innerHTML = `
            <td>${device.name}</td>
            <td>${device.type}</td>
            <td>${device.os || 'N/A'}</td>
            <td>${device.imei || 'N/A'}</td>
            <td class="${statusClass}">${device.status}</td>
            <td>${device.untilUse ? new Date(device.untilUse).toLocaleString() : 'N/A'}</td>
            <td>
                <button class="edit-btn" onclick="editDevice(${device.id})">Edit</button>
                <button class="delete-btn" data-id="${device.id}">Delete</button>
            </td>
        `;
        
        // Add event listener to delete button
        const deleteBtn = row.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', function() {
            deleteDevice(device.id);
        });
        
        tbody.appendChild(row);
    });
}

function saveDevices() {
    localStorage.setItem('devices', JSON.stringify(devices));
}

function clearInputs() {
    document.getElementById('deviceName').value = '';
    document.getElementById('deviceType').value = '';
    document.getElementById('deviceStatus').value = '';
}

function closeCalendar() {
    const input = document.getElementById('deviceUntilUse2');
    input.blur();
    document.activeElement.blur();
    input.style.display = 'none';
    setTimeout(() => {
        input.style.display = 'block';
    }, 50);
}

function validateDate(input) {
    const selectedDate = new Date(input.value);
    const currentDate = new Date();
    
    if (selectedDate < currentDate) {
        alert('Please select a future date and time');
        input.value = '';
    }
}

// Load data on page load
document.addEventListener('DOMContentLoaded', function() {
    const now = new Date();
    const minDateTime = now.toISOString().slice(0, 16);
    document.getElementById('deviceUntilUse2').min = minDateTime;
    
    setTimeout(loadProducts, 100);
    setTimeout(loadUsers, 200);
    setTimeout(loadDevices, 300);
});

// Products data and pagination
const allProducts = [
    { img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=250&fit=crop", name: "Men's Cotton T-Shirt", price: "$25.99" },
    { img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200&h=250&fit=crop", name: "Women's Casual T-Shirt", price: "$22.99" },
    { img: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=200&h=250&fit=crop", name: "Kids Fun T-Shirt", price: "$15.99" },
    { img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=250&fit=crop", name: "Men's Denim Jeans", price: "$45.99" },
    { img: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=200&h=250&fit=crop", name: "Women's Summer Dress", price: "$35.99" },
    { img: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=250&fit=crop", name: "Kids Cotton Shorts", price: "$12.99" },
    { img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&h=250&fit=crop", name: "Men's Casual Hoodie", price: "$39.99" },
    { img: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=250&fit=crop", name: "Women's Denim Jacket", price: "$49.99" },
    { img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200&h=250&fit=crop", name: "Kids Warm Sweater", price: "$28.99" },
    { img: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=200&h=250&fit=crop", name: "Men's Formal Shirt", price: "$32.99" },
    { img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=200&h=250&fit=crop", name: "Women's Pleated Skirt", price: "$26.99" },
    { img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=250&fit=crop", name: "Men's Winter Coat", price: "$89.99" },
    { img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=250&fit=crop", name: "Women's Blouse", price: "$29.99" },
    { img: "https://images.unsplash.com/photo-1564859228273-274232fdb516?w=200&h=250&fit=crop", name: "Kids Pajamas", price: "$18.99" },
    { img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&h=250&fit=crop", name: "Men's Polo Shirt", price: "$27.99" },
    { img: "https://images.unsplash.com/photo-1544957992-20514f595d6f?w=200&h=250&fit=crop", name: "Women's Cardigan", price: "$42.99" },
    { img: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=200&h=250&fit=crop", name: "Kids Track Pants", price: "$19.99" },
    { img: "https://images.unsplash.com/photo-1564859228273-274232fdb516?w=200&h=250&fit=crop", name: "Men's Sweatshirt", price: "$34.99" },
    { img: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=200&h=250&fit=crop", name: "Women's Tank Top", price: "$16.99" },
    { img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&h=250&fit=crop", name: "Kids School Uniform", price: "$24.99" },
    { img: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=200&h=250&fit=crop", name: "Men's Chinos", price: "$38.99" },
    { img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=200&h=250&fit=crop", name: "Women's Crop Top", price: "$21.99" },
    { img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=250&fit=crop", name: "Kids Rain Jacket", price: "$31.99" },
    { img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=250&fit=crop", name: "Men's Vest", price: "$23.99" },
    { img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=250&fit=crop", name: "Women's Maxi Dress", price: "$52.99" },
    { img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&h=250&fit=crop", name: "Kids Denim Overalls", price: "$33.99" },
    { img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=250&fit=crop", name: "Men's Blazer", price: "$79.99" },
    { img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200&h=250&fit=crop", name: "Women's Leggings", price: "$17.99" },
    { img: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=200&h=250&fit=crop", name: "Kids Sports Jersey", price: "$22.99" },
    { img: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=250&fit=crop", name: "Men's Henley Shirt", price: "$26.99" },
    { img: "https://images.unsplash.com/photo-1544957992-20514f595d6f?w=200&h=250&fit=crop", name: "Women's Wrap Dress", price: "$44.99" },
    { img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200&h=250&fit=crop", name: "Kids Cargo Shorts", price: "$16.99" },
    { img: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=200&h=250&fit=crop", name: "Men's Skinny Jeans", price: "$41.99" },
    { img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200&h=250&fit=crop", name: "Women's Midi Skirt", price: "$29.99" },
    { img: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=250&fit=crop", name: "Kids Graphic Tee", price: "$14.99" },
    { img: "https://images.unsplash.com/photo-1564859228273-274232fdb516?w=200&h=250&fit=crop", name: "Men's Zip Hoodie", price: "$43.99" }
];

let currentPage = 1;
const productsPerPage = 8;
const totalPages = Math.ceil(allProducts.length / productsPerPage);

function loadProducts() {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = allProducts.slice(startIndex, endIndex);
    
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    
    productsToShow.forEach((product, index) => {
        const globalIndex = startIndex + index;
        const productCard = `
            <div class="product-card">
                <img src="${product.img}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.price}</p>
                <button class="add-to-cart-btn" onclick="addToCartByIndex(${globalIndex})">Add to Cart</button>
            </div>
        `;
        grid.innerHTML += productCard;
    });
    
    updatePagination();
}

function updatePagination() {
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('firstBtn').disabled = currentPage === 1;
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === totalPages;
    document.getElementById('lastBtn').disabled = currentPage === totalPages;
}

function firstPage() {
    currentPage = 1;
    loadProducts();
}

function lastPage() {
    currentPage = totalPages;
    loadProducts();
}

function filterDevicesAdvanced() {
    const nameFilter = document.getElementById('nameFilter').value.toLowerCase();
    const typeFilter = document.getElementById('typeFilter').value.toLowerCase();
    const imeiFilter = document.getElementById('imeiFilter').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const tbody = document.getElementById('deviceTableBody2');
    if (!tbody) return;
    const rows = tbody.getElementsByTagName('tr');
    
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        const name = cells[0].textContent.toLowerCase();
        const type = cells[1].textContent.toLowerCase();
        const imei = cells[3].textContent.toLowerCase();
        const status = cells[4].textContent;
        
        const nameMatch = name.includes(nameFilter);
        const typeMatch = type.includes(typeFilter);
        const imeiMatch = imei.includes(imeiFilter);
        const statusMatch = statusFilter === '' || status === statusFilter;
        
        rows[i].style.display = (nameMatch && typeMatch && imeiMatch && statusMatch) ? '' : 'none';
    }
}

function clearFilters() {
    document.getElementById('nameFilter').value = '';
    document.getElementById('typeFilter').value = '';
    document.getElementById('imeiFilter').value = '';
    document.getElementById('statusFilter').value = '';
    filterDevicesAdvanced();
}

function filterUsersAdvanced() {
    const nameFilter = document.getElementById('nameFilterUser').value.toLowerCase();
    const emailFilter = document.getElementById('emailFilter').value.toLowerCase();
    const roleFilter = document.getElementById('roleFilter').value;
    const tbody = document.getElementById('userTableBody');
    if (!tbody) return;
    const rows = tbody.getElementsByTagName('tr');
    
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        const name = cells[0].textContent.toLowerCase();
        const email = cells[1].textContent.toLowerCase();
        const role = cells[3].textContent;
        
        const nameMatch = name.includes(nameFilter);
        const emailMatch = email.includes(emailFilter);
        const roleMatch = roleFilter === '' || role === roleFilter;
        
        rows[i].style.display = (nameMatch && emailMatch && roleMatch) ? '' : 'none';
    }
}

function clearUserFilters() {
    document.getElementById('nameFilterUser').value = '';
    document.getElementById('emailFilter').value = '';
    document.getElementById('roleFilter').value = '';
    filterUsersAdvanced();
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        loadProducts();
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        loadProducts();
    }
}

function filterProducts() {
    const nameFilter = document.getElementById('productNameFilter').value.toLowerCase();
    const priceRange = document.getElementById('productPriceFilter').value;
    
    const filteredProducts = allProducts.filter(product => {
        const nameMatch = product.name.toLowerCase().includes(nameFilter);
        
        let priceMatch = true;
        if (priceRange) {
            const price = parseFloat(product.price.replace('$', ''));
            
            switch(priceRange) {
                case '0-10':
                    priceMatch = price >= 0 && price <= 10;
                    break;
                case '11-29':
                    priceMatch = price >= 11 && price <= 29;
                    break;
                case '30-75':
                    priceMatch = price >= 30 && price <= 75;
                    break;
                case '76-150':
                    priceMatch = price >= 76 && price <= 150;
                    break;
                case '150+':
                    priceMatch = price > 150;
                    break;
            }
        }
        
        return nameMatch && priceMatch;
    });
    
    displayFilteredProducts(filteredProducts);
}

function displayFilteredProducts(products) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    
    products.forEach((product, index) => {
        const productIndex = allProducts.findIndex(p => p.name === product.name);
        const productCard = `
            <div class="product-card">
                <img src="${product.img}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.price}</p>
                <button class="add-to-cart-btn" onclick="addToCartByIndex(${productIndex})">Add to Cart</button>
            </div>
        `;
        grid.innerHTML += productCard;
    });
    
    // Hide pagination when filtering
    const pagination = document.querySelector('.pagination');
    if (pagination) {
        pagination.style.display = products.length === allProducts.length ? 'flex' : 'none';
    }
}

function clearProductFilters() {
    document.getElementById('productNameFilter').value = '';
    document.getElementById('productPriceFilter').value = '';
    loadProducts(); // Reload original paginated view
    const pagination = document.querySelector('.pagination');
    if (pagination) {
        pagination.style.display = 'flex';
    }
}

function addToCartByIndex(index) {
    const product = allProducts[index];
    addToCart(product);
}

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];
function addToCart(product) {
    const existingItem = cart.find(item => item.name === product.name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({...product, quantity: 1});
    }
    
    saveCart();
    updateCartDisplay();
    alert('Product added to cart!');
    
    // Navigate to cart page and highlight cart tab
    openSubTab({currentTarget: document.querySelectorAll('#automationExercise .sub-tab-button')[1]}, 'cart');
}

function increaseQuantity(index) {
    cart[index].quantity += 1;
    saveCart();
    updateCartDisplay();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        saveCart();
        updateCartDisplay();
    }
}

function removeFromCartByIndex(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartDisplay();
}

function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    saveCart();
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems || !cartTotal) return;
    
    cartItems.innerHTML = '';
    let total = 0;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
    } else {
        cart.forEach((item, index) => {
            const price = parseFloat(item.price.replace('$', ''));
            const itemTotal = price * item.quantity;
            total += itemTotal;
            
            const cartItem = `
                <div class="cart-item">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>Price: ${item.price} | Total: $${itemTotal.toFixed(2)}</p>
                    </div>
                    <div class="quantity-controls">
                        <label>Quantity:</label>
                        <button class="qty-btn" onclick="decreaseQuantity(${index})">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="qty-btn" onclick="increaseQuantity(${index})">+</button>
                    </div>
                    <button class="remove-item-btn" onclick="removeFromCartByIndex(${index})">Remove</button>
                </div>
            `;
            cartItems.innerHTML += cartItem;
        });
    }
    
    cartTotal.textContent = total.toFixed(2);
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function clearCart() {
    if (confirm('Are you sure you want to clear the cart?')) {
        cart = [];
        saveCart();
        updateCartDisplay();
    }
}

function toggleCardDetails() {
    const paymentType = document.getElementById('paymentType').value;
    const cardDetails = document.getElementById('cardDetails');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const payConfirmBtn = document.getElementById('payConfirmBtn');
    const cardNumberLabel = document.querySelector('label[for="cardNumber"]');
    
    if (paymentType === 'Credit Card' || paymentType === 'Debit Card') {
        cardDetails.style.display = 'block';
        placeOrderBtn.style.display = 'none';
        payConfirmBtn.style.display = 'inline-block';
        
        if (paymentType === 'Credit Card') {
            cardNumberLabel.textContent = 'Credit Card Number:';
        } else {
            cardNumberLabel.textContent = 'Debit Card Number:';
        }
    } else {
        cardDetails.style.display = 'none';
        placeOrderBtn.style.display = 'inline-block';
        payConfirmBtn.style.display = 'none';
    }
}

function payAndConfirm() {
    const address = document.getElementById('deliveryAddress').value.trim();
    const paymentType = document.getElementById('paymentType').value;
    const nameOnCard = document.getElementById('nameOnCard').value.trim();
    const cardNumber = document.getElementById('cardNumber').value.trim();
    const cvv = document.getElementById('cvv').value.trim();
    const expiration = document.getElementById('expiration').value.trim();
    
    if (!address) {
        alert('Please enter your delivery address');
        return;
    }
    
    if (!nameOnCard || !cardNumber || !cvv || !expiration) {
        alert('Please fill all card details');
        return;
    }
    
    // Store address before clearing
    localStorage.setItem('lastDeliveryAddress', address);
    
    // Generate and display invoice number
    currentInvoiceNumber = new Date().toISOString().replace(/[-T:Z.]/g, '').slice(0, 14);
    document.getElementById('invoiceNumberDisplay').textContent = `Invoice Number: ${currentInvoiceNumber}`;
    
    // Show order placed page
    const subTabContents = document.getElementsByClassName('sub-tab-content');
    for (let i = 0; i < subTabContents.length; i++) {
        subTabContents[i].classList.remove('active');
    }
    document.getElementById('orderPlaced').classList.add('active');
    
    // Clear cart and form
    cart = [];
    saveCart();
    document.getElementById('deliveryAddress').value = '';
    document.getElementById('paymentType').value = '';
    document.getElementById('nameOnCard').value = '';
    document.getElementById('cardNumber').value = '';
    document.getElementById('cvv').value = '';
    document.getElementById('expiration').value = '';
}

function downloadInvoice() {
    const total = document.getElementById('checkoutTotal').textContent;
    const address = localStorage.getItem('lastDeliveryAddress') || 'Not provided';
    const invoiceContent = `Help2Others Invoice\n================\nInvoice Number: ${currentInvoiceNumber}\nOrder Total: $${total}\nDate: ${new Date().toLocaleDateString()}\nBilling Address: ${address}\n\nThanks for shopping.\n\nThank you for your purchase!`;
    
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'invoice.txt';
    a.click();
    window.URL.revokeObjectURL(url);
}

function continueToProducts() {
    openSubTab({currentTarget: document.querySelectorAll('#automationExercise .sub-tab-button')[0]}, 'products');
}

function showCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Switch to checkout tab
    const subTabContents = document.getElementsByClassName('sub-tab-content');
    for (let i = 0; i < subTabContents.length; i++) {
        subTabContents[i].classList.remove('active');
    }
    document.getElementById('checkout').classList.add('active');
    
    // Update checkout total
    const total = cart.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('$', ''));
        return sum + (price * item.quantity);
    }, 0);
    document.getElementById('checkoutTotal').textContent = total.toFixed(2);
}

function backToCart() {
    const subTabContents = document.getElementsByClassName('sub-tab-content');
    for (let i = 0; i < subTabContents.length; i++) {
        subTabContents[i].classList.remove('active');
    }
    document.getElementById('cart').classList.add('active');
}

let currentInvoiceNumber = '';

function placeOrder() {
    const address = document.getElementById('deliveryAddress').value.trim();
    const paymentType = document.getElementById('paymentType').value;
    
    if (!address) {
        alert('Please enter your delivery address');
        return;
    }
    
    if (!paymentType) {
        alert('Please select a payment type');
        return;
    }
    
    // Store address before clearing
    localStorage.setItem('lastDeliveryAddress', address);
    
    // Generate and display invoice number
    currentInvoiceNumber = new Date().toISOString().replace(/[-T:Z.]/g, '').slice(0, 14);
    document.getElementById('invoiceNumberDisplay').textContent = `Invoice Number: ${currentInvoiceNumber}`;
    
    // Show order placed page
    const subTabContents = document.getElementsByClassName('sub-tab-content');
    for (let i = 0; i < subTabContents.length; i++) {
        subTabContents[i].classList.remove('active');
    }
    document.getElementById('orderPlaced').classList.add('active');
    
    // Clear cart and form
    cart = [];
    saveCart();
    document.getElementById('deliveryAddress').value = '';
    document.getElementById('paymentType').value = '';
    
    updateCartDisplay();
}

function showGoldCategory(category) {
    // Hide all gold categories
    const categories = document.querySelectorAll('.gold-category');
    categories.forEach(cat => cat.classList.remove('active'));
    
    // Remove active class from all side menu buttons
    const buttons = document.querySelectorAll('.side-menu-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected category
    document.getElementById('gold-' + category).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}
let jewelleryCart = [];

function addToJewelleryCart(name, price, image) {
    const existingItem = jewelleryCart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        jewelleryCart.push({
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    updateJewelleryCartDisplay();
    alert('Item added to cart!');
}

function updateJewelleryCartDisplay() {
    const cartItems = document.getElementById('jewelleryCartItems');
    const cartTotal = document.getElementById('jewelleryCartTotal');
    
    cartItems.innerHTML = '';
    let total = 0;
    
    jewelleryCart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartItems.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px;">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>₹${item.price}</p>
                    <div class="quantity-controls">
                        <button onclick="changeJewelleryQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeJewelleryQuantity(${index}, 1)">+</button>
                    </div>
                </div>
                <div class="item-total">
                    <p>₹${itemTotal}</p>
                    <button onclick="removeFromJewelleryCart(${index})" class="remove-btn">Remove</button>
                </div>
            </div>
        `;
    });
    
    cartTotal.textContent = total;
}

function changeJewelleryQuantity(index, change) {
    jewelleryCart[index].quantity += change;
    if (jewelleryCart[index].quantity <= 0) {
        jewelleryCart.splice(index, 1);
    }
    updateJewelleryCartDisplay();
}

function removeFromJewelleryCart(index) {
    jewelleryCart.splice(index, 1);
    updateJewelleryCartDisplay();
}

function clearJewelleryCart() {
    jewelleryCart = [];
    updateJewelleryCartDisplay();
}

function checkoutJewellery() {
    if (jewelleryCart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = jewelleryCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const confirmed = confirm(`Total: ₹${total}\n\nConfirm your order?`);
    
    if (confirmed) {
        alert('Order placed successfully!');
        jewelleryCart = [];
        updateJewelleryCartDisplay();
    }
}

function showJewelleryCheckout() {
    if (jewelleryCart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const subTabContents = document.getElementsByClassName('sub-tab-content');
    for (let i = 0; i < subTabContents.length; i++) {
        subTabContents[i].classList.remove('active');
    }
    document.getElementById('jewelleryCheckout').classList.add('active');
    
    const total = jewelleryCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('jewelleryCheckoutTotal').textContent = total;
}

function backToJewelleryCart() {
    const subTabContents = document.getElementsByClassName('sub-tab-content');
    for (let i = 0; i < subTabContents.length; i++) {
        subTabContents[i].classList.remove('active');
    }
    document.getElementById('branches').classList.add('active');
}

function toggleJewelleryCardDetails() {
    const paymentType = document.getElementById('jewelleryPaymentType').value;
    const cardDetails = document.getElementById('jewelleryCardDetails');
    const placeOrderBtn = document.getElementById('jewelleryPlaceOrderBtn');
    const payConfirmBtn = document.getElementById('jewelleryPayConfirmBtn');
    
    if (paymentType === 'Credit Card' || paymentType === 'Debit Card') {
        cardDetails.style.display = 'block';
        placeOrderBtn.style.display = 'none';
        payConfirmBtn.style.display = 'inline-block';
    } else {
        cardDetails.style.display = 'none';
        placeOrderBtn.style.display = 'inline-block';
        payConfirmBtn.style.display = 'none';
    }
}

function placeJewelleryOrder() {
    const address = document.getElementById('jewelleryAddress').value.trim();
    const paymentType = document.getElementById('jewelleryPaymentType').value;
    
    if (!address) {
        alert('Please enter your delivery address');
        return;
    }
    
    if (!paymentType) {
        alert('Please select a payment type');
        return;
    }
    
    localStorage.setItem('lastJewelleryAddress', address);
    
    const invoiceNumber = new Date().toISOString().replace(/[-T:Z.]/g, '').slice(0, 14);
    document.getElementById('jewelleryInvoiceNumberDisplay').textContent = `Invoice Number: ${invoiceNumber}`;
    
    const subTabContents = document.getElementsByClassName('sub-tab-content');
    for (let i = 0; i < subTabContents.length; i++) {
        subTabContents[i].classList.remove('active');
    }
    document.getElementById('jewelleryOrderPlaced').classList.add('active');
    
    jewelleryCart = [];
    updateJewelleryCartDisplay();
    document.getElementById('jewelleryAddress').value = '';
    document.getElementById('jewelleryPaymentType').value = '';
}

function payAndConfirmJewellery() {
    const address = document.getElementById('jewelleryAddress').value.trim();
    const nameOnCard = document.getElementById('jewelleryNameOnCard').value.trim();
    const cardNumber = document.getElementById('jewelleryCardNumber').value.trim();
    const cvv = document.getElementById('jewelleryCvv').value.trim();
    const expiration = document.getElementById('jewelleryExpiration').value.trim();
    
    if (!address) {
        alert('Please enter your delivery address');
        return;
    }
    
    if (!nameOnCard || !cardNumber || !cvv || !expiration) {
        alert('Please fill all card details');
        return;
    }
    
    localStorage.setItem('lastJewelleryAddress', address);
    
    const invoiceNumber = new Date().toISOString().replace(/[-T:Z.]/g, '').slice(0, 14);
    document.getElementById('jewelleryInvoiceNumberDisplay').textContent = `Invoice Number: ${invoiceNumber}`;
    
    const subTabContents = document.getElementsByClassName('sub-tab-content');
    for (let i = 0; i < subTabContents.length; i++) {
        subTabContents[i].classList.remove('active');
    }
    document.getElementById('jewelleryOrderPlaced').classList.add('active');
    
    jewelleryCart = [];
    updateJewelleryCartDisplay();
    document.getElementById('jewelleryAddress').value = '';
    document.getElementById('jewelleryPaymentType').value = '';
    document.getElementById('jewelleryNameOnCard').value = '';
    document.getElementById('jewelleryCardNumber').value = '';
    document.getElementById('jewelleryCvv').value = '';
    document.getElementById('jewelleryExpiration').value = '';
}

function downloadJewelleryInvoice() {
    const total = document.getElementById('jewelleryCheckoutTotal').textContent;
    const address = localStorage.getItem('lastJewelleryAddress') || 'Not provided';
    const invoiceNumber = document.getElementById('jewelleryInvoiceNumberDisplay').textContent.replace('Invoice Number: ', '');
    const invoiceContent = `H2O Jewellery Invoice\n================\nInvoice Number: ${invoiceNumber}\nOrder Total: ₹${total}\nDate: ${new Date().toLocaleDateString()}\nDelivery Address: ${address}\n\nThank you for your purchase!`;
    
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jewellery-invoice.txt';
    a.click();
    window.URL.revokeObjectURL(url);
}

function continueToJewellery() {
    const subTabContents = document.getElementsByClassName('sub-tab-content');
    for (let i = 0; i < subTabContents.length; i++) {
        subTabContents[i].classList.remove('active');
    }
    document.getElementById('gold').classList.add('active');
}
async function loadUsers() {
    try {
        const response = await fetch('/api/users');
        const users = await response.json();
        renderUsersFromDB(users);
    } catch (error) {
        console.error('Failed to load users');
    }
}

function renderUsersFromDB(users) {
    const tbody = document.getElementById('userTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${'*'.repeat(user.password ? user.password.length : 3)}</td>
            <td>${user.role}</td>
            <td>
                <button class="edit-btn" onclick="editUser(${user.id})">Edit</button>
                <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function loadDevices() {
    try {
        const response = await fetch('/api/devices');
        const devices = await response.json();
        renderDevicesFromDB(devices);
    } catch (error) {
        console.error('Failed to load devices');
    }
}

function renderDevicesFromDB(devices) {
    const tbody = document.getElementById('deviceTableBody2');
    if (!tbody) return;
    tbody.innerHTML = '';

    devices.forEach(device => {
        const row = document.createElement('tr');
        let statusClass = '';
        if (device.status.toLowerCase() === 'available') {
            statusClass = 'status-available';
        } else if (device.status.toLowerCase() === 'in-use') {
            statusClass = 'status-in-use';
        }
        
        row.innerHTML = `
            <td>${device.name}</td>
            <td>${device.type}</td>
            <td>${device.os || 'N/A'}</td>
            <td>${device.imei || 'N/A'}</td>
            <td class="${statusClass}">${device.status}</td>
            <td>${device.until_use ? new Date(device.until_use).toLocaleString() : 'N/A'}</td>
            <td>
                <button class="edit-btn" onclick="editDevice(${device.id})">Edit</button>
                <button class="delete-btn" onclick="deleteDevice(${device.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}
function showDiamondCategory(category) {
    const categories = document.querySelectorAll('.diamond-category');
    categories.forEach(cat => cat.classList.remove('active'));
    
    const buttons = document.querySelectorAll('#diamond .side-menu-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById('diamond-' + category).classList.add('active');
    event.target.classList.add('active');
}

function showFAQCategory(category) {
    const categories = document.querySelectorAll('.faq-category');
    categories.forEach(cat => cat.classList.remove('active'));
    
    const buttons = document.querySelectorAll('#faqs .side-menu-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById('faq-' + category).classList.add('active');
    event.target.classList.add('active');
}
