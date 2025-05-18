import * as d3 from "d3";
import { memo, useMemo } from "react";
import { getChapterList, getChapterName } from "../utils";

export const TheTicks = memo(() => {
  const TICK_LENGTH = 6;
  const DOUBLE_TICK_LENGTH = 18;
  const width = document.body.getBoundingClientRect().width - 100;
  const margin = 10;

  const data = getChapterList();
  const data_last = data.length == 0 ? 0 : data.length - 1;

  const xScale = d3.scaleLinear([0, data_last], [margin, width - margin]).clamp(true);

  const ticks = useMemo(() => {
    const numberOfTicksTarget = data.length;

    const dates = new Map<number, number>([[0, 1805], [21, 1806], [54, 1807], [79, 1808], [84, 1809], [100, 1810], [105, 1811], [122, 1812], [149, 1813]])



    return xScale.ticks(numberOfTicksTarget).map((value) => ({
      value: (data[value] && value % 4 === 0 || data[value].chapterIndex === 0) ? data[value].bookIndex + 1 + '.' + getChapterName(data[value].name) : '',
      xOffset: xScale(value),
      firstChapter: data[value].chapterIndex === 0,
      date: dates.get(value) ?? null
    }));
  }, [xScale, data]);



  return (
    <>
      <line stroke="black" x1={margin} y1={20} x2={width - margin} y2={20} />
      {/* Ticks and labels */}
      {
        ticks.map(({ value, xOffset, firstChapter, date }, index) => (
          <g key={"10+" + index} transform={`translate(${xOffset}, 20)`}>
            <line y2={firstChapter ? DOUBLE_TICK_LENGTH : TICK_LENGTH} stroke="currentColor" />
            <text
              key={value}
              style={{
                fontSize: "10px",
                textAnchor: "middle",
                transform: firstChapter ? "translateY(70px)" : "translateY(55px)",
              }}
            >
              {value}
            </text>
            {date ?
              <>
                <line y2={60} stroke="#2F4F4F" strokeWidth={2} opacity={0.3} />
                <text style={{
                  fontSize: "10px",
                  textAnchor: "middle",
                  transform: "translateY(85px)",
                }}>
                  {date}
                </text>
              </>
              :
              null
            }
          </g>
        ))
      }
    </>
  )
})