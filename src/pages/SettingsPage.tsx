import { RotateCcw } from 'lucide-react'
import { useT } from '../hooks'
import { formatCount } from '../lib/format'
import { PROVIDER_IDS, useMailStore, useSettingsStore } from '../store'
import type { Density, Language } from '../store'
import { MetricReadout, SectionHeader } from '../components/hud'
import {
  Badge,
  Button,
  KeyValueRow,
  Panel,
  PanelHeader,
  SegmentedControl,
  Select,
  Toggle,
} from '../components/ui'
import type { SelectOption } from '../components/ui'

export const BUILD_VERSION = '1.0.0'

const DENSITY_VALUES: readonly Density[] = ['comfortable', 'compact']

const LANGUAGE_OPTIONS: ReadonlyArray<{ value: Language; label: string }> = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'ENGLISH' },
]

const INTERVAL_VALUES = [5, 15, 30, 60] as const

/** 终端设置（/settings）：外观 / 动效 / 通知 / 同步 / 系统信息 */
export function SettingsPage() {
  const t = useT()
  const settings = useSettingsStore()
  const nodes = useMailStore((state) => state.nodes)
  const nodeMessages = useMailStore((state) => state.nodeMessages)

  const records = PROVIDER_IDS.reduce(
    (total, id) => total + (nodeMessages[id]?.length ?? 0),
    0,
  )

  const densityOptions: ReadonlyArray<{ value: Density; label: string }> = DENSITY_VALUES.map(
    (value) => ({
      value,
      label:
        value === 'comfortable'
          ? t('settings.density.comfortable')
          : t('settings.density.compact'),
    }),
  )

  const intervalOptions: SelectOption[] = INTERVAL_VALUES.map((value) => ({
    value: String(value),
    label: t('settings.interval.every', { n: value }),
  }))

  const providerOptions: SelectOption[] = nodes.map((node) => ({
    value: node.id,
    label: `${node.sequence} ${node.label}`,
  }))

  return (
    <div className="mx-auto w-full max-w-[880px] px-4 py-6 sm:px-6">
      <SectionHeader
        index="05"
        label={t('section.settings.label')}
        title={t('section.settings.title')}
        meta={<span className="mcs-label">{t('settings.meta')}</span>}
      />

      <div className="mt-5 space-y-4">
        <Panel>
          <PanelHeader label={t('settings.appearance')} signal />
          <div className="space-y-4 px-4 py-4">
            <p className="text-[13px] text-ink-2">{t('settings.appearance.desc')}</p>

            <KeyValueRow
              label={t('settings.density')}
              value={
                <SegmentedControl
                  label={t('settings.density')}
                  options={densityOptions}
                  value={settings.density}
                  onChange={(next) => {
                    settings.update({ density: next })
                  }}
                />
              }
            />

            <KeyValueRow
              label={t('settings.language')}
              value={
                <SegmentedControl
                  label={t('settings.language')}
                  options={LANGUAGE_OPTIONS}
                  value={settings.language}
                  onChange={(next) => {
                    settings.update({ language: next })
                  }}
                />
              }
            />
            <p className="mcs-label">{t('settings.language.note')}</p>
          </div>
        </Panel>

        <Panel>
          <PanelHeader label={t('settings.panel.motion')} signal />
          <div className="space-y-4 px-4 py-4">
            <p className="text-[13px] text-ink-2">{t('settings.motion.desc')}</p>
            <KeyValueRow
              label={t('settings.motion.enabled')}
              value={
                <Toggle
                  checked={settings.motionEnabled}
                  label={t('settings.motion.enabled')}
                  onChange={(next) => {
                    settings.update({ motionEnabled: next })
                  }}
                />
              }
            />
          </div>
        </Panel>

        <Panel>
          <PanelHeader label={t('settings.panel.notifications')} signal />
          <div className="space-y-4 px-4 py-4">
            <p className="text-[13px] text-ink-2">{t('settings.notifications.desc')}</p>
            <KeyValueRow
              label={t('settings.notifications.enabled')}
              value={
                <Toggle
                  checked={settings.notificationsEnabled}
                  label={t('settings.notifications.enabled')}
                  onChange={(next) => {
                    settings.update({ notificationsEnabled: next })
                  }}
                />
              }
            />
          </div>
        </Panel>

        <Panel>
          <PanelHeader label={t('settings.sync')} signal />
          <div className="space-y-4 px-4 py-4">
            <p className="text-[13px] text-ink-2">{t('settings.sync.desc')}</p>
            <KeyValueRow
              label={t('settings.autoSync')}
              value={
                <Toggle
                  checked={settings.autoSync}
                  label={t('settings.autoSync')}
                  onChange={(next) => {
                    settings.update({ autoSync: next })
                  }}
                />
              }
            />
            <KeyValueRow
              label={t('settings.interval')}
              value={
                <Select
                  aria-label={t('settings.interval')}
                  className="w-auto"
                  disabled={!settings.autoSync}
                  options={intervalOptions}
                  value={String(settings.syncIntervalMinutes)}
                  onChange={(next) => {
                    settings.update({ syncIntervalMinutes: Number(next) })
                  }}
                />
              }
            />
            <div>
              <KeyValueRow
                label={t('settings.defaultProvider')}
                value={
                  <Select
                    aria-label={t('settings.defaultProvider')}
                    className="w-auto"
                    options={providerOptions}
                    value={settings.defaultProvider}
                    onChange={(next) => {
                      settings.update({
                        defaultProvider: next as typeof settings.defaultProvider,
                      })
                    }}
                  />
                }
              />
              <p className="mcs-label mt-1">{t('settings.defaultProvider.desc')}</p>
            </div>
          </div>
        </Panel>

        <Panel>
          <PanelHeader label={t('settings.system')} signal />
          <div className="px-4 py-4">
            <p className="text-[13px] text-ink-2">{t('settings.system.desc')}</p>
            <div className="mt-4 grid gap-x-8 sm:grid-cols-2">
              <KeyValueRow label={t('settings.build')} value={BUILD_VERSION} />
              <KeyValueRow label={t('settings.mode')} value={t('settings.value.mode')} />
              <KeyValueRow label={t('settings.dataSource')} value={t('settings.value.dataSource')} />
              <KeyValueRow label={t('settings.persistence')} value={t('settings.value.persistence')} />
              <KeyValueRow
                label={t('settings.nodesAttached')}
                value={formatCount(nodes.length)}
              />
              <KeyValueRow label={t('settings.recordsCached')} value={formatCount(records)} />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge tone="ok">REACT 19</Badge>
              <Badge tone="ok">TYPESCRIPT</Badge>
              <Badge tone="ok">VITE</Badge>
              <Badge tone="ok">TAILWIND V4</Badge>
              <Badge tone="ok">ZUSTAND</Badge>
              <Badge tone="ok">MOTION / GSAP</Badge>
            </div>
          </div>
        </Panel>

        <Panel>
          <PanelHeader label={t('settings.panel.reset')} signal />
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
            <div>
              <p className="text-[13px] text-ink-1">{t('settings.reset')}</p>
              <p className="mcs-label mt-1">{t('settings.reset.note')}</p>
            </div>
            <Button
              variant="danger"
              onClick={() => {
                settings.reset()
              }}
            >
              <RotateCcw size={12} strokeWidth={1.75} />
              {t('settings.restore')}
            </Button>
          </div>
        </Panel>

        <Panel variant="inset" className="grid gap-4 px-4 py-4 sm:grid-cols-3">
          <MetricReadout
            label={t('settings.metric.density')}
            value={settings.density === 'comfortable'
              ? t('settings.density.comfortable')
              : t('settings.density.compact')}
          />
          <MetricReadout
            label={t('settings.metric.language')}
            value={settings.language.toUpperCase()}
            tone="signal"
          />
          <MetricReadout
            label={t('settings.metric.motion')}
            value={settings.motionEnabled ? t('settings.motion.on') : t('settings.motion.off')}
          />
        </Panel>
      </div>
    </div>
  )
}
