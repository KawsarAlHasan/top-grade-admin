import React from 'react';
import { useDashboard } from '../api/api';
import { Card, Statistic, Table, Avatar, List, Row, Col } from 'antd';
import { 
  UserOutlined, 
  ShoppingCartOutlined, 
  BookOutlined, 
  VideoCameraOutlined,
  FileTextOutlined,
  SolutionOutlined,
  TeamOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

function Dashboard() {
  const { dashboardData, isLoading, isError, error, refetch } = useDashboard();

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (isError) return <div className="text-red-500 p-4">Error: {error.message}</div>;

  // Prepare data for the statistics cards
  const statsData = [
    { title: 'Users', value: dashboardData?.data?.users, icon: <UserOutlined />, color: 'bg-blue-100', xs: 12, sm: 8, md: 6, lg: 4, xl: 3 },
    { title: 'Orders', value: dashboardData?.data?.orders, icon: <ShoppingCartOutlined />, color: 'bg-green-100', xs: 12, sm: 8, md: 6, lg: 4, xl: 3 },
    { title: 'Courses', value: dashboardData?.data?.courses, icon: <BookOutlined />, color: 'bg-purple-100', xs: 12, sm: 8, md: 6, lg: 4, xl: 3 },
    { title: 'Videos', value: dashboardData?.data?.videos, icon: <VideoCameraOutlined />, color: 'bg-red-100', xs: 12, sm: 8, md: 6, lg: 4, xl: 3 },
    { title: 'Notes', value: dashboardData?.data?.study_notes, icon: <FileTextOutlined />, color: 'bg-yellow-100', xs: 12, sm: 8, md: 6, lg: 4, xl: 3 },
    { title: 'Packages', value: dashboardData?.data?.packages, icon: <AppstoreOutlined />, color: 'bg-indigo-100', xs: 12, sm: 8, md: 6, lg: 4, xl: 3 },
    { title: 'Tutoring', value: dashboardData?.data?.home_tutoring, icon: <SolutionOutlined />, color: 'bg-pink-100', xs: 12, sm: 8, md: 6, lg: 4, xl: 3 },
    { title: 'School', value: dashboardData?.data?.school_courses, icon: <TeamOutlined />, color: 'bg-teal-100', xs: 12, sm: 8, md: 6, lg: 4, xl: 3 },
  ];

  // Prepare data for the bar chart
  const chartData = {
    labels: dashboardData?.monthlyOrderTotals?.map(item => item.month),
    datasets: [
      {
        label: 'Monthly Orders Total',
        data: dashboardData?.monthlyOrderTotals?.map(item => item.total),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `$${context.raw.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return `$${value}`;
          }
        }
      }
    }
  };

  // Columns for recent users table
  const userColumns = [
    {
      title: 'User',
      dataIndex: 'profile_pic',
      key: 'user',
      render: (pic, record) => (
        <div className="flex items-center">
          <Avatar 
            src={pic || `https://ui-avatars.com/api/?name=${record.first_name}+${record.last_name}`} 
            size={window.innerWidth < 768 ? 'default' : 'large'}
          />
          <div className="ml-2 md:ml-3">
            <div className="font-medium text-sm md:text-base">{record.first_name} {record.last_name}</div>
            <div className="text-gray-500 text-xs md:text-sm truncate" style={{ maxWidth: '150px' }}>{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'right',
      responsive: ['md'],
    },
  ];

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Dashboard Overview</h1>
      
      {/* Statistics Cards - Responsive Grid */}
      <Row gutter={[12, 12]} className="mb-4 md:mb-6">
        {statsData.map((stat, index) => (
          <Col 
            xs={stat.xs} 
            sm={stat.sm} 
            md={stat.md} 
            lg={stat.lg} 
            xl={stat.xl} 
            key={index}
          >
            <Card className={`${stat.color} rounded-lg shadow-sm h-full`} bodyStyle={{ padding: '12px' }}>
              <Statistic
                title={<span className="text-xs md:text-sm">{stat.title}</span>}
                value={stat.value}
                prefix={React.cloneElement(stat.icon, { className: 'text-sm md:text-base' })}
                valueStyle={{ 
                  color: '#3f8600',
                  fontSize: window.innerWidth < 768 ? '14px' : '18px'
                }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Main Content Area */}
      <Row gutter={[12, 12]}>
        {/* Recent Users */}
        <Col xs={24} lg={12}>
          <Card 
            title={<span className="text-sm md:text-base">Recent Users</span>} 
            className="rounded-lg shadow-sm"
            extra={<a href="/users" className="text-blue-500 text-xs md:text-sm">View All</a>}
            bodyStyle={{ padding: '12px' }}
          >
            <Table
              columns={userColumns}
              dataSource={dashboardData?.recentUsers}
              rowKey="id"
              pagination={false}
              size="small"
              scroll={{ x: true }}
              className="responsive-table"
            />
          </Card>
        </Col>

        {/* Monthly Orders */}
        <Col xs={24} lg={12}>
          <Card 
            title={<span className="text-sm md:text-base">Monthly Orders</span>} 
            className="rounded-lg shadow-sm"
            bodyStyle={{ padding: '12px' }}
          >
            <div className="h-48 md:h-64">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Additional Stats */}
      <Row gutter={[12, 12]} className="mt-4 md:mt-6">
        <Col xs={24} md={12}>
          <Card 
            title={<span className="text-sm md:text-base">Content Statistics</span>} 
            className="rounded-lg shadow-sm"
            bodyStyle={{ padding: '12px' }}
          >
            <List
              size="small"
              dataSource={[
                { title: 'Chapters', value: dashboardData?.data?.chapter },
                { title: 'Course Topics', value: dashboardData?.data?.course_topic },
                { title: 'Course Details', value: dashboardData?.data?.course_details },
                { title: 'Assignments', value: dashboardData?.data?.assignment },
                { title: 'Semesters', value: dashboardData?.data?.semester },
              ]}
              renderItem={(item) => (
                <List.Item className="py-2 md:py-3">
                  <div className="flex justify-between w-full text-xs md:text-sm">
                    <span>{item.title}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card 
            title={<span className="text-sm md:text-base">Order Statistics</span>} 
            className="rounded-lg shadow-sm"
            bodyStyle={{ padding: '12px' }}
          >
            <List
              size="small"
              dataSource={[
                { title: 'School Orders', value: dashboardData?.data?.school_orders },
                { title: 'Total Amount', value: `$${dashboardData?.monthlyOrderTotals?.reduce((sum, item) => sum + item.total, 0).toFixed(2)}` },
                { title: 'Current Month', value: dashboardData?.monthlyOrderTotals?.find(item => item.month === new Date().toISOString().slice(0, 7))?.total || 0 },
                { title: 'Last Month', value: dashboardData?.monthlyOrderTotals?.find(item => item.month === new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7))?.total || 0 },
              ]}
              renderItem={(item) => (
                <List.Item className="py-2 md:py-3">
                  <div className="flex justify-between w-full text-xs md:text-sm">
                    <span>{item.title}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Mobile-specific optimizations */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .ant-statistic-title {
            font-size: 12px !important;
          }
          .ant-statistic-content {
            font-size: 14px !important;
          }
          .ant-card-head-title {
            padding: 12px 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;