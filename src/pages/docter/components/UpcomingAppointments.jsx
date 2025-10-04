import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Video,
  ExternalLink,
  CheckCircle,
  X,
  Eye,
  RefreshCw,
  CalendarDays,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiInstance from "../../../instance";
import { Button } from "../../../components/shadcn/button/button";
import { PageHeader } from "../../../components/core/cardHeader";

const UpcomingAppointments = ({ doctorData, email, onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("all");

  // Check authentication on component mount
  useEffect(() => {
    if (!email || !doctorData._id) {
      console.log("No email or doctor data provided");
      return;
    }

    fetchUpcomingAppointments(doctorData._id);
  }, [email, doctorData._id]);

  // Function to fetch upcoming appointments
  const fetchUpcomingAppointments = async (doctorId) => {
    if (!doctorId) return;

    setRefreshing(true);
    try {
      const response = await apiInstance.get(
        `/doctor/${doctorId}/appointments`
      );
      console.log("All appointments fetched:", response.data);

      if (response.data.success) {
        const allAppointments = response.data.data;
        const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

        // Filter appointments for future dates (excluding today)
        const futureAppts = allAppointments.filter((appointment) => {
          return appointment.date > today;
        });

        // Sort by date (earliest first)
        const sortedAppts = futureAppts.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        // Transform the data to match the expected format
        const transformedAppointments = sortedAppts.map((appointment) => ({
          ...appointment,
          patientName: appointment.name,
          patientAge: appointment.age,
          patientPhone: appointment.phone || appointment.number,
          patientLocation: appointment.location,
        }));

        console.log("Upcoming appointments:", transformedAppointments);
        setUpcomingAppointments(transformedAppointments);
      } else {
        console.error("Failed to fetch appointments:", response.data.message);
        toast.error("Failed to fetch upcoming appointments");
      }
    } catch (error) {
      console.error("Error fetching upcoming appointments:", error);
      toast.error("Error fetching upcoming appointments");
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  // Function to handle appointment actions
  const handleAppointmentAction = async (appointmentId, action) => {
    try {
      const endpoint =
        action === "approve"
          ? `/appointment/${appointmentId}/approve`
          : `/appointment/${appointmentId}/decline`;
      const method = "PUT";

      const response = await apiInstance[method.toLowerCase()](endpoint);

      if (response.data.success) {
        console.log(`Appointment ${action}d successfully:`, response.data);

        if (action === "approve") {
          const appointmentData = response.data.data;
          if (appointmentData.videoCallLink) {
            toast.success(
              `Appointment approved! Video call link has been generated and sent to the patient via email.`,
              {
                duration: 5000,
              }
            );
          } else {
            toast.success(`Appointment approved successfully!`);
          }
        } else {
          toast.success(
            `Appointment declined. Email notification sent to the patient.`
          );
        }

        // Refresh upcoming appointments
        await fetchUpcomingAppointments(doctorData._id);
      } else {
        console.error(
          `Failed to ${action} appointment:`,
          response.data.message
        );
        toast.error(
          `Failed to ${action} appointment: ${response.data.message}`
        );
      }
    } catch (error) {
      console.error(`Error ${action}ing appointment:`, error);
      toast.error(`Error ${action}ing appointment. Please try again.`);
    }
  };

  // Filter functions
  const filteredAppointments = upcomingAppointments.filter((appointment) => {
    const matchesSearch =
      appointment.patientName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.patientPhone?.includes(searchTerm);
    const matchesFilter =
      filterStatus === "all" || appointment.status === filterStatus;

    // Additional date range filtering
    let matchesDateRange = true;
    if (selectedDateRange !== "all") {
      const appointmentDate = new Date(appointment.date);
      const today = new Date();
      const diffTime = appointmentDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (selectedDateRange) {
        case "tomorrow":
          matchesDateRange = diffDays === 1;
          break;
        case "week":
          matchesDateRange = diffDays <= 7;
          break;
        case "month":
          matchesDateRange = diffDays <= 30;
          break;
        default:
          matchesDateRange = true;
      }
    }

    return matchesSearch && matchesFilter && matchesDateRange;
  });

  // Function to get days until appointment
  const getDaysUntil = (dateStr) => {
    if (!dateStr) return null;

    const appointmentDate = new Date(dateStr);
    const today = new Date();
    const diffTime = appointmentDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Tomorrow";
    if (diffDays === 0) return "Today";
    if (diffDays < 0) return "Past";
    return `In ${diffDays} days`;
  };

  // Function to get date status
  const getDateStatus = (dateStr) => {
    if (!dateStr) return "unknown";

    const appointmentDate = new Date(dateStr);
    const today = new Date();
    const diffTime = appointmentDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "tomorrow";
    if (diffDays <= 7) return "this-week";
    if (diffDays <= 30) return "this-month";
    return "later";
  };

  // Function to format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";

    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-gray-600 font-medium">
            Loading upcoming appointments...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
  

          <div className="flex items-center gap-4">
            <Button
              onClick={() => fetchUpcomingAppointments(doctorData._id)}
              disabled={refreshing}
              variant="outline"
            >
              {refreshing ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Eye size={16} />
              )}
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>

            <Button
              onClick={() => onNavigate("todaySessions")}
              variant="outline"
            >
              <Calendar size={16} />
              Today&apos;s Sessions
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Upcoming
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {upcomingAppointments.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Calendar size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-3xl font-bold text-purple-600">
                {
                  upcomingAppointments.filter((apt) => {
                    const aptDate = new Date(apt.date);
                    const today = new Date();
                    const diffDays = Math.ceil(
                      (aptDate - today) / (1000 * 60 * 60 * 24)
                    );
                    return diffDays <= 7;
                  }).length
                }
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <CalendarDays size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">
                {
                  upcomingAppointments.filter((apt) => apt.status === "pending")
                    .length
                }
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Clock size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-3xl font-bold text-green-600">
                {
                  upcomingAppointments.filter(
                    (apt) => apt.status === "approved"
                  ).length
                }
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <PageHeader
                title="Upcoming Appointments"
                description="Manage and track your future patient appointments"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 w-full sm:w-64"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
              </select>

              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              >
                <option value="all">All Dates</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>

        {filteredAppointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    PATIENT
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    APPOINTMENT
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    TIME UNTIL
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    STATUS
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    VIDEO CALL
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment) => {
                  const daysUntil = getDaysUntil(appointment.date);
                  const dateStatus = getDateStatus(appointment.date);

                  return (
                    <tr
                      key={appointment._id}
                      className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4 text-white font-bold shadow-md">
                            {appointment.patientName
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "N/A"}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {appointment.patientName || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              Age: {appointment.patientAge || "N/A"} •{" "}
                              {appointment.patientPhone || "N/A"}
                            </div>
                            <div className="text-xs text-gray-400 truncate max-w-32">
                              {appointment.patientLocation ||
                                "Location not specified"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900">
                            {formatDate(appointment.date)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.time || "Time not specified"}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full mr-2 ${
                              dateStatus === "tomorrow"
                                ? "bg-orange-400"
                                : dateStatus === "this-week"
                                ? "bg-blue-400"
                                : dateStatus === "this-month"
                                ? "bg-green-400"
                                : "bg-gray-400"
                            }`}
                          ></div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {daysUntil}
                            </div>
                            <div className="text-xs text-gray-500">
                              {dateStatus === "tomorrow"
                                ? "Starting soon"
                                : dateStatus === "this-week"
                                ? "This week"
                                : dateStatus === "this-month"
                                ? "This month"
                                : "Later"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            appointment.status === "approved"
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : appointment.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                              : "bg-gray-100 text-gray-800 border border-gray-200"
                          }`}
                        >
                          {appointment.status || "pending"}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        {appointment.videoCallGenerated &&
                        appointment.videoCallLink ? (
                          <div className="space-y-2">
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-green-600 font-medium">
                                Available
                              </span>
                            </div>
                            <Button
                              onClick={() =>
                                window.open(appointment.videoCallLink, "_blank")
                              }
                              size="sm"
                              variant="outline"
                            >
                              <Video size={12} />
                              <span>Join</span>
                              <ExternalLink size={10} />
                            </Button>
                          </div>
                        ) : appointment.status === "approved" ? (
                          <span className="text-xs text-yellow-600">
                            Generating...
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">
                            Not available
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        {appointment.status === "pending" ? (
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() =>
                                handleAppointmentAction(
                                  appointment._id,
                                  "approve"
                                )
                              }
                              size="sm"
                              variant="outline"
                            >
                              <CheckCircle size={16} className="mr-1" />
                              Approve
                            </Button>
                            <Button
                              onClick={() =>
                                handleAppointmentAction(
                                  appointment._id,
                                  "decline"
                                )
                              }
                              size="sm"
                              variant="outline"
                            >
                              <X size={16} className="mr-1" />
                              Decline
                            </Button>
                          </div>
                        ) : (
                          <span
                            className={`text-sm font-medium ${
                              appointment.status === "approved"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {appointment.status === "approved"
                              ? "✓ Approved"
                              : "✗ Declined"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No upcoming appointments
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ||
              filterStatus !== "all" ||
              selectedDateRange !== "all"
                ? "Try adjusting your search or filter criteria."
                : "You have no upcoming appointments scheduled."}
            </p>
            {!searchTerm &&
              filterStatus === "all" &&
              selectedDateRange === "all" && (
                <Button
                  onClick={() => fetchUpcomingAppointments(doctorData._id)}
                  variant="outline"
                >
                  <Eye size={16} />
                  Refresh Appointments
                </Button>
              )}
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default UpcomingAppointments;
