import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { HistoryRecord } from '../types';
import { TrendingUp, Flame, ShieldAlert, Sparkles, Award } from 'lucide-react';

interface Props {
  history: HistoryRecord[];
}

interface DataPoint {
  index: number;
  period: string;
  shortPeriod: string;
  status: 'WIN' | 'LOSS' | 'JACKPOT' | 'PENDING';
  prediction: string;
  actualNumber?: number;
  actualSize?: string;
  confidence: number;
  winStreak: number;
  lossStreak: number;
  netStreak: number; // Positive for win streak, negative for loss streak
  isJackpot: boolean;
}

export const StreakD3Chart: React.FC<Props> = ({ history }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [chartMode, setChartMode] = useState<'momentum' | 'dual'>('momentum');

  // Process last 50 resolved games in chronological order (oldest to newest)
  const chartData: DataPoint[] = useMemo(() => {
    const resolved = history
      .filter(h => h.status === 'WIN' || h.status === 'LOSS' || h.status === 'JACKPOT')
      .slice(0, 50)
      .reverse(); // Chronological: past -> present

    let currentWin = 0;
    let currentLoss = 0;

    return resolved.map((item, idx) => {
      const isWin = item.status === 'WIN' || item.status === 'JACKPOT';
      const isJackpot = item.status === 'JACKPOT';

      if (isWin) {
        currentWin += 1;
        currentLoss = 0;
      } else {
        currentLoss += 1;
        currentWin = 0;
      }

      return {
        index: idx + 1,
        period: item.period,
        shortPeriod: item.period.slice(-4) || `#${idx + 1}`,
        status: item.status,
        prediction: item.prediction,
        actualNumber: item.actualNumber,
        actualSize: item.actualSize,
        confidence: item.confidence || 90,
        winStreak: currentWin,
        lossStreak: currentLoss,
        netStreak: isWin ? currentWin : -currentLoss,
        isJackpot
      };
    });
  }, [history]);

  // Statistics over the 50-game window
  const windowStats = useMemo(() => {
    if (chartData.length === 0) {
      return { peakWin: 0, peakLoss: 0, winCount: 0, lossCount: 0, jackpotCount: 0, winRate: '0.0' };
    }
    const peakWin = Math.max(0, ...chartData.map(d => d.winStreak));
    const peakLoss = Math.max(0, ...chartData.map(d => d.lossStreak));
    const winCount = chartData.filter(d => d.status === 'WIN' || d.status === 'JACKPOT').length;
    const lossCount = chartData.filter(d => d.status === 'LOSS').length;
    const jackpotCount = chartData.filter(d => d.isJackpot).length;
    const winRate = ((winCount / chartData.length) * 100).toFixed(1);

    return { peakWin, peakLoss, winCount, lossCount, jackpotCount, winRate };
  }, [chartData]);

  useEffect(() => {
    if (!svgRef.current || chartData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const containerWidth = containerRef.current ? containerRef.current.clientWidth : 360;
    const width = Math.max(containerWidth, 320);
    const height = 210;
    const margin = { top: 20, right: 25, bottom: 35, left: 35 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr('viewBox', `0 0 ${width} ${height}`).attr('width', '100%').attr('height', height);

    // Defs for gradients & glowing filters
    const defs = svg.append('defs');

    // Win Streak Gradient (Green / Emerald)
    const winGradient = defs
      .append('linearGradient')
      .attr('id', 'win-area-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    winGradient.append('stop').attr('offset', '0%').attr('stop-color', '#00ff88').attr('stop-opacity', 0.55);
    winGradient.append('stop').attr('offset', '100%').attr('stop-color', '#00ff88').attr('stop-opacity', 0.0);

    // Loss Streak Gradient (Red / Crimson)
    const lossGradient = defs
      .append('linearGradient')
      .attr('id', 'loss-area-gradient')
      .attr('x1', '0%')
      .attr('y1', '100%')
      .attr('x2', '0%')
      .attr('y2', '0%');
    lossGradient.append('stop').attr('offset', '0%').attr('stop-color', '#ff2a4b').attr('stop-opacity', 0.55);
    lossGradient.append('stop').attr('offset', '100%').attr('stop-color', '#ff2a4b').attr('stop-opacity', 0.0);

    // Glow filter for strokes
    const filter = defs.append('filter').attr('id', 'd3-glow').attr('x', '-20%').attr('y', '-20%').attr('width', '140%').attr('height', '140%');
    filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // X Scale: index 1 to N
    const xScale = d3
      .scaleLinear()
      .domain([1, Math.max(chartData.length, 10)])
      .range([0, innerWidth]);

    // Y Scale: Range based on streaks
    const maxWin = Math.max(windowStats.peakWin, 3);
    const maxLoss = Math.max(windowStats.peakLoss, 3);

    const yScale =
      chartMode === 'momentum'
        ? d3.scaleLinear().domain([-maxLoss - 0.5, maxWin + 0.5]).range([innerHeight, 0])
        : d3.scaleLinear().domain([0, Math.max(maxWin, maxLoss) + 1]).range([innerHeight, 0]);

    const zeroY = chartMode === 'momentum' ? yScale(0) : innerHeight;

    // Grid lines
    const yTicks = chartMode === 'momentum' ? [-maxLoss, -Math.ceil(maxLoss / 2), 0, Math.ceil(maxWin / 2), maxWin] : [0, Math.ceil(maxWin / 2), maxWin];
    
    g.append('g')
      .attr('class', 'grid')
      .selectAll('line')
      .data(yTicks)
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', d => (d === 0 ? 'rgba(255, 208, 0, 0.4)' : 'rgba(255, 255, 255, 0.07)'))
      .attr('stroke-width', d => (d === 0 ? 1.5 : 1))
      .attr('stroke-dasharray', d => (d === 0 ? 'none' : '3,3'));

    if (chartMode === 'momentum') {
      // Area above 0 (Win streaks)
      const winAreaGenerator = d3
        .area<DataPoint>()
        .x(d => xScale(d.index))
        .y0(zeroY)
        .y1(d => (d.netStreak > 0 ? yScale(d.netStreak) : zeroY))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(chartData)
        .attr('fill', 'url(#win-area-gradient)')
        .attr('d', winAreaGenerator);

      // Area below 0 (Loss streaks)
      const lossAreaGenerator = d3
        .area<DataPoint>()
        .x(d => xScale(d.index))
        .y0(zeroY)
        .y1(d => (d.netStreak < 0 ? yScale(d.netStreak) : zeroY))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(chartData)
        .attr('fill', 'url(#loss-area-gradient)')
        .attr('d', lossAreaGenerator);

      // Main Net Momentum Line
      const lineGenerator = d3
        .line<DataPoint>()
        .x(d => xScale(d.index))
        .y(d => yScale(d.netStreak))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(chartData)
        .attr('fill', 'none')
        .attr('stroke', '#ffd000')
        .attr('stroke-width', 2.5)
        .attr('filter', 'url(#d3-glow)')
        .attr('d', lineGenerator);
    } else {
      // Dual Chart Mode: Win Streak Line vs Loss Streak Line
      const winLine = d3
        .line<DataPoint>()
        .x(d => xScale(d.index))
        .y(d => yScale(d.winStreak))
        .curve(d3.curveMonotoneX);

      const lossLine = d3
        .line<DataPoint>()
        .x(d => xScale(d.index))
        .y(d => yScale(d.lossStreak))
        .curve(d3.curveMonotoneX);

      // Win line (green)
      g.append('path')
        .datum(chartData)
        .attr('fill', 'none')
        .attr('stroke', '#00ff88')
        .attr('stroke-width', 2.5)
        .attr('filter', 'url(#d3-glow)')
        .attr('d', winLine);

      // Loss line (red)
      g.append('path')
        .datum(chartData)
        .attr('fill', 'none')
        .attr('stroke', '#ff2a4b')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '4,3')
        .attr('d', lossLine);
    }

    // Data points & Jackpot markers
    chartData.forEach(d => {
      const cx = xScale(d.index);
      const cy = chartMode === 'momentum' ? yScale(d.netStreak) : yScale(d.winStreak);
      const isWin = d.status === 'WIN' || d.status === 'JACKPOT';

      if (d.isJackpot) {
        // Special VIP Jackpot Marker (Gold Star/Diamond)
        const diamondSize = 6;
        g.append('polygon')
          .attr('points', `${cx},${cy - diamondSize} ${cx + diamondSize},${cy} ${cx},${cy + diamondSize} ${cx - diamondSize},${cy}`)
          .attr('fill', '#ffd000')
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 1.5)
          .attr('filter', 'url(#d3-glow)')
          .style('cursor', 'pointer');
      } else {
        // Normal circles
        g.append('circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', 3.5)
          .attr('fill', isWin ? '#00ff88' : '#ff2a4b')
          .attr('stroke', '#06060c')
          .attr('stroke-width', 1.5)
          .style('cursor', 'pointer');
      }

      // Invisible overlay for easy hover selection
      g.append('rect')
        .attr('x', cx - 8)
        .attr('y', 0)
        .attr('width', 16)
        .attr('height', innerHeight)
        .attr('fill', 'transparent')
        .style('cursor', 'pointer')
        .on('mouseenter', (event: MouseEvent) => {
          setHoveredPoint(d);
          try {
            if (containerRef.current) {
              const [px, py] = d3.pointer(event, containerRef.current);
              setTooltipPos({ x: px, y: py });
            }
          } catch {
            setTooltipPos({ x: cx, y: cy });
          }
        })
        .on('mouseleave', () => {
          setHoveredPoint(null);
          setTooltipPos(null);
        });
    });

    // X Axis Labels
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(Math.min(chartData.length, 6))
      .tickFormat(d => `R${d}`);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .attr('color', 'rgba(255, 255, 255, 0.4)')
      .selectAll('text')
      .style('font-family', 'Share Tech Mono, monospace')
      .style('font-size', '9px');

    // Y Axis Labels
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(5)
      .tickFormat(d => {
        const val = Number(d);
        if (chartMode === 'momentum') {
          if (val > 0) return `+${val}W`;
          if (val < 0) return `${val}L`;
          return '0';
        }
        return `${val}`;
      });

    g.append('g')
      .call(yAxis)
      .attr('color', 'rgba(255, 255, 255, 0.4)')
      .selectAll('text')
      .style('font-family', 'Share Tech Mono, monospace')
      .style('font-size', '9px');
  }, [chartData, chartMode, windowStats]);

  if (chartData.length < 2) {
    return (
      <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.08] text-center space-y-2">
        <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-orbitron font-bold">
          <TrendingUp className="w-4 h-4" /> D3.JS STREAK PERFORMANCE ENGINE
        </div>
        <p className="text-[11px] font-mono text-gray-400">
          Gathering round records... Live D3.js streak visualizer will illuminate once 2+ rounds resolve!
        </p>
      </div>
    );
  }

  return (
    <div
      id="d3-streak-chart-container"
      ref={containerRef}
      className="relative rounded-2xl bg-gradient-to-b from-[#0c0c16]/95 via-[#080810]/95 to-[#040408] border border-amber-500/30 p-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(255,208,0,0.1)] overflow-hidden"
    >
      {/* Header & Mode Selector */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-orbitron font-black text-white tracking-wider flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> D3.JS STREAK MOMENTUM (LAST 50)
          </span>
        </div>

        <div className="flex items-center gap-1 bg-black/60 p-0.5 rounded-lg border border-white/[0.08]">
          <button
            type="button"
            onClick={() => setChartMode('momentum')}
            className={`px-2 py-0.5 rounded text-[8px] font-orbitron font-bold transition-all cursor-pointer ${
              chartMode === 'momentum'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            MOMENTUM
          </button>
          <button
            type="button"
            onClick={() => setChartMode('dual')}
            className={`px-2 py-0.5 rounded text-[8px] font-orbitron font-bold transition-all cursor-pointer ${
              chartMode === 'dual'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            DUAL CURVE
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-4 gap-1.5 mb-2.5">
        <div className="p-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
          <div className="text-[8px] font-mono text-emerald-300/80">PEAK WIN STREAK</div>
          <div className="font-orbitron font-black text-xs text-emerald-400">+{windowStats.peakWin}W</div>
        </div>

        <div className="p-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
          <div className="text-[8px] font-mono text-red-300/80">MAX LOSS STREAK</div>
          <div className="font-orbitron font-black text-xs text-red-400">-{windowStats.peakLoss}L</div>
        </div>

        <div className="p-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
          <div className="text-[8px] font-mono text-amber-300/80">WIN RATE (50G)</div>
          <div className="font-orbitron font-black text-xs text-amber-400">{windowStats.winRate}%</div>
        </div>

        <div className="p-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
          <div className="text-[8px] font-mono text-purple-300/80">9× JACKPOTS</div>
          <div className="font-orbitron font-black text-xs text-purple-300">{windowStats.jackpotCount} 🔒</div>
        </div>
      </div>

      {/* D3 SVG Canvas */}
      <div className="w-full relative">
        <svg ref={svgRef} className="overflow-visible" />

        {/* Interactive Dynamic D3 Tooltip */}
        {hoveredPoint && tooltipPos && (
          <div
            className="absolute z-30 pointer-events-none p-2.5 rounded-xl bg-black/95 border border-amber-400/60 shadow-[0_0_15px_rgba(0,0,0,0.9),0_0_10px_rgba(255,208,0,0.3)] backdrop-blur-md text-[10px] font-mono -translate-x-1/2 -translate-y-full mb-2 w-44"
            style={{
              left: Math.min(Math.max(tooltipPos.x, 90), (containerRef.current?.clientWidth || 300) - 90),
              top: Math.max(tooltipPos.y - 10, 10)
            }}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-1 mb-1">
              <span className="font-orbitron font-bold text-amber-400">#{hoveredPoint.period.slice(-4)}</span>
              <span
                className={`font-orbitron font-extrabold px-1.5 py-0.2 rounded text-[9px] ${
                  hoveredPoint.status === 'JACKPOT'
                    ? 'bg-amber-500 text-black font-black'
                    : hoveredPoint.status === 'WIN'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}
              >
                {hoveredPoint.status}
              </span>
            </div>

            <div className="space-y-0.5 text-gray-300">
              <div className="flex justify-between">
                <span>Predicted:</span>
                <span className="font-bold text-white">{hoveredPoint.prediction}</span>
              </div>
              {hoveredPoint.actualNumber !== undefined && (
                <div className="flex justify-between">
                  <span>Actual Hit:</span>
                  <span className="font-bold text-amber-300">
                    {hoveredPoint.actualNumber} ({hoveredPoint.actualSize})
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Active Streak:</span>
                <span
                  className={`font-bold ${
                    hoveredPoint.netStreak > 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {hoveredPoint.netStreak > 0
                    ? `+${hoveredPoint.netStreak} Win Streak`
                    : `-${hoveredPoint.lossStreak} Loss Streak`}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend & Footnote */}
      <div className="flex items-center justify-between text-[9px] font-mono text-gray-400 mt-1 pt-1.5 border-t border-white/[0.06]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Win Streaks (+W)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Loss Streaks (-L)
          </span>
          <span className="flex items-center gap-1 text-amber-300 font-bold">
            ◆ 9× Jackpot Hit
          </span>
        </div>
        <span className="text-gray-400">Hover for round details</span>
      </div>
    </div>
  );
};
