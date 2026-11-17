import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import tokens from '../../../../shared/design/tokens.json';
import { iconPaths, type IconName } from '@/components/icons/icon-paths';
import { Icon } from '@/components/raad/icon';
import { RaadLogo, RaadMark } from '@/components/raad/logo';
import { NavItem } from '@/components/raad/nav-item';
import { StatusPill, statusTokens, type Status } from '@/components/raad/status-pill';
import { Avatar, Chip, CountBadge, LivePill, PlateTag } from '@/components/raad/tags';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Hidden page: not linked from the dashboard and not indexed. Compare it with Figma page "0 · Design system".
export const metadata: Metadata = {
  title: 'Design system · Raad Admin',
  robots: { index: false, follow: false },
};

const scales = ['yellow', 'navy', 'blue', 'green', 'red', 'sand'] as const;
const variants = [
  'primary',
  'secondary',
  'outline',
  'ghost',
  'danger',
  'success',
  'inverse',
] as const;
const sizes = ['sm', 'default', 'lg', 'xl'] as const;

/** "navy.900" → "#0B1F3A", "white" → "#FFFFFF". */
function resolve(path: string): string {
  let value: unknown = tokens.color;
  for (const part of path.split('.')) {
    value = (value as Record<string, unknown> | undefined)?.[part];
  }
  return typeof value === 'string' ? value : '';
}

