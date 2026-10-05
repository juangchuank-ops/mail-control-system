import { Route, Routes } from 'react-router-dom'
import {
  AboutPage,
  AccountsPage,
  ConsolePage,
  MailDetailPage,
  MailListPage,
  NotFoundPage,
  SettingsPage,
} from '../pages'

/** 路由表：控制台 / 工作台 / 单条记录 / 节点账户 / 设置 / 系统信息 / 404 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ConsolePage />} />
      <Route path="/mail" element={<MailListPage />} />
      <Route path="/mail/:id" element={<MailDetailPage />} />
      <Route path="/accounts" element={<AccountsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
