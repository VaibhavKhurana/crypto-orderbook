import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const OrderbookImbalance = ({ orderbook }) => {
  const [imbalance, setImbalance] = useState(0);
  const svgRef = useRef();

  useEffect(() => {
    if (orderbook.bids && orderbook.asks) {
      const totalBids = orderbook.bids.reduce((sum, bid) => sum + parseFloat(bid[1]), 0);
      const totalAsks = orderbook.asks.reduce((sum, ask) => sum + parseFloat(ask[1]), 0);
      const imbalance = ((totalBids - totalAsks) / (totalBids + totalAsks)) * 100;
      setImbalance(imbalance);
    }
  }, [orderbook]);

  useEffect(() => {
    if (imbalance !== 0) {
      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove(); // Clear previous SVG elements

      const width = 400;
      const height = 200;

      const x = d3.scaleBand()
        .domain(['Imbalance'])
        .range([0, width])
        .padding(0.1);

      const y = d3.scaleLinear()
        .domain([-100, 100])
        .range([height, 0]);

      svg.append('g')
        .attr('transform', 'translate(50, 20)')
        .selectAll('.bar')
        .data([imbalance])
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', x('Imbalance'))
        .attr('y', d => y(d))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d))
        .attr('fill', imbalance > 0 ? 'green' : 'red');

      svg.append('g')
        .attr('transform', 'translate(50, 20)')
        .call(d3.axisLeft(y).ticks(5));

      svg.append('g')
        .attr('transform', `translate(50, ${height + 20})`)
        .call(d3.axisBottom(x));
    }
  }, [imbalance]);

  return (
    <div className="chartContainer">
      <h2>Orderbook Imbalance</h2>
      <svg ref={svgRef} width={500} height={250}></svg>
    </div>
  );
};

export default OrderbookImbalance;
