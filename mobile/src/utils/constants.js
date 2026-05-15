// Traya-inspired premium Indian health app palette â€” Navy blue & teal
export const COLORS = {
  // Brand navy blue (CTAs, highlights) â€” like Traya
  primary: '#1E3A5F',
  primaryDark: '#0F2744',
  primaryLight: '#3B82C4',
  primaryBg: '#EBF2FA',

  // Dark navy (hero backgrounds, headers) â€” premium feel
  dark: '#0B1929',
  darkCard: '#122640',
  darkBorder: '#1E3A5F',

  // Cream (main background) â€” like Traya
  background: '#F8FAFB',
  cream: '#F0F5F8',
  creamDark: '#DDE8EF',

  // Greens (success, health indicators)
  success: '#059669',
  successBg: '#D1FAE5',
  successLight: '#6EE7B7',

  // Reds & warnings
  error: '#DC2626',
  errorBg: '#FEE2E2',
  warning: '#D97706',
  warningBg: '#FEF3C7',

  // Purple accent â€” like Traya premium
  purple: '#0D9488',
  purpleBg: '#EDE9FE',
  purpleLight: '#14B8A6',

  // Teal accent
  teal: '#0D9488',
  tealBg: '#CCFBF1',

  // Neutrals
  card: '#FFFFFF',
  white: '#FFFFFF',
  black: '#000000',
  text: '#0B1929',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  textInverse: '#FFFFFF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  shadow: 'rgba(15,14,23,0.10)',
  overlay: 'rgba(15,14,23,0.6)',
};

export const GRADIENTS = {
  // Dark hero â€” splash & onboarding hero
  hero: ['#0B1929', '#122640', '#1E3A5F'],
  // Navy CTA
  orange: ['#1E3A5F', '#3B82C4'],
  // Dark card
  darkCard: ['#122640', '#0B1929'],
  // Traya warm
  warm: ['#F8FAFB', '#E8F0F5'],
  // Green health
  green: ['#059669', '#0D9488'],
  // Teal accent
  purple: ['#0D9488', '#14B8A6'],
  // Sunrise (hair/skin concern header)
  sunrise: ['#1E3A5F', '#2D8EBF', '#5BADDB'],
};

export const FONTS = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semiBold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
};

export const CONCERNS = [
  { id: 'hair', label: 'Hair Fall', labelHi: 'à¤¬à¤¾à¤² à¤à¤¡à¤¼à¤¨à¤¾', icon: 'ðŸ’‡', color: '#FF6B6B' },
  { id: 'skin', label: 'Skin Problems', labelHi: 'à¤¤à¥à¤µà¤šà¤¾ à¤¸à¤®à¤¸à¥à¤¯à¤¾', icon: 'ðŸ§´', color: '#4ECDC4' },
  { id: 'sexual', label: 'Sexual Health', labelHi: 'à¤¯à¥Œà¤¨ à¤¸à¥à¤µà¤¾à¤¸à¥à¤¥à¥à¤¯', icon: 'â¤ï¸', color: '#FF8B94' },
  { id: 'diabetes', label: 'Diabetes', labelHi: 'à¤®à¤§à¥à¤®à¥‡à¤¹', icon: 'ðŸ©¸', color: '#A8E6CF' },
  { id: 'stress', label: 'Mental Stress', labelHi: 'à¤®à¤¾à¤¨à¤¸à¤¿à¤• à¤¤à¤¨à¤¾à¤µ', icon: 'ðŸ§ ', color: '#DDA0DD' },
  { id: 'weight', label: 'Weight Issues', labelHi: 'à¤µà¤œà¤¨ à¤•à¥€ à¤¸à¤®à¤¸à¥à¤¯à¤¾', icon: 'âš–ï¸', color: '#FFD93D' },
];

export const PLANS = [
  {
    id: 'freemium',
    name: 'Freemium',
    nameHi: 'à¤®à¥à¤«à¥à¤¤',
    price: 0,
    period: 'forever',
    color: '#6C757D',
    features: ['3 AI questions/day', 'Basic health tips', 'Doctor @ â‚¹199 extra'],
    consultPrice: 199,
  },
  {
    id: 'rural',
    name: 'Rural Basic',
    nameHi: 'à¤—à¥à¤°à¤¾à¤®à¥€à¤£ à¤¬à¥‡à¤¸à¤¿à¤•',
    price: 149,
    period: 'month',
    color: '#28A745',
    features: ['Unlimited AI chat', 'Hindi support', 'Doctor @ â‚¹199 extra'],
    consultPrice: 199,
    tag: 'Rural Friendly',
  },
  {
    id: 'standard',
    name: 'Standard',
    nameHi: 'à¤¸à¥à¤Ÿà¥ˆà¤‚à¤¡à¤°à¥à¤¡',
    price: 299,
    period: 'month',
    color: '#1A73E8',
    features: ['Unlimited AI', 'Progress tracking', 'Dashboard', 'Doctor @ â‚¹199 extra'],
    consultPrice: 199,
    tag: 'Popular',
  },
  {
    id: 'care',
    name: 'Care',
    nameHi: 'à¤•à¥‡à¤¯à¤°',
    price: 599,
    period: 'month',
    color: '#FF6D00',
    features: ['All Standard features', '1 free consultation', 'Extra @ â‚¹149'],
    consultPrice: 149,
    tag: 'Best Value',
  },
  {
    id: 'multicare',
    name: 'Multi-Care',
    nameHi: 'à¤®à¤²à¥à¤Ÿà¥€-à¤•à¥‡à¤¯à¤°',
    price: 999,
    period: 'month',
    color: '#6F42C1',
    features: ['All concerns covered', '2 free consultations', 'Priority support', 'Extra @ â‚¹149'],
    consultPrice: 149,
  },
  {
    id: 'annual',
    name: 'Annual Care',
    nameHi: 'à¤µà¤¾à¤°à¥à¤·à¤¿à¤• à¤•à¥‡à¤¯à¤°',
    price: 2499,
    period: 'year',
    color: '#DC3545',
    features: ['Standard features', 'Best annual value', 'Doctor @ â‚¹149'],
    consultPrice: 149,
    tag: 'Save 30%',
  },
];

export const API_BASE_URL = 'https://api.healthai-india.com'; // Replace with actual API URL
