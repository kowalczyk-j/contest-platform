import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateContestPage from "./CreateContestPage";
import HomePage from "./HomePage";
import AvailableEntries from './AvailableEntries';
import MineCard from './MineCard';
import CreateEntryPage from "./CreateEntryPage";
import Entries from "./Entries";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-contest" element={<CreateContestPage />}/>
        <Route path="/available-entries" element={<AvailableEntries />}/>
        <Route path="/create-contest" element={<CreateContestPage />} />
        <Route path="/contest/:contestId" element={<CreateEntryPage />} />
        <Route path="/entries/:contestId" element={<Entries />} />
      </Routes>
    </Router>
  );
}

export default App;
