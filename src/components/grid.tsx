import React from 'react'

interface GridProps {
    children: React.ReactNode
    columns?: string
    gap?: string
    className?: string
    style?: React.CSSProperties
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
}

export default function Grid({
    children,
    columns = '1fr 1fr',
    gap = '4',
    className,
    style,
    ...props
}: GridProps) {
    return (
        <div
            className={`grid grid-cols-${columns} gap-${gap} ${className}`}
            style={style}
            {...props} // Spread any additional props
        >
            {children}
        </div>
    )
}
