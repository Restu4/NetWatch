import { useCallback, useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Maximize2 } from 'lucide-react';
import { mockDevices, mockEdges } from '../../utils/mockData';
import type { Device, DeviceStatus } from '../../types';

interface Node {
  id: string;
  type: 'router' | 'switch' | 'server' | 'access_point' | 'firewall';
  status: DeviceStatus;
  x: number;
  y: number;
  label: string;
}

interface Edge {
  source: string;
  target: string;
  status: string;
}

const typeColors: Record<string, string> = {
  firewall: '#ef4444',
  router: '#0ea5e9',
  switch: '#8b5cf6',
  server: '#22c55e',
  access_point: '#eab308',
};

const statusGlow: Record<DeviceStatus, string> = {
  online: '0 0 10px rgba(34,197,94,0.5)',
  offline: '0 0 10px rgba(239,68,68,0.3)',
  warning: '0 0 10px rgba(234,179,8,0.5)',
};

function getLayoutPosition(device: Device, index: number, total: number): { x: number; y: number } {
  const layers: Record<string, { y: number; count: number }> = {
    firewall: { y: 60, count: 2 },
    router: { y: 140, count: 3 },
    switch: { y: 220, count: 5 },
    server: { y: 300, count: 10 },
    access_point: { y: 380, count: 4 },
  };
  const layer = layers[device.type];
  const idx = mockDevices.filter(d => d.type === device.type).indexOf(device);
  const spacing = 780 / (layer.count + 1);
  return { x: spacing * (idx + 1), y: layer.y };
}

export default function TopologyView() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    const n: Node[] = mockDevices.map((d, i) => {
      const pos = getLayoutPosition(d, i, mockDevices.length);
      return {
        id: d.name,
        type: d.type,
        status: d.status,
        x: pos.x,
        y: pos.y,
        label: d.name,
      };
    });
    setNodes(n);

    const e: Edge[] = mockEdges.map(edge => ({
      source: edge.source_device,
      target: edge.target_device,
      status: edge.status,
    }));
    setEdges(e);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || nodes.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);

    edges.forEach(edge => {
      const source = nodes.find(n => n.id === edge.source);
      const target = nodes.find(n => n.id === edge.target);
      if (!source || !target) return;

      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);

      if (edge.status === 'down') {
        ctx.strokeStyle = 'rgba(239,68,68,0.3)';
        ctx.setLineDash([4, 4]);
      } else if (edge.status === 'degraded') {
        ctx.strokeStyle = 'rgba(234,179,8,0.4)';
        ctx.setLineDash([]);
      } else {
        ctx.strokeStyle = 'rgba(14,165,233,0.3)';
        ctx.setLineDash([]);
      }
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);
    });

    nodes.forEach(node => {
      const color = typeColors[node.type];
      const isOffline = node.status === 'offline';

      ctx.beginPath();
      ctx.arc(node.x, node.y, isOffline ? 10 : 14, 0, Math.PI * 2);
      ctx.fillStyle = isOffline ? 'rgba(71,85,105,0.6)' : color + '33';
      ctx.fill();
      ctx.strokeStyle = isOffline ? '#475569' : color;
      ctx.lineWidth = 2;
      ctx.stroke();

      if (!isOffline) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }

      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + (isOffline ? 24 : 28));
    });
  }, [nodes, edges]);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const clicked = nodes.find(n => {
        const dx = n.x - x;
        const dy = n.y - y;
        return Math.sqrt(dx * dx + dy * dy) < 20;
      });
      if (clicked) {
        const device = mockDevices.find(d => d.name === clicked.id);
        if (device) navigate(`/device/${device.id}`);
      }
    },
    [nodes, navigate]
  );

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-netwatch-500/20 to-blue-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-netwatch-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Network Topology</h3>
            <p className="text-[10px] text-slate-500">Live network structure visualization</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/topology')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-netwatch-500/10 border border-netwatch-500/20 rounded-lg text-xs text-netwatch-400 hover:bg-netwatch-500/20 transition-all"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          Full View
        </button>
      </div>
      <div className="relative rounded-xl bg-slate-900/50 border border-slate-700/30 overflow-hidden" style={{ height: 450 }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-pointer"
          onClick={handleCanvasClick}
        />
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
          <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-700/50">
            {Object.entries(typeColors).map(([type, color]) => (
              <div key={type} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: color }} />
                <span className="text-[10px] text-slate-400 capitalize">{type.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
