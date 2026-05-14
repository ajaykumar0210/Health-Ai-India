import { useParams, useNavigate } from 'react-router-dom';
import styles from './PatientHistory.module.css';

const MOCK_PATIENT = {
  id: 'pat_001',
  name: 'Rahul Verma',
  age: 28,
  gender: 'Male',
  phone: '+91 98765 43210',
  language: 'Hindi',
  plan: 'Standard Care',
  joinedDate: '2024-03-15',
  concerns: ['Hair Loss', 'Stress'],
};

const MOCK_CONSULTATIONS = [
  {
    id: 'c001',
    date: '2025-05-10',
    doctor: 'Dr. Priya Sharma',
    diagnosis: 'Androgenic Alopecia Stage II',
    medicines: ['Minoxidil 5%', 'Finasteride 1mg'],
    notes: 'Patient showing improvement. Continue current regimen.',
  },
  {
    id: 'c002',
    date: '2025-04-05',
    doctor: 'Dr. Priya Sharma',
    diagnosis: 'Seborrheic Dermatitis with Hair Loss',
    medicines: ['Ketoconazole Shampoo', 'Biotin 5000mcg'],
    notes: 'Prescribed antifungal treatment. Review in 4 weeks.',
  },
  {
    id: 'c003',
    date: '2025-03-01',
    doctor: 'Dr. Arjun Mehta',
    diagnosis: 'Telogen Effluvium (Stress-induced)',
    medicines: ['Biotin', 'Vitamin D3'],
    notes: 'Advised stress management. Diet correction needed.',
  },
];

const MOCK_PROGRESS = [
  { date: '2025-05', hairScore: 4, stressScore: 6 },
  { date: '2025-04', hairScore: 5, stressScore: 5 },
  { date: '2025-03', hairScore: 3, stressScore: 7 },
];

export default function PatientHistory() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const patient = MOCK_PATIENT;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>
        <h1 className={styles.title}>Patient History</h1>
      </div>

      <div className={styles.profileCard}>
        <div className={styles.avatar}>{patient.name.charAt(0)}</div>
        <div className={styles.profileInfo}>
          <h2 className={styles.patientName}>{patient.name}</h2>
          <div className={styles.metaRow}>
            <span>{patient.age} yrs · {patient.gender}</span>
            <span>📱 {patient.phone}</span>
            <span>🌐 {patient.language}</span>
          </div>
          <div className={styles.metaRow}>
            <span className={styles.planBadge}>💎 {patient.plan}</span>
            <span className={styles.dateText}>Joined: {new Date(patient.joinedDate).toLocaleDateString('en-IN')}</span>
          </div>
        </div>
        <div className={styles.concerns}>
          {patient.concerns.map(c => (
            <span key={c} className={styles.concernTag}>{c}</span>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Progress Overview</h3>
        <div className={styles.progressGrid}>
          {MOCK_PROGRESS.map(p => (
            <div key={p.date} className={styles.progressCard}>
              <div className={styles.progressMonth}>{p.date}</div>
              {patient.concerns.map(concern => {
                const score = concern === 'Hair Loss' ? p.hairScore : p.stressScore;
                return (
                  <div key={concern}>
                    <div className={styles.progressLabel}>{concern}</div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${score * 10}%` }}></div>
                    </div>
                    <div className={styles.progressScore}>{score}/10</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Past Consultations ({MOCK_CONSULTATIONS.length})</h3>
        <div className={styles.consultList}>
          {MOCK_CONSULTATIONS.map(c => (
            <div key={c.id} className={styles.consultCard}>
              <div className={styles.consultDate}>{new Date(c.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              <div className={styles.consultDoctor}>👨‍⚕️ {c.doctor}</div>
              <div className={styles.diagnosis}>
                <strong>Diagnosis:</strong> {c.diagnosis}
              </div>
              <div className={styles.medicines}>
                <strong>Medicines:</strong> {c.medicines.join(', ')}
              </div>
              <div className={styles.notes}>💬 {c.notes}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
