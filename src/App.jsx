import React, { useState, useEffect } from 'react';
import { analyzeCityBrain } from './logic/CityBrainEngine';
import { 
  AlertTriangle, 
  Info, 
  AlertCircle, 
  MapPin, 
  CloudRain, 
  Car, 
  Newspaper, 
  Navigation,
  BrainCircuit,
  Terminal,
  Clock,
  Tent,
  Zap,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const AnalysisResult = ({ result }) => {
  if (!result) return null;

  const renderIcon = (type) => {
    switch(type) {
      case 'CRITICAL': return <AlertTriangle className="alert-icon" aria-hidden="true" />;
      case 'IMPORTANT': return <AlertCircle className="alert-icon" aria-hidden="true" />;
      default: return <Info className="alert-icon" aria-hidden="true" />;
    }
  };

  return (
    <motion.div 
      className="result-section"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      aria-live="polite"
    >
      <div className="day-badge">
        <Clock size={12} /> {result.day} Analysis
      </div>

      <motion.div 
        className={`alert-message alert-${result.type}`}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {renderIcon(result.type)}
        <span>{result.msg}</span>
      </motion.div>

      {result.recommendation && (
        <motion.div 
          className="recommendation-card"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="rec-header">
            <Zap size={14} color="#f59e0b" /> SMART RECOMMENDATION
          </div>
          <div className="rec-body">
            <Tent size={20} className="rec-icon" />
            <div>
              <div className="rec-place">{result.recommendation}</div>
              <div className="rec-desc">Optimized for Bangalore urban data</div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="json-output">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', opacity: 0.6, fontSize: '0.8rem' }}>
          <Terminal size={14} /> SYSTEM_OUTPUT.JSON
        </div>
        <pre aria-label="System JSON output">
          {`{`}
          <br />
          &nbsp;&nbsp;<span>"type"</span>: <strong>"{result.type}"</strong>,
          <br />
          &nbsp;&nbsp;<span>"msg"</span>: <strong>"{result.msg}"</strong>,
          <br />
          &nbsp;&nbsp;<span>"recommendation"</span>: <strong>"{result.recommendation}"</strong>
          <br />
          {`}`}
        </pre>
      </div>
    </motion.div>
  );
};

function App() {
  const [input, setInput] = useState({
    location: 'Bangalore',
    weather: 'pleasant',
    traffic: 'low',
    news: 'none',
    plan: 'none',
    smartSchedule: true
  });

  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setInput(prev => ({ ...prev, [name]: val }));
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const analysis = analyzeCityBrain(input);
      setResult(analysis);
      setIsAnalyzing(false);
    }, 600);
  };

  return (
    <div className="app-container">
      <header className="header" role="banner">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}
        >
          <BrainCircuit size={40} color="#3b82f6" aria-hidden="true" />
        </motion.div>
        <h1>CITYBRAIN AI</h1>
        <p>URBAN INTELLIGENCE SYSTEM</p>
      </header>

      <motion.main 
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        role="main"
      >
        <div className="schedule-toggle-container">
          <label className="toggle-label">
            <Calendar size={14} /> SMART SCHEDULE
            <input 
              type="checkbox" 
              name="smartSchedule" 
              checked={input.smartSchedule} 
              onChange={handleInputChange} 
            />
            <span className="toggle-slider"></span>
          </label>
          <div className="schedule-info">
            {input.smartSchedule ? "Active: Mon-Fri Office | Sat-Sun Bike" : "Manual Mode Active"}
          </div>
        </div>

        <div className="input-grid">
          <div className="input-group">
            <label htmlFor="location-input"><MapPin size={12} /> Location</label>
            <input id="location-input" name="location" value={input.location} onChange={handleInputChange} />
          </div>
          <div className="input-group">
            <label htmlFor="weather-select"><CloudRain size={12} /> Weather</label>
            <select id="weather-select" name="weather" value={input.weather} onChange={handleInputChange}>
              <option value="pleasant">Pleasant</option>
              <option value="rain">Rain</option>
              <option value="heavy rain">Heavy Rain</option>
              <option value="storm">Storm</option>
              <option value="humid">Humid</option>
              <option value="sunny">Sunny</option>
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="traffic-select"><Car size={12} /> Traffic</label>
            <select id="traffic-select" name="traffic" value={input.traffic} onChange={handleInputChange}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="very high">Very High</option>
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="plan-select"><Navigation size={12} /> Manual Plan</label>
            <select 
              id="plan-select" 
              name="plan" 
              value={input.plan} 
              onChange={handleInputChange}
              disabled={input.smartSchedule}
            >
              <option value="none">None</option>
              <option value="park">Park</option>
              <option value="office">Office</option>
              <option value="gym">Gym</option>
              <option value="travel">Travel</option>
              <option value="bike">Bike Ride</option>
            </select>
          </div>
          <div className="input-group full-width">
            <label htmlFor="news-input"><Newspaper size={12} /> News / Alert Context</label>
            <input id="news-input" name="news" placeholder="e.g. accident, flood warning" value={input.news} onChange={handleInputChange} />
          </div>
          
          <button className="analyze-button" onClick={handleAnalyze} disabled={isAnalyzing}>
            {isAnalyzing ? 'SYNCING DATA...' : 'ANALYZE SYSTEM'}
          </button>
        </div>

        <AnimatePresence>
          <AnalysisResult result={result} />
        </AnimatePresence>

        <div className="google-integration-banner">
          <div className="banner-content">
            <ShieldCheck size={14} color="#10b981" />
            <span>Bangalore Hub | AI Synchronization Active</span>
          </div>
        </div>
      </motion.main>
    </div>
  );
}

export default App;
