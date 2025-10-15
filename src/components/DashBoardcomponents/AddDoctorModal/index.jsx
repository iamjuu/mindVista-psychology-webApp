import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '../../../components/shadcn/button/button';
import { Input } from '../../../components/shadcn/input/input';
import apiInstance from '../../../instance';

const AddDoctorModal = ({ isOpen, onClose, onDoctorAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialization: '',
    phone: '',
    experience: '',
    age: '',
    gender: '',
    address: '',
    bio: '',

    available: true
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    console.log('Image file selected:', e.target.files[0]);
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const requiredFields = ['name', 'specialization', 'phone', 'experience'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }
    
    // Phone number validation
    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }
    
    // Experience validation
    if (isNaN(formData.experience) || parseInt(formData.experience) < 0) {
      toast.error('Please enter a valid experience in years');
      return false;
    }

    if (!imageFile) {
      toast.error('Please select a profile image');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting doctor form with data:', formData);
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Create FormData object to send multipart/form-data
      const formDataToSend = new FormData();
      
      // Process form data, setting default values for optional fields
      const processedData = {
        ...formData,
        patients: formData.patients || '0',  // Default to '0' if empty
        rating: formData.rating || '0',      // Default to '0' if empty
        available: formData.available ? 'true' : 'false' // Convert boolean to string
      };

      Object.entries(processedData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      formDataToSend.append('image', imageFile);

      console.log('Sending form data to server:', formDataToSend);
      console.log('Available value:', formData.available);

      const response = await apiInstance.post('/add-doctor', formDataToSend);
      
      console.log('Doctor created successfully:', response.data);
      toast.success('Doctor added successfully!');
      onDoctorAdded(response.data.doctor);
      onClose();
    } catch (error) {
      console.error('Error creating doctor:', error);
      toast.error(error.response?.data?.message || 'Error creating doctor');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Doctor</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload Section */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Profile preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto text-gray-400" size={24} />
                  <p className="text-xs text-gray-500 mt-1">Upload Photo</p>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              required='false'
              id="doctor-image"
            />
            <label
              htmlFor="doctor-image"
              className="cursor-pointer text-sm text-blue-600 hover:text-blue-700"
            >
              {imagePreview ? 'Change Photo' : 'Upload Photo'}
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter doctor's name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter doctor's email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specialization *
            </label>
            <select
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select specialization</option>
              <option value="Psychology">Psychology</option>
           
              <option value="Addiction Therapy">Addiction Therapy</option>
              <option value="Child Psychology">Child Psychology</option>
              <option value="Marriage & Family Therapy">Marriage & Family Therapy</option>
                <option value="Educational Psychology">Educational Psychology</option>
              <option value="Forensic Psychology">Forensic Psychology</option>
              <option value="Health Psychology">Health Psychology</option>
              <option value="Sports Psychology">Sports Psychology</option>
            </select>
          </div>

       



          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <Input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age"
                min="25"
                max="80"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>

              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter full address"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Brief description about the doctor"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone *
            </label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter 10-digit phone number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experience (years) *
            </label>
            <Input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="Enter years of experience"
              min="0"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleChange}
              className="rounded border-gray-300"
            />
            <label className="text-sm text-gray-700">
              Available for appointments
            </label>
          </div>

          <div className="flex gap-2 justify-end mt-6">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Doctor'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctorModal; 