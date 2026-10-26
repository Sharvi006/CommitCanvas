const shapes = {
  GitBranch: <><circle cx="6" cy="3" r="2" /><circle cx="6" cy="21" r="2" /><circle cx="18" cy="6" r="2" /><path d="M6 5v14M18 8a6 6 0 0 1-6 6H8" /><path d="M14 6h-2a6 6 0 0 0-6 6" /></>,
  Sprout: <><path d="M12 22v-9" /><path d="M12 13C6 13 4 9 4 5c5 0 8 2 8 8" /><path d="M12 16c0-5 3-8 8-8 0 5-3 8-8 8" /></>,
  History: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5M12 7v5l3 2" /></>,
  Rocket: <><path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.8-.9.8-2.2-.1-3.1a2.1 2.1 0 0 0-2.9.1Z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.5A13 13 0 0 1 22 3c0 4.3-1.5 8.5-5.5 11A22 22 0 0 1 12 15Z" /><path d="M9 12H4s.5-3 3-4c1.5-.6 3 0 3 0M12 15v5s3-.5 4-3c.6-1.5 0-3 0-3" /><circle cx="16" cy="8" r="1" /></>,
  ArrowRight: <><path d="M5 12h14M12 5l7 7-7 7" /></>,
  CheckCircle2: <><circle cx="12" cy="12" r="10" /><path d="m8 12 2.5 2.5L16 9" /></>,
  Search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>,
  X: <><path d="m18 6-12 12M6 6l12 12" /></>,
  BookOpen: <><path d="M12 7v14" /><path d="M3 18V5a1 1 0 0 1 1-1h3a5 5 0 0 1 5 5 5 5 0 0 1 5-5h3a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-4a4 4 0 0 0-4 2 4 4 0 0 0-4-2H4a1 1 0 0 1-1-1Z" /></>,
  Terminal: <><path d="m4 17 6-6-6-6M12 19h8" /></>,
  LockKeyhole: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 1 1 8 0v3" /><circle cx="12" cy="15" r="1" /></>,
  Award: <><circle cx="12" cy="8" r="6" /><path d="m8.2 13-1 8 4.8-2.5 4.8 2.5-1-8" /></>,
  RotateCcw: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></>,
};

function createIcon(name) {
  return function Icon({ size = 18, strokeWidth = 2, ...props }) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        {shapes[name]}
      </svg>
    );
  };
}

export const GitBranch = createIcon('GitBranch');
export const Sprout = createIcon('Sprout');
export const History = createIcon('History');
export const Rocket = createIcon('Rocket');
export const ArrowRight = createIcon('ArrowRight');
export const CheckCircle2 = createIcon('CheckCircle2');
export const Search = createIcon('Search');
export const X = createIcon('X');
export const BookOpen = createIcon('BookOpen');
export const Terminal = createIcon('Terminal');
export const LockKeyhole = createIcon('LockKeyhole');
export const Award = createIcon('Award');
export const RotateCcw = createIcon('RotateCcw');
