import React from 'react'
import {
  AuthCard,
  Heading,
  Label,
  BodyText,
  TextField,
  PasswordField,
  PrimaryButton,
  ErrorMessage,
  FieldError,
} from '../components'
import { useTheme } from '../context/theme'
import { useForm } from '../hooks/useForm'
import { validateEmail, validatePassword } from '../validators'
import { useAuth } from '../hooks/useAuth'
import { ROUTES } from '../utils/constants'
import logo from '../assets/icons/logo.png'
import loginBackgroundVideo from '../assets/videos/6917969_Motion_Graphics_Motion_Graphic_1920x1080.mp4'

const Login = () => {
  const t = useTheme()
  const { login } = useAuth()

  // Form validators
  const validators = {
    email: validateEmail,
    password: (value) => validatePassword(value, { minLength: 6 }),
  }

  // Form submission handler
  const handleLogin = async (values) => {
    try {
      await login({
        email: values.email,
        password: values.password,
      })
      // Redirect will be handled by router/auth context
      // For now, just log success
      console.log('Login successful')
    } catch (error) {
      throw error
    }
  }

  // Use form hook
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
      password: '',
    },
    validators,
    handleLogin
  )

  const isFormValid =
    values.email.trim() !== '' &&
    values.password.trim() !== '' &&
    Object.keys(errors).length === 0

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
        }}
      >
        Login
      </Heading>

      <ErrorMessage message={errors.submit} style={{ marginBottom: t.spacing(4) }} />

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: t.spacing(4) }}>
          <Label htmlFor="email">Email</Label>
          <TextField
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={values.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            error={touched.email && errors.email}
          />
          <FieldError error={touched.email ? errors.email : null} />
        </div>

        <div style={{ marginBottom: t.spacing(2) }}>
          <Label htmlFor="password">Password</Label>
          <PasswordField
            id="password"
            placeholder="Enter your password"
            value={values.password}
            onChange={(e) => handleChange('password', e.target.value)}
            onBlur={() => handleBlur('password')}
            error={touched.password && errors.password}
          />
          <FieldError error={touched.password ? errors.password : null} />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: t.spacing(6),
          }}
        >
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              color: t.colors.link,
              fontSize: t.font.size.xs,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Forgot Password?
          </button>
        </div>

        <PrimaryButton type="submit" disabled={!isFormValid || isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </PrimaryButton>
      </form>

      <div
        style={{
          marginTop: t.spacing(6),
          textAlign: 'center',
        }}
      >
        <BodyText muted>
          Don&apos;t have an account?{' '}
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
              window.location.href = ROUTES.REGISTER
            }}
          >
            Sign up
          </button>
        </BodyText>
      </div>
    </AuthCard>
  )
}

export default Login
