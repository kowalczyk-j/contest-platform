import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateContestPage from "./CreateContestPage";
import ContestListPage from "./ContestListPage";
import GradeEntry from "./GradeEntry";
import CreateEntryPage from "./CreateEntryPage";
import Entries from "./Entries";
import RegistrationPage from "./RegistrationPage";
import LoginPage from "./LoginPage";
import UserProfilePage from "./UserProfilePage";
import PrivateRoute from "./PrivateRoute";
import EmailForm from "./EmailForm";
import UsersListPage from "./UsersListPage";
import UserEntries from "./UserEntries";
import EntryWorkView from "./EntryWorkView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ContestListPage />} />
        <Route path="/create-contest" element={<CreateContestPage />} />
        <Route path="/grade-entry/:entryId" element={<GradeEntry />} />
        <Route
          path="/create-entry/:contestId"
          element={
            <PrivateRoute forAuthenticated={true}>
              <CreateEntryPage />
            </PrivateRoute>
          }
        />
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
        <Route path="/user-entries" element={<UserEntries />} />
        <Route path="/view-work/:entryId" element={<EntryWorkView />} />
        <Route
          path="/users"
          element={
            <PrivateRoute forStaff={true}>
              <UsersListPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/contest/:contestId/email"
          element={
            <PrivateRoute forStaff={true}>
              <EmailForm />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
