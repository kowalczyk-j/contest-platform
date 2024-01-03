import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateContestPage from "./CreateContestPage";
import HomePage from "./HomePage";
import GradeEntry from './GradeEntry';
import CreateEntryPage from "./CreateEntryPage";
import Entries from "./Entries";
import RegistrationPage from './RegistrationPage';
import LoginPage from './LoginPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-contest" element={<CreateContestPage />} />
        <Route path="/grade-entry" element={<GradeEntry />} />
        <Route path="/contest/:contestId" element={<CreateEntryPage />} />
        <Route path="/entries/:contestId" element={<Entries />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
