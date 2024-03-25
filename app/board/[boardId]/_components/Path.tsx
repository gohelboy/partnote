import { getSvgPathFromStroke } from "@/lib/utils";
import getStroke from 'perfect-freehand'
interface PathProps {
    id?: string;
    x: number;
    y: number;
    onPointerDown?: (e: React.PointerEvent) => void;
    points: number[][];
    fill: string;
    stroke?: string;
}


const Path = ({ x, y, onPointerDown, points, fill, stroke }: PathProps) => {


    return (
        <path className="drop-shadow-md"
            onPointerDown={onPointerDown}
            d={getSvgPathFromStroke(
                getStroke(points, {
                    size: 7,
                    thinning: 0.5,
                    smoothing: 0.5,
                    streamline: 0.5,
                }))}
            style={{ transform: `translateX(${x}px) translateY(${y}px)` }}
            x={0} y={0} fill={fill} stroke={stroke} strokeWidth={1}
        />
    )
}

export default Path