import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const TimelineOverlay = ({ isOpen, onClose, timelineData }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="timeline-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="overlay-content">
          <button className="close-button" onClick={onClose}>
            &times;
          </button>

          <h2 className="overlay-title">Chapter Timeline</h2>

          <div className="timeline-grid">
            {timelineData.map((entry) => (
              <div className="timeline-card" key={entry.year}>
                <h3 className="year-text">{entry.year}</h3>
                {/* If you want to list classes or PM/PD, do so here. */}
                {/* For example: */}
                {entry.classes.map((c, i) => (
                  <div className="class-info" key={i}>
                    <h4>{c.className}</h4>
                    <p>
                      <strong>PM:</strong> {c.PM}<br/>
                      <strong>PD:</strong> {c.PD}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TimelineOverlay;
