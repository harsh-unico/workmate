import React from 'react'
import { useTheme } from '../../context/theme'

const StatsCard = ({ label, value, delta }) => {
  const t = useTheme()
  const isNegative = typeof delta === 'string' && delta.trim().startsWith('-')

  return (
    <div
      style={{
        backgroundColor: t.colors.cardBackground,
        borderRadius: '18px',
        padding: t.spacing(4),
        boxShadow: '0 18px 40px rgba(15, 23, 42, 0.15)',
        border: `1px solid ${t.colors.cardBorder}`,
      }}
    >
      <div
        style={{
          fontSize: t.font.size.sm,
          color: t.colors.textMutedDark,
          marginBottom: t.spacing(1),
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: t.font.size.display,
          fontWeight: t.font.weight.bold,
          color: t.colors.textHeadingDark,
          marginBottom: t.spacing(1),
        }}
      >
        {value}
      </div>
      {delta != null && (
        <div
          style={{
            fontSize: t.font.size.sm,
            color: isNegative ? t.colors.error : '#15803d',
          }}
        >
          {delta}
        </div>
      )}
    </div>
  )
}

export default StatsCard



