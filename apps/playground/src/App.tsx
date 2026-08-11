import * as React from 'react';
import { ThemeProvider, MorphShape, Icon } from '@ibx34/m3x-primitives';
import type { SchemeVariant, MotionSchemeName, ShapeName } from '@ibx34/m3x-tokens';
import { SHAPE_NAMES } from '@ibx34/m3x-tokens';
import {
  Button,
  IconButton,
  Fab,
  ExtendedFab,
  ButtonGroup,
  SplitButton,
  FabMenu,
  LoadingIndicator,
  LinearProgress,
  CircularProgress,
  DockedToolbar,
  FloatingToolbar,
  Checkbox,
  Radio,
  Switch,
  Slider,
  AssistChip,
  FilterChip,
  InputChip,
  SuggestionChip,
  TextField,
  Card,
  Dialog,
  Snackbar,
  Badge,
  Divider,
  Tabs,
  NavigationBar,
  TopAppBar,
  NavigationRail,
  Menu,
  List,
  ListItem,
  Tooltip,
  BottomSheet,
  SearchBar,
  SegmentedButtons,
  RichTooltip,
  NavigationDrawer,
  Carousel,
  DatePicker,
  TimePicker,
  SideSheet,
  Text,
  Avatar,
  Select,
  ComboBox,
  SelectionCard,
  Banner,
  InlineAlert,
  ToastProvider,
  useToast,
  Sidebar,
  NavBar,
  Breadcrumbs,
  Gauge,
  SegmentedArcGauge,
  PieChart,
  ContributionChart,
  BarChart,
  LineChart,
  AreaChart,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  DataTable,
  Tag,
  FormDialog,
  PinInput,
  type TimeValue,
  type ButtonSize,
} from '@ibx34/m3x';

const SIZES: ButtonSize[] = ['xs', 's', 'm', 'l', 'xl'];
const VARIANTS = ['elevated', 'filled', 'tonal', 'outlined', 'text'] as const;
const SCHEME_VARIANTS: SchemeVariant[] = [
  'tonalSpot', 'vibrant', 'expressive', 'neutral', 'monochrome', 'fidelity', 'content',
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2
        style={{
          font: 'var(--md-sys-typescale-emphasized-title-large-weight) var(--md-sys-typescale-title-large-size)/1.4 var(--md-sys-typescale-title-large-font)',
          color: 'var(--md-sys-color-on-surface)',
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function ChartTile({
  title,
  span,
  center = false,
  children,
}: {
  title?: string;
  span?: number;
  center?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        gridColumn: span ? `span ${span}` : undefined,
        background: 'var(--md-sys-color-surface-container-low)',
        borderRadius: 16,
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: center ? 'center' : 'flex-start',
        gap: 10,
        minWidth: 0,
      }}
    >
      {title && (
        <Text variant="titleSmall" color="on-surface-variant" style={{ alignSelf: 'flex-start' }}>
          {title}
        </Text>
      )}
      {children}
    </div>
  );
}

const row: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  flexWrap: 'wrap',
  marginBottom: 16,
};

