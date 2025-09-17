import { useState, useRef, useEffect } from 'react';
import { Camera, X, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { toast } from 'sonner@2.0.3';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (data: string) => void;
}

export function QRScanner({ isOpen, onClose, onScanSuccess }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Get user's current location
  const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    return distance * 1000; // Convert to meters
  };

  // Initialize camera
  const initializeCamera = async () => {
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported by this browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPermission(true);
      setIsScanning(true);
      toast.success('Camera access granted!');
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      setHasPermission(false);
      
      // Provide specific error messages based on error type
      if (error.name === 'NotAllowedError') {
        toast.error('Camera permission denied. Please allow camera access in your browser settings and try again.');
      } else if (error.name === 'NotFoundError') {
        toast.error('No camera found on this device.');
      } else if (error.name === 'NotReadableError') {
        toast.error('Camera is already in use by another application.');
      } else if (error.name === 'OverconstrainedError') {
        toast.error('Camera constraints not supported by your device.');
      } else {
        toast.error('Unable to access camera. Please check your browser permissions.');
      }
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  // Simulate QR code scanning (in a real app, you'd use a QR code library)
  const simulateQRScan = () => {
    // This is a simulation - in real implementation, you'd use a library like qr-scanner
    const mockQRData = JSON.stringify({
      classId: 'CS-A',
      className: 'Data Structures',
      facultyLocation: { lat: 40.7128, lng: -74.0060 }, // Mock faculty location
      timestamp: Date.now(),
      expiresAt: Date.now() + (15 * 60 * 1000) // Expires in 15 minutes
    });

    handleQRCodeDetected(mockQRData);
  };

  // Handle QR code detection
  const handleQRCodeDetected = async (qrData: string) => {
    try {
      const qrCodeData = JSON.parse(qrData);
      
      // Check if QR code has expired
      if (Date.now() > qrCodeData.expiresAt) {
        toast.error('QR code has expired. Please ask faculty to generate a new one.');
        return;
      }

      // Check if location verification is enabled for this QR code
      if (qrCodeData.locationVerificationEnabled !== false) {
        // Get current user location if not already available
        let currentLocation = userLocation;
        if (!currentLocation) {
          try {
            currentLocation = await getCurrentLocation();
            setUserLocation(currentLocation);
          } catch (error) {
            // If location fails, allow attendance but show warning
            toast.warning('Location unavailable - attendance marked without location verification.');
            toast.success(`Attendance marked for ${qrCodeData.className}!`);
            onScanSuccess(qrData);
            onClose();
            return;
          }
        }

        // Only verify location if faculty location is valid
        if (qrCodeData.facultyLocation.lat !== 0 || qrCodeData.facultyLocation.lng !== 0) {
          // Calculate distance from faculty location
          const distance = calculateDistance(
            currentLocation.lat,
            currentLocation.lng,
            qrCodeData.facultyLocation.lat,
            qrCodeData.facultyLocation.lng
          );

          // Check if student is within 50 meters of faculty
          const maxDistance = 50; // meters
          if (distance > maxDistance) {
            toast.error(`You must be within ${maxDistance}m of the classroom. Current distance: ${Math.round(distance)}m`);
            return;
          }
        }
      } else {
        // Location verification is disabled for this QR code
        toast.info('Location verification disabled for this QR code.');
      }

      // Mark attendance
      toast.success(`Attendance marked for ${qrCodeData.className}!`);
      onScanSuccess(qrData);
      onClose();
      
    } catch (error) {
      console.error('Error processing QR code:', error);
      toast.error('Invalid QR code. Please try again.');
    }
  };

  // Effect to initialize camera when modal opens
  useEffect(() => {
    if (isOpen) {
      // Check if we're in a secure context (HTTPS)
      if (!window.isSecureContext) {
        toast.warning('Camera and location services require a secure connection (HTTPS). Some features may not work.');
      }

      getCurrentLocation()
        .then(location => {
          setUserLocation(location);
          toast.success('Location access granted!');
        })
        .catch((error) => {
          console.error('Geolocation error:', error);
          if (error.code === 1) {
            toast.error('Location permission denied. Please enable location services in your browser settings.');
          } else if (error.code === 2) {
            toast.error('Location unavailable. Please check your GPS settings.');
          } else if (error.code === 3) {
            toast.error('Location request timed out. Please try again.');
          } else {
            toast.error('Unable to get your location. QR scanning may still work but location verification will be skipped.');
          }
        });
    }
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-white">Scan QR Code</DialogTitle>
          <DialogDescription className="text-slate-300">
            Position the QR code within the frame to mark your attendance
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Location Status */}
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <MapPin className="w-4 h-4" />
            {userLocation ? (
              <span className="text-green-400">Location enabled</span>
            ) : (
              <span className="text-yellow-400">Getting location...</span>
            )}
          </div>

          {/* Camera View */}
          <div className="relative">
            {!isScanning ? (
              <div className="bg-slate-800 rounded-lg p-8 text-center">
                <Camera className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <p className="text-slate-300 mb-4">Camera access required</p>
                <Button onClick={initializeCamera} className="bg-blue-600 hover:bg-blue-700">
                  Enable Camera
                </Button>
              </div>
            ) : (
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 bg-black rounded-lg object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Scanning overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-2 border-white border-dashed w-48 h-48 rounded-lg flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="w-8 h-8 border-2 border-white rounded animate-pulse mx-auto mb-2" />
                      <p className="text-sm">Position QR code here</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="flex-1 border-slate-600 text-white hover:bg-slate-800"
            >
              Cancel
            </Button>
            {isScanning && (
              <Button 
                onClick={simulateQRScan}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Test Scan
              </Button>
            )}
          </div>

          {/* Instructions */}
          {!hasPermission && (
            <div className="bg-blue-900/20 border border-blue-600/20 rounded-lg p-3">
              <p className="text-blue-400 text-sm font-medium mb-2">📱 How to enable camera:</p>
              <ul className="text-blue-300 text-xs space-y-1">
                <li>• Look for a camera icon in your browser's address bar</li>
                <li>• Click it and select "Always allow" for this site</li>
                <li>• Or go to browser Settings → Privacy → Camera</li>
                <li>• Refresh the page after changing permissions</li>
              </ul>
            </div>
          )}

          {/* Permission denied message */}
          {hasPermission === false && (
            <div className="bg-red-900/20 border border-red-600/20 rounded-lg p-3 space-y-2">
              <p className="text-red-400 text-sm font-medium">Camera Access Required</p>
              <p className="text-red-300 text-xs">
                To scan QR codes, please:
              </p>
              <ol className="text-red-300 text-xs space-y-1 ml-4">
                <li>1. Click the camera icon in your browser's address bar</li>
                <li>2. Select "Allow" for camera access</li>
                <li>3. Refresh the page and try again</li>
              </ol>
              <p className="text-red-300 text-xs">
                Or try using the "Simulate Scan" button below for testing.
              </p>
            </div>
          )}

          {/* Location warning */}
          {!userLocation && (
            <div className="bg-yellow-900/20 border border-yellow-600/20 rounded-lg p-3">
              <p className="text-yellow-400 text-sm">
                ⚠️ Location services disabled. Attendance will be marked without location verification.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}