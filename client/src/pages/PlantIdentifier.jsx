
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Search, Sprout } from 'lucide-react';
import logo from '../lib/branding.js';

export default function PlantIdentifier() {
  useEffect(() => {
    document.title = 'Plant Identifier Online – Identify Plants by Photo | PlantSense';

    let description = document.querySelector('meta[name="description"]');

    if (!description) {
      description = document.createElement('meta');
      description.name = 'description';
      document.head.appendChild(description);
    }

    description.content =
      'Identify plants from photos with PlantSense AI. Upload a leaf, flower or plant image to discover its name and explore practical plant care information.';
  }, []);

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand-mark"><img src={logo} alt="" /></span>
          <span>
            <strong>plantsense</strong>
            <small>PLANT IDENTIFICATION</small>
          </span>
        </Link>
        <Link to="/">Home</Link>
      </header>

      <main className="page-wrap">
        <section className="intro">
          <p className="eyebrow">AI PLANT IDENTIFICATION</p>
          <h1>Plant Identifier Online</h1>
          <p className="intro-copy">
            Identify plants using a photo. Upload an image of a leaf,
            flower or whole plant and discover its botanical identity.
          </p>
          <Link to="/" className="text-button">
            <Camera size={18} /> Identify a Plant
          </Link>
        </section>

        <section>
          <h2>How does plant identification work?</h2>
          <p>
            Plant identification uses visible characteristics such as leaf
            shape, flower structure and other botanical features to help
            determine which plant appears in an image.
          </p>

          <div className="how-it-works">
            <div>
              <Camera size={22} />
              <p>
                <strong>1. Upload a photo</strong>
                <small>Choose a clear image of your plant.</small>
              </p>
            </div>
            <div>
              <Search size={22} />
              <p>
                <strong>2. Identify the plant</strong>
                <small>Our identification system analyses the image.</small>
              </p>
            </div>
            <div>
              <Sprout size={22} />
              <p>
                <strong>3. Explore plant information</strong>
                <small>Learn about the identified plant and its care.</small>
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2>What photos give better results?</h2>
          <ul>
            <li>Use a clear, well-lit photograph.</li>
            <li>Keep the main plant visible.</li>
            <li>Avoid blurry or heavily filtered images.</li>
            <li>Include leaves, flowers or other distinctive features.</li>
          </ul>
        </section>

        <section>
          <h2>Start identifying plants</h2>
          <p>
            Ready to identify a plant? Upload a photograph and explore
            the identification results.
          </p>
          <Link to="/">Try PlantSense AI</Link>
        </section>
      </main>
    </div>
  );
}
