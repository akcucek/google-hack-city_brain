export const analyzeCityBrain = (input, dayOverride = null) => {
  const { location, weather, traffic, news, plan, smartSchedule } = input;
  
  // Day detection
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDayIndex = dayOverride !== null ? dayOverride : new Date().getDay();
  const currentDay = days[currentDayIndex];
  const isWeekend = currentDayIndex === 0 || currentDayIndex === 6;

  // Active Plan determination
  let activePlan = plan;
  if (smartSchedule) {
    activePlan = isWeekend ? "bike" : "office";
  }

  // Normalize inputs
  const l = location?.trim() || "Whitefield";
  const w = weather?.toLowerCase() || "";
  const t = traffic?.toLowerCase() || "";
  const n = news?.toLowerCase().trim() || "";
  const p = activePlan?.toLowerCase() || "";

  const has = (text, ...keywords) => keywords.some(k => text.includes(k));

  let result = { type: "INFO", msg: "", recommendation: "", day: currentDay };

  // CRITICAL: Safety issues
  if (has(n, "flood", "danger", "emergency", "fire", "danger") || 
      has(w, "heavy rain", "storm") || 
      has(n, "accident") || 
      t === "very high") {
    
    result.type = "CRITICAL";
    if (has(n, "flood") || has(w, "heavy rain")) {
      result.msg = "Flood risk, avoid travel and stay indoors";
      result.recommendation = "Stay Home (Safety Priority)";
    } else {
      result.msg = "Severe disruption detected, avoid travel";
      result.recommendation = "Postpone all travel";
    }
    return result;
  }

  // Schedule Specific Logic
  if (p === "office") {
    if (t === "high" || t === "medium") {
      result.type = "IMPORTANT";
      result.msg = `Heavy traffic to ${l}, consider delaying office travel`;
      result.recommendation = "WFH or manyata/ecity route check";
    } else {
      result.type = "INFO";
      result.msg = `Light traffic to ${l}, good time for office arrival`;
      result.recommendation = `${l} Office Hub`;
    }
  } else if (p === "bike") {
    if (has(w, "rain", "storm")) {
      result.type = "IMPORTANT";
      result.msg = "Rain predicted, postpone your weekend bike ride";
      result.recommendation = "Indiranagar (Cafe hopping)";
    } else if (has(w, "pleasant", "clear", "sunny")) {
      result.type = "INFO";
      result.msg = `Great ${currentDay} weather, perfect for your bike ride`;
      result.recommendation = "Nandi Hills (Sunrise Ride)";
    } else {
      result.type = "INFO";
      result.msg = `Cloudy ${currentDay}, good for a short bike ride`;
      result.recommendation = "Cubbon Park / Lalbagh";
    }
  } else {
    // Default Fallback
    result.msg = `Status normal for ${currentDay}, proceed with ${p || 'the day'}`;
    result.recommendation = "Cubbon Park (Outdoor leisure)";
  }

  return result;
};
