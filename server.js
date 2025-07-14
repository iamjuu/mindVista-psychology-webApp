const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for doctors (replace with database in production)
let doctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialization: "Cardiology",
    phone: "+1 (555) 123-4567",
    experience: "10 years",
    patients: 150,
    rating: 4.8,
    available: true
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialization: "Neurology",
    phone: "+1 (555) 987-6543",
    experience: "8 years",
    patients: 120,
    rating: 4.6,
    available: true
  }
];

// Generate next ID
const getNextId = () => {
  return doctors.length > 0 ? Math.max(...doctors.map(d => d.id)) + 1 : 1;
};

// Routes
// GET all doctors
app.get('/api/doctors', (req, res) => {
  console.log('GET /api/doctors - Fetching all doctors');
  res.json({
    success: true,
    data: doctors,
    message: 'Doctors retrieved successfully'
  });
});

// POST create new doctor
app.post('/api/doctors', (req, res) => {
  console.log('POST /api/doctors - Creating new doctor:', req.body);
  
  const { name, specialization, phone, experience, patients, rating, available } = req.body;
  
  // Validate required fields
  if (!name || !specialization || !phone || !experience) {
    console.log('Validation failed - missing required fields');
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: name, specialization, phone, experience'
    });
  }
  
  // Create new doctor
  const newDoctor = {
    id: getNextId(),
    name,
    specialization,
    phone,
    experience,
    patients: parseInt(patients) || 0,
    rating: parseFloat(rating) || 0,
    available: available !== undefined ? available : true
  };
  
  doctors.push(newDoctor);
  console.log('Doctor created successfully:', newDoctor);
  
  res.status(201).json({
    success: true,
    data: newDoctor,
    message: 'Doctor created successfully'
  });
});

// PUT update doctor
app.put('/api/doctors/:id', (req, res) => {
  const doctorId = parseInt(req.params.id);
  console.log('PUT /api/doctors/:id - Updating doctor with ID:', doctorId);
  
  const doctorIndex = doctors.findIndex(d => d.id === doctorId);
  
  if (doctorIndex === -1) {
    console.log('Doctor not found with ID:', doctorId);
    return res.status(404).json({
      success: false,
      message: 'Doctor not found'
    });
  }
  
  const { name, specialization, phone, experience, patients, rating, available } = req.body;
  
  // Update doctor
  doctors[doctorIndex] = {
    ...doctors[doctorIndex],
    name,
    specialization,
    phone,
    experience,
    patients: parseInt(patients) || 0,
    rating: parseFloat(rating) || 0,
    available: available !== undefined ? available : true
  };
  
  console.log('Doctor updated successfully:', doctors[doctorIndex]);
  
  res.json({
    success: true,
    data: doctors[doctorIndex],
    message: 'Doctor updated successfully'
  });
});

// DELETE doctor
app.delete('/api/doctors/:id', (req, res) => {
  const doctorId = parseInt(req.params.id);
  console.log('DELETE /api/doctors/:id - Deleting doctor with ID:', doctorId);
  
  const doctorIndex = doctors.findIndex(d => d.id === doctorId);
  
  if (doctorIndex === -1) {
    console.log('Doctor not found with ID:', doctorId);
    return res.status(404).json({
      success: false,
      message: 'Doctor not found'
    });
  }
  
  const deletedDoctor = doctors.splice(doctorIndex, 1)[0];
  console.log('Doctor deleted successfully:', deletedDoctor);
  
  res.json({
    success: true,
    data: deletedDoctor,
    message: 'Doctor deleted successfully'
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log('404 - Route not found:', req.method, req.originalUrl);
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Available routes:');
  console.log('  GET    /api/doctors');
  console.log('  POST   /api/doctors');
  console.log('  PUT    /api/doctors/:id');
  console.log('  DELETE /api/doctors/:id');
  console.log('  GET    /api/health');
}); 