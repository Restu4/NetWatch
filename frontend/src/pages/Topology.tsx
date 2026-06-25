import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { mockDevices, mockEdges } from '../utils/mockData';
import type { Device } from '../types';

interface Position { x: number; y: number }

const typeColors: Record<string, string> = {
  firewall: '#ef4444',
  router: '#0ea5e9',
  switch: '#8b5cf6',
  server: '#22c55e',
  access_point: '#eab308',
};

function getLayout(device: Device, index: number): Position {
  const layers: Record<string, { y: number }> = {
    firewall: { y: 80 },
    router: { y: 200 },
    switch: { y: 330 },
    server: { y: 470 },
    access_point: { y: 610 },
  };
  const layer = layers[device.type];
  const sameType = mockDevices.filter(d => d.type === device.type);
  const idx = sameType.indexOf(device);
  const count = sameType.length;
  const spacing = 1100 / (count + 1);
  return { x: spacing * (idx + 1), y: layer.y };
}

export default function Topology() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState<Position>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<Device | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(zoom, zoom);

    mockEdges.forEach(edge => {
      const source = mockDevices.find(d => d.name === edge.source_device);
      const target = mockDevices.find(d => d.name === edge.target_device);
      if (!source || !target) return;

      const p1 = getLayout(source, 0);
      const p2 = getLayout(target, 0);

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);

      if (edge.status === 'down') {
        ctx.strokeStyle = 'rgba(239,68,68,0.25)';
        ctx.setLineDash([6, 4]);
      } else if (edge.status === 'degraded') {
        ctx.strokeStyle = 'rgba(234,179,8,0.35)';
        ctx.setLineDash([]);
      } else {
        ctx.strokeStyle = 'rgba(14,165,233,0.2)';
        ctx.setLineDash([]);
      }
      ctx.lineWidth = edge.status === 'active' ? 1.5 : 1;
      ctx.stroke();
      ctx.setLineDash([]);

      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;
      ctx.fillStyle = 'rgba(148,163,184,0.4)';
      ctx.font = '8px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${edge.latency}ms`, midX, midY - 6);
    });

    mockDevices.forEach(device => {
      const pos = getLayout(device, 0);
      const color = typeColors[device.type];
      const isOffline = device.status === 'offline';
      const isHovered = hoveredNode?.id === device.id;
      const radius = isHovered ? 18 : isOffline ? 12 : 16;

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(pos.x - 4, pos.y - 4, 0, pos.x, pos.y, radius);
      if (isOffline) {
        gradient.addColorStop(0, 'rgba(71,85,105,0.8)');
        gradient.addColorStop(1, 'rgba(71,85,105,0.3)');
      } else if (device.status === 'warning') {
        gradient.addColorStop(0, 'rgba(234,179,8,0.8)');
        gradient.addColorStop(1, 'rgba(234,179,8,0.2)');
      } else {
        gradient.addColorStop(0, color + '99');
        gradient.addColorStop(1, color + '22');
      }
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = isOffline ? '#475569' : color;
      ctx.lineWidth = isHovered ? 3 : 2;
      ctx.stroke();

      if (!isOffline) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, isHovered ? 8 : 6, 0, Math.PI * 2);
        ctx.fillStyle = device.status === 'warning' ? '#eab308' : color;
        ctx.fill();
      }

      ctx.fillStyle = isHovered ? '#f1f5f9' : '#94a3b8';
      ctx.font = isHovered ? 'bold 10px Inter, sans-serif' : '9px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(device.name, pos.x, pos.y + radius + 14);

      const label = device.type.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
      ctx.fillStyle = '#64748b';
      ctx.font = '8px Inter, sans-serif';
      ctx.fillText(label, pos.x, pos.y + radius + 25);
    });

    if (hoveredNode) {
      const pos = getLayout(hoveredNode, 0);
      ctx.fillStyle = 'rgba(15,23,42,0.85)';
      const tooltipW = 160;
      const tooltipH = 70;
      const tx = Math.min(pos.x - tooltipW / 2, rect.width / zoom - tooltipW - 20);
      const ty = pos.y - 80;
      ctx.beginPath();
      ctx.roundRect(tx, ty, tooltipW, tooltipH, 6);
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#f1f5f9';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(hoveredNode.name, tx + 10, ty + 18);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px Inter, sans-serif';
      ctx.fillText(`IP: ${hoveredNode.ip_address}`, tx + 10, ty + 33);
      ctx.fillText(`Status: ${hoveredNode.status}`, tx + 10, ty + 46);
      ctx.fillText(`CPU: ${hoveredNode.cpu_usage}% | Mem: ${hoveredNode.memory_usage}%`, tx + 10, ty + 59);
    }

    ctx.restore();

    ctx.fillStyle = '#64748b';
    ctx.font = '10px Inter, sans-serif';
    let ly = 20;
    Object.entries(typeColors).forEach(([type, color]) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(20, ly + 4, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'left';
      ctx.fillText(type.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()), 30, ly + 8);
      ly += 18;
    });
  }, [zoom, offset, hoveredNode]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    setDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  }, [offset]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (dragging) {
      setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left - offset.x) / zoom;
    const my = (e.clientY - rect.top - offset.y) / zoom;
    const found = mockDevices.find(device => {
      const pos = getLayout(device, 0);
      const dx = pos.x - mx;
      const dy = pos.y - my;
      return Math.sqrt(dx * dx + dy * dy) < 25;
    });
    setHoveredNode(found || null);
  }, [dragging, dragStart, zoom, offset]);

  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (dragging) return;
    if (hoveredNode) {
      navigate(`/device/${hoveredNode.id}`);
    }
  }, [dragging, hoveredNode, navigate]);

  const resetView = useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-100">Network Topology</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setZoom(z => Math.min(z + 0.2, 3))} className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-400 transition-colors">
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="text-sm text-slate-400 w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.3))} className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-400 transition-colors">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button onClick={resetView} className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-400 transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-[calc(100vh-220px)] cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleClick}
          style={{ minHeight: '500px' }}
        />
      </div>
    </div>
  );
}
