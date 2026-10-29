export const SOCIALS = [
  { id: "x", label: "X", handle: "@alejorrojass", href: "https://x.com/alejorrojass" },
  { id: "linkedin", label: "LinkedIn", handle: "in/alejorrojas", href: "https://www.linkedin.com/in/alejorrojas/" },
  { id: "github", label: "GitHub", handle: "gh/alejorrojas", href: "https://github.com/alejorrojas" },
  { id: "goodreads", label: "Goodreads", handle: "goodreads", href: "https://www.goodreads.com/user/show/143446151" },
  { id: "mail", label: "Email", handle: "hello@alejorrojas.com", href: "mailto:hello@alejorrojas.com" },
] as const;

export type Job = {
  company: string;
  role: string;
  period: string;
  /** Shown in a browser window next to the job; omitted jobs get no window. */
  site?: string;
  /** Full-page screenshot scrolled inside the window, for sites that refuse to be framed. */
  screenshot?: string;
  /** First screen of the landing, shown until the live site is opened. */
  preview?: string;
  logo: { fileId: string; width: number; height: number };
  bullets: string[];
};

export const JOBS: Job[] = [
  {
    company: "SimpleBLE",
    role: "Software Engineer",
    period: "Dec 2025 → now · remote (US)",
    site: "https://simpleble.org",
    screenshot: "/images/sites/simpleble.webp",
    logo: { fileId: "logo-simpleble", width: 180, height: 60 },
    bullets: [
      "extending SimpleBLE's C++ Bluetooth library",
      "(easier to use on every platform)",
      "language bindings for React Native & other ecosystems",
      "reliable, fast & consistent across platforms & runtimes",
      "grew library usage by unlocking MCPs & agentic skills",
      "brought in new deals with React Native partners",
    ],
  },
  {
    company: "The Network",
    role: "Frontend Developer",
    period: "Sep → Oct 2025",
    site: "https://www.thenetwork.com",
    preview: "/images/sites/thenetwork.webp",
    logo: { fileId: "logo-the-network", width: 70, height: 70 },
    bullets: [
      "built Signa, The Network's people search engine",
      "(used by half of Tier 1 VCs & top AI labs)",
      "shipped tracking lists, daily signals & enrichment",
      "turned AI ranked founder data into a clean, fast UI",
      "pixel perfect product, built side by side with design",
    ],
  },
  {
    company: "Rebill (YC W22)",
    role: "Software Engineer",
    period: "Sep 2023 → Jul 2025",
    site: "https://www.rebill.com",
    preview: "/images/sites/rebill.webp",
    logo: { fileId: "logo-rebill", width: 190, height: 41 },
    bullets: [
      "led architecture & launch of the Rebill SDK",
      "(one click checkout, hundreds of tx a day)",
      "PCI compliant AWS infra with automated deploys",
      "(ECS, WAF, VPCs, API Gateways, load balancers)",
      "fast Next.js platform, tuned with SSR / SSG / CSR",
      "docs & dev guides that cut integration time",
      "(occasionally) tweeted about it, obviously",
    ],
  },
  {
    company: "Digital House",
    role: "Content Lead & Frontend Dev",
    period: "Jan 2022 → Sep 2023",
    logo: { fileId: "logo-digital-house", width: 200, height: 37 },
    bullets: [
      "led the Certified Tech Developer curriculum",
      "(w/ Globant & Mercado Libre)",
      "cut class & project development time by 40%",
      "80% success rate on long term learning plans",
      "React / Next.js sites with a 98 SEO score",
      "ran technical interviews",
    ],
  },
];

export type Talk = {
  /** Photo names under /images/photos; two photos share one wide card. */
  photos: string[];
  caption: string;
  sub?: string;
  link?: string;
  /** SVG name under /images/logos, drawn small in the card's corner. */
  logo?: string;
};

export const TALKS: Talk[] = [
  {
    photos: ["campus-party"],
    caption: "Campus Party '22 ↗",
    sub: "solidity workshop, 100+ people",
    link: "https://lnkd.in/p/ddjmiTJK",
  },
  {
    photos: ["cursor-1", "cursor-2"],
    caption: "Cursor meetup ↗",
    logo: "cursor",
    sub: "Brought together 100+ people from the local tech community\nfor a meetup with Juan Rezzio (SWE & QA at Cursor) to learn\nhow the team ensures quality across their products.",
    link: "https://www.linkedin.com/feed/update/urn:li:activity:7407063689159225344/",
  },
  {
    photos: ["v0-1", "v0-2"],
    caption: "v0 meetup ↗",
    logo: "v0",
    sub: "300+ people talking AI & cybersecurity, closed with empanadas",
    link: "https://lnkd.in/p/d_EJHiJ9",
  },
  {
    photos: ["supabase-1", "supabase-2"],
    caption: "Supabase meetup ↗",
    logo: "supabase",
    sub: "Hosted a meetup with 120+ attendees featuring Hiberus’ Head of AI,\nexploring how AI is changing the way we build software.",
    link: "https://x.com/alejorrojass/status/1946032516680307013",
  },
];

