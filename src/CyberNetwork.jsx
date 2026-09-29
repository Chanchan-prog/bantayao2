import React, { useEffect, useRef } from 'react';
import './network.css';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const rgba = (color, alpha) => `rgba(${color[0]},${color[1]},${color[2]},${clamp(alpha, 0, 1)})`;

function randomFromSeed(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6D2B79F5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function pointToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const length = dx * dx + dy * dy || 1;
  const t = clamp(((px - ax) * dx + (py - ay) * dy) / length, 0, 1);
  const x = ax + t * dx, y = ay + t * dy;
  return { distance: Math.hypot(px - x, py - y), x, y };
}

function buildNetwork(width, height, coarse) {
  const random = randomFromSeed(9127 + Math.round(width) * 13 + Math.round(height) * 7);
  const cell = coarse ? 118 : 132;
  const columns = Math.ceil(width / cell) + 1;
  const rows = Math.ceil(height / cell) + 1;
  const nodes = [];

  for (let row = -1; row < rows; row++) {
    for (let column = -1; column < columns; column++) {
      if (random() < (coarse ? .23 : .28)) continue;
      const baseX = (column + .18 + random() * .65) * cell;
      const baseY = (row + .18 + random() * .65) * cell;
      if (baseX < -35 || baseX > width + 35 || baseY < -35 || baseY > height + 35) continue;
      const nearVoid = Math.hypot(baseX - width * .42, baseY - height * .42) < Math.min(width, height) * .16;
      if (!coarse && nearVoid && random() < .52) continue;
      const layerRoll = random();
      nodes.push({ baseX, baseY, x: baseX, y: baseY, layer: layerRoll < .24 ? 0 : layerRoll < .86 ? 1 : 2, phase: random() * Math.PI * 2, pulseStart: -1000, lastPulse: -1000 });
    }
  }

  const limit = coarse ? 35 : 80;
  if (nodes.length > limit) {
    for (let index = nodes.length - 1; index > 0; index--) {
      const other = Math.floor(random() * (index + 1));
      [nodes[index], nodes[other]] = [nodes[other], nodes[index]];
    }
    nodes.length = limit;
  }

  const edges = [];
  const seen = new Set();
  const connectionDistance = coarse ? 175 : 188;
  nodes.forEach((node, index) => {
    const neighbors = [];
    nodes.forEach((other, otherIndex) => {
      if (index === otherIndex) return;
      const distance = Math.hypot(node.baseX - other.baseX, node.baseY - other.baseY);
      if (distance < connectionDistance) neighbors.push({ otherIndex, distance });
    });
    neighbors.sort((a, b) => a.distance - b.distance);
    neighbors.slice(0, random() < .25 ? 3 : 2).forEach(({ otherIndex }) => {
      const key = `${Math.min(index, otherIndex)}-${Math.max(index, otherIndex)}`;
      if (!seen.has(key)) { seen.add(key); edges.push({ a: index, b: otherIndex, phase: random() * Math.PI * 2 }); }
    });
  });
  return { nodes, edges };
}

const palettes = {
  dark: { line: [0, 229, 255], node: [0, 229, 255], active: [103, 243, 255], packet: [0, 255, 178], energy: [0, 180, 220] },
  light: { line: [35, 85, 110], node: [105, 173, 236], active: [0, 126, 171], packet: [0, 130, 115], energy: [0, 110, 150] },
};

