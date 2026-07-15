import "../css/dashboard.css";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ShipmentChart from "../components/ShipmentChart";

function Reports() {
  const reports = [
    { title: "Monthly Logistics Review", status: "Published" },
    { title: "Fleet Efficiency Q2", status: "Draft" },
    { title: "Warehouse Capacity Audit", status: "Published" },
    { title: "Customer Delivery Trends", status: "Pending" },
  ];

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <Navbar title="Analytics Reports" />

        <section className="cards">
          <div className="dashboard-card">
            <div className="card-left">
              <p>Reports Available</p>
              <h2>24</h2>
              <span className="change">Latest insights</span>
            </div>
            <div className="icon" style={{ background: "#2563eb" }}>
              R
            </div>
          </div>
          <div className="dashboard-card">
            <div className="card-left">
              <p>Weekly Downloads</p>
              <h2>1,452</h2>
              <span className="change">Active users</span>
            </div>
            <div className="icon" style={{ background: "#0f766e" }}>
              D
            </div>
          </div>
          <div className="dashboard-card">
            <div className="card-left">
              <p>Turnaround Time</p>
              <h2>18h</h2>
              <span className="change">Average data refresh</span>
            </div>
            <div className="icon" style={{ background: "#9333ea" }}>
              T
            </div>
          </div>
          <div className="dashboard-card">
            <div className="card-left">
              <p>Report Accuracy</p>
              <h2>99.3%</h2>
              <span className="change">Validated metrics</span>
            </div>
            <div className="icon" style={{ background: "#22c55e" }}>
              A
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="panel large">
            <div className="panel-header">
              <h3>Performance Trend</h3>
            </div>
            <ShipmentChart />
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>Recent Report Activity</h3>
            </div>
            <div className="message-list">
              {reports.map((report, index) => (
                <div className="message-item" key={index}>
                  <div>
                    <h4>{report.title}</h4>
                    <p>Status: {report.status}</p>
                  </div>
                  <span>View</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Reports;
