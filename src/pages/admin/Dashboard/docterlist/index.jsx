import { useState, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { toast } from 'react-toastify';
import apiInstance from '../../../../instance';

const DoctorList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  // Initialize with empty array - no static data
  const [doctorData, setDoctorData] = useState([]);

  // Form state for add/edit modal
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    phone: '',
    experience: '',
    patients: '',
    rating: '',
    available: true
  });

  // API call function for fetching doctors
  const fetchDoctorsAPI = async () => {
    console.log('Making API call to fetch doctors');
    
    try {
      const response = await apiInstance.get('/doctors');
      console.log('API response for fetch doctors:', response.data);
      return response.data;
    } catch (error) {
      console.error('API call failed for fetching doctors:', error);
      throw error;
    }
  };

  // API call function for adding doctor
  const addDoctorAPI = async (doctorData) => {
    console.log('Making API call to add doctor:', doctorData);
    
    try {
      const response = await apiInstance.post('/doctors', doctorData);
      console.log('API response for add doctor:', response.data);
      return response.data;
    } catch (error) {
      console.error('API call failed for adding doctor:', error);
      throw error;
    }
  };

  // API call function for updating doctor
  const updateDoctorAPI = async (doctorId, doctorData) => {
    console.log('Making API call to update doctor:', doctorId, doctorData);
    
    try {
      const response = await apiInstance.put(`/api/doctors/${doctorId}`, doctorData);
      console.log('API response for update doctor:', response.data);
      return response.data;
    } catch (error) {
      console.error('API call failed for updating doctor:', error);
      throw error;
    }
  };

  // Load doctors on component mount
  const loadDoctors = async () => {
    console.log('Loading doctors from API');
    setInitialLoading(true);
    
    try {
      const apiResponse = await fetchDoctorsAPI();
      
      if (apiResponse.success && apiResponse.data) {
        setDoctorData(apiResponse.data);
        console.log('Doctors loaded successfully:', apiResponse.data.length, 'doctors');
      } else {
        console.error('Invalid API response format:', apiResponse);
      }
    } catch (error) {
      console.error('Failed to load doctors:', error);
      toast.error('Failed to load doctors. Please refresh the page.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      // Keep empty array if loading fails
    } finally {
      setInitialLoading(false);
    }
  };

  // Load doctors on component mount
  useEffect(() => {
    loadDoctors();
  }, []);
  
  console.log('DoctorList component rendered. Total doctors:', doctorData.length);
  
  // Get unique specializations for filter
  const specializations = ['all', ...new Set(doctorData.map(doctor => doctor.specialization))];
  
  // Items per page
  const itemsPerPage = 5;
  
  // Filter doctors based on search term and specialty
  const filteredDoctors = doctorData.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = specialtyFilter === 'all' || doctor.specialization === specialtyFilter;
    
    return matchesSearch && matchesSpecialty;
  });
  
  console.log('Filtered doctors count:', filteredDoctors.length, 'Search term:', searchTerm, 'Specialty filter:', specialtyFilter);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDoctors = filteredDoctors.slice(startIndex, startIndex + itemsPerPage);
  
  // Handle page change
  const goToPage = (page) => {
    console.log('Navigating to page:', page);
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log('Form input changed:', name, type === 'checkbox' ? checked : value);
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Open modal for adding new doctor
  const openAddModal = () => {
    console.log('Opening add doctor modal');
    setEditingDoctor(null);
    setFormData({
      name: '',
      specialization: '',
      phone: '',
      experience: '',
      patients: '',
      rating: '',
      available: true
    });
    setShowModal(true);
  };

  // Open modal for editing doctor
  const openEditModal = (doctor) => {
    console.log('Opening edit modal for doctor:', doctor.name, 'ID:', doctor.id);
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialization: doctor.specialization,
      phone: doctor.phone,
      experience: doctor.experience,
      patients: doctor.patients.toString(),
      rating: doctor.rating.toString(),
      available: doctor.available
    });
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    console.log('Closing modal');
    setShowModal(false);
    setEditingDoctor(null);
    setIsLoading(false);
    setFormData({
      name: '',
      specialization: '',
      phone: '',
      experience: '',
      patients: '',
      rating: '',
      available: true
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    console.log('Submitting form with data:', formData);
    
    // Basic validation
    if (!formData.name || !formData.specialization || !formData.phone || !formData.experience) {
      console.log('Form validation failed - missing required fields');
      toast.error('Please fill in all required fields', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setIsLoading(true);
    console.log('Setting loading state to true');
    
    const doctorToSave = {
      name: formData.name,
      specialization: formData.specialization,
      phone: formData.phone,
      experience: formData.experience,
      patients: parseInt(formData.patients) || 0,
      rating: parseFloat(formData.rating) || 0,
      available: formData.available
    };

    try {
      if (editingDoctor) {
        // Edit existing doctor
        console.log('Updating existing doctor with ID:', editingDoctor.id);
        await updateDoctorAPI(editingDoctor.id, doctorToSave);
        
        setDoctorData(prev => 
          prev.map(doctor => 
            doctor.id === editingDoctor.id 
              ? { ...doctor, ...doctorToSave }
              : doctor
          )
        );
        console.log('Doctor updated successfully');
        toast.success('Doctor updated successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        // Add new doctor with API call
        console.log('Adding new doctor with API call');
        const apiResponse = await addDoctorAPI(doctorToSave);
        
        // Handle API response format
        if (apiResponse.success && apiResponse.data) {
          const newDoctor = apiResponse.data;
          setDoctorData(prev => [...prev, newDoctor]);
          console.log('New doctor added successfully:', newDoctor);
          toast.success('Doctor added successfully!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else {
          // Fallback for older API format
          const newId = apiResponse.id || (doctorData.length > 0 ? Math.max(...doctorData.map(d => d.id)) + 1 : 1);
          const newDoctor = { id: newId, ...doctorToSave };
          setDoctorData(prev => [...prev, newDoctor]);
          console.log('New doctor added successfully with ID:', newId);
          toast.success('Doctor added successfully!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      }

      closeModal();
    } catch (error) {
      console.error('Error submitting doctor data:', error);
      toast.error('Failed to save doctor. Please try again.', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setIsLoading(false);
    }
  };

  // Handle delete doctor
  const handleDelete = (doctorId) => {
    console.log('Delete requested for doctor ID:', doctorId);
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      console.log('Deleting doctor with ID:', doctorId);
      setDoctorData(prev => prev.filter(doctor => doctor.id !== doctorId));
      console.log('Doctor deleted successfully');
      toast.success('Doctor deleted successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      console.log('Delete cancelled by user');
    }
  };
  
  // Generate star rating display
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        // Full star
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else if (i - 0.5 <= rating) {
        // Half star
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else {
        // Empty star
        stars.push(<span key={i} className="text-gray-300">★</span>);
      }
    }
    return <div className="flex">{stars} <span className="ml-1 text-gray-600">({rating})</span></div>;
  };
  
  // Show loading spinner while fetching initial data
  if (initialLoading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Doctor Management</h2>
          <p className="text-gray-500 text-sm">Manage your medical staff</p>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading doctors...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Doctor Management</h2>
        <p className="text-gray-500 text-sm">Manage your medical staff</p>
      </div>
      
      {/* Filters and search */}
      <div className="p-4 flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search doctors by name or specialty..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={18} className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={specialtyFilter}
              onChange={(e) => {
                setSpecialtyFilter(e.target.value);
                setCurrentPage(1); // Reset to first page on filter change
              }}
            >
              <option value="all">All Specialties</option>
              {specializations.filter(spec => spec !== 'all').map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={openAddModal}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Add Doctor
          </button>
        </div>
      </div>
      
      {/* Doctor list table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-left font-semibold text-gray-600">ID</th>
              <th className="p-3 text-left font-semibold text-gray-600">Name</th>
              <th className="p-3 text-left font-semibold text-gray-600">Specialty</th>
              <th className="p-3 text-left font-semibold text-gray-600">Phone</th>
              <th className="p-3 text-left font-semibold text-gray-600">Experience</th>
              <th className="p-3 text-left font-semibold text-gray-600">Patients</th>
              <th className="p-3 text-left font-semibold text-gray-600">Rating</th>
              <th className="p-3 text-left font-semibold text-gray-600">Status</th>
              <th className="p-3 text-left font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDoctors.length > 0 ? (
              paginatedDoctors.map(doctor => (
                <tr key={doctor.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-gray-500">#{doctor.id}</td>
                  <td className="p-3 font-medium">{doctor.name}</td>
                  <td className="p-3 text-gray-500">{doctor.specialization}</td>
                  <td className="p-3 text-gray-500">{doctor.phone}</td>
                  <td className="p-3 text-gray-500">{doctor.experience}</td>
                  <td className="p-3 text-gray-500">{doctor.patients}</td>
                  <td className="p-3">{renderStars(doctor.rating)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      doctor.available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {doctor.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => openEditModal(doctor)}
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(doctor.id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="p-4 text-center text-gray-500">
                  No doctors found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {filteredDoctors.length > 0 && (
        <div className="p-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredDoctors.length)} of {filteredDoctors.length} doctors
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg border ${
                currentPage === 1 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft size={16} />
            </button>
            
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              // Show current page, first, last, and adjacent pages
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    className={`w-8 h-8 rounded-lg ${
                      currentPage === pageNumber
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (
                (pageNumber === 2 && currentPage > 3) ||
                (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
              ) {
                return <span key={pageNumber} className="px-1">...</span>;
              } else {
                return null;
              }
            })}
            
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg border ${
                currentPage === totalPages 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Doctor Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Doctor Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Dr. John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialization
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Cardiology"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience
                </label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="5 years"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patients
                  </label>
                  <input
                    type="number"
                    name="patients"
                    value={formData.patients}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="30"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    required
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="4.5"
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">
                  Available
                </label>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : (editingDoctor ? 'Update Doctor' : 'Add Doctor')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorList;