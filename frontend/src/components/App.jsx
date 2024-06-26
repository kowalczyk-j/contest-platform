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
import CertificateForm from "./CertificateForm";
import EditContestPage from "./EditContestPage";
import ContestStats from "./ContestStats";
import GradeEntryView from "./GradeEntryView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ContestListPage />} />
        <Route
          path="/create-contest"
          element={
            <PrivateRoute forStaff={true}>
              <CreateContestPage />
            </PrivateRoute>
          }
        />
        <Route path="/edit-contest/:contestId" element={<EditContestPage />} />
        <Route path="/grade-entry-rate/:entryId" element={<GradeEntry />} />
        <Route path="/grade-entry-view/:entryId" element={<GradeEntryView />} />
        <Route
          path="/create-entry/:contestId"
          element={
            <PrivateRoute forAuthenticated={true} checkContestStatus={true}>
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
        <Route
          path="/profile"
          element={
            <PrivateRoute forAuthenticated={true}>
              <UserProfilePage />
            </PrivateRoute>
          }
        />
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
        <Route
          path="/contest/:contestId/stats"
          element={
            <PrivateRoute forStaff={true}>
              <ContestStats />
            </PrivateRoute>
          }
        />
        <Route
          path="/contest/:contestId/certificates"
          element={
            <PrivateRoute forStaff={true}>
              <CertificateForm />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
