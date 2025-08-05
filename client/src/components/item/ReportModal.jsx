/**
 * Report Modal Component
 * Modal for reporting item issues
 */

import React from 'react';

const ReportModal = ({ 
  isOpen,
  item,
  reportReasons,
  reportReason,
  reportDescription,
  reportMessage,
  reportLoading,
  onReasonChange,
  onDescriptionChange,
  onSubmit,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '30px',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{ marginBottom: '25px' }}>
          <h2 style={{
            color: '#333',
            marginBottom: '10px',
            fontSize: '1.5rem',
            fontWeight: '600'
          }}>
            🚩 Report Item
          </h2>
          <p style={{ color: '#666', margin: 0 }}>
            Help us improve by reporting issues with "{item.itemName}"
          </p>
        </div>

        {/* Report Message */}
        {reportMessage.text && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '6px',
            marginBottom: '20px',
            backgroundColor: reportMessage.type === 'success' ? '#d4edda' : '#f8d7da',
            border: `1px solid ${reportMessage.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
            color: reportMessage.type === 'success' ? '#155724' : '#721c24'
          }}>
            {reportMessage.text}
          </div>
        )}

        {/* Reason Selection */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '10px',
            fontWeight: '600',
            color: '#333'
          }}>
            Reason for Report *
          </label>
          <select
            value={reportReason}
            onChange={(e) => onReasonChange(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e1e5e9',
              borderRadius: '6px',
              fontSize: '16px',
              outline: 'none',
              backgroundColor: '#f0f8ff',
              color: '#333'
            }}
          >
            <option value="">Select a reason...</option>
            {reportReasons.map(reason => (
              <option key={reason.value} value={reason.value}>
                {reason.label}
              </option>
            ))}
          </select>
        </div>

        {/* Optional Description */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{
            display: 'block',
            marginBottom: '10px',
            fontWeight: '600',
            color: '#333'
          }}>
            Additional Details (Optional)
          </label>
          <textarea
            value={reportDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Provide any additional details about the issue..."
            maxLength={500}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e1e5e9',
              borderRadius: '6px',
              fontSize: '16px',
              outline: 'none',
              backgroundColor: '#f0f8ff',
              color: '#333',
              minHeight: '80px',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
          <div style={{
            textAlign: 'right',
            fontSize: '12px',
            color: '#666',
            marginTop: '5px'
          }}>
            {reportDescription.length}/500 characters
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onCancel}
            disabled={reportLoading}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: reportLoading ? 'not-allowed' : 'pointer',
              opacity: reportLoading ? 0.6 : 1
            }}
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={reportLoading || !reportReason}
            style={{
              padding: '12px 24px',
              backgroundColor: reportLoading || !reportReason ? '#6c757d' : '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: reportLoading || !reportReason ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {reportLoading && (
              <span style={{
                display: 'inline-block',
                width: '16px',
                height: '16px',
                border: '2px solid #ffffff',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></span>
            )}
            {reportLoading ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
