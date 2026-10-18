/**
 * Market Timer & Real-time Status Evaluation Utility
 * Evaluates real-time open/close state based on system or simulated clock.
 */

export interface MarketTimeStatus {
  status: 'running' | 'closed' | 'holiday';
  isOpenSessionActive: boolean;
  isCloseSessionActive: boolean;
  canPlay: boolean;
  statusLabel: string;
  statusDetail: string;
  timeRemainingText: string;
  remainingSeconds: number;
}

/**
 * Parses time strings like "09:10 AM", "04:15 PM", "12:05 AM", "12:30 PM"
 * into minutes since midnight (0 - 1439).
 */
export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const cleaned = timeStr.trim().toUpperCase();
  const match = cleaned.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return 0;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const modifier = match[3] || 'AM';

  if (modifier === 'PM' && hours < 12) {
    hours += 12;
  }
  if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
}

/**
 * Formats seconds into "Xh Ym" or "Xm Ys" or "XX:YY:ZZ"
 */
export function formatRemainingSeconds(seconds: number): string {
  if (seconds <= 0) return '00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }
  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }
  return `${secs}s`;
}

/**
 * Evaluates the real-time status of a market given current time
 */
export function evaluateMarketStatus(
  openTimeStr: string,
  closeTimeStr: string,
  currentTime: Date,
  isHoliday: boolean = false
): MarketTimeStatus {
  if (isHoliday) {
    return {
      status: 'holiday',
      isOpenSessionActive: false,
      isCloseSessionActive: false,
      canPlay: false,
      statusLabel: 'Holiday',
      statusDetail: 'Market is closed for holiday today',
      timeRemainingText: 'Closed today',
      remainingSeconds: 0,
    };
  }

  const currentMinutes =
    currentTime.getHours() * 60 +
    currentTime.getMinutes() +
    currentTime.getSeconds() / 60;
  const currentTotalSeconds =
    currentTime.getHours() * 3600 +
    currentTime.getMinutes() * 60 +
    currentTime.getSeconds();

  const openMinutes = parseTimeToMinutes(openTimeStr);
  const closeMinutes = parseTimeToMinutes(closeTimeStr);

  const openSeconds = openMinutes * 60;
  let closeSeconds = closeMinutes * 60;

  const isOvernight = closeMinutes < openMinutes;

  let isRunning = false;
  let isOpenActive = false;
  let isCloseActive = false;
  let remainingSec = 0;

  if (!isOvernight) {
    // Normal same-day market (e.g. 11:30 AM to 12:30 PM, or 04:15 PM to 06:15 PM)
    if (currentMinutes < openMinutes) {
      // Betting is fully running for both Open and Close
      isRunning = true;
      isOpenActive = true;
      isCloseActive = true;
      remainingSec = Math.max(0, Math.floor(closeSeconds - currentTotalSeconds));
    } else if (currentMinutes < closeMinutes) {
      // Open bidding has closed, but Close bidding is still active!
      isRunning = true;
      isOpenActive = false;
      isCloseActive = true;
      remainingSec = Math.max(0, Math.floor(closeSeconds - currentTotalSeconds));
    } else {
      // Both Open and Close have passed
      isRunning = false;
      isOpenActive = false;
      isCloseActive = false;
      remainingSec = 0;
    }
  } else {
    // Overnight market (e.g. 09:40 PM to 12:05 AM next morning)
    // Runs from openMinutes until midnight (1440 min) AND from midnight to closeMinutes
    // If current time is between closeMinutes (00:05) and say 12:00 PM, market is closed for today.
    // If current time is after 12:00 PM up to openMinutes, betting is open for tonight.
    if (currentMinutes >= openMinutes) {
      // In the evening after openTime
      isRunning = true;
      isOpenActive = false;
      isCloseActive = true;
      // Closes next day at closeMinutes (1440 - currentTotalSeconds + closeSeconds)
      remainingSec = Math.max(
        0,
        Math.floor(86400 - currentTotalSeconds + closeSeconds)
      );
    } else if (currentMinutes < closeMinutes) {
      // Past midnight, before closeMinutes
      isRunning = true;
      isOpenActive = false;
      isCloseActive = true;
      remainingSec = Math.max(0, Math.floor(closeSeconds - currentTotalSeconds));
    } else if (currentMinutes >= 12 * 60 && currentMinutes < openMinutes) {
      // Afternoon/evening before open time
      isRunning = true;
      isOpenActive = true;
      isCloseActive = true;
      remainingSec = Math.max(
        0,
        Math.floor(86400 - currentTotalSeconds + closeSeconds)
      );
    } else {
      // Morning past 12:05 AM but before afternoon
      isRunning = false;
      isOpenActive = false;
      isCloseActive = false;
      remainingSec = 0;
    }
  }

  if (isRunning) {
    const timeRemainingStr = formatRemainingSeconds(remainingSec);
    const detailStr = isOpenActive
      ? `Open & Close Bids Live (${timeRemainingStr} left)`
      : `Close Bids Only (${timeRemainingStr} left)`;

    return {
      status: 'running',
      isOpenSessionActive: isOpenActive,
      isCloseSessionActive: isCloseActive,
      canPlay: true,
      statusLabel: 'Bet is Running',
      statusDetail: detailStr,
      timeRemainingText: timeRemainingStr,
      remainingSeconds: remainingSec,
    };
  }

  return {
    status: 'closed',
    isOpenSessionActive: false,
    isCloseSessionActive: false,
    canPlay: false,
    statusLabel: 'Closed for today',
    statusDetail: `Bidding closed at ${closeTimeStr}`,
    timeRemainingText: 'Closed',
    remainingSeconds: 0,
  };
}