export function App() {
  const [seed, setSeed] = React.useState('#6750A4');
  const [variant, setVariant] = React.useState<SchemeVariant>('tonalSpot');
  const [dark, setDark] = React.useState(false);
  const [motionScheme, setMotionScheme] = React.useState<MotionSchemeName>('expressive');
  const [shapeIdx, setShapeIdx] = React.useState(0);
  const [collapsed, setCollapsed] = React.useState(false);
  const [progress, setProgress] = React.useState(0.65);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [railExpanded, setRailExpanded] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [pickedDate, setPickedDate] = React.useState<Date | null>(new Date(2026, 7, 9));
  const [time, setTime] = React.useState<TimeValue>({ hour: 14, minute: 30 });
  const [sideSheetOpen, setSideSheetOpen] = React.useState(false);

  const shape: ShapeName = SHAPE_NAMES[shapeIdx % SHAPE_NAMES.length]!;

  return (
    <ThemeProvider seedColor={seed} variant={variant} dark={dark} motionScheme={motionScheme}>
      <ToastProvider>
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--md-sys-color-surface)',
          padding: '32px 48px',
          boxSizing: 'border-box',
        }}
      >
        <h1
          style={{
            font: 'var(--md-sys-typescale-emphasized-display-small-weight) var(--md-sys-typescale-display-small-size)/1.2 var(--md-sys-typescale-display-small-font)',
            color: 'var(--md-sys-color-on-surface)',
          }}
        >
          m3x playground
        </h1>

        <div style={{ ...row, marginBottom: 32 }}>
          <label>
            seed <input type="color" value={seed} onChange={(e) => setSeed(e.target.value)} />
          </label>
          <label>
            scheme{' '}
            <select value={variant} onChange={(e) => setVariant(e.target.value as SchemeVariant)}>
              {SCHEME_VARIANTS.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <label>
            <input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} /> dark
          </label>
          <label>
            motion{' '}
            <select
              value={motionScheme}
              onChange={(e) => setMotionScheme(e.target.value as MotionSchemeName)}
            >
              <option>expressive</option>
              <option>standard</option>
            </select>
          </label>
        </div>

        <Section title="Buttons — 5 styles (press & hold to feel the shape morph)">
          <div style={row}>
            {VARIANTS.map((v) => (
              <Button key={v} variant={v} size="m" icon="edit">
                {v}
              </Button>
            ))}
          </div>
        </Section>

        <Section title="Sizes XS–XL × round/square">
          <div style={row}>
            {SIZES.map((s) => (
              <Button key={s} size={s} variant="filled">
                {s.toUpperCase()}
              </Button>
            ))}
          </div>
          <div style={row}>
            {SIZES.map((s) => (
              <Button key={s} size={s} variant="tonal" shape="square">
                {s.toUpperCase()}
              </Button>
            ))}
          </div>
        </Section>

        <Section title="Toggle buttons (selection flips the shape)">
          <div style={row}>
            <Button toggle variant="filled" size="m">Filled</Button>
            <Button toggle variant="tonal" size="m">Tonal</Button>
            <Button toggle variant="outlined" size="m">Outlined</Button>
            <Button toggle variant="elevated" size="m" defaultSelected>Elevated</Button>
          </div>
        </Section>

        <Section title="Icon buttons">
          <div style={row}>
            <IconButton variant="filled" icon="edit" aria-label="Edit" size="m" />
            <IconButton variant="tonal" icon="palette" aria-label="Palette" size="m" />
            <IconButton variant="outlined" icon="settings" aria-label="Settings" size="m" />
            <IconButton variant="standard" icon="more_vert" aria-label="More" size="m" />
            <IconButton toggle variant="filled" icon="favorite" aria-label="Favorite" size="m" />
            <IconButton toggle variant="tonal" icon="bookmark" aria-label="Bookmark" size="m" shape="square" />
          </div>
        </Section>

        <Section title="FAB">
          <div style={row}>
            <Fab icon="edit" aria-label="Compose" />
            <Fab icon="edit" size="medium" color="secondaryContainer" aria-label="Compose" />
            <Fab icon="edit" size="large" color="tertiaryContainer" aria-label="Compose" />
            <ExtendedFab icon="edit" collapsed={collapsed} aria-label="Compose">
              Compose
            </ExtendedFab>
            <Button variant="text" onClick={() => setCollapsed((c) => !c)}>
              toggle collapse
            </Button>
          </div>
        </Section>

        <Section title="Button groups — press one and watch it bump its neighbors">
          <div style={row}>
            <ButtonGroup size="m" aria-label="Standard group">
              <Button variant="tonal" size="m">Day</Button>
              <Button variant="tonal" size="m">Week</Button>
              <Button variant="tonal" size="m">Month</Button>
              <Button variant="tonal" size="m">Year</Button>
            </ButtonGroup>
          </div>
          <div style={row}>
            <ButtonGroup connected size="m" aria-label="Connected group">
              <Button toggle variant="tonal" size="m" defaultSelected>Left</Button>
              <Button toggle variant="tonal" size="m">Center</Button>
              <Button toggle variant="tonal" size="m">Right</Button>
              <Button toggle variant="tonal" size="m">Justify</Button>
            </ButtonGroup>
          </div>
        </Section>

        <Section title="Split button — opening spins & morphs the trailing button">
          <div style={row}>
            <SplitButton
              size="m"
              icon="save"
              items={[
                { label: 'Save as copy', icon: 'file_copy' },
                { label: 'Save as template', icon: 'dashboard_customize' },
                { label: 'Export PDF', icon: 'picture_as_pdf' },
              ]}
            >
              Save
            </SplitButton>
            <SplitButton
              size="m"
              variant="tonal"
              items={[{ label: 'Reply all', icon: 'reply_all' }, { label: 'Forward', icon: 'forward' }]}
            >
              Reply
            </SplitButton>
          </div>
        </Section>

        <Section title="Loading indicator & progress">
          <div style={row}>
            <LoadingIndicator />
            <LoadingIndicator contained size={56} />
            <CircularProgress value={progress} />
            <CircularProgress value={progress} wavy />
            <CircularProgress aria-label="Busy" />
          </div>
          <div style={{ ...row, maxWidth: 480 }}>
            <div style={{ flex: 1 }}>
              <LinearProgress value={progress} aria-label="Plain determinate" />
              <div style={{ height: 20 }} />
              <LinearProgress value={progress} wavy aria-label="Wavy determinate" />
              <div style={{ height: 20 }} />
              <LinearProgress aria-label="Indeterminate" />
            </div>
          </div>
          <div style={row}>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              style={{ width: 240 }}
            />
            <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
              {Math.round(progress * 100)}%
            </span>
          </div>
        </Section>

        <Section title="Toolbars">
          <div style={row}>
            <FloatingToolbar aria-label="Formatting">
              <IconButton icon="format_bold" aria-label="Bold" />
              <IconButton icon="format_italic" aria-label="Italic" />
              <IconButton icon="format_underlined" aria-label="Underline" />
              <Button size="s">Done</Button>
            </FloatingToolbar>
            <FloatingToolbar variant="vibrant" aria-label="Vibrant formatting">
              <IconButton icon="edit" aria-label="Edit" />
              <IconButton icon="palette" aria-label="Color" />
              <IconButton icon="text_fields" aria-label="Text" />
            </FloatingToolbar>
            <FloatingToolbar variant="vibrant" orientation="vertical" aria-label="Vertical tools">
              <IconButton icon="brush" aria-label="Brush" />
              <IconButton icon="stylus_note" aria-label="Pen" />
              <IconButton icon="ink_eraser" aria-label="Eraser" />
            </FloatingToolbar>
          </div>
          <div style={{ maxWidth: 480 }}>
            <DockedToolbar aria-label="Bottom toolbar">
              <IconButton icon="undo" aria-label="Undo" />
              <IconButton icon="redo" aria-label="Redo" />
              <IconButton icon="attach_file" aria-label="Attach" />
              <IconButton icon="mic" aria-label="Voice" />
            </DockedToolbar>
          </div>
        </Section>

        <Section title="Cards, badges & dividers">
          <div style={row}>
            {(['elevated', 'filled', 'outlined'] as const).map((v) => (
              <Card key={v} variant={v} onClick={() => {}} style={{ width: 200, padding: 16 }}>
                <div style={{ fontWeight: 500, marginBottom: 4, textTransform: 'capitalize' }}>{v} card</div>
                <div style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: 14 }}>
                  Interactive — press me.
                </div>
              </Card>
            ))}
            <Badge count={12}>
              <Icon size={32}>mail</Icon>
            </Badge>
            <Badge>
              <Icon size={32}>notifications</Icon>
            </Badge>
          </div>
          <Divider style={{ maxWidth: 480 }} />
        </Section>

        <Section title="Dialog & snackbar">
          <div style={row}>
            <Button variant="tonal" onClick={() => setDialogOpen(true)}>Open dialog</Button>
            <Button variant="outlined" onClick={() => setSnackOpen(true)}>Show snackbar</Button>
          </div>
          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            icon="delete"
            headline="Discard draft?"
            actions={
              <>
                <Button variant="text" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button variant="text" onClick={() => setDialogOpen(false)}>Discard</Button>
              </>
            }
          >
            Your draft will be permanently deleted and cannot be recovered.
          </Dialog>
          <Snackbar
            open={snackOpen}
            onClose={() => setSnackOpen(false)}
            message="Draft saved"
            actionLabel="Undo"
            closeIcon
          />
        </Section>

        <Section title="Tabs & navigation bar">
          <div style={{ maxWidth: 480 }}>
            <Tabs
              aria-label="Sections"
              tabs={[
                { id: 'flights', label: 'Flights' },
                { id: 'trips', label: 'Trips' },
                { id: 'explore', label: 'Explore' },
              ]}
            />
            <div style={{ height: 24 }} />
            <NavigationBar
              aria-label="Main"
              items={[
                { id: 'home', label: 'Home', icon: 'home' },
                { id: 'mail', label: 'Mail', icon: 'mail', badge: 12 },
                { id: 'files', label: 'Files', icon: 'folder', badge: 'dot' },
                { id: 'settings', label: 'Settings', icon: 'settings' },
              ]}
            />
          </div>
        </Section>

        <Section title="Search, segmented buttons & rich tooltip">
          <div style={row}>
            <SearchBar
              placeholder="Search your notes"
              aria-label="Search notes"
              trailing={<IconButton icon="mic" aria-label="Voice search" />}
              suggestions={[
                { label: 'meeting notes', icon: 'history' },
                { label: 'm3 expressive spec', icon: 'history' },
                { label: 'groceries', icon: 'search' },
              ]}
            />
          </div>
          <div style={row}>
            <SegmentedButtons
              aria-label="View"
              defaultValue={['week']}
              segments={[
                { id: 'day', label: 'Day' },
                { id: 'week', label: 'Week' },
                { id: 'month', label: 'Month' },
              ]}
            />
            <SegmentedButtons
              aria-label="Toppings"
              multiSelect
              defaultValue={['cheese']}
              segments={[
                { id: 'cheese', label: 'Cheese', icon: 'local_pizza' },
                { id: 'olives', label: 'Olives' },
                { id: 'basil', label: 'Basil' },
              ]}
            />
            <RichTooltip
              persistent
              subhead="Keyboard shortcuts"
              content="Press ⌘K anywhere to open the command palette."
              actions={<Button variant="text" size="s">Learn more</Button>}
            >
              <IconButton icon="info" aria-label="About shortcuts" variant="standard" />
            </RichTooltip>
          </div>
        </Section>

        <Section title="Navigation drawer & carousel">
          <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div>
              <Button variant="tonal" onClick={() => setDrawerOpen(true)}>
                Open modal drawer
              </Button>
            </div>
            <NavigationDrawer
              modal
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              aria-label="Mail"
              items={[
                { id: 'inbox', label: 'Inbox', icon: 'inbox', badge: 24 },
                { id: 'outbox', label: 'Outbox', icon: 'send' },
                { id: 'favorites', label: 'Favorites', icon: 'favorite' },
                { divider: true, id: 'd1', label: '' },
                { headline: true, id: 'h1', label: 'Labels' },
                { id: 'work', label: 'Work', icon: 'label' },
                { id: 'personal', label: 'Personal', icon: 'label' },
              ]}
            />
            <div style={{ maxWidth: 520, flex: 1 }}>
              <Carousel
                aria-label="Featured colors"
                height={180}
                itemWidth={220}
                items={['primary', 'secondary', 'tertiary', 'error'].map((role) => ({
                  key: role,
                  label: role,
                  onClick: () => {},
                  node: (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        background: `linear-gradient(135deg, var(--md-sys-color-${role}), var(--md-sys-color-${role}-container))`,
                      }}
                    />
                  ),
                }))}
              />
            </div>
          </div>
        </Section>

        <Section title="Extras: typography, avatars, selects">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
            <Text variant="displaySmall" emphasized>Display small</Text>
            <Text variant="headlineSmall">Headline small</Text>
            <Text variant="titleMedium" color="primary">Title medium · primary</Text>
            <Text variant="bodyMedium" color="on-surface-variant">
              Body medium — the quick brown fox jumps over the lazy dog.
            </Text>
            <Text variant="labelSmall">LABEL SMALL</Text>
          </div>
          <div style={{ ...row, marginBottom: 16 }}>
            <Avatar name="Ali Connors" />
            <Avatar name="Sandra Adams" size={48} />
            <Avatar name="Peter Carlsson" size={56} />
            <Avatar name="Broken Image" src="http://localhost:1/x.png" />
          </div>
          <div style={{ ...row, alignItems: 'flex-start' }}>
            <Select
              label="Ripeness"
              defaultValue="ripe"
              options={[
                { value: 'green', label: 'Still green', icon: 'eco' },
                { value: 'ripe', label: 'Perfectly ripe', icon: 'check_circle' },
                { value: 'over', label: 'Overripe', icon: 'warning', disabled: true },
              ]}
            />
            <ComboBox
              label="City"
              placeholder="Type to search"
              options={['Tokyo', 'Toronto', 'Turin', 'Oslo', 'Osaka', 'Sydney'].map((c) => ({
                value: c.toLowerCase(),
                label: c,
              }))}
            />
            <Select
              label="Toppings"
              multiple
              defaultValue={['cheese', 'basil']}
              options={[
                { value: 'cheese', label: 'Cheese' },
                { value: 'basil', label: 'Basil' },
                { value: 'olives', label: 'Olives' },
                { value: 'onion', label: 'Onion' },
              ]}
            />
            <Select
              label="Labels"
              multiple
              tags
              variant="filled"
              defaultValue={['design', 'urgent']}
              options={[
                { value: 'design', label: 'Design', icon: 'palette' },
                { value: 'urgent', label: 'Urgent', icon: 'bolt' },
                { value: 'later', label: 'Later', icon: 'schedule' },
                { value: 'docs', label: 'Docs', icon: 'description' },
              ]}
            />
            <ComboBox
              label="Assignees"
              multiple
              defaultSelected={['ali']}
              options={[
                { value: 'ali', label: 'Ali Connors' },
                { value: 'sandra', label: 'Sandra Adams' },
                { value: 'peter', label: 'Peter Carlsson' },
                { value: 'trevor', label: 'Trevor Hansen' },
              ]}
            />
          </div>
          <div style={{ ...row, marginTop: 16 }}>
            <SelectionCard
              icon="rocket_launch"
              title="Pro plan"
              description="Unlimited projects, priority support"
              defaultChecked
            />
            <SelectionCard mode="radio" name="pg-region" value="us" title="US region" icon="public" defaultChecked />
            <SelectionCard mode="radio" name="pg-region" value="eu" title="EU region" icon="public" />
          </div>
        </Section>

        <Section title="Extras: input sizes">
          <div style={{ ...row, alignItems: 'flex-end' }}>
            <TextField label="Small" size="s" variant="outlined" />
            <TextField label="Medium" variant="outlined" />
            <TextField label="Large" size="l" variant="outlined" />
            <Select
              label="Small"
              size="s"
              defaultValue="a"
              options={[{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }]}
            />
          </div>
          <div style={{ ...row, marginTop: 16, alignItems: 'center' }}>
            <Checkbox label="s" size="s" defaultChecked />
            <Checkbox label="m" defaultChecked />
            <Checkbox label="l" size="l" defaultChecked />
            <Radio name="pg-size" label="s" size="s" defaultChecked />
            <Radio name="pg-size" label="l" size="l" />
            <Switch size="s" defaultChecked aria-label="Small switch" />
            <Switch defaultChecked aria-label="Medium switch" />
            <Switch size="l" defaultChecked aria-label="Large switch" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 420, marginTop: 16 }}>
            <Slider aria-label="xs slider" defaultValue={30} />
            <Slider size="s" aria-label="s slider" defaultValue={45} />
            <Slider size="m" aria-label="m slider" defaultValue={60} />
            <Slider size="l" aria-label="l slider" defaultValue={75} />
          </div>
        </Section>

        <Section title="Extras: desktop app chrome">
          <NavBar
            brand={<><Icon size={24} fill={1} style={{ color: 'var(--md-sys-color-primary)' }}>token</Icon> m3x studio</>}
            links={[
              { id: 'overview', label: 'Overview' },
              { id: 'components', label: 'Components' },
              { id: 'tokens', label: 'Tokens' },
            ]}
            actions={
              <>
                <IconButton icon="search" aria-label="Search" />
                <Button variant="filled" size="s">Publish</Button>
              </>
            }
            elevated
          />
          <div style={{ display: 'flex', height: 380, border: '1px solid var(--md-sys-color-outline-variant)', borderRadius: 16, overflow: 'hidden', marginTop: 12 }}>
            <Sidebar
              header={<Text variant="titleMedium" emphasized>Acme HQ</Text>}
              sections={[
                {
                  items: [
                    { id: 'home', label: 'Home', icon: 'home' },
                    { id: 'inbox', label: 'Inbox', icon: 'inbox', badge: 12 },
                    {
                      id: 'projects',
                      label: 'Projects',
                      icon: 'folder',
                      children: [
                        { id: 'm3x', label: 'm3x' },
                        { id: 'website', label: 'Website' },
                      ],
                    },
                  ],
                },
                {
                  title: 'Workspace',
                  items: [
                    { id: 'members', label: 'Members', icon: 'group' },
                    { id: 'billing', label: 'Billing', icon: 'credit_card', badge: 'Pro' },
                  ],
                },
              ]}
              defaultValue="m3x"
              footer={
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar name="Justin H" size={32} />
                  <Text variant="labelLarge">Justin</Text>
                </div>
              }
            />
            <div style={{ flex: 1, padding: 20, background: 'var(--md-sys-color-surface)' }}>
              <Breadcrumbs
                items={[
                  { label: 'Home', icon: 'home', onClick: () => {} },
                  { label: 'Projects', onClick: () => {} },
                  { label: 'm3x' },
                ]}
              />
              <Text variant="headlineSmall" emphasized style={{ marginTop: 12 }}>
                m3x
              </Text>
              <Text variant="bodyMedium" color="on-surface-variant">
                A desktop shell composed from Sidebar, NavBar and Breadcrumbs.
              </Text>
            </div>
          </div>
        </Section>

        <Section title="Extras: charts">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: 16,
              maxWidth: 1060,
              alignItems: 'stretch',
            }}
          >
            <ChartTile title="Air quality" center>
              <Gauge value={72} label="AQI" size={150} aria-label="Air quality 72" />
            </ChartTile>
            <ChartTile title="Storage" center>
              <SegmentedArcGauge
                aria-label="Storage"
                total={128}
                label="of 128 GB"
                size={150}
                legend
                segments={[
                  { value: 41, label: 'Apps' },
                  { value: 22, label: 'Media' },
                  { value: 9, label: 'System' },
                ]}
              />
            </ChartTile>
            <ChartTile title="Traffic sources" center>
              <PieChart
                aria-label="Traffic sources"
                label="sessions"
                size={150}
                slices={[
                  { value: 4120, label: 'Direct' },
                  { value: 2870, label: 'Search' },
                  { value: 1560, label: 'Social' },
                  { value: 630, label: 'Email' },
                ]}
                children="9.2k"
              />
            </ChartTile>
            <ChartTile span={2}>
              <BarChart
                aria-label="Weekly activity"
                width={460}
                height={210}
                header={{
                  label: 'Earned this week',
                  format: (v) => `$${Math.round(v).toLocaleString()}`,
                  trailing: <Tag color="success" size="s">+14.8%</Tag>,
                }}
                data={[
                  { label: 'Mon', value: 3240 },
                  { label: 'Tue', value: 5220 },
                  { label: 'Wed', value: 4130 },
                  { label: 'Thu', value: 7810 },
                  { label: 'Fri', value: 6390 },
                  { label: 'Sat', value: 2260 },
                  { label: 'Sun', value: 1540 },
                ]}
              />
            </ChartTile>
            <ChartTile span={2}>
              <LineChart
                aria-label="Revenue"
                width={460}
                height={210}
                legend
                header={{ label: 'Revenue', format: (v) => `$${Math.round(v)}k` }}
                labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']}
                series={[
                  { label: 'This year', values: [12, 19, 14, 26, 30, 24, 38, 44] },
                  { label: 'Last year', values: [10, 12, 16, 14, 20, 22, 19, 26] },
                ]}
              />
            </ChartTile>
            <ChartTile span={2}>
              <AreaChart
                aria-label="Active users"
                width={460}
                height={210}
                header={{ label: 'Active users' }}
                labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
                series={[{ label: 'Users', values: [420, 380, 510, 470, 690, 810, 640] }]}
              />
            </ChartTile>
            <ChartTile title="Commits" span={2}>
              <ContributionChart
                aria-label="Commits"
                weeks={24}
                endDate={new Date(2026, 7, 10)}
                entries={Array.from({ length: 150 }, (_, i) => {
                  const d = new Date(2026, 7, 10);
                  d.setDate(d.getDate() - Math.floor((i * 37) % 168));
                  return { date: d, value: (i * 13) % 9 };
                })}
              />
            </ChartTile>
          </div>
        </Section>

        <Section title="Extras: tables">
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div style={{ minWidth: 320 }}>
              <Table striped density="compact" aria-label="Nutrition">
                <TableHead>
                  <TableRow>
                    <TableCell header>Dessert</TableCell>
                    <TableCell header numeric>Calories</TableCell>
                    <TableCell header numeric>Fat (g)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    ['Frozen yogurt', 159, 6],
                    ['Ice cream sandwich', 237, 9],
                    ['Eclair', 262, 16],
                    ['Cupcake', 305, 3.7],
                  ].map(([name, cal, fat]) => (
                    <TableRow key={String(name)}>
                      <TableCell>{name}</TableCell>
                      <TableCell numeric>{cal}</TableCell>
                      <TableCell numeric>{fat}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div style={{ minWidth: 560, flex: 1, maxWidth: 760 }}>
              <TeamTable />
            </div>
          </div>
        </Section>

        <Section title="Extras: form dialog & pin input">
          <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <FormDialogDemo />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <PinInput length={6} groupSize={3} autoFocus={false} aria-label="Verification code" />
              <PinInput length={4} mask defaultValue="12" aria-label="Masked PIN" />
              <PinInput length={4} error defaultValue="9021" aria-label="Wrong PIN" />
            </div>
          </div>
        </Section>

        <Section title="Extras: alerts & toasts">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 640 }}>
            <Banner
              severity="warning"
              title="Storage almost full"
              actions={<Button variant="text" size="s">Manage storage</Button>}
              onDismiss={() => {}}
            >
              You've used 14.9 GB of 15 GB. New files won't sync until you free up space.
            </Banner>
            <InlineAlert severity="success">Your changes were saved.</InlineAlert>
            <InlineAlert severity="error" title="Payment failed">
              The card ending in 4242 was declined.
            </InlineAlert>
            <InlineAlert severity="info">Tip: press ⌘K to open the command palette.</InlineAlert>
            <ToastDemo />
          </div>
        </Section>

        <Section title="Date & time pickers, side sheet">
          <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <DatePicker value={pickedDate} onChange={setPickedDate} initialMonth={new Date(2026, 7, 1)} />
            <TimePicker value={time} onChange={setTime} />
            <Button variant="tonal" onClick={() => setSideSheetOpen(true)}>
              Open side sheet
            </Button>
            <SideSheet title="Filters" modal open={sideSheetOpen} onClose={() => setSideSheetOpen(false)}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Checkbox label="In stock only" defaultChecked />
                <Checkbox label="Free shipping" />
                <Slider aria-label="Max price" defaultValue={70} />
              </div>
            </SideSheet>
          </div>
        </Section>

        <Section title="Top app bars">
          <div style={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <TopAppBar
              title="Inbox"
              navigationIcon="menu"
              actions={
                <>
                  <IconButton icon="search" aria-label="Search" />
                  <IconButton icon="more_vert" aria-label="More" />
                </>
              }
            />
            <TopAppBar
              size="medium"
              title="Saved trips"
              navigationIcon="arrow_back"
              actions={<IconButton icon="attach_file" aria-label="Attach" />}
            />
            <TopAppBar
              size="large"
              title="Your library"
              navigationIcon="arrow_back"
              elevated
              actions={<IconButton icon="more_vert" aria-label="More" />}
            />
          </div>
        </Section>

        <Section title="Navigation rail, menu, list">
          <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div>
              <Button variant="text" onClick={() => setRailExpanded((e) => !e)}>
                toggle rail
              </Button>
              <NavigationRail
                aria-label="Rail"
                expanded={railExpanded}
                items={[
                  { id: 'home', label: 'Home', icon: 'home' },
                  { id: 'mail', label: 'Mail', icon: 'mail', badge: 3 },
                  { id: 'files', label: 'Files', icon: 'folder' },
                ]}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <Button variant="tonal" onClick={() => setMenuOpen((o) => !o)}>
                Open menu
              </Button>
              <Menu
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
                aria-label="Item actions"
                items={[
                  { label: 'Rename', leadingIcon: 'edit', trailingText: '⌘R' },
                  { label: 'Duplicate', leadingIcon: 'content_copy' },
                  { divider: true, label: '' },
                  { label: 'Delete', leadingIcon: 'delete' },
                ]}
              />
            </div>
            <div style={{ minWidth: 300, background: 'var(--md-sys-color-surface)', borderRadius: 16, overflow: 'hidden' }}>
              <List aria-label="Mail preview">
                <ListItem
                  headline="Brunch this weekend?"
                  supportingText="Ali — I'll be in your neighborhood"
                  leadingIcon="person"
                  trailingText="10:31"
                  onClick={() => {}}
                />
                <ListItem
                  headline="Flight receipt"
                  supportingText="Your confirmation for SFO → HND"
                  leadingIcon="flight"
                  trailingText="Aug 7"
                  onClick={() => {}}
                />
              </List>
            </div>
            <Tooltip content="Save to favorites">
              <IconButton icon="favorite" aria-label="Favorite" variant="tonal" />
            </Tooltip>
            <Button variant="outlined" onClick={() => setSheetOpen(true)}>
              Bottom sheet
            </Button>
            <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} aria-label="Share options">
              <h3 style={{ marginTop: 0 }}>Share</h3>
              <div style={row}>
                <Button variant="tonal" icon="link">Copy link</Button>
                <Button variant="tonal" icon="mail">Email</Button>
              </div>
            </BottomSheet>
          </div>
        </Section>

        <Section title="Selection controls">
          <div style={row}>
            <Checkbox label="Checkbox" defaultChecked />
            <Checkbox label="Indeterminate" indeterminate />
            <Checkbox label="Error" error />
            <Checkbox label="Disabled" disabled />
          </div>
          <div style={row}>
            <Radio name="demo-radio" label="Alpha" defaultChecked />
            <Radio name="demo-radio" label="Beta" />
            <Radio name="demo-radio" label="Gamma" />
          </div>
          <div style={row}>
            <Switch label="Switch" defaultChecked />
            <Switch label="With icons" icons defaultChecked />
            <Switch label="Off" />
            <Switch label="Disabled" disabled />
          </div>
        </Section>

        <Section title="Slider (Expressive: 16dp track, 4dp handle, track gap)">
          <div style={{ maxWidth: 420 }}>
            <Slider aria-label="Demo slider" defaultValue={40} />
          </div>
        </Section>

        <Section title="Chips">
          <div style={row}>
            <AssistChip icon="event">Add to calendar</AssistChip>
            <FilterChip icon="tune" defaultSelected>Vegetarian</FilterChip>
            <FilterChip icon="tune">Gluten-free</FilterChip>
            <InputChip icon="person" onRemove={() => {}}>Alice</InputChip>
            <SuggestionChip>Sounds good</SuggestionChip>
          </div>
        </Section>

        <Section title="Text fields">
          <div style={row}>
            <TextField label="Email" supportingText="We never share it" leadingIcon="mail" />
            <TextField
              variant="outlined"
              label="City"
              trailingIcon="close"
              onTrailingIconClick={() => {}}
            />
          </div>
          <div style={row}>
            <TextField label="Amount" prefix="$" suffix="USD" defaultValue="12.50" />
            <TextField
              variant="outlined"
              label="Username"
              error
              errorText="Already taken"
              defaultValue="justin"
              trailingIcon="error"
            />
          </div>
        </Section>

        <Section title="FAB menu — morphs open into high-contrast actions">
          <div style={{ ...row, paddingTop: 220 }}>
            <FabMenu
              aria-label="Create"
              items={[
                { label: 'New document', icon: 'docs_add_on' },
                { label: 'Upload photo', icon: 'add_a_photo' },
                { label: 'Record audio', icon: 'mic' },
              ]}
            />
          </div>
        </Section>

        <Section title="Shape library morph (powers the Phase 2 loading indicator)">
          <div style={row}>
            <button
              onClick={() => setShapeIdx((i) => i + 1)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                color: 'var(--md-sys-color-primary)',
                display: 'inline-flex',
              }}
              aria-label={`Morph shape (now ${shape})`}
            >
              <MorphShape shape={shape} size={96} />
            </button>
            <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
              {shape} — click to morph
            </span>
            <Icon size={32} fill={1} style={{ color: 'var(--md-sys-color-tertiary)' }}>
              motion_photos_on
            </Icon>
          </div>
        </Section>
      </div>
      </ToastProvider>
    </ThemeProvider>
  );
}

