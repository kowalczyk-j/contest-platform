import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateContestPage from './CreateContestPage';
import LoginPage from './LoginPage';
import HomePage from "./HomePage";
import RegistrationPage from './RegistrationPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-contest" element={<CreateContestPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
