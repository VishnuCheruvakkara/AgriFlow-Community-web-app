import React, { useState, useRef } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { FaFileUpload, FaCheck, FaTimes, FaCrop, FaCompress, FaExclamationTriangle } from 'react-icons/fa';
import imageCompression from 'browser-image-compression';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ImageUploader = ({
  onImageSelect,
  label,
  aspect = 1,
  maxSizeMB = 1,
  previewShape = 'rectangle', // 'circle' or 'rectangle'
  required = false,
  allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif']
}) => {
  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState('');
  const imageRef = useRef(null);
  const fileInputRef = useRef(null);
  const imgElementRef = useRef(null);

  // Create validation schema
  const validationSchema = Yup.object().shape({
    image: Yup.mixed()
      .required('This field is required')
      .test('fileSize', `File size must be less than ${maxSizeMB}MB`,
        (value) => !value || (value && value.size <= maxSizeMB * 1024 * 1024))
      .test('fileType', 'Unsupported file format',
        (value) => !value || (value && allowedFileTypes.includes(value.type)))
      .test('fileDimensions', 'Image dimensions are too small',
        () => !required || src !== null || previewUrl !== null)
  });

  // Initialize formik
  const formik = useFormik({
    initialValues: {
      image: null
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: values => {
      // This will be triggered if you add a form submission
      console.log('Form submitted', values);
    }
  });

  function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspect,
        mediaWidth,
        mediaHeight
      ),
      mediaWidth,
      mediaHeight
    );
  }

  const validateFile = (file) => {
    // Reset previous errors
    setError('');

    // Check file type
    if (!allowedFileTypes.includes(file.type)) {
      setError(`Invalid file type. Allowed types: ${allowedFileTypes.map(type => type.split('/')[1]).join(', ')}`);
      return false;
    }

    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB limit`);
      return false;
    }

    return true;
  };

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Set the file for formik validation
      formik.setFieldValue('image', file);

      // Validate file before proceeding
      if (!validateFile(file)) {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      setFileName(file.name);
      setFileSize((file.size / 1024 / 1024).toFixed(2) + ' MB');

      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setSrc(reader.result);
        setIsCropping(true);
      });

      reader.addEventListener('error', () => {
        setError('Failed to read file. Please try again.');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      });

      reader.readAsDataURL(file);
    }
  };

  const onImageLoaded = (img) => {
    imgElementRef.current = img;
    const { naturalWidth: width, naturalHeight: height } = img;

    // Validate image dimensions
    if (width < 200 || height < 200) {
      setError('Image dimensions too small. Minimum 200x200 pixels required.');
      handleCancel();
      return;
    }

    imageRef.current = img;
    setCrop(centerAspectCrop(width, height, aspect));
  };

  const compressImage = async (imageFile) => {
    setIsCompressing(true);
    try {
      const options = {
        maxSizeMB: maxSizeMB,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      };

      const compressedFile = await imageCompression(imageFile, options);
      setFileSize((compressedFile.size / 1024 / 1024).toFixed(2) + ' MB');
      return compressedFile;
    } catch (error) {
      console.error('Error compressing image:', error);
      setError('Failed to compress image');
      return imageFile;
    } finally {
      setIsCompressing(false);
    }
  };

  const getCroppedImg = async (image, pixelCrop, fileName) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Calculate actual pixel dimensions
    const actualCrop = {
      x: pixelCrop.x * scaleX,
      y: pixelCrop.y * scaleY,
      width: pixelCrop.width * scaleX,
      height: pixelCrop.height * scaleY
    };

    canvas.width = actualCrop.width;
    canvas.height = actualCrop.height;

    const ctx = canvas.getContext('2d');

    // Set canvas background to white for transparent images
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the cropped portion
    ctx.drawImage(
      image,
      actualCrop.x,
      actualCrop.y,
      actualCrop.width,
      actualCrop.height,
      0,
      0,
      actualCrop.width,
      actualCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            console.error('Canvas is empty');
            setError('Failed to crop image');
            return;
          }

          // Create a File from Blob
          const croppedFile = new File([blob], fileName, { type: 'image/jpeg' });

          // Compress the cropped image
          const compressedFile = await compressImage(croppedFile);

          // Generate preview URL
          const previewUrl = URL.createObjectURL(compressedFile);
          setPreviewUrl(previewUrl);

          resolve(compressedFile);
        },
        'image/jpeg',
        0.95
      );
    });
  };

  const handleCropComplete = async () => {
    if (!completedCrop || !imgElementRef.current) return;

    try {
      const croppedFile = await getCroppedImg(
        imgElementRef.current,
        completedCrop,
        fileName
      );

      // Update formik with processed file
      formik.setFieldValue('image', croppedFile);

      // If validation passes, proceed
      if (validateFile(croppedFile)) {
        onImageSelect(croppedFile);
        setIsCropping(false);
        setError(''); // Clear any previous errors
      }
    } catch (e) {
      console.error('Error cropping image:', e);
      setError('Failed to process image');
    }
  };

  const handleCancel = () => {
    setSrc(null);
    setIsCropping(false);
    setCompletedCrop(null);
    setPreviewUrl(null);
    setFileName('');
    setFileSize('');
    // Reset formik values
    formik.setFieldValue('image', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // If image is required, set error after cancel
    if (required && !previewUrl) {
      setError('Image is required');
    }
  };

  // Determine preview container class based on shape
  const previewContainerClass = previewShape === 'circle'
    ? "relative bg-gray-100 rounded-full overflow-hidden w-48 h-48"
    : "relative bg-gray-100 rounded-md overflow-hidden";

  // Determine preview image class based on shape
  const previewImageClass = previewShape === 'circle'
    ? "w-full h-full object-cover"
    : "max-h-48 max-w-full mx-auto";

  // Handle display of required indicator
  const labelText = `${label || 'Upload Image'}${required ? ' *' : ''}`;

  // Error display component
  const ErrorMessage = ({ message }) => (
    message ? (
      <div className="flex items-center mt-1 text-red-600 text-sm">
        <FaExclamationTriangle className="mr-1" />
        <span>{message}</span>
      </div>
    ) : null
  );

  return (
    <div className="w-full">
      <label className="block text-gray-700 mb-2">{labelText}</label>

      {!isCropping && !previewUrl && (
        <div
          className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center h-40 cursor-pointer hover:bg-gray-50 ${error ? 'border-red-400' : 'border-gray-300'}`}
          onClick={() => fileInputRef.current?.click()}
        >
          <FaFileUpload className={`text-3xl mb-2 ${error ? 'text-red-400' : 'text-gray-400'}`} />
          <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-400">
            Allowed formats: {allowedFileTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')} (Max {maxSizeMB}MB)
          </p>
          <input
            type="file"
            className="hidden"
            accept={allowedFileTypes.join(',')}
            onChange={onSelectFile}
            ref={fileInputRef}
            name="image"
            onBlur={formik.handleBlur}
          />
        </div>
      )}

      <ErrorMessage message={error || (formik.touched.image && formik.errors.image)} />

      {isCropping && src && (
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-medium mb-3">Crop Image</h3>
          <div className="mb-4 max-w-full overflow-auto">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              circularCrop={previewShape === 'circle'}
            >
              <img
                src={src}
                onLoad={(e) => onImageLoaded(e.currentTarget)}
                className="max-w-full"
                alt="Crop preview"
                ref={imgElementRef}
              />
            </ReactCrop>
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              onClick={handleCropComplete}
              disabled={!completedCrop}
            >
              <FaCheck className="mr-1" /> Apply Crop
            </button>
            <button
              type="button"
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              onClick={handleCancel}
            >
              <FaTimes className="mr-1" /> Cancel
            </button>
          </div>
        </div>
      )}

      {previewUrl && !isCropping && (
        <div className="p-4 border rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium">Selected Image</h3>
              <p className="text-xs text-gray-500">{fileName} ({fileSize})</p>
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800"
                onClick={() => setIsCropping(true)}
              >
                <FaCrop className="text-lg" title="Crop again" />
              </button>
              <button
                type="button"
                className="text-red-600 hover:text-red-800"
                onClick={handleCancel}
              >
                <FaTimes className="text-lg" title="Remove" />
              </button>
            </div>
          </div>
          <div className={previewContainerClass}>
            <img
              src={previewUrl}
              alt="Preview"
              className={previewImageClass}
            />
          </div>
        </div>
      )}

      {isCompressing && (
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <FaCompress className="mr-1" /> Compressing image...
        </div>
      )}
    </div>
  );
};

export default ImageUploader;