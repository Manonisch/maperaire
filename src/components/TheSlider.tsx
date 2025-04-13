import * as d3 from "d3";
import { memo, useState, useCallback, MouseEvent } from "react";
import { TheTicks } from "./TheTicks";
import { getChapterList, getChapterName } from "./utils";

export const TheSlider = memo(function TheSlider({ handleChange }: { handleChange: ({ theStart, theEnd }: { theStart: number, theEnd: number }) => void }) {
  const height = 70;
  const width = document.body.getBoundingClientRect().width - 100;
  const margin = 10;

  const data = getChapterList();
  const data_last = data.length == 0 ? 0 : data.length - 1;

  const [onTheMove, setOnTheMove] = useState<'left' | 'right' | 'slider' | undefined>();
  const [leftSliderPos, setLeftSliderPos] = useState<number>(10);
  const [rightSliderPos, setRightSliderPos] = useState<number>(width - 10);
  const [leftRange, setLeftRange] = useState<number>(0);
  const [rightRange, setRightRange] = useState<number>(data.length - 1);

  const xScale = d3.scaleLinear([0, data_last], [margin, width - margin]).clamp(true);

  const handleMouseMove = useCallback((event: MouseEvent<SVGSVGElement>) => {
    if (onTheMove) {
      const theNumber = Math.round(xScale.invert(event.clientX - 38));
      const theTickPos = xScale(theNumber);

      if (onTheMove === 'left' && event.clientX - 38 < rightSliderPos) {
        setLeftSliderPos(event.clientX - 38)
        if (theNumber && leftRange !== theTickPos) {
          setLeftRange(theNumber);
          // handleChange({ theStart: leftRange, theEnd: theNumber })
        }
      }
      if (onTheMove === 'right' && event.clientX - 38 > leftSliderPos) {
        setRightSliderPos(event.clientX - 38)
        if (theNumber && rightRange !== theTickPos) {
          setRightRange(theNumber);
          // handleChange({ theStart: theNumber, theEnd: rightRange })
        }
      }
      if (onTheMove === 'slider') {
        setLeftSliderPos(leftSliderPos + event.movementX);
        setRightSliderPos(rightSliderPos + event.movementX);
        setLeftRange(Math.round(xScale.invert(leftSliderPos + event.movementX)));
        setRightRange(Math.round(xScale.invert(rightSliderPos + event.movementX)));
        // handleChange({ theStart: Math.round(xScale.invert(leftSliderPos + event.movementX)), theEnd: Math.round(xScale.invert(rightSliderPos + event.movementX)) })
      }
      event.preventDefault();
    }
  }, [xScale, rightSliderPos, leftSliderPos, leftRange, rightRange, onTheMove]);

  const handleMouseUp = useCallback((event: MouseEvent<SVGSVGElement>) => {
    if (onTheMove) {
      const theNumber = Math.round(xScale.invert(event.clientX - 38));
      const theTickPos = xScale(theNumber);

      if (onTheMove === 'left') {
        setLeftSliderPos(theTickPos)
        setLeftRange(theNumber);
        handleChange({ theStart: theNumber, theEnd: rightRange })

      }
      if (onTheMove === 'right') {
        setRightSliderPos(theTickPos)
        setRightRange(theNumber)
        handleChange({ theStart: leftRange, theEnd: theNumber })
      }
      if (onTheMove === 'slider') {
        const theLeftNumber = Math.round(xScale.invert(leftSliderPos));
        const theRightNumber = Math.round(xScale.invert(rightSliderPos));
        setRightRange(theRightNumber);
        setLeftRange(theLeftNumber);
        handleChange({ theStart: theLeftNumber, theEnd: theRightNumber })
      }

    }
    setOnTheMove(undefined)
  }, [onTheMove, leftRange, rightRange, rightSliderPos, leftSliderPos])

  return <svg
    width='95vw'
    height={height}
    stroke="gray"
    fill="none"
    onMouseMove={handleMouseMove}
    onMouseUp={handleMouseUp}
    style={{ display: 'block', margin: 'auto' }}
  >
    <TheTicks />
    <g key='elem' id='the-element'
      onMouseDown={() => {
        setOnTheMove('slider');
      }} style={{ cursor: 'grab' }}
    >
      <rect x={leftSliderPos} y={15} width={rightSliderPos - leftSliderPos} height={25} fill="blue" fillOpacity={0.2} stroke="none" />
    </g>
    <g key='left slider' id='left-slider'
      onMouseDown={(event: MouseEvent<SVGSVGElement>) => {
        event.preventDefault();
        setOnTheMove('left')
      }}
      transform={`translate(${leftSliderPos}, 15)`}>
      <line y2={30} stroke='blue' strokeWidth={'5px'} />
      <text style={{
        fontSize: "10px",
        textAnchor: "middle",
        cursor: 'ew-resize'
      }}>{data[leftRange].bookIndex + 1 + '.' + getChapterName(data[leftRange]?.name)}</text>
    </g>
    <g key='right-slider' id='right-slider'
      onMouseDown={(event: MouseEvent<SVGSVGElement>) => {
        event.preventDefault();
        setOnTheMove('right')
      }}
      transform={`translate(${rightSliderPos}, 15)`}>
      <line y2={30} stroke='blue' strokeWidth={'5px'} />
      <text style={{
        fontSize: "10px",
        textAnchor: "middle",
        cursor: 'ew-resize'
      }}>{data[rightRange].bookIndex + 1 + '.' + getChapterName(data[rightRange]?.name)}</text>
    </g>
  </svg>
})