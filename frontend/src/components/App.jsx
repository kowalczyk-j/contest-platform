import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateContestPage from "./CreateContestPage";
import ContestListPage from "./ContestListPage";
import AvailableEntries from './AvailableEntries';
import MineCard from './MineCard';
import CreateEntryPage from "./CreateEntryPage";
import Entries from "./Entries";
import RegistrationPage from './RegistrationPage';
import LoginPage from './LoginPage';
import UserProfilePage from './UserProfilePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ContestListPage />} />
        <Route path="/create-contest" element={<CreateContestPage />} />
        <Route path="/available-entries" element={<AvailableEntries />} />
        <Route path="/contest/:contestId" element={<CreateEntryPage />} />
        <Route path="/entries/:contestId" element={<Entries />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
