import React, { useEffect, useState } from 'react'
import {
  AuthCard,
  Heading,
  BodyText,
  PrimaryButton,
  OtpInput,
} from '../components'
import { useTheme } from '../context/theme'
import { ROUTES } from '../utils/constants'
import logo from '../assets/icons/logo.png'
import authBackgroundVideo from '../assets/videos/6917969_Motion_Graphics_Motion_Graphic_1920x1080.mp4'

const OTP_LENGTH = 6
const INITIAL_SECONDS = 60

const OtpVerification = () => {
  const t = useTheme()
  const [code, setCode] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS)
  const [isResendEnabled, setIsResendEnabled] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (secondsLeft <= 0) {
      setIsResendEnabled(true)
      return
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [secondsLeft])

  const handleVerify = async (e) => {
    e.preventDefault()
    if (code.length !== OTP_LENGTH) return

    setIsSubmitting(true)
    try {
      // TODO: call backend verify API
      console.log('Verifying OTP:', code)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResend = () => {
    if (!isResendEnabled) return
    // TODO: call backend resend API
    console.log('Resend OTP')
    setSecondsLeft(INITIAL_SECONDS)
    setIsResendEnabled(false)
  }

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const seconds = String(secondsLeft % 60).padStart(2, '0')

  const isFormValid = code.length === OTP_LENGTH

  return (
    <AuthCard backgroundVideo={authBackgroundVideo} dimBackground={false}>
      <div style={{ textAlign: 'center', marginBottom: t.spacing(6) }}>
        <img
          src={logo}
          alt="Workmate AI logo"
          style={{ height: 140, objectFit: 'contain' }}
        />
      </div>

      <Heading
        style={{
          textAlign: 'left',
          fontSize: t.font.size.xl,
          fontWeight: t.font.weight.regular
        }}
      >
        OTP Verification
      </Heading>

      <BodyText
        style={{
          marginBottom: t.spacing(6),
        }}
      >
        Enter the verification code sent to your registered email address
      </BodyText>

      <form onSubmit={handleVerify}>
        <div
          style={{
            marginBottom: t.spacing(6),
          }}
        >
          <OtpInput value={code} onChange={setCode} length={OTP_LENGTH} />
        </div>

        <div
          style={{
            marginBottom: t.spacing(4),
            textAlign: 'center',
            fontSize: t.font.size.sm,
            color: t.colors.subtleText,
          }}
        >
          Code expires in{' '}
          <span style={{ fontWeight: t.font.weight.bold }}>
            {minutes}:{seconds}
          </span>
        </div>

        <PrimaryButton type="submit" disabled={!isFormValid || isSubmitting}>
          {isSubmitting ? 'Verifying...' : 'Verify'}
        </PrimaryButton>
      </form>

      <div
        style={{
          marginTop: t.spacing(6),
          textAlign: 'center',
        }}
      >
        <BodyText muted>
          Didn&apos;t receive the code?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={!isResendEnabled}
            style={{
              background: 'none',
              border: 'none',
              color: isResendEnabled ? t.colors.link : t.colors.subtleText,
              fontSize: t.font.size.sm,
              cursor: isResendEnabled ? 'pointer' : 'default',
              padding: 0,
            }}
          >
            Resend
          </button>
        </BodyText>
      </div>
    </AuthCard>
  )
}

export default OtpVerification


