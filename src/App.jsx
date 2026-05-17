import { useState, useEffect } from 'react';

const PROXY = '/api/training';

const levelLabel = (z) => (z === 1 ? 'start today' : z === 2 ? 'short training' : 'some experience');

function parseStudentGraduated(raw) {
  if (!raw) return [];
  return raw.split('||').map((segment) => {
    const idx = segment.lastIndexOf(':');
    if (idx === -1) return { label: segment.trim(), count: '' };
    return {
      label: segment.slice(0, idx).trim(),
      count: segment.slice(idx + 1).trim(),
    };
  });
}

function phoneHref(phone) {
  if (!phone) return '';
  return `tel:${phone.replace(/\D/g, '')}`;
}

function careerOneStopProgramUrl(programName, zip) {
  const params = new URLSearchParams({
    keyword: programName,
    location: zip,
    radius: '25',
    schoolprogram: 'p',
  });
  return `https://www.careeronestop.org/Toolkit/Training/find-local-training-results.aspx?${params}`;
}

function LevelTag({ zone }) {
  if (zone === 1) return <span className="tag tag-start">start today</span>;
  if (zone === 2) return <span className="tag tag-short">short training</span>;
  return <span className="tag tag-some">some experience</span>;
}

const JOBS = [
  {
    title: 'Landscaping and groundskeeping workers',
    type: 'outdoor',
    employer: 'City of Houston Parks Dept.',
    dist: 1.2,
    posted: 'today',
    shifts: 'Mon–Fri, 7am–3pm',
    wage: '$14–$17/hr',
    zone: 1,
    tasks: [
      'Mow and edge lawns',
      'Plant shrubs, trees, and flowers',
      'Remove debris and leaves',
      'Apply mulch and fertilizer',
      'Operate hand and power tools',
    ],
    grow: {
      title: 'Tree trimmer & pruner',
      zone: 2,
      wage: '$18–$24/hr',
      training: '1–3 months on the job',
      keyword: 'tree trimmer',
      desc: 'Cut away dead or excess branches from trees or shrubs to maintain right-of-way for roads, sidewalks, or utilities, or to improve appearance, health, and value of trees.',
      tasks: [
        'Trim branches using handsaws, pruning hooks, or power saws',
        'Clear away brush, leaves, and debris',
        'Operate aerial bucket trucks or climb trees safely',
        'Apply herbicides to prevent regrowth',
        'Chip brush and load debris into trucks',
      ],
    },
  },
  {
    title: 'Dishwashers',
    type: 'food service',
    employer: 'Aramark Food Services',
    dist: 0.8,
    posted: 'today',
    shifts: 'Evenings & weekends',
    wage: '$12–$15/hr',
    zone: 1,
    tasks: [
      'Clean dishes, pots, and utensils',
      'Maintain cleanliness of kitchen area',
      'Remove garbage and dispose of waste',
      'Stock supplies in kitchen',
      'Operate dishwashing machines',
    ],
    grow: {
      title: 'Cook',
      zone: 2,
      wage: '$15–$20/hr',
      training: '3–12 months on the job',
      keyword: 'cook',
      desc: 'Prepare, season, and cook dishes such as soups, meats, vegetables, and desserts in restaurants and other establishments.',
      tasks: [
        'Prepare ingredients by chopping and mixing',
        'Cook food using ovens, grills, and stovetops',
        'Season food during cooking',
        'Ensure food safety and hygiene standards',
        'Plate and present dishes to server',
      ],
    },
  },
  {
    title: 'Janitors and cleaners',
    type: 'facilities',
    employer: 'ABM Industries',
    dist: 2.1,
    posted: 'yesterday',
    shifts: 'Overnight, 10pm–6am',
    wage: '$13–$16/hr',
    zone: 1,
    tasks: [
      'Sweep, mop, and vacuum floors',
      'Empty trash receptacles',
      'Clean and sanitize restrooms',
      'Dust furniture and surfaces',
      'Report maintenance issues',
    ],
    grow: {
      title: 'Maintenance and repair worker',
      zone: 2,
      wage: '$18–$25/hr',
      training: 'Up to 12 months on the job',
      keyword: 'building maintenance',
      desc: 'Perform work involving the skills of two or more maintenance or craft occupations to keep machines, mechanical equipment, or the structure of a building in repair.',
      tasks: [
        'Fix or replace broken fixtures and equipment',
        'Perform routine inspections of facilities',
        'Repair plumbing and electrical issues',
        'Paint walls and perform touch-up work',
        'Maintain logs of maintenance activity',
      ],
    },
  },
  {
    title: 'Laborers and freight movers',
    type: 'warehouse',
    employer: 'Amazon DSP Partner',
    dist: 3.4,
    posted: 'yesterday',
    shifts: 'Flexible, full & part-time',
    wage: '$15–$19/hr',
    zone: 1,
    tasks: [
      'Load and unload trucks and trailers',
      'Move materials by hand or equipment',
      'Count and verify shipments',
      'Stack goods in storage areas',
      'Maintain clean work areas',
    ],
    grow: {
      title: 'Industrial truck operator',
      zone: 2,
      wage: '$18–$24/hr',
      training: 'Short-term on the job',
      keyword: 'forklift operator',
      desc: 'Operate industrial trucks or tractors equipped to move materials around a warehouse, storage yard, factory, construction site, or similar location.',
      tasks: [
        'Drive forklifts and pallet jacks to move materials',
        'Load and unload shipments',
        'Stack products in designated areas',
        'Perform pre-shift safety inspections',
        'Maintain inventory accuracy',
      ],
    },
  },
  {
    title: 'Fast food and counter workers',
    type: 'food service',
    employer: "McDonald's — Westheimer",
    dist: 0.5,
    posted: 'today',
    shifts: 'All shifts available',
    wage: '$12–$15/hr',
    zone: 1,
    tasks: [
      'Take customer orders',
      'Prepare food items to spec',
      'Handle cash and card transactions',
      'Keep work area clean',
      'Restock supplies during shift',
    ],
    grow: {
      title: 'Shift supervisor',
      zone: 2,
      wage: '$16–$22/hr',
      training: '3–6 months on the job',
      keyword: 'food service supervisor',
      desc: 'Supervise and coordinate activities of workers engaged in preparing and serving food.',
      tasks: [
        'Coordinate staff assignments and breaks',
        'Train new team members',
        'Handle customer complaints',
        'Monitor food quality and safety standards',
        'Open or close the location',
      ],
    },
  },
  {
    title: 'Highway maintenance workers',
    type: 'outdoor',
    employer: 'TxDOT District 12',
    dist: 4.7,
    posted: '2 days ago',
    shifts: 'Mon–Fri, 6am–2pm',
    wage: '$16–$20/hr',
    zone: 1,
    tasks: [
      'Fill potholes and cracks',
      'Mow grass along roadsides',
      'Place traffic cones and signs',
      'Clean drainage ditches',
      'Spread sand and salt on roads',
    ],
    grow: {
      title: 'Construction equipment operator',
      zone: 3,
      wage: '$22–$32/hr',
      training: '1–2 years on the job',
      keyword: 'construction equipment operator',
      desc: 'Operate one or several types of power construction equipment such as motor graders, bulldozers, scrapers, compressors, pumps, and cranes.',
      tasks: [
        'Operate heavy machinery on job sites',
        'Grade and level land using motorized equipment',
        'Perform pre-operation safety checks',
        'Read and follow site blueprints',
        'Coordinate with crew and site supervisors',
      ],
    },
  },
];

