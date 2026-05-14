import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './VideoConsult.module.css';

export default function VideoConsult() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [callStatus, setCallStatus] = useState('connecting'); // connecting | active | ended
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [timer, setTimer] = useState(0);

  const patient = { name: 'Rahul Verma', age: 28, concern: 'Hair Loss' };

  useEffect(() => {
    // Simulate connection
    const connectTimer = setTimeout(() => setCallStatus('active'), 2000);
    return () => clearTimeout(connectTimer);
  }, []);

  useEffect(() => {
    if (callStatus !== 'active') return;
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const endCall = () => {
    setCallStatus('ended');
    setTimeout(() => navigate(`/prescription/${appointmentId}`), 1000);
  };

  return (
    <div className={styles.page}>
      <div className={styles.videoArea}>
        {/* Remote patient video placeholder */}
        <div className={styles.remoteVideo}>
          <div className={styles.patientAvatar}>{patient.name.charAt(0)}</div>
          {callStatus === 'connecting' && (
            <div className={styles.connecting}>
              <div className={styles.spinner}></div>
              <p>Connecting to {patient.name}...</p>
            </div>
          )}
          {callStatus === 'active' && (
            <div className={styles.patientInfo}>
              <span>{patient.name}, {patient.age}</span>
              <span className={styles.concern}>{patient.concern}</span>
            </div>
          )}
          {callStatus === 'ended' && (
            <div className={styles.ended}>Call Ended</div>
          )}
        </div>

        {/* Local doctor video */}
        <div className={styles.localVideo}>
          {isCameraOff ? (
            <div className={styles.cameraOff}>📷</div>
          ) : (
            <div className={styles.doctorPlaceholder}>DR</div>
          )}
          <span className={styles.youLabel}>You</span>
        </div>

        {/* Call info bar */}
        {callStatus === 'active' && (
          <div className={styles.callBar}>
            <span className={styles.liveIndicator}>● LIVE</span>
            <span className={styles.timer}>{formatTime(timer)}</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <button
          className={`${styles.controlBtn} ${isMuted ? styles.controlActive : ''}`}
          onClick={() => setIsMuted(!isMuted)}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? '🔇' : '🎤'}
          <span>{isMuted ? 'Unmute' : 'Mute'}</span>
        </button>

        <button
          className={`${styles.controlBtn} ${isCameraOff ? styles.controlActive : ''}`}
          onClick={() => setIsCameraOff(!isCameraOff)}
          title={isCameraOff ? 'Start Camera' : 'Stop Camera'}
        >
          {isCameraOff ? '📷' : '📹'}
          <span>{isCameraOff ? 'Camera On' : 'Camera Off'}</span>
        </button>

        <button className={styles.endBtn} onClick={endCall} title="End Call">
          📵
          <span>End Call</span>
        </button>

        <button
          className={styles.controlBtn}
          onClick={() => navigate(`/prescription/${appointmentId}`)}
          title="Write Prescription"
        >
          📋
          <span>Prescription</span>
        </button>
      </div>

      <div className={styles.agoraNote}>
        Note: Integrate Agora.io or Daily.co SDK for real video functionality
      </div>
    </div>
  );
}
