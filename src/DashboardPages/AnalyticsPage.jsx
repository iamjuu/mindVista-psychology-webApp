import Header from "../components/DashBoard/common/Header";
import OverviewCards from "../components/DashBoard/analytics/OverviewCards";
import RevenueChart from "../components/DashBoard/analytics/RevenueChart";
import ChannelPerformance from "../components/DashBoard/analytics/ChannelPerformance";
import ProductPerformance from "../components/DashBoard/analytics/ProductPerformance";
import UserRetention from "../components/DashBoard/analytics/UserRetention";
import CustomerSegmentation from "../components/DashBoard/analytics/CustomerSegmentation";
import AIPoweredInsights from "../components/DashBoard/analytics/AIPoweredInsights";

const AnalyticsPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
			<Header title={"Analytics Dashboard"} />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<OverviewCards />
				<RevenueChart />
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
					<ChannelPerformance />
					<ProductPerformance />
					<UserRetention />
					<CustomerSegmentation />
				</div>

				<AIPoweredInsights />
			</main>
		</div>
	);
};
export default AnalyticsPage;
