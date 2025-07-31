"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { adminApi } from "@/lib/api";
import {
  ChartBarIcon,
  UserGroupIcon,
  BuildingStorefrontIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

interface ComprehensiveStats {
  totalUsers: number;
  totalPartners: number;
  totalServices: number;
  totalBookings: number;
  totalRevenue: number;
  growthRate: number;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  userGrowth: Array<{ month: string; count: number }>;
  partnerGrowth: Array<{ month: string; count: number }>;
  servicesByCategory: Array<{ category: string; count: number }>;
  serviceCategories: Array<{ category: string; count: number }>;
  topPartners: Array<{ name: string; bookings: number; revenue: number }>;
  // Backend compatibility properties (required for mock data)
  revenue: {
    currentMonth: number;
    previousMonth: number;
    percentChange: number;
  };
  bookings: {
    currentMonth: number;
    previousMonth: number;
    percentChange: number;
    trend: Array<{ month: number; year: number; count: string }>;
  };
  users: {
    currentMonth: number;
    previousMonth: number;
    percentChange: number;
  };
  partners: {
    currentMonth: number;
    previousMonth: number;
    percentChange: number;
  };
  featuredServices: Array<{
    id: number;
    name: string;
    bookingCount: string;
    category: string;
    partnerName: string;
    price: string;
  }>;
}

// Mock data structure for Vercel deployment
const createMockStats = (basicStats?: Partial<ComprehensiveStats>): ComprehensiveStats => ({
  totalUsers: basicStats?.totalUsers || 289,
  totalPartners: basicStats?.totalPartners || 42,
  totalServices: basicStats?.totalServices || 78,
  totalBookings: basicStats?.totalBookings || 567,
  totalRevenue: 50000000,
  growthRate: 15.5,
  monthlyRevenue: [
    { month: "2024-01", revenue: 3000000 },
    { month: "2024-02", revenue: 3500000 },
    { month: "2024-03", revenue: 4200000 },
    { month: "2024-04", revenue: 3800000 },
    { month: "2024-05", revenue: 4500000 },
    { month: "2024-06", revenue: 5200000 },
  ],
  userGrowth: [
    { month: "2024-01", count: 120 },
    { month: "2024-02", count: 145 },
    { month: "2024-03", count: 178 },
    { month: "2024-04", count: 203 },
    { month: "2024-05", count: 245 },
    { month: "2024-06", count: 289 },
  ],
  partnerGrowth: [
    { month: "2024-01", count: 15 },
    { month: "2024-02", count: 18 },
    { month: "2024-03", count: 22 },
    { month: "2024-04", count: 28 },
    { month: "2024-05", count: 35 },
    { month: "2024-06", count: 42 },
  ],
  servicesByCategory: [
    { category: "Làm tóc", count: 25 },
    { category: "Làm móng", count: 18 },
    { category: "Massage", count: 15 },
    { category: "Trang điểm", count: 12 },
    { category: "Khác", count: 8 },
  ],
  serviceCategories: [
    { category: "Làm tóc", count: 25 },
    { category: "Làm móng", count: 18 },
    { category: "Massage", count: 15 },
    { category: "Trang điểm", count: 12 },
    { category: "Khác", count: 8 },
  ],
  topPartners: [
    { name: "Beauty Salon ABC", bookings: 125, revenue: 8500000 },
    { name: "Nail Studio XYZ", bookings: 98, revenue: 6200000 },
    { name: "Spa Luxury", bookings: 87, revenue: 9800000 },
  ],
  // Backend compatibility properties
  revenue: {
    currentMonth: 5200000,
    previousMonth: 4500000,
    percentChange: 15.6,
  },
  bookings: {
    currentMonth: 98,
    previousMonth: 85,
    percentChange: 15.3,
    trend: [
      { month: 1, year: 2024, count: "65" },
      { month: 2, year: 2024, count: "72" },
      { month: 3, year: 2024, count: "78" },
      { month: 4, year: 2024, count: "85" },
      { month: 5, year: 2024, count: "92" },
      { month: 6, year: 2024, count: "98" },
    ],
  },
  users: {
    currentMonth: 45,
    previousMonth: 38,
    percentChange: 18.4,
  },
  partners: {
    currentMonth: 7,
    previousMonth: 5,
    percentChange: 40.0,
  },
  featuredServices: [
    { id: 1, name: "Cắt tóc nam", bookingCount: "125", category: "Làm tóc", partnerName: "Beauty Salon ABC", price: "150000" },
    { id: 2, name: "Nail art", bookingCount: "98", category: "Làm móng", partnerName: "Nail Studio XYZ", price: "200000" },
    { id: 3, name: "Massage thư giãn", bookingCount: "87", category: "Massage", partnerName: "Spa Luxury", price: "300000" },
    { id: 4, name: "Trang điểm cô dâu", bookingCount: "76", category: "Trang điểm", partnerName: "Bridal Studio", price: "500000" },
    { id: 5, name: "Gội đầu dưỡng sinh", bookingCount: "65", category: "Làm tóc", partnerName: "Hair Care Plus", price: "120000" },
  ],
});

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

export default function StatisticsPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<ComprehensiveStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;

      setLoading(true);
      try {
        const basicStats = await adminApi.getStats(token);
        setStats(createMockStats(basicStats));
      } catch (error) {
        console.error("Error fetching statistics:", error);
        // Set mock data on error for Vercel demo
        setStats(createMockStats());
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const getMonthName = (monthNum: string) => {
    const months = [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ];
    return months[parseInt(monthNum) - 1];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getPercentageIcon = (percentage: number) => {
    if (percentage > 0) {
      return <ArrowUpIcon className="h-4 w-4 text-green-500" />;
    } else if (percentage < 0) {
      return <ArrowDownIcon className="h-4 w-4 text-red-500" />;
    }
    return <div className="h-4 w-4"></div>;
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage > 0) return "text-green-500";
    if (percentage < 0) return "text-red-500";
    return "text-gray-500";
  };

  // Prepare chart data
  const bookingTrendData = {
    labels:
      stats?.bookings.trend.map(
        (item: { month: number; year: number; count: string }) =>
          `${getMonthName(item.month.toString())} ${item.year}`,
      ) || [],
    datasets: [
      {
        label: "Lượt đặt lịch",
        data:
          stats?.bookings.trend.map((item: { count: string }) =>
            parseInt(item.count),
          ) || [],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const servicePerformanceData = {
    labels:
      stats?.featuredServices.map(
        (service: { name: string }) => service.name,
      ) || [],
    datasets: [
      {
        label: "Số lượt đặt",
        data:
          stats?.featuredServices.map((service: { bookingCount: string }) =>
            parseInt(service.bookingCount),
          ) || [],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(139, 92, 246, 0.8)",
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(139, 92, 246, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thống kê toàn diện
          </h1>
          <p className="text-gray-600">
            Thống kê chi tiết về doanh thu, lượt đặt lịch và hiệu suất dịch vụ
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Revenue Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                <h3 className="ml-3 text-lg font-semibold text-gray-900">
                  Doanh thu tháng
                </h3>
              </div>
              <div className="flex items-center">
                {getPercentageIcon(stats?.revenue.percentChange || 0)}
                <span
                  className={`ml-1 text-sm font-medium ${getPercentageColor(stats?.revenue.percentChange || 0)}`}
                >
                  {stats?.revenue.percentChange.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats?.revenue.currentMonth || 0)}
              </p>
              <p className="text-sm text-gray-600">
                Tháng trước: {formatCurrency(stats?.revenue.previousMonth || 0)}
              </p>
            </div>
          </div>

          {/* Bookings Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <CalendarIcon className="h-8 w-8 text-blue-600" />
                <h3 className="ml-3 text-lg font-semibold text-gray-900">
                  Lượt đặt lịch
                </h3>
              </div>
              <div className="flex items-center">
                {getPercentageIcon(stats?.bookings.percentChange || 0)}
                <span
                  className={`ml-1 text-sm font-medium ${getPercentageColor(stats?.bookings.percentChange || 0)}`}
                >
                  {stats?.bookings.percentChange.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-gray-900">
                {stats?.bookings.currentMonth.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                Tháng trước: {stats?.bookings.previousMonth.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Users Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <UserGroupIcon className="h-8 w-8 text-purple-600" />
                <h3 className="ml-3 text-lg font-semibold text-gray-900">
                  Người dùng mới
                </h3>
              </div>
              <div className="flex items-center">
                {getPercentageIcon(stats?.users.percentChange || 0)}
                <span
                  className={`ml-1 text-sm font-medium ${getPercentageColor(stats?.users.percentChange || 0)}`}
                >
                  {stats?.users.percentChange.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-gray-900">
                {stats?.users.currentMonth.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                Tháng trước: {stats?.users.previousMonth.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Partners Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <BuildingStorefrontIcon className="h-8 w-8 text-orange-600" />
                <h3 className="ml-3 text-lg font-semibold text-gray-900">
                  Đối tác mới
                </h3>
              </div>
              <div className="flex items-center">
                {getPercentageIcon(stats?.partners.percentChange || 0)}
                <span
                  className={`ml-1 text-sm font-medium ${getPercentageColor(stats?.partners.percentChange || 0)}`}
                >
                  {stats?.partners.percentChange.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-gray-900">
                {stats?.partners.currentMonth.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                Tháng trước: {stats?.partners.previousMonth.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Booking Trend Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center mb-6">
              <ArrowTrendingUpIcon className="h-6 w-6 text-blue-600" />
              <h3 className="ml-3 text-xl font-semibold text-gray-900">
                Xu hướng đặt lịch (6 tháng)
              </h3>
            </div>
            <div className="h-64">
              <Line
                data={bookingTrendData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Service Performance Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center mb-6">
              <ChartBarIcon className="h-6 w-6 text-green-600" />
              <h3 className="ml-3 text-xl font-semibold text-gray-900">
                Top 5 dịch vụ được đặt nhiều nhất
              </h3>
            </div>
            <div className="h-64">
              <Bar
                data={servicePerformanceData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Featured Services Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <SparklesIcon className="h-6 w-6 text-yellow-600" />
              <h3 className="ml-3 text-xl font-semibold text-gray-900">
                Dịch vụ đặc sắc
              </h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dịch vụ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đối tác
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lượt đặt
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats?.featuredServices.map(
                  (
                    service: {
                      id: number;
                      name: string;
                      bookingCount: string;
                      category: string;
                      partnerName: string;
                      price: string;
                    },
                    index: number,
                  ) => (
                    <tr
                      key={service.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                              <SparklesIcon className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {service.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {service.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {service.partnerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(parseFloat(service.price))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {service.bookingCount}
                          </div>
                          <div className="ml-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{
                                  width: `${Math.min(
                                    (parseInt(service.bookingCount) /
                                      Math.max(
                                        ...stats.featuredServices.map(
                                          (s: { bookingCount: string }) =>
                                            parseInt(s.bookingCount),
                                        ),
                                      )) *
                                      100,
                                    100,
                                  )}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
