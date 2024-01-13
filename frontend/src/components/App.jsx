import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateContestPage from "./CreateContestPage";
import ContestListPage from "./ContestListPage";
import GradeEntry from './GradeEntry';
import CreateEntryPage from "./CreateEntryPage";
import Entries from "./Entries";
import RegistrationPage from "./RegistrationPage";
import LoginPage from "./LoginPage";
import UserProfilePage from "./UserProfilePage";
import PrivateRoute from "./PrivateRoute";
import EmailForm from "./EmailForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ContestListPage />} />
        <Route path="/create-contest" element={<CreateContestPage />} />
        <Route path="/grade-entry/:entryId" element={<GradeEntry />} />
        <Route path="/contest/:contestId" element={<CreateEntryPage />} />
        <Route
          path="/entries/:contestId"
          element={
            <PrivateRoute forJury={true}>
              <Entries />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/email" element={<EmailForm />} />
      </Routes>
    </Router>
  );
}

export default App;
