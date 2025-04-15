function Dashboard() {
  return (
    <div className="flex justify-center items-center">
    <div className="stats shadow">
      <div className="stat place-items-center">
        <div className="stat-title">Active Users</div>
        <div className="stat-value text-white">4,200</div>
        <div className="stat-desc text-success">↗︎ 200 (5%)</div>
      </div>

      <div className="stat place-items-center">
        <div className="stat-title">Expiring Licenses</div>
        <div className="stat-value text-white">120</div>
        <div className="stat-desc text-white">Next 30 Days</div>
      </div>

      <div className="stat place-items-center">
        <div className="stat-title">Compliance Rate</div>
        <div className="stat-value text-white">95%</div>
        <div className="stat-desc text-error">↗︎ 3% from last month</div>
      </div>

      <div className="stat place-items-center">
        <div className="stat-title">Notifications Sent</div>
        <div className="stat-value text-white">1,500</div>
        <div className="stat-desc text-white">This Month</div>
      </div>
    </div>
  </div>
  );
}

export default Dashboard;
