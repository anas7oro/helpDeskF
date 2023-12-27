import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getBackups,
  restoreBackup,
  restoreLatestBackup,
  createBackup,
} from "../features/backup/backupSlice";
import {toast} from 'react-toastify'
import Spinner from "../components/Spinner";
import {
  isError as errorSelector,
  isSuccess as successSelector,
  message as messageSelector,
} from "../features/backup/backupSlice";
import Header from "../components/Header";

const styles = {
  backups: {
    width: "80%",
    margin: "auto",
    padding: "20px",
  },
  title: {
    textAlign: "center",
    color: "#333",
  },
  button: {
    display: "block",
    margin: "10px auto",
    padding: "10px 20px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  backupList: {
    listStyleType: "none",
    padding: "0",
  },
  backupItem: {
    margin: "10px 0",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
  backupName: {
    fontWeight: "bold",
  },
  backupTime: {
    color: "#777",
  },
};

function Backups() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const backups = useSelector((state) => state.backups.backups);
  const [loading, setLoading] = useState(false);
  const isError = useSelector(errorSelector);
  const isSuccess = useSelector(successSelector);
  const message = useSelector(messageSelector);

  const handleGoBack = () => {
    navigate(-1);
  };
  useEffect(() => {
    setLoading(true);
    dispatch(getBackups()).finally(() => setLoading(false));
  }, []); 
  useEffect(() => {
    if (isError && message) {
      toast.error(message);
    }
    if (isSuccess && message) {
      toast.success(message);
    }
}, [isError, isSuccess, message]);

  const handleRestore = (backup) => {
    setLoading(true);
    dispatch(restoreBackup(backup))
      .then((message) => {
        toast.success(message);
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => setLoading(false));
  };

  const handleRestoreLatest = () => {
    setLoading(true);
    dispatch(restoreLatestBackup())
      .then((message) => {
        toast.success(message);
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => setLoading(false));
  };

  const handleCreateBackup = () => {
    setLoading(true);
    dispatch(createBackup())
      .then((message) => {
        toast.success(message);
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => setLoading(false));
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div style={styles.backups}>
      <Header />
      <h1 style={styles.title}>Backups</h1>
      <button style={styles.button} onClick={handleGoBack}>
        Go Back
      </button>
      <button style={styles.button} onClick={handleRestoreLatest}>
        Restore Latest Backup
      </button>
      <button style={styles.button} onClick={handleCreateBackup}>
        Create Backup
      </button>
      <ul style={styles.backupList}>
        {[...backups]
          .sort((a, b) => new Date(b.time) - new Date(a.time))
          .map((backup, index) => (
            <li key={index} style={styles.backupItem}>
              <p style={styles.backupName}>{backup.name}</p>
              <p style={styles.backupTime}>{backup.time}</p>
              <button
                style={styles.button}
                onClick={() => handleRestore(backup)}
              >
                Restore This Backup
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Backups;
