import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateContestPage from "./CreateContestPage";
import HomePage from "./HomePage";
import CreateEntryPage from './CreateEntryPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-contest" element={<CreateContestPage />}/>
        <Route path="/contest/:contestId" element={<CreateEntryPage />}/>
      </Routes>
    </Router>
  );
}

export default App;
