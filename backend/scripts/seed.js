/**
 * Firestore Seed Script — Health AI India
 * Run: node scripts/seed.js
 * Seeds test doctors into Firestore
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

const db = admin.firestore();

const doctors = [
  {
    name: 'Dr. Priya Sharma',
    speciality: 'Dermatologist',
    qualification: 'MBBS, MD (Dermatology)',
    experience: 8,
    languages: ['Hindi', 'English'],
    fee: 499,
    rating: 4.8,
    totalConsultations: 1240,
    about: 'Specialist in skin, hair and nail disorders. Expert in treating hair fall, acne, eczema and psoriasis.',
    concerns: ['hair_fall', 'skin'],
    isActive: true,
    isVerified: true,
    availableSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
    imageUrl: 'https://i.pravatar.cc/150?img=47',
    city: 'Mumbai',
  },
  {
    name: 'Dr. Rajesh Kumar',
    speciality: 'General Physician',
    qualification: 'MBBS, MD (Medicine)',
    experience: 12,
    languages: ['Hindi', 'English', 'Punjabi'],
    fee: 299,
    rating: 4.6,
    totalConsultations: 3200,
    about: 'General physician with expertise in diabetes management, weight issues and lifestyle diseases.',
    concerns: ['diabetes', 'weight', 'stress'],
    isActive: true,
    isVerified: true,
    availableSlots: ['08:00', '09:00', '10:00', '17:00', '18:00', '19:00'],
    imageUrl: 'https://i.pravatar.cc/150?img=51',
    city: 'Delhi',
  },
  {
    name: 'Dr. Anita Verma',
    speciality: 'Psychiatrist',
    qualification: 'MBBS, MD (Psychiatry)',
    experience: 10,
    languages: ['Hindi', 'English'],
    fee: 699,
    rating: 4.9,
    totalConsultations: 890,
    about: 'Mental health specialist focused on anxiety, depression, stress management and sleep disorders.',
    concerns: ['stress', 'mental_health'],
    isActive: true,
    isVerified: true,
    availableSlots: ['10:00', '11:00', '12:00', '15:00', '16:00'],
    imageUrl: 'https://i.pravatar.cc/150?img=45',
    city: 'Bangalore',
  },
  {
    name: 'Dr. Vikram Singh',
    speciality: 'Andrologist',
    qualification: 'MBBS, MS (Urology), MCh (Andrology)',
    experience: 15,
    languages: ['Hindi', 'English'],
    fee: 899,
    rating: 4.7,
    totalConsultations: 650,
    about: 'Expert in male sexual health, fertility and hormonal issues. Confidential consultations.',
    concerns: ['sexual_health'],
    isActive: true,
    isVerified: true,
    availableSlots: ['11:00', '12:00', '14:00', '15:00'],
    imageUrl: 'https://i.pravatar.cc/150?img=52',
    city: 'Hyderabad',
  },
  {
    name: 'Dr. Meera Patel',
    speciality: 'Endocrinologist',
    qualification: 'MBBS, MD, DM (Endocrinology)',
    experience: 9,
    languages: ['Hindi', 'English', 'Gujarati'],
    fee: 599,
    rating: 4.8,
    totalConsultations: 1100,
    about: 'Specialist in diabetes, thyroid disorders, hormonal imbalances and metabolic conditions.',
    concerns: ['diabetes', 'weight'],
    isActive: true,
    isVerified: true,
    availableSlots: ['09:00', '10:00', '14:00', '15:00', '16:00'],
    imageUrl: 'https://i.pravatar.cc/150?img=44',
    city: 'Ahmedabad',
  },
];

async function seed() {
  console.log('🌱 Seeding Firestore...\n');

  // Seed doctors
  const batch = db.batch();
  for (const doctor of doctors) {
    const ref = db.collection('doctors').doc();
    batch.set(ref, {
      ...doctor,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`✅ Added doctor: ${doctor.name} (${doctor.speciality})`);
  }
  await batch.commit();

  console.log(`\n✅ Seeded ${doctors.length} doctors successfully!`);
  console.log('🔗 View in Firebase Console: https://console.firebase.google.com/project/health-ai-india/firestore');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
