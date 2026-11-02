import { useMemo, useState } from 'react';
import { Leaf, Clock3, Search, AlertCircle, Sprout } from 'lucide-react';
import { ImageUploader } from '../components/ImageUploader.jsx';
import { PlantDashboard } from '../components/PlantDashboard.jsx';
import { usePlantScan } from '../hooks/usePlantScan.js';
import logo from '../lib/branding.js';

export default function Home() {
  const sessionId = useMemo(() => {
    const key = 'plantsense-session';
    let id = localStorage.getItem(key);
    if (!id) { id = crypto.randomUUID(); localStorage.setItem(key, id); }
    return id;
  }, []);
  const { historyQuery, scanMutation } = usePlantScan(sessionId);
  const [active, setActive] = useState(null);
  const [query, setQuery] = useState('');
  const scans = historyQuery.data || [];
  const filtered = scans.filter(scan => {
    const term = query.trim().toLowerCase();
    return !term || scan.identification.scientificName.toLowerCase().includes(term) ||
      scan.identification.commonNames.some(name => name.toLowerCase().includes(term));
  });
  const errorMessage = scanMutation.error?.response?.data?.error?.message || scanMutation.error?.message || 'Please try again with a clearer plant photo.';
  function submit(file) { setActive(null); scanMutation.mutate({ file }, { onSuccess: setActive }); }

  return <div className="app-shell">
    <header className="topbar"><a className="brand" href="/" aria-label="PlantSense home"><span className="brand-mark"><img src={logo} alt="" /></span><span><strong>plantsense</strong><small>PLANT IDENTIFICATION</small></span></a><span className="topbar-note">A practical field guide</span></header>
    <main className="page-wrap">
      <section className="intro"><p className="eyebrow">IDENTIFY · UNDERSTAND · CARE</p><h1>Know the plant.<br/><span>Care for it well.</span></h1><p className="intro-copy">Upload a clear photo of a leaf, flower or whole plant. Get an identification and a practical care guide based on the result.</p></section>
      <section className="workspace">
        <div className="workspace-main">
          <div className="section-heading"><div><p className="eyebrow">NEW IDENTIFICATION</p><h2>Start with a photo</h2></div><span className="file-limit">JPEG, PNG or WebP · Up to 5 MB</span></div>
          <ImageUploader onSelect={submit} busy={scanMutation.isPending}/>
          {scanMutation.isPending && <div className="status-panel" role="status" aria-live="polite"><span className="spinner"/><div><strong>Identifying your plant</strong><p>Checking the image and preparing its botanical guide. This can take a little while.</p></div></div>}
          {scanMutation.isError && <div className="error-panel" role="alert"><AlertCircle size={20}/><div><strong>Identification was not completed</strong><p>{errorMessage}</p><button className="text-button" onClick={() => scanMutation.reset()} type="button">Dismiss</button></div></div>}
          {active && <PlantDashboard scan={active}/>}
          {!active && !scanMutation.isPending && <div className="how-it-works"><div><span>01</span><p><strong>Photograph</strong><small>Choose a clear, well-lit image.</small></p></div><div><span>02</span><p><strong>Identify</strong><small>Compare visible features with plant data.</small></p></div><div><span>03</span><p><strong>Learn</strong><small>Review care, safety and propagation notes.</small></p></div></div>}
        </div>
        <aside className="history-panel">
          <div className="history-heading"><div><p className="eyebrow">YOUR LIBRARY</p><h2><Clock3 size={18}/> Recent scans</h2></div><span className="count">{scans.length}</span></div>
          <label className="search-box"><Search size={16}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search your scans" aria-label="Search scan history"/></label>
          {historyQuery.isLoading ? <p className="muted small">Loading your scans…</p> : historyQuery.isError ? <div className="empty-state"><AlertCircle size={19}/><p>History could not be loaded.</p><button className="text-button" onClick={() => historyQuery.refetch()}>Try again</button></div> : filtered.length === 0 ? <div className="empty-state"><Sprout size={23}/><p>{scans.length ? 'No scans match that search.' : 'Your identified plants will appear here.'}</p></div> : <ul className="history-list">{filtered.map(scan => <li key={scan._id}><button className={`history-item ${active?._id === scan._id ? 'selected' : ''}`} onClick={() => setActive(scan)} type="button"><span className="history-thumb"><Leaf size={17}/></span><span className="history-name"><strong>{scan.identification.commonNames?.[0] || scan.identification.scientificName}</strong><em>{scan.identification.scientificName}</em><small>{new Date(scan.createdAt).toLocaleDateString()}</small></span></button></li>)}</ul>}
          <p className="history-footnote">History is stored for this browser session.</p>
        </aside>
      </section>
      <footer className="footer"><span>plantsense · Botanical information, made practical.</span><span>Care and toxicity details are informational. Verify safety with qualified sources.</span></footer>
    </main>
  </div>;
}
