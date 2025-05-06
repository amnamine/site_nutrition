// Global variables
let currentUser = null;
const API_URL = 'http://localhost:3000/api';

// DOM Elements
const loginSection = document.getElementById('login-section');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const adminSection = document.getElementById('admin-section');
const dietitianSection = document.getElementById('dietitian-section');
const patientFormSection = document.getElementById('patient-form-section');
const patientForm = document.getElementById('patient-form');
const userNameSpan = document.getElementById('user-name');

// Event Listeners
loginForm.addEventListener('submit', handleLogin);
logoutBtn.addEventListener('click', handleLogout);
patientForm.addEventListener('submit', handlePatientSubmit);

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (data.success) {
            currentUser = data.user;
            localStorage.setItem('token', data.token);
            showDashboard();
        } else {
            alert('Erreur de connexion: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Erreur de connexion au serveur');
    }
}

function handleLogout() {
    localStorage.removeItem('token');
    currentUser = null;
    showLoginSection();
}

// UI Functions
function showDashboard() {
    loginSection.style.display = 'none';
    dashboard.style.display = 'block';
    userNameSpan.textContent = currentUser.username;

    // Show relevant sections based on user role
    if (currentUser.role === 'admin') {
        adminSection.style.display = 'block';
        dietitianSection.style.display = 'none';
    } else if (currentUser.role === 'dietitian') {
        adminSection.style.display = 'none';
        dietitianSection.style.display = 'block';
        loadAppointments();
        loadPatients();
    }
}

function showLoginSection() {
    loginSection.style.display = 'flex';
    dashboard.style.display = 'none';
    adminSection.style.display = 'none';
    dietitianSection.style.display = 'none';
    patientFormSection.style.display = 'none';
    loginForm.reset();
}

// User Management Functions
function showUserManagement() {
    const userManagementHtml = `
        <div id="user-management-section">
            <h3>Gestion des Utilisateurs</h3>
            <form id="add-user-form">
                <input type="text" name="username" placeholder="Nom d'utilisateur" required>
                <input type="password" name="password" placeholder="Mot de passe" required>
                <select name="role" required>
                    <option value="">Sélectionner un rôle</option>
                    <option value="dietitian">Diététicien</option>
                    <option value="admin">Administrateur</option>
                </select>
                <button type="submit">Ajouter Utilisateur</button>
            </form>
            <div id="users-list"></div>
        </div>
    `;
    
    dietitianSection.style.display = 'none';
    patientFormSection.style.display = 'none';
    adminSection.innerHTML = `
        <h2>Administration</h2>
        <div class="admin-controls">
            <button onclick="showUserManagement()">Gestion des Utilisateurs</button>
            <button onclick="showPatientManagement()">Gestion des Patients</button>
        </div>
        ${userManagementHtml}
    `;
    adminSection.style.display = 'block';
    
    // Add event listener for the new user form
    document.getElementById('add-user-form').addEventListener('submit', handleAddUser);
    loadUsers();
}

async function handleAddUser(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (data.success) {
            alert('Utilisateur créé avec succès');
            e.target.reset();
            loadUsers();
        } else {
            alert('Erreur: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Erreur lors de la création de l\'utilisateur');
    }
}

