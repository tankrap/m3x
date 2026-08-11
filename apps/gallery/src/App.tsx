import * as React from 'react';
import { ThemeProvider, useWindowSizeClass } from '@ibx34/m3x-primitives';
import { NavigationBar, NavigationRail, Switch } from '@ibx34/m3x';
import { MailApp } from './screens/Mail';
import { EditorApp } from './screens/Editor';
import { MediaApp } from './screens/Media';
import { SettingsApp } from './screens/Settings';

const APPS = [
  { id: 'mail', label: 'Mail', icon: 'mail', seed: '#C4322F' },
  { id: 'editor', label: 'Editor', icon: 'docs', seed: '#0B57D0' },
  { id: 'media', label: 'Media', icon: 'play_circle', seed: '#7B4E7F' },
  { id: 'settings', label: 'Settings', icon: 'settings', seed: '#006A60' },
] as const;

type AppId = (typeof APPS)[number]['id'];

export function App() {
  const [appId, setAppId] = React.useState<AppId>('mail');
  const [dark, setDark] = React.useState(false);
  const sizeClass = useWindowSizeClass();
  const compact = sizeClass === 'compact' || sizeClass === 'medium';

  const app = APPS.find((a) => a.id === appId)!;
  const screen = {
    mail: <MailApp compact={compact} />,
    editor: <EditorApp compact={compact} />,
    media: <MediaApp compact={compact} />,
    settings: <SettingsApp dark={dark} onDarkChange={setDark} />,
  }[appId];

  return (
    <ThemeProvider seedColor={app.seed} dark={dark} motionScheme="expressive">
      <div
        style={{
          display: 'flex',
          flexDirection: compact ? 'column' : 'row',
          height: '100vh',
          background: 'var(--md-sys-color-surface)',
          overflow: 'hidden',
        }}
      >
        {!compact && (
          <NavigationRail
            aria-label="Gallery apps"
            value={appId}
            onChange={(id) => setAppId(id as AppId)}
            items={APPS.map(({ id, label, icon }) => ({ id, label, icon }))}
            header={
              <label
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  color: 'var(--md-sys-color-on-surface-variant)',
                  font: '500 11px var(--md-sys-typescale-label-medium-font)',
                }}
              >
                <Switch checked={dark} onChange={(e) => setDark(e.target.checked)} aria-label="Dark theme" />
                dark
              </label>
            }
          />
        )}
        <main style={{ flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>{screen}</div>
          {compact && (
            <NavigationBar
              aria-label="Gallery apps"
              value={appId}
              onChange={(id) => setAppId(id as AppId)}
              items={APPS.map(({ id, label, icon }) => ({ id, label, icon }))}
            />
          )}
        </main>
      </div>
    </ThemeProvider>
  );
}
