// import * as d3 from "d3";
// import { useEffect, useState, useRef } from 'react';

// export function Chart({ data }) {
//   const marginLeft = 100;
//   const width = 1200;
//   const height = 4000;  //4000
//   const marginRight = 80;
//   const marginTop = 40;
//   const marginBottom = 20;
//   const heightBound = height - marginTop - marginBottom;
//   const widthBound = width - marginLeft - marginRight;

//   const svgRef = useRef(null);
//   const [sortMethod, setSortMethod] = useState('monthly'); // word-count monthly is default sorting order
//   const rectrad = 2  // define rectangles radius

//   // Sorting functions ///////////////////////

//   // Sorting Data Monthly
//   const sortDataMonthly = (processedData) => {
//     const groupedData = d3.group(processedData,
//       d => `${d.dateObj.getFullYear()}-${String(d.dateObj.getMonth() + 1).padStart(2, '0')}`
//     );
//     return Array.from(groupedData.entries()).flatMap(([monthYear, articles]) => {
//       // Sort articles by word count (ascending)
//       const sortedArticles = articles.sort((a, b) => a.word_count - b.word_count);
//       // Assign sequential ranks
//       return sortedArticles.map((article, index) => ({
//         ...article,
//         sequentialRank: index + 4
//       }));
//     });
//   };

//   // Sorting Data Weekly
//   const sortDataWeekly = (processedData) => {
//     const groupedData = d3.group(processedData,
//       d => `${d.dateObj.getFullYear()}-${String(d.dateObj.getMonth() + 1).padStart(2, '0')}`
//     );

//     return Array.from(groupedData.entries()).flatMap(([monthYear, articles]) => {
//       // Sort articles by week and word count
//       const sortedArticles = articles.sort((a, b) => {
//         // Get week numbers
//         const weekA = d3.timeWeek.count(d3.timeYear(a.dateObj), a.dateObj);
//         const weekB = d3.timeWeek.count(d3.timeYear(b.dateObj), b.dateObj);
//         // First sort by week
//         const weekDiff = weekA - weekB;
//         if (weekDiff !== 0) return weekDiff;
//         // Then by word count (ascending)
//         return a.word_count - b.word_count;
//       });
//       // Assign sequential ranks
//       return sortedArticles.map((article, index) => ({
//         ...article,
//         sequentialRank: index + 4,
//         weekNumber: d3.timeWeek.count(d3.timeYear(article.dateObj), article.dateObj)
//       }));
//     });
//   };

//   // Sorting Data Daily
//   const sortDataDaily = (processedData) => {
//     const groupedData = d3.group(processedData,
//       d => `${d.dateObj.getFullYear()}-${String(d.dateObj.getMonth() + 1).padStart(2, '0')}`
//     );

//     return Array.from(groupedData.entries()).flatMap(([monthYear, articles]) => {
//       // Sort articles by day and word count
//       const sortedArticles = articles.sort((a, b) => {
//         // First sort by day
//         const dayDiff = a.dateObj.getDate() - b.dateObj.getDate();
//         if (dayDiff !== 0) return dayDiff;
//         // Then by word count (ascending)
//         return a.word_count - b.word_count;
//       });

//       // Assign sequential ranks
//       return sortedArticles.map((article, index) => ({
//         ...article,
//         sequentialRank: index + 4
//       }));
//     });
//   };

//   // Data: Topic labels mapping ///////////////////////
//   const topicLabels = {
//     0: "Cultural Events",
//     1: "Avalanche/Landslide Risk",
//     2: "Maritime Transportation",
//     3: "Construction & Development",
//     4: "Employment & Workplace",
//     5: "Coal Mining (Svea)",
//     6: "Travel & Regulations",
//     7: "Education & Schools",
//     8: "Accidents & Emergency",
//     9: "Finances & Budgets",
//     10: "Polar Bear Encounters",
//     11: "Air Transportation",
//     12: "Norwegian Nynorsk Content",
//     13: "Research & Science",
//     14: "Norwegian Development Policy",
//     15: "Community & Church Life",
//     16: "Travel & Outdoor Activities",
//     17: "Tourism & Museums",
//     18: "Media & Publications",
//     19: "Local Governance",
//     20: "Cabin/Tourism Regulations",
//     21: "Wildlife & Hunting",
//     22: "Legal Proceedings",
//     23: "Russian Settlements",
//     24: "Dogs & Winter Activities",
//     25: "Administrative Permissions"
//   };

