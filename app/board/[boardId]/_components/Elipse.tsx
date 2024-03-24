import { RGBtoCSS } from '@/lib/utils';
import { ElipseLayer } from '@/types/canvas';
import React from 'react'

interface ElipseProps {
    id: string;
    layer: ElipseLayer
    onPointerDown: (e: React.PointerEvent, id: string) => void
    selectionColor?: string
}

export const Elipse = ({ id, layer, onPointerDown, selectionColor }: ElipseProps) => {
    return (
        <ellipse
            className='drop-shadow-md'
            onPointerDown={(e) => onPointerDown(e, id)}
            style={{
                transform: `translateX(${layer.x}px) translateY(${layer.y}px)`
            }}
            cy={layer.height / 2}
            cx={layer.width / 2}
            rx={layer.width / 2}
            ry={layer.height / 2}
            fill={layer.fill ? RGBtoCSS(layer.fill) : "#000"}
            stroke={selectionColor || "transparent"}
            strokeWidth={1}
        />
    )
}