async function loadUsers() {
    try {
        const response = await fetch(`${API_URL}/users`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });

        const data = await response.json();

        if (data.success) {
            const usersList = document.getElementById('users-list');
            usersList.innerHTML = '<h4>Liste des Utilisateurs</h4>';
            data.users.forEach(user => {
                const userElement = document.createElement('div');
                userElement.className = 'user-item';
                userElement.innerHTML = `
                    <p>Nom: ${user.username}</p>
                    <p>Rôle: ${user.role}</p>
                `;
                usersList.appendChild(userElement);
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Patient Management Functions
function showPatientManagement() {
    const patientManagementHtml = `
        <div id="patient-management-section">
            <h3>Gestion des Patients</h3>
            <form id="patient-form">
                <input type="text" name="name" placeholder="Nom complet" required>
                <input type="number" name="age" placeholder="Âge" required>
                <select name="sex" required>
                    <option value="">Sélectionner le sexe</option>
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                </select>
                <input type="tel" name="phone" placeholder="Téléphone" required>
                <input type="number" name="weight" placeholder="Poids (kg)" step="0.1" required>
                <input type="number" name="height" placeholder="Taille (cm)" required>
                <button type="submit">Ajouter Patient</button>
            </form>
            <div id="patients-list" class="patients-grid"></div>
        </div>
    `;
    
    dietitianSection.style.display = 'none';
    adminSection.innerHTML = `
        <h2>Administration</h2>
        <div class="admin-controls">
            <button onclick="showUserManagement()">Gestion des Utilisateurs</button>
            <button onclick="showPatientManagement()">Gestion des Patients</button>
        </div>
        ${patientManagementHtml}
    `;
    adminSection.style.display = 'block';
    
    // Add event listener for the patient form
    document.getElementById('patient-form').addEventListener('submit', handlePatientSubmit);
    loadPatients();
}

async function handlePatientSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const patientData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`${API_URL}/patients`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(patientData),
        });

        const data = await response.json();

        if (data.success) {
            alert('Patient enregistré avec succès');
            e.target.reset();
            loadPatients();
        } else {
            alert('Erreur: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Erreur lors de l\'enregistrement du patient');
    }
}

async function loadPatients() {
    try {
        const response = await fetch(`${API_URL}/patients`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });

        const data = await response.json();

        if (data.success) {
            displayPatients(data.patients);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayPatients(patients) {
    const patientsList = document.getElementById('patients-list');
    if (!patientsList) return;
    
    patientsList.innerHTML = '<h4>Liste des Patients</h4>';

    if (patients.length === 0) {
        patientsList.innerHTML += '<p>Aucun patient enregistré</p>';
        return;
    }

    patients.forEach(patient => {
        const patientCard = document.createElement('div');
        patientCard.className = 'patient-card';
        const imc = (patient.weight / Math.pow(patient.height / 100, 2)).toFixed(1);
        
        patientCard.innerHTML = `
            <h4>${patient.name}</h4>
            <p>Age: ${patient.age} ans</p>
            <p>Sexe: ${patient.sex === 'M' ? 'Masculin' : 'Féminin'}</p>
            <p>Téléphone: ${patient.phone}</p>
            <p>Poids: ${patient.weight} kg</p>
            <p>Taille: ${patient.height} cm</p>
            <p>IMC: ${imc}</p>
            <button onclick="viewPatientDetails(${patient.id})">Voir détails</button>
            <button onclick="deletePatient(${patient.id})" class="delete-btn">Supprimer</button>
        `;
        patientsList.appendChild(patientCard);
    });
}

async function deletePatient(patientId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce patient ?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/patients/${patientId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });

        const data = await response.json();

        if (data.success) {
            alert('Patient supprimé avec succès');
            loadPatients();
        } else {
            alert('Erreur: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Erreur lors de la suppression du patient');
    }
}

// Appointment Functions
async function loadAppointments() {
    try {
        const response = await fetch(`${API_URL}/appointments`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });

        const data = await response.json();

        if (data.success) {
            displayAppointments(data.appointments);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayAppointments(appointments) {
    const calendar = document.getElementById('appointments-calendar');
    calendar.innerHTML = '';

    appointments.forEach(appointment => {
        const appointmentCard = document.createElement('div');
        appointmentCard.className = 'appointment-card';
        appointmentCard.innerHTML = `
            <h4>${appointment.patientName}</h4>
            <p>Date: ${new Date(appointment.date).toLocaleString()}</p>
            <button onclick="viewAppointmentDetails(${appointment.id})">Voir détails</button>
        `;
        calendar.appendChild(appointmentCard);
    });
}

// Check for existing session
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        // Verify token and load user data
        fetch(`${API_URL}/auth/verify`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                currentUser = data.user;
                showDashboard();
            } else {
                showLoginSection();
            }
        })
        .catch(() => {
            showLoginSection();
        });
    }
}); 