export default function App() {
  const [page, setPage] = useState('home');
  const [zipInput, setZipInput] = useState('');
  const [selectedRadius, setSelectedRadius] = useState(5);
  const [currentZip, setCurrentZip] = useState('');
  const [currentJobIdx, setCurrentJobIdx] = useState(null);
  const [currentPrograms, setCurrentPrograms] = useState([]);
  const [trainingFilter, setTrainingFilter] = useState('all');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [panelScreen, setPanelScreen] = useState('detail');
  const [feedState, setFeedState] = useState('loading');
  const [programsState, setProgramsState] = useState('idle');
  const [trainingRoleTitle, setTrainingRoleTitle] = useState('');
  const [selectedProgram, setSelectedProgram] = useState(null);

  useEffect(() => {
    if (sheetOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sheetOpen]);

  const closeSheet = () => {
    setSheetOpen(false);
    setPanelScreen('detail');
  };

  const panelBack = () => {
    if (panelScreen === 'program') setPanelScreen('training');
    else if (panelScreen === 'training') setPanelScreen('grow');
    else if (panelScreen === 'grow') setPanelScreen('detail');
  };

  const selectProgram = (program) => {
    setSelectedProgram(program);
    setPanelScreen('program');
  };

  const setRadius = (val) => setSelectedRadius(val);

  const goHome = () => {
    setPage('home');
    setSheetOpen(false);
    setCurrentJobIdx(null);
    setPanelScreen('detail');
    setSelectedProgram(null);
    setProgramsState('idle');
    setFeedState('loading');
  };

  const doSearch = async () => {
    const zip = zipInput.trim();
    if (zip.length < 5) return;
    setCurrentZip(zip);
    setSheetOpen(false);
    setCurrentJobIdx(null);
    setPanelScreen('detail');
    setSelectedProgram(null);
    setProgramsState('idle');
    setPage('results');
    setFeedState('loading');
    await new Promise((r) => setTimeout(r, 700));
    setFeedState('loaded');
  };

  const selectJob = (idx) => {
    setCurrentJobIdx(idx);
    setPanelScreen('detail');
    if (window.matchMedia('(max-width: 1023px)').matches) {
      setSheetOpen(true);
    }
  };

  const renderGrow = (idx) => {
    setCurrentJobIdx(idx);
    setPanelScreen('grow');
  };

  const loadTraining = async (keyword, roleTitle) => {
    setTrainingRoleTitle(roleTitle);
    setTrainingFilter('all');
    setProgramsState('loading');
    setPanelScreen('training');

    try {
      const res = await fetch(
        `${PROXY}?keyword=${encodeURIComponent(keyword)}&zip=${currentZip}&radius=${selectedRadius}`,
      );
      const data = await res.json();
      const programs = (data.SchoolPrograms || []).map((p) => {
        const distance = parseFloat(p.Distance);
        const formats = p.Format || ['In-person'];
        const programLengths = (p.ProgramLength || []).map((l) => l.Name).filter(Boolean);
        const occupations = (p.OccupationsList || p.Occupationslist || [])
          .map((o) => (typeof o === 'string' ? o : o.Name))
          .filter(Boolean);

        return {
          name: p.ProgramName,
          provider: p.SchoolName,
          address: `${p.Address}, ${p.City} · ${distance.toFixed(1)} mi`,
          format: formats[0],
          formats,
          programLengths,
          occupations,
          studentGraduated: p.StudentGraduated || '',
          streetAddress: p.Address || '',
          city: p.City || '',
          stateAbbr: p.StateAbbr || '',
          zip: p.Zip || '',
          phone: p.Phone || '',
          distance,
          distanceLabel: `${distance.toFixed(1)} mi away`,
          online: formats.some(
            (f) => f.toLowerCase().includes('online') || f.toLowerCase().includes('distance'),
          ),
          cert: programLengths.some((name) => name.toLowerCase().includes('certificate')),
          url: p.SchoolUrl
            ? p.SchoolUrl.startsWith('http')
              ? p.SchoolUrl
              : 'https://' + p.SchoolUrl
            : 'https://www.careeronestop.org',
        };
      });
      setCurrentPrograms(programs);
      setProgramsState('loaded');
    } catch {
      setProgramsState('error');
    }
  };

  const filterPrograms = (filter) => {
    setTrainingFilter(filter);
  };

  const getFilteredPrograms = () => {
    let filtered = currentPrograms;
    if (trainingFilter === 'inperson') filtered = currentPrograms.filter((p) => !p.online);
    if (trainingFilter === 'online') filtered = currentPrograms.filter((p) => p.online);
    if (trainingFilter === 'cert') filtered = currentPrograms.filter((p) => p.cert);
    return filtered;
  };

  const job = currentJobIdx != null ? JOBS[currentJobIdx] : null;
  const grow = job?.grow;

  const filteredPrograms = getFilteredPrograms();
  const graduationStats = selectedProgram ? parseStudentGraduated(selectedProgram.studentGraduated) : [];
  const occupationOutcomes =
    selectedProgram?.occupations?.length > 0
      ? `qualify for roles like: ${selectedProgram.occupations.join(', ')}`
      : null;

  const panelScrollClass =
    panelScreen === 'detail' || panelScreen === 'grow' ? ' panel-scroll--with-footer' : '';

  const renderJobPanel = () => {
    if (!job) return null;

    return (
      <div className="panel-root">
        <div className={`panel-scroll${panelScrollClass}`}>
          {panelScreen === 'detail' && (
            <>
              <div className="detail-hero panel-detail-hero">
                <p className="breadcrumb">
                  jobs near {currentZip}{' '}
                  <span style={{ color: 'var(--text-tertiary)' }}>›</span> {job.type}
                </p>
                <p className="detail-title">{job.title}</p>
                <p className="detail-employer">{job.employer}</p>
                <div className="detail-tags">
                  <LevelTag zone={job.zone} />
                  <span className="tag tag-muted">{job.dist} mi away</span>
                  <span className="tag tag-muted">{job.shifts}</span>
                </div>
                <div className="wage-block">
                  <p className="wage-big">{job.wage}</p>
                  <p className="wage-sub">estimated hourly · paid weekly</p>
                </div>
                <a
                  className="apply-btn"
                  href="https://www.careeronestop.org/toolkit/jobs/find-jobs.aspx"
                  target="_blank"
                  rel="noreferrer"
                >
                  apply now →
                </a>
              </div>
              <div className="panel-detail-body">
                <div className="detail-section">
                  <p className="section-label">what you&apos;ll do</p>
                  <div className="task-list">
                    {job.tasks.map((t) => (
                      <div key={t} className="task-item">
                        <div className="task-dot" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="detail-section">
                  <p className="section-label">details</p>
                  <div className="task-list">
                    <div className="task-item">
                      <div className="task-dot" />
                      <span>No prior experience required</span>
                    </div>
                    <div className="task-item">
                      <div className="task-dot" />
                      <span>Apply and get matched in the app</span>
                    </div>
                    <div className="task-item">
                      <div className="task-dot" />
                      <span>Payment direct to your account or card</span>
                    </div>
                    <div className="task-item">
                      <div className="task-dot" />
                      <span>Posted {job.posted}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {panelScreen === 'grow' && grow && (
            <>
              <button type="button" className="panel-back-btn" onClick={panelBack}>
                ← back
              </button>
              <div className="grow-hero panel-panel-hero">
                <div className="from-pill">↑ next step from: {job.title.toLowerCase()}</div>
                <p className="grow-title">{grow.title}</p>
                <p className="grow-desc">{grow.desc}</p>
                <div className="wage-block">
                  <p className="wage-big">{grow.wage}</p>
                  <p className="wage-sub">median hourly · national</p>
                </div>
                <div className="stat-grid">
                  <div className="stat-card">
                    <p className="stat-label">availability</p>
                    <p className="stat-val">{levelLabel(grow.zone)}</p>
                  </div>
                  <div className="stat-card">
                    <p className="stat-label">training</p>
                    <p className="stat-val">{grow.training}</p>
                  </div>
                  <div className="stat-card">
                    <p className="stat-label">education</p>
                    <p className="stat-val">no diploma required</p>
                  </div>
                  <div className="stat-card">
                    <p className="stat-label">outlook</p>
                    <p className="stat-val">growing</p>
                  </div>
                </div>
              </div>
              <div className="grow-body panel-panel-body">
                <div className="detail-section">
                  <p className="section-label">what you&apos;ll do</p>
                  <div className="task-list">
                    {grow.tasks.map((t) => (
                      <div key={t} className="task-item">
                        <div className="task-dot" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pathway-card">
                  <p className="pathway-label">how to get there</p>
                  <div className="pathway-step">
                    <div className="step-num">1</div>
                    <div className="step-body">
                      <p className="step-title">start with a job today</p>
                      <p className="step-sub">build work history while you earn</p>
                    </div>
                  </div>
                  <div className="step-divider" />
                  <div className="pathway-step">
                    <div className="step-num">2</div>
                    <div className="step-body">
                      <p className="step-title">complete short training</p>
                      <p className="step-sub">{grow.training}</p>
                    </div>
                  </div>
                  <div className="step-divider" />
                  <div className="pathway-step">
                    <div className="step-num">3</div>
                    <div className="step-body">
                      <p className="step-title">get matched to {grow.title.toLowerCase()} roles</p>
                      <p className="step-sub">earn {grow.wage} once you&apos;re there</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {panelScreen === 'training' && (
            <>
              <button type="button" className="panel-back-btn" onClick={panelBack}>
                ← back
              </button>
              <div className="training-hero panel-panel-hero panel-training-hero">
                <p className="training-context">
                  programs to become a <strong>{trainingRoleTitle.toLowerCase()}</strong> near {currentZip}
                </p>
                <div className="filter-row">
                  {[
                    ['all', 'all'],
                    ['inperson', 'in-person'],
                    ['online', 'online'],
                    ['cert', 'certificate'],
                  ].map(([filter, label]) => (
                    <button
                      key={filter}
                      type="button"
                      className={`chip${trainingFilter === filter ? ' active' : ''}`}
                      onClick={() => filterPrograms(filter)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="training-body panel-panel-body">
                {programsState === 'loaded' && (
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 16 }}>
                    {filteredPrograms.length} program{filteredPrograms.length !== 1 ? 's' : ''} found
                  </div>
                )}
                {programsState === 'loading' && (
                  <div className="loading-state">
                    <div className="spinner" />
                    <p className="loading-label">searching programs near {currentZip}…</p>
                  </div>
                )}
                {programsState === 'error' && (
                  <div className="empty-programs">
                    couldn&apos;t load training programs.
                    <br />
                    check your connection and try again.
                  </div>
                )}
                {programsState === 'loaded' && filteredPrograms.length === 0 && (
                  <div className="empty-programs">
                    no programs match that filter.
                    <br />
                    try broadening your search.
                  </div>
                )}
                {programsState === 'loaded' && filteredPrograms.length > 0 && (
                  <div className="programs-grid panel-programs-grid">
                    {filteredPrograms.map((p) => (
                      <div
                        key={`${p.name}-${p.provider}-${p.streetAddress}`}
                        className="program-card"
                        onClick={() => selectProgram(p)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') selectProgram(p);
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <p className="program-name">{p.name}</p>
                        <p className="program-provider">{p.provider}</p>
                        <div className="tags" style={{ margin: '4px 0' }}>
                          <span className="tag tag-muted">{p.format}</span>
                          {p.cert && <span className="tag tag-cert">certificate</span>}
                        </div>
                        <p className="program-address">📍 {p.address}</p>
                      </div>
                    ))}
                  </div>
                )}
                <div className="attribution panel-attribution">
                  training data provided by{' '}
                  <a href="https://www.careeronestop.org" target="_blank" rel="noreferrer">
                    CareerOneStop
                  </a>
                </div>
              </div>
            </>
          )}

          {panelScreen === 'program' && selectedProgram && (
            <>
              <button type="button" className="panel-back-btn" onClick={panelBack}>
                ← back
              </button>
              <div className="program-hero panel-panel-hero">
                <p className="program-detail-title">{selectedProgram.name}</p>
                <p className="program-detail-subtitle">{selectedProgram.provider}</p>
                <div className="detail-tags">
                  {selectedProgram.formats.map((f) => (
                    <span key={f} className="tag tag-muted">
                      {f}
                    </span>
                  ))}
                  {selectedProgram.programLengths.map((len) => (
                    <span key={len} className="tag tag-cert">
                      {len}
                    </span>
                  ))}
                  <span className="tag tag-muted">{selectedProgram.distanceLabel}</span>
                </div>
              </div>
              <div className="program-body panel-program-body">
                <div className="program-body-main">
                  {occupationOutcomes && (
                    <div className="detail-section">
                      <p className="section-label">what you&apos;ll learn</p>
                      <div className="task-list">
                        <div className="task-item">
                          <div className="task-dot" />
                          <span>{occupationOutcomes}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {graduationStats.length > 0 && (
                    <div className="detail-section">
                      <p className="section-label">graduation data</p>
                      <div className="stat-grid program-grad-grid">
                        {graduationStats.map((stat) => (
                          <div key={stat.label} className="stat-card">
                            <p className="stat-label">{stat.label}</p>
                            <p className="stat-val">{stat.count}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="detail-section">
                    <p className="section-label">location</p>
                    <div className="program-location">
                      <p>{selectedProgram.streetAddress}</p>
                      <p>
                        {selectedProgram.city}
                        {selectedProgram.stateAbbr ? `, ${selectedProgram.stateAbbr}` : ''}{' '}
                        {selectedProgram.zip}
                      </p>
                      {selectedProgram.phone && <p>{selectedProgram.phone}</p>}
                    </div>
                  </div>
                </div>
                <div className="program-cta-sidebar panel-program-cta">
                  {selectedProgram.phone && (
                    <a
                      className="program-cta-primary program-cta-primary-desktop"
                      href={phoneHref(selectedProgram.phone)}
                    >
                      call to enroll →
                    </a>
                  )}
                  <a
                    className="program-cta-secondary"
                    href={careerOneStopProgramUrl(selectedProgram.name, currentZip)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    find this program →
                  </a>
                  <a
                    className="program-cta-link"
                    href={selectedProgram.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    visit school website →
                  </a>
                </div>
              </div>
              {selectedProgram.phone && (
                <a
                  className="program-call-bar-mobile panel-program-call-bar"
                  href={phoneHref(selectedProgram.phone)}
                >
                  call to enroll →
                </a>
              )}
            </>
          )}
        </div>
        {panelScreen === 'detail' && (
          <button type="button" className="panel-next-bar" onClick={() => renderGrow(currentJobIdx)}>
            <span>level up → {job.grow.title}</span>
            <span className="panel-next-wage">{job.grow.wage}</span>
          </button>
        )}
        {panelScreen === 'grow' && grow && (
          <button
            type="button"
            className="panel-next-bar panel-next-bar--center"
            onClick={() => loadTraining(grow.keyword, grow.title)}
          >
            find training near me →
          </button>
        )}
      </div>
    );
  };

  if (page === 'home') {
    return (
      <div className="app app--home">
        <nav className="home-nav">
          <span className="home-wordmark">GROUNDWORK</span>
        </nav>
        <main className="home-main">
          <section className="home-hero">
            <p className="home-eyebrow">civic employment platform</p>
            <h1 className="home-title">
              <span className="home-title-light">there&apos;s always </span>
              <span className="home-title-strong">something available.</span>
            </h1>
            <p className="home-subhead">
              entry-level jobs near you — no experience needed, no account required
            </p>
            <div className="home-search-wrap">
              <div className="home-search-bar">
                <input
                  className="home-zip-input"
                  type="text"
                  placeholder="zip code"
                  maxLength={5}
                  inputMode="numeric"
                  value={zipInput}
                  onChange={(e) => setZipInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') doSearch();
                  }}
                />
                <button type="button" className="home-search-btn" onClick={doSearch}>
                  find jobs
                </button>
              </div>
              <div className="home-chips">
                {[5, 10, 25].map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`home-chip${selectedRadius === r ? ' home-chip--active' : ''}`}
                    onClick={() => setRadius(r)}
                  >
                    {r} mi
                  </button>
                ))}
              </div>
            </div>
          </section>
        </main>
        <footer className="home-trust">
          no account required · start today · free to use
        </footer>
      </div>
    );
  }

  return (
    <div className="app app--results">
      <div className="app-shell">
        <aside className="left-panel">
          <div className="left-panel-top">
            <div className="results-nav">
              <button type="button" className="results-back" onClick={goHome}>
                ← back
              </button>
              <button type="button" className="wordmark wordmark--btn" onClick={goHome}>
                Groundwork
              </button>
            </div>
            {feedState === 'loaded' && (
              <div className="feed-meta">
                <span>
                  {JOBS.length} jobs near {currentZip}
                </span>
                <span>no experience needed</span>
              </div>
            )}
          </div>
          <div className="left-panel-scroll">
            {feedState === 'loading' && (
              <div className="loading-state">
                <div className="spinner" />
                <p className="loading-label">searching…</p>
              </div>
            )}
            {feedState === 'loaded' && (
              <div className="jobs-list">
                {JOBS.map((j, i) => (
                  <div
                    key={j.title}
                    className={`job-row${currentJobIdx === i ? ' job-row--active' : ''}`}
                    onClick={() => selectJob(i)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') selectJob(i);
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <span className="job-row-dot" aria-hidden="true" />
                    <span className="job-row-title">{j.title}</span>
                    <LevelTag zone={j.zone} />
                    <span className="job-row-dist">{j.dist} mi</span>
                    <span className="job-row-wage">{j.wage}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
        <main className="right-panel">
          {currentJobIdx == null ? (
            <div className="right-empty">
              <div className="right-empty-dot" aria-hidden="true" />
              <p className="right-empty-text">select a job to see details</p>
            </div>
          ) : (
            renderJobPanel()
          )}
        </main>
      </div>
      {sheetOpen && job && (
        <div className="mobile-sheet mobile-sheet--open">
          <button type="button" className="sheet-back" onClick={closeSheet}>
            ← back
          </button>
          {renderJobPanel()}
        </div>
      )}
    </div>
  );
}
