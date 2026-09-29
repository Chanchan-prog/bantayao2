import React, { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { ArrowDown, ArrowRight, Activity, BookOpen, Check, ChevronRight, CircleDot, Code2, Database, ExternalLink, Fingerprint, GraduationCap, LockKeyhole, Mail, Menu, Moon, Mouse, Network, Radio, Shield, ShieldCheck, Sun, TerminalSquare, Wrench, X, Github, Linkedin, Globe2, Server, Cpu, Gauge, Wifi, Layers3, Send, Radar, Crosshair, Pause, Play } from 'lucide-react';
import { profile, sections, skills, projects, projectCaseStudies, projectSlug, certifications, tools } from './data';
import CyberNetwork from './CyberNetwork.jsx';
import SecurityLab from './SecurityLab.jsx';

const iconMap = { ShieldCheck, Network, TerminalSquare, Code2, Database, Wrench };
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Icon({ name, ...props }) { const Component = iconMap[name] || Shield; return <Component {...props} />; }

function SectionHeading({ number, label, title, caption }) {
  return <div className="section-heading reveal">
    <div className="section-index"><span>{number}</span><i />{label}</div>
    <div><p className="eyebrow">MODULE {number} / {label.toUpperCase()}</p><h2>{title}</h2>{caption && <p className="section-caption">{caption}</p>}</div>
  </div>;
}

function Frame({ children, className = '', ...props }) { return <div className={`frame ${className}`} {...props}>{children}</div>; }

function Header({ active, scrolled, direction, theme, themeBusy, onThemeChange, paused, onPauseChange, homePrefix = '' }) {
  const [open, setOpen] = useState(false);
  return <header className={`site-header ${scrolled ? 'is-scrolled' : ''} ${direction === 'down' ? 'is-compressed' : ''}`}>
    <a href={`${homePrefix}#home`} className="brand" aria-label="Christian Bantayao, home" onClick={() => setOpen(false)}><span className="brand-mark">CB<span className="brand-corner corner-a"/><span className="brand-corner corner-b"/></span><span className="brand-copy"><strong>CHRISTIAN BANTAYAO</strong><small>BSIT STUDENT / CYBERSECURITY</small></span></a>
    <nav className={`main-nav ${open ? 'open' : ''}`} aria-label="Main navigation">{sections.map((s, i) => <a key={s} className={active === i ? 'active' : ''} href={`${homePrefix}#${s.toLowerCase()}`} onClick={() => setOpen(false)}><small>{String(i + 1).padStart(2, '0')}.</small><span>{s}</span></a>)}</nav>
    <div className="header-status"><span className="status-dot" /> PORTFOLIO DEMO <span className="status-bars"><i/><i/><i/></span></div>
    <button className="theme-toggle" type="button" onClick={onThemeChange} disabled={themeBusy} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} aria-pressed={theme === 'light'} aria-busy={themeBusy} title={theme === 'dark' ? 'Light mode' : 'Dark mode'}>{theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}</button>
    <button className="motion-toggle" type="button" onClick={onPauseChange} aria-label={paused ? 'Resume animations' : 'Pause animations'} aria-pressed={paused} title={paused ? 'Resume animations' : 'Pause animations'}>{paused ? <Play size={17}/> : <Pause size={17}/>}<span>{paused ? 'PLAY' : 'PAUSE'}</span></button>
    <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>{open ? <X/> : <Menu/>}</button>
  </header>;
}

function ScrollProgress({ progress, active }) {
  const [hidden, setHidden] = useState(() => {
    try { return localStorage.getItem('section-nav-hidden') === '1'; }
    catch { return false; }
  });
  const toggle = () => setHidden(current => {
    const next = !current;
    try { localStorage.setItem('section-nav-hidden', next ? '1' : '0'); }
    catch { /* Keep the control usable when storage is unavailable. */ }
    return next;
  });
  return <>
    <div className="scroll-progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>
    <nav className={`side-nav ${hidden ? 'is-collapsed' : ''}`} aria-label="Section navigation">
      <div className="side-nav-header">
        <div className="side-nav-title" aria-hidden={hidden}><Crosshair size={12}/> SECTION NAVIGATION</div>
        <button className="side-nav-toggle" type="button" onClick={toggle} aria-label={hidden ? 'Show section navigation' : 'Hide section navigation'} aria-expanded={!hidden} aria-controls="section-nav-links" title={hidden ? 'Show section navigation' : 'Hide section navigation'}><span className="side-nav-toggle-icon" aria-hidden="true"><X className="nav-close-icon" size={15}/><Menu className="nav-open-icon" size={15}/></span><span className="side-nav-toggle-text">MENU</span></button>
      </div>
      <div className="side-nav-links" id="section-nav-links" aria-hidden={hidden} inert={hidden}><span className="side-nav-current" style={{transform:`translateY(${active*40}px)`}} aria-hidden="true"/>{sections.map((s,i)=><a key={s} href={`#${s.toLowerCase()}`} className={active===i?'active':''} aria-current={active===i?'location':undefined} tabIndex={hidden?-1:undefined}><span className="side-dot"/><b>{String(i+1).padStart(2,'0')}</b><span>{s}</span></a>)}</div>
      <div className="side-nav-bottom" aria-hidden={hidden}>SYS / NAV <span>ONLINE</span></div>
    </nav>
  </>;
}

