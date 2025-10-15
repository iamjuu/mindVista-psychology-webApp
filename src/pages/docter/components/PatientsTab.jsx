  import { useState, useMemo, useCallback } from "react";
  import PropTypes from "prop-types";
  import {
    Search,
    Filter,
    Eye,
    Phone,
    MapPin,
    Video,
    ExternalLink,
    Calendar,
  } from "lucide-react";
  import { Button } from "../../../components/shadcn/button/button";
  import { PageHeader } from "../../../components/core/cardHeader";

  const PatientsTab = ({
    patientRequests,
    requestsLoading,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    fetchPatientRequests,
    handleUserRowClick,
    handleAppointmentAction,
    handleGenerateVideoCall,
    doctorData,
    filteredRequests,
  }) => {
    const [showEndedTodayOnly, setShowEndedTodayOnly] = useState(false);

    const getTodayIsoDate = () => new Date().toISOString().split("T")[0];

    const parseTimeToMinutes = (timeStr) => {
      if (!timeStr || typeof timeStr !== "string") return null;
      const trimmed = timeStr.trim();
      // Handle 24h format: HH:MM
      const m24 = trimmed.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
      if (m24) {
        const hours = parseInt(m24[1], 10);
        const minutes = parseInt(m24[2], 10);
        return hours * 60 + minutes;
      }
      // Handle 12h format: HH:MM AM/PM
      const m12 = trimmed.match(/^(0?[1-9]|1[0-2]):([0-5]\d)\s*([AaPp][Mm])$/);
      if (m12) {
        let hours = parseInt(m12[1], 10);
        const minutes = parseInt(m12[2], 10);
        const meridiem = m12[3].toUpperCase();
        if (meridiem === "PM" && hours !== 12) hours += 12;
        if (meridiem === "AM" && hours === 12) hours = 0;
        return hours * 60 + minutes;
      }
      return null;
    };

    const getCurrentMinutes = () => {
      const now = new Date();
      return now.getHours() * 60 + now.getMinutes();
    };

    const isSessionTimePassed = useCallback((timeStr) => {
      const sessionMinutes = parseTimeToMinutes(timeStr);
      if (sessionMinutes === null) return false;
      return sessionMinutes < getCurrentMinutes();
    }, []);

    const endedTodayRequests = useMemo(() => {
      const today = getTodayIsoDate();
      return (filteredRequests || []).filter((req) => {
        const isToday = req?.date === today;
        if (!isToday) return false;
        const status = (req?.status || "").toLowerCase();
        if (status === "completed" || status === "declined") return true;
        // Treat sessions as ended if their scheduled time is in the past
        if (
          status === "approved" ||
          status === "confirmed" ||
          status === "pending"
        ) {
          return isSessionTimePassed(req?.time);
        }
        return false;
      });
    }, [filteredRequests, isSessionTimePassed]);

    // Exclude today's active sessions (they appear on the appointments page)
    const nonTodayRequests = useMemo(() => {
      const today = getTodayIsoDate();
      return (filteredRequests || []).filter((req) => req?.date !== today);
    }, [filteredRequests]);

    const displayedRequests = showEndedTodayOnly
      ? endedTodayRequests
      : nonTodayRequests;
    return (
      <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
          <div>
            <PageHeader title="Patient Requests" />
            {/* <h2 className="text-2xl font-bold text-gray-900 mb-2">Patient Requests</h2> */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">
                  Total: {patientRequests.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600">
                  Pending:{" "}
                  {patientRequests.filter((r) => r.status === "pending").length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">
                  Confirmed:{" "}
                  {patientRequests.filter((r) => r.status === "confirmed").length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">
                  Approved:{" "}
                  {patientRequests.filter((r) => r.status === "approved").length}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 w-full sm:w-64"
                />
              </div>

              <div className="relative">
                <Filter
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 appearance-none w-full sm:w-auto"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="approved">Approved</option>
                  <option value="declined">Declined</option>
                </select>
              </div>
              {/* Ended today toggle */}
              <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-xl bg-gray-50 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showEndedTodayOnly}
                  onChange={(e) => setShowEndedTodayOnly(e.target.checked)}
                  className="accent-blue-600"
                />
                <span className="text-sm text-gray-700">Show Ended Today</span>
              </label>
            </div>

            {/* <Button 
              onClick={fetchPatientRequests}
              disabled={requestsLoading}
              variant='outline'
            >
              {requestsLoading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <Eye size={16} />
              )}
              {requestsLoading ? 'Loading...' : 'Load Requests'}
            </Button> */}
          </div>
        </div>

        {requestsLoading ? (
          <div className="text-center py-12">
            <div className="relative inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
              </div>
            </div>
            <p className="text-gray-600 font-medium">
              Loading patient requests...
            </p>
          </div>
        ) : displayedRequests && displayedRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 rounded-l-xl">
                    PATIENT
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    CONTACT
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    DETAILS
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    DOCTOR
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    APPOINTMENT
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    STATUS
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    VIDEO CALL
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 rounded-r-xl">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedRequests.map((request, index) => (
                  <tr
                    key={request.id || request._id || index}
                    className="border-b border-gray-100 hover:bg-blue-50 transition-colors group cursor-pointer hover:shadow-md"
                    onClick={() => {
                      console.log('Table row clicked, request data:', request);
                      console.log('Request email field:', request.email);
                      handleUserRowClick(request);
                    }}
                    title="Click to view patient details"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 text-white font-bold shadow-md">
                          {request.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "N/A"}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {request.name || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {request.age
                              ? `${request.age} years`
                              : "Age not specified"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone size={12} className="mr-2 text-green-500" />
                          {request.phone || request.number || "N/A"}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin size={12} className="mr-2 text-red-500" />
                          {request.location || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      <div className="text-sm">
                        <div>Age: {request.age || "N/A"}</div>
                        <div className="text-gray-500 truncate max-w-32">
                          {request.location || "Location not specified"}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {request.doctorName || doctorData.name || "N/A"}
                        </div>
                        <div className="text-gray-500">
                          {request.doctorSpecialization ||
                            doctorData.specialization ||
                            "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {request.date || "N/A"}
                        </div>
                        <div className="text-gray-500">
                          {request.time || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          request.status === "approved"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : request.status === "confirmed"
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : request.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                            : request.status === "declined"
                            ? "bg-red-100 text-red-800 border border-red-200"
                            : "bg-gray-100 text-gray-800 border border-gray-200"
                        }`}
                      >
                        {request.status || "pending"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {request.status === "pending" ? (
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row click when clicking button
                              handleAppointmentAction(
                                request.id || request._id,
                                "approve"
                              );
                            }}
                            size="sm"
                            variant="outline"
                          >
                            <span className="mr-1">✓</span>
                            Approve
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row click when clicking button
                              handleAppointmentAction(
                                request.id || request._id,
                                "decline"
                              );
                            }}
                            size="sm"
                            variant="outline"
                          >
                            <span className="mr-1">✗</span>
                            Decline
                          </Button>
                        </div>
                      ) : request.status === "confirmed" ? (
                        <span className="flex items-center text-sm font-medium text-blue-600">
                          <span className="mr-1">✓</span>
                          Confirmed
                        </span>
                      ) : (
                        <span
                          className={`flex items-center text-sm font-medium ${
                            request.status === "approved"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <span className="mr-1">
                            {request.status === "approved" ? "✓" : "✗"}
                          </span>
                          {request.status === "approved"
                            ? "Approved"
                            : "Declined"}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {request.videoCallGenerated && request.videoCallLink ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-green-600 font-medium">
                              Available
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 font-mono">
                            {request.videoCallId}
                          </div>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              const link = request.videoCallLink?.includes('?') 
                                ? `${request.videoCallLink}&role=doctor` 
                                : `${request.videoCallLink}?role=doctor`;
                              window.open(link, "_blank");
                            }}
                            size="sm"
                            variant="outline"
                          >
                            <Video size={12} />
                            <span>Join</span>
                            <ExternalLink size={10} />
                          </Button>
                        </div>
                      ) : request.status === "confirmed" &&
                        !request.videoCallGenerated ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <span className="text-xs text-yellow-600 font-medium">
                              Confirmed
                            </span>
                          </div>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGenerateVideoCall(request.id || request._id);
                            }}
                            size="sm"
                            variant="outline"
                          >
                            <Video size={12} />
                            <span>Generate Link</span>
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">
                          Not available
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No requests found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== "all" || showEndedTodayOnly
                ? "Try adjusting your search or filter criteria."
                : 'Click "Load Requests" to fetch patient requests from the server.'}
            </p>
            {!searchTerm && filterStatus === "all" && (
              <Button onClick={fetchPatientRequests} variant="outline">
                <Eye size={16} />
                Load Patient Requests
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  export default PatientsTab;

  PatientsTab.propTypes = {
    patientRequests: PropTypes.array.isRequired,
    requestsLoading: PropTypes.bool,
    searchTerm: PropTypes.string,
    setSearchTerm: PropTypes.func,
    filterStatus: PropTypes.string,
    setFilterStatus: PropTypes.func,
    fetchPatientRequests: PropTypes.func,
    handleUserRowClick: PropTypes.func,
    handleAppointmentAction: PropTypes.func,
    handleGenerateVideoCall: PropTypes.func,
    doctorData: PropTypes.shape({
      name: PropTypes.string,
      specialization: PropTypes.string,
    }),
    filteredRequests: PropTypes.array.isRequired,
  };
