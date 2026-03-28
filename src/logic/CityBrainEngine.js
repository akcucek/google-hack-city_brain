export const analyzeCityBrain = (input, dayOverride = null, weatherOverride = null, festivalOverride = null) => {
  const { schedule } = input;
  
  // Day detection
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDayIndex = dayOverride !== null ? dayOverride : new Date().getDay();
  const currentDay = days[currentDayIndex];
  
  const scheduleIndexMap = { 1:0, 2:1, 3:2, 4:3, 5:4, 6:5, 0:6 };
  const currentScheduleIndex = scheduleIndexMap[currentDayIndex];
  const activePlan = schedule ? schedule[currentScheduleIndex] : "office";

  // SENSOR DATA MOCKS (Simulated real-time APIs)
  const detectedWeather = weatherOverride || "Pleasant (24°C)"; // Auto-detected
  const detectedTraffic = "High Density (Festival Influence)"; // Auto-detected
  const detectedFestival = festivalOverride !== undefined ? festivalOverride : (currentDayIndex === 6 ? "Karaga Festival" : null);

  let result = { 
    type: "INFO", 
    msg: "", 
    recommendation: "", 
    day: currentDay,
    detectedWeather,
    detectedTraffic,
    detectedFestival,
    googleMapsSync: true,
    festivalAware: true
  };

  const p = activePlan.toLowerCase();

  // CORNER CASE 1: Safety Hazard (Heavy Rain) overrides Festival/Plan
  if (detectedWeather.toLowerCase().includes("heavy rain") || 
      detectedWeather.toLowerCase().includes("storm")) {
    result.type = "CRITICAL";
    result.msg = "SEVERE WEATHER ALERT: Heavy monsoon rain detected. Flooding risk in core areas.";
    result.recommendation = "STAY INDOORS. Avoid travel regardless of festival or schedule.";
    return result;
  }

  // CORNER CASE 2: No activity (Home)
  if (p === "home") {
    result.type = "INFO";
    result.msg = `User status is HOME for ${currentDay}. Local events will not impact safety.`;
    result.recommendation = "Relax at home; city reports available in dashboard.";
    return result;
  }

  // FESTIVAL LOGIC
  if (detectedFestival) {
    result.type = "IMPORTANT";
    result.msg = `${detectedFestival} celebrations active in Bangalore; road closures in effect.`;
    
    if (p === "bike") {
      result.recommendation = "Avoid Central areas (Avenue Road); route via West Bangalore advised.";
    } else if (p === "office") {
      result.recommendation = "Significant delays expected near Hub; use Metro Green Line.";
    } else {
      result.recommendation = "Local congestion probable near activity route.";
    }
    return result;
  }

  // BASELINE (Normal day)
  if (p === "office") {
    result.msg = `Commute routes to ${currentDay} office are clear.`;
    result.recommendation = "Proceed with normal commute schedule.";
  } else if (p === "bike") {
    result.msg = `Weather is ${detectedWeather}; excellent for riding.`;
    result.recommendation = "Nandi Hills (Sunrise ride)";
  } else {
    result.msg = `System status stable for ${currentDay}.`;
    result.recommendation = "Proceed with scheduled activity.";
  }

  return result;
};
