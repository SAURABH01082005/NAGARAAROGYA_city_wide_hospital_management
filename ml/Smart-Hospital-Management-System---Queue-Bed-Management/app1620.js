// Hospital Management System JavaScript

class HospitalManagementSystem {
    constructor() {
        this.currentUser = null;
        this.currentSection = 'dashboard';
        this.data = {
            users: [
                {"id": 1, "name": "Dr. Sarah Johnson", "role": "Doctor", "department": "Cardiology"},
                {"id": 2, "name": "Nurse Mike Chen", "role": "Nurse", "department": "General"},
                {"id": 3, "name": "Admin Lisa Kumar", "role": "Admin", "department": "Administration"}
            ],
            patients: [
                {"id": "P001", "name": "John Smith", "age": 45, "department": "Cardiology", "priority": "High", "waitTime": "15 mins", "status": "Waiting", "checkinTime": "09:30 AM"},
                {"id": "P002", "name": "Emma Davis", "age": 32, "department": "General", "priority": "Medium", "waitTime": "25 mins", "status": "In Progress", "checkinTime": "09:45 AM"},
                {"id": "P003", "name": "Robert Wilson", "age": 67, "department": "Orthopedics", "priority": "Low", "waitTime": "40 mins", "status": "Waiting", "checkinTime": "10:00 AM"},
                {"id": "P004", "name": "Maria Garcia", "age": 29, "department": "Emergency", "priority": "Critical", "waitTime": "5 mins", "status": "Called", "checkinTime": "10:15 AM"},
                {"id": "P005", "name": "David Brown", "age": 55, "department": "General", "priority": "Medium", "waitTime": "30 mins", "status": "Waiting", "checkinTime": "10:30 AM"}
            ],
            beds: [
                {"id": "B101", "ward": "General", "floor": 1, "status": "Available", "patient": null, "lastCleaned": "10:00 AM"},
                {"id": "B102", "ward": "General", "floor": 1, "status": "Occupied", "patient": "John Doe", "admissionTime": "08:30 AM", "expectedDischarge": "Tomorrow"},
                {"id": "B103", "ward": "ICU", "floor": 2, "status": "Occupied", "patient": "Jane Smith", "admissionTime": "Yesterday", "expectedDischarge": "3 days"},
                {"id": "B104", "ward": "Cardiology", "floor": 2, "status": "Cleaning", "patient": null, "lastCleaned": "Ongoing"},
                {"id": "B201", "ward": "Orthopedics", "floor": 2, "status": "Available", "patient": null, "lastCleaned": "09:45 AM"},
                {"id": "B202", "ward": "Maternity", "floor": 3, "status": "Occupied", "patient": "Anna Johnson", "admissionTime": "2 days ago", "expectedDischarge": "1 week"},
                {"id": "B203", "ward": "General", "floor": 1, "status": "Available", "patient": null, "lastCleaned": "11:00 AM"},
                {"id": "B204", "ward": "ICU", "floor": 2, "status": "Maintenance", "patient": null, "lastCleaned": "N/A"}
            ],
            departments: [
                {"name": "General", "queueCount": 12, "avgWaitTime": "35 mins", "bedsAvailable": 8, "totalBeds": 25},
                {"name": "Cardiology", "queueCount": 6, "avgWaitTime": "20 mins", "bedsAvailable": 3, "totalBeds": 15},
                {"name": "Orthopedics", "queueCount": 8, "avgWaitTime": "45 mins", "bedsAvailable": 5, "totalBeds": 20},
                {"name": "Emergency", "queueCount": 3, "avgWaitTime": "8 mins", "bedsAvailable": 2, "totalBeds": 10},
                {"name": "ICU", "queueCount": 1, "avgWaitTime": "5 mins", "bedsAvailable": 1, "totalBeds": 8}
            ],
            hospitalStats: {
                totalBeds: 150,
                availableBeds: 42,
                occupiedBeds: 108,
                totalPatients: 89,
                queueLength: 30,
                admissionsToday: 15,
                dischargestoday: 12,
                avgWaitTime: "28 mins"
            },
            cityHospitals: [
                {"name": "City General Hospital", "availableBeds": 42, "totalBeds": 150, "distance": "Current", "emergency": false},
                {"name": "Metro Medical Center", "availableBeds": 18, "totalBeds": 120, "distance": "2.3 km", "emergency": false},
                {"name": "Regional Health Complex", "availableBeds": 35, "totalBeds": 200, "distance": "4.7 km", "emergency": false},
                {"name": "Emergency Care Hospital", "availableBeds": 8, "totalBeds": 80, "distance": "1.8 km", "emergency": true}
            ],
            analytics: {
                weeklyAdmissions: [45, 52, 38, 61, 48, 55, 42],
                hourlyQueue: [8, 12, 18, 25, 30, 35, 28, 22, 15, 10, 8, 12],
                departmentUtilization: [
                    {"department": "General", "utilization": 85},
                    {"department": "Cardiology", "utilization": 92},
                    {"department": "Orthopedics", "utilization": 75},
                    {"department": "Emergency", "utilization": 80},
                    {"department": "ICU", "utilization": 95}
                ]
            }
        };
        this.charts = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showLoginModal();
        this.updateLastUpdated();
        
        // Update data every 30 seconds
        setInterval(() => {
            this.simulateDataUpdates();
            if (this.currentUser) {
                this.updateDashboard();
                this.updateLastUpdated();
            }
        }, 30000);
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Login form submitted');
                this.handleLogin();
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                if (section) {
                    this.switchSection(section);
                }
            });
        });

        // Department filter
        const deptFilter = document.getElementById('departmentFilter');
        if (deptFilter) {
            deptFilter.addEventListener('change', (e) => {
                this.filterQueue(e.target.value);
            });
        }

        // Ward filter
        const wardFilter = document.getElementById('wardFilter');
        if (wardFilter) {
            wardFilter.addEventListener('change', (e) => {
                this.filterBeds(e.target.value);
            });
        }

        // Registration tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                if (tab) {
                    this.switchTab(tab);
                }
            });
        });

        // Registration forms
        const newPatientForm = document.getElementById('newPatientForm');
        if (newPatientForm) {
            newPatientForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.registerNewPatient();
            });
        }

        const existingPatientForm = document.getElementById('existingPatientForm');
        if (existingPatientForm) {
            existingPatientForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.checkInExistingPatient();
            });
        }

        // Modal close
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.closeModal(modal);
                }
            });
        });

        // Analytics timeframe
        const analyticsTimeframe = document.getElementById('analyticsTimeframe');
        if (analyticsTimeframe) {
            analyticsTimeframe.addEventListener('change', (e) => {
                this.updateAnalytics(e.target.value);
            });
        }

        // Modal backdrop click to close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                // Don't close login modal this way
                if (e.target.id !== 'loginModal') {
                    this.closeModal(e.target);
                }
            }
        });

        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const visibleModal = document.querySelector('.modal:not(.hidden)');
                if (visibleModal && visibleModal.id !== 'loginModal') {
                    this.closeModal(visibleModal);
                }
            }
        });
    }

    showLoginModal() {
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            loginModal.classList.remove('hidden');
        }
    }

    handleLogin() {
        const roleSelect = document.getElementById('loginRole');
        const nameInput = document.getElementById('loginName');
        
        if (!roleSelect || !nameInput) {
            console.error('Login form elements not found');
            return;
        }

        const role = roleSelect.value;
        const name = nameInput.value.trim();
        
        console.log('Login attempt:', { role, name });
        
        if (role && name) {
            this.currentUser = { role, name };
            const currentUserSpan = document.getElementById('currentUser');
            if (currentUserSpan) {
                currentUserSpan.textContent = `Welcome, ${name} (${role})`;
            }
            
            const loginModal = document.getElementById('loginModal');
            if (loginModal) {
                loginModal.classList.add('hidden');
            }
            
            console.log('Login successful, initializing dashboard');
            this.initializeDashboard();
        } else {
            alert('Please select a role and enter your name');
        }
    }

    logout() {
        this.currentUser = null;
        this.showLoginModal();
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.reset();
        }
    }

    switchSection(section) {
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        const activeNav = document.querySelector(`[data-section="${section}"]`);
        if (activeNav) {
            activeNav.classList.add('active');
        }

        // Update active section
        document.querySelectorAll('.section').forEach(sec => {
            sec.classList.remove('active');
        });
        const activeSection = document.getElementById(section);
        if (activeSection) {
            activeSection.classList.add('active');
        }

        this.currentSection = section;

        // Load section-specific content
        switch(section) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'queue':
                this.updateQueue();
                break;
            case 'beds':
                this.updateBeds();
                break;
            case 'analytics':
                this.updateAnalytics();
                break;
            case 'city':
                this.updateCityView();
                break;
        }
    }

    initializeDashboard() {
        this.updateDashboard();
        this.updateQueue();
        this.updateBeds();
        this.updateCityView();
        // Delay chart creation slightly to ensure DOM is ready
        setTimeout(() => {
            this.createCharts();
        }, 100);
    }

    updateDashboard() {
        const stats = this.data.hospitalStats;
        const elements = {
            totalBeds: document.getElementById('totalBeds'),
            availableBeds: document.getElementById('availableBeds'),
            queueLength: document.getElementById('queueLength'),
            admissionsToday: document.getElementById('admissionsToday')
        };

        if (elements.totalBeds) elements.totalBeds.textContent = stats.totalBeds;
        if (elements.availableBeds) elements.availableBeds.textContent = stats.availableBeds;
        if (elements.queueLength) elements.queueLength.textContent = stats.queueLength;
        if (elements.admissionsToday) elements.admissionsToday.textContent = stats.admissionsToday;
    }

    createCharts() {
        // Bed Occupancy Chart
        const bedCtx = document.getElementById('bedOccupancyChart');
        if (bedCtx && !this.charts.bedOccupancy) {
            this.charts.bedOccupancy = new Chart(bedCtx, {
                type: 'line',
                data: {
                    labels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM', '12 AM'],
                    datasets: [{
                        label: 'Bed Occupancy Rate',
                        data: [65, 78, 85, 92, 88, 82, 75],
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
        }

        // Department Utilization Chart
        const deptCtx = document.getElementById('departmentChart');
        if (deptCtx && !this.charts.department) {
            this.charts.department = new Chart(deptCtx, {
                type: 'doughnut',
                data: {
                    labels: this.data.analytics.departmentUtilization.map(d => d.department),
                    datasets: [{
                        data: this.data.analytics.departmentUtilization.map(d => d.utilization),
                        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        // Weekly Admissions Chart
        const admissionsCtx = document.getElementById('admissionsChart');
        if (admissionsCtx && !this.charts.admissions) {
            this.charts.admissions = new Chart(admissionsCtx, {
                type: 'bar',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Admissions',
                        data: this.data.analytics.weeklyAdmissions,
                        backgroundColor: '#1FB8CD'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }

        // Hourly Queue Chart
        const hourlyCtx = document.getElementById('hourlyQueueChart');
        if (hourlyCtx && !this.charts.hourlyQueue) {
            this.charts.hourlyQueue = new Chart(hourlyCtx, {
                type: 'line',
                data: {
                    labels: ['6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'],
                    datasets: [{
                        label: 'Queue Length',
                        data: this.data.analytics.hourlyQueue,
                        borderColor: '#FFC185',
                        backgroundColor: 'rgba(255, 193, 133, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }
    }

    updateQueue(filter = '') {
        const queueList = document.getElementById('queueList');
        if (!queueList) return;

        const filteredPatients = filter ? 
            this.data.patients.filter(p => p.department === filter) : 
            this.data.patients;

        queueList.innerHTML = '';
        
        filteredPatients.forEach(patient => {
            const queueItem = document.createElement('div');
            queueItem.className = 'queue-item';
            queueItem.innerHTML = `
                <div class="patient-info">
                    <div class="patient-id">${patient.id}</div>
                    <div>
                        <div class="patient-name">${patient.name}</div>
                        <div class="patient-department">${patient.department}</div>
                    </div>
                    <div class="priority-badge priority-${patient.priority.toLowerCase()}">
                        ${patient.priority}
                    </div>
                    <div>${patient.waitTime}</div>
                    <div class="status ${patient.status.toLowerCase().replace(' ', '-')}">${patient.status}</div>
                </div>
                <div class="queue-actions">
                    <button class="btn btn--primary btn--sm" onclick="hospitalSystem.callNextPatient('${patient.id}')">Call</button>
                    <button class="btn btn--outline btn--sm" onclick="hospitalSystem.completePatient('${patient.id}')">Complete</button>
                </div>
            `;
            queueList.appendChild(queueItem);
        });

        // Update queue stats
        const totalInQueue = document.getElementById('totalInQueue');
        const avgWait = document.getElementById('avgWait');
        if (totalInQueue) totalInQueue.textContent = filteredPatients.length;
        if (avgWait) avgWait.textContent = this.data.hospitalStats.avgWaitTime;
    }

    updateBeds(filter = '') {
        const bedsGrid = document.getElementById('bedsGrid');
        if (!bedsGrid) return;

        const filteredBeds = filter ? 
            this.data.beds.filter(b => b.ward === filter) : 
            this.data.beds;

        bedsGrid.innerHTML = '';
        
        filteredBeds.forEach(bed => {
            const bedCard = document.createElement('div');
            bedCard.className = `bed-card ${bed.status.toLowerCase()}`;
            bedCard.innerHTML = `
                <div class="bed-id">${bed.id}</div>
                <div class="bed-ward">${bed.ward}</div>
                <div class="bed-status-text">${bed.status}</div>
            `;
            bedCard.addEventListener('click', () => this.showBedDetails(bed));
            bedsGrid.appendChild(bedCard);
        });
    }

    updateCityView() {
        const hospitalsGrid = document.getElementById('hospitalsGrid');
        if (!hospitalsGrid) return;

        hospitalsGrid.innerHTML = '';
        
        this.data.cityHospitals.forEach(hospital => {
            const hospitalCard = document.createElement('div');
            hospitalCard.className = `hospital-card ${hospital.emergency ? 'emergency' : ''}`;
            const occupancyRate = ((hospital.totalBeds - hospital.availableBeds) / hospital.totalBeds * 100).toFixed(1);
            
            hospitalCard.innerHTML = `
                <div class="hospital-header">
                    <h4 class="hospital-name">${hospital.name}</h4>
                    <span class="hospital-distance">${hospital.distance}</span>
                </div>
                <div class="hospital-stats">
                    <div class="hospital-stat">
                        Available: <span>${hospital.availableBeds}</span>
                    </div>
                    <div class="hospital-stat">
                        Total: <span>${hospital.totalBeds}</span>
                    </div>
                    <div class="hospital-stat">
                        Occupancy: <span>${occupancyRate}%</span>
                    </div>
                </div>
                <div class="capacity-bar">
                    <div class="capacity-fill" style="width: ${occupancyRate}%"></div>
                </div>
            `;
            hospitalsGrid.appendChild(hospitalCard);
        });
    }

    filterQueue(department) {
        this.updateQueue(department);
    }

    filterBeds(ward) {
        this.updateBeds(ward);
    }

    switchTab(tabId) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeTabBtn = document.querySelector(`[data-tab="${tabId}"]`);
        if (activeTabBtn) {
            activeTabBtn.classList.add('active');
        }
        
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        const activePanel = document.getElementById(tabId);
        if (activePanel) {
            activePanel.classList.add('active');
        }
    }

    registerNewPatient() {
        const formData = {
            name: document.getElementById('patientName').value,
            age: parseInt(document.getElementById('patientAge').value),
            phone: document.getElementById('patientPhone').value,
            department: document.getElementById('patientDepartment').value,
            priority: document.getElementById('patientPriority').value
        };

        // Generate new patient ID
        const newId = `P${String(this.data.patients.length + 1).padStart(3, '0')}`;
        const newPatient = {
            id: newId,
            name: formData.name,
            age: formData.age,
            department: formData.department,
            priority: formData.priority,
            waitTime: this.calculateWaitTime(formData.department, formData.priority),
            status: 'Waiting',
            checkinTime: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        };

        this.data.patients.push(newPatient);
        this.showQueueNumber(newId, newPatient.waitTime);
        
        // Reset form
        const form = document.getElementById('newPatientForm');
        if (form) form.reset();
        
        // Update stats
        this.data.hospitalStats.queueLength++;
        this.updateDashboard();
    }

    checkInExistingPatient() {
        const patientId = document.getElementById('existingPatientId').value;
        const department = document.getElementById('checkinDepartment').value;
        
        // Simulate patient lookup and check-in
        const waitTime = this.calculateWaitTime(department, 'Medium');
        this.showQueueNumber(patientId, waitTime);
        
        // Reset form
        const form = document.getElementById('existingPatientForm');
        if (form) form.reset();
    }

    showQueueNumber(patientId, waitTime) {
        const queueNumberEl = document.getElementById('assignedQueueNumber');
        const estimatedWaitEl = document.getElementById('estimatedWait');
        const displayEl = document.getElementById('queueNumberDisplay');
        
        if (queueNumberEl) queueNumberEl.textContent = patientId;
        if (estimatedWaitEl) estimatedWaitEl.textContent = waitTime;
        if (displayEl) {
            displayEl.style.display = 'block';
            
            // Hide after 10 seconds
            setTimeout(() => {
                displayEl.style.display = 'none';
            }, 10000);
        }
    }

    calculateWaitTime(department, priority) {
        const baseTimes = {
            'Emergency': 5,
            'Cardiology': 15,
            'General': 25,
            'Orthopedics': 35,
            'ICU': 10
        };
        
        const priorityMultipliers = {
            'Critical': 0.2,
            'High': 0.5,
            'Medium': 1.0,
            'Low': 1.5
        };
        
        const baseTime = baseTimes[department] || 20;
        const multiplier = priorityMultipliers[priority] || 1.0;
        const waitTime = Math.round(baseTime * multiplier);
        
        return `${waitTime} mins`;
    }

    showBedDetails(bed) {
        const modal = document.getElementById('bedModal');
        const title = document.getElementById('bedModalTitle');
        const body = document.getElementById('bedModalBody');
        
        if (!modal || !title || !body) return;
        
        title.textContent = `Bed ${bed.id} - ${bed.ward} Ward`;
        
        let content = `
            <p><strong>Status:</strong> ${bed.status}</p>
            <p><strong>Ward:</strong> ${bed.ward}</p>
            <p><strong>Floor:</strong> ${bed.floor}</p>
        `;
        
        const admitBtn = document.getElementById('admitPatientBtn');
        const dischargeBtn = document.getElementById('dischargePatientBtn');
        
        if (bed.patient) {
            content += `
                <p><strong>Patient:</strong> ${bed.patient}</p>
                <p><strong>Admission Time:</strong> ${bed.admissionTime}</p>
                <p><strong>Expected Discharge:</strong> ${bed.expectedDischarge}</p>
            `;
            if (dischargeBtn) dischargeBtn.style.display = 'block';
            if (admitBtn) admitBtn.style.display = 'none';
        } else {
            content += `<p><strong>Last Cleaned:</strong> ${bed.lastCleaned}</p>`;
            if (admitBtn) admitBtn.style.display = 'block';
            if (dischargeBtn) dischargeBtn.style.display = 'none';
        }
        
        body.innerHTML = content;
        modal.classList.remove('hidden');
    }

    closeModal(modal) {
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    callNextPatient(patientId) {
        const patient = this.data.patients.find(p => p.id === patientId);
        if (patient) {
            patient.status = 'Called';
            this.updateQueue();
        }
    }

    completePatient(patientId) {
        const patientIndex = this.data.patients.findIndex(p => p.id === patientId);
        if (patientIndex !== -1) {
            this.data.patients.splice(patientIndex, 1);
            this.data.hospitalStats.queueLength--;
            this.updateQueue();
            this.updateDashboard();
        }
    }

    updateAnalytics(timeframe = 'weekly') {
        // This would normally fetch different data based on timeframe
        // For demo purposes, we'll just update the existing charts
        if (this.charts.admissions) {
            this.charts.admissions.update();
        }
        if (this.charts.hourlyQueue) {
            this.charts.hourlyQueue.update();
        }
    }

    simulateDataUpdates() {
        // Simulate real-time updates
        this.data.hospitalStats.availableBeds = Math.max(35, Math.min(50, 
            this.data.hospitalStats.availableBeds + Math.floor(Math.random() * 6) - 3));
        this.data.hospitalStats.queueLength = Math.max(25, Math.min(35, 
            this.data.hospitalStats.queueLength + Math.floor(Math.random() * 4) - 2));
        
        // Update patient wait times
        this.data.patients.forEach(patient => {
            if (patient.status === 'Waiting') {
                const currentWait = parseInt(patient.waitTime.split(' ')[0]);
                const newWait = Math.max(5, currentWait - 1);
                patient.waitTime = `${newWait} mins`;
            }
        });
    }

    updateLastUpdated() {
        const now = new Date();
        const lastUpdatedEl = document.getElementById('lastUpdated');
        if (lastUpdatedEl) {
            lastUpdatedEl.textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }
    }
}

// Initialize the system when the page loads
document.addEventListener('DOMContentLoaded', function() {
    window.hospitalSystem = new HospitalManagementSystem();
});