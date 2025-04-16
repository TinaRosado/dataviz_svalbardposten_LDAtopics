import { scaleBand, scaleLinear, scaleSqrt } from "d3";

export function createTimeScale(domain, { marginTop, height }) {
    return scaleBand()
      .domain(domain)
      .range([marginTop, height - marginTop])
      .padding(0.5);
  }
  
  export function createRankScale(sortedData, { marginLeft, width }) {
    const maxRank = Math.max(...sortedData.map(d => d.sequentialRank), 60);
    return scaleLinear()
      .domain([1, maxRank])
      .range([marginLeft, width - marginLeft]);
  }
  
 
  export function createSizeScales(data) {
    const counts = data.map(d => d.word_count);
    const minC = Math.min(...counts);
    const maxC = Math.max(...counts);
    return {
      widthScale: scaleSqrt().domain([minC, maxC]).range([3, 16]),
      heightScale: scaleSqrt().domain([minC, maxC]).range([3, 16])
    };
  }
