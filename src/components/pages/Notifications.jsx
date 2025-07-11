import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import EmailComposer from "@/components/organisms/EmailComposer";
import emailService from "@/services/api/emailService";
import notificationPreferencesService from "@/services/api/notificationPreferencesService";
import studentService from "@/services/api/studentService";

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("sent");
  const [emailLogs, setEmailLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEmailComposer, setShowEmailComposer] = useState(false);
  const [stats, setStats] = useState({ sent: 0, pending: 0, failed: 0 });

  // Notification preferences form
  const [selectedParent, setSelectedParent] = useState("");
  const [parentPreferences, setParentPreferences] = useState({
    gradeUpdates: true,
    attendanceAlerts: true,
    assignmentDeadlines: true,
    generalAnnouncements: true,
    emailFrequency: "immediate"
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [logsData, preferencesData, studentsData, statsData] = await Promise.all([
        emailService.getEmailLogs(),
        notificationPreferencesService.getAll(),
        studentService.getAll(),
        emailService.getStats()
      ]);
      
      setEmailLogs(logsData);
      setFilteredLogs(logsData);
      setPreferences(preferencesData);
      setStudents(studentsData);
      setStats(statsData);
    } catch (err) {
      setError("Failed to load notifications data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredLogs(emailLogs);
      return;
    }
    
    const filtered = emailLogs.filter(log =>
      log.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLogs(filtered);
  };

  const handleParentSelect = async (parentEmail) => {
    try {
      setSelectedParent(parentEmail);
      const prefs = await notificationPreferencesService.getByParentEmail(parentEmail);
      setParentPreferences(prefs);
    } catch (error) {
      toast.error("Failed to load parent preferences");
    }
  };

  const handlePreferencesUpdate = async (e) => {
    e.preventDefault();
    
    if (!selectedParent) {
      toast.error("Please select a parent");
      return;
    }

    try {
      await notificationPreferencesService.update(selectedParent, parentPreferences);
      toast.success("Notification preferences updated successfully");
      loadData();
    } catch (error) {
      toast.error("Failed to update preferences");
    }
  };

  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setParentPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'grade_update':
        return 'primary';
      case 'attendance_alert':
        return 'warning';
      case 'assignment_notification':
        return 'secondary';
      case 'bulk_email':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatType = (type) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Email Notifications</h1>
        <Button onClick={() => setShowEmailComposer(true)}>
          <ApperIcon name="Mail" className="h-4 w-4 mr-2" />
          Compose Email
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Emails Sent</p>
              <p className="text-2xl font-bold text-green-600">{stats.sent}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <ApperIcon name="CheckCircle" className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <ApperIcon name="Clock" className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <ApperIcon name="XCircle" className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card p-0">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("sent")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "sent"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Sent Emails
            </button>
            <button
              onClick={() => setActiveTab("preferences")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "preferences"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Notification Preferences
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "sent" && (
            <div className="space-y-4">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search emails..."
                className="w-80"
              />
              
              <div className="space-y-3">
                {filteredLogs.map(log => (
                  <div key={log.Id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge variant={getTypeColor(log.type)}>
                            {formatType(log.type)}
                          </Badge>
                          <Badge variant={getStatusColor(log.status)}>
                            {log.status}
                          </Badge>
                        </div>
                        <h3 className="font-medium text-gray-900 mb-1">{log.subject}</h3>
                        <p className="text-sm text-gray-600 mb-2">To: {log.to}</p>
                        <p className="text-sm text-gray-700">{log.body}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredLogs.length === 0 && (
                  <div className="text-center py-8">
                    <ApperIcon name="Mail" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No emails found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="parentSelect">Select Parent</Label>
                  <select
                    id="parentSelect"
                    value={selectedParent}
                    onChange={(e) => handleParentSelect(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Choose a parent...</option>
                    {students.map(student => (
                      <option key={student.Id} value={student.parentEmail}>
                        {student.parentName} ({student.firstName} {student.lastName})
                      </option>
                    ))}
                  </select>
                </div>
                
                {selectedParent && (
                  <form onSubmit={handlePreferencesUpdate} className="space-y-4">
                    <div>
                      <Label>Notification Types</Label>
                      <div className="space-y-3 mt-2">
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            name="gradeUpdates"
                            checked={parentPreferences.gradeUpdates}
                            onChange={handlePreferenceChange}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-sm font-medium text-gray-700">Grade Updates</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            name="attendanceAlerts"
                            checked={parentPreferences.attendanceAlerts}
                            onChange={handlePreferenceChange}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-sm font-medium text-gray-700">Attendance Alerts</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            name="assignmentDeadlines"
                            checked={parentPreferences.assignmentDeadlines}
                            onChange={handlePreferenceChange}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-sm font-medium text-gray-700">Assignment Deadlines</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            name="generalAnnouncements"
                            checked={parentPreferences.generalAnnouncements}
                            onChange={handlePreferenceChange}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-sm font-medium text-gray-700">General Announcements</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="emailFrequency">Email Frequency</Label>
                      <select
                        id="emailFrequency"
                        name="emailFrequency"
                        value={parentPreferences.emailFrequency}
                        onChange={handlePreferenceChange}
                        className="input-field"
                      >
                        <option value="immediate">Immediate</option>
                        <option value="daily">Daily Digest</option>
                        <option value="weekly">Weekly Summary</option>
                      </select>
                    </div>
                    
                    <Button type="submit">
                      <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                      Update Preferences
                    </Button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showEmailComposer && (
        <EmailComposer
          recipients={students.map(s => ({
            id: s.Id,
            name: `${s.firstName} ${s.lastName}`,
            email: s.parentEmail,
            parentName: s.parentName
          }))}
          onClose={() => setShowEmailComposer(false)}
        />
      )}
    </div>
  );
};

export default Notifications;