//   // Get Data ///////////////////////
//   useEffect(() => {
//     if (!data || data.length === 0) return;
//     // Filter and process data
//     const processedData = data
//       .filter(d => {
//         const date = new Date(d.published);
//         return date.getFullYear() >= 2006 &&
//                date.getFullYear() <= 2024 &&
//                d.word_count > 0;
//       })
//       .map(d => ({
//         ...d,
//         dateObj: new Date(d.published)
//       }));

//     // Choose sorting method based on state ///////////////////////
//     let sortedData;
//     switch (sortMethod) {
//       case 'weekly':
//         sortedData = sortDataWeekly(processedData);
//         break;
//       case 'daily':
//         sortedData = sortDataDaily(processedData);
//         break;
//       default:
//         sortedData = sortDataMonthly(processedData);
//     }

//     // Get unique month-years for y-axis ///////////////////////
//     const groupedData = d3.group(processedData,
//       d => `${d.dateObj.getFullYear()}-${String(d.dateObj.getMonth() + 1).padStart(2, '0')}`
//     );
//     const uniqueMonthYears = Array.from(groupedData.keys()).sort();

//     // Create scales ///////////////////////
//     const timeScale = d3.scaleBand()
//       .domain(uniqueMonthYears)
//       .range([marginTop, heightBound])
//       .padding(0.5);

//     const rankScale = d3.scaleLinear()
//       .domain([1, d3.max(sortedData, d => d.sequentialRank)])
//       .range([marginLeft, marginLeft + widthBound]);

//     const multiHeight = 4; //4
//     const heightScale = d3.scaleSqrt()
//       .domain([d3.min(processedData, d => d.word_count), d3.max(processedData, d => d.word_count)])
//       .range([3, 16]);

//     const multiWidth = 0.005;
//     const widthScale = d3.scaleSqrt()
//       .domain([d3.min(processedData, d => d.word_count), d3.max(processedData, d => d.word_count)])
//       .range([3, 16]);

//     // Clear previous content ///////////////////////
//     const svg = d3.select(svgRef.current);
//     svg.selectAll("*").remove();

//     // Add sorting method selection text ///////////////////////
//     const sortMethodTexts = [
//       { text: 'monthly',y : marginTop - 20, x: marginLeft + 20, color: sortMethod === 'monthly' ? 'red' : 'black' },
//       { text: 'weekly', y : marginTop - 20,x: marginLeft + 100, color: sortMethod === 'weekly' ? 'red' : 'black' },
//       { text: 'daily',y : marginTop - 20, x: marginLeft + 180, color: sortMethod === 'daily' ? 'red' : 'black' }
//     ];

//     svg.selectAll(".sort-method-text")
//       .data(sortMethodTexts)
//       .enter()
//       .append("text")
//       .attr("class", "sort-method-text")
//       .attr("x", d => d.x)
//       .attr("y", d => d.y)
//       .attr("text-anchor", "start")
//       .attr("fill", d => d.color)
//       .style("cursor", "pointer")
//       .style("font-size", "12px")
//       .text(d => d.text)
//       .on("click", (event, d) => {
//         setSortMethod(d.text);
//       });

//     // Add axes ///////////////////////
//     const yAxis = d3.axisLeft()
//       .scale(timeScale)
//       .tickFormat((d, i) => {
//         const [year, month] = d.split('-');
//         // Only return formatted text if the month is January
//         if (month === '01') {
//           const date = new Date(year, month - 1);
//           return d3.timeFormat("%b %Y")(date);
//         }
//         // Return empty string for non-January months
//         return '';
//       });

//     svg.append("g")
//       .attr("class", "y-axis")
//       .attr("transform", `translate(${marginLeft}, 0)`)
//       .call(yAxis)
//       .call(g => g.selectAll(".domain").remove());

