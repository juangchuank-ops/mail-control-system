import { describe, expect, it } from 'vitest'
import {
  extractValiditySeconds,
  extractVerificationCode,
  isVerificationMessage,
  remainingSeconds,
} from './verification'

describe('extractVerificationCode', () => {
  it('识别英文 verification code 之后紧跟的数字', () => {
    expect(extractVerificationCode('Your verification code is 482913')?.code).toBe('482913')
  })

  it('识别中文「验证码」', () => {
    const text = '您的验证码是 638421，请在 10 分钟内完成验证'
    expect(extractVerificationCode(text)?.code).toBe('638421')
  })

  it('识别 security code 标签', () => {
    expect(extractVerificationCode('Security code: 847261')?.code).toBe('847261')
  })

  it('无验证码关键词时返回 null', () => {
    expect(extractVerificationCode('本周技术周刊已发布，请查收')).toBeNull()
  })

  it('空文本返回 null', () => {
    expect(extractVerificationCode('')).toBeNull()
  })
})

describe('extractValiditySeconds', () => {
  it('解析 expires in 10 minutes', () => {
    expect(extractValiditySeconds('It expires in 10 minutes.')).toBe(600)
  })

  it('解析 valid for 5 minutes', () => {
    expect(extractValiditySeconds('This code is valid for 5 minutes')).toBe(300)
  })

  it('解析中文「请在 10 分钟内」', () => {
    expect(extractValiditySeconds('请在 10 分钟内完成验证')).toBe(600)
  })

  it('解析小时单位', () => {
    expect(extractValiditySeconds('expires in 2 hours')).toBe(7200)
  })

  it('未声明有效期时返回 undefined', () => {
    expect(extractValiditySeconds('感谢您的使用')).toBeUndefined()
  })
})

describe('remainingSeconds', () => {
  it('按当前时间计算剩余秒数', () => {
    expect(remainingSeconds(61_000, 1_000)).toBe(60)
  })

  it('过期后归零，不返回负数', () => {
    expect(remainingSeconds(1_000, 61_000)).toBe(0)
  })

  it('未声明过期时间返回 null', () => {
    expect(remainingSeconds(undefined, 1_000)).toBeNull()
  })
})

describe('isVerificationMessage', () => {
  it('带验证码字段时为真', () => {
    expect(isVerificationMessage({ verificationCode: '123456' })).toBe(true)
  })

  it('带 verification 标签时为真', () => {
    expect(isVerificationMessage({ labels: ['verification'] })).toBe(true)
  })

  it('普通邮件为假', () => {
    expect(isVerificationMessage({ labels: ['newsletter'] })).toBe(false)
  })
})
