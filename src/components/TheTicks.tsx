import d3 from "d3";
import { memo, useMemo } from "react";
import { getChapterList, getChapterName } from "./utils";

export const TheTicks = memo(() => {
  const TICK_LENGTH = 6;
  const DOUBLE_TICK_LENGTH = 18;
  const width = 1500;
  const margin = 10;

  const data = getChapterList();
  const data_last = data.length == 0 ? 0 : data.length - 1;

  const xScale = d3.scaleLinear([0, data_last], [margin, width - margin]).clamp(true);

  const ticks = useMemo(() => {
    const numberOfTicksTarget = data.length;

    return xScale.ticks(numberOfTicksTarget).map((value) => ({
      value: (data[value] && value % 3 === 0 || data[value].chapterIndex === 0) ? data[value].bookIndex + 1 + '.' + getChapterName(data[value].name) : '',
      xOffset: xScale(value),
      firstChapter: data[value].chapterIndex === 0
    }));
  }, [xScale, data]);

  return (
    <>
      <line stroke="black" x1={margin} y1={20} x2={width - margin} y2={20} />
      {/* Ticks and labels */}
      {
        ticks.map(({ value, xOffset, firstChapter }, index) => (
          <g key={"10+" + index} transform={`translate(${xOffset}, 20)`}>
            <line y2={firstChapter ? DOUBLE_TICK_LENGTH : TICK_LENGTH} stroke="currentColor" />
            <text
              key={value}
              style={{
                fontSize: "10px",
                textAnchor: "middle",
                transform: firstChapter ? "translateY(45px)" : "translateY(30px)",
              }}
            >
              {value}
            </text>
          </g>
        ))
      }
    </>
  )
})