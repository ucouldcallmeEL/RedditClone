import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import SettingsPage from "./pages/Settings/SettingsPage"
import NotificationPage from "./pages/Notifications/NotificationPage"
import Home from "./pages/Home";

function App() {

  return (
    <Router>
      <Routes>
        {/* Layout wrapper */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<SettingsPage/>} />
          <Route path="/notifications" element={<NotificationPage/>} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
