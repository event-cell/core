export interface EventData {
  eventDirectories: string[];
  metadataMap: Record<string, any>;
}

declare global {
  interface Window {
    __INITIAL_EVENT_DATA__?: EventData;
  }
}

export {}; 