import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FeedbackForm from "./Components/FeedbackForm";
import ReportDownload from "./Components/ReportDownload";
import CategoryManager from "./Components/CategoryManager";
import ItemManager from "./Components/ItemManager";
import FeedbackList from "./Components/FeedbackList";
import Navbar from "./Components/Navbar";


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<FeedbackForm />} />
        <Route path="/categories" element={<CategoryManager />} />
        <Route path="/items" element={<ItemManager />} />
        <Route path="/feedback" element={<FeedbackList />} />
        <Route path="/report" element={<ReportDownload />} />
      </Routes>
    </Router>
  );
}

export default App;
