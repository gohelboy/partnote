import { RGBtoCSS } from '@/lib/utils';
import { RectangleLayer } from '@/types/canvas';
import React from 'react'

interface RectangelProps {
    id: string;
    layer: RectangleLayer
    onPointerDown: (e: React.PointerEvent, id: string) => void
    selectionColor?: string
}

const Rectangel = ({ id, onPointerDown, selectionColor, layer }: RectangelProps) => {

    const { x, y, fill, width, height } = layer;

    return (
        <rect
            className='drop-shadow-md'
            onPointerDown={(e) => onPointerDown(e, id)}
            style={{
                transform: `translateX(${x}px) translateY(${y}px)`
            }}
            x={0}
            y={0}
            width={width}
            height={height}
            strokeWidth={2}
            fill={fill ? RGBtoCSS(fill) : "#CCC"}
            stroke={selectionColor || "transparent"}
        />
    )
}

export default Rectangel