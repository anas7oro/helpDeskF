import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import {
  getKnowledge,
} from "../features/KnowledgeBase/KnowledgeSlice";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const color_ballet = useSelector((state) => state.branding.activeBranding && state.branding.activeBranding.color_ballet);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showAll, setShowAll] = useState(true);

  useEffect(() => {
    console.log("checking", user);
    if (!user) {
      console.log("there is no user redirecting to login page");
      navigate("/login");
    }
    dispatch(getKnowledge(user));
  }, [user, navigate]);

  const qAndAs = useSelector((state) => state.knowledge.knowledge);
  console.log("qAndAs", qAndAs);
  const searchQuestion = (searchTerm) => {
    const results = qAndAs.filter((qAndA) =>
      qAndA.question.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return results;
  };
  
  const handleSearch = () => {
    const results = searchQuestion(searchTerm);
    setSearchResults(results);
    setShowAll(false);
  };
 
  return (
    <div>
      <Header />
      <h1>dashboard</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search questions"
      />
      <button onClick={handleSearch} style={{ backgroundColor: color_ballet ? color_ballet[0] : 'defaultColor', color: '#fff' }}>Search</button>
      {(showAll ? qAndAs : searchResults).map((qAndA, index) => (
        <div className="card mb-3" key={index}>
          <div className="card-header">
            Question: {qAndA.question}
          </div>
          <div className="card-body">
            <p className="card-text">Answer: {qAndA.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;