function TransitionOverlay({ transition }) {
  const { text, id, type, direction } = transition;
  return <>
    <span className="sr-only" role="status" aria-live="polite">{text}</span>
    {text && <div key={id} className={`module-transition variant-${type} ${direction === 'up' ? 'reverse' : ''}`} aria-hidden="true">
      {(type === 'scan' || type === 'modules' || type === 'data') && <div className="transition-label"><span className="transition-led" />{text}</div>}
      {type === 'scan' && <><span className="transition-scan-line"/><span className="transition-scan-code">USER / PROFILE / VERIFIED</span></>}
      {type === 'modules' && <div className="transition-modules">{['01','02','03','04','05','06'].map((number,i)=><span key={number} style={{'--step':i}}>{number}<i/></span>)}</div>}
      {type === 'data' && <div className="transition-data">{['01100110 // TCP 443 // HTTPS // AUTH // ACL','SSH // VLAN // PACKET // 10110100 // FIREWALL','00101011 // DEPLOYMENT / 04 // VERIFIED'].map((line,i)=><span key={line} style={{'--step':i}}>{line}</span>)}</div>}
      {type === 'terminal' && <div className="transition-terminal"><div className="transition-terminal-title"><TerminalSquare size={13}/> ACADEMIC_RECORDS.EXE <span>● ● ●</span></div>{['> retrieving academic records...','> validating training history...','> record found.','> access granted.'].map((line,i)=><p key={line} style={{'--step':i}}>{line}</p>)}</div>}
      {type === 'secure' && <div className="transition-channel"><span className="channel-line channel-left"/><div className="channel-status"><ShieldCheck size={19}/><span>ESTABLISHING SECURE CHANNEL...<b>● CONNECTION SECURE</b></span></div><span className="channel-line channel-right"/></div>}
    </div>}
  </>;
}

function Intro({ done }) {
  const [visible, setVisible] = useState(!sessionStorage.getItem('portfolio-intro-seen'));
  const [line, setLine] = useState(0);
  useEffect(() => { if (!visible) { done(); return; } const timer = setInterval(() => setLine(v => Math.min(v+1, 5)), 220); const end = setTimeout(() => { setVisible(false); sessionStorage.setItem('portfolio-intro-seen','1'); done(); }, 1550); return () => { clearInterval(timer); clearTimeout(end); }; }, []);
  if (!visible) return null;
  const messages = ['INITIALIZING PORTFOLIO...', 'LOADING SECURITY MODULES...', 'NETWORK STATUS: ONLINE', 'VERIFYING USER...', 'ACCESS GRANTED'];
  return <div className="intro-screen" role="status" aria-label="Loading portfolio"><div className="intro-box"><div className="intro-mark">[ CB ]</div>{messages.map((m,i)=><p key={m} className={i<=line?'shown':''}><span>&gt;</span> {m}</p>)}<div className="intro-track"><span style={{width:`${Math.min((line+1)*20,100)}%`}}/></div></div></div>;
}

function CustomCursor({ paused }) {
  const dot=useRef(null), ring=useRef(null), label=useRef(null), glow=useRef(null);
  const position=useRef({x:-100,y:-100,rx:-100,ry:-100});
  useEffect(() => {
    if (paused || reduceMotion() || !window.matchMedia('(pointer: fine)').matches) return;
    const current=position.current;
    dot.current.style.transform=`translate3d(${current.x}px,${current.y}px,0)`;
    ring.current.style.transform=`translate3d(${current.rx}px,${current.ry}px,0)`;
    glow.current.style.transform=`translate3d(${current.rx}px,${current.ry}px,0)`;
    let raf=0;
    const frame=()=>{raf=0;current.rx+=(current.x-current.rx)*.22;current.ry+=(current.y-current.ry)*.22;ring.current.style.transform=`translate3d(${current.rx}px,${current.ry}px,0)`;glow.current.style.transform=`translate3d(${current.rx}px,${current.ry}px,0)`;if(Math.hypot(current.x-current.rx,current.y-current.ry)>.45)raf=requestAnimationFrame(frame);};
    const move=e=>{current.x=e.clientX;current.y=e.clientY;dot.current.style.transform=`translate3d(${current.x}px,${current.y}px,0)`;if(!raf)raf=requestAnimationFrame(frame);};
    const enter=e=>{const target=e.target.closest('[data-cursor],a,button');const state=target?.dataset.cursor || (target?.tagName==='A'?'GO':target?.tagName==='BUTTON'?'OPEN':'');ring.current.dataset.state=state? 'active':'';label.current.textContent=state;};
    window.addEventListener('pointermove',move,{passive:true});document.addEventListener('pointerover',enter);return()=>{window.removeEventListener('pointermove',move);document.removeEventListener('pointerover',enter);cancelAnimationFrame(raf);};
  },[paused]);
  useEffect(()=>{if(!paused)return;const remember=e=>{position.current.x=e.clientX;position.current.y=e.clientY;position.current.rx=e.clientX;position.current.ry=e.clientY;};window.addEventListener('pointermove',remember,{passive:true});return()=>window.removeEventListener('pointermove',remember);},[paused]);
  return <><div ref={glow} className="cursor-glow" aria-hidden="true"/><div ref={dot} className="cursor-dot" aria-hidden="true"/><div ref={ring} className="cursor-ring" aria-hidden="true"><span ref={label}/></div></>;
}

