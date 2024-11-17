import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

const SpreadIndicator = () => {
  const [spreadData, setSpreadData] = useState([]);
  const svgRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('/api/fetchOrderbook');
      const bids = parseFloat(response.data.bids[0][0]);
      const asks = parseFloat(response.data.asks[0][0]);
      const spread = asks - bids;
      setSpreadData((prev) => [...prev.slice(-59), spread]); // Limit to last 60 data points
    };

    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (spreadData.length > 0) {
      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove(); // Clear previous SVG elements

      const width = 400;
      const height = 200;
      const margin = { top: 10, right: 20, bottom: 30, left: 40 };
      const x = d3.scaleLinear().domain([0, spreadData.length]).range([0, width - margin.left - margin.right]);
      const y = d3.scaleLinear().domain([0, d3.max(spreadData)]).range([height - margin.top - margin.bottom, 0]);

      const line = d3.line()
        .x((d, i) => x(i))
        .y(d => y(d));

      svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .append('path')
        .data([spreadData])
        .attr('fill', 'none')
        .attr('stroke', '#007bff')
        .attr('stroke-width', 1.5)
        .attr('d', line);

      // Add axis
      svg.append('g')
        .attr('transform', `translate(${margin.left},${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(5));

      svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .call(d3.axisLeft(y).ticks(5));
    }
  }, [spreadData]);

  return (
    <div className="chartContainer">
      <h2>Spread Indicator</h2>
      <svg ref={svgRef} width={500} height={250}></svg>
    </div>
  );
};

export default SpreadIndicator;
