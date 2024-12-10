import Header from "../components/DashBoard/common/Header";
import ConnectedAccounts from "../components/DashBoard/settings/ConnectedAccounts";
import DangerZone from "../components/DashBoard/settings/DangerZone";
import Notifications from "../components/DashBoard/settings/Notifications";
import Profile from "../components/DashBoard/settings/Profile";
import Security from "../components/DashBoard/settings/Security";

const SettingsPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
			<Header title='Settings' />
			<main className='max-w-4xl mx-auto py-6 px-4 lg:px-8'>
				<Profile />
				<Notifications />
				<Security />
				<ConnectedAccounts />
				<DangerZone />
			</main>
		</div>
	);
};
export default SettingsPage;
