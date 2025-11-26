import React, { useRef, useEffect, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

const BarcodeScanner = ({ onScan, onClose }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [codeReader, setCodeReader] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [requestingCamera, setRequestingCamera] = useState(false);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    setCodeReader(reader);

    // Get available video input devices
    reader.listVideoInputDevices()
      .then(videoInputDevices => {
        if (videoInputDevices.length > 0) {
          setDevices(videoInputDevices);
          setSelectedDevice(videoInputDevices[0].deviceId);
        } else {
          setError('No camera devices found. Please connect a camera.');
        }
      })
      .catch(err => {
        console.error('Error listing devices:', err);
        setError('Error accessing camera devices.');
      });

    return () => {
      if (reader) {
        reader.reset();
      }
    };
  }, []);

  useEffect(() => {
    if (!codeReader || !selectedDevice || !scanning) {
      return;
    }

    // Capture the video element reference to avoid ESLint warning in cleanup
    const videoElement = videoRef.current;
    if (!videoElement) {
      return;
    }

    setError(null);
    
    // Small delay to ensure video element is fully rendered
    const timer = setTimeout(() => {
      if (!videoElement) {
        setError('Video element not available. Please try again.');
        setScanning(false);
        return;
      }

      try {
        // Start scanning with the video element
        codeReader.decodeFromVideoDevice(
          selectedDevice || undefined, 
          videoElement, 
          (result, err) => {
            if (result) {
              const code = result.getText();
              console.log('Barcode scanned:', code);
              
              // Stop scanning
              codeReader.reset();
              setScanning(false);
              
              // Call the callback with the scanned code
              if (onScan) {
                onScan(code);
              }
            }
            
            if (err && !(err.name === 'NotFoundException')) {
              // This is normal - just means no barcode found yet
              // Only log actual errors
              if (err.message && !err.message.includes('No MultiFormat Readers')) {
                console.debug('Scanning...', err.message);
              }
            }
          }
        ).catch(err => {
          console.error('Error starting scanner:', err);
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setError('Camera permission denied. Please allow camera access in your browser settings.');
          } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            setError('No camera found. Please connect a camera and refresh.');
          } else {
            setError(`Failed to start camera: ${err.message || 'Unknown error'}. Please check permissions and try again.`);
          }
          setScanning(false);
        });
      } catch (err) {
        console.error('Exception starting scanner:', err);
        setError(`Failed to start camera: ${err.message || 'Unknown error'}`);
        setScanning(false);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (codeReader) {
        try {
          codeReader.reset();
        } catch (e) {
          console.warn('Error resetting scanner:', e);
        }
      }
      // Stop all video tracks using captured videoElement reference
      if (videoElement && videoElement.srcObject) {
        try {
          const stream = videoElement.srcObject;
          const tracks = stream.getTracks();
          tracks.forEach(track => {
            track.stop();
          });
          videoElement.srcObject = null;
        } catch (e) {
          console.warn('Error stopping video tracks:', e);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeReader, selectedDevice, scanning]);

  const handleStart = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Camera API is not supported in this browser. Please try Chrome, Edge, or Firefox.');
      return;
    }

    if (!codeReader) {
      setError('Scanner is still initializing. Please wait a moment and try again.');
      return;
    }

    setRequestingCamera(true);
    setError(null);

    try {
      const constraints = selectedDevice
        ? { video: { deviceId: { exact: selectedDevice } } }
        : { video: true };

      // Request permission explicitly to trigger browser prompt
      const tempStream = await navigator.mediaDevices.getUserMedia(constraints);
      tempStream.getTracks().forEach(track => track.stop());

      // Refresh device list after permission grant (labels become available)
      try {
        const videoInputDevices = await codeReader.listVideoInputDevices();
        if (videoInputDevices.length > 0) {
          setDevices(videoInputDevices);
          if (!selectedDevice) {
            setSelectedDevice(videoInputDevices[0].deviceId);
          }
        }
      } catch (listErr) {
        console.warn('Unable to refresh camera list:', listErr);
      }

      setScanning(true);
    } catch (err) {
      console.error('Camera permission error:', err);

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera permission was denied. Please allow access in your browser settings and try again.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No camera device was found. Connect a camera or enable your built-in webcam.');
      } else if (err.name === 'NotReadableError') {
        setError('The camera is already in use by another application. Close other apps and retry.');
      } else {
        setError(`Unable to access the camera: ${err.message || 'Unknown error'}.`);
      }
    } finally {
      setRequestingCamera(false);
    }
  };

  const handleStop = () => {
    if (codeReader) {
      codeReader.reset();
    }
    setScanning(false);
  };

  const handleClose = () => {
    handleStop();
    if (onClose) {
      onClose();
    }
  };

  const handleDeviceChange = (e) => {
    const deviceId = e.target.value;
    setSelectedDevice(deviceId);
    handleStop();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div 
      className="modal fade show" 
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} 
      tabIndex="-1"
      onClick={handleBackdropClick}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className="fas fa-barcode me-2"></i>
              Barcode Scanner
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={handleClose}></button>
          </div>
          <div className="modal-body p-4">
            <div className="alert alert-info d-flex align-items-start gap-2" role="alert">
              <i className="fas fa-lightbulb mt-1"></i>
              <div>
                You can point the webcam at a barcode printed on packaging or displayed on another screen
                (like your phone). Increase the screen brightness and keep the code steady for the best scan.
              </div>
            </div>
            {error && (
              <div className="alert alert-danger" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}

            {devices.length > 1 && (
              <div className="mb-3">
                <label htmlFor="camera-select" className="form-label fw-semibold">
                  <i className="fas fa-video me-2"></i>
                  Select Camera:
                </label>
                <select
                  id="camera-select"
                  className="form-select"
                  value={selectedDevice || ''}
                  onChange={handleDeviceChange}
                  disabled={scanning}
                >
                  {devices.map(device => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Camera ${device.deviceId.substring(0, 8)}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="text-center mb-3">
              <div
                ref={containerRef}
                style={{
                  width: '100%',
                  maxWidth: '600px',
                  height: '400px',
                  backgroundColor: '#000',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  margin: '0 auto',
                  position: 'relative'
                }}
              >
                <video
                  ref={videoRef}
                  id="barcode-scanner-video"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'scaleX(-1)', // Mirror the video for better UX
                    display: scanning ? 'block' : 'none'
                  }}
                  autoPlay
                  playsInline
                  muted
                />
                {!scanning && (
                  <div 
                    className="d-flex align-items-center justify-content-center text-white"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%'
                    }}
                  >
                    <div className="text-center">
                      <i className="fas fa-camera fa-3x mb-3"></i>
                      <p>Click "Start Scanner" to begin scanning</p>
                    </div>
                  </div>
                )}
              </div>
              {scanning && (
                <p className="text-muted mt-2">
                  <i className="fas fa-circle text-success blink me-2"></i>
                  Point the camera at a barcode
                </p>
              )}
            </div>

            <div className="d-flex gap-2 justify-content-center">
              {!scanning ? (
                <button
                  type="button"
                  className="btn btn-success btn-lg"
                  onClick={handleStart}
                  disabled={devices.length === 0 || requestingCamera}
                >
                  {requestingCamera ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Preparing Camera...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-play me-2"></i>
                      Start Scanner
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-warning btn-lg"
                  onClick={handleStop}
                >
                  <i className="fas fa-stop me-2"></i>
                  Stop Scanner
                </button>
              )}
              <button
                type="button"
                className="btn btn-secondary btn-lg"
                onClick={handleClose}
              >
                <i className="fas fa-times me-2"></i>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .blink {
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        #video-container {
          position: relative;
        }
        #video-container::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60%;
          height: 60%;
          border: 2px solid #28a745;
          border-radius: 8px;
          box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.3);
          pointer-events: none;
          z-index: 1;
        }
      `}</style>
    </div>
  );
};

export default BarcodeScanner;

