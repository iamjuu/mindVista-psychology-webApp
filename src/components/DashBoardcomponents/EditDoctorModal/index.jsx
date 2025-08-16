import { useState, useEffect } from 'react';
import { X, Phone, Users, Star, Clock, Mail } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '../../shadcn/button/button';
import { Input } from '../../shadcn/input/input';
import apiInstance from '../../../instance';

const EditDoctorModal = ({ isOpen, onClose, doctor, onDoctorUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialization: '',
    phone: '',
    experience: '',
    patients: '',
    rating: '',
    available: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.name || '',
        email: doctor.email || '',
        specialization: doctor.specialization || '',
        phone: doctor.phone || '',
        experience: doctor.experience || '',
        patients: doctor.patients || '',
        rating: doctor.rating || '',
        available: doctor.available !== undefined ? doctor.available : true
      });
    }
  }, [doctor]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiInstance.put(`/doctor-update/${doctor._id}`, formData);
      
      if (response.data.success) {
        toast.success('Doctor updated successfully!');
        onDoctorUpdated(response.data.doctor);
        onClose();
      } else {
        toast.error(response.data.message || 'Failed to update doctor');
      }
    } catch (error) {
      console.error('Error updating doctor:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update doctor';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !doctor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Doctor</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialization *
            </label>
            <Input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone *
            </label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              pattern="[0-9]{10}"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience (years) *
            </label>
            <Input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              required
              min="0"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patients
            </label>
            <Input
              type="number"
              name="patients"
              value={formData.patients}
              onChange={handleInputChange}
              min="0"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <Input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleInputChange}
              min="0"
              max="5"
              step="0.1"
              className="w-full"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Available for appointments
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Doctor'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDoctorModal;
