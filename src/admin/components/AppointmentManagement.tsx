import { useState, useEffect } from 'react';
import { Calendar, Clock, Building2, Phone, Mail, User, CheckCircle, XCircle, AlertCircle, Trash2, Eye, Filter } from 'lucide-react';

interface Appointment {
  id: number;
  company_name: string;
  phone_number: string;
  email: string;
  preferred_date: string;
  preferred_time: string;
  property: string;
  floor: string;
  additional_notes: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
}

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/appointments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      } else {
        console.error('Failed to fetch appointments');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id: number, status: 'pending' | 'confirmed' | 'cancelled' | 'completed') => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/appointments/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        fetchAppointments();
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const deleteAppointment = async (id: number) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/appointments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setShowDeleteConfirm(false);
        setAppointmentToDelete(null);
        fetchAppointments();
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filterStatus === 'all') return true;
    return apt.status === filterStatus;
  });

  const statusCounts = {
    all: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div>
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .modal-overlay { animation: fadeIn 0.2s ease-out; backdrop-filter: blur(2px); }
        .modal-content { animation: slideIn 0.3s ease-out; }
      `}</style>

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Appointment Management</h2>
        <p className="text-gray-600 mt-1">View and manage all appointment requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-900">{statusCounts.all}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow-sm border-2 border-yellow-200">
          <p className="text-sm text-yellow-700 mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-900">{statusCounts.pending}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow-sm border-2 border-green-200">
          <p className="text-sm text-green-700 mb-1">Confirmed</p>
          <p className="text-2xl font-bold text-green-900">{statusCounts.confirmed}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow-sm border-2 border-blue-200">
          <p className="text-sm text-blue-700 mb-1">Completed</p>
          <p className="text-2xl font-bold text-blue-900">{statusCounts.completed}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow-sm border-2 border-red-200">
          <p className="text-sm text-red-700 mb-1">Cancelled</p>
          <p className="text-2xl font-bold text-red-900">{statusCounts.cancelled}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex items-center gap-3">
          <Filter className="h-5 w-5 text-gray-600" />
          <span className="font-semibold text-gray-900">Filter by Status:</span>
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterStatus === status
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No appointments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">{appointment.company_name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{appointment.email}</div>
                      <div className="text-sm text-gray-500">{appointment.phone_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(appointment.preferred_date)}</div>
                      <div className="text-sm text-gray-500">{formatTime(appointment.preferred_time)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{appointment.property}</div>
                      <div className="text-sm text-gray-500">{appointment.floor}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(appointment.status)}`}>
                        {getStatusIcon(appointment.status)}
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setShowDetailModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            setAppointmentToDelete(appointment.id);
                            setShowDeleteConfirm(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedAppointment && (
        <div className="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="modal-content bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Appointment Details</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Company Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="h-5 w-5 text-red-600" />
                  Company Information
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Company Name:</span>
                    <span className="font-medium text-gray-900">{selectedAppointment.company_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-gray-900">{selectedAppointment.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium text-gray-900">{selectedAppointment.phone_number}</span>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-red-600" />
                  Appointment Details
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium text-gray-900">{formatDate(selectedAppointment.preferred_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium text-gray-900">{formatTime(selectedAppointment.preferred_time)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property:</span>
                    <span className="font-medium text-gray-900">{selectedAppointment.property}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Floor:</span>
                    <span className="font-medium text-gray-900">{selectedAppointment.floor}</span>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              {selectedAppointment.additional_notes && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Additional Notes</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedAppointment.additional_notes}</p>
                  </div>
                </div>
              )}

              {/* Status Management */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Update Status</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      updateAppointmentStatus(selectedAppointment.id, 'confirmed');
                      setShowDetailModal(false);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    <CheckCircle className="h-5 w-5" />
                    Confirm
                  </button>
                  <button
                    onClick={() => {
                      updateAppointmentStatus(selectedAppointment.id, 'completed');
                      setShowDetailModal(false);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    <CheckCircle className="h-5 w-5" />
                    Complete
                  </button>
                  <button
                    onClick={() => {
                      updateAppointmentStatus(selectedAppointment.id, 'cancelled');
                      setShowDetailModal(false);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    <XCircle className="h-5 w-5" />
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      updateAppointmentStatus(selectedAppointment.id, 'pending');
                      setShowDetailModal(false);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    <AlertCircle className="h-5 w-5" />
                    Set Pending
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="modal-content bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Delete Appointment</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this appointment? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setAppointmentToDelete(null);
                }}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => appointmentToDelete && deleteAppointment(appointmentToDelete)}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentManagement;