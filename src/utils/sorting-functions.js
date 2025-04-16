import { timeWeek, timeYear, group } from "d3";


export function sortMonthly(data) {
  const grouped = group(data, d =>
    `${d.dateObj.getFullYear()}-${String(d.dateObj.getMonth()+1).padStart(2,"0")}`
  );
  return Array.from(grouped.entries()).flatMap(([ym, items]) =>
    items
      .sort((a,b) => a.word_count - b.word_count)
      .map((d,i) => ({ ...d, sequentialRank: i + 4 }))
  );
}

export function sortWeekly(data) {
  const grouped = group(data, d =>
    `${d.dateObj.getFullYear()}-${String(d.dateObj.getMonth()+1).padStart(2,"0")}`
  );
  return Array.from(grouped.entries()).flatMap(([ym, items]) =>
    items
      .sort((a,b) => {
        const wA = timeWeek.count(timeYear(a.dateObj), a.dateObj);
        const wB = timeWeek.count(timeYear(b.dateObj), b.dateObj);
        return wA !== wB ? wA - wB : a.word_count - b.word_count;
      })
      .map((d,i) => ({
        ...d,
        sequentialRank: i + 4,
        weekNumber: timeWeek.count(timeYear(d.dateObj), d.dateObj)
      }))
  );
}

export function sortDaily(data) {
  const grouped = group(data, d =>
    `${d.dateObj.getFullYear()}-${String(d.dateObj.getMonth()+1).padStart(2,"0")}`
  );
  return Array.from(grouped.entries()).flatMap(([ym, items]) =>
    items
      .sort((a,b) => {
        const dayDiff = a.dateObj.getDate() - b.dateObj.getDate();
        return dayDiff !== 0 ? dayDiff : a.word_count - b.word_count;
      })
      .map((d,i) => ({ ...d, sequentialRank: i + 4 }))
  );
}