function CyberGlobe({ paused }) {
  const canvas=useRef(null),wrap=useRef(null);
  useEffect(()=>{
    const el=canvas.current,container=wrap.current,ctx=el.getContext('2d');
    const motion=reduceMotion() || paused;
    let raf=0,lastDraw=0,visible=false,angle=.45,target=.45,mouse=0;
    const onMove=e=>{const r=container.getBoundingClientRect();mouse=((e.clientX-r.left)/r.width-.5)*.16;};
    const resize=()=>{const d=Math.min(window.devicePixelRatio||1,1.5),s=el.clientWidth;el.width=Math.round(s*d);el.height=Math.round(s*d);ctx.setTransform(d,0,0,d,0,0);if(visible||motion)draw(performance.now());};
    const points=[];for(let lat=-75;lat<=75;lat+=15)for(let lon=0;lon<360;lon+=15)points.push([lat*Math.PI/180,lon*Math.PI/180]);
    const draw=now=>{const w=el.clientWidth,h=el.clientHeight,cx=w/2,cy=h/2,R=Math.min(w,h)*.39;ctx.clearRect(0,0,w,h);angle+=(target+mouse-angle)*.036;if(!motion)target+=.003;lastDraw=now;
      const grad=ctx.createRadialGradient(cx,cy,20,cx,cy,R*1.16);grad.addColorStop(0,'rgba(0,93,160,.13)');grad.addColorStop(.72,'rgba(0,45,96,.08)');grad.addColorStop(1,'rgba(0,229,255,0)');ctx.fillStyle=grad;ctx.beginPath();ctx.arc(cx,cy,R*1.18,0,7);ctx.fill();
      ctx.strokeStyle='rgba(0,190,255,.14)';ctx.lineWidth=.7;for(let lat=-60;lat<=60;lat+=30){ctx.beginPath();for(let l=0;l<=360;l+=6){const a=lat*Math.PI/180,b=l*Math.PI/180+angle,z=Math.cos(a)*Math.cos(b),x=cx+R*Math.cos(a)*Math.sin(b),y=cy-R*Math.sin(a);if(z>=0){if(l===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}else ctx.moveTo(x,y);}ctx.stroke();}
      for(let lon=0;lon<180;lon+=30){ctx.beginPath();let began=false;for(let lat=-90;lat<=90;lat+=4){const a=lat*Math.PI/180,b=lon*Math.PI/180+angle,z=Math.cos(a)*Math.cos(b),x=cx+R*Math.cos(a)*Math.sin(b),y=cy-R*Math.sin(a);if(z>=0){if(!began)ctx.moveTo(x,y);else ctx.lineTo(x,y);began=true;}else began=false;}ctx.stroke();}
      const visible=[];points.forEach(([a,b],i)=>{const t=b+angle,z=Math.cos(a)*Math.cos(t);if(z<0)return;const x=cx+R*Math.cos(a)*Math.sin(t),y=cy-R*Math.sin(a);visible.push({x,y,i});ctx.fillStyle=i%11===0?'#e7fcff':'rgba(0,195,255,.65)';ctx.beginPath();ctx.arc(x,y,i%11===0?2.1:1,0,7);ctx.fill();});
      ctx.strokeStyle='rgba(0,155,255,.2)';visible.filter(v=>v.i%13===0).forEach((v,i,arr)=>{const n=arr[(i+3)%arr.length];if(!n)return;ctx.beginPath();ctx.moveTo(v.x,v.y);ctx.lineTo(n.x,n.y);ctx.stroke();});
      ctx.strokeStyle='rgba(0,229,255,.28)';ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.stroke();
    };
    const frame=now=>{raf=0;if(!visible||document.hidden||motion)return;if(now-lastDraw>=32)draw(now);raf=requestAnimationFrame(frame);};
    const start=()=>{cancelAnimationFrame(raf);raf=0;if(visible&&!document.hidden){draw(performance.now());if(!motion)raf=requestAnimationFrame(frame);}};
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)start();else{cancelAnimationFrame(raf);raf=0;}},{rootMargin:'80px'});
    const onVisibility=()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else start();};
    resize();observer.observe(container);window.addEventListener('resize',resize);document.addEventListener('visibilitychange',onVisibility);container.addEventListener('pointermove',onMove);
    return()=>{cancelAnimationFrame(raf);observer.disconnect();window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',onVisibility);container.removeEventListener('pointermove',onMove);};
  },[paused]);
  return <div className="globe-wrap" ref={wrap}><div className="globe-orbit orbit-one"/><div className="globe-orbit orbit-two"/><canvas ref={canvas} className="globe-canvas" role="img" aria-label="Animated wireframe globe showing a connected network"/><div className="globe-label label-left">NODE_04 <span>● ACTIVE</span></div><div className="globe-label label-right">GLOBAL THREAT MONITOR <span>● ILLUSTRATIVE DATA</span></div><div className="globe-bottom">GLOBAL NETWORK // ENCRYPTED CONNECTION</div></div>;
}

