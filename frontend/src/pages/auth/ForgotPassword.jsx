import React, { useState } from 'react'
import {
  AuthCard,
  Heading,
  Label,
  BodyText,
  TextField,
  AuthButton,
  ErrorMessage,
  FieldError,
} from '../../components'
import { useTheme } from '../../context/theme'
import { useForm } from '../../hooks/useForm'
import { validateEmail } from '../../validators'
import { ROUTES } from '../../utils/constants'
import { forgotPassword } from '../../services/authService'
import logo from '../../assets/icons/logo.png'
import loginBackgroundVideo from '../../assets/videos/6917969_Motion_Graphics_Motion_Graphic_1920x1080.mp4'

const ForgotPassword = () => {
  const t = useTheme()
  const [successMessage, setSuccessMessage] = useState('')

  const validators = {
    email: validateEmail,
  }

  const handleForgotPassword = async (values) => {
    setSuccessMessage('')
    try {
      await forgotPassword(values.email)
      setSuccessMessage('If this email is registered, a password reset link has been sent.')
    } catch (error) {
      throw error
    }
  }

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm(
    {
      email: '',
    },
    validators,
    handleForgotPassword
  )

  const isFormValid = values.email.trim() !== '' && Object.keys(errors).length === 0

  return (
    <AuthCard backgroundVideo={loginBackgroundVideo} dimBackground={false}>
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
          fontWeight: t.font.weight.regular,
          marginBottom: t.spacing(2),
        }}
      >
        Forgot Password
      </Heading>

      <BodyText muted style={{ marginBottom: t.spacing(6) }}>
        Enter the email address to receive the password reset link
      </BodyText>

      <ErrorMessage message={errors.submit} style={{ marginBottom: t.spacing(4) }} />

      {successMessage && (
        <div
          style={{
            marginBottom: t.spacing(4),
            padding: t.spacing(2),
            borderRadius: t.radius.input,
            backgroundColor: t.colors.success + '20',
            color: t.colors.success,
            fontSize: t.font.size.sm,
          }}
        >
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: t.spacing(6) }}>
          <Label htmlFor="email">Email</Label>
          <TextField
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={values.email}
            onChange={(e) => {
              setSuccessMessage('')
              handleChange('email', e.target.value)
            }}
            onBlur={() => handleBlur('email')}
            error={touched.email && errors.email}
          />
          <FieldError error={touched.email ? errors.email : null} />
        </div>

        <AuthButton type="submit" disabled={!isFormValid || isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send'}
        </AuthButton>
      </form>

      <div
        style={{
          marginTop: t.spacing(6),
          textAlign: 'center',
        }}
      >
        <BodyText muted>
          Back to{' '}
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              color: t.colors.link,
              fontSize: t.font.size.sm,
              cursor: 'pointer',
              padding: 0,
            }}
            onClick={() => {
              window.location.href = ROUTES.LOGIN
            }}
          >
            Log In
          </button>
        </BodyText>
      </div>
    </AuthCard>
  )
}

export default ForgotPassword


