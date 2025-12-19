import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import SettingsPage from "./pages/Settings/SettingsPage"
import NotificationPage from "./pages/Notifications/NotificationPage"
import ProfilePage from "./pages/Profile/ProfilePage"
import Home from "./pages/Home";
import LoginPage from "./pages/LoginTest";

function App() {

  return (
    <Router>
      <Routes>
        {/* Layout wrapper */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/settings" element={<SettingsPage/>} />
          <Route path="/notifications" element={<NotificationPage/>} />
          <Route path="/profile" element={<ProfilePage/>} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
