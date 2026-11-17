import {
  Braces, ChevronDown, ChevronRight, Code2, Crop, Eraser, Eye, FileCode2,
  Frame, Hand, Image, Layers, MousePointer2, Paintbrush, PanelLeft,
  PenTool, Search, Square, Type, type LucideIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ContextAppId } from './contextApps'

function LayerRow({ icon: Icon, label, nested = false, selected = false }: { icon: LucideIcon; label: string; nested?: boolean; selected?: boolean }) {
  return (
    <div className={`workspace-row${nested ? ' workspace-row--nested' : ''}${selected ? ' workspace-row--selected' : ''}`}>
      <Icon size={14} strokeWidth={1.5} /><span>{label}</span>
    </div>
  )
}

function FigmaEnvironment() {
  const { t } = useTranslation()
  return (
    <div className="workspace-environment workspace-figma" aria-hidden="true">
      <aside className="workspace-sidebar">
        <div className="workspace-panel-heading"><Layers size={14} /><span>{t('context.ui.layers')}</span></div>
        <LayerRow icon={Frame} label="Workspace" selected />
        <LayerRow icon={PanelLeft} label={t('context.ui.navigation')} nested />
        <LayerRow icon={Type} label={t('context.ui.heading')} nested />
        <LayerRow icon={Square} label={t('context.ui.content')} nested />
        <LayerRow icon={Image} label={t('context.ui.cover')} nested />
      </aside>
      <div className="workspace-canvas figma-canvas">
        <div className="figma-artboard">
          <span className="figma-frame-label">Workspace / 01</span>
          <div className="figma-artboard-nav"><span /><i /><i /></div>
          <div className="figma-artboard-title"><i /><i /></div>
          <div className="figma-artboard-content"><div /><div /></div>
          <span className="figma-handle figma-handle--tl" /><span className="figma-handle figma-handle--tr" />
          <span className="figma-handle figma-handle--bl" /><span className="figma-handle figma-handle--br" />
        </div>
      </div>
      <aside className="workspace-sidebar workspace-sidebar--right">
        <div className="workspace-panel-heading">{t('context.ui.design')}</div>
        <div className="workspace-property-group">
          <div className="workspace-property-pair"><span>X <b>64</b></span><span>Y <b>64</b></span></div>
          <div className="workspace-property-pair"><span>W <b>1280</b></span><span>H <b>800</b></span></div>
        </div>
        <div className="workspace-property-group"><p>{t('context.ui.layout')}</p><div className="workspace-property-lines"><i /><i /></div></div>
        <div className="workspace-property-group"><p>{t('context.ui.fill')}</p><div className="workspace-swatch"><span />{t('context.ui.accent')}</div></div>
      </aside>
    </div>
  )
}

const codeLines = [
  <><span className="code-keyword">import</span> {'{ useState }'} <span className="code-keyword">from</span> 'react'</>,
  <><span className="code-keyword">import</span> {'{ Wheel }'} <span className="code-keyword">from</span> './Wheel'</>,
  '',
  <><span className="code-keyword">const</span> apps = ['figma', 'vscode', 'photoshop']</>,
  '',
  <><span className="code-keyword">export function</span> Workspace() {'{'}</>,
  <>  <span className="code-keyword">const</span> [app, setApp] = useState(apps[0])</>,
  '',
  <>  <span className="code-keyword">return</span> (</>,
  <>    &lt;main className="workspace"&gt;</>,
  <>      &lt;Canvas /&gt;</>,
  <>      &lt;Wheel profile={'{app}'} /&gt;</>,
  <>    &lt;/main&gt;</>,
  <>  )</>,
  <>{'}'}</>,
]

function CodeEnvironment() {
  const { t } = useTranslation()
  return (
    <div className="workspace-environment workspace-code" aria-hidden="true">
      <div className="workspace-activity"><Code2 size={19} /><Search size={18} /><Braces size={19} /></div>
      <aside className="workspace-sidebar">
        <div className="workspace-panel-heading">{t('context.ui.explorer')}</div>
        <LayerRow icon={ChevronDown} label="MULTIWHEEL" />
        <LayerRow icon={ChevronDown} label="src" nested />
        <LayerRow icon={ChevronRight} label="components" nested />
        <LayerRow icon={FileCode2} label="App.tsx" nested selected />
        <LayerRow icon={FileCode2} label="Wheel.tsx" nested />
        <LayerRow icon={Braces} label="styles.css" nested />
        <LayerRow icon={Braces} label="package.json" />
      </aside>
      <div className="workspace-editor">
        <div className="workspace-editor-tab"><FileCode2 size={14} />App.tsx<span>×</span></div>
        <div className="workspace-code-lines">
          {codeLines.map((line, index) => <div className="workspace-code-line" key={index}><span className="code-line-number">{index + 1}</span><code>{line || ' '}</code></div>)}
        </div>
        <div className="workspace-editor-status"><span>main*</span><span>TypeScript React</span></div>
      </div>
    </div>
  )
}

function PhotoshopEnvironment() {
  const { t } = useTranslation()
  const tools = [MousePointer2, Crop, Paintbrush, Eraser, PenTool, Type, Hand]
  return (
    <div className="workspace-environment workspace-photoshop" aria-hidden="true">
      <div className="workspace-tools">
        {tools.map((Icon, index) => <span key={index} className={Icon === Paintbrush ? 'workspace-tool-selected' : undefined}><Icon size={17} strokeWidth={1.5} /></span>)}
      </div>
      <div className="workspace-canvas photoshop-canvas">
        <div className="photoshop-artboard">
          <svg viewBox="0 0 420 500" fill="none" preserveAspectRatio="xMidYMid slice">
            <path fill="var(--surface)" d="M0 0h420v500H0z" />
            <circle cx="300" cy="117" r="48" fill="var(--accent)" opacity="0.22" />
            <path d="m0 340 133-179 88 123 56-77 143 153v140H0Z" fill="var(--text-secondary)" opacity="0.15" />
            <path d="m0 417 144-143 75 92 86-53 115 99v88H0Z" fill="var(--accent)" opacity="0.18" />
            <path d="m0 460 110-69 152 65 158-51v95H0Z" fill="var(--background)" opacity="0.6" />
          </svg>
        </div>
      </div>
      <aside className="workspace-sidebar workspace-sidebar--right">
        <div className="workspace-panel-heading">{t('context.ui.layers')}</div>
        <div className="workspace-property-group"><p>{t('context.ui.opacity')} <b>100%</b></p><div className="workspace-property-lines"><i /></div></div>
        {(['color', 'landscape', 'background'] as const).map((name, index) => (
          <div className={`workspace-image-layer${index === 0 ? ' workspace-row--selected' : ''}`} key={name}>
            <Eye size={13} /><span className={`workspace-layer-thumb workspace-layer-thumb--${name}`} /><span>{t(`context.ui.${name}`)}</span>
          </div>
        ))}
      </aside>
    </div>
  )
}

// Декорация не содержит фальшивых кнопок: всё взаимодействие принадлежит колесу.
export function WorkspaceEnvironment({ appId }: { appId: ContextAppId }) {
  switch (appId) {
    case 'figma': return <FigmaEnvironment />
    case 'vscode': return <CodeEnvironment />
    case 'photoshop': return <PhotoshopEnvironment />
  }
}
