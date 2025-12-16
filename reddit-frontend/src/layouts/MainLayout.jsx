import { Outlet, Link } from "react-router-dom";


function MainLayout() {
  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h3>Menu</h3>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/settings">Settings</Link></li>
          <li><Link to="/notifications">Notifications</Link></li>
          <li><Link to="/profile">Profile</Link></li>
        </ul>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;