function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-1 border-b border-subtle pb-3">
        <h2 className="text-admin-h2">{title}</h2>
        {note ? <p className="text-small text-secondary">{note}</p> : null}
      </div>
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="bg-inverse px-6 py-10 text-white md:px-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-4">
          <RaadLogo surface="onDark" size={36} />
          <h1 className="font-display text-4xl font-bold tracking-[-0.02em] text-white">
            Design system
          </h1>
          <p className="max-w-2xl text-navy-100">
            Tokens, type, components and icons as built in code, generated from{' '}
            <code className="font-mono text-yellow-300">shared/design/tokens.json</code>. Compare
            with Figma page “0 · Design system”.
          </p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-6 py-12 md:px-12">
        <Section
          title="Colour scales"
          note="Primitives. Build screens from the semantic tokens below."
        >
          <div className="flex flex-col gap-4">
            {scales.map((scale) => (
              <div key={scale} className="grid grid-cols-[80px_1fr] items-center gap-4">
                <span className="text-mono-data text-secondary">{scale}</span>
                <div className="grid grid-cols-5 gap-2 md:grid-cols-10">
                  {Object.entries(tokens.color[scale]).map(([step, hex]) => (
                    <div key={step} className="flex flex-col gap-1">
                      <div
                        className="h-12 rounded-sm border border-subtle"
                        style={{ background: hex }}
                      />
                      <span className="text-caption text-secondary">{step}</span>
                      <span className="font-mono text-[11px] text-muted">{hex}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="Semantic colours"
          note="Use these names in code: bg-brand, text-muted, border-strong…"
        >
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {Object.entries(tokens.semantic).map(([name, ref]) => (
              <div
                key={name}
                className="flex items-center gap-3 rounded-md border border-subtle bg-surface p-3"
              >
                <span
                  className="size-10 shrink-0 rounded-sm border border-subtle"
                  style={{ background: resolve(ref) }}
                />
                <span className="flex min-w-0 flex-col">
                  <span className="text-mono-data">{name}</span>
                  <span className="text-caption text-muted">{ref}</span>
                </span>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="Status"
          note="Always icon + word + colour. Green only for done/arrived, red only for late and SOS."
        >
          <div className="grid gap-3 md:grid-cols-2">
            {(Object.keys(statusTokens) as Status[]).map((status) => (
              <div key={status} className="flex flex-wrap items-center gap-3">
                <span className="w-12 text-mono-data text-muted">{status}</span>
                <StatusPill status={status} />
                <StatusPill status={status}>{statusTokens[status].so}</StatusPill>
              </div>
            ))}
            <div className="flex flex-wrap items-center gap-3">
              <span className="w-12 text-mono-data text-muted">lg</span>
              <StatusPill status="late" size="lg">
                Delayed 8 min
              </StatusPill>
            </div>
          </div>
        </Section>

        <Section
          title="Type"
          note="Outfit for headings, Inter for UI, JetBrains Mono for data. ETAs use tabular figures."
        >
          <div className="flex flex-col divide-y divide-(--border-subtle) rounded-lg border border-subtle bg-surface">
            {Object.entries(tokens.text).map(([name, t]) => (
              <div
                key={name}
                className="grid gap-2 px-5 py-4 md:grid-cols-[140px_200px_1fr] md:items-center"
              >
                <span className="text-mono-data font-semibold">text-{name}</span>
                <span className="text-mono-data text-secondary">
                  {tokens.font[t.font as keyof typeof tokens.font].family} {t.weight} · {t.size}/
                  {t.lineHeight}
                </span>
                <span className={`text-${name}`}>{sampleFor(name)}</span>
              </div>
            ))}
          </div>
          <div className="flex items-end gap-8 rounded-lg border border-subtle bg-surface p-5">
            {['11', '10', '8'].map((m) => (
              <span key={m} className="text-eta">
                {m}
                <span className="ml-1 text-xl font-semibold">min</span>
              </span>
            ))}
            <span className="text-small text-secondary">
              Tabular digits: the layout does not shift.
            </span>
          </div>
        </Section>

        <Section title="Buttons" note="7 variants. Navy text on yellow only.">
          <div className="flex flex-col gap-4 rounded-lg border border-subtle bg-surface p-5">
            {variants.map((variant) => (
              <div
                key={variant}
                className={`flex flex-wrap items-center gap-3 rounded-md p-2 ${variant === 'inverse' ? 'bg-inverse' : ''}`}
              >
                <span
                  className={`w-20 text-mono-data ${variant === 'inverse' ? 'text-navy-100' : 'text-muted'}`}
                >
                  {variant}
                </span>
                {sizes.map((size) => (
                  <Button key={size} variant={variant} size={size}>
                    <Icon name="bus" />
                    {size === 'default' ? 'Start trip' : size}
                  </Button>
                ))}
                <Button variant={variant} disabled>
                  Disabled
                </Button>
              </div>
            ))}
            <div className="flex flex-wrap items-center gap-3 p-2">
              <span className="w-20 text-mono-data text-muted">icon</span>
              <Button size="icon" aria-label="Locate bus">
                <Icon name="locate" />
              </Button>
              <Button size="icon" variant="outline" aria-label="Filter">
                <Icon name="filter" />
              </Button>
              <Button size="icon-sm" variant="ghost" aria-label="More">
                <Icon name="more" />
              </Button>
              <Button variant="link">View route</Button>
            </div>
          </div>
        </Section>

        <Section title="Inputs">
          <div className="grid gap-5 rounded-lg border border-subtle bg-surface p-5 md:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ds-name">Student name</Label>
              <Input id="ds-name" placeholder="Hodan Ahmed" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ds-plate">Bus plate</Label>
              <Input id="ds-plate" aria-invalid defaultValue="SL-44" />
              <span className="flex items-center gap-1.5 text-[13px] font-semibold text-red-700">
                <Icon name="alert" size={16} />
                Enter the full plate, e.g. SL-4471
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ds-off">Driver</Label>
              <Input id="ds-off" disabled defaultValue="Abdi Warsame" />
            </div>
          </div>
        </Section>

        <Section title="Tags, chips, avatars, badges">
          <div className="flex flex-wrap items-center gap-4 rounded-lg border border-subtle bg-surface p-5">
            <PlateTag>SL-4471</PlateTag>
            <PlateTag light>Route 07</PlateTag>
            <LivePill />
            <LivePill live={false}>Last seen 3 min ago</LivePill>
            <Chip>All buses</Chip>
            <Chip selected>Delayed</Chip>
            <Avatar name="Abdi Warsame" />
            <Avatar name="Hodan Ahmed" tone="yellow" />
            <Avatar name="Sahra Ali" tone="green" size="lg" />
            <CountBadge count={3} />
          </div>
          <div className="flex w-64 flex-col gap-1 rounded-lg bg-inverse p-3.5">
            <NavItem href="/design-system" icon="map" label="Live map" active />
            <NavItem href="/design-system" icon="bus" label="Buses" />
            <NavItem href="/design-system" icon="route" label="Routes & stops" />
          </div>
        </Section>

        <Section
          title="Icons"
          note={`${Object.keys(iconPaths).length} icons · 24px grid · 2px round stroke`}
        >
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-10">
            {(Object.keys(iconPaths) as IconName[]).map((name) => (
              <div
                key={name}
                className="flex flex-col items-center gap-2 rounded-md border border-subtle bg-surface px-1 py-3"
              >
                <Icon name={name} />
                <span className="font-mono text-[11px] text-muted">{name}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Logo">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="grid h-40 place-items-center rounded-lg border border-subtle bg-app">
              <RaadLogo size={48} />
            </div>
            <div className="grid h-40 place-items-center rounded-lg bg-inverse">
              <RaadLogo surface="onDark" size={48} />
            </div>
            <div className="grid h-40 place-items-center rounded-lg bg-brand">
              <RaadLogo surface="onYellow" size={48} />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <RaadMark size={64} />
            <RaadMark tile="navy" size={64} />
            <span className="text-small text-secondary">
              Parent app (yellow) · Driver app (navy)
            </span>
          </div>
        </Section>

        <Section title="Radius, elevation, spacing">
          <div className="flex flex-wrap gap-4">
            {Object.entries(tokens.radius)
              .filter(([name]) => name !== 'pill')
              .map(([name, px]) => (
                <div
                  key={name}
                  className="grid size-24 place-items-center border-[1.5px] border-strong bg-surface text-mono-data"
                  style={{ borderRadius: px }}
                >
                  {name} {px}
                </div>
              ))}
          </div>
          <div className="flex flex-wrap gap-6 bg-subtle p-6">
            {Object.keys(tokens.shadow).map((name) => (
              <div
                key={name}
                className="grid h-24 w-40 place-items-center rounded-lg bg-surface text-mono-data"
                style={{ boxShadow: `var(--shadow-raad-${name})` }}
              >
                shadow-{name}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-end gap-3">
            {Object.entries(tokens.space).map(([step, px]) => (
              <div key={step} className="flex flex-col items-center gap-1">
                <span className="bg-brand" style={{ width: px, height: px }} />
                <span className="text-caption text-muted">
                  {step} · {px}
                </span>
              </div>
            ))}
          </div>
        </Section>
      </main>
    </div>
  );
}

function sampleFor(name: string): string {
  const samples: Record<string, string> = {
    display: 'Arriving',
    eta: '6 min',
    h1: 'Good morning, Hodan',
    h2: 'Today’s trips',
    h3: 'Stop 4 · Jigjiga Yar',
    title: 'Bus 07 · Morning route',
    body: 'The bus left Stop 3 and is heading to your stop.',
    small: 'Updated 8 s ago · Driver: Abdi',
    caption: '© OpenStreetMap contributors',
    overline: 'Next stop',
    mono: 'SL-4471',
    'admin-h1': 'Live fleet',
    'admin-h2': 'Routes & stops',
    kpi: '12 / 14',
    table: 'Hodan Ahmed · Grade 3 · Stop 4',
    th: 'Assigned bus',
    'mono-data': '9.5612, 44.0650 · 12 s',
  };
  return samples[name] ?? name;
}