const TEAM = [
  { id: '1', name: 'Ali Connors', role: 'Design', status: 'active', commits: 214 },
  { id: '2', name: 'Sandra Adams', role: 'Engineering', status: 'active', commits: 431 },
  { id: '3', name: 'Peter Carlsson', role: 'Engineering', status: 'away', commits: 388 },
  { id: '4', name: 'Trevor Hansen', role: 'PM', status: 'inactive', commits: 96 },
  { id: '5', name: 'Britta Holt', role: 'Engineering', status: 'active', commits: 502 },
  { id: '6', name: 'Mary Johnson', role: 'Research', status: 'away', commits: 158 },
];

const STATUS_COLOR = { active: 'success', away: 'warning', inactive: 'neutral' } as const;

function RowActions({ name }: { name: string }) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  return (
    <div style={{ display: 'flex', gap: 2, justifyContent: 'flex-end', position: 'relative' }}>
      <IconButton icon="edit" aria-label={`Edit ${name}`} onClick={() => toast(`Editing ${name}`)} />
      <IconButton icon="more_vert" aria-label={`More for ${name}`} onClick={() => setOpen((o) => !o)} />
      <Menu
        open={open}
        onClose={() => setOpen(false)}
        anchor="bottom-end"
        aria-label={`Actions for ${name}`}
        items={[
          { label: 'View profile', leadingIcon: 'person' },
          { label: 'Change role', leadingIcon: 'badge' },
          { divider: true, label: '' },
          { label: 'Remove', leadingIcon: 'person_remove' },
        ]}
      />
    </div>
  );
}

