import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

// jsdom 不提供 IntersectionObserver，framer-motion 的 whileInView 依赖它
class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = ''
  readonly scrollMargin = ''
  readonly thresholds: ReadonlyArray<number> = []
  private readonly callback: IntersectionObserverCallback

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
  }

  observe(target: Element): void {
    // 立即上报为可见，让入场动画在测试中直接落到终态
    this.callback(
      [
        {
          isIntersecting: true,
          target,
          boundingClientRect: target.getBoundingClientRect(),
          intersectionRatio: 1,
          intersectionRect: target.getBoundingClientRect(),
          rootBounds: null,
          time: Date.now(),
        } as IntersectionObserverEntry,
      ],
      this,
    )
  }

  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)

// 每个用例后卸载组件，避免同一 DOM 中累积多次 render 的节点
afterEach(() => {
  cleanup()
})
