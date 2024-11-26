import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home'
import Recruitment from './pages/Recruitment'
import Brothers from './pages/Brothers'
import LegacyRELOADED from './pages/LegacyRELOADED';
import Media from './pages/Media'



function App() {

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/legacy" element={<LegacyRELOADED />} />
          <Route path="/recruitment" element={<Recruitment />} />
          <Route path="/brothers" element={<Brothers />} />
          <Route path="/media" element={<Media />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
