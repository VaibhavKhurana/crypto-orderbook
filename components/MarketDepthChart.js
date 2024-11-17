import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const MarketDepthChart = ({ orderbook }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (orderbook.bids && orderbook.asks) {
      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove(); // Clear previous SVG elements

      const width = 500;
      const height = 300;
      const margin = { top: 20, right: 20, bottom: 40, left: 40 };

      const x = d3.scaleLinear()
        .domain([0, Math.max(orderbook.bids.length, orderbook.asks.length)])
        .range([0, width - margin.left - margin.right]);

      const y = d3.scaleLinear()
        .domain([0, Math.max(d3.max(orderbook.bids, bid => parseFloat(bid[1])), d3.max(orderbook.asks, ask => parseFloat(ask[1])))])
        .range([height - margin.top - margin.bottom, 0]);

      const bidLine = d3.line()
        .x((d, i) => x(i))
        .y(d => y(d[1]));

      const askLine = d3.line()
        .x((d, i) => x(i))
        .y(d => y(d[1]));

      svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .append('path')
        .data([orderbook.bids])
        .attr('fill', 'none')
        .attr('stroke', 'green')
        .attr('stroke-width', 1.5)
        .attr('d', bidLine);

      svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .append('path')
        .data([orderbook.asks])
        .attr('fill', 'none')
        .attr('stroke', 'red')
        .attr('stroke-width', 1.5)
        .attr('d', askLine);

      svg.append('g')
        .attr('transform', `translate(${margin.left},${height - margin.bottom})`)
        .call(d3.axisBottom(x));

      svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .call(d3.axisLeft(y));
    }
  }, [orderbook]);

  return (
    <div className="chartContainer">
      <h2>Market Depth Chart</h2>
      <svg ref={svgRef} width={500} height={300}></svg>
    </div>
  );
};

export default MarketDepthChart;
