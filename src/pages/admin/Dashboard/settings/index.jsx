import { useState } from "react";
import {
  Camera,
  Shield,
  Mail,
  User,
  Lock,
  Bell,
  Eye,
  HelpCircle,
  ChevronRight,
  Check,
  X,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Palette,
  Activity,
  Settings,
  LogOut,
  FileText,
  CreditCard,
  Users,
  MessageSquare,
  Heart,
  UserPlus,
  Share2,
  Download,
  Trash2,
  Key,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "../../../../components/shadcn/button/button";
import { Input } from "../../../../components/shadcn/input/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/shadcn/select";
import { CardHeader, PageHeader } from "../../../../components/core/cardHeader";
import { useTheme } from "../../../../contexts/ThemeContext";

const SettingsPage = () => {
  const { theme, setThemeMode, themeClasses } = useTheme();
  const [activeTab, setActiveTab] = useState("edit-profile");
  const [profileData, setProfileData] = useState({
    username: "muhammed ajmal cc",
    name: "Software developer",
    bio: "developing software",
    email: "muhammedajmalcc6424094@gmail.com",
    phone: "+1 234 567 8900",
    gender: "male",
    avatar: null,
    website: "https://muhammedajmal.netlify.app/",
    location: "Kannur Kerala",
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({
          ...profileData,
          avatar: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const menuItems = [
    { id: "edit-profile", label: "Edit Profile", icon: User, color: "blue" },
    { id: "account", label: "Account", icon: Settings, color: "indigo" },
    { id: "security", label: "Security", icon: Shield, color: "green" },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      color: "yellow",
    },
    { id: "privacy", label: "Privacy", icon: Eye, color: "purple" },
    { id: "appearance", label: "Appearance", icon: Palette, color: "pink" },
    { id: "activity", label: "Activity", icon: Activity, color: "orange" },
    { id: "help", label: "Help & Support", icon: HelpCircle, color: "gray" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "edit-profile":
        return (
          <EditProfile
            profileData={profileData}
            handleInputChange={handleInputChange}
            handleAvatarChange={handleAvatarChange}
            setSaveStatus={setSaveStatus}
          />
        );
      case "account":
        return (
          <AccountSettings
            profileData={profileData}
            handleInputChange={handleInputChange}
          />
        );
      case "security":
        return (
          <SecuritySettings
            twoFactorEnabled={twoFactorEnabled}
            setTwoFactorEnabled={setTwoFactorEnabled}
          />
        );
      case "notifications":
        return <Notifications />;
      case "privacy":
        return <PrivacySettings />;
      case "appearance":
        return <AppearanceSettings theme={theme} setTheme={setThemeMode} />;
      case "activity":
        return <ActivitySettings />;
      case "help":
        return <HelpSupport />;
      default:
        return (
          <EditProfile
            profileData={profileData}
            handleInputChange={handleInputChange}
            handleAvatarChange={handleAvatarChange}
            setSaveStatus={setSaveStatus}
          />
        );
    }
  };

  return (
    <div className={`min-h-screen ${themeClasses.bg}`}>
      <div className=" ">
        <div className="flex flex-col lg:flex-row gap-6 h-screen">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 lg:h-full">
            <nav
              className={`${themeClasses.bgCard} rounded-2xl shadow-sm p-2 space-y-1 h-full overflow-y-auto`}
            >
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <Button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    variant={isActive ? "default" : "secondary"}
                    className={`w-full   justify-start h-auto p-3 ${
                      isActive
                        ? `bg-blue-600 text-white shadow-sm hover:bg-blue-700`
                        : `${themeClasses.bgSecondary} ${themeClasses.text} ${themeClasses.bgHover}`
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        isActive 
                          ? `bg-blue-100 dark:bg-blue-900/30 text-blue-600` 
                          : `${themeClasses.bgSecondary} ${themeClasses.text}`
                      } transition-colors`}
                    >
                      <Icon size={18} />
                    </div>
                    <span className="font-medium text-sm">{item.label}</span>
                    {isActive && <ChevronRight size={16} className="ml-auto" />}
                  </Button>
                );
              })}

              <div className={`border-t ${themeClasses.border} pt-2 mt-2`}>
                <Button
                  variant="secondary"
                  className={`w-full justify-start h-auto p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 ${themeClasses.bgSecondary}`}
                >
                  <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                    <LogOut size={18} />
                  </div>
                  <span className="font-medium text-sm">Log Out</span>
                </Button>
              </div>
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 lg:h-full">
            <div
              className={`${themeClasses.bgCard} rounded-2xl shadow-sm p-6 sm:p-8 h-full overflow-y-auto`}
            >
              {saveStatus && (
                <div
                  className={`mb-6 p-4 rounded-xl flex items-center space-x-3 animate-slide-down ${
                    saveStatus === "success"
                      ? "bg-green-50 text-green-800"
                      : "bg-red-50 text-red-800"
                  }`}
                >
                  {saveStatus === "success" ? (
                    <Check size={20} />
                  ) : (
                    <X size={20} />
                  )}
                  <span className="font-medium">
                    {saveStatus === "success"
                      ? "Changes saved successfully!"
                      : "Error saving changes"}
                  </span>
                </div>
              )}
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Edit Profile Component
const EditProfile = ({
  profileData,
  handleInputChange,
  handleAvatarChange,
  setSaveStatus,
}) => {
  const [loading, setLoading] = useState(false);
  const { themeClasses } = useTheme();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSaveStatus("success");
      setLoading(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1000);
  };

  return (
    <div>
      {/* Avatar Section */}
      <div className={` ${themeClasses.bgSecondary} rounded-2xl p-6 mb-8`}>
        <div className="flex items-center space-x-6">
          <div className="relative group">
            <div className="w-28 h-28  rounded-full  p-1">
              <div className={`w-full h-full rounded-full border border-2 overflow-hidden`}>
                {profileData.avatar ? (
                  <img
                    src={profileData.avatar}
                    alt="Profile"
                    className="w-full rounded-full h-full object-fit"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center border">
                    <User size={40} className={themeClasses.textMuted} />
                  </div>
                )}
              </div>
            </div>
            <label className={`absolute bottom-0 right-0 ${themeClasses.bgCard} border-2 ${themeClasses.border} shadow-lg p-2 rounded-xl cursor-pointer hover:shadow-xl transition-shadow transform group-hover:scale-110`}>
              <Camera size={18} className={themeClasses.text} />
              <input
                type="file"
                className="hidden"
                onChange={handleAvatarChange}
                accept="image/*"
              />
            </label>
          </div>
          <div>
            <h3 className={`font-bold text-xl ${themeClasses.text} mb-1`}>
              {profileData.username}
            </h3>
            <p className={`${themeClasses.textSecondary} mb-3`}>{profileData.name}</p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/30"
              >
                Change Photo
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/30"
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={`block text-sm font-semibold ${themeClasses.text} mb-2`}>
              Designation
            </label>
            <Input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 ${themeClasses.input} border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className={`block text-sm font-semibold ${themeClasses.text} mb-2`}>
              Username
            </label>
            <div className="relative">
              <span className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${themeClasses.textMuted}`}>
                @
              </span>
              <Input
                type="text"
                name="username"
                value={profileData.username}
                onChange={handleInputChange}
                className={`w-full pl-8 pr-4 py-3 ${themeClasses.input} border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                placeholder="username"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={`block text-sm font-semibold ${themeClasses.text} mb-2`}>
            Bio
          </label>
          <textarea
            name="bio"
            value={profileData.bio}
            onChange={handleInputChange}
            rows="4"
            className={`w-full px-4 py-3 ${themeClasses.input} border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none`}
            placeholder="Tell us about yourself..."
          />
          <p className={`mt-2 text-sm ${themeClasses.textMuted}`}>
            {150 - profileData.bio.length} characters remaining
          </p>
        </div>

        <div className="grid grid-cols-1  md:grid-cols-3 gap-6">
          <div>
            <label className={`block text-sm font-semibold ${themeClasses.text} mb-2`}>
              Website
            </label>
            <Input
              type="url"
              name="website"
              value={profileData.website}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 ${themeClasses.input} border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              placeholder="yourwebsite.com"
            />
          </div>

          <div>
            <label className={`block text-sm font-semibold ${themeClasses.text} mb-2`}>
              Location
            </label>
            <Input
              type="text"
              name="location"
              value={profileData.location}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 ${themeClasses.input} border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              placeholder="City, Country"
            />
          </div>

          <div>
            <label className={`block text-sm font-semibold ${themeClasses.text} mb-2`}>
              Gender
            </label>
            <Select
              name="gender"
              value={profileData.gender}
              onValueChange={(value) =>
                handleInputChange({ target: { name: "gender", value } })
              }
            >
              <SelectTrigger className={`w-full px-4 py-3 border ${themeClasses.bgCard} ${themeClasses.border} ${themeClasses.text} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent className={`${themeClasses.bgCard} border ${themeClasses.border} rounded-lg shadow-lg`}>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6">
          <Button
            type="button"
            variant="secondary"
            className={`px-6 ${themeClasses.border} border py-3`}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="px-6 py-3  text-white bg-blue-600 hover:bg-blue-700 transition-all font-medium shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check size={18} />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

// Account Settings Component
const AccountSettings = ({ profileData, handleInputChange }) => {
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);

  return (
    <div>
      <PageHeader
        title="Account Settings"
        description="Manage your account information and preferences"
      />

      <div className="space-y-6">
        {/* Email Section */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <CardHeader
              icon={
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail size={20} className="text-blue-600" />
                </div>
              }
              title="Email Address"
              description="Used for notifications and account recovery"
            />
            <Button
              onClick={() => setEditingEmail(!editingEmail)}
              variant="link"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm p-0 h-auto"
            >
              {editingEmail ? "Cancel" : "Change"}
            </Button>
          </div>

          {editingEmail ? (
            <div className="space-y-4">
              <Input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Save Email
              </Button>
            </div>
          ) : (
            <p className="text-gray-700 font-medium pl-11">
              {profileData.email}
            </p>
          )}
        </div>

        {/* Phone Section */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <CardHeader
              icon={
                <div className="p-2 bg-green-100 rounded-lg">
                  <Smartphone size={20} className="text-green-600" />
                </div>
              }
              title="Phone Number"
              description="Used for two-factor authentication"
            />
            <Button
              onClick={() => setEditingPhone(!editingPhone)}
              variant="link"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm p-0 h-auto"
            >
              {editingPhone ? "Cancel" : "Change"}
            </Button>
          </div>

          {editingPhone ? (
            <div className="space-y-4">
              <Input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Save Phone
              </Button>
            </div>
          ) : (
            <p className="text-gray-700 font-medium pl-11">
              {profileData.phone}
            </p>
          )}
        </div>

        {/* Account Actions */}
        <div className="border-t pt-6 space-y-4">
          <Button
            variant="secondary"
            className="w-full flex items-center justify-between p-4 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors group h-auto"
          >
            <div className="flex items-center space-x-3">
              <Download size={20} className="text-yellow-600" />
              <span className="font-medium text-gray-900">
                Download Your Data
              </span>
            </div>
            <ChevronRight
              size={18}
              className="text-gray-400 group-hover:translate-x-1 transition-transform"
            />
          </Button>

          <Button
            variant="secondary"
            className="w-full flex items-center justify-between p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors group h-auto"
          >
            <div className="flex items-center space-x-3">
              <Trash2 size={20} className="text-red-600" />
              <span className="font-medium text-gray-900">Delete Account</span>
            </div>
            <ChevronRight
              size={18}
              className="text-gray-400 group-hover:translate-x-1 transition-transform"
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Security Settings Component
const SecuritySettings = ({ twoFactorEnabled, setTwoFactorEnabled }) => {
  const [showSetup, setShowSetup] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const handleSetupComplete = () => {
    if (verificationCode.length === 6) {
      setTwoFactorEnabled(true);
      setShowSetup(false);
      setVerificationCode("");
    }
  };

  return (
    <div>
      <PageHeader
        title="Security Settings"
        description="Keep your account safe and secure"
      />

      <div className="space-y-6">
        {/* Password */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <CardHeader
              icon={
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Key size={20} className="text-indigo-600" />
                </div>
              }
              title="Password"
              description="Last changed 3 months ago"
            />
            <Button
              variant="link "
              size="sm"
              className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
            >
              Change Password
            </Button>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <CardHeader
              icon={
                <div className="p-2 bg-green-100 rounded-lg">
                  <ShieldCheck size={20} className="text-green-600" />
                </div>
              }
              title="Two-Factor Authentication"
              description={
                twoFactorEnabled
                  ? "Your account is protected"
                  : "Add an extra layer of security"
              }
            />
            <Button
              onClick={() => setShowSetup(!showSetup)}
              variant={twoFactorEnabled ? "outline" : "default"}
              size="sm"
              className={`${
                twoFactorEnabled
                  ? "bg-red-100 text-red-600 hover:bg-red-200 border-red-200"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {twoFactorEnabled ? "Disable" : "Enable"}
            </Button>
          </div>

          {showSetup && !twoFactorEnabled && (
            <div className="mt-6 space-y-4 border-t pt-6">
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  1. Install an authenticator app
                </p>
                <p className="text-xs text-gray-500">
                  Google Authenticator, Microsoft Authenticator, or Authy
                </p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-4">
                  2. Scan this QR code
                </p>
                <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                  <div className="text-gray-400">QR Code</div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  3. Enter verification code
                </p>
                <div className="flex space-x-2">
                  {[...Array(6)].map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength="1"
                      className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-bold"
                      value={verificationCode[i] || ""}
                      onChange={(e) => {
                        const newCode = verificationCode.split("");
                        newCode[i] = e.target.value;
                        setVerificationCode(newCode.join(""));
                        if (e.target.value && i < 5) {
                          e.target.nextSibling?.focus();
                        }
                      }}
                    />
                  ))}
                </div>
              </div>

              <Button
                onClick={handleSetupComplete}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Enable Two-Factor Authentication
              </Button>
            </div>
          )}
        </div>

        {/* Active Sessions */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-lg text-gray-900 mb-4">
            Active Sessions
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center space-x-3">
                <Monitor size={20} className="text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">
                    Chrome on MacBook Pro
                  </p>
                  <p className="text-sm text-gray-500">
                    San Francisco, CA • Current session
                  </p>
                </div>
              </div>
              <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center space-x-3">
                <Smartphone size={20} className="text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Safari on iPhone</p>
                  <p className="text-sm text-gray-500">
                    San Francisco, CA • 2 hours ago
                  </p>
                </div>
              </div>
              <Button
                variant="link"
                className="text-red-600 hover:text-red-700 text-sm font-medium p-0 h-auto"
              >
                End
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Notifications Component
const Notifications = () => {
  const [notifications, setNotifications] = useState({
    likes: true,
    comments: true,
    follows: false,
    messages: true,
    mentions: true,
    stories: false,
    live: true,
    email: false,
    push: true,
  });

  const handleToggle = (key) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    });
  };

  const notificationGroups = [
    {
      title: "Activity",
      icon: Heart,
      color: "red",
      items: [
        {
          key: "likes",
          label: "Likes",
          description: "When someone likes your posts",
        },
        {
          key: "comments",
          label: "Comments",
          description: "When someone comments on your posts",
        },
        {
          key: "follows",
          label: "New Followers",
          description: "When someone follows you",
        },
        {
          key: "mentions",
          label: "Mentions",
          description: "When someone mentions you",
        },
      ],
    },
    {
      title: "Messages",
      icon: MessageSquare,
      color: "blue",
      items: [
        {
          key: "messages",
          label: "Direct Messages",
          description: "New message notifications",
        },
        {
          key: "stories",
          label: "Story Replies",
          description: "When someone replies to your story",
        },
      ],
    },
    {
      title: "Other",
      icon: Bell,
      color: "purple",
      items: [
        {
          key: "live",
          label: "Live Videos",
          description: "When someone you follow goes live",
        },
        {
          key: "email",
          label: "Email Notifications",
          description: "Receive updates via email",
        },
        {
          key: "push",
          label: "Push Notifications",
          description: "Receive push notifications on your device",
        },
      ],
    },
  ];

  return (
    <div>
      <PageHeader
        title="Notification Preferances"
        description="Choose what you want to be notified about"
      />
      <div className="space-y-6">
        {notificationGroups.map((group) => {
          const Icon = group.icon;
          return (
            <div key={group.title} className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-2 bg-${group.color}-100 rounded-lg`}>
                  <Icon size={20} className={`text-${group.color}-600`} />
                </div>
                <h3 className="font-semibold text-lg text-gray-900">
                  {group.title}
                </h3>
              </div>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-500">
                        {item.description}
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggle(item.key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications[item.key] ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications[item.key]
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Privacy Settings Component
const PrivacySettings = () => {
  const [privacySettings, setPrivacySettings] = useState({
    privateAccount: false,
    showActivity: true,
    allowTagging: true,
    showProfile: true,
    allowMessages: true,
    dataSharing: false,
  });

  const handleToggle = (key) => {
    setPrivacySettings({
      ...privacySettings,
      [key]: !privacySettings[key],
    });
  };

  return (
    <div>
      <PageHeader
        title="Privacy Settings"
        description="Control who can see your content and interact with you"
      />
      <div className="space-y-6">
        {/* Account Privacy */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center">
            <Lock size={20} className="mr-2 text-purple-600" />
            Account Privacy
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Private Account</p>
                <p className="text-sm text-gray-500">
                  Only approved followers can see your content
                </p>
              </div>
              <button
                onClick={() => handleToggle("privateAccount")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacySettings.privateAccount
                    ? "bg-purple-600"
                    : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacySettings.privateAccount
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Interactions */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center">
            <Users size={20} className="mr-2 text-blue-600" />
            Interactions
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Activity Status</p>
                <p className="text-sm text-gray-500">
                  Show when you were last active
                </p>
              </div>
              <button
                onClick={() => handleToggle("showActivity")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacySettings.showActivity ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacySettings.showActivity
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Allow Tagging</p>
                <p className="text-sm text-gray-500">
                  Let others tag you in posts and stories
                </p>
              </div>
              <button
                onClick={() => handleToggle("allowTagging")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacySettings.allowTagging ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacySettings.allowTagging
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Message Requests</p>
                <p className="text-sm text-gray-500">
                  Allow messages from everyone
                </p>
              </div>
              <button
                onClick={() => handleToggle("allowMessages")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacySettings.allowMessages ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacySettings.allowMessages
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Blocked Accounts */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-md text-gray-900">
              Blocked Accounts
            </h3>
            <span className="text-sm text-gray-500">3 accounts</span>
          </div>
          <Button
            variant="secondary"
            className="w-full flex items-center justify-between p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors group h-auto"
          >
            <span className="font-medium text-gray-700">
              Manage blocked accounts
            </span>
            <ChevronRight
              size={18}
              className="text-gray-400 group-hover:translate-x-1 transition-transform"
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Appearance Settings Component

const AppearanceSettings = ({ theme, setTheme }) => {
  const { themeClasses } = useTheme();
  const [accentColor, setAccentColor] = useState("blue");
  const [fontSize, setFontSize] = useState("medium");

  const themes = [
    {
      id: "light",
      label: "Light",
      icon: Sun,
      bg: "bg-white",
      text: "text-gray-900",
    },
    {
      id: "dark",
      label: "Dark",
      icon: Moon,
      bg: "bg-gray-900",
      text: "text-white",
    },
    {
      id: "auto",
      label: "Auto",
      icon: Monitor,
      bg: "bg-gradient-to-r from-white to-gray-900",
      text: "text-gray-600",
    },
  ];

  const colors = [
    { id: "blue", color: "bg-blue-500" },
    { id: "purple", color: "bg-purple-500" },
    { id: "pink", color: "bg-pink-500" },
    { id: "green", color: "bg-green-500" },
    { id: "yellow", color: "bg-yellow-500" },
    { id: "red", color: "bg-red-500" },
  ];

  return (
    <div>
      <PageHeader
        title="Appearance"
        description="Customize how the app looks on your device"
      />

      <div className="space-y-8">
        {/* Theme Selection */}
        <div>
          <h3 className={`font-semibold text-lg ${themeClasses.text} mb-4`}>
            Theme
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {themes.map((t) => {
              const Icon = t.icon;
              return (
                <Button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  variant="outline"
                  className={`relative p-6 rounded-xl border-2 transition-all h-auto ${themeClasses.bgSecondary} ${
                    theme === t.id
                      ? "border-blue-500 shadow-lg"
                      : `${themeClasses.border} ${themeClasses.borderHover}`
                  }`}
                >
                  <div
                    className={`w-full h-20 rounded-lg ${t.bg} mb-3 flex items-center justify-center`}
                  >
                    <Icon size={24} className={t.text} />
                  </div>
                  <p className={`font-medium ${themeClasses.text}`}>{t.label}</p>
                  {theme === t.id && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                      <Check size={14} />
                    </div>
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Accent Color */}
        <div>
          <h3 className={`font-semibold text-lg ${themeClasses.text} mb-4`}>
            Accent Color
          </h3>
          <div className="flex gap-4">
            {colors.map((c) => (
              <Button
                key={c.id}
                onClick={() => setAccentColor(c.id)}
                variant="ghost"
                size="icon"
                className={`w-12 h-12 rounded-full ${c.color} relative transition-transform hover:scale-110 p-0`}
              >
                {accentColor === c.id && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check size={20} className="text-white" />
                  </div>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Font Size */}
        <div>
          <h3 className={`font-semibold text-lg ${themeClasses.text} mb-4`}>
            Font Size
          </h3>
          <div className={`${themeClasses.bgSecondary} rounded-xl p-4`}>
            <div className={`flex items-center justify-between mb-4 ${themeClasses.text}`}>
              <span className="text-sm">Aa</span>
              <span className="text-xl">Aa</span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              value={fontSize === "small" ? 1 : fontSize === "medium" ? 2 : 3}
              onChange={(e) => {
                const size = parseInt(e.target.value);
                setFontSize(
                  size === 1 ? "small" : size === 2 ? "medium" : "large"
                );
              }}
              className="w-full"
            />
            <div className={`flex justify-between mt-2 text-xs ${themeClasses.textMuted}`}>
              <span>Small</span>
              <span>Medium</span>
              <span>Large</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Activity Settings Component
const ActivitySettings = () => {
  return (
    <div>
      <PageHeader
        title="Activity Dashboard"
        description="Monitor your account activity and engagement"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-700">Profile Views</h3>
            <Eye size={20} className="text-blue-600" />
          </div>

          <PageHeader tile title="1,284" description="↑ 12% from last week" />
          <p className="text-3xl font-bold text-gray-900"></p>
          <p className="text-sm text-green-600 mt-1"></p>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-700">Total Followers</h3>
            <UserPlus size={20} className="text-purple-600" />
          </div>
          <PageHeader title="5,432" description="↑ 8% from last month" />
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-700">Engagement Rate</h3>
            <Zap size={20} className="text-green-600" />
          </div>
          <PageHeader title="4.8%" description="↑ 0.5% from last week" />
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-700">Content Shared</h3>
            <Share2 size={20} className="text-yellow-600" />
          </div>
          <PageHeader title="234" description="↓ 3% from last week" />
          {/* <p className="text-xl font-bold text-gray-900">234</p>
          <p className="text-sm text-red-600 mt-1">↓ 3% from last week</p> */}
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        {/* <h3 className="font-semibold text-lg text-gray-900 mb-4">
          Recent Activity
        </h3> */}
        <PageHeader
        title="Recant Activity"/>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Heart size={16} className="text-blue-600" />
            </div>
            <div className="flex-1">
              
              <p className="font-medium text-gray-900">
                New likes on your post
              </p>
              <p className="text-sm text-gray-500">2 minutes ago</p>
            </div>
            <span className="text-sm font-medium text-gray-600">+24</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
            <div className="p-2 bg-purple-100 rounded-lg">
              <UserPlus size={16} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">New followers</p>
              <p className="text-sm text-gray-500">1 hour ago</p>
            </div>
            <span className="text-sm font-medium text-gray-600">+5</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
            <div className="p-2 bg-green-100 rounded-lg">
              <MessageSquare size={16} className="text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Comments on your post</p>
              <p className="text-sm text-gray-500">3 hours ago</p>
            </div>
            <span className="text-sm font-medium text-gray-600">+12</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Help & Support Component
const HelpSupport = () => {
  const helpTopics = [
    {
      icon: FileText,
      label: "Help Center",
      description: "Browse help articles",
    },
    {
      icon: MessageSquare,
      label: "Contact Support",
      description: "Get help from our team",
    },
    {
      icon: Shield,
      label: "Safety Center",
      description: "Learn about safety tools",
    },
    {
      icon: CreditCard,
      label: "Billing",
      description: "Manage your subscription",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-[16px] font-bold text-gray-900 ">Help & Support</h2>
        <p className="text-gray-600 text-[14px] font-[400]">
          Get help and find answers to your questions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {helpTopics.map((topic) => {
          const Icon = topic.icon;
          return (
            <Button
              key={topic.label}
              variant="secondary"
              className="flex items-start space-x-4 px-2 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left group h-auto"
            >
              <div className="p-3 bg-white rounded-lg group-hover:shadow-md transition-shadow">
                <Icon size={24} className="text-gray-700" />
              </div>
              <div className="flex items-center  w-full  justify-between">
                <PageHeader
                
                title={topic.label}
                description={topic.description}
                />

              </div>
              <ChevronRight
                size={18}
                className="text-gray-400 group-hover:translate-x-1 transition-transform"
              />
            </Button>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <PageHeader
        title='Need more help?'
        description='Our support team is here to assist you 24/7'
        />

    
        <Button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
        connect
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
