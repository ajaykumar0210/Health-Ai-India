import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './WritePrescription.module.css';

const INITIAL_MEDICINE = { name: '', dosage: '', duration: '', frequency: '', instructions: '' };

export default function WritePrescription() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const patient = { name: 'Rahul Verma', age: 28, gender: 'Male', concern: 'Hair Loss' };

  const [diagnosis, setDiagnosis] = useState('');
  const [medicines, setMedicines] = useState([{ ...INITIAL_MEDICINE }]);
  const [advice, setAdvice] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [saved, setSaved] = useState(false);

  const addMedicine = () => setMedicines([...medicines, { ...INITIAL_MEDICINE }]);

  const removeMedicine = (idx) => setMedicines(medicines.filter((_, i) => i !== idx));

  const updateMedicine = (idx, field, value) => {
    setMedicines(medicines.map((m, i) => i === idx ? { ...m, [field]: value } : m));
  };

  const handleSave = () => {
    if (!diagnosis.trim()) { alert('Please enter a diagnosis'); return; }
    // In production, POST to API here
    setSaved(true);
    setTimeout(() => navigate('/appointments'), 2000);
  };

  if (saved) {
    return (
      <div className={styles.successPage}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✅</div>
          <h2>Prescription Saved</h2>
          <p>The prescription has been sent to the patient and saved in their health vault.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>
        <h1 className={styles.title}>Write Prescription</h1>
      </div>

      <div className={styles.patientBanner}>
        <div className={styles.patientAvatar}>{patient.name.charAt(0)}</div>
        <div>
          <div className={styles.patientName}>{patient.name}</div>
          <div className={styles.patientMeta}>{patient.age} years · {patient.gender} · Concern: {patient.concern}</div>
        </div>
        <div className={styles.rxBadge}>Rx</div>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Diagnosis *</label>
        <textarea
          className={styles.textarea}
          placeholder="Enter primary diagnosis..."
          value={diagnosis}
          onChange={e => setDiagnosis(e.target.value)}
          rows={3}
        />
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <label className={styles.label}>Medicines</label>
          <button className={styles.addBtn} onClick={addMedicine}>+ Add Medicine</button>
        </div>

        {medicines.map((med, idx) => (
          <div key={idx} className={styles.medCard}>
            <div className={styles.medHeader}>
              <span className={styles.medNum}>Medicine {idx + 1}</span>
              {medicines.length > 1 && (
                <button className={styles.removeBtn} onClick={() => removeMedicine(idx)}>✕ Remove</button>
              )}
            </div>
            <div className={styles.medGrid}>
              <div className={styles.field}>
                <label>Medicine Name</label>
                <input
                  className={styles.input}
                  placeholder="e.g., Minoxidil 5%"
                  value={med.name}
                  onChange={e => updateMedicine(idx, 'name', e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label>Dosage</label>
                <input
                  className={styles.input}
                  placeholder="e.g., 1mg"
                  value={med.dosage}
                  onChange={e => updateMedicine(idx, 'dosage', e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label>Frequency</label>
                <select
                  className={styles.select}
                  value={med.frequency}
                  onChange={e => updateMedicine(idx, 'frequency', e.target.value)}
                >
                  <option value="">Select...</option>
                  <option>Once daily</option>
                  <option>Twice daily</option>
                  <option>Three times daily</option>
                  <option>At bedtime</option>
                  <option>As needed</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>Duration</label>
                <input
                  className={styles.input}
                  placeholder="e.g., 3 months"
                  value={med.duration}
                  onChange={e => updateMedicine(idx, 'duration', e.target.value)}
                />
              </div>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label>Special Instructions</label>
                <input
                  className={styles.input}
                  placeholder="e.g., Apply to scalp, avoid eyes"
                  value={med.instructions}
                  onChange={e => updateMedicine(idx, 'instructions', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <label className={styles.label}>General Advice</label>
        <textarea
          className={styles.textarea}
          placeholder="Lifestyle advice, dietary recommendations, precautions..."
          value={advice}
          onChange={e => setAdvice(e.target.value)}
          rows={4}
        />
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Follow-up Date (Optional)</label>
        <input
          type="date"
          className={styles.input}
          value={followUp}
          onChange={e => setFollowUp(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div className={styles.footer}>
        <button className={styles.cancelBtn} onClick={() => navigate('/appointments')}>Cancel</button>
        <button className={styles.saveBtn} onClick={handleSave}>Save & Send Prescription</button>
      </div>
    </div>
  );
}
