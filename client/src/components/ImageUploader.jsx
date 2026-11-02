
import { useRef, useState } from 'react';
import imageCompression from 'browser-image-compression';
import { Camera, CloudUpload, ImagePlus, X } from 'lucide-react';

const MAX_SIZE = 5 * 1024 * 1024;
const TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function ImageUploader({ onSelect, busy }) {
  const inputRef = useRef(null); // Gallery
  const cameraInputRef = useRef(null); // Camera

  const [preview, setPreview] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);

  async function acceptFile(candidate) {
    setError('');
    if (!candidate) return;

    if (!TYPES.includes(candidate.type)) {
      setError('Choose a JPEG, PNG or WebP image.');
      return;
    }

    try {
      // Compress image before checking the size
      const compressed = await imageCompression(candidate, {
        maxSizeMB: 4.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      });

      if (compressed.size > MAX_SIZE) {
        setError('Image is still larger than 5 MB after compression. Try another image.');
        return;
      }

      const normalized = new File(
        [compressed],
        candidate.name,
        {
          type: compressed.type || candidate.type,
          lastModified: Date.now()
        }
      );

      // Release previous preview URL
      setPreview(previous => {
        if (previous) URL.revokeObjectURL(previous);
        return URL.createObjectURL(normalized);
      });

      setFile(normalized);

    } catch (error) {
      console.error('Image compression failed:', error);
      setError('Image compression failed. Please try another image.');
    }
  }

  function clear() {
    if (preview) URL.revokeObjectURL(preview);

    setPreview('');
    setFile(null);
    setError('');

    if (inputRef.current) inputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  }

  function submit() {
    if (file && !busy) onSelect(file);
  }

  return (
    <div className="upload-card">

      {/* Gallery input */}
      <input
        ref={inputRef}
        className="visually-hidden"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={event => {
          acceptFile(event.target.files?.[0]);
          event.target.value = '';
        }}
      />

      {/* Camera input */}
      <input
        ref={cameraInputRef}
        className="visually-hidden"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={event => {
          acceptFile(event.target.files?.[0]);
          event.target.value = '';
        }}
      />

      {!preview ? (
        <div
          className={`drop-zone ${dragging ? 'dragging' : ''}`}
          onDragOver={event => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={event => {
            event.preventDefault();
            setDragging(false);
            acceptFile(event.dataTransfer.files?.[0]);
          }}
        >
          <div className="upload-symbol">
            <CloudUpload size={25} strokeWidth={1.6} />
          </div>

          <h3>Drop a plant photo here</h3>
          <p>Or choose an image from your device.</p>

          <div className="upload-actions">
            {/* Gallery button */}
            <button
              className="button button-primary"
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
            >
              <ImagePlus size={17} /> Choose image
            </button>

            {/* Camera button */}
            <button
              className="button button-secondary"
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              disabled={busy}
            >
              <Camera size={17} /> Use camera
            </button>
          </div>

          <small>
            For best results, photograph one plant in natural light.
          </small>
        </div>
      ) : (
        <div className="preview-area">
          <img src={preview} alt="Selected plant preview" />

          <div className="preview-meta">
            <div>
              <strong>Image ready</strong>
              <p>
                {file?.name} · {(file?.size / 1024).toFixed(0)} KB
              </p>
            </div>

            <button
              className="icon-button"
              type="button"
              onClick={clear}
              aria-label="Remove selected image"
              disabled={busy}
            >
              <X size={18} />
            </button>
          </div>

          <button
            className="button button-primary identify-button"
            type="button"
            onClick={submit}
            disabled={busy}
          >
            {busy ? 'Identifying…' : 'Identify this plant'}
          </button>
        </div>
      )}

      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
