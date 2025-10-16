import { useState, useEffect } from 'react';
import { Search, Filter, X, Phone, Users, Star, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '../../../../components/shadcn/button/button';
import { Input } from '../../../../components/shadcn/input/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/shadcn/select';
import apiInstance from '../../../../instance';
import AddDoctorModal from '../../../../components/DashBoardcomponents/AddDoctorModal';
import EditDoctorModal from '../../../../components/DashBoardcomponents/EditDoctorModal';
import { useTheme } from '../../../../contexts/ThemeContext';

const DoctorList = () => {
  const { themeClasses } = useTheme();

  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [initialLoading, setInitialLoading] = useState(true);
  const [doctorData, setDoctorData] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // API call function for fetching doctors
  const fetchDoctorsAPI = async () => {
    console.log('Making API call to fetch doctors');
    
    try {
      const response = await apiInstance.get('/doctors/admin/all');
      console.log('API response for fetch doctors:', response.data);
      
      // Ensure we have an array of doctors
      const doctors = Array.isArray(response.data) ? response.data : 
                     response.data.doctors ? response.data.doctors : [];
                     
      console.log('Processed doctors data:', doctors);
      return doctors;
    } catch (err) {
      console.error('API call failed for fetching doctors:', err);
      throw err;
    }
  };

  // Load doctors on component mount
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const data = await fetchDoctorsAPI();
        if (!Array.isArray(data)) {
          console.error('Expected array of doctors but got:', data);
          setDoctorData([]);
          toast.error('Invalid data format received from server');
          return;
        }
        setDoctorData(data);
      } catch (err) {
        console.error('Failed to load doctors:', err);
        setDoctorData([]);
        toast.error('Failed to load doctors. Please try again.');
      } finally {
        setInitialLoading(false);
      }
    };

    loadDoctors();
  }, []);

  // Filter doctors based on search and specialty - add null check
  const filteredDoctors = Array.isArray(doctorData) ? doctorData.filter(doctor => {
    if (!doctor) return false;
    
    const matchesSearch = (doctor.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (doctor.specialization?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (doctor.phone?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = specialtyFilter === 'all' || doctor.specialization === specialtyFilter;
    
    return matchesSearch && matchesSpecialty;
  }) : [];

  // Get unique specialties for filter - add null check
  const specialties = Array.isArray(doctorData) ? 
    [...new Set(doctorData.filter(d => d && d.specialization).map(doctor => doctor.specialization))] : [];

  // Show all doctors without pagination
  const allDoctors = filteredDoctors;

  // No pagination needed - showing all doctors

  // Add new doctor handler
  const handleDoctorAdded = (newDoctor) => {
    console.log('New doctor added:', newDoctor);
    setDoctorData(prevDoctors => [...prevDoctors, newDoctor]);
  };

  // Edit doctor handler
  const handleEditDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setIsEditModalOpen(true);
  };

  // Update doctor handler
  const handleDoctorUpdated = (updatedDoctor) => {
    setDoctorData(prevDoctors => 
      prevDoctors.map(doctor => 
        doctor._id === updatedDoctor._id ? updatedDoctor : doctor
      )
    );
  };

  // Delete doctor handler
  const handleDeleteDoctor = async (doctor) => {
    if (window.confirm(`Are you sure you want to delete Dr. ${doctor.name}?`)) {
      try {
        const response = await apiInstance.delete(`/doctor-delete/${doctor._id}`);
        
        if (response.data.success) {
          toast.success('Doctor deleted successfully!');
          setDoctorData(prevDoctors => 
            prevDoctors.filter(d => d._id !== doctor._id)
          );
        } else {
          toast.error(response.data.message || 'Failed to delete doctor');
        }
      } catch (error) {
        console.error('Error deleting doctor:', error);
        const errorMessage = error.response?.data?.message || 'Failed to delete doctor';
        toast.error(errorMessage);
      }
    }
  };

  if (initialLoading) {
    return (
      <div className={`flex justify-center items-center min-h-[400px] ${themeClasses.bg}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className={`ml-3 ${themeClasses.textSecondary}`}>Loading doctors...</span>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${themeClasses.bg} min-h-screen p-4`}>
      {/* Add Doctor Modal */}
      <AddDoctorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onDoctorAdded={handleDoctorAdded}
      />

      {/* Edit Doctor Modal */}
      <EditDoctorModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedDoctor(null);
        }}
        doctor={selectedDoctor}
        onDoctorUpdated={handleDoctorUpdated}
      />

      {/* Filters */}
      <div className={`${themeClasses.bgCard} p-4 sm:p-6 justify-between flex w-full rounded-lg shadow-sm border ${themeClasses.border}`}>
            
            <div className='flex gap-5'>
            <Button 
            onClick={() => setIsAddModalOpen(true)}
            className={`w-full border ${themeClasses.bgSecondary} ${themeClasses.bgHover} ${themeClasses.text} sm:w-auto`}
          >
            Add New Doctor
          </Button>
          <div className=" flex">
              <Input
                type="text"
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 ${themeClasses.input}`}
              />
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${themeClasses.textMuted}`} size={20} />
            </div>
            </div>
          
            <div className="flex gap-2 items-center">
              <Filter size={20} className={themeClasses.textMuted} />
                             <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                 <SelectTrigger className={`w-[180px] ${themeClasses.bgCard} border ${themeClasses.border} ${themeClasses.bgHover}`}>
                   <SelectValue placeholder="All Specialties" />
                 </SelectTrigger>
                <SelectContent className={`${themeClasses.bgCard} border ${themeClasses.border} shadow-lg`}>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {specialties.map(specialty => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
 
          {(searchTerm || specialtyFilter !== 'all') && (
            <Button 
              onClick={() => {
                setSearchTerm('');
                setSpecialtyFilter('all');
              }}
              variant="outline"
              className="flex items-center gap-2"
            >
              <X size={16} />
              Clear Filters
            </Button>
          )}
 
      </div>

             {/* Doctor Grid */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
         {allDoctors.map(doctor => (
          <div key={doctor._id || doctor.id} className={`${themeClasses.bgCard} p-4 sm:p-6 rounded-lg shadow-sm border ${themeClasses.border} hover:border-blue-500 transition-colors`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className={`font-semibold ${themeClasses.text}`}>{doctor.name}</h3>
                <p className="text-blue-600 text-sm">{doctor.specialization}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                doctor.available 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                  : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
              }`}>
                {doctor.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className={`flex items-center ${themeClasses.textSecondary}`}>
                <Phone size={16} className="mr-2" />
                <span className="text-sm">{doctor.phone}</span>
              </div>
              <div className={`flex items-center ${themeClasses.textSecondary}`}>
                <Users size={16} className="mr-2" />
                <span className="text-sm">{doctor.patients} patients</span>
              </div>
              <div className={`flex items-center ${themeClasses.textSecondary}`}>
                <Clock size={16} className="mr-2" />
                <span className="text-sm">{doctor.experience}</span>
              </div>
              <div className={`flex items-center ${themeClasses.textSecondary}`}>
                <Star size={16} className="mr-2" />
                <span className="text-sm">{doctor.rating} rating</span>
              </div>
            </div>

            <div className={`mt-4 pt-4 border-t ${themeClasses.border} flex gap-2`}>
              <Button
                onClick={() => handleEditDoctor(doctor)}
                variant="outline"
                className="flex-1"
                size="sm"
              >
                Edit
              </Button>
              <Button
                onClick={() => handleDeleteDoctor(doctor)}
                variant="outline"
                className="flex-1 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                size="sm"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDoctors.length === 0 && (
        <div className={`${themeClasses.bgCard} p-8 rounded-lg shadow-sm text-center border ${themeClasses.border}`}>
          <p className={themeClasses.textMuted}>No doctors found matching your filters</p>
        </div>
      )}

      
    </div>
  );
};

export default DoctorList;