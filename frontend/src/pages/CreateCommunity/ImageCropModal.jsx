import React, { useState, useEffect, useRef } from 'react';
import './ImageCropModal.css';
import CustomButton from '../../components/CustomButton';
import CloseButton from '../../components/CloseButton';

const ImageCropModal = ({
  imageUrl,
  imageType,
  onClose,
  onSave,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null); // 'top-left' or 'bottom-right'
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cropStart, setCropStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [displayDims, setDisplayDims] = useState({ width: 0, height: 0 });
  
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  const dimensions = imageType === 'banner' 
    ? { width: 1028, height: 128, label: 'Banners must be 1028px x 128px' }
    : { width: 256, height: 256, label: 'Icons must be 1:1' };

  const aspectRatio = dimensions.width / dimensions.height;

  // Load image and initialize crop area
  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.onload = () => {
        const imgWidth = img.width;
        const imgHeight = img.height;
        setImageSize({ width: imgWidth, height: imgHeight });
        setImageLoaded(true);
        
        // Calculate initial crop area to fit image with correct aspect ratio
        let initialCropWidth, initialCropHeight;
        
        if (imgWidth / imgHeight > aspectRatio) {
          // Image is wider than target - height is limiting
          initialCropHeight = Math.min(imgHeight, imgHeight * 0.8);
          initialCropWidth = initialCropHeight * aspectRatio;
        } else {
          // Image is taller than target - width is limiting
          initialCropWidth = Math.min(imgWidth, imgWidth * 0.8);
          initialCropHeight = initialCropWidth / aspectRatio;
        }
        
        // Ensure it fits within image bounds
        if (initialCropWidth > imgWidth) {
          initialCropWidth = imgWidth;
          initialCropHeight = initialCropWidth / aspectRatio;
        }
        if (initialCropHeight > imgHeight) {
          initialCropHeight = imgHeight;
          initialCropWidth = initialCropHeight * aspectRatio;
        }
        
        // Center the crop area
        const initialX = Math.max(0, (imgWidth - initialCropWidth) / 2);
        const initialY = Math.max(0, (imgHeight - initialCropHeight) / 2);
        
        setCropArea({
          x: initialX,
          y: initialY,
          width: initialCropWidth,
          height: initialCropHeight,
        });
      };
      img.src = imageUrl;
    }
  }, [imageUrl, aspectRatio]);


  const handleZoomChange = (delta) => {
    setZoomLevel(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const handleMouseDown = (e) => {
    if (!imageRef.current || !containerRef.current || !imageLoaded) return;
    
    // Check if clicking on a resize handle
    const target = e.target;
    if (target.classList.contains('crop-handle')) {
      const handleType = target.classList.contains('crop-handle-top-left') ? 'top-left' : 'bottom-right';
      setIsResizing(true);
      setResizeHandle(handleType);
      setCropStart({ ...cropArea });
      
      const imgRect = imageRef.current.getBoundingClientRect();
      const scale = imageSize.width / imgRect.width;
      const clickX = (e.clientX - imgRect.left) * scale;
      const clickY = (e.clientY - imgRect.top) * scale;
      
      setDragStart({ x: clickX, y: clickY });
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    const imgRect = imageRef.current.getBoundingClientRect();
    
    // Calculate scale from display to original image
    // Use consistent scale (image maintains aspect ratio)
    const scale = imageSize.width / imgRect.width;
    
    // Convert click position to image coordinates
    // Account for potential offset if image doesn't fill the container
    const clickX = Math.max(0, Math.min(imageSize.width, (e.clientX - imgRect.left) * scale));
    const clickY = Math.max(0, Math.min(imageSize.height, (e.clientY - imgRect.top) * scale));
    
    // Check if clicking inside crop area (but not on a handle)
    // Use a small tolerance for edge cases
    const tolerance = 0.1;
    if (clickX >= cropArea.x - tolerance && clickX <= cropArea.x + cropArea.width + tolerance &&
        clickY >= cropArea.y - tolerance && clickY <= cropArea.y + cropArea.height + tolerance) {
      setIsDragging(true);
      setDragStart({
        x: clickX - cropArea.x,
        y: clickY - cropArea.y,
      });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e) => {
    if ((!isDragging && !isResizing) || !imageRef.current || !imageLoaded) return;
    
    const imgRect = imageRef.current.getBoundingClientRect();
    
    // Calculate scale from display to original image
    // Use consistent scale (image maintains aspect ratio)
    const scale = imageSize.width / imgRect.width;
    
    // Convert current position to image coordinates
    const currentX = (e.clientX - imgRect.left) * scale;
    const currentY = (e.clientY - imgRect.top) * scale;
    
    if (isResizing) {
      // Handle resize while maintaining aspect ratio
      let newX = cropStart.x;
      let newY = cropStart.y;
      let newWidth = cropStart.width;
      let newHeight = cropStart.height;
      
      if (resizeHandle === 'bottom-right') {
        // Resize from bottom-right corner
        const deltaX = currentX - dragStart.x;
        const deltaY = currentY - dragStart.y;
        
        // Calculate new size maintaining aspect ratio
        // Determine which dimension is the limiting factor
        const widthDelta = deltaX;
        const heightDelta = deltaY;
        const widthBasedHeight = (cropStart.width + widthDelta) / aspectRatio;
        const heightBasedWidth = (cropStart.height + heightDelta) * aspectRatio;
        
        // Choose the dimension that maintains aspect ratio better
        if (Math.abs(widthBasedHeight - (cropStart.height + heightDelta)) < 
            Math.abs(heightBasedWidth - (cropStart.width + widthDelta))) {
          // Width-based calculation
          newWidth = cropStart.width + widthDelta;
          newHeight = newWidth / aspectRatio;
        } else {
          // Height-based calculation
          newHeight = cropStart.height + heightDelta;
          newWidth = newHeight * aspectRatio;
        }
        
        // Constrain to image bounds
        if (newX + newWidth > imageSize.width) {
          newWidth = imageSize.width - newX;
          newHeight = newWidth / aspectRatio;
        }
        if (newY + newHeight > imageSize.height) {
          newHeight = imageSize.height - newY;
          newWidth = newHeight * aspectRatio;
          // Re-check width constraint
          if (newX + newWidth > imageSize.width) {
            newWidth = imageSize.width - newX;
            newHeight = newWidth / aspectRatio;
          }
        }
        
        // Ensure minimum size (10% of smallest image dimension)
        const minSize = Math.min(imageSize.width, imageSize.height) * 0.1;
        if (newWidth < minSize) {
          newWidth = minSize;
          newHeight = newWidth / aspectRatio;
        }
        if (newHeight < minSize) {
          newHeight = minSize;
          newWidth = newHeight * aspectRatio;
        }
      } else if (resizeHandle === 'top-left') {
        // Resize from top-left corner
        const deltaX = dragStart.x - currentX;
        const deltaY = dragStart.y - currentY;
        
        // Calculate new size maintaining aspect ratio
        const widthDelta = deltaX;
        const heightDelta = deltaY;
        const widthBasedHeight = (cropStart.width + widthDelta) / aspectRatio;
        const heightBasedWidth = (cropStart.height + heightDelta) * aspectRatio;
        
        // Choose the dimension that maintains aspect ratio better
        if (Math.abs(widthBasedHeight - (cropStart.height + heightDelta)) < 
            Math.abs(heightBasedWidth - (cropStart.width + widthDelta))) {
          // Width-based calculation
          newWidth = cropStart.width + widthDelta;
          newHeight = newWidth / aspectRatio;
        } else {
          // Height-based calculation
          newHeight = cropStart.height + heightDelta;
          newWidth = newHeight * aspectRatio;
        }
        
        // Calculate new position (top-left moves when resizing)
        newX = cropStart.x + cropStart.width - newWidth;
        newY = cropStart.y + cropStart.height - newHeight;
        
        // Constrain to image bounds
        if (newX < 0) {
          newX = 0;
          newWidth = cropStart.x + cropStart.width;
          newHeight = newWidth / aspectRatio;
        }
        if (newY < 0) {
          newY = 0;
          newHeight = cropStart.y + cropStart.height;
          newWidth = newHeight * aspectRatio;
        }
        if (newX + newWidth > imageSize.width) {
          newWidth = imageSize.width - newX;
          newHeight = newWidth / aspectRatio;
        }
        if (newY + newHeight > imageSize.height) {
          newHeight = imageSize.height - newY;
          newWidth = newHeight * aspectRatio;
        }
        
        // Ensure minimum size
        const minSize = Math.min(imageSize.width, imageSize.height) * 0.1;
        if (newWidth < minSize) {
          newWidth = minSize;
          newHeight = newWidth / aspectRatio;
          newX = cropStart.x + cropStart.width - newWidth;
          newY = cropStart.y + cropStart.height - newHeight;
        }
        if (newHeight < minSize) {
          newHeight = minSize;
          newWidth = newHeight * aspectRatio;
          newX = cropStart.x + cropStart.width - newWidth;
          newY = cropStart.y + cropStart.height - newHeight;
        }
        
        // Re-constrain after minimum size adjustment
        if (newX < 0) {
          newX = 0;
        }
        if (newY < 0) {
          newY = 0;
        }
        if (newX + newWidth > imageSize.width) {
          newWidth = imageSize.width - newX;
          newHeight = newWidth / aspectRatio;
        }
        if (newY + newHeight > imageSize.height) {
          newHeight = imageSize.height - newY;
          newWidth = newHeight * aspectRatio;
        }
      }
      
      setCropArea({
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      });
    } else if (isDragging) {
      // Handle dragging (moving the crop area)
      let newX = currentX - dragStart.x;
      let newY = currentY - dragStart.y;
      
      // Constrain to image bounds
      newX = Math.max(0, Math.min(imageSize.width - cropArea.width, newX));
      newY = Math.max(0, Math.min(imageSize.height - cropArea.height, newY));
      
      setCropArea(prev => ({
        ...prev,
        x: newX,
        y: newY,
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, cropStart, resizeHandle, imageSize, zoomLevel, aspectRatio]);

  const handleSave = () => {
    if (!imageRef.current || cropArea.width === 0 || cropArea.height === 0) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Draw the cropped and resized image
      ctx.drawImage(
        img,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        dimensions.width,
        dimensions.height
      );
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], imageType === 'banner' ? 'banner.jpg' : 'icon.jpg', {
            type: 'image/jpeg',
          });
          onSave(file);
        }
      }, 'image/jpeg', 0.9);
    };
    img.src = imageUrl;
  };

  // Calculate display dimensions - scale based on container size
  useEffect(() => {
    if (!containerRef.current || !imageLoaded || imageSize.width === 0) {
      setDisplayDims({ width: 0, height: 0 });
      return;
    }
    
    const updateDisplayDims = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.clientWidth - 32; // Account for padding
      const containerHeight = containerRef.current.clientHeight - 32;
      
      const imageAspectRatio = imageSize.width / imageSize.height;
      const containerAspectRatio = containerWidth / containerHeight;
      
      // Calculate base size to fit container (at zoom level 1)
      // Always fit the image to the container while maintaining aspect ratio
      let baseWidth, baseHeight;
      if (imageAspectRatio > containerAspectRatio) {
        // Image is wider than container - fit to width
        baseWidth = containerWidth;
        baseHeight = baseWidth / imageAspectRatio;
      } else {
        // Image is taller than container - fit to height
        baseHeight = containerHeight;
        baseWidth = baseHeight * imageAspectRatio;
      }
      
      // Apply zoom
      const displayWidth = baseWidth * zoomLevel;
      const displayHeight = baseHeight * zoomLevel;
      
      setDisplayDims({ width: displayWidth, height: displayHeight });
    };
    
    updateDisplayDims();
    window.addEventListener('resize', updateDisplayDims);
    return () => window.removeEventListener('resize', updateDisplayDims);
  }, [imageLoaded, imageSize, zoomLevel]);
  
  // Calculate scale factor from original image to display
  // The image maintains its aspect ratio, so both dimensions scale by the same factor
  // Use the actual displayed dimensions to calculate the scale
  const scale = imageSize.width > 0 && displayDims.width > 0 
    ? displayDims.width / imageSize.width 
    : (imageSize.height > 0 && displayDims.height > 0 
      ? displayDims.height / imageSize.height 
      : 0);
  
  // Calculate crop overlay position and size in display coordinates
  // Position is relative to the image element itself
  const overlayLeft = cropArea.x * scale;
  const overlayTop = cropArea.y * scale;
  const overlayWidth = cropArea.width * scale;
  const overlayHeight = cropArea.height * scale;

  return (
    <div className="crop-modal-overlay" onClick={onClose}>
      <div className="crop-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="crop-modal-header">
          <div className = "crop-modal-header-title">
          <h2 className="crop-modal-title">Style your community</h2>
          <CloseButton onClick={onClose} />
          </div>
            <p className="crop-modal-subtitle">{dimensions.label}</p>
          </div>
        <div className="crop-modal-content">
          <div 
            className="crop-image-container"
            ref={containerRef}
            onMouseDown={handleMouseDown}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            {imageLoaded && cropArea.width > 0 && cropArea.height > 0 && (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="Crop preview"
                  className="crop-image"
                  style={{
                    width: `${displayDims.width}px`,
                    height: `${displayDims.height}px`,
                    maxWidth: '100%',
                    maxHeight: '100%',
                    display: 'block',
                  }}
                />
                <div
                  className="crop-overlay"
                  onMouseDown={handleMouseDown}
                  style={{
                    left: `${overlayLeft}px`,
                    top: `${overlayTop}px`,
                    width: `${overlayWidth}px`,
                    height: `${overlayHeight}px`,
                  }}
                >
                  <div 
                    className="crop-handle crop-handle-top-left"
                    onMouseDown={handleMouseDown}
                  ></div>
                  <div 
                    className="crop-handle crop-handle-bottom-right"
                    onMouseDown={handleMouseDown}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="crop-modal-footer">
          <div className="crop-zoom-controls">
            <button
              className="crop-zoom-button"
              onClick={() => handleZoomChange(-0.1)}
              disabled={zoomLevel <= 0.5}
            >
              <svg rpl="" fill="currentColor" height="16" icon-name="subtract" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg"> <path d="M18.1 10.9H1.9c-.5 0-.9-.4-.9-.9s.4-.9.9-.9h16.2c.5 0 .9.4.9.9s-.4.9-.9.9z"></path></svg>
            </button>
            <button
              className="crop-zoom-button"
              onClick={() => handleZoomChange(0.1)}
              disabled={zoomLevel >= 3}
            >
              <svg rpl="" fill="currentColor" height="16" icon-name="add" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M17.1 9.1h-6.2V2.9c0-.5-.4-.9-.9-.9s-.9.4-.9.9v6.2H2.9c-.5 0-.9.4-.9.9s.4.9.9.9h6.2v6.2c0 .5.4.9.9.9s.9-.4.9-.9v-6.2h6.2c.5 0 .9-.4.9-.9s-.4-.9-.9-.9z"></path> </svg>
            </button>
          </div>
          <div className="crop-action-buttons">
            <CustomButton onClick={onClose}>
              Cancel
            </CustomButton>
            <CustomButton onClick={handleSave} className="blue-button">
              Save
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;

