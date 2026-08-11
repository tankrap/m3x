import * as React from 'react';
import {
  Card,
  DockedToolbar,
  FloatingToolbar,
  IconButton,
  Menu,
  SplitButton,
  TopAppBar,
  Tooltip,
} from '@ibx34/m3x';

/** Docs-style pattern: app bar + floating format toolbar + page + docked bar. */
export function EditorApp({ compact }: { compact: boolean }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [bold, setBold] = React.useState(false);
  const [italic, setItalic] = React.useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <TopAppBar
        title="Q3 launch narrative"
        navigationIcon="arrow_back"
        elevated
        actions={
          <>
            <Tooltip content="Comment history">
              <IconButton icon="forum" aria-label="Comments" />
            </Tooltip>
            <div style={{ position: 'relative', display: 'inline-flex' }}>
              <IconButton icon="more_vert" aria-label="More" onClick={() => setMenuOpen((o) => !o)} />
              <Menu
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
                anchor="bottom-end"
                aria-label="Document actions"
                items={[
                  { label: 'Rename', leadingIcon: 'edit' },
                  { label: 'Make a copy', leadingIcon: 'file_copy' },
                  { divider: true, label: '' },
                  { label: 'Download', leadingIcon: 'download', trailingText: '⌘S' },
                ]}
              />
            </div>
            <SplitButton
              size="s"
              icon="share"
              items={[
                { label: 'Copy link', icon: 'link' },
                { label: 'Email a copy', icon: 'mail' },
                { label: 'Export PDF', icon: 'picture_as_pdf' },
              ]}
            >
              Share
            </SplitButton>
          </>
        }
      />

      <div style={{ flex: 1, display: 'flex', gap: 16, padding: compact ? 8 : 24, justifyContent: 'center' }}>
        {!compact && (
          <FloatingToolbar orientation="vertical" variant="vibrant" aria-label="Insert tools" style={{ alignSelf: 'flex-start', position: 'sticky', top: 24 }}>
            <IconButton icon="add_photo_alternate" aria-label="Insert image" />
            <IconButton icon="table" aria-label="Insert table" />
            <IconButton icon="functions" aria-label="Insert equation" />
            <IconButton icon="add_comment" aria-label="Insert comment" />
          </FloatingToolbar>
        )}

        <Card variant="outlined" style={{ flex: 1, maxWidth: 760, padding: compact ? 20 : 48, background: 'var(--md-sys-color-surface-bright)' }}>
          <h1 style={{ font: '600 28px/36px var(--md-sys-typescale-headline-medium-font)', marginTop: 0 }}>
            Q3 launch narrative
          </h1>
          <p style={{ fontWeight: bold ? 700 : 400, fontStyle: italic ? 'italic' : 'normal', color: 'var(--md-sys-color-on-surface)', lineHeight: '24px' }}>
            Our design system bet for Q3 is simple: motion is the product. The Expressive update
            gives every interaction a spring — buttons that morph when pressed, groups that bump
            their neighbors, loading states that play with shape. Select this paragraph and try the
            formatting toolbar below.
          </p>
          <p style={{ color: 'var(--md-sys-color-on-surface-variant)', lineHeight: '24px' }}>
            The gallery you are reading is itself built from the component library — the app bar,
            the floating toolbars, the share split button and this outlined page card.
          </p>
        </Card>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', padding: 16, position: 'sticky', bottom: compact ? 8 : 16 }}>
        <FloatingToolbar aria-label="Format">
          <IconButton icon="format_bold" aria-label="Bold" toggle selected={bold} onSelectedChange={setBold} />
          <IconButton icon="format_italic" aria-label="Italic" toggle selected={italic} onSelectedChange={setItalic} />
          <IconButton icon="format_underlined" aria-label="Underline" toggle />
          <IconButton icon="format_list_bulleted" aria-label="Bullets" />
          <IconButton icon="link" aria-label="Link" />
        </FloatingToolbar>
      </div>

      <DockedToolbar arrangement="space-between" aria-label="Document status">
        <span style={{ font: '12px var(--md-sys-typescale-body-small-font)', color: 'var(--md-sys-color-on-surface-variant)' }}>
          Last edit was 2 minutes ago · All changes saved
        </span>
        <IconButton icon="cloud_done" aria-label="Saved" />
      </DockedToolbar>
    </div>
  );
}
