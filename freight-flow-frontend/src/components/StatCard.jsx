function StatCard({ title, value, icon, color, change }) {
  return (
    <div className="dashboard-card">
      <div className="card-left">
        <p>{title}</p>

        <h2>{value}</h2>

        <span className="change">{change}</span>
      </div>

      <div
        className="icon"
        style={{ background: color }}
      >
        {icon}
      </div>
    </div>
  );
}

export default StatCard;