export default function CyberNetwork({ active, theme, paused = false }) {
  const canvasRef = useRef(null);
  const redrawRef = useRef(null);
  const pauseRef = useRef(null);
  const settingsRef = useRef({ active, theme, paused });
  settingsRef.current = { active, theme, paused };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { alpha: true });
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarse = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 700;
    let reduced = motionQuery.matches || settingsRef.current.paused;
    let width = 0, height = 0, dpr = 1, nodes = [], edges = [], raf = 0, lastFrame = 0;
    let drift = 0, scrollImpulse = 0, previousScroll = window.scrollY, nextShapeCheck = 0, nextIdlePulse = 0, nextIdleShape = 0;
    let shape = null, packet = null, clickPulse = null, forceShape = false;
    let trail = [];
    const cursor = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, previousX: -1000, previousY: -1000, speed: 0, lastInput: -10000, lastTrailX: -1000, lastTrailY: -1000, lastTrailTime: 0 };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      ({ nodes, edges } = buildNetwork(width, height, coarse));
      shape = null;
      trail = [];
      draw(performance.now());
    };

    const createShape = (now, centerX = cursor.x, centerY = cursor.y, ambient = false) => {
      const nearby = nodes.map((node, index) => ({ index, distance: Math.hypot(node.baseX - centerX, node.baseY - centerY) }))
        .filter(item => item.distance < (coarse ? 190 : 215)).sort((a, b) => a.distance - b.distance).slice(0, 4);
      if (nearby.length < 4) return false;
      const ordered = nearby.map(item => item.index).sort((a, b) => nodes[a].baseY - nodes[b].baseY);
      const top = ordered.slice(0, 2).sort((a, b) => nodes[a].baseX - nodes[b].baseX);
      const bottom = ordered.slice(2).sort((a, b) => nodes[a].baseX - nodes[b].baseX);
      const indices = [top[0], top[1], bottom[1], bottom[0]];
      const xs = indices.map(index => nodes[index].baseX), ys = indices.map(index => nodes[index].baseY);
      const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
      if (maxX - minX < 44 || maxY - minY < 34) return false;
      const section = settingsRef.current.active;
      const kind = section === 4 ? 'timeline' : section === 5 ? 'converge' : section === 2 ? 'grid' : section === 3 ? 'architecture' : section === 1 ? 'organized' : 'square';
      const cube = kind !== 'timeline' && kind !== 'converge' && Math.random() < .19;
      const corners = [[minX, minY], [maxX, minY], [maxX, maxY], [minX, maxY]];
      const targets = new Map();
      indices.forEach((index, corner) => {
        const node = nodes[index];
        let targetX = corners[corner][0], targetY = corners[corner][1];
        if (kind === 'timeline') targetY = (minY + maxY) / 2 + (corner % 2 ? 5 : -5);
        if (kind === 'converge') { targetX = node.baseX + (centerX - node.baseX) * .12; targetY = node.baseY + (centerY - node.baseY) * .12; }
        targets.set(index, { x: clamp(targetX - node.baseX, -19, 19), y: clamp(targetY - node.baseY, -19, 19) });
      });
      shape = { indices, targets, kind: cube ? 'cube' : kind, opacity: 0, holdUntil: now + (ambient ? 1850 : coarse ? 900 : 680), centerX: (minX + maxX) / 2, centerY: (minY + maxY) / 2 };
      if (ambient || Math.random() < .36) packet = { indices, start: now, duration: 680 + Math.random() * 240 };
      return true;
    };

    const onPointerMove = event => {
      if (event.pointerType === 'touch') return;
      cursor.targetX = event.clientX;
      cursor.targetY = event.clientY;
      cursor.lastInput = performance.now();
    };
    const onScroll = () => {
      const current = window.scrollY;
      scrollImpulse = clamp(scrollImpulse - (current - previousScroll) * .12, -13, 13);
      previousScroll = current;
    };
    const onClick = event => {
      if (reduced || (event.target instanceof Element && event.target.closest('a,button,nav,.frame,[role="button"],input,textarea,select,h1,h2,h3,h4,p'))) return;
      const now = performance.now();
      cursor.targetX = event.clientX;
      cursor.targetY = event.clientY;
      cursor.x = event.clientX;
      cursor.y = event.clientY;
      cursor.lastInput = now;
      clickPulse = { x: event.clientX, y: event.clientY, start: now };
      forceShape = true;
    };

    function draw(now) {
      if (!width || !height) return;
      context.clearRect(0, 0, width, height);
      const palette = palettes[settingsRef.current.theme] || palettes.dark;
      const section = settingsRef.current.active;
      const interactive = !reduced && now - cursor.lastInput < 3000;
      if (!reduced) {
        const frameDelta = Math.max(now - lastFrame, 16);
        const movement = Math.hypot(cursor.targetX - cursor.previousX, cursor.targetY - cursor.previousY) / frameDelta;
        cursor.speed = cursor.speed * .79 + movement * .21;
        cursor.previousX = cursor.targetX;
        cursor.previousY = cursor.targetY;
        cursor.x += (cursor.targetX - cursor.x) * .18;
        cursor.y += (cursor.targetY - cursor.y) * .18;
        scrollImpulse *= .9;
        drift += (scrollImpulse - drift) * .09;
      }
      lastFrame = now;

      if (interactive && !coarse && Math.hypot(cursor.x - cursor.lastTrailX, cursor.y - cursor.lastTrailY) > 27 && now - cursor.lastTrailTime > 32) {
        trail.push({ x: cursor.x, y: cursor.y, time: now });
        if (trail.length > 10) trail.shift();
        cursor.lastTrailX = cursor.x;
        cursor.lastTrailY = cursor.y;
        cursor.lastTrailTime = now;
      }
      trail = trail.filter(point => now - point.time < 1050);

      if (interactive && (forceShape || now > nextShapeCheck)) {
        nextShapeCheck = now + 110;
        if (shape && Math.hypot(cursor.x - shape.centerX, cursor.y - shape.centerY) < 100) shape.holdUntil = now + 520;
        if ((!shape || now > shape.holdUntil + 280) && (forceShape || cursor.speed < 1.15)) createShape(now);
        forceShape = false;
      }
      if (!reduced && !interactive && now > nextIdleShape && (!shape || now > shape.holdUntil)) {
        nextIdleShape = now + 2500 + Math.random() * 1100;
        const candidates = nodes.filter(node => node.baseX > width * .22 && node.baseX < width * .88 && node.baseY > height * .17 && node.baseY < height * .84);
        for (let attempt = 0; attempt < Math.min(candidates.length, 12); attempt++) {
          const node = candidates[Math.floor(Math.random() * candidates.length)];
          if (createShape(now, node.baseX, node.baseY, true)) break;
        }
      }
      if (shape) {
        const targetOpacity = now < shape.holdUntil ? 1 : 0;
        shape.opacity += (targetOpacity - shape.opacity) * .085;
        if (shape.opacity < .018 && targetOpacity === 0) shape = null;
      }

      if (!reduced && !interactive && now > nextIdlePulse && nodes.length) {
        const node = nodes[Math.floor(Math.random() * nodes.length)];
        node.pulseStart = now;
        node.lastPulse = now;
        nextIdlePulse = now + 3500 + Math.random() * 2600;
      }

      if (interactive) {
        const gradient = context.createRadialGradient(cursor.x, cursor.y, 0, cursor.x, cursor.y, 215);
        gradient.addColorStop(0, rgba(palette.energy, .036));
        gradient.addColorStop(1, rgba(palette.energy, 0));
        context.fillStyle = gradient;
        context.fillRect(cursor.x - 215, cursor.y - 215, 430, 430);
      }

      nodes.forEach((node, index) => {
        const dx = node.baseX - cursor.x, dy = node.baseY - cursor.y;
        const distance = Math.hypot(dx, dy) || 1;
        let force = 0;
        if (interactive && distance < 190) force = distance < 65 ? (1 - distance / 65) * 14 : -(1 - (distance - 65) / 125) * 5;
        let targetX = node.baseX + dx / distance * force;
        let targetY = node.baseY + dy / distance * force;
        if (section === 1) { targetX += clamp(Math.round(node.baseX / 32) * 32 - node.baseX, -3, 3); targetY += clamp(Math.round(node.baseY / 32) * 32 - node.baseY, -3, 3); }
        const organized = shape?.targets.get(index);
        if (organized) { targetX += organized.x * shape.opacity; targetY += organized.y * shape.opacity; }
        if (!reduced) { targetX += Math.sin(now * .00028 + node.phase) * .65; targetY += Math.cos(now * .00024 + node.phase) * .65; }
        targetX = node.baseX + clamp(targetX - node.baseX, -20, 20);
        targetY = node.baseY + clamp(targetY - node.baseY, -20, 20);
        if (reduced) { node.x = targetX; node.y = targetY; }
        else { node.x += (targetX - node.x) * .08; node.y += (targetY - node.y) * .08; }
        if (interactive && distance < 24 && now - node.lastPulse > 800) { node.pulseStart = now; node.lastPulse = now; }
      });

      const screenY = node => node.y + drift;
      edges.forEach(edge => {
        const first = nodes[edge.a], second = nodes[edge.b];
        const ax = first.x, ay = screenY(first), bx = second.x, by = screenY(second);
        const hit = interactive ? pointToSegment(cursor.x, cursor.y, ax, ay, bx, by) : null;
        const proximity = hit ? clamp(1 - hit.distance / 125, 0, 1) : 0;
        const layer = Math.min(first.layer, second.layer);
        const base = layer === 0 ? .065 : layer === 1 ? .12 : .17;
        const rhythm = reduced ? 0 : Math.sin(now * .00034 + edge.phase) * .012;
        const alpha = base + rhythm + proximity * (settingsRef.current.theme === 'light' ? .25 : .31);
        context.strokeStyle = rgba(palette.line, alpha);
        context.lineWidth = proximity > .6 ? 1 : .65;
        context.beginPath();
        context.moveTo(ax, ay);
        if (proximity > .45 && hit && !reduced) {
          const midpointX = (ax + bx) / 2, midpointY = (ay + by) / 2;
          const bend = Math.min(5, (proximity - .45) * 10);
          const length = Math.hypot(cursor.x - midpointX, cursor.y - midpointY) || 1;
          context.quadraticCurveTo(midpointX + (cursor.x - midpointX) / length * bend, midpointY + (cursor.y - midpointY) / length * bend, bx, by);
        } else context.lineTo(bx, by);
        context.stroke();
        if (hit && hit.distance < 18 && proximity > .85 && edge.a % 5 === 0) {
          context.fillStyle = rgba(palette.active, .35 * proximity);
          context.beginPath(); context.arc(hit.x, hit.y, 1.4, 0, Math.PI * 2); context.fill();
        }
      });

      if (trail.length > 1) {
        for (let index = 1; index < trail.length; index++) {
          const previous = trail[index - 1], point = trail[index];
          const alpha = clamp(1 - (now - point.time) / 1050, 0, 1) * .22;
          if (cursor.speed > 1.9 && index % 2 === 0) continue;
          context.strokeStyle = rgba(palette.active, alpha);
          context.lineWidth = .75;
          context.beginPath(); context.moveTo(previous.x, previous.y); context.lineTo(point.x, previous.y); context.lineTo(point.x, point.y); context.stroke();
          context.fillStyle = rgba(palette.node, alpha * 1.5);
          context.beginPath(); context.arc(point.x, point.y, 1.1, 0, Math.PI * 2); context.fill();
        }
      }

      if (shape && shape.opacity > .025) {
        const points = shape.indices.map(index => ({ x: nodes[index].x, y: screenY(nodes[index]) }));
        const alpha = shape.opacity * (settingsRef.current.theme === 'light' ? .29 : .33);
        const drawConnection = (a, b, strength = 1) => {
          context.strokeStyle = rgba(palette.active, alpha * strength);
          context.lineWidth = .9;
          context.beginPath(); context.moveTo(a.x, a.y); context.lineTo(b.x, b.y); context.stroke();
        };
        if (shape.kind === 'timeline') {
          const ordered = [...points].sort((a, b) => a.x - b.x);
          for (let index = 1; index < ordered.length; index++) drawConnection(ordered[index - 1], ordered[index]);
          ordered.forEach(point => drawConnection({ x: point.x, y: point.y - 11 }, { x: point.x, y: point.y + 11 }, .75));
        } else {
          for (let index = 0; index < 4; index++) drawConnection(points[index], points[(index + 1) % 4]);
          if (shape.kind === 'grid') {
            const top = { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 };
            const bottom = { x: (points[3].x + points[2].x) / 2, y: (points[3].y + points[2].y) / 2 };
            const left = { x: (points[0].x + points[3].x) / 2, y: (points[0].y + points[3].y) / 2 };
            const right = { x: (points[1].x + points[2].x) / 2, y: (points[1].y + points[2].y) / 2 };
            drawConnection(top, bottom, .7); drawConnection(left, right, .7);
          } else if (shape.kind === 'cube') {
            const offset = points.map(point => ({ x: point.x + 19, y: point.y - 15 }));
            for (let index = 0; index < 4; index++) { drawConnection(offset[index], offset[(index + 1) % 4], .65); drawConnection(points[index], offset[index], .65); }
          } else if (shape.kind === 'converge') {
            const destination = { x: width * .68, y: height * .57 };
            points.forEach(point => drawConnection(point, destination, .48));
          } else if (shape.kind === 'square' || shape.kind === 'architecture') drawConnection(points[0], points[2], .4);
        }
      }

      if (packet && now - packet.start < packet.duration) {
        const progress = (now - packet.start) / packet.duration * 2;
        const segment = Math.min(Math.floor(progress), 1), t = progress - segment;
        const first = nodes[packet.indices[segment]], second = nodes[packet.indices[segment + 1]];
        if (first && second) {
          context.fillStyle = rgba(palette.packet, .8 * Math.sin(Math.PI * Math.min(progress / 2, 1)));
          context.beginPath(); context.arc(first.x + (second.x - first.x) * t, screenY(first) + (screenY(second) - screenY(first)) * t, 1.8, 0, Math.PI * 2); context.fill();
        }
      } else packet = null;

      nodes.forEach(node => {
        const distance = interactive ? Math.hypot(node.x - cursor.x, screenY(node) - cursor.y) : 1000;
        const proximity = clamp(1 - distance / 175, 0, 1);
        const base = node.layer === 0 ? .2 : node.layer === 1 ? .35 : .48;
        const pulseAge = now - node.pulseStart;
        const pulse = pulseAge >= 0 && pulseAge < 320 ? Math.sin(Math.PI * pulseAge / 320) : 0;
        context.fillStyle = rgba(proximity > .35 ? palette.active : palette.node, base + proximity * .44 + pulse * .22);
        context.beginPath(); context.arc(node.x, screenY(node), (node.layer === 2 ? 1.45 : 1.05) * (1 + pulse * .8), 0, Math.PI * 2); context.fill();
        if (pulse > .1) {
          context.strokeStyle = rgba(palette.active, pulse * .17);
          context.lineWidth = .7;
          context.beginPath(); context.arc(node.x, screenY(node), 2.5 + pulse * 3, 0, Math.PI * 2); context.stroke();
        }
      });

      if (clickPulse && now - clickPulse.start < 1000) {
        const progress = (now - clickPulse.start) / 1000;
        context.strokeStyle = rgba(palette.active, (1 - progress) * .2);
        context.lineWidth = 1;
        context.beginPath(); context.arc(clickPulse.x, clickPulse.y, 8 + progress * 105, 0, Math.PI * 2); context.stroke();
      } else clickPulse = null;
      const state = shape?.opacity > .1 ? 'structured' : 'idle';
      if (canvas.dataset.networkState !== state) canvas.dataset.networkState = state;
    }

    const frame = now => {
      raf = 0;
      const frameInterval = coarse ? 50 : now - cursor.lastInput < 3000 ? 24 : 40;
      if (!reduced && !document.hidden && now - lastFrame >= frameInterval) draw(now);
      if (!reduced && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const onVisibility = () => {
      if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
      else if (!reduced && !raf) raf = requestAnimationFrame(frame);
    };
    const onMotionChange = () => {
      reduced = motionQuery.matches || settingsRef.current.paused;
      cancelAnimationFrame(raf); raf = 0;
      shape = null; trail = []; packet = null; clickPulse = null;
      if (reduced) draw(performance.now());
      else if (!document.hidden) raf = requestAnimationFrame(frame);
    };

    pauseRef.current = () => onMotionChange();

    redrawRef.current = () => draw(performance.now());
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('click', onClick);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    motionQuery.addEventListener('change', onMotionChange);
    resize();
    if (!reduced) raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('click', onClick);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      motionQuery.removeEventListener('change', onMotionChange);
      redrawRef.current = null;
      pauseRef.current = null;
    };
  }, []);

  useEffect(() => { pauseRef.current?.(); }, [paused]);
  useEffect(() => { redrawRef.current?.(); }, [active, theme]);
  return <canvas ref={canvasRef} className="cyber-network" aria-hidden="true" />;
}
