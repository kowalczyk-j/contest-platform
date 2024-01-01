import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateContestPage from './CreateContestPage';
import HomePage from "./HomePage";
import AvailableEntries from './AvailableEntries';
import MineCard from './MineCard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-contest" element={<CreateContestPage />}/>
        <Route path="/available-entries" element={<AvailableEntries />}/>
      </Routes>
    </Router>
  );
}

export default App;
