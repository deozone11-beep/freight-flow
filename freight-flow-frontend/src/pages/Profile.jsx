import "../css/dashboard.css";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Profile() {
  const inbox = [
    {
      title: "Pending approval",
      message: "Your profile change request needs review.",
      time: "5m ago",
    },
    {
      title: "New assignment",
      message: "You have been assigned to the Mumbai logistics plan.",
      time: "25m ago",
    },
    {
      title: "Password reminder",
      message: "Update your account password every 90 days.",
      time: "1h ago",
    },
  ];

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <Navbar title="User Profile" />

        <section className="profile-grid">
          <div className="panel profile-card">
            <div className="panel-header">
              <h3>Administrator</h3>
            </div>
            <div className="profile-details">
              <p>Email: admin@freightflow.com</p>
              <p>Role: Operations Head</p>
              <p>Location: Bengaluru, India</p>
              <p>Phone: +91 98765 43210</p>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>Inbox & Alerts</h3>
            </div>
            <div className="message-list">
              {inbox.map((item, index) => (
                <div className="message-item info" key={index}>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.message}</p>
                  </div>
                  <span>{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Profile;
