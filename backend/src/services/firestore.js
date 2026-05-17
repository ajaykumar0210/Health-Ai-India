const { admin } = require('../middleware/auth');
const db = admin.firestore();

module.exports = {
  // Users
  async getUser(uid) {
    const doc = await db.collection('users').doc(uid).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },

  async saveUser(uid, data) {
    await db.collection('users').doc(uid).set(data, { merge: true });
  },

  // Doctors
  async getDoctors(filters = {}) {
    let ref = db.collection('doctors').where('isActive', '==', true);
    if (filters.speciality) ref = ref.where('speciality', '==', filters.speciality);
    const snap = await ref.get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  async getDoctor(doctorId) {
    const doc = await db.collection('doctors').doc(doctorId).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },

  // Consultations
  async createConsultation(data) {
    const ref = await db.collection('consultations').add({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return ref.id;
  },

  async getUserConsultations(uid) {
    const snap = await db.collection('consultations')
      .where('userId', '==', uid)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  async getConsultation(consultationId) {
    const doc = await db.collection('consultations').doc(consultationId).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },

  async updateConsultation(consultationId, data) {
    await db.collection('consultations').doc(consultationId).update(data);
  },

  // Subscriptions
  async saveSubscription(uid, data) {
    await db.collection('subscriptions').doc(uid).set({
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  },

  async getSubscription(uid) {
    const doc = await db.collection('subscriptions').doc(uid).get();
    return doc.exists ? doc.data() : null;
  },

  // Progress logs
  async saveProgressLog(uid, data) {
    const ref = await db.collection('progress_logs').add({
      userId: uid,
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return ref.id;
  },

  async getProgressLogs(uid, limit = 30) {
    const snap = await db.collection('progress_logs')
      .where('userId', '==', uid)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },
};