function MiniChart({ bars=false }) { return <div className={`mini-chart ${bars?'with-bars':''}`} aria-hidden="true"><svg viewBox="0 0 280 70" preserveAspectRatio="none"><defs><linearGradient id={bars?'chart-b':'chart-a'} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#00e5ff" stopOpacity=".28"/><stop offset="1" stopColor="#00e5ff" stopOpacity="0"/></linearGradient></defs><path d="M0 46 L19 42 34 46 49 27 65 40 82 38 98 50 116 34 132 41 150 17 167 28 183 20 198 39 216 32 233 15 249 27 266 22 280 31 L280 70 L0 70Z" fill={`url(#${bars?'chart-b':'chart-a'})`}/><polyline points="0,46 19,42 34,46 49,27 65,40 82,38 98,50 116,34 132,41 150,17 167,28 183,20 198,39 216,32 233,15 249,27 266,22 280,31" fill="none" stroke="#00dfff" strokeWidth="1.5"/></svg>{bars&&<div className="chart-bars">{[36,49,28,55,44,72,51,83,64,47,75,92,61,80].map((h,i)=><i key={i} style={{height:`${h}%`}}/>)}</div>}</div>; }

function MonitorPanels() { return <div className="monitor-panels"><p className="demo-disclosure">SIMULATED DASHBOARD / ILLUSTRATIVE DATA</p>
  <Frame className="monitor-panel traffic"><div className="panel-title"><Radio size={12}/> SAMPLE NETWORK TRAFFIC <span>● LIVE</span></div><MiniChart bars/><div className="panel-foot"><span>INBOUND <b>24.8 MB/S</b></span><span>OUTBOUND <b>12.3 MB/S</b></span></div></Frame>
  <Frame className="monitor-panel firewall"><ShieldCheck size={31}/><div><div className="panel-title">DEMO FIREWALL STATUS</div><strong>ACTIVE</strong></div><span className="monitor-ping">PROTECTED</span></Frame>
  <Frame className="monitor-panel integrity"><div className="panel-title"><LockKeyhole size={12}/> DEMO SYSTEM INTEGRITY</div><div className="integrity-body"><div className="donut">100%</div><div className="integrity-list">{['System Files','Configurations','Critical Services','Database'].map(x=><div key={x}><Check size={12}/><span>{x}</span><b>OK</b></div>)}</div></div></Frame>
  <Frame className="monitor-panel threat"><div className="panel-title"><Activity size={12}/> SAMPLE THREAT DETECTION</div><div className="threat-body"><MiniChart/><div>{[['Malware','0'],['Intrusion Attempts','0'],['Suspicious Activity','0'],['Blocked Threats','12']].map(([n,v])=><p key={n}><span>{n}</span><b className={v==='12'?'green':''}>{v}</b></p>)}</div></div></Frame>
  </div>; }

function Hero({paused}) { return <section id="home" className="hero module-section"><div className="hero-ambient"/><div className="container hero-grid"><div className="hero-copy"><div className="hero-kicker"><span className="square-led"/> SYSTEM OVERVIEW <i/> 001 / 006</div><div className="hero-title"><span>CHRISTIAN</span><strong>BANTAYAO</strong></div><p className="hero-role">BSIT STUDENT <span>/</span> CYBERSECURITY</p><p className="hero-year">4TH YEAR</p><p className="hero-description">Exploring technology. Securing systems. <br/>Building a safer digital future.</p><div className="hero-actions"><a className="button button-primary magnetic" href="#projects" data-cursor="OPEN">VIEW MY WORK <ArrowRight size={18}/></a><a className="button button-secondary magnetic" href="#contact" data-cursor="OPEN">CONTACT ME <ArrowRight size={18}/></a></div><div className="hero-terminal"><span>&gt;</span> DETECT <i/> ANALYZE <i/> PREVENT <i/> SECURE<span className="blink">_</span></div></div><div className="hero-visual"><CyberGlobe paused={paused}/><div className="hero-chips">{[[GraduationCap,'4TH YEAR'],[ShieldCheck,'CYBERSECURITY'],[Code2,'WEB TECHNOLOGIES'],[Network,'NETWORKING'],[Crosshair,'PROBLEM SOLVING']].map(([C,t])=><div key={t}><C size={15}/>{t}</div>)}</div></div><MonitorPanels/></div><a href="#about" className="scroll-cue"><Mouse size={20}/><span>SCROLL TO EXPLORE</span><ArrowDown size={16}/></a><div className="hero-bottom"><span>SECURE CONNECTION ESTABLISHED</span><span>01 // SYSTEM OVERVIEW</span></div></section>; }

const approaches=[[BookOpen,'Learn','Understand systems, find new things, and explore emerging technologies.'],[Cpu,'Practice','Build real projects, solve challenges, and gain hands-on experience.'],[Gauge,'Improve','Keep learning, strengthen skills, and apply best practices.'],[ShieldCheck,'Secure','Use knowledge to create safer systems and a more secure digital future.']];
function About(){return <section id="about" className="module-section content-section"><div className="container"><SectionHeading number="02" label="ABOUT" title="Behind the system" caption="A curious mind focused on building, understanding, and securing technology."/><div className="about-grid"><Frame className="about-story reveal"><p className="small-label">// USER PROFILE</p><h3>ABOUT ME</h3><p>I'm a motivated 4th-year BSIT student with a strong interest in cybersecurity, web development, networking, databases, and system administration.</p><p>I enjoy learning how systems work, building practical projects, and solving real-world IT problems. Every project is a chance to make technology more reliable and secure.</p><a className="text-link" href="#education" data-cursor="GO">EXPLORE MY BACKGROUND <ArrowRight size={16}/></a><span className="story-watermark">CB/02</span></Frame><Frame className="soc-visual reveal" role="img" aria-label="Illustration of a security operations center with monitoring screens"><div className="soc-ceiling"/><div className="soc-screen-row">{Array.from({length:6},(_,i)=><div key={i} className="soc-screen"><span/><span/><span/></div>)}</div><div className="soc-desk"/><div className="soc-person"/><div className="soc-caption">PEOPLE<br/><b>PROTECT</b><br/>SYSTEMS<br/><b>STAY SECURE</b></div><div className="soc-id">SOC / ACTIVE MONITORING</div></Frame></div><div className="approach-heading reveal"><span className="small-label">// METHODOLOGY</span><h3>MY APPROACH</h3><span className="approach-line"/></div><div className="approach-grid">{approaches.map(([C,title,body],i)=><Frame className="approach-card reveal" key={title} data-cursor="EXPLORE"><div className="approach-top"><C size={27}/><span>0{i+1}</span></div><h4>{title}</h4><p>{body}</p></Frame>)}</div></div></section>}

function SkillCard({skill,index}){const ref=useRef(null);useEffect(()=>{if(reduceMotion()||!window.matchMedia('(pointer:fine)').matches)return;const el=ref.current;const move=e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;el.style.setProperty('--spot-x',`${x*100}%`);el.style.setProperty('--spot-y',`${y*100}%`);el.style.transform=`perspective(800px) rotateX(${(0.5-y)*3}deg) rotateY(${(x-.5)*3}deg)`;};const leave=()=>{el.style.transform='';};el.addEventListener('pointermove',move);el.addEventListener('pointerleave',leave);return()=>{el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave);};},[]);return <Frame className="skill-card reveal" ref={ref} data-cursor="EXPLORE"><div className="skill-card-head"><Icon name={skill.icon} size={31}/><span>0{index+1}</span></div><h3>{skill.title}</h3><ul>{skill.items.map(item=><li key={item}>{item}</li>)}</ul><div className="skill-card-bottom">CAPABILITY MODULE <span>ACTIVE</span></div></Frame>}
function Skills(){return <section id="skills" className="module-section content-section"><div className="container"><SectionHeading number="03" label="SKILLS" title="Technical capabilities" caption="A practical toolkit shaped by coursework, experiments, and hands-on projects."/><div className="skills-layout"><div className="skills-grid">{skills.map((s,i)=><SkillCard key={s.title} skill={s} index={i}/>)}</div><Frame className="skill-levels reveal"><div className="panel-heading"><span className="small-label">// CAPABILITY INDEX</span><h3>SKILL LEVEL</h3></div><p className="levels-note">Visual portfolio indicators</p>{skills.map((s,i)=><div className="level-row" key={s.title} style={{'--i':i}}><div><span>{s.title}</span><b>{s.level}%</b></div><div className="level-track"><i style={{'--level':`${s.level}%`}}/></div></div>)}<div className="levels-footer"><Activity size={13}/> ALL SYSTEMS OPERATIONAL</div></Frame></div></div></section>}

function ProjectVisual({type}){if(type==='network')return <div className="project-art network-art"><div className="network-links"><svg viewBox="0 0 300 165" preserveAspectRatio="none"><path d="M150 82L57 34M150 82L62 130M150 82L245 36M150 82L240 130M57 34L62 130M245 36L240 130"/></svg></div>{[[50,28],[150,82],[62,127],[245,36],[240,130],[150,26],[150,139]].map(([x,y],i)=><span key={i} className={`network-device dev-${i}`} style={{left:`${x/3}%`,top:`${y/1.65}%`}}>{i===1?<Network size={18}/>:i===5?<Server size={16}/>:<Cpu size={14}/>}</span>)}<div className="art-label">SECURE VLAN TOPOLOGY</div></div>;if(type==='dashboard')return <div className="project-art dashboard-art"><div className="mock-sidebar"><i/><i/><i/><i/><i/></div><div className="mock-content"><div className="mock-top"><span>Attendance Analytics</span><b>● LIVE</b></div><div className="mock-stats"><i/><i/><i/></div><div className="mock-chart">{[36,52,41,70,55,84,65,78,91,73,88,68].map((n,i)=><span key={i} style={{height:`${n}%`}}/>)}</div><div className="mock-lines"><i/><i/><i/></div></div></div>;return <div className="project-art schedule-art"><div className="schedule-top"><span>Teacher-Room Monitoring</span><b>STATUS: ACTIVE</b></div><div className="schedule-metrics"><i/><i/><i/></div><div className="schedule-table"><div className="schedule-head">{['TEACHER','ROOM','TIME','STATUS'].map(x=><span key={x}>{x}</span>)}</div>{Array.from({length:5},(_,i)=><div key={i}><span className="line-long"/><span className="line-short"/><span className="line-short"/><span className="status-pill"/></div>)}</div></div>}
function AnimatedStat({value,paused=false}){const match=/^(\d+)(.*)$/.exec(value);const [shown,setShown]=useState(match&&!reduceMotion()&&!paused?`0${match[2]}`:value);const ref=useRef(null);useEffect(()=>{if(paused){setShown(value);return;}if(!match||reduceMotion())return;let raf=0;const observer=new IntersectionObserver(([entry])=>{if(!entry.isIntersecting)return;observer.disconnect();const start=performance.now(),target=Number(match[1]);const tick=now=>{const t=Math.min((now-start)/850,1);setShown(`${Math.round(target*(1-Math.pow(1-t,3)))}${match[2]}`);if(t<1)raf=requestAnimationFrame(tick);};raf=requestAnimationFrame(tick);},{threshold:.5});observer.observe(ref.current);return()=>{observer.disconnect();cancelAnimationFrame(raf);};},[value,paused]);return <span ref={ref}>{shown}</span>}
function Terminal({paused}){const [text,setText]=useState('');const ref=useRef(null);useEffect(()=>{const lines=['> initializing portfolio...','> loading modules...','> security tools ready...','> system status: secure','christian@portfolio:~$'];let timer;const observer=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){observer.disconnect();if(paused||reduceMotion()){setText(lines.join('\n'));return;}const full=lines.join('\n');let i=0;timer=setInterval(()=>{i++;setText(full.slice(0,i));if(i>=full.length)clearInterval(timer);},25);}}, {threshold:.35});observer.observe(ref.current);return()=>{observer.disconnect();clearInterval(timer);};},[paused]);return <Frame className="terminal-panel reveal" ref={ref}><div className="terminal-title"><TerminalSquare size={14}/> CYBER TERMINAL <span>● ● ●</span></div><pre>{text}<span className="terminal-caret">_</span></pre></Frame>}
function Education({paused}){return <section id="education" className="module-section content-section"><div className="container"><SectionHeading number="05" label="EDUCATION" title="Training record" caption="Building a strong foundation, one system and one challenge at a time."/><div className="education-grid"><Frame className="education-feature reveal"><div className="education-icon"><GraduationCap size={40}/></div><div><p className="small-label">// ACADEMIC RECORD 001</p><h3>Bachelor of Science in<br/>Information Technology</h3><strong>4TH YEAR <span>·</span> FOCUS: CYBERSECURITY</strong><p>{profile.university}</p></div><div className="education-watermark">EDU<span>04</span></div></Frame><Frame className="cert-panel reveal"><div className="panel-heading"><span className="small-label">// CERTIFICATIONS / LEARNING</span><h3>LEARNING PATH</h3></div>{certifications.map(c=><div className="cert-row" key={c.name}><span><ShieldCheck size={15}/>{c.name}</span><b className={c.status==='Completed'?'completed':'in-progress'}><i/>{c.status}</b></div>)}</Frame><Frame className="tools-panel reveal"><div className="panel-heading"><span className="small-label">// TOOLKIT</span><h3>TOOLS & TECHNOLOGIES</h3></div><div className="tools-grid">{tools.map((t,i)=><div className="tool-chip" key={t} tabIndex="0" title={t}><span>{['⌘','JS','PHP','SQL','⚛','⬡','⌁','◎','◆','GH','◉','▣'][i]}</span><small>{t}</small></div>)}</div></Frame><Terminal paused={paused}/></div></div></section>}

function Contact(){return <section id="contact" className="module-section content-section contact-section"><div className="container"><SectionHeading number="06" label="CONTACT" title="Establish a connection" caption="Open to collaboration, internships, projects, learning opportunities, and cybersecurity-related roles."/><div className="contact-grid"><div className="contact-copy reveal"><p className="small-label"><span className="status-dot"/> SECURE CHANNEL / OPEN</p><h3>LET'S BUILD A MORE<br/><span>SECURE TOMORROW.</span></h3><p>Have a project, opportunity, or idea? Send a message and let's start a conversation.</p><a className="button button-primary magnetic" href={`mailto:${profile.email}?subject=Let's%20connect`} data-cursor="OPEN">SEND A MESSAGE <Send size={17}/></a></div><div className="contact-cards">{[[Mail,'EMAIL',profile.email,`mailto:${profile.email}`],[Github,'GITHUB','github.com/christianbantayao',profile.github],[Linkedin,'LINKEDIN','Profile link pending',profile.linkedin],[Globe2,'PORTFOLIO',profile.portfolio,'#home']].map(([C,k,v,href])=>{const Tag=href?'a':'div';return <Tag key={k} className={`contact-card frame reveal ${href?'':'contact-card-inactive'}`} href={href||undefined} target={href?.startsWith('http')?'_blank':undefined} rel={href?.startsWith('http')?'noreferrer':undefined} data-cursor={href?'GO':undefined}><C size={22}/><span><small>{k}</small><strong>{v}</strong></span>{href&&<ArrowRight size={16}/>}</Tag>})}</div></div><div className="system-strip reveal">{[[Wifi,'DEMO NETWORK','ONLINE'],[ShieldCheck,'DEMO FIREWALL','ACTIVE'],[Database,'DEMO DATABASE','CONNECTED'],[Radar,'DEMO THREAT LEVEL','LOW']].map(([C,k,v])=><div key={k}><C size={18}/><span>{k}<b>{v}</b></span><i/></div>)}</div></div></section>}

function Footer({homePrefix=""}){return <footer className="footer"><div className="container"><span><b>[CB]</b> CHRISTIAN BANTAYAO</span><span>© {new Date().getFullYear()} / BUILT WITH PURPOSE</span><a href={homePrefix+"#home"}>BACK TO TOP ↑</a></div></footer>}

function App(){const [paused,setPaused]=useState(()=>{try{return localStorage.getItem('animation-paused')==='1';}catch{return false;}}),[active,setActive]=useState(0),[progress,setProgress]=useState(0),[scrolled,setScrolled]=useState(false),[direction,setDirection]=useState('down'),[introDone,setIntroDone]=useState(false),[moduleNotice,setModuleNotice]=useState({text:'',id:0,type:'scan',direction:'down'}),[theme,setTheme]=useState(()=>{try{return localStorage.getItem('portfolio-theme')==='light'?'light':'dark';}catch{return 'dark';}}),[themeBusy,setThemeBusy]=useState(false);const last=useRef(0),previousActive=useRef(0),themeTransitioning=useRef(false);useEffect(()=>{document.documentElement.dataset.theme=theme;document.querySelector('meta[name="theme-color"]')?.setAttribute('content',theme==='light'?'#eaf3f7':'#020609');try{localStorage.setItem('portfolio-theme',theme);}catch{/* Theme remains usable without storage. */}},[theme]);useEffect(()=>{let frame=0;const nodes=[...document.querySelectorAll('.module-section')];const update=()=>{frame=0;const y=window.scrollY,doc=document.documentElement.scrollHeight-window.innerHeight;setProgress(doc>0?y/doc:0);setScrolled(y>40);if(Math.abs(y-last.current)>8){setDirection(y>last.current?'down':'up');last.current=y;}const marker=window.innerHeight*.43;let current=0;nodes.forEach((node,i)=>{if(node.getBoundingClientRect().top<=marker)current=i;});setActive(current);};const onScroll=()=>{if(!frame)frame=requestAnimationFrame(update);};update();window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);return()=>{window.removeEventListener('scroll',onScroll);cancelAnimationFrame(frame);};},[]);
  useEffect(()=>{document.documentElement.classList.toggle('motion-paused',paused);try{localStorage.setItem('animation-paused',paused?'1':'0');}catch{/* Motion control still works without storage. */}},[paused]);
  useEffect(()=>{if(!introDone||active===previousActive.current)return;const nextDirection=active>previousActive.current?'down':'up';previousActive.current=active;const names=['LOADING SYSTEM OVERVIEW...','LOADING USER PROFILE...','LOADING CAPABILITY MODULES...','STREAMING DEPLOYMENT DATA...','RETRIEVING ACADEMIC RECORDS...','ESTABLISHING SECURE CHANNEL...'];const types=['scan','scan','modules','data','terminal','secure'];setModuleNotice(current=>({text:names[active],id:current.id+1,type:types[active],direction:nextDirection}));const timer=setTimeout(()=>setModuleNotice(current=>({...current,text:''})),1350);return()=>clearTimeout(timer);},[active,introDone]);
  useEffect(()=>{if(!introDone||paused||reduceMotion()||!document.querySelector('.module-section'))return;let cancelled=false,dispose=()=>{};import('./scrollAnimations.js').then(({mountScrollAnimations})=>{if(!cancelled)dispose=mountScrollAnimations();}).catch(error=>console.error('Scroll animations failed:',error));return()=>{cancelled=true;dispose();};},[introDone,paused]);
  useEffect(()=>{if(reduceMotion()||!window.matchMedia('(pointer:fine)').matches)return;const buttons=document.querySelectorAll('.magnetic');const clean=[];buttons.forEach(el=>{const move=e=>{const r=el.getBoundingClientRect();const x=(e.clientX-r.left-r.width/2)/r.width*7,y=(e.clientY-r.top-r.height/2)/r.height*7;el.style.transform=`translate(${x}px,${y}px)`;};const leave=()=>el.style.transform='';el.addEventListener('pointermove',move);el.addEventListener('pointerleave',leave);clean.push(()=>{el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave);});});return()=>clean.forEach(f=>f());},[]);
  const changeTheme = event => {
    if (themeTransitioning.current) return;
    const next = theme === 'dark' ? 'light' : 'dark';
    if (paused || reduceMotion()) { setTheme(next); return; }
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2, y = rect.top + rect.height / 2;
    const finish = () => { themeTransitioning.current = false; setThemeBusy(false); };
    themeTransitioning.current = true;
    setThemeBusy(true);
    if (!document.startViewTransition) {
      document.documentElement.style.setProperty('--theme-flash', next === 'light' ? 'rgba(220,247,255,.7)' : 'rgba(0,17,28,.65)');
      document.documentElement.classList.add('theme-fading');
      setTheme(next);
      window.setTimeout(() => { document.documentElement.classList.remove('theme-fading'); finish(); }, 600);
      return;
    }
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const transition = document.startViewTransition(() => {
      document.documentElement.dataset.theme = next;
      flushSync(() => setTheme(next));
    });
    transition.ready.then(() => document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 700, easing: 'cubic-bezier(.22,.8,.25,1)', pseudoElement: '::view-transition-new(root)' }
    )).catch(() => {});
    transition.finished.then(finish, finish);
  };
  const route = new URLSearchParams(window.location.search).get('project');
  const study = route && projectCaseStudies[route];
  const selectedProject = study ? projects.find(project => project.number === study.number) : null;
  return <><Intro done={()=>setIntroDone(true)}/><div className={`site-shell ${introDone?'ready':''}`}><div className="global-grid" aria-hidden="true"/><CyberNetwork active={selectedProject?3:active} theme={theme} paused={paused}/><Header active={selectedProject?3:active} scrolled={scrolled} direction={direction} theme={theme} themeBusy={themeBusy} onThemeChange={changeTheme} paused={paused} onPauseChange={()=>setPaused(current=>!current)} homePrefix={selectedProject?'./':''}/>{!selectedProject&&<ScrollProgress active={active} progress={progress}/>}<CustomCursor paused={paused}/>{!selectedProject&&<TransitionOverlay transition={paused?{text:'',id:0,type:'scan',direction:'down'}:moduleNotice}/>} {selectedProject?<ProjectCaseStudy project={selectedProject} study={study}/>:<main><Hero paused={paused}/><About/><Skills/><ProjectList paused={paused}/><Education paused={paused}/><Contact/></main>}<Footer homePrefix={selectedProject?'./':''}/></div></>;
}

