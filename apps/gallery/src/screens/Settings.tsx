import * as React from 'react';
import {
  Button,
  Card,
  Checkbox,
  Dialog,
  Divider,
  List,
  ListItem,
  SegmentedButtons,
  Slider,
  Switch,
  TopAppBar,
} from '@ibx34/m3x';

/** Settings pattern: large app bar + grouped lists of controls. */
export function SettingsApp({
  dark,
  onDarkChange,
}: {
  dark: boolean;
  onDarkChange: (dark: boolean) => void;
}) {
  const [resetOpen, setResetOpen] = React.useState(false);

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', paddingBottom: 48 }}>
      <TopAppBar size="large" title="Settings" navigationIcon="arrow_back" />

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card variant="filled" style={{ padding: '8px 0' }}>
          <List aria-label="Display">
            <ListItem
              headline="Dark theme"
              supportingText="Applies to the whole gallery"
              leadingIcon="dark_mode"
              trailing={<Switch checked={dark} onChange={(e) => onDarkChange(e.target.checked)} aria-label="Dark theme" />}
            />
            <Divider inset />
            <ListItem
              headline="Media volume"
              leadingIcon="volume_up"
              supportingText={<Slider aria-label="Media volume" defaultValue={60} style={{ maxWidth: 360, marginTop: 8 }} />}
            />
            <Divider inset />
            <ListItem
              headline="Motion scheme"
              supportingText={
                <div style={{ marginTop: 8 }}>
                  <SegmentedButtons
                    aria-label="Motion scheme"
                    defaultValue={['expressive']}
                    segments={[
                      { id: 'expressive', label: 'Expressive' },
                      { id: 'standard', label: 'Standard' },
                    ]}
                  />
                </div>
              }
              leadingIcon="animation"
            />
          </List>
        </Card>

        <Card variant="filled" style={{ padding: '8px 0' }}>
          <List aria-label="Notifications">
            <ListItem
              headline="Notifications"
              supportingText="Choose which updates you receive"
              leadingIcon="notifications"
            />
            <div style={{ padding: '0 16px 8px 56px', display: 'flex', flexDirection: 'column' }}>
              <Checkbox label="Product updates" defaultChecked />
              <Checkbox label="Tips & tutorials" defaultChecked />
              <Checkbox label="Research invitations" />
            </div>
          </List>
        </Card>

        <Card variant="outlined" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 500 }}>Reset preferences</div>
            <div style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: 14 }}>
              Restores every setting to its default
            </div>
          </div>
          <Button variant="outlined" onClick={() => setResetOpen(true)}>
            Reset
          </Button>
        </Card>
      </div>

      <Dialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        icon="restart_alt"
        headline="Reset all preferences?"
        actions={
          <>
            <Button variant="text" onClick={() => setResetOpen(false)}>Cancel</Button>
            <Button variant="text" onClick={() => setResetOpen(false)}>Reset</Button>
          </>
        }
      >
        Your theme, volume and notification choices will return to their defaults. This can't be undone.
      </Dialog>
    </div>
  );
}
