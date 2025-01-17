import { Route, Routes } from "react-router-dom";

import Sidebar from "../components/DashBoard/common/Sidebar";

import OverviewPage from "../DashboardPages/OverviewPage";
import ProductsPage from "../DashboardPages/ProductsPage";
import UsersPage from "../DashboardPages/UsersPage";
import SalesPage from "../DashboardPages/SalesPage";
import OrdersPage from "../DashboardPages/OrdersPage";
import AnalyticsPage from "../DashboardPages/AnalyticsPage";
import SettingsPage from "../DashboardPages/SettingsPage";

function App() {
	return (
		<div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
			{/* BG */}
			<div className='fixed inset-0 z-0'>
				<div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
				<div className='absolute inset-0 backdrop-blur-sm' />
			</div>

			<Sidebar />
			<Routes>
				<Route path='/' element={<OverviewPage />} />
				<Route path='/products' element={<ProductsPage />} />
				<Route path='/users' element={<UsersPage />} />
				<Route path='/sales' element={<SalesPage />} />
				<Route path='/orders' element={<OrdersPage />} />
				<Route path='/analytics' element={<AnalyticsPage />} />
				<Route path='/settings' element={<SettingsPage />} />
			</Routes>
		</div>
	);
}

export default App;
