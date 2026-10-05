import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { AboutPage } from './AboutPage'
import { AccountsPage } from './AccountsPage'
import { NotFoundPage } from './NotFoundPage'
import { SettingsPage } from './SettingsPage'

// jsdom 没有 Lenis 依赖的滚动环境，这里只验证页面结构
vi.mock('lenis', () => ({
  default: class {
    raf() {}
    destroy() {}
  },
}))

describe('SettingsPage', () => {
  it('渲染全部设置面板与关键控件', () => {
    render(<SettingsPage />)
    expect(screen.getByText('05')).toBeInTheDocument()
    expect(screen.getByText('终端设置')).toBeInTheDocument()
    expect(screen.getByText('外观')).toBeInTheDocument()
    expect(screen.getByText('读数密度')).toBeInTheDocument()
    expect(screen.getByText('界面语言')).toBeInTheDocument()
    expect(screen.getByRole('switch', { name: '启用动效' })).toBeInTheDocument()
    expect(screen.getByRole('switch', { name: '启用提示条' })).toBeInTheDocument()
    expect(screen.getByRole('switch', { name: '自动同步' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /恢复默认/ })).toBeInTheDocument()
  })
})

describe('AccountsPage', () => {
  it('渲染节点账户区块与恢复入口', () => {
    render(<AccountsPage />)
    expect(screen.getByText('04')).toBeInTheDocument()
    expect(screen.getByText('节点账户')).toBeInTheDocument()
    expect(screen.getByText('节点注册表')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /恢复全部节点/ })).toBeInTheDocument()
  })
})

describe('AboutPage', () => {
  it('渲染系统信息正文与读数', () => {
    render(<AboutPage />)
    expect(screen.getByText('// 系统信息')).toBeInTheDocument()
    expect(screen.getByText('MAIL CONTROL SYSTEM')).toBeInTheDocument()
    expect(screen.getByText('技术栈')).toBeInTheDocument()
    expect(screen.getByText('数据来源')).toBeInTheDocument()
    expect(screen.getByText('设计约定')).toBeInTheDocument()
    expect(screen.getByText('// 构建指纹')).toBeInTheDocument()
  })
})

describe('NotFoundPage', () => {
  it('渲染 404 读数并指向控制台', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    )
    expect(screen.getByText('// 未注册路由')).toBeInTheDocument()
    expect(screen.getByText('404')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /返回控制台/ })).toBeInTheDocument()
  })
})
