import * as React from 'react';
import { Icon } from '@ibx34/m3x-primitives';
import {
  AssistChip,
  Card,
  Carousel,
  FilterChip,
  IconButton,
  LinearProgress,
  LoadingIndicator,
} from '@ibx34/m3x';

const GRADIENTS = [
  ['#7B4E7F', '#4A2C50'],
  ['#00696B', '#003738'],
  ['#8C4A60', '#4A2432'],
  ['#5C5891', '#2E2B57'],
  ['#7C5800', '#3F2C00'],
  ['#3D6657', '#1B3B2F'],
];

const tile = (i: number) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: `linear-gradient(140deg, ${GRADIENTS[i % GRADIENTS.length]![0]}, ${GRADIENTS[i % GRADIENTS.length]![1]})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Icon size={48} style={{ color: 'rgba(255,255,255,0.85)' }}>
      music_note
    </Icon>
  </div>
);

/** Media-home pattern: chips, hero carousel, album cards, now-playing bar. */
export function MediaApp({ compact }: { compact: boolean }) {
  const [progress, setProgress] = React.useState(0.32);
  const [playing, setPlaying] = React.useState(true);

  React.useEffect(() => {
    if (!playing) return;
    const t = window.setInterval(() => setProgress((p) => (p >= 1 ? 0 : p + 0.004)), 200);
    return () => window.clearInterval(t);
  }, [playing]);

  return (
    <div style={{ padding: compact ? '16px 12px 120px' : '24px 32px 120px' }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        <FilterChip defaultSelected>Energize</FilterChip>
        <FilterChip>Relax</FilterChip>
        <FilterChip>Focus</FilterChip>
        <FilterChip>Commute</FilterChip>
        <AssistChip icon="shuffle">Shuffle all</AssistChip>
      </div>

      <h2 style={{ font: '600 22px var(--md-sys-typescale-title-large-font)', color: 'var(--md-sys-color-on-surface)' }}>
        Listen again
      </h2>
      <Carousel
        aria-label="Listen again"
        height={compact ? 160 : 220}
        itemWidth={compact ? 200 : 280}
        items={['Midnight drive', 'Golden hour', 'Deep focus', 'Sunday roast', 'Night city', 'Warm static'].map(
          (label, i) => ({ key: label, label, onClick: () => {}, node: tile(i) }),
        )}
      />

      <h2 style={{ font: '600 22px var(--md-sys-typescale-title-large-font)', color: 'var(--md-sys-color-on-surface)', marginTop: 32 }}>
        Made for you
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fill, minmax(${compact ? 150 : 200}px, 1fr))`,
          gap: 16,
        }}
      >
        {['Daily mix 1', 'Daily mix 2', 'New releases', 'Chill instrumentals'].map((title, i) => (
          <Card key={title} variant="filled" onClick={() => {}}>
            <div style={{ height: 120, borderRadius: '12px 12px 0 0', overflow: 'hidden' }}>{tile(i + 2)}</div>
            <div style={{ padding: 16 }}>
              <div style={{ fontWeight: 500 }}>{title}</div>
              <div style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: 14, marginTop: 4 }}>
                Based on your listening
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* now-playing bar */}
      <div
        style={{
          position: 'fixed',
          left: compact ? 8 : 120,
          right: 8,
          bottom: compact ? 96 : 12,
          background: 'var(--md-sys-color-surface-container-high)',
          borderRadius: 'var(--md-sys-shape-corner-large)',
          boxShadow: 'var(--md-sys-elevation-level2)',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          zIndex: 5,
        }}
      >
        {playing ? (
          <LoadingIndicator size={40} aria-label="Playing" />
        ) : (
          <Icon size={28} style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>music_note</Icon>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 500, color: 'var(--md-sys-color-on-surface)' }}>Golden hour</div>
          <LinearProgress value={progress} wavy={playing} aria-label="Track progress" style={{ marginTop: 6 }} />
        </div>
        <IconButton icon="skip_previous" aria-label="Previous" />
        <IconButton
          variant="filled"
          icon={playing ? 'pause' : 'play_arrow'}
          aria-label={playing ? 'Pause' : 'Play'}
          onClick={() => setPlaying((p) => !p)}
        />
        <IconButton icon="skip_next" aria-label="Next" />
      </div>
    </div>
  );
}
