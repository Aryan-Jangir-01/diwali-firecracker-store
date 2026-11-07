import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Flame,
  Volume2,
  VolumeX,
  RotateCcw,
  Search,
  Eye,
  Play,
  Pause,
  Compass,
  ShieldCheck,
  Zap,
  Info,
  Bell,
  Check,
  X,
  Music,
  ListPlus,
  Trash2,
  Copy,
  Share2,
  Maximize2,
  Sliders,
  ArrowRight
} from 'lucide-react';
import { crackers, categories } from './data';
import Fireworks from './Fireworks';
import { soundEngine } from './audio/soundEngine';

const BURST_COLORS = [
  { name: 'Original', color: null, label: 'Default' },
  { name: 'Gold', color: '#f59e0b', label: 'Gold' },
  { name: 'Ruby', color: '#ef4444', label: 'Ruby' },
  { name: 'Emerald', color: '#10b981', label: 'Emerald' },
  { name: 'Cyan', color: '#38bdf8', label: 'Cyan' },
  { name: 'Violet', color: '#c084fc', label: 'Violet' },
  { name: 'Silver', color: '#ffffff', label: 'Silver' },
];

const PRESET_WISHES = [
  'May the divine light of Diwali illuminate your life with joy, prosperity, and endless blessings.',
  'Wishing you and your family a safe, eco-friendly, and sparkling Festival of Lights!',
  'May this Diwali banish all darkness and bring boundless happiness, good health, and success.',
  'Celebrate the triumph of light over darkness with peace, love, and sweet memories.'
];

export default function App() {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(crackers[0]);
  const [burstTrigger, setBurstTrigger] = useState(null);
  const [isLit, setIsLit] = useState(false);
  const [count, setCount] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [cameraPreset, setCameraPreset] = useState('cinematic');
  const [autoRotate, setAutoRotate] = useState(false);
  const [autoShow, setAutoShow] = useState(false);
  const [ambientActive, setAmbientActive] = useState(false);
  const [customBurstColor, setCustomBurstColor] = useState(null);
  const [recentSkyBurst, setRecentSkyBurst] = useState(null);

  // Mobile Web First Architecture
  const [mobileTab, setMobileTab] = useState('arena'); // 'arena' | 'vault' | 'playlist'

  // Advanced Interactive Features
  const [showQueue, setShowQueue] = useState([]);
  const [isPlayingQueue, setIsPlayingQueue] = useState(false);
  const [inspectModal, setInspectModal] = useState(null);
  const [greetingModal, setGreetingModal] = useState(false);
  const [senderName, setSenderName] = useState('Aryan & Family');
  const [selectedWish, setSelectedWish] = useState(PRESET_WISHES[0]);
  const [copiedGreeting, setCopiedGreeting] = useState(false);

  const autoShowTimerRef = useRef(null);

  // Sync mute and volume with procedural sound engine
  useEffect(() => {
    soundEngine.setMuted(muted);
  }, [muted]);

  useEffect(() => {
    soundEngine.setVolume(volume);
  }, [volume]);

  // Filter crackers by category and search query
  const items = useMemo(() => {
    return crackers.filter((c) => {
      const matchCat = category === 'All' || c.category === category;
      const matchQuery =
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.category.toLowerCase().includes(query.toLowerCase()) ||
        (c.tag && c.tag.toLowerCase().includes(query.toLowerCase()));
      return matchCat && matchQuery;
    });
  }, [category, query]);

  // Master Ignite Function (with Mobile Haptic Vibrations!)
  const ignite = useCallback(
    (crackerToIgnite = selected, overrideColor = customBurstColor) => {
      if (isLit || !crackerToIgnite) return;

      soundEngine.ensureContext();

      // Mobile Haptic Vibration feedback on fuse light
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(35);
      }

      // 1. Light fuse
      setIsLit(true);
      soundEngine.playFuse();

      // 2. Fuse burns for 850ms, then detonates
      setTimeout(() => {
        setIsLit(false);
        setBurstTrigger({
          item: crackerToIgnite,
          customColor: overrideColor,
          time: Date.now(),
        });
        soundEngine.playCrackerSound(crackerToIgnite.category);
        setCount((prev) => prev + 1);

        // Mobile Haptic Vibration on burst
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([60, 30, 90]);
        }
      }, 850);
    },
    [isLit, selected, customBurstColor]
  );

  // Auto-Show / Diwali Ladi Mode (Chain Celebration)
  useEffect(() => {
    if (autoShow) {
      const runCycle = () => {
        const randIdx = Math.floor(Math.random() * crackers.length);
        const randomCracker = crackers[randIdx];
        setSelected(randomCracker);
        ignite(randomCracker);
      };

      runCycle();
      autoShowTimerRef.current = setInterval(runCycle, 3200);
    } else {
      if (autoShowTimerRef.current) {
        clearInterval(autoShowTimerRef.current);
        autoShowTimerRef.current = null;
      }
    }

    return () => {
      if (autoShowTimerRef.current) clearInterval(autoShowTimerRef.current);
    };
  }, [autoShow, ignite]);

  // Launch Choreographed Show Queue
  const launchShowQueue = async () => {
    if (showQueue.length === 0 || isPlayingQueue) return;
    setIsPlayingQueue(true);
    setMobileTab('arena');

    for (let i = 0; i < showQueue.length; i++) {
      const item = showQueue[i];
      setSelected(item);
      setCameraPreset(item.category === 'Rockets' || item.category === 'Sky Shots' ? 'sky' : 'cinematic');
      ignite(item);
      await new Promise((r) => setTimeout(r, 2900));
    }

    setIsPlayingQueue(false);
  };

  const addToShowQueue = (cracker) => {
    if (showQueue.length >= 6) return;
    setShowQueue((prev) => [...prev, cracker]);
  };

  const removeFromShowQueue = (index) => {
    setShowQueue((prev) => prev.filter((_, i) => i !== index));
  };

  const clearShowQueue = () => {
    setShowQueue([]);
  };

  // Toggle Fullscreen on Mobile / Desktop
  const toggleFullscreen = () => {
    const el = document.querySelector('.stage-container');
    if (!el) return;
    if (!document.fullscreenElement) {
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  // Handle Sky Click Launch
  const handleSkyClick = (coords) => {
    setCount((prev) => prev + 1);
    setRecentSkyBurst(coords);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(30);
    }
    setTimeout(() => setRecentSkyBurst(null), 1200);
  };

  // Ring Festive Temple Bell
  const handleTempleBell = () => {
    soundEngine.playTempleBell();
  };

  // Toggle Ambient Festive Soundscape
  const handleToggleAmbient = () => {
    const nextState = !ambientActive;
    setAmbientActive(nextState);
    soundEngine.toggleAmbient(nextState);
  };

  // Copy Personalized Greeting
  const handleCopyGreeting = () => {
    const text = `🪔 Shubh Deepawali Wishes from ${senderName}! 🪔\n\n"${selectedWish}"\n\n✨ Celebrate virtually with 3D fireworks at DiwaliVerse 3D!`;
    navigator.clipboard.writeText(text);
    setCopiedGreeting(true);
    setTimeout(() => setCopiedGreeting(false), 2200);
  };

  return (
    <div className="app-shell">
      {/* ----------------- FESTIVE TOPBAR ----------------- */}
      <header className="topbar">
        <div className="brand-group">
          <div className="diya-badge" title="Shubh Deepawali">
            <span>🪔</span>
          </div>
          <div>
            <div className="brand-title">
              DIWALIVERSE <b>3D</b>
            </div>
            <div className="brand-sub">VIRTUAL FESTIVAL OF LIGHTS • 100% ECO-FRIENDLY</div>
          </div>
        </div>

        <div className="top-actions">
          {/* Greeting Card Maker */}
          <button
            className="action-pill card-btn"
            onClick={() => setGreetingModal(true)}
            title="Create Custom Diwali Greeting Card"
          >
            <Share2 size={14} />
            <span className="hide-on-xs">WISHES CARD</span>
          </button>

          {/* Ambient Festive Soundscape */}
          <button
            className={`action-pill ambient-btn ${ambientActive ? 'active' : ''}`}
            onClick={handleToggleAmbient}
            title="Toggle Meditative Diwali Tanpura Drone"
          >
            <Music size={14} />
            <span className="hide-on-xs">{ambientActive ? 'AMBIENT ON' : 'AMBIENT'}</span>
          </button>

          {/* Temple Bell */}
          <button
            className="action-pill bell-btn"
            onClick={handleTempleBell}
            title="Ring Ceremonial Temple Bell"
          >
            <Bell size={14} />
            <span className="hide-on-xs">BELL</span>
          </button>

          {/* Sound Mute & Volume */}
          <div className="sound-control-group">
            <button
              className="icon-btn"
              onClick={() => setMuted(!muted)}
              title={muted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={muted ? 0 : volume}
              onChange={(e) => {
                setMuted(false);
                setVolume(parseFloat(e.target.value));
              }}
              className="volume-slider"
              title="Volume"
            />
          </div>

          {/* Auto-Show Ladi Mode Toggle */}
          <button
            className={`action-pill auto-show-btn ${autoShow ? 'active' : ''}`}
            onClick={() => setAutoShow(!autoShow)}
            title="Auto-Ignite fireworks chain"
          >
            {autoShow ? <Pause size={14} /> : <Play size={14} />}
            <span className="hide-on-xs">{autoShow ? 'STOP SHOW' : 'AUTO SHOW'}</span>
          </button>

          {/* Total Bursts Counter */}
          <div className="burst-badge" title="Celebratory bursts ignited">
            <Sparkles size={15} className="spark-spin" />
            <span><b>{count}</b> <span className="hide-on-xs">BURSTS</span></span>
          </div>
        </div>
      </header>

      {/* ----------------- FESTIVE HERO GREETING ----------------- */}
      <section className="hero-banner">
        <div className="hero-content">
          <div className="festive-eyebrow">
            <span className="dot-pulse" /> शुभ दीपावली • FESTIVAL OF LIGHTS 2026
          </div>
          <h1 className="hero-heading">
            Light Up The <em>Virtual Night Sky.</em>
          </h1>
          <p className="hero-lead">
            Step into our 3D celebration arena. Choose from 83 handcrafted virtual firecrackers across 11 categories, build custom choreographed shows, and ignite them with zero smoke and pure festive magic!
          </p>

          <div className="hero-badges">
            <span className="hero-pill">
              <Zap size={14} /> 83 Procedural 3D Crackers
            </span>
            <span className="hero-pill">
              <ShieldCheck size={14} /> 100% Zero Pollution
            </span>
            <span className="hero-pill">
              <Sparkles size={14} /> Touch Gestures & Haptics
            </span>
            <span className="hero-pill">
              <Compass size={14} /> 360° Orbit Camera
            </span>
          </div>
        </div>

        <div className="hero-card-side">
          <div className="diwali-greeting-card">
            <div className="greeting-stars">✦ ✧ ✦</div>
            <div className="greeting-diya">🪔</div>
            <h3>HAPPY DIWALI</h3>
            <p>May your life be illuminated with joy, prosperity, good health and infinite light.</p>
            <div className="greeting-btn-row">
              <button
                className="btn-quick-ignite"
                onClick={() => {
                  setMobileTab('arena');
                  ignite();
                }}
                disabled={isLit}
              >
                <Flame size={15} /> QUICK BURST
              </button>
              <button
                className="btn-card-maker"
                onClick={() => setGreetingModal(true)}
              >
                CUSTOM CARD
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- MOBILE SEGMENTED CONTROL BAR ----------------- */}
      <div className="mobile-nav-pills">
        <button
          className={`mobile-tab-btn ${mobileTab === 'arena' ? 'active' : ''}`}
          onClick={() => setMobileTab('arena')}
        >
          <span>🪔</span> 3D ARENA
        </button>
        <button
          className={`mobile-tab-btn ${mobileTab === 'vault' ? 'active' : ''}`}
          onClick={() => setMobileTab('vault')}
        >
          <span>🎆</span> VAULT ({items.length})
        </button>
        <button
          className={`mobile-tab-btn ${mobileTab === 'playlist' ? 'active' : ''}`}
          onClick={() => setMobileTab('playlist')}
        >
          <span>📜</span> SHOW {showQueue.length > 0 ? `(${showQueue.length})` : ''}
        </button>
      </div>

      {/* ----------------- MAIN WORKSPACE ----------------- */}
      <main className={`workspace-layout mobile-tab-${mobileTab}`}>
        {/* LEFT PANEL: CRACKER COLLECTION */}
        <section className={`store-panel ${mobileTab === 'vault' ? 'show-on-mobile' : 'hide-on-mobile'}`}>
          <div className="panel-header">
            <div>
              <span className="sub-tag">AUTHENTIC CATALOG</span>
              <h2>Firecracker <em>Vault</em></h2>
            </div>
            <div className="count-pill">{items.length} ITEMS</div>
          </div>

          {/* Search Bar */}
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search rockets, anar, chakri, ladi, bombs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button className="clear-btn" onClick={() => setQuery('')}>
                <X size={15} />
              </button>
            )}
          </div>

          {/* Category Filter Tabs */}
          <div className="category-scroll">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-tab ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="cracker-grid">
            {items.map((cracker) => {
              const isSelected = selected && selected.id === cracker.id;
              const isQueued = showQueue.some((q) => q.id === cracker.id);

              return (
                <div
                  key={cracker.id}
                  className={`cracker-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    setSelected(cracker);
                    setIsLit(false);
                    // On mobile, tap switches to Arena view for instant viewing
                    if (window.innerWidth <= 900) {
                      setMobileTab('arena');
                    }
                  }}
                >
                  {/* Floating Tag */}
                  {cracker.tag && (
                    <span className="card-tag" style={{ borderColor: cracker.color }}>
                      {cracker.tag}
                    </span>
                  )}

                  {/* 3D Icon & Preview Visual */}
                  <div
                    className="card-icon-wrap"
                    style={{
                      background: `radial-gradient(circle, ${cracker.color}33 0%, #151128 75%)`,
                      borderColor: `${cracker.color}55`,
                    }}
                  >
                    <span className="card-emoji">{cracker.icon}</span>
                  </div>

                  <div className="card-info">
                    <h4 className="card-name">{cracker.name}</h4>
                    <span className="card-category">{cracker.category}</span>
                  </div>

                  <div className="card-stats">
                    <span>{cracker.stats.height}</span>
                    <span>•</span>
                    <span>{cracker.stats.sound}</span>
                  </div>

                  <div className="card-bottom">
                    <button
                      className="inspect-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectModal(cracker);
                      }}
                      title="Inspect 3D in close-up"
                    >
                      <Eye size={13} /> 3D LAB
                    </button>

                    <button
                      className={`queue-add-btn ${isQueued ? 'queued' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToShowQueue(cracker);
                      }}
                      title="Add to Grand Finale Show Playlist"
                    >
                      <ListPlus size={14} />
                    </button>

                    <span className="select-indicator">
                      {isSelected ? <Check size={14} /> : '+'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {items.length === 0 && (
            <div className="empty-state">
              <p>No firecrackers found matching "{query}".</p>
              <button onClick={() => { setCategory('All'); setQuery(''); }}>
                Reset Filters
              </button>
            </div>
          )}
        </section>

        {/* RIGHT PANEL: 3D CELEBRATION ARENA */}
        <section className={`arena-panel ${mobileTab === 'arena' ? 'show-on-mobile' : 'hide-on-mobile'}`}>
          <div className="panel-header">
            <div>
              <span className="sub-tag">REAL-TIME WEBGL 3D</span>
              <h2>Celebration <em>Arena</em></h2>
            </div>
            <div className="arena-status">
              <span className="live-indicator" /> LIVE 3D SCENE
            </div>
          </div>

          {/* Arena Viewport Container */}
          <div className="stage-container">
            {/* 3D Canvas */}
            <Fireworks
              selectedCracker={selected}
              isLit={isLit}
              burstTrigger={burstTrigger}
              cameraPreset={cameraPreset}
              autoRotate={autoRotate}
              onSkyClick={handleSkyClick}
            />

            {/* Top Overlay Controls: Camera View Switcher & Fullscreen */}
            <div className="stage-topbar">
              <div className="camera-pills">
                <button
                  className={`cam-btn ${cameraPreset === 'cinematic' ? 'active' : ''}`}
                  onClick={() => setCameraPreset('cinematic')}
                >
                  CINEMATIC
                </button>
                <button
                  className={`cam-btn ${cameraPreset === 'closeup' ? 'active' : ''}`}
                  onClick={() => setCameraPreset('closeup')}
                >
                  3D CLOSEUP
                </button>
                <button
                  className={`cam-btn ${cameraPreset === 'sky' ? 'active' : ''}`}
                  onClick={() => setCameraPreset('sky')}
                >
                  SKY CAM
                </button>
                <button
                  className={`cam-btn ${cameraPreset === 'top' ? 'active' : ''}`}
                  onClick={() => setCameraPreset('top')}
                >
                  BIRD'S EYE
                </button>
              </div>

              <div className="stage-top-right">
                <button
                  className="cam-btn fullscreen-btn"
                  onClick={toggleFullscreen}
                  title="Fullscreen 3D Mode"
                >
                  <Maximize2 size={13} /> <span className="hide-on-mobile-xs">FULLSCREEN</span>
                </button>
                <button
                  className={`cam-btn rotate-toggle ${autoRotate ? 'active' : ''}`}
                  onClick={() => setAutoRotate(!autoRotate)}
                  title="Auto-Rotate 360°"
                >
                  <RotateCcw size={13} /> <span className="hide-on-mobile-xs">360° TURNTABLE</span>
                </button>
              </div>
            </div>

            {/* Sky Click / Tap Hint Banner */}
            <div className="sky-hint">
              <Sparkles size={14} /> Tap anywhere in the night sky to launch instant fireworks!
            </div>

            {/* Fuse Status Banner */}
            {isLit && (
              <div className="fuse-warning-banner">
                <Flame size={18} className="flame-flicker" />
                <span>FUSE LIT — STAND BACK! CELEBRATION IMMINENT</span>
              </div>
            )}

            {/* Bottom Controls Bar */}
            <div className="stage-bottom-bar">
              {/* Selected Cracker Details */}
              <div className="selected-meta">
                <div
                  className="selected-icon"
                  style={{
                    background: `${selected.color}25`,
                    borderColor: `${selected.color}77`,
                  }}
                >
                  {selected.icon}
                </div>
                <div>
                  <div className="selected-title">{selected.name}</div>
                  <div className="selected-cat">
                    {selected.category} • {selected.stats.height} • {selected.stats.sound}
                  </div>
                </div>
              </div>

              {/* Custom Burst Color Selector */}
              <div className="burst-color-picker" title="Choose Burst Sparkle Color">
                <small>BURST COLOR:</small>
                <div className="color-dots">
                  {BURST_COLORS.map((bc) => {
                    const isPicked =
                      (bc.color === null && customBurstColor === null) ||
                      bc.color === customBurstColor;
                    return (
                      <button
                        key={bc.name}
                        className={`color-dot ${isPicked ? 'active' : ''}`}
                        style={{
                          backgroundColor: bc.color || selected.color,
                        }}
                        onClick={() => setCustomBurstColor(bc.color)}
                        title={`Burst Color: ${bc.label}`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Master Ignite Trigger */}
              <div className="ignite-cluster">
                <button
                  className={`master-ignite-btn ${isLit ? 'lit-anim' : ''}`}
                  onClick={() => ignite()}
                  disabled={isLit}
                >
                  <Flame size={20} className={isLit ? 'fuse-spark-spin' : ''} />
                  <span>{isLit ? 'BURNING FUSE...' : 'IGNITE CRACKER'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Quick Cracker Switcher Carousel */}
          <div className="mobile-quick-strip">
            <span className="quick-label">QUICK PICK:</span>
            <div className="quick-items-scroll">
              {crackers.slice(0, 24).map((c) => (
                <button
                  key={c.id}
                  className={`quick-chip ${selected.id === c.id ? 'active' : ''}`}
                  onClick={() => setSelected(c)}
                >
                  <span>{c.icon}</span>
                  <b>{c.name}</b>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Cracker Specs / Features Card */}
          <div className="specs-card">
            <div className="specs-header">
              <div>
                <h4>{selected.name} — Technical Specifications</h4>
                <p>{selected.description}</p>
              </div>
              <div className="eco-badge">
                <ShieldCheck size={15} /> 100% ECO GREEN
              </div>
            </div>

            <div className="specs-grid">
              <div className="spec-item">
                <small>BURST ALTITUDE</small>
                <b>{selected.stats.height}</b>
              </div>
              <div className="spec-item">
                <small>SOUND SIGNATURE</small>
                <b>{selected.stats.sound}</b>
              </div>
              <div className="spec-item">
                <small>BURST DURATION</small>
                <b>{selected.stats.duration}</b>
              </div>
              <div className="spec-item">
                <small>ENVIRONMENTAL IMPACT</small>
                <b className="green-txt">0g Carbon • Pet Safe</b>
              </div>
            </div>
          </div>

          {/* Interactive Navigation Guide */}
          <div className="guide-card">
            <div className="guide-icon">
              <Compass size={20} />
            </div>
            <div className="guide-text">
              <b>Touch & Orbit Controls</b>
              <p>
                • <b>One-Finger Drag:</b> Rotate view in full 360° around the cracker & courtyard.<br />
                • <b>Pinch In / Out:</b> Smoothly zoom into the fine 3D details.<br />
                • <b>Tap Night Sky:</b> Launch spontaneous fireworks bursts at that exact point in 3D space!
              </p>
            </div>
            <button
              className="reset-cam-btn"
              onClick={() => setCameraPreset('cinematic')}
              title="Reset View"
            >
              <RotateCcw size={15} /> Reset View
            </button>
          </div>
        </section>

        {/* PLAYLIST VIEW (Shown on mobile tab or desktop tray) */}
        <section className={`playlist-panel ${mobileTab === 'playlist' ? 'show-on-mobile' : 'hide-on-mobile'}`}>
          <div className="show-queue-tray">
            <div className="queue-header">
              <div>
                <b>✦ CHOREOGRAPHED SHOW PLAYLIST ({showQueue.length}/6)</b>
                <p>Fires in custom choreographed sequence with dynamic aerial camera tracking!</p>
              </div>
              <div className="queue-actions">
                <button
                  className="launch-queue-btn"
                  onClick={launchShowQueue}
                  disabled={isPlayingQueue || showQueue.length === 0}
                >
                  <Play size={14} /> {isPlayingQueue ? 'SHOW IN PROGRESS...' : 'LAUNCH FINALE SHOW'}
                </button>
                <button
                  className="clear-queue-btn"
                  onClick={clearShowQueue}
                  disabled={isPlayingQueue || showQueue.length === 0}
                  title="Clear Playlist"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {showQueue.length === 0 ? (
              <div className="empty-queue-hint">
                <p>No firecrackers queued yet. Click the <b>+ (ListPlus)</b> button on any cracker card in the Vault to add them to your custom show!</p>
                <button
                  className="btn-browse-vault"
                  onClick={() => setMobileTab('vault')}
                >
                  Browse Cracker Vault
                </button>
              </div>
            ) : (
              <div className="queue-pills">
                {showQueue.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="queue-chip">
                    <span>{item.icon}</span>
                    <b>{item.name}</b>
                    <button onClick={() => removeFromShowQueue(idx)}>
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ----------------- 3D CRACKER LAB MODAL ----------------- */}
      {inspectModal && (
        <div className="modal-backdrop" onClick={() => setInspectModal(null)}>
          <div className="lab-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-close-row">
              <span className="modal-tag">3D CRACKER LAB</span>
              <button className="modal-close" onClick={() => setInspectModal(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="lab-content">
              <div className="lab-icon-hero" style={{ borderColor: inspectModal.color }}>
                <span style={{ filter: `drop-shadow(0 0 20px ${inspectModal.color})` }}>
                  {inspectModal.icon}
                </span>
              </div>

              <h3>{inspectModal.name}</h3>
              <p className="lab-desc">{inspectModal.description}</p>

              <div className="lab-specs-box">
                <div className="lab-stat">
                  <small>CATEGORY</small>
                  <b>{inspectModal.category}</b>
                </div>
                <div className="lab-stat">
                  <small>BURST ALTITUDE</small>
                  <b>{inspectModal.stats.height}</b>
                </div>
                <div className="lab-stat">
                  <small>SOUND LEVEL</small>
                  <b>{inspectModal.stats.sound}</b>
                </div>
                <div className="lab-stat">
                  <small>ESTIMATED DURATION</small>
                  <b>{inspectModal.stats.duration}</b>
                </div>
              </div>

              <div className="lab-actions">
                <button
                  className="btn-lab-fire"
                  onClick={() => {
                    setSelected(inspectModal);
                    setCameraPreset('closeup');
                    setInspectModal(null);
                    setMobileTab('arena');
                    ignite(inspectModal);
                  }}
                >
                  <Flame size={16} /> TEST FIRE IN ARENA
                </button>
                <button
                  className="btn-lab-queue"
                  onClick={() => {
                    addToShowQueue(inspectModal);
                    setInspectModal(null);
                  }}
                >
                  <ListPlus size={16} /> ADD TO SHOW QUEUE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- PERSONALIZED GREETING CARD MODAL ----------------- */}
      {greetingModal && (
        <div className="modal-backdrop" onClick={() => setGreetingModal(false)}>
          <div className="greeting-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-close-row">
              <span className="modal-tag">DIWALI GREETING CARD GENERATOR</span>
              <button className="modal-close" onClick={() => setGreetingModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="greeting-preview-card">
              <div className="card-diya-glow">🪔</div>
              <h2>शुभ दीपावली • HAPPY DIWALI</h2>
              <p className="card-wish-text">"{selectedWish}"</p>
              <div className="card-signature">— Warmest Wishes From <b>{senderName || 'Your Name'}</b></div>
              <div className="card-footer-mark">✦ CELEBRATED SAFELY WITH DIWALIVERSE 3D ✦</div>
            </div>

            <div className="greeting-controls">
              <label>Your Name / Family Name:</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Aryan Jangir & Family"
                className="greeting-input"
              />

              <label>Choose Festive Greeting:</label>
              <div className="wishes-selector">
                {PRESET_WISHES.map((w, idx) => (
                  <button
                    key={idx}
                    className={`wish-option ${selectedWish === w ? 'active' : ''}`}
                    onClick={() => setSelectedWish(w)}
                  >
                    {w}
                  </button>
                ))}
              </div>

              <button className="btn-copy-wish" onClick={handleCopyGreeting}>
                {copiedGreeting ? <Check size={16} /> : <Copy size={16} />}
                <span>{copiedGreeting ? 'COPIED TO CLIPBOARD!' : 'COPY WISHES TO SHARE'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- FESTIVE FOOTER ----------------- */}
      <footer className="festive-footer">
        <div className="footer-left">
          <span>✦ DIWALIVERSE 3D</span>
          <span className="dot">•</span>
          <span>AN IMMERSIVE VIRTUAL FESTIVAL CELEBRATION</span>
        </div>
        <div className="footer-center">
          <span>SAFE FOR PETS · SAFE FOR ELDERS · PURE JOY</span>
        </div>
        <div className="footer-right">
          <span>शुभ दीपावली • WISHING YOU INFINITE HAPPINESS</span>
        </div>
      </footer>
    </div>
  );
}