//     const xAxis = d3.axisTop(rankScale)
//       .tickValues(d3.range(60, d3.max(sortedData, d => d.sequentialRank), 60))
//       .tickFormat(d => `Article ${d}`)
//       .tickSize(-(heightBound - marginTop));  // Extend ticks across the chart height

//     svg.append("g")
//       .attr("class", "x-axis")
//       .attr("transform", `translate(0, ${marginTop})`)
//       .call(xAxis)
//       .call(g => {
//         g.selectAll(".domain").remove();
//         g.selectAll(".tick line")
//           .attr("stroke-width", 0.5);
//       });

//     // Add tooltip ///////////////////////
//     const tooltip = d3.select("body").append("div")
//       .attr("class", "tooltip")
//       .style("position", "absolute")
//       .style("visibility", "hidden")
//       .style("background-color", "white")
//       .style("padding", "10px")
//       .style("border", "0.5px solid #ddd")
//       .style("border-radius", "4px")
//       .style("pointer-events", "none")
//       .style("font-size", "12px")
//       .style("line-height", "1.4");

//     // Add rectangles  ///////////////////////
//     const rectangles = svg.selectAll("rect")
//       .data(sortedData)
//       .enter()
//       .append("rect")
//       .attr("class", d => `topic-${d.dominant_topic_label.replace(/\s+/g, '-')}`)
//       .attr("x", d => rankScale(d.sequentialRank))
//       .attr("y", d => {
//         const monthYear = `${d.dateObj.getFullYear()}-${String(d.dateObj.getMonth() + 1).padStart(2, '0')}`;
//         return timeScale(monthYear);
//       })
//       .attr("width", d => widthScale(d.word_count * multiWidth))
//       .attr("height", d => heightScale(d.word_count * multiHeight))
//       .attr("fill", "black")
//       .style("opacity", 1)
//       .attr("rx", rectrad) //2
//       .attr("ry", rectrad) //2
//       .style("cursor", "pointer");

//     // Create legend for word count ///////////////////////
//     const legendData = [
//       d3.min(processedData, d => d.word_count),
//       Math.round(d3.mean(processedData, d => d.word_count)),
//       d3.max(processedData, d => d.word_count)
//     ];

//     const legendGroup = svg.append("g")
//       .attr("class", "word-count-legend")
//       .attr("transform", `translate(${width - marginRight - 200}, ${marginTop + 60})`);

//     // Add legend title
//     legendGroup.append("text")
//       .attr("x", 0)
//       .attr("y", -10)
//       .attr("font-size", "12px")
//       .text("Word Count Legend");

//     // Create legend items
//     const legendItems = legendGroup.selectAll(".legend-item")
//       .data(legendData)
//       .enter()
//       .append("g")
//       .attr("class", "legend-item")
//       .attr("transform", (d, i) => `translate(0, ${i * 25})`);

//     // Add rectangles to legend
//     legendItems.append("rect")
//       .attr("x", 0)
//       .attr("y", 0)
//       .attr("width", d => widthScale(d * multiWidth))
//       .attr("height", d => heightScale(d * multiHeight))
//       .attr("fill", "black")
//       .attr("rx", rectrad)  //2
//       .attr("ry", rectrad); //2

//     // Add text next to rectangles
//     legendItems.append("text")
//       .attr("x", 30)
//       .attr("y", 10)
//       .attr("font-size", "10px")
//       .text(d => `${d} words`);

//     // Add hover effects - tooltip ///////////////////////
//     rectangles
//       .on("mouseover", (event, d) => {
//         const dateStr = d.dateObj.toLocaleDateString('en-US', {
//           month: 'numeric',
//           day: 'numeric',
//           year: 'numeric'
//         });

//         tooltip
//           .style("visibility", "visible")
//           .html(`<b>${d.dominant_topic_label}</b> ${dateStr}<br>${d.title}<br>Words: ${d.word_count}`);
//       })
//       .on("mousemove", (event) => {
//         tooltip
//           .style("top", (event.pageY - 10) + "px")
//           .style("left", (event.pageX + 10) + "px");
//       })
//       .on("mouseout", () => {
//         tooltip.style("visibility", "hidden");
//       });

