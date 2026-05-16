// Health AI India - Light + Gold theme
export const COLORS = {
  // Primary accent - Dark Yellow / Gold (10%)
  primary: '#D4A017',
  primaryDark: '#B8860B',
  primaryLight: '#E6B422',
  primaryBg: '#FEF9E7',

  // Light backgrounds
  dark: '#111827',
  darkCard: '#F3F4F6',
  darkBorder: '#E5E7EB',

  // Background - White
  background: '#FFFFFF',
  cream: '#F9FAFB',
  creamDark: '#F3F4F6',

  // Greens (success, health indicators)
  success: '#10B981',
  successBg: '#D1FAE5',
  successLight: '#6EE7B7',

  // Reds & warnings
  error: '#EF4444',
  errorBg: '#FEE2E2',
  warning: '#F59E0B',
  warningBg: '#FEF3C7',

  // Gold accent
  accent: '#D4A017',
  accentLight: '#E6B422',
  accentDark: '#B8860B',

  // Teal kept for variety
  teal: '#D4A017',
  tealBg: '#FEF9E7',

  // Neutrals
  card: '#F3F4F6',
  white: '#FFFFFF',
  black: '#111827',
  text: '#111827',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  textInverse: '#FFFFFF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  shadow: 'rgba(0,0,0,0.08)',
  overlay: 'rgba(0,0,0,0.5)',
};

export const GRADIENTS = {
  // Hero - light elegant
  hero: ['#FFFFFF', '#F9FAFB', '#FFFFFF'],
  // Gold CTA
  orange: ['#D4A017', '#B8860B'],
  // Light card
  darkCard: ['#F3F4F6', '#FFFFFF'],
  // Warm light
  warm: ['#FFFFFF', '#FEF9E7'],
  // Green health
  green: ['#10B981', '#059669'],
  // Gold accent
  purple: ['#D4A017', '#B8860B'],
  // Sunrise
  sunrise: ['#FFFFFF', '#FEF9E7', '#F3F4F6'],
};

export const FONTS = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semiBold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
};

export const CONCERNS = [
  { id: 'hair', label: 'Hair Fall', labelHi: '\u092C\u093E\u0932 \u091D\u0921\u093C\u0928\u093E', icon: '\uD83D\uDC87', color: '#D4A017' },
  { id: 'skin', label: 'Skin Problems', labelHi: '\u0924\u094D\u0935\u091A\u093E \u0938\u092E\u0938\u094D\u092F\u093E', icon: '\uD83E\uDDF4', color: '#E6B422' },
  { id: 'sexual', label: 'Sexual Health', labelHi: '\u092F\u094C\u0928 \u0938\u094D\u0935\u093E\u0938\u094D\u0925\u094D\u092F', icon: '\u2764\uFE0F', color: '#EF4444' },
  { id: 'diabetes', label: 'Diabetes', labelHi: '\u092E\u0927\u0941\u092E\u0947\u0939', icon: '\uD83E\uDE78', color: '#10B981' },
  { id: 'stress', label: 'Mental Stress', labelHi: '\u092E\u093E\u0928\u0938\u093F\u0915 \u0924\u0928\u093E\u0935', icon: '\uD83E\uDDE0', color: '#6B7280' },
  { id: 'weight', label: 'Weight Issues', labelHi: '\u0935\u091C\u0928 \u0915\u0940 \u0938\u092E\u0938\u094D\u092F\u093E', icon: '\u2696\uFE0F', color: '#F59E0B' },
];

export const PLANS = [
  {
    id: 'freemium',
    name: 'Freemium',
    nameHi: '\u092E\u0941\u092B\u094D\u0924',
    price: 0,
    period: 'forever',
    color: '#6B7280',
    features: ['3 AI questions/day', 'Basic health tips', 'Doctor @ \u20B9199 extra'],
    consultPrice: 199,
  },
  {
    id: 'rural',
    name: 'Rural Basic',
    nameHi: '\u0917\u094D\u0930\u093E\u092E\u0940\u0923 \u092C\u0947\u0938\u093F\u0915',
    price: 149,
    period: 'month',
    color: '#10B981',
    features: ['Unlimited AI chat', 'Hindi support', 'Doctor @ \u20B9199 extra'],
    consultPrice: 199,
    tag: 'Rural Friendly',
  },
  {
    id: 'standard',
    name: 'Standard',
    nameHi: '\u0938\u094D\u091F\u0948\u0902\u0921\u0930\u094D\u0921',
    price: 299,
    period: 'month',
    color: '#D4A017',
    features: ['Unlimited AI', 'Progress tracking', 'Dashboard', 'Doctor @ \u20B9199 extra'],
    consultPrice: 199,
    tag: 'Popular',
  },
  {
    id: 'care',
    name: 'Care',
    nameHi: '\u0915\u0947\u092F\u0930',
    price: 599,
    period: 'month',
    color: '#E6B422',
    features: ['All Standard features', '1 free consultation', 'Extra @ \u20B9149'],
    consultPrice: 149,
    tag: 'Best Value',
  },
  {
    id: 'multicare',
    name: 'Multi-Care',
    nameHi: '\u092E\u0932\u094D\u091F\u0940-\u0915\u0947\u092F\u0930',
    price: 999,
    period: 'month',
    color: '#B8860B',
    features: ['All concerns covered', '2 free consultations', 'Priority support', 'Extra @ \u20B9149'],
    consultPrice: 149,
  },
  {
    id: 'annual',
    name: 'Annual Care',
    nameHi: '\u0935\u093E\u0930\u094D\u0937\u093F\u0915 \u0915\u0947\u092F\u0930',
    price: 2499,
    period: 'year',
    color: '#D4A017',
    features: ['Standard features', 'Best annual value', 'Doctor @ \u20B9149'],
    consultPrice: 149,
    tag: 'Save 30%',
  },
];

export const API_BASE_URL = 'https://api.healthai-india.com';
