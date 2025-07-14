import { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Camera, 
  Shield, 
  Mail, 
  User, 
  Lock, 
  Bell, 
  Eye, 
  Globe, 
  HelpCircle,
  ChevronRight
} from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('edit-profile');
  const [profileData, setProfileData] = useState({
    username: 'johndoe',
    name: 'John Doe',
    bio: 'Digital creator | Photography enthusiast',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    gender: 'male',
    avatar: null
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleInputChange = (e) => {
    console.log('Profile input changed:', e.target.name, e.target.value);
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarChange = (e) => {
    console.log('Avatar change initiated');
    const file = e.target.files[0];
    if (file) {
      console.log('Avatar file selected:', file.name, file.size);
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('Avatar file read successfully');
        setProfileData({
          ...profileData,
          avatar: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTabChange = (tabId) => {
    console.log('Tab changed to:', tabId);
    setActiveTab(tabId);
  };

  const menuItems = [
    { id: 'edit-profile', label: 'Edit Profile', icon: User },
    { id: 'change-password', label: 'Change Password', icon: Lock },
    { id: 'two-factor', label: 'Two-Factor Auth', icon: Shield },
    { id: 'email-phone', label: 'Email & Phone', icon: Mail },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Eye },
    { id: 'language', label: 'Language', icon: Globe },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ];

  const renderContent = () => {
    console.log('Rendering content for tab:', activeTab);
    switch (activeTab) {
      case 'edit-profile':
        return <EditProfile profileData={profileData} handleInputChange={handleInputChange} handleAvatarChange={handleAvatarChange} />;
      case 'change-password':
        return <ChangePassword />;
      case 'two-factor':
        return <TwoFactorAuth twoFactorEnabled={twoFactorEnabled} setTwoFactorEnabled={setTwoFactorEnabled} />;
      case 'email-phone':
        return <EmailPhone profileData={profileData} handleInputChange={handleInputChange} />;
      case 'notifications':
        return <Notifications />;
      case 'privacy':
        return <PrivacySecurity />;
      default:
        return <EditProfile profileData={profileData} handleInputChange={handleInputChange} handleAvatarChange={handleAvatarChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-200 p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your account settings and preferences</p>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto scrollbar-hide space-x-2 sm:space-x-4 md:space-x-6 lg:space-x-8 px-4 sm:px-6" aria-label="Tabs">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`flex items-center space-x-1 sm:space-x-2 py-3 sm:py-4 px-2 sm:px-3 md:px-4 border-b-2 font-medium text-xs sm:text-sm transition-colors flex-shrink-0 ${
                    activeTab === item.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="whitespace-nowrap hidden sm:inline">{item.label}</span>
                  <span className="whitespace-nowrap sm:hidden text-xs">{item.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// Edit Profile Component
const EditProfile = ({ profileData, handleInputChange, handleAvatarChange }) => {
  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('Profile form submitted with data:', profileData);
    // Add form submission logic here
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>
      
      {/* Avatar Section */}
      <div className="flex items-center space-x-6 mb-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
            {profileData.avatar ? (
              <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <User size={40} />
              </div>
            )}
          </div>
          <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
            <Camera size={16} />
            <input type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
          </label>
        </div>
        <div>
          <h3 className="font-semibold text-lg">{profileData.username}</h3>
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            Change profile photo
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <form className="space-y-6" onSubmit={handleFormSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={profileData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={profileData.username}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            name="bio"
            value={profileData.bio}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <select
            name="gender"
            value={profileData.gender}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not">Prefer not to say</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

EditProfile.propTypes = {
  profileData: PropTypes.shape({
    username: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    gender: PropTypes.string.isRequired,
    avatar: PropTypes.string
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleAvatarChange: PropTypes.func.isRequired
};

// Change Password Component
const ChangePassword = () => {
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    console.log('Password change form submitted');
    // Add password change logic here
  };

  return (
    <div className="max-w-md">
      <h2 className="text-2xl font-semibold mb-6">Change Password</h2>
      <form className="space-y-6" onSubmit={handlePasswordSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          Update Password
        </button>
      </form>
    </div>
  );
};

// Two Factor Authentication Component
const TwoFactorAuth = ({ twoFactorEnabled, setTwoFactorEnabled }) => {
  const [showSetup, setShowSetup] = useState(false);

  const handleTwoFactorToggle = () => {
    console.log('Two-factor authentication toggled:', !twoFactorEnabled);
    setShowSetup(true);
  };

  const handleSetupComplete = () => {
    console.log('Two-factor authentication setup completed');
    setTwoFactorEnabled(true);
    setShowSetup(false);
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-semibold mb-6">Two-Factor Authentication</h2>
      
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <div className="flex items-start space-x-4">
          <Shield className="text-blue-600 mt-1" size={24} />
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">Secure Your Account</h3>
            <p className="text-gray-600 mb-4">
              Two-factor authentication adds an extra layer of security to your account. 
              You&apos;ll need to enter a code from your authentication app when you log in.
            </p>
            
            <div className="flex items-center justify-between">
              <span className="font-medium">
                Two-factor authentication is {twoFactorEnabled ? 'enabled' : 'disabled'}
              </span>
              <button
                onClick={handleTwoFactorToggle}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  twoFactorEnabled
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {twoFactorEnabled ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSetup && !twoFactorEnabled && (
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">Setup Two-Factor Authentication</h3>
          
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">1. Download an authenticator app</p>
              <p className="text-xs text-gray-500">Google Authenticator, Microsoft Authenticator, or Authy</p>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">2. Scan this QR code</p>
              <div className="w-48 h-48 bg-white border-2 border-gray-300 mx-auto my-4">
                {/* QR Code placeholder */}
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  QR Code
                </div>
              </div>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">3. Enter the verification code</p>
              <input
                type="text"
                placeholder="000000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={handleSetupComplete}
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Enable Two-Factor Authentication
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

TwoFactorAuth.propTypes = {
  twoFactorEnabled: PropTypes.bool.isRequired,
  setTwoFactorEnabled: PropTypes.func.isRequired
};

// Email & Phone Component
const EmailPhone = ({ profileData, handleInputChange }) => {
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);

  const handleEmailEdit = () => {
    console.log('Email editing toggled:', !editingEmail);
    setEditingEmail(!editingEmail);
  };

  const handlePhoneEdit = () => {
    console.log('Phone editing toggled:', !editingPhone);
    setEditingPhone(!editingPhone);
  };

  const handleEmailSave = () => {
    console.log('Email saved:', profileData.email);
    setEditingEmail(false);
  };

  const handlePhoneSave = () => {
    console.log('Phone saved:', profileData.phone);
    setEditingPhone(false);
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-semibold mb-6">Email & Phone</h2>
      
      {/* Email Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Email Address</h3>
          <button
            onClick={handleEmailEdit}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {editingEmail ? 'Cancel' : 'Change'}
          </button>
        </div>
        
        {editingEmail ? (
          <div className="space-y-4">
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button onClick={handleEmailSave} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Save Email
            </button>
          </div>
        ) : (
          <p className="text-gray-600">{profileData.email}</p>
        )}
      </div>

      {/* Phone Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Phone Number</h3>
          <button
            onClick={handlePhoneEdit}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {editingPhone ? 'Cancel' : 'Change'}
          </button>
        </div>
        
        {editingPhone ? (
          <div className="space-y-4">
            <input
              type="tel"
              name="phone"
              value={profileData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button onClick={handlePhoneSave} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Save Phone Number
            </button>
          </div>
        ) : (
          <p className="text-gray-600">{profileData.phone}</p>
        )}
      </div>
    </div>
  );
};

EmailPhone.propTypes = {
  profileData: PropTypes.shape({
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired
};

// Notifications Component
const Notifications = () => {
  const [notifications, setNotifications] = useState({
    likes: true,
    comments: true,
    follows: false,
    messages: true,
    email: false
  });

  const handleToggle = (key) => {
    console.log('Notification setting toggled:', key, !notifications[key]);
    setNotifications({
      ...notifications,
      [key]: !notifications[key]
    });
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-semibold mb-6">Notifications</h2>
      
      <div className="space-y-4">
        {Object.entries({
          likes: 'Likes',
          comments: 'Comments',
          follows: 'New Followers',
          messages: 'Direct Messages',
          email: 'Email Notifications'
        }).map(([key, label]) => (
          <div key={key} className="flex items-center justify-between py-3">
            <span className="font-medium">{label}</span>
            <button
              onClick={() => handleToggle(key)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications[key] ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications[key] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Privacy & Security Component
const PrivacySecurity = () => {
  const [privacySettings, setPrivacySettings] = useState({
    privateAccount: false,
    showActivity: true,
    allowTagging: true
  });

  const handleToggle = (key) => {
    console.log('Privacy setting toggled:', key, !privacySettings[key]);
    setPrivacySettings({
      ...privacySettings,
      [key]: !privacySettings[key]
    });
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-semibold mb-6">Privacy & Security</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-4">Account Privacy</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">Private Account</p>
                <p className="text-sm text-gray-600">Only approved followers can see your content</p>
              </div>
              <button
                onClick={() => handleToggle('privateAccount')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacySettings.privateAccount ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacySettings.privateAccount ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">Activity Status</p>
                <p className="text-sm text-gray-600">Show when you were last active</p>
              </div>
              <button
                onClick={() => handleToggle('showActivity')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacySettings.showActivity ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacySettings.showActivity ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">Allow Tagging</p>
                <p className="text-sm text-gray-600">Let others tag you in posts and stories</p>
              </div>
              <button
                onClick={() => handleToggle('allowTagging')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacySettings.allowTagging ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacySettings.allowTagging ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4">Blocked Accounts</h3>
          <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-2">
            <span>Manage blocked accounts</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;