function ProjectLinkCard({ project }) {
  return <a className="project-card frame reveal" href={`?project=${projectSlug(project)}`} data-cursor="VIEW PROJECT" aria-label={`Read case study for ${project.title}`}>
    <div className="project-visual"><ProjectVisual type={project.visual}/><div className="project-scan"/></div>
    <div className="project-content"><div className="project-meta"><span>PROJECT / {project.number}</span><ArrowRight size={17}/></div><p className="project-category">{project.category}</p><h3>{project.title}</h3><p>{project.description}</p><div className="project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><span className="project-card-link">READ CASE STUDY <ArrowRight size={14}/></span></div>
  </a>;
}

function ProjectList({paused}) {
  return <section id="projects" className="module-section content-section"><div className="container"><SectionHeading number="04" label="PROJECTS" title="Selected deployments" caption="Work that turns technical knowledge into useful, testable systems."/><a className="lab-jump" href="#security-lab">TRY THE INTERACTIVE SECURITY LAB <ArrowRight size={15}/></a><div className="project-grid">{projects.map(project => <ProjectLinkCard key={project.number} project={project}/>)}</div><div className="project-stats">{[[Layers3,'3+','COMPLETED PROJECTS'],[Check,'100%','ACADEMIC PROJECTS'],[Code2,'MULTIPLE','TECHNOLOGIES USED'],[Crosshair,'REAL-WORLD','PROBLEM SOLVING']].map(([Icon,value,label]) => <Frame className="project-stat reveal" key={label}><Icon size={24}/><strong><AnimatedStat value={value} paused={paused}/></strong><span>{label}</span></Frame>)}</div><SecurityLab/></div></section>;
}

function ProjectCaseStudy({ project, study }) {
  useEffect(() => {
    const previous = document.title;
    document.title = `${project.title} | Christian Bantayao`;
    return () => { document.title = previous; };
  }, [project.title]);
  return <main className="case-study-page"><div className="container case-study-container">
    <a href="./#projects" className="case-back"><ArrowRight size={16}/> BACK TO PROJECTS</a>
    <div className="case-hero"><div><p className="small-label">// CASE STUDY {study.number} / {project.category.toUpperCase()}</p><h1>{project.title}</h1><p className="case-lead">{project.description}</p><div className="project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div><div className="case-hero-index">{study.number}<span>PROJECT FILE</span></div></div>
    <div className="case-layout"><div className="case-main"><figure className="case-figure frame"><div className="case-visual">{study.screenshotUrl?<img src={study.screenshotUrl} alt={`${project.title} application screenshot`} loading="lazy"/>:<ProjectVisual type={project.visual}/>}</div><figcaption>{study.screenshotUrl?`${project.title} / project screenshot`:study.visualCaption}</figcaption></figure><section className="case-block frame"><span className="small-label">01 / CONTEXT</span><h2>The problem</h2><p>{study.problem}</p></section><section className="case-block frame"><span className="small-label">02 / PROCESS</span><h2>The approach</h2><ol>{study.approach.map(step => <li key={step}>{step}</li>)}</ol></section><section className="case-block frame"><span className="small-label">03 / REFLECTION</span><h2>What this project taught me</h2><p>{study.learning}</p></section></div><aside className="case-aside"><div className="case-side-card frame"><span className="small-label">// PROJECT ACCESS</span><h2>Explore the work</h2><p>{study.sourceUrl||study.demoUrl?"Open the available project resources below.":"Project specific source and live demo links will appear here when available."}</p>{study.sourceUrl && <a href={study.sourceUrl} target="_blank" rel="noreferrer">VIEW SOURCE <ExternalLink size={15}/></a>}{study.demoUrl && <a href={study.demoUrl} target="_blank" rel="noreferrer">OPEN LIVE DEMO <ExternalLink size={15}/></a>}<a href={profile.github} target="_blank" rel="noreferrer">GITHUB PROFILE <ExternalLink size={15}/></a><a href={`mailto:${profile.email}?subject=${encodeURIComponent(`Project inquiry: ${project.title}`)}`}>ASK ABOUT THIS PROJECT <ArrowRight size={15}/></a></div><p className="case-disclosure">{study.screenshotUrl?"Project screenshot supplied for this case study.":"The visual above is an illustration. Project details summarize the existing portfolio description."}</p></aside></div>
    <div className="case-next"><span>MORE PROJECTS</span>{projects.filter(item => item.number !== project.number).map(item => <a key={item.number} href={`?project=${projectSlug(item)}`}>{item.title} <ArrowRight size={15}/></a>)}</div>
  </div></main>;
}

export default App;