export type Book = {
  slug: string;
  /** My Goodreads review page. */
  url: string;
  title: string;
  author: string;
  rating: number;
  review?: string;
};

/** Ratings and reviews from Goodreads, reviews translated to English. */
export const BOOKS_2026: Book[] = [
  { slug: "la-metamorfosis", url: "https://www.goodreads.com/review/show/9024115608", title: "La metamorfosis", author: "Franz Kafka", rating: 4 },
  { slug: "el-volumen-del-tiempo-iii", url: "https://www.goodreads.com/review/show/9001025789", title: "El volumen del tiempo III", author: "Solvej Balle", rating: 4 },
  {
    slug: "el-volumen-del-tiempo-ii", url: "https://www.goodreads.com/review/show/8985494597",
    title: "El volumen del tiempo II",
    author: "Solvej Balle",
    rating: 4,
    review:
      "Compared to how striking and introspective the first one was, I'd give it a 3.5. Still a really good continuation. My biggest gripe with book one was that the protagonist never acted on her free will. Here that side finally gets developed, along with family, relationships and loneliness. And it nails something the first one didn't: the ending leaves you wanting the next one.",
  },
  {
    slug: "el-volumen-del-tiempo-i", url: "https://www.goodreads.com/review/show/8980697098",
    title: "El volumen del tiempo I",
    author: "Solvej Balle",
    rating: 4,
    review:
      "4.5 stars. Found it by accident at a café while killing time before a flight. Read for 3 hours straight and bought it before leaving. One of my best buys this year. The premise is well known (someone stuck in a day that keeps repeating), but the angle is different: loneliness, love, distance and free will. I'll admit this theme fascinates me, so I might be biased. Stealing a line from another review: \"This is absolutely a vibes > plot read.\" Also, the physical book is sooo pretty.",
  },
  {
    slug: "the-stranger", url: "https://www.goodreads.com/review/show/7516587494",
    title: "The Stranger",
    author: "Albert Camus",
    rating: 3,
    review:
      "Amazing and very short. If you ever saw the cover and thought \"I have to read this someday\", go for it. It says a lot in very little. I'd recommend watching some videos on Camus' philosophy of the absurd to tie it all together, not just as a novel but as philosophy told through fiction. Rate 3.5.",
  },
  { slug: "13-99-euros", url: "https://www.goodreads.com/review/show/8706191537", title: "13,99 euros", author: "Frédéric Beigbeder", rating: 2 },
  {
    slug: "el-jugador", url: "https://www.goodreads.com/review/show/8300330707",
    title: "El jugador",
    author: "Fyodor Dostoevsky",
    rating: 2,
    review:
      "Felt long and only picks up in the final stretch. The highlight is how it captures the psychology of a gambling addict, even more knowing Dostoevsky was going through the same thing while writing it. A line ChatGPT gave me while talking about it: \"it reads more like a confession than fiction\".",
  },
  {
    slug: "pequeno-tratado-sobre-la-amistad", url: "https://www.goodreads.com/review/show/8649625066",
    title: "Pequeño tratado sobre la amistad",
    author: "Joana D'Alessio",
    rating: 4,
    review:
      "Rate: 3.5. A very light read. Walking around Buenos Aires with friends brought back a lot of memories. I liked how flowers are part of the story, mixed with history and culture about where they come from. Didn't connect much with the family part, but it's just an epilogue. I'd buy the physical copy just for the illustrations!",
  },
  { slug: "sunrise-on-the-reaping", url: "https://www.goodreads.com/review/show/8523048588", title: "Sunrise on the Reaping", author: "Suzanne Collins", rating: 4 },
  {
    slug: "noches-blancas", url: "https://www.goodreads.com/review/show/8562974920",
    title: "Noches blancas",
    author: "Fyodor Dostoevsky",
    rating: 4,
    review:
      "My first Dostoevsky. A sweet and nostalgic story at the same time. I need more time to write a proper review, but it's a 4/5 without a doubt. Stolen from a review I loved: \"It was a wonderful night, such a night as is only possible when we are young, dear reader.\"",
  },
  {
    slug: "las-cosas-que-perdimos-en-el-fuego", url: "https://www.goodreads.com/review/show/7574149051",
    title: "Las cosas que perdimos en el fuego",
    author: "Mariana Enriquez",
    rating: 3,
    review: "Need time to write the review. Solid 3.5.",
  },
  { slug: "think-punk", url: "https://www.goodreads.com/review/show/7691302229", title: "Think Punk", author: "Ecequiel Barricart", rating: 2, review: "Didn't really connect with it." },
  { slug: "catching-fire", url: "https://www.goodreads.com/review/show/8496277874", title: "Catching Fire", author: "Suzanne Collins", rating: 3 },
  {
    slug: "just-kids", url: "https://www.goodreads.com/review/show/7852158500",
    title: "Just Kids",
    author: "Patti Smith",
    rating: 5,
    review:
      "One of the most beautiful love stories I've ever read. Not just romantic love, but love for art, creation and expression. Their life of having almost nothing, yet somehow enough to keep making art. Told with a beauty only Patti could pull off. I loved looking up the photos, songs and short films they made while I was reading. Highly recommended. The ending crushed me.",
  },
];

