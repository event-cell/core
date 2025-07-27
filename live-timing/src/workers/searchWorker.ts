// Define the types that match the main component
interface Competitor {
  firstName: string;
  lastName: string;
  number: string;
  vehicle: string;
  class: string;
  classIndex: number;
  times: Array<{
    run: number;
    time: number;
    split1: number;
    split2: number;
    status: number;
  }>;
}

interface EventData {
  date: string;
  eventName: string;
  competitors: Competitor[];
}

interface PersonalBest {
  bestTime: number;
  bestSector1: number;
  bestSector2: number;
  bestSector3: number;
  eventName: string;
  date: string;
  isTwoLap?: boolean;
}

// Handle messages from the main thread
self.onmessage = (e: MessageEvent) => {
  const { events, searchTerm } = e.data;

  if (!searchTerm.trim()) {
    self.postMessage({ 
      filteredEvents: events,
      personalBest: null,
      twoLapPersonalBest: null,
      debugLog: 'No search term provided',
      eventCounts: { singleLap: 0, twoLap: 0 }
    });
    return;
  }

  // Simple direct search approach
  const searchLower = searchTerm.toLowerCase().trim();
  
  // Create debug log
  let debugLog = `Searching for: "${searchLower}"\n\n`;
  
  const filtered = events.map((event: EventData) => {
    const filteredCompetitors = event.competitors.filter((competitor: Competitor) => {
      // Create both name combinations (first last and last first)
      const firstName = competitor.firstName.toLowerCase();
      const lastName = competitor.lastName.toLowerCase();
      const fullName = `${firstName} ${lastName}`;
      const reversedName = `${lastName} ${firstName}`;
      
      // Direct match on either name format
      if (fullName.includes(searchLower) || reversedName.includes(searchLower)) {
        return true;
      }
      
      // Split search term into words for more flexible matching
      const searchWords = searchLower.split(/\s+/);
      
      // If search has multiple words, check if they match in either order
      if (searchWords.length > 1) {
        // Check if all search words are in the full name (in any order)
        const allWordsInFullName = searchWords.every((word: string) => fullName.includes(word));
        
        // Check if all search words are in the reversed name (in any order)
        const allWordsInReversedName = searchWords.every((word: string) => reversedName.includes(word));
        
        return allWordsInFullName || allWordsInReversedName;
      }
      
      // Single word search - check if it's in either first or last name
      return firstName.includes(searchLower) || lastName.includes(searchLower);
    });
    
    return {
      ...event,
      competitors: filteredCompetitors
    };
  }).filter((event: EventData) => event.competitors.length > 0);

  // Add summary to debug log
  debugLog += `\nFound ${filtered.length} events with matching competitors`;

  // Calculate personal bests and event counts
  let bestTime = Infinity;
  let bestSector1 = Infinity;
  let bestSector2 = Infinity;
  let bestSector3 = Infinity;
  let bestEventName = '';
  let bestDate = '';

  let twoLapBestTime = Infinity;
  let twoLapBestSector1 = Infinity;
  let twoLapBestSector2 = Infinity;
  let twoLapBestSector3 = Infinity;
  let twoLapBestEventName = '';
  let twoLapBestDate = '';
  
  // Track event counts
  let singleLapEventCount = 0;
  let twoLapEventCount = 0;

  filtered.forEach((event: EventData) => {
    const isTwoLapEvent = /2\s+lap/i.test(event.eventName) || 
                         /2-lap/i.test(event.eventName) ||
                         /two\s+lap/i.test(event.eventName);
    
    // Increment event count based on type
    if (isTwoLapEvent) {
      twoLapEventCount++;
    } else {
      singleLapEventCount++;
    }
    
    event.competitors.forEach((competitor: Competitor) => {
      competitor.times.forEach((time: { time: number; split1: number; split2: number; status: number }) => {
        if (time.status === 0) {
          if (isTwoLapEvent) {
            if (time.time < twoLapBestTime) {
              twoLapBestTime = time.time;
              twoLapBestEventName = event.eventName;
              twoLapBestDate = event.date;
            }
            
            if (time.split1 < twoLapBestSector1) {
              twoLapBestSector1 = time.split1;
            }
            
            const sector2 = time.split2 - time.split1;
            if (sector2 < twoLapBestSector2) {
              twoLapBestSector2 = sector2;
            }
            
            const sector3 = time.time - time.split2;
            if (sector3 < twoLapBestSector3) {
              twoLapBestSector3 = sector3;
            }
          } else {
            if (time.time < bestTime) {
              bestTime = time.time;
              bestEventName = event.eventName;
              bestDate = event.date;
            }
            
            if (time.split1 < bestSector1) {
              bestSector1 = time.split1;
            }
            
            const sector2 = time.split2 - time.split1;
            if (sector2 < bestSector2) {
              bestSector2 = sector2;
            }
            
            const sector3 = time.time - time.split2;
            if (sector3 < bestSector3) {
              bestSector3 = sector3;
            }
          }
        }
      });
    });
  });

  const personalBest = bestTime !== Infinity ? {
    bestTime,
    bestSector1,
    bestSector2,
    bestSector3,
    eventName: bestEventName,
    date: bestDate
  } : null;

  const twoLapPersonalBest = twoLapBestTime !== Infinity ? {
    bestTime: twoLapBestTime,
    bestSector1: twoLapBestSector1,
    bestSector2: twoLapBestSector2,
    bestSector3: twoLapBestSector3,
    eventName: twoLapBestEventName,
    date: twoLapBestDate,
    isTwoLap: true
  } : null;
  
  // Add event counts to debug log
  debugLog += `\n\nEvent counts: ${singleLapEventCount} single lap events, ${twoLapEventCount} two lap events`;

  self.postMessage({ 
    filteredEvents: filtered,
    personalBest,
    twoLapPersonalBest,
    debugLog,
    eventCounts: {
      singleLap: singleLapEventCount,
      twoLap: twoLapEventCount
    }
  });
}; 