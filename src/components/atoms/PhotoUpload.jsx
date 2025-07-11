import { useState, useRef, useCallback } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const PhotoUpload = ({ value, onChange, className }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);
  const [crop, setCrop] = useState({ unit: '%', width: 80, height: 80, x: 10, y: 10 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = useCallback((file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target.result);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const getCroppedImg = useCallback((image, crop) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return canvas.toDataURL('image/jpeg', 0.8);
  }, []);

  const handleCropSave = useCallback(() => {
    if (!completedCrop || !imgRef.current) return;

    const croppedImageUrl = getCroppedImg(imgRef.current, completedCrop);
    onChange(croppedImageUrl);
    setShowCropModal(false);
    setOriginalImage(null);
  }, [completedCrop, getCroppedImg, onChange]);

  const handleRemovePhoto = useCallback(() => {
    onChange('');
  }, [onChange]);

  return (
    <>
      <div className={cn("space-y-2", className)}>
        {value ? (
          <div className="relative">
            <img
              src={value}
              alt="Student photo"
              className="w-32 h-32 object-cover rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <ApperIcon name="X" size={12} />
            </button>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-colors",
              isDragging && "border-primary bg-blue-50",
              "hover:border-primary hover:bg-blue-50"
            )}
            onClick={() => fileInputRef.current?.click()}
          >
            <ApperIcon name="Upload" className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop a photo here, or click to select
            </p>
            <p className="text-xs text-gray-500">
              Supports JPG, PNG up to 5MB
            </p>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {showCropModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-premium-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Crop Photo
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCropModal(false)}
                >
                  <ApperIcon name="X" className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  className="max-w-full"
                >
                  <img
                    ref={imgRef}
                    src={originalImage}
                    alt="Crop preview"
                    className="max-w-full max-h-96 object-contain"
                  />
                </ReactCrop>
              </div>
              
              <div className="flex items-center justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCropModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleCropSave}
                  disabled={!completedCrop}
                >
                  Save Photo
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoUpload;