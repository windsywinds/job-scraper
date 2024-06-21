
const SYDNEY: string[] = [
    'Sydney',
    'SYDNEY',
    'SYD'
];
const MELBOURNE: string[] = [
    'Melbourne',
    'MELBOURNE',
    'MELB'
];

const BRISBANE: string[] = [
    'Brisbane',
    'BRISBANE',
    'BNE'
];
const GOLD_COAST: string[] = [
    'Gold Coast',
    'GOLD COAST',
    'OOL'
];
const PERTH: string[] = [
    'Perth',
    'PERTH',
    'PER'
];
const ADELAIDE: string[] = [
    'Adelaide',
    'ADELAIDE',
    'ADL'
];
const CANBERRA: string[] = [
    'Canberra',
    'CANBERRA',
    'CBR'
];
const OTHER_AUS: string[] = [
    'Other - Australia',
    'OTHER - AUS',
    'OTHER - AU'
];
const AUSTRALIA: string[][] = [
    SYDNEY,
    MELBOURNE,
    BRISBANE,
    GOLD_COAST,
    PERTH,
    ADELAIDE,
    CANBERRA,
    OTHER_AUS,
];

const AUCKLAND: string[] = [
    'Auckland',
    'AUCKLAND',
    'AKL'
  ];
  const HAMILTON: string[] = [
    'Hamilton',
    'HAMILTON'
  ];
  const TAURANGA: string[] = [
    'Tauranga',
    'TAURANGA'
  ];
  const GISBOURNE: string[] = [
    'Gisbourne',
    'GISBOURNE'
  ];
  const NAPIER: string[] = [
    'Napier',
    'NAPIER'
  ];
  const PALMERSTON_NORTH: string[] = [
    'Palmerston North',
    'PALMERSTON NORTH'
  ];
  const WELLINGTON: string[] = [
    'Wellington',
    'WELLINGTON',
    'WLG'
  ];
  const NELSON: string[] = [
    'Nelson',
    'NELSON'
  ];
  const CHRISTCHURCH: string[] = [
    'Christchurch',
    'CHRISTCHURCH',
    'CHCH'
  ];
  const QUEENSTOWN: string[] = [
    'Queenstown',
    'QUEENSTOWN',
    'QTOWN'
  ];
  const DUNEDIN: string[] = [
    'Dunedin',
    'DUNEDIN'
  ];
  const OTHER_NZ: string[] = [
    'Other - New Zealand',
    'OTHER - NEW ZEALAND',
    'OTHER - NZ',
    'UNKNOWN_NZ'
  ];

  const NEW_ZEALAND: string[][] = [
    AUCKLAND,
    HAMILTON,
    TAURANGA,
    GISBOURNE,
    NAPIER,
    PALMERSTON_NORTH,
    WELLINGTON,
    NELSON,
    CHRISTCHURCH,
    QUEENSTOWN,
    DUNEDIN,
    OTHER_NZ
  ];
  
const LONDON: string[] = [
    'London',
    'LONDON'
];
const MANCHESTER: string[] = [
    'Manchester',
    'MANCHESTER'
];
const LIVERPOOL: string[] = [
    'Liverpool',
    'LIVERPOOL'
];
const BRISTOL: string[] = [
    'Bristol',
    'BRISTOL'
];
const GLASGOW: string[] = [
    'Glasgow',
    'GLASGOW'
];
const EDINBURGH: string[] = [
    'Edinburgh',
    'EDINBURGH'
];
const CARDIFF: string[] = [
    'Cardiff',
    'CARDIFF'
];
const BELFAST: string[] = [
    'Belfast',
    'BELFAST'
];
const OTHER_UK: string[] = [
    'Other - UK',
    'OTHER - UK',
    'UNKNOWN_UK'
]
const UNITED_KINGDOM: string[][] = [
    LONDON,
    MANCHESTER,
    LIVERPOOL,
    BRISTOL,
    GLASGOW,
    EDINBURGH,
    CARDIFF,
    BELFAST,
    OTHER_UK
]

const WORKSTYLE_REMOTE: string[] = [
    "Remote",
    "REMOTE",
    "OFF-SITE",
    "OFF SITE",
    "FROM HOME",
    "INTERNATIONAL",
    "ABROAD"
]
const WORKSTYLE_OFFICE: string[] = [
    "Office",
    "OFFICE",
    "ON SITE",
    "ON-SITE"
]
const WORKSTYLE_HYBRID: string[] = [
    "Hybrid",
    "HYBRID",
    "FLEXIBLE"
]
const WORKSTYLES: string[][] = [
    WORKSTYLE_REMOTE,
    WORKSTYLE_OFFICE,
    WORKSTYLE_HYBRID
]