//     // Cleanup ///////////////////////
//     return () => {
//       d3.select("body").selectAll(".tooltip").remove();
//     };
//   }, [data, sortMethod]);

//   return (
//     <div className="flex flex-col items-start mb-4">
//       <h1 className="text-2xl font-bold mb-2">Svalbardposten's Born-Digital Archive</h1>
//       <p className="text-md text-gray-600">
//         This project aims to make accessible the daily news articles published in the <a href="https://svalbardposten.no">Svalbardposten's website</a>.
//       </p>
//       <p className="text-md text-gray-600">
//         Arranged Monthly (2006-2024) <b>+</b> <span style={{color: 'red'}}>Sorted </span>by Article Word Count (monthly, weekly, daily)
//       </p>
//       <br></br>
//       <svg
//         ref={svgRef}
//         width={width}
//         height={height}
//         className="bg-white"
//       />
//     </div>
//   );
// }

// export default Chart;

////////////////////////////////////////////////////////////////

import * as d3 from "d3";
import { useEffect, useState, useRef } from "react";

export function Chart({ data }) {
  const marginLeft = 100;
  const width = 1200;
  const height = 4000;
  const marginRight = 80;
  const marginTop = 40;
  const marginBottom = 20;
  const heightBound = height - marginTop - marginBottom;
  const widthBound = width - marginLeft - marginRight;

  const svgRef = useRef(null);
  const [sortMethod, setSortMethod] = useState("monthly"); // Default sorting order
  const [selectedTopic, setSelectedTopic] = useState("All Topics"); // Default is no topic selected
  const [selectedCluster, setSelectedCluster] = useState("All Clusters"); // Default is no cluster selected
  const rectrad = 2; // Define rectangles radius

  // Get dominant topic label from topic ID
  const getDominantTopicLabel = (article) => {
    if (
      article.dominant_topic_id !== undefined &&
      topicLabels[article.dominant_topic_id] !== undefined
    ) {
      return topicLabels[article.dominant_topic_id];
    }

    // // If direct lookup fails, check other possible fields
    // if (article.dominant_topic_label) {
    //   return article.dominant_topic_label;
    // }

    // return "Unknown Topic";
  };

  // Sorting functions
  const sortDataMonthly = (processedData) => {
    const groupedData = d3.group(
      processedData,
      (d) =>
        `${d.dateObj.getFullYear()}-${String(d.dateObj.getMonth() + 1).padStart(
          2,
          "0"
        )}`
    );
    return Array.from(groupedData.entries()).flatMap(
      ([monthYear, articles]) => {
        // Sort articles by word count (ascending)
        const sortedArticles = articles.sort(
          (a, b) => a.word_count - b.word_count
        );
        // Assign sequential ranks
        return sortedArticles.map((article, index) => ({
          ...article,
          sequentialRank: index + 4,
        }));
      }
    );
  };

  const sortDataWeekly = (processedData) => {
    const groupedData = d3.group(
      processedData,
      (d) =>
        `${d.dateObj.getFullYear()}-${String(d.dateObj.getMonth() + 1).padStart(
          2,
          "0"
        )}`
    );

    return Array.from(groupedData.entries()).flatMap(
      ([monthYear, articles]) => {
        // Sort articles by week and word count
        const sortedArticles = articles.sort((a, b) => {
          // Get week numbers
          const weekA = d3.timeWeek.count(d3.timeYear(a.dateObj), a.dateObj);
          const weekB = d3.timeWeek.count(d3.timeYear(b.dateObj), b.dateObj);
          // First sort by week
          const weekDiff = weekA - weekB;
          if (weekDiff !== 0) return weekDiff;
          // Then by word count (ascending)
          return a.word_count - b.word_count;
        });
        // Assign sequential ranks
        return sortedArticles.map((article, index) => ({
          ...article,
          sequentialRank: index + 4,
          weekNumber: d3.timeWeek.count(
            d3.timeYear(article.dateObj),
            article.dateObj
          ),
        }));
      }
    );
  };

  const sortDataDaily = (processedData) => {
    const groupedData = d3.group(
      processedData,
      (d) =>
        `${d.dateObj.getFullYear()}-${String(d.dateObj.getMonth() + 1).padStart(
          2,
          "0"
        )}`
    );

    return Array.from(groupedData.entries()).flatMap(
      ([monthYear, articles]) => {
        // Sort articles by day and word count
        const sortedArticles = articles.sort((a, b) => {
          // First sort by day
          const dayDiff = a.dateObj.getDate() - b.dateObj.getDate();
          if (dayDiff !== 0) return dayDiff;
          // Then by word count (ascending)
          return a.word_count - b.word_count;
        });

        // Assign sequential ranks
        return sortedArticles.map((article, index) => ({
          ...article,
          sequentialRank: index + 4,
        }));
      }
    );
  };

  const sortDataProbability = (processedData) => {
    //add code here
  };

  // Data: Topic labels mapping
  const topicLabels = {
    0: "Cultural Events",
    1: "Avalanche/Landslide Risk",
    2: "Maritime Transportation",
    3: "Construction & Development",
    4: "Employment & Workplace",
    5: "Coal Mining (Svea)",
    6: "Travel & Regulations",
    7: "Education & Schools",
    8: "Accidents & Emergency",
    9: "Finances & Budgets",
    10: "Polar Bear Encounters",
    11: "Air Transportation",
    12: "Norwegian Nynorsk Content",
    13: "Research & Science",
    14: "Norwegian Development Policy",
    15: "Community & Church Life",
    16: "Travel & Outdoor Activities",
    17: "Tourism & Museums",
    18: "Media & Publications",
    19: "Local Governance",
    20: "Cabin/Tourism Regulations",
    21: "Wildlife & Hunting",
    22: "Legal Proceedings",
    23: "Russian Settlements",
    24: "Dogs & Winter Activities",
    25: "Administrative Permissions",
  };

  // Main visualization effect
  useEffect(() => {
    if (!data || data.length === 0) return;

    // Filter/highlight and process data
    const processedData = data
      .filter((d) => {
        const date = new Date(d.published);
        return (
          date.getFullYear() >= 2006 &&
          date.getFullYear() <= 2024 &&
          d.word_count > 0
        );
      })
      .map((d) => ({
        ...d,
        dateObj: new Date(d.published),
      }));

    // Choose sorting method based on state
    let sortedData;
    switch (sortMethod) {
      case "weekly":
        sortedData = sortDataWeekly(processedData);
        break;
      case "daily":
        sortedData = sortDataDaily(processedData);
        break;
      default:
        sortedData = sortDataMonthly(processedData);
    }

    // Get unique month-years for y-axis
    const groupedData = d3.group(
      processedData,
      (d) =>
        `${d.dateObj.getFullYear()}-${String(d.dateObj.getMonth() + 1).padStart(
          2,
          "0"
        )}`
    );
    const uniqueMonthYears = Array.from(groupedData.keys()).sort();

    // Create scales
    const timeScale = d3
      .scaleBand()
      .domain(uniqueMonthYears)
      .range([marginTop, heightBound])
      .padding(0.5);

    const rankScale = d3
      .scaleLinear()
      .domain([1, d3.max(sortedData, (d) => d.sequentialRank) || 10])
      .range([marginLeft, marginLeft + widthBound]);

    const probScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([marginLeft, marginLeft + widthBound]);

    const multiHeight = 4;
    const heightScale = d3
      .scaleSqrt()
      .domain([
        d3.min(processedData, (d) => d.word_count) || 1,
        d3.max(processedData, (d) => d.word_count) || 1000,
      ])
      .range([3, 16]);

    const multiWidth = 0.005;
    const widthScale = d3
      .scaleSqrt()
      .domain([
        d3.min(processedData, (d) => d.word_count) || 1,
        d3.max(processedData, (d) => d.word_count) || 1000,
      ])
      .range([3, 16]);

    // Clear previous content
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Add sorting method selection text
    const sortMethodTexts = [
      {
        text: "monthly",
        y: marginTop - 20,
        x: marginLeft + 20,
        color: sortMethod === "monthly" ? "red" : "black",
      },
      {
        text: "weekly",
        y: marginTop - 20,
        x: marginLeft + 80,
        color: sortMethod === "weekly" ? "red" : "black",
      },
      {
        text: "daily",
        y: marginTop - 20,
        x: marginLeft + 140,
        color: sortMethod === "daily" ? "red" : "black",
      },
      {
        text: "probability",
        y: marginTop - 20,
        x: marginLeft + 200,
        color: sortMethod === "probability" ? "red" : "black",
        visible: false,
      },
    ];

    svg
      .selectAll(".sort-method-text")
      .data(sortMethodTexts)
      .enter()
      .append("text")
      .attr("class", "sort-method-text")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("text-anchor", "start")
      .attr("fill", (d) => d.color)
      .style("cursor", "pointer")
      .style("font-size", "12px")
      .text((d) => d.text)
      .on("click", (event, d) => {
        setSortMethod(d.text);
      });

    // Add axes
    const yAxis = d3
      .axisLeft()
      .scale(timeScale)
      .tickFormat((d, i) => {
        const [year, month] = d.split("-");
        // Only return formatted text if the month is January
        if (month === "01") {
          const date = new Date(year, month - 1);
          return d3.timeFormat("%b %Y")(date);
        }
        // Return empty string for non-January months
        return "";
      });

    svg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${marginLeft}, 0)`)
      .call(yAxis)
      .call((g) => g.selectAll(".domain").remove());

    const xAxis = d3
      .axisTop(rankScale)
      .tickValues(
        d3.range(60, d3.max(sortedData, (d) => d.sequentialRank) || 60, 60)
      )
      .tickFormat((d) => `Article ${d}`)
      .tickSize(-(heightBound - marginTop));

    const probAxis = d3
      .axisTop(probScale)
      .tickValues(d3.range(0, 101, 10))
      .tickFormat(d3.format(".0%"))
      .tickSize(-(heightBound - marginTop));

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${marginTop})`)
      .call(xAxis)
      .call((g) => {
        g.selectAll(".domain").remove();
        g.selectAll(".tick line").attr("stroke-width", 0.5);
      });

    // Add tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("padding", "10px")
      .style("border", "0.5px solid #ddd")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("font-size", "12px")
      .style("line-height", "1.4");

    // Add rectangles - all articles remain visible, but highlighted in red if matching selection
    const rectangles = svg
      .selectAll("rect")
      .data(sortedData)
      .enter()
      .append("rect")
      .attr(
        "class",
        (d) => `topic-${d.dominant_topic_label.replace(/\s+/g, "-")}`
      )
      .attr("x", (d) => rankScale(d.sequentialRank))
      .attr("y", (d) => {
        const monthYear = `${d.dateObj.getFullYear()}-${String(
          d.dateObj.getMonth() + 1
        ).padStart(2, "0")}`;
        return timeScale(monthYear);
      })
      .attr("width", (d) => widthScale(d.word_count * multiWidth))
      .attr("height", (d) => heightScale(d.word_count * multiHeight))
      .attr("fill", (d) => {
        // Color by selection
        if (
          selectedTopic !== "All Topics" &&
          d.dominant_topic_label === selectedTopic
        ) {
          return "red"; // Highlight selected topic in red
        } else if (
          selectedCluster !== "All Clusters" &&
          d.dominant_cluster === selectedCluster
        ) {
          return "red"; // Highlight selected cluster in red
        } else {
          return "black"; // All others are black
        }
      })
      .style("opacity", (d) => {
        // Make selected articles more prominent
        if (
          (selectedTopic !== "All Topics" &&
            d.dominant_topic_label === selectedTopic) ||
          (selectedCluster !== "All Clusters" &&
            d.dominant_cluster === selectedCluster)
        ) {
          return 1.0; // Full opacity for selected
        } else if (
          selectedTopic !== "All Topics" ||
          selectedCluster !== "All Clusters"
        ) {
          return 1.0; // Slightly faded for non-selected when a filter is active
        } else {
          return 1.0; // Full opacity when no filter
        }
      })
      .attr("rx", rectrad)
      .attr("ry", rectrad)
      .style("cursor", "pointer");

    // Legends
    // Create legend for word count
    const legendData = [
      d3.min(processedData, (d) => d.word_count) || 100,
      Math.round(d3.mean(processedData, (d) => d.word_count) || 500),
      d3.max(processedData, (d) => d.word_count) || 1000,
    ];

    const legendGroup = svg
      .append("g")
      .attr("class", "word-count-legend")
      .attr(
        "transform",
        `translate(${width - marginRight - 200}, ${marginTop + 60})`
      );

    // Add legend title
    legendGroup
      .append("text")
      .attr("x", 0)
      .attr("y", -10)
      .attr("font-size", "12px")
      .text("Word Count Legend");

    // Create legend items
    const legendItems = legendGroup
      .selectAll(".legend-item")
      .data(legendData)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 25})`);

    // Add rectangles to legend
    legendItems
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", (d) => widthScale(d * multiWidth))
      .attr("height", (d) => heightScale(d * multiHeight))
      .attr("fill", "black")
      .attr("rx", rectrad)
      .attr("ry", rectrad);

    // Add text next to rectangles
    legendItems
      .append("text")
      .attr("x", 30)
      .attr("y", 10)
      .attr("font-size", "10px")
      .text((d) => `${d} words`);

    // Add selection legend if a topic/cluster is selected
    if (selectedTopic !== "All Topics" || selectedCluster !== "All Clusters") {
      const selectionLegendGroup = svg
        .append("g")
        .attr("class", "selection-legend")
        .attr(
          "transform",
          `translate(${width - marginRight - 200}, ${marginTop + 160})`
        );

      selectionLegendGroup
        .append("text")
        .attr("x", 0)
        .attr("y", -10)
        .attr("font-size", "12px")
        .text("Selection Legend");

      // Legend for selected
      selectionLegendGroup
        .append("rect")
        .attr("x", 0)
        .attr("y", 5)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", "red");

      selectionLegendGroup
        .append("text")
        .attr("x", 20)
        .attr("y", 15)
        .attr("font-size", "10px")
        .text(selectedTopic !== "All Topics" ? selectedTopic : selectedCluster);

      // Legend for non-selected
      selectionLegendGroup
        .append("rect")
        .attr("x", 0)
        .attr("y", 30)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", "black")
        .style("opacity", 0.5);

      selectionLegendGroup
        .append("text")
        .attr("x", 20)
        .attr("y", 40)
        .attr("font-size", "10px")
        .text("Other articles");
    }

    // Add hover effects - tooltip
    rectangles
      .on("mouseover", (event, d) => {
        const dateStr = d.dateObj.toLocaleDateString("en-US", {
          month: "numeric",
          day: "numeric",
          year: "numeric",
        });

        // Highlight on hover
        d3.select(event.target)
          .attr("stroke", d3.select(event.target).attr("fill"))
          .attr("stroke-width", 2);

        tooltip.style("visibility", "visible").html(`
            <b>${d.title}</b><br>
            <b>Topic:</b> ${d.dominant_topic_label}<br>
            <b>Cluster:</b> ${d.dominant_cluster}<br>
            <b>Date:</b> ${dateStr}<br>
            <b>Words:</b> ${d.word_count}
          `);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", (event) => {
        // Remove highlight on mouseout
        d3.select(event.target).attr("stroke", "none");

        tooltip.style("visibility", "hidden");
      });

    // Cleanup
    return () => {
      d3.select("body").selectAll(".tooltip").remove();
    };
  }, [data, sortMethod, selectedTopic, selectedCluster]);

  // Create topic and cluster filter dropdowns ///////////////////////
  useEffect(() => {
    if (!data || data.length === 0) return;

    // Extract unique topics and clusters
    const topics = [
      "All Topics",
      ...new Set(data.map((d) => d.dominant_topic_label)),
    ].sort();
    const clusters = [
      "All Clusters",
      ...new Set(data.map((d) => d.dominant_cluster)),
    ].sort();

    // Create filter container
    const container = d3.select(svgRef.current.parentNode);
    let filterControls = container.select(".filter-controls");

    // If filter controls don't exist, create them
    if (filterControls.empty()) {
      filterControls = container
        .insert("div", "svg")
        .attr("class", "filter-controls")
        .style("margin", "15px 0")
        .style("display", "flex")
        .style("gap", "20px")
        .style("align-items", "center");

      // Topic filter
      const topicFilter = filterControls.append("div");
      topicFilter
        .append("label")
        .attr("for", "topic-filter")
        .text("Highlight Topic: ")
        .style("margin-right", "5px");

      topicFilter
        .append("select")
        .attr("id", "topic-filter")
        .on("change", function () {
          const value = this.value;
          setSelectedTopic(value);
          if (value !== "All Topics") {
            setSelectedCluster("All Clusters");
            d3.select("#cluster-filter").property("value", "All Clusters");
          }
        })
        .selectAll("option")
        .data(topics)
        .enter()
        .append("option")
        .attr("value", (d) => d)
        .text((d) => d);

      // Cluster filter
      const clusterFilter = filterControls.append("div");
      clusterFilter
        .append("label")
        .attr("for", "cluster-filter")
        .text("Highlight Cluster: ")
        .style("margin-right", "5px");

      clusterFilter
        .append("select")
        .attr("id", "cluster-filter")
        .on("change", function () {
          const value = this.value;
          setSelectedCluster(value);
          if (value !== "All Clusters") {
            setSelectedTopic("All Topics");
            d3.select("#topic-filter").property("value", "All Topics");
          }
        })
        .selectAll("option")
        .data(clusters)
        .enter()
        .append("option")
        .attr("value", (d) => d)
        .text((d) => d);

      // Check the dropdown values and update visibility of 'probability'
      function updateSortMethodVisibility() {
        if (
          selectedTopic === "All Topics" &&
          selectedCluster === "All Clusters"
        ) {
          const probabilityText = sortMethodTexts.find(
            (item) => item.text === "probability"
          );
          probabilityText.visible = true; // Make 'probability' visible
        } else {
          const probabilityText = sortMethodTexts.find(
            (item) => item.text === "probability"
          );
          probabilityText.visible = false; // Hide 'probability'
        }

        // Re-render sorting options
        renderSortMethodTexts();
      }

      // Render sorting method texts
      function renderSortMethodTexts() {
        // Clear previous text elements
        d3.select("svg").selectAll("text").remove();

        // Render sort method texts (including probability if visible)
        sortMethodTexts.forEach((item) => {
          if (item.visible !== false) {
            d3.select("svg")
              .append("text")
              .attr("x", item.x)
              .attr("y", item.y)
              .attr("fill", item.color)
              .text(item.text)
              .on("click", function () {
                setSortMethod(item.text); // Update the sort method when clicked
                renderSortMethodTexts(); // Re-render the updated sort methods
              });
          }
        });
      }

      // Reset button  ///////////////////////
      filterControls
        .append("button")
        .text("Reset Highlighting")
        .style("padding", "4px 8px")
        .style("border", "1px solid #ccc")
        .style("border-radius", "4px")
        .style("background-color", "#f8f8f8")
        .style("cursor", "pointer")
        .on("click", () => {
          setSelectedTopic("All Topics");
          setSelectedCluster("All Clusters");
          d3.select("#topic-filter").property("value", "All Topics");
          d3.select("#cluster-filter").property("value", "All Clusters");
        });
    }

    // Cleanup ///////////////////////
    return () => {};
  }, [data]);

  return (
    <div className="flex flex-col items-start mb-4">
      <h1 className="text-2xl font-bold mb-2">
        Svalbardposten's Born-Digital Archive
      </h1>
      <p className="text-md text-gray-600">
        This project aims to make accessible the daily news articles published
        in the <a href="https://svalbardposten.no">Svalbardposten's website</a>.
      </p>
      <p className="text-md text-gray-600">
        Arranged Monthly (2006-2024) <b>+</b>{" "}
        <span style={{ color: "red" }}>Sorted </span>by Article Word Count
        (monthly, weekly, daily)
      </p>
      <br></br>
      {/* Filter controls will be inserted here */}
      <svg ref={svgRef} width={width} height={height} className="bg-white" />
    </div>
  );
}

export default Chart;
