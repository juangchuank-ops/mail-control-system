import { useEffect } from 'react'
import Lenis from 'lenis'
import { BUILD_VERSION } from './SettingsPage'
import { useReducedMotionPref, useT } from '../hooks'
import type { MessageKey } from '../lib/i18n'
import { PROVIDER_IDS, useMailStore } from '../store'
import { DecryptedText, Reveal } from '../components/motion'
import { MetricReadout, SectionHeader } from '../components/hud'
import { Badge, Panel, PanelHeader } from '../components/ui'

const SECTIONS: ReadonlyArray<{ title: MessageKey; body: MessageKey }> = [
  { title: 'about.stack', body: 'about.stack.body' },
  { title: 'about.data', body: 'about.data.body' },
  { title: 'about.design', body: 'about.design.body' },
  { title: 'about.controls', body: 'about.controls.body' },
]

/** 系统信息（/about）：Lenis 平滑滚动的长文档页 */
export function AboutPage() {
  const t = useT()
  const reduced = useReducedMotionPref()
  const nodes = useMailStore((state) => state.nodes)
  const nodeMessages = useMailStore((state) => state.nodeMessages)

  const records = PROVIDER_IDS.reduce(
    (total, id) => total + (nodeMessages[id]?.length ?? 0),
    0,
  )

  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ duration: 0.9, smoothWheel: true })
    let frame = requestAnimationFrame(function loop(time: number) {
      lenis.raf(time)
      frame = requestAnimationFrame(loop)
    })
    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [reduced])

  return (
    <div className="mx-auto w-full max-w-[880px] px-4 py-8 sm:px-6">
      <section className="border-b border-line pb-6">
        <p className="mcs-label mcs-label--signal">{t('about.label')}</p>
        <h1 className="mt-3 font-mono text-[22px] leading-tight tracking-[0.16em] text-ink-0 sm:text-[28px]">
          <DecryptedText text="MAIL CONTROL SYSTEM" speed={34} sequential />
        </h1>
        <p className="mt-4 max-w-[64ch] text-[14px] leading-relaxed text-ink-1">
          {t('about.intro')}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge tone="signal">{t('about.badge.multiNode')}</Badge>
          <Badge tone="warn">{t('about.badge.mock')}</Badge>
          <Badge>{t('about.badge.version', { v: BUILD_VERSION })}</Badge>
        </div>
      </section>

      <Panel variant="inset" className="mt-6 grid gap-4 px-4 py-4 sm:grid-cols-4">
        <MetricReadout label={t('about.metric.nodes')} value={nodes.length} />
        <MetricReadout label={t('about.metric.records')} value={records} tone="signal" />
        <MetricReadout label={t('about.metric.providers')} value={PROVIDER_IDS.length} />
        <MetricReadout label={t('about.metric.build')} value={BUILD_VERSION} />
      </Panel>

      <div className="mt-8 space-y-6">
        {SECTIONS.map((section, index) => (
          <Reveal key={section.title} delay={index * 0.04}>
            <Panel>
              <PanelHeader
                label={t(section.title)}
                meta={`${String(index + 1).padStart(2, '0')} / ${String(SECTIONS.length).padStart(2, '0')}`}
                signal
              />
              <p className="mcs-prose px-4 py-4">{t(section.body)}</p>
            </Panel>
          </Reveal>
        ))}
      </div>

      <div className="mt-8">
        <SectionHeader index="06" label={t('about.build.label')} title={t('section.about.title')} />
        <dl className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
          <div className="flex items-baseline justify-between border-b border-line py-2">
            <dt className="mcs-label">{t('about.runtime')}</dt>
            <dd className="mcs-num text-[12px] text-ink-1">REACT 19 / VITE</dd>
          </div>
          <div className="flex items-baseline justify-between border-b border-line py-2">
            <dt className="mcs-label">{t('about.styling')}</dt>
            <dd className="mcs-num text-[12px] text-ink-1">TAILWIND V4 @THEME</dd>
          </div>
          <div className="flex items-baseline justify-between border-b border-line py-2">
            <dt className="mcs-label">{t('about.state')}</dt>
            <dd className="mcs-num text-[12px] text-ink-1">ZUSTAND / IN-MEMORY</dd>
          </div>
          <div className="flex items-baseline justify-between border-b border-line py-2">
            <dt className="mcs-label">{t('about.storage')}</dt>
            <dd className="mcs-num text-[12px] text-ink-1">NONE / SESSION</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
