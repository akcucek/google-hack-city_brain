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
  Calendar,
  Mail,
  MessageCircle,
  Map as MapIcon,
  Activity,
  Music,
  ChevronDown,
  ChevronUp,
  Cpu,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// Sub-component: 7-Day Planner
const WeeklyPlanner = ({ schedule, onScheduleChange }) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div className="weekly-planner">
      <div className="planner-header">
        <Calendar size={14} /> 7-DAY SMART SCHEDULE
      </div>
      <div className="planner-grid">
        {days.map((day, idx) => (
          <div key={day} className="day-slot">
            <span className="day-label">{day}</span>
            <select 
              value={schedule[idx]} 
              onChange={(e) => onScheduleChange(idx, e.target.value)}
              className="day-select"
            >
              <option value="office">Office</option>
              <option value="bike">Bike</option>
              <option value="home">Home</option>
              <option value="gym">Gym</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

// Sub-component: Mock Google Map
const MockTrafficMap = ({ imagePath }) => {
  return (
    <div className="traffic-map-card">
      <div className="map-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapIcon size={14} color="#3b82f6" /> 
          <span>LIVE TRAFFIC & FESTIVAL DENSITY (GOOGLE MAPS API)</span>
        </div>
        <div className="live-badge">● LIVE ANALYTICS</div>
      </div>
      <div className="map-viewport">
        <img src={imagePath} alt="Bangalore Traffic Situation" className="traffic-image" />
        <div className="map-overlay">
          <div className="overlay-stat">
            <Music size={12} color="#f59e0b" />
            EVENT: <span>KARAGA FESTIVAL (HIGH DENSITY)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const AnalysisResult = ({ result, deliverySettings }) => {
  const [showJson, setShowJson] = useState(false);
  if (!result) return null;

  const getAlertColor = (type) => {
    switch(type) {
      case 'CRITICAL': return '#ef4444';
      case 'IMPORTANT': return '#f59e0b';
      default: return '#3b82f6';
    }
  };

  return (
    <motion.div 
      className="result-dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Header Info */}
      <div className="dashboard-header">
        <div className="scan-timestamp">
          <Globe size={12} color="#10b981" /> SCAN_LOCAL: {result.day.toUpperCase()} | GPS_SYNC_ACTIVE
        </div>
        <div className="alert-badge" style={{ backgroundColor: `${getAlertColor(result.type)}20`, color: getAlertColor(result.type), border: `1px solid ${getAlertColor(result.type)}40` }}>
          {result.type} PRIORITY
        </div>
      </div>

      {/* Main Alert Card */}
      <div className="main-alert-card" style={{ borderLeft: `4px solid ${getAlertColor(result.type)}` }}>
        <div className="alert-content">
          <Zap size={24} color={getAlertColor(result.type)} />
          <div className="alert-text-group">
            <div className="alert-msg">{result.msg}</div>
            <div className="alert-recommendation"><strong>RECOMMENDED:</strong> {result.recommendation}</div>
          </div>
        </div>
      </div>

      {/* Urban Vitals Grid */}
      <div className="vitals-grid">
        <div className="vital-item">
          <div className="vital-label"><CloudRain size={12} /> WEATHER</div>
          <div className="vital-value">{result.detectedWeather}</div>
        </div>
        <div className="vital-item">
          <div className="vital-label"><Activity size={12} /> TRAFFIC</div>
          <div className="vital-value">{result.detectedTraffic}</div>
        </div>
        <div className="vital-item">
          <div className="vital-label"><Music size={12} /> EVENT</div>
          <div className="vital-value">{result.detectedFestival || 'None Detect'}</div>
        </div>
        <div className="vital-item">
          <div className="vital-label"><ShieldCheck size={12} /> SECURITY</div>
          <div className="vital-value" style={{ color: '#10b981' }}>VERIFIED</div>
        </div>
      </div>

      {/* Delivery Confirmation */}
      {(deliverySettings.email || deliverySettings.whatsapp) && (
        <div className="delivery-confirmation">
          <div className="delivery-title">NOTIFICATION BROADCAST:</div>
          <div className="delivery-badges">
            {deliverySettings.whatsapp && <div className="del-badge"><MessageCircle size={10} /> WhatsApp Sent</div>}
            {deliverySettings.email && <div className="del-badge"><Mail size={10} /> Email Dispatched</div>}
          </div>
        </div>
      )}

      {/* System Toggle (JSON HIDDEN BY DEFAULT) */}
      <div className="json-controls">
        <button onClick={() => setShowJson(!showJson)} className="toggle-json-btn">
          {showJson ? <ChevronUp size={14} /> : <ChevronDown size={14} />} 
          {showJson ? "HIDE SYSTEM LOGS" : "VIEW SYSTEM TRACE (JSON)"}
        </button>
      </div>

      {showJson && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="json-trace">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </motion.div>
      )}
    </motion.div>
  );
};

function App() {
  const [schedule, setSchedule] = useState(["office", "office", "office", "office", "office", "bike", "bike"]);
  const [delivery, setDelivery] = useState({ email: true, whatsapp: true });
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleScheduleChange = (idx, value) => {
    const newSchedule = [...schedule];
    newSchedule[idx] = value;
    setSchedule(newSchedule);
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const analysis = analyzeCityBrain({ schedule });
      setResult(analysis);
      setIsAnalyzing(false);
    }, 1200);
  };

  const mapImagePath = "/Users/abhishek/.gemini/antigravity/brain/922ce8d9-2bd8-41fc-9799-d0293497d668/bangalore_traffic_mock_map_1774687288026.png";

  return (
    <div className="app-container">
      <header className="header">
        <div className="sync-line">
          <Cpu size={14} color="#10b981" /> <span>CORE_SYNC: ACTIVE</span>
        </div>
        <h1>CITYBRAIN AI</h1>
        <p className="sub-header">URBAN INTELLIGENCE | BANGALORE PRO</p>
      </header>

      <motion.main className="glass-card">
        <div className="dashboard-meta">
          <div className="delivery-settings">
            <span className="settings-label">BROADCAST:</span>
            <button className={`delivery-btn ${delivery.whatsapp ? 'active' : ''}`} onClick={() => setDelivery(p => ({ ...p, whatsapp: !p.whatsapp }))}>
              <MessageCircle size={14} />
            </button>
            <button className={`delivery-btn ${delivery.email ? 'active' : ''}`} onClick={() => setDelivery(p => ({ ...p, email: !p.email }))}>
              <Mail size={14} />
            </button>
          </div>
          <div className="city-label">
            <MapPin size={14} color="#3b82f6" /> <span>BANGALORE, IN</span>
          </div>
        </div>

        <WeeklyPlanner schedule={schedule} onScheduleChange={handleScheduleChange} />

        <MockTrafficMap imagePath={mapImagePath} />

        <div className="system-callout">
          <div className="pulse-indicator"></div>
          <span>Autonomous Scan Ready for {schedule.filter(s => s !== 'home').length} activities</span>
        </div>

        <button className="analyze-button" onClick={handleAnalyze} disabled={isAnalyzing}>
          {isAnalyzing ? "PERFORMING MULTI-AGENT SCAN..." : "ANALYZE URBAN PULSE"}
        </button>

        <AnimatePresence>
          <AnalysisResult result={result} deliverySettings={delivery} />
        </AnimatePresence>
      </motion.main>

      <footer className="footer-status">
        SYSTEM_ID: CB-560001 | LOCAL_SERVER: ON_STATION
      </footer>
    </div>
  );
}

export default App;
