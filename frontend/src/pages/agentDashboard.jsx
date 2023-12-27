import React, {useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";

import {
  createKnowledge,
  getKnowledge,
} from "../features/KnowledgeBase/KnowledgeSlice";

function AgentDashboard() {
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const color_ballet = useSelector((state) => state.branding.activeBranding && state.branding.activeBranding.color_ballet);

  useEffect(() => {
    handleView();
  }, []);
  
  const handleSubmit = () => {
    dispatch(createKnowledge({ question, answer }));
    setQuestion("");
    setAnswer("");
    setShowCreatePopup(false);
  };

  const handleView = () => {
    dispatch(getKnowledge());
    setShowViewPopup(true);
    setShowAll(true);
  };
  const qAndAs = useSelector((state) => state.knowledge);

  const searchQuestion = (searchTerm) => {
    const results = qAndAs.knowledge.filter((qAndA) =>
      qAndA.question.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return results;
  };
  const handleSearch = () => {
    console.log("searchTerm ", searchTerm);
    const results = searchQuestion(searchTerm);
    setSearchResults(results);
    setShowAll(false); 
  };

  return (
    
    <div>
      <Header/>
      <h1>Agent Dashboard</h1>
      <button onClick={() => setShowCreatePopup(true)} style={{ backgroundColor: color_ballet ? color_ballet[0] : 'defaultColor', color: '#fff' }}>Create Q&A</button>
      <button onClick={handleView} style={{ backgroundColor: color_ballet ? color_ballet[1] : 'defaultColor', color: '#fff' }}>View Q&As</button>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for a question"
      />
      <button onClick={handleSearch} style={{ backgroundColor: color_ballet ? color_ballet[2] : 'defaultColor', color: '#fff' }}>Search</button>
      {showCreatePopup && (
        <div>
          <h2>Create Q&A</h2>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Question"
          />
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Answer"
          />
          <button onClick={handleSubmit} style={{ backgroundColor: color_ballet ? color_ballet[0] : 'defaultColor', color: '#fff' }}>Submit</button>
        </div>
      )}
      {console.log("qAndAs.knowledge ", qAndAs)}
      {showAll ? (
      qAndAs.knowledge.length > 0 ? (
        qAndAs.knowledge.map((qAndA, index) => (
          <div key={index}>
            <h3>Question: {qAndA.question}</h3>
            <p>Answer: {qAndA.answer}</p>
          </div>
        ))
      ) : (
        <p>No data available</p>
      )
    ) : searchResults.length > 0 ? (
      searchResults.map((result, index) => (
        <div key={index}>
          <h3>Question: {result.question}</h3>
          <p>Answer: {result.answer}</p>
        </div>
      ))
    ) : (
      <p>No search results</p>
    )}
    </div>
  );
}

export default AgentDashboard;