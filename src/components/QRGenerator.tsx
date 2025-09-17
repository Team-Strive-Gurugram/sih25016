import { useState, useEffect } from 'react';
import { QrCode, Download, MapPin, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';

interface QRGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QRGenerator({ isOpen, onClose }: QRGeneratorProps) {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [facultyLocation, setFacultyLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [expirationTime, setExpirationTime] = useState<Date | null>(null);

  const classes = [
    { id: 'CS-A', name: 'CS-A Data Structures', subject: 'Data Structures' },
    { id: 'CS-B', name: 'CS-B Algorithm Analysis', subject: 'Algorithm Analysis' },
    { id: 'IT-A', name: 'IT-A Database Systems', subject: 'Database Systems' }
  ];

  // Get faculty's current location
  const getFacultyLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const error = new Error('Geolocation is not supported by this browser.');
        (error as any).code = 0;
        reject(error);
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
          // Geolocation error codes:
          // 1: PERMISSION_DENIED
          // 2: POSITION_UNAVAILABLE  
          // 3: TIMEOUT
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000, // Increased timeout
          maximumAge: 60000 // Allow cached location up to 1 minute old
        }
      );
    });
  };

  // Generate QR code data
  const generateQRCode = async () => {
    if (!selectedClass) {
      toast.error('Please select a class first');
      return;
    }

    let location = null;
    let locationWarning = false;

    try {
      // Try to get faculty location
      location = await getFacultyLocation();
      setFacultyLocation(location);
      toast.success('Location captured successfully!');
    } catch (error: any) {
      console.error('Error getting location:', error);
      locationWarning = true;
      
      // Provide specific error messages based on error type
      if (error.code === 1) {
        toast.warning('Location permission denied. QR code will be generated without location verification.');
      } else if (error.code === 2) {
        toast.warning('Location unavailable. QR code will be generated without location verification.');
      } else if (error.code === 3) {
        toast.warning('Location request timed out. QR code will be generated without location verification.');
      } else {
        toast.warning('Unable to get location. QR code will be generated without location verification.');
      }

      // Use a default location or null
      location = { lat: 0, lng: 0 };
    }

    try {
      const selectedClassData = classes.find(c => c.id === selectedClass);
      const expiresAt = new Date(Date.now() + (15 * 60 * 1000)); // Expires in 15 minutes
      setExpirationTime(expiresAt);

      const qrData = {
        classId: selectedClass,
        className: selectedClassData?.name || 'Unknown Class',
        facultyLocation: location,
        locationVerificationEnabled: !locationWarning,
        timestamp: Date.now(),
        expiresAt: expiresAt.getTime()
      };

      const qrDataString = JSON.stringify(qrData);
      setQrCodeData(qrDataString);

      // Generate QR code URL (in a real app, you'd use a QR code library)
      const mockQRCodeUrl = generateMockQRCode(qrDataString);
      setQrCodeUrl(mockQRCodeUrl);

      if (locationWarning) {
        toast.success('QR code generated successfully! (Location verification disabled)');
      } else {
        toast.success('QR code generated successfully!');
      }
    } catch (error) {
      console.error('Error creating QR code:', error);
      toast.error('Failed to generate QR code. Please try again.');
    }
  };

  // Generate a mock QR code (in a real app, use a proper QR code library)
  const generateMockQRCode = (data: string): string => {
    // This creates a simple visual representation
    // In a real app, you'd use a library like 'qrcode' to generate actual QR codes
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 200;

    if (ctx) {
      // Create a simple pattern that looks like a QR code
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 200, 200);
      
      ctx.fillStyle = '#000000';
      
      // Create a grid pattern
      for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
          if ((i + j + data.length) % 3 === 0) {
            ctx.fillRect(i * 10, j * 10, 10, 10);
          }
        }
      }
      
      // Add corner squares (typical QR code feature)
      ctx.fillRect(0, 0, 70, 70);
      ctx.fillRect(130, 0, 70, 70);
      ctx.fillRect(0, 130, 70, 70);
      
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(10, 10, 50, 50);
      ctx.fillRect(140, 10, 50, 50);
      ctx.fillRect(10, 140, 50, 50);
      
      ctx.fillStyle = '#000000';
      ctx.fillRect(20, 20, 30, 30);
      ctx.fillRect(150, 20, 30, 30);
      ctx.fillRect(20, 150, 30, 30);
    }

    return canvas.toDataURL();
  };

  // Download QR code
  const downloadQRCode = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement('a');
    link.download = `attendance-qr-${selectedClass}-${Date.now()}.png`;
    link.href = qrCodeUrl;
    link.click();
    
    toast.success('QR code downloaded!');
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedClass('');
      setQrCodeData('');
      setQrCodeUrl('');
      setFacultyLocation(null);
      setExpirationTime(null);
    }
  }, [isOpen]);

  // Time remaining display
  const getTimeRemaining = () => {
    if (!expirationTime) return '';
    
    const now = new Date();
    const diff = expirationTime.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            Generate QR Code
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Generate a QR code for students to mark their attendance
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Class Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Select Class</label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue placeholder="Choose a class..." />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {classes.map((classItem) => (
                  <SelectItem key={classItem.id} value={classItem.id} className="text-white">
                    {classItem.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location Status */}
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4" />
            {facultyLocation && facultyLocation.lat !== 0 ? (
              <span className="text-green-400">Location captured for verification</span>
            ) : facultyLocation && facultyLocation.lat === 0 ? (
              <span className="text-yellow-400">Location unavailable - verification disabled</span>
            ) : (
              <span className="text-slate-400">Location will be captured when generating QR</span>
            )}
          </div>

          {/* Generate Button */}
          {!qrCodeUrl && (
            <Button 
              onClick={generateQRCode}
              disabled={!selectedClass}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <QrCode className="w-4 h-4 mr-2" />
              Generate QR Code
            </Button>
          )}

          {/* QR Code Display */}
          {qrCodeUrl && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <img 
                  src={qrCodeUrl} 
                  alt="Attendance QR Code" 
                  className="w-full h-auto max-w-48 mx-auto"
                />
              </div>

              {/* QR Code Info */}
              <div className="bg-slate-800 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Class:</span>
                  <span className="text-white">{classes.find(c => c.id === selectedClass)?.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Time remaining:
                  </span>
                  <span className="text-green-400 font-mono">{getTimeRemaining()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setQrCodeUrl('');
                    setQrCodeData('');
                    setExpirationTime(null);
                  }}
                  className="flex-1 border-slate-600 text-white hover:bg-slate-800"
                >
                  Generate New
                </Button>
                <Button 
                  onClick={downloadQRCode}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          )}

          {/* Close Button */}
          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-full border-slate-600 text-white hover:bg-slate-800"
          >
            Close
          </Button>

          {/* Instructions */}
          <div className="bg-blue-900/20 border border-blue-600/20 rounded-lg p-3">
            <p className="text-blue-400 text-sm font-medium mb-2">📱 QR Code Instructions:</p>
            <ul className="text-blue-300 text-xs space-y-1">
              <li>• Students can scan this QR code to mark attendance</li>
              <li>• QR code expires automatically after 15 minutes</li>
              <li>• Location verification ensures students are in classroom</li>
              <li>• Download the QR code to display on projector/screen</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}