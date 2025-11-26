import React from 'react'
import { useTheme } from '../../context/theme'

const DashboardSectionCard = ({ title, actionLabel, onAction, children }) => {
  const t = useTheme()

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
      {(title || actionLabel) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: t.spacing(3),
          }}
        >
          {title && (
            <h3
              style={{
                margin: 0,
                fontSize: t.font.size.lg,
                fontWeight: t.font.weight.semiBold,
                color: t.colors.textHeadingDark,
              }}
            >
              {title}
            </h3>
          )}
          {actionLabel && (
            <button
              type="button"
              onClick={onAction}
              style={{
                border: 'none',
                background: 'none',
                color: t.colors.link,
                fontSize: t.font.size.sm,
                cursor: 'pointer',
              }}
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}

      {children}
    </div>
  )
}

export default DashboardSectionCard



