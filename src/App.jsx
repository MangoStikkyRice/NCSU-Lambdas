import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Recruitment from './pages/Recruitment/Recruitment';
import Brothers from './pages/Brothers';
import Media from './pages/Media';
import LegacyChooser from './pages/Legacy/LegacyChooser';
import MemberManagement from './pages/MemberManagement';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <div>
        {/* Sets a blue theme for iPhone islands. */}
        <meta name="theme-color" content="#ffffff" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/legacy" element={<LegacyChooser />} />
          <Route path="/recruitment" element={<Recruitment />} />
          <Route path="/brothers" element={<Brothers />} />
          <Route path="/media" element={<Media />} />
          <Route path="/management" element={
            <ProtectedRoute>
              <MemberManagement />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