const LOCATIONS: string[][] = [
    ...WORKSTYLE_REMOTE.map(value => [value]),
    ...AUSTRALIA,
    ...UNITED_KINGDOM,
    ...NEW_ZEALAND,
]

const SEN_GRAD: string[] = [
    "Entry-level/graduate",
    "ENTRY"
]
const SEN_JUNIOR: string[] = [
    "Junior (1-2 years)",
    "1-2 YEARS"
]
const SEN_MID: string[] = [
    "Mid-level (3-4 years)",
    "INTERMEDIATE",
    "3-4 years"
]
const SEN_SENIOR: string[] = [
    "Senior (5-8 years)",
    "SENIOR",
    '5+ YEARS'
]
const SEN_EXPERT: string[] =[
    "Expert & Leadership (9+ years)",
    "EXPERT",
    '9+ YEARS'
]
const SENIORITYS: string[][] = [
    SEN_GRAD,
    SEN_JUNIOR,
    SEN_MID,
    SEN_SENIOR,
    SEN_EXPERT
]



const WORKTYPE_FULLTIME: string[] = [
    "Full-time",
    "FULL-TIME PERMANENT",
    "FULL-TIME",
    "FULL TIME",
    "FULLTIME",
    "FULL",
    "FT"
]
const WORKTYPE_PARTTIME: string[] = [
    "Part-time",
    "PART-TIME",
    "PART TIME",
    "PARTTIME",
    "PART",
    "PT",
]
const WORKTYPE_CONTRACT: string[] = [
    "Contract",
    "CONTRACT",
    "CONTRACTUAL"
]
const WORKTYPE_FRACTIONAL: string[] = [
    "Fractional",
    "FRACTIONAL"
]
const WORKTYPES: string[][] = [
    WORKTYPE_FULLTIME,
    WORKTYPE_PARTTIME,
    WORKTYPE_CONTRACT,
    WORKTYPE_FRACTIONAL
]

const TIMING_ASAP: string[] = [
    'As soon as possible'
]
const TIMING_SIX_MONTHS: string[] = [
    '3-6 months',
]
const TIMING_ONE_YEAR: string[] = [
    'Within the next year'
]
const TIMING_CURIOUS: string[] = [
    'Just curious'
]
const TIMING: string[][] = [
    TIMING_ASAP,
    TIMING_SIX_MONTHS,
    TIMING_ONE_YEAR,
    TIMING_CURIOUS
]

const AREAS_SOFTWARE: string[] = [
    'Software Engineering',
    'SOFTWARE ENGINEERING',
    'SOFTWARE',
    'DEVELOPER',
    'DEV',
    'JAVASCRIPT',
    'PROGRAMMER',
    'NODE.JS',
    'PYTHON'
]
const AREAS_DATA: string[] = [
    'Data',
    'DATA',
    'DATA ANALYST',
    'ANALYST',
]
const AREAS_ENGINEERING: string[] = [
    'Other Engineering',
    'ENGINEER',
    'ENGINEERING'
]
const AREAS_PRODUCT: string[] = [
    'Product',
    'PRODUCT',
    'PRODUCTS'
]
const AREAS_DESIGN: string[] = [
    'Design',
    'DESIGN',
    'UX/UI',
    'UX',
    'UI',
    'UX DESIGN',
    'UI DESIGN',
    'DESIGNER'
]
const AREAS_OPS: string[] = [
    'Operations & Strategy',
    'OPERATIONS & STRATEGY',
    'OPERATIONS',
    'OPS',
    'STRATEGY'
]
const AREAS_SALES: string[] = [
    'Sales & Account Management',
    'SALES & ACCOUNT MANAGEMENT',
    'SALES',
    'ACCOUNTS',
    'ACCOUNT MANAGER'
]
const AREAS_MARKETING: string[] = [
    'Marketing',
    'MARKETING'
]
const AREAS_HR: string[] = [
    'People, HR, Recruitment',
    'PEOPLE, HR, RECRUITMENT',
    'PEOPLE',
    'HR',
    'HUMAN RESOURCES',
    'RESOURCES',
    'RECRUITMENT'
]
const AREAS_FIN_LEGAL: string[] = [
    'Finance, Legal & Compliance',
    'FINANCE, LEGAL & COMPLIANCE',
    'FINANCE',
    'LEGAL',
    'COMPLIANCE'
]
const BUSINESS_AREAS: string[][] = [
    AREAS_SOFTWARE,
    AREAS_DATA,
    AREAS_ENGINEERING,
    AREAS_PRODUCT,
    AREAS_DESIGN,
    AREAS_OPS,
    AREAS_SALES,
    AREAS_MARKETING,
    AREAS_HR,
    AREAS_FIN_LEGAL
]

export { WORKTYPES, WORKSTYLES, SENIORITYS, LOCATIONS, TIMING, BUSINESS_AREAS }