export type SideProject = {
  id: string;
  url: string;
  preview: string;
  title: string;
  body: string;
};

export const FUN: SideProject[] = [
  {
    id: "whatsappblur",
    url: "https://whatsappblur.com/",
    preview: "/images/sites/whatsappblur.webp",
    title: "tabu",
    body: "We all have that moment. WhatsApp\nopen on a computer, in public.\nYou feel exposed. Anyone behind\nyou could read along. Tabu blurs\nthe chats until you are the one\nlooking.",
  },
  {
    id: "padel",
    url: "https://padel.alejorrojas.com/",
    preview: "/images/sites/padel.webp",
    title: "birthday padel cup",
    body: "For my birthday I got 24 friends\ntogether for a padel tournament.\nThe software sets the teams, builds\nthe fixture, shows live scores on\nevery match, and makes the next rounds\nfrom those results, with votes for\nplayer of the night and breakthrough\nplayer. The photos got extra care\nbecause there were a lot of them, so\nthat section had to load fast.",
  },
  {
    id: "borges",
    url: "https://jorgeluisborges.org/",
    preview: "/images/sites/borges.webp",
    title: "for borges",
    body: "I love literature. I find it one of the\npurest arts. It only needs a modest\nalphabet (it could be 23 letters and\nsome signs, like ours), someone with\nsomething to say and someone with\nsomething to hear.\nBorges is one of my favorite writers,\nand one of the greatest of all time.",
  },
];

export type Contribution = {
  repo: string;
  stars: string;
  about: string;
  /** GitHub's social preview card for the repo, as a scene file id. */
  preview: string;
  prs: { title: string; url: string }[];
  more?: { label: string; url: string };
};

export const OPEN_SOURCE: Contribution[] = [
  {
    repo: "simpleble/simpleble",
    preview: "repo-simpleble",
    stars: "1.1k",
    about: "cross platform Bluetooth library",
    prs: [
      { title: "the new docs site", url: "https://github.com/simpleble/simpleble/pull/439" },
      { title: "MCP server + Agent Skills", url: "https://github.com/simpleble/simpleble/pull/443" },
      { title: "step by step getting started guide", url: "https://github.com/simpleble/simpleble/pull/456" },
      { title: "fix scan stop on Windows", url: "https://github.com/simpleble/simpleble/pull/449" },
    ],
    more: { label: "+ 13 more", url: "https://github.com/simpleble/simpleble/pulls?q=is%3Apr+author%3Aalejorrojas" },
  },
  {
    repo: "basementstudio/xmcp",
    preview: "repo-xmcp",
    stars: "1.3k",
    about: "framework for building MCP servers",
    prs: [{ title: "dynamic port allocation for HTTP transport", url: "https://github.com/basementstudio/xmcp/pull/97" }],
  },
  {
    repo: "reactjs/react.dev",
    preview: "repo-react.dev",
    stars: "11.8k",
    about: "the React docs",
    prs: [{ title: "fix Server Components link text", url: "https://github.com/reactjs/react.dev/pull/8026" }],
  },
  {
    repo: "microsoft/react-native-macos",
    preview: "repo-react-native-macos",
    stars: "4.4k",
    about: "React Native, but for macOS",
    prs: [{ title: "fix Metro bundler startup docs", url: "https://github.com/microsoft/react-native-macos/pull/2795" }],
  },
];
