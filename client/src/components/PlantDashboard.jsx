import { useState } from 'react';
import { Check, ChevronDown, Leaf, ShieldAlert, Sun, Droplets, Sprout, Cloud, BookOpen } from 'lucide-react';

function Detail({ title, icon: Icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return <section className="detail-card">
    <button className="detail-toggle" type="button" onClick={() => setOpen(value => !value)} aria-expanded={open}>
      <span className="detail-title"><span className="detail-icon"><Icon size={18}/></span>{title}</span><ChevronDown className={open ? 'chevron open' : 'chevron'} size={18}/>
    </button>
    {open && <div className="detail-content">{children}</div>}
  </section>;
}
function Info({ label, value }) { return <div className="info-item"><span>{label}</span><p>{value || 'Not specified'}</p></div>; }

export function PlantDashboard({ scan }) {
  const plant = scan.identification || {};
  const care = scan.insights || {};
  const confidence = Math.round((plant.probability || 0) * 100);
  const common = plant.commonNames?.[0] || plant.scientificName;
  return <section className="result-section" aria-label="Plant identification result">
    <div className="result-heading"><div><p className="eyebrow">IDENTIFICATION RESULT</p><h2>Your plant, identified</h2></div><span className="confidence">{confidence}% match score</span></div>
    <div className="plant-hero">
      {scan.imageDataUrl && <img className="plant-photo" src={scan.imageDataUrl} alt={`Uploaded photo of ${common}`}/>}
      <div className="plant-summary">
        <p className="eyebrow">COMMON NAME</p><h3>{common}</h3><p className="scientific">{plant.scientificName}</p>
        <div className="taxonomy"><span><small>FAMILY</small><strong>{plant.family || 'Unknown'}</strong></span><span><small>GENUS</small><strong>{plant.genus || 'Unknown'}</strong></span></div>
      </div>
    </div>
    <div className="overview-card"><div className="card-label"><Leaf size={17}/> BOTANICAL OVERVIEW</div><p>{care.overview || 'No overview was returned.'}</p></div>
    <div className="care-grid">
      <div className="care-tile"><Droplets size={19}/><span>WATERING</span><strong>{care.watering?.frequency || 'Not specified'}</strong></div>
      <div className="care-tile"><Sun size={19}/><span>SUNLIGHT</span><strong>{care.sunlight?.requirement || 'Not specified'}</strong></div>
      <div className="care-tile"><Cloud size={19}/><span>HUMIDITY</span><strong>{care.humidity?.level || 'Not specified'}</strong></div>
      <div className="care-tile"><Sprout size={19}/><span>SOIL</span><strong>{care.soil?.type || 'Not specified'}</strong></div>
    </div>
    <div className="details-heading"><h3>Plant care guide</h3><p>Open a section to read the details.</p></div>
    <div className="details-list">
      <Detail title="Watering" icon={Droplets} defaultOpen><Info label="Frequency" value={care.watering?.frequency}/><Info label="Instructions" value={care.watering?.instructions}/><Info label="Overwatering signs" value={care.watering?.signsOfOverwatering}/></Detail>
      <Detail title="Sunlight" icon={Sun}><Info label="Requirement" value={care.sunlight?.requirement}/><Info label="Hours per day" value={care.sunlight?.hoursPerDay}/><Info label="Instructions" value={care.sunlight?.instructions}/></Detail>
      <Detail title="Soil and humidity" icon={Sprout}><Info label="Soil type" value={care.soil?.type}/><Info label="Drainage" value={care.soil?.drainage}/><Info label="Soil pH" value={care.soil?.ph}/><Info label="Humidity" value={care.humidity?.level}/><Info label="Humidity advice" value={care.humidity?.instructions}/></Detail>
      <Detail title="Toxicity and precautions" icon={ShieldAlert}><div className="safety-note"><ShieldAlert size={18}/><p>Do not assume this plant is safe for pets or people. Confirm toxicity with a qualified source.</p></div><Info label="Pets" value={care.toxicity?.pets}/><Info label="Humans" value={care.toxicity?.humans}/><Info label="Precautions" value={care.toxicity?.precautions}/></Detail>
      <Detail title="Common diseases" icon={Cloud}>{care.diseases?.length ? care.diseases.map((disease, index) => <div className="disease-item" key={`${disease.name}-${index}`}><strong>{disease.name}</strong><Info label="Symptoms" value={disease.symptoms}/><Info label="Treatment" value={disease.treatment}/></div>) : <p>No disease information was provided.</p>}</Detail>
      <Detail title="Propagation" icon={Sprout}><Info label="Methods" value={care.propagation?.methods?.join(', ')}/><Info label="Instructions" value={care.propagation?.instructions}/></Detail>
      <Detail title="Interesting facts" icon={BookOpen}>{care.facts?.length ? <ul className="facts-list">{care.facts.map((fact, index) => <li key={index}><Check size={16}/>{fact}</li>)}</ul> : <p>No additional facts were provided.</p>}</Detail>
    </div>
    <p className="result-disclaimer">Identification confidence is an estimate, not a guarantee. Plant care and toxicity guidance can vary by cultivar, growing conditions and source quality.</p>
  </section>;
}