function TeamTable() {
  return (
    <DataTable
      aria-label="Team"
      selectable
      pageSize={4}
      defaultSort={{ key: 'commits', direction: 'desc' }}
      rowKey={(r) => r.id}
      columns={[
        {
          key: 'name',
          header: 'Member',
          sortable: true,
          render: (r) => (
            <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar name={r.name} size={32} />
              {r.name}
            </span>
          ),
        },
        {
          key: 'role',
          header: 'Role',
          render: (r) => <Tag color={r.role === 'Engineering' ? 'primary' : 'secondary'} size="s">{r.role}</Tag>,
        },
        {
          key: 'status',
          header: 'Status',
          render: (r) => (
            <Tag color={STATUS_COLOR[r.status as keyof typeof STATUS_COLOR]} dot size="s">
              {r.status}
            </Tag>
          ),
        },
        { key: 'commits', header: 'Commits', sortable: true, numeric: true },
        {
          key: 'actions',
          header: '',
          width: 110,
          render: (r) => <RowActions name={r.name} />,
        },
      ]}
      rows={TEAM}
    />
  );
}

function FormDialogDemo() {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  return (
    <>
      <Button variant="filled" icon="add" onClick={() => setOpen(true)}>
        New project
      </Button>
      <FormDialog
        open={open}
        onClose={() => setOpen(false)}
        icon="rocket_launch"
        headline="Create project"
        description="Projects group related boards, docs and automations."
        submitLabel="Create"
        onSubmit={(data) => {
          toast({ message: `Created "${data.get('name')}" (${data.get('region')})`, severity: 'success' });
        }}
      >
        <TextField label="Project name" name="name" variant="outlined" required autoFocus />
        <TextField label="Description" name="description" variant="outlined" />
        <Select
          label="Region"
          name="region"
          options={[
            { value: 'us', label: 'United States', icon: 'public' },
            { value: 'eu', label: 'Europe', icon: 'public' },
            { value: 'apac', label: 'Asia Pacific', icon: 'public' },
          ]}
          defaultValue="us"
        />
        <Checkbox label="Start from template" name="template" defaultChecked />
      </FormDialog>
    </>
  );
}

function ToastDemo() {
  const { toast } = useToast();
  return (
    <div style={row}>
      <Button variant="tonal" onClick={() => toast({ message: 'Draft saved', severity: 'success' })}>
        Success toast
      </Button>
      <Button variant="tonal" onClick={() => toast({ message: 'Connection lost — retrying', severity: 'warning', actionLabel: 'Retry' })}>
        Warning toast
      </Button>
      <Button variant="tonal" onClick={() => toast({ message: 'Export failed', severity: 'error', duration: 8000 })}>
        Error toast
      </Button>
    </div>
  );
}
