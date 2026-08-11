import * as React from 'react';
import { Icon } from '@ibx34/m3x-primitives';
import { IconButton } from '../icon-button/IconButton';

export type AlertSeverity = 'info' | 'success' | 'warning' | 'error';

export const ALERT_ICONS: Record<AlertSeverity, string> = {
  info: 'info',
  success: 'check_circle',
  warning: 'warning',
  error: 'error',
};

interface AlertBaseProps {
  severity?: AlertSeverity;
  /** override the severity icon; null hides it */
  icon?: string | null;
  title?: React.ReactNode;
  children: React.ReactNode;
  /** action buttons (use text Buttons) */
  actions?: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

function alertRole(severity: AlertSeverity): 'alert' | 'status' {
  return severity === 'error' || severity === 'warning' ? 'alert' : 'status';
}

/**
 * Banner: full-width prominent alert for page/section-level messages,
 * typically below the app bar. Extras component.
 */
export function Banner({
  severity = 'info',
  icon,
  title,
  children,
  actions,
  onDismiss,
  className,
}: AlertBaseProps) {
  const shownIcon = icon === null ? null : icon ?? ALERT_ICONS[severity];
  return (
    <div
      role={alertRole(severity)}
      className={['m3x-banner', `m3x-alert--${severity}`, className].filter(Boolean).join(' ')}
    >
      {shownIcon && <Icon size={24} className="m3x-alert__icon" fill={1}>{shownIcon}</Icon>}
      <div className="m3x-alert__body">
        {title && <span className="m3x-alert__title">{title}</span>}
        <span className="m3x-alert__message">{children}</span>
        {actions && <div className="m3x-alert__actions">{actions}</div>}
      </div>
      {onDismiss && <IconButton icon="close" aria-label="Dismiss" onClick={onDismiss} />}
    </div>
  );
}

/**
 * InlineAlert: compact bordered callout for contextual messages inside forms
 * and content. Extras component.
 */
export function InlineAlert({
  severity = 'info',
  icon,
  title,
  children,
  actions,
  onDismiss,
  className,
}: AlertBaseProps) {
  const shownIcon = icon === null ? null : icon ?? ALERT_ICONS[severity];
  return (
    <div
      role={alertRole(severity)}
      className={['m3x-inline-alert', `m3x-alert--${severity}`, className]
        .filter(Boolean)
        .join(' ')}
    >
      {shownIcon && <Icon size={20} className="m3x-alert__icon" fill={1}>{shownIcon}</Icon>}
      <div className="m3x-alert__body">
        {title && <span className="m3x-alert__title">{title}</span>}
        <span className="m3x-alert__message">{children}</span>
        {actions && <div className="m3x-alert__actions">{actions}</div>}
      </div>
      {onDismiss && <IconButton icon="close" aria-label="Dismiss" onClick={onDismiss} />}
    </div>
  );
}
