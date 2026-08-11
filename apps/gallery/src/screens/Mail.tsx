import * as React from 'react';
import { Icon } from '@tankmrap/m3x-primitives';
import {
  Divider,
  FabMenu,
  FilterChip,
  IconButton,
  List,
  ListItem,
  SearchBar,
  Snackbar,
} from '@tankmrap/m3x';

const MAILS = [
  { from: 'Ali Connors', subject: 'Brunch this weekend?', preview: "I'll be in your neighborhood doing errands…", time: '10:31', unread: true, color: '#7C4DFF' },
  { from: 'Trip planner', subject: 'Your itinerary: SFO → HND', preview: 'Confirmation #AB4921 — departing Aug 21, 11:05am', time: '9:14', unread: true, color: '#00897B' },
  { from: 'Sandra Adams', subject: 'Re: design review notes', preview: 'The expressive motion pass looks great, one nit on…', time: 'Yesterday', unread: false, color: '#EF6C00' },
  { from: 'Figma', subject: 'Kit update: M3 Expressive v3', preview: 'The community kit you follow was updated', time: 'Yesterday', unread: false, color: '#3949AB' },
  { from: 'Peter Carlsson', subject: 'Lunch retro', preview: 'Great chatting today — sending the doc we discussed', time: 'Aug 6', unread: false, color: '#546E7A' },
];

function Avatar({ name, color }: { name: string; color: string }) {
  return (
    <span
      style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: color,
        color: '#fff',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 500,
        flexShrink: 0,
      }}
    >
      {name[0]}
    </span>
  );
}

/** Gmail-style pattern: search bar + filter chips + mail list + FAB menu. */
export function MailApp({ compact }: { compact: boolean }) {
  const [sent, setSent] = React.useState(false);
  return (
    <div style={{ padding: compact ? '12px 8px 96px' : '16px 24px 96px', position: 'relative', minHeight: '100%' }}>
      <SearchBar
        placeholder="Search in mail"
        aria-label="Search mail"
        trailing={<IconButton icon="account_circle" aria-label="Account" />}
        suggestions={[
          { label: 'is:unread', icon: 'history' },
          { label: 'from:ali', icon: 'history' },
        ]}
        style={{ maxWidth: 720, margin: '0 auto' }}
      />
      <div style={{ display: 'flex', gap: 8, padding: '16px 8px 8px', flexWrap: 'wrap' }}>
        <FilterChip icon="inbox" defaultSelected>Primary</FilterChip>
        <FilterChip icon="sell">Promotions</FilterChip>
        <FilterChip icon="group">Social</FilterChip>
        <FilterChip icon="info">Updates</FilterChip>
      </div>
      <List aria-label="Inbox">
        {MAILS.map((m, i) => (
          <React.Fragment key={i}>
            <ListItem
              leading={<Avatar name={m.from} color={m.color} />}
              headline={
                <span style={{ fontWeight: m.unread ? 700 : 400 }}>
                  {m.from} — {m.subject}
                </span>
              }
              supportingText={m.preview}
              trailingText={m.time}
              trailing={
                <Icon size={20} style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                  {m.unread ? 'mark_email_unread' : 'star'}
                </Icon>
              }
              onClick={() => {}}
            />
            {i < MAILS.length - 1 && <Divider inset />}
          </React.Fragment>
        ))}
      </List>
      <div style={{ position: 'fixed', right: 24, bottom: compact ? 104 : 24, zIndex: 5 }}>
        <FabMenu
          aria-label="Compose"
          icon="add"
          items={[
            { label: 'New email', icon: 'edit', onSelect: () => setSent(true) },
            { label: 'New event', icon: 'event' },
            { label: 'Record audio', icon: 'mic' },
          ]}
        />
      </div>
      <Snackbar open={sent} onClose={() => setSent(false)} message="Draft created" actionLabel="Open" />
    </div>
  );
}
