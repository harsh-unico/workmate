import React from 'react'
import {
  AuthCard,
  Heading,
  Label,
  BodyText,
  TextField,
  AuthButton,
  ErrorMessage,
  FieldError,
  PasswordStrengthMeter,
  PasswordField,
} from '../../components'
import { useTheme } from '../../context/theme'
import { useForm } from '../../hooks/useForm'
import { validateEmail, validatePassword, validateName } from '../../validators'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES } from '../../utils/constants'
import logo from '../../assets/icons/logo.png'
import authBackgroundVideo from '../../assets/videos/6917969_Motion_Graphics_Motion_Graphic_1920x1080.mp4'

const Signup = () => {
  const t = useTheme()
  const { register } = useAuth()

  const validators = {
    name: validateName,
    email: validateEmail,
    password: (value) => validatePassword(value, { minLength: 6 }),
    confirmPassword: (value, allValues) => {
      if (!value || value.trim() === '') {
        return {
          isValid: false,
          error: 'Please confirm your password',
        }
      }

      if (value !== allValues.password) {
        return {
          isValid: false,
          error: 'Passwords do not match',
        }
      }

      return {
        isValid: true,
        error: '',
      }
    },
  }

  const handleSignup = async (values) => {
    try {
      await register({
        name: values.name,
        email: values.email,
        password: values.password,
      })
      console.log('Signup successful')
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
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      isAdmin: false,
    },
    {
      // wrap validators so confirmPassword gets access to all values
      name: (value) => validators.name(value),
      email: (value) => validators.email(value),
      password: (value) => validators.password(value),
      confirmPassword: (value) => validators.confirmPassword(value, values),
    },
    handleSignup,
  )

  const isFormValid =
    values.name.trim() !== '' &&
    values.email.trim() !== '' &&
    values.password.trim() !== '' &&
    values.confirmPassword.trim() !== '' &&
    Object.keys(errors).length === 0

  return (
    <AuthCard backgroundVideo={authBackgroundVideo} dimBackground={false} fixedHeight>
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
        Create your Account
      </Heading>

      <ErrorMessage message={errors.submit} style={{ marginBottom: t.spacing(4) }} />

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: t.spacing(3) }}>
          <Label htmlFor="name">Name</Label>
          <TextField
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={values.name}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            error={touched.name && errors.name}
          />
          <FieldError error={touched.name ? errors.name : null} />
        </div>

        <div style={{ marginBottom: t.spacing(3) }}>
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

        <div style={{ marginBottom: t.spacing(3) }}>
          <Label htmlFor="password">Password</Label>
          <PasswordField
            id="password"
            placeholder="Create a password"
            value={values.password}
            onChange={(e) => handleChange('password', e.target.value)}
            onBlur={() => handleBlur('password')}
            error={touched.password && errors.password}
          />
          <FieldError error={touched.password ? errors.password : null} />
          <PasswordStrengthMeter password={values.password} />
        </div>

        <div style={{ marginBottom: t.spacing(4) }}>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <PasswordField
            id="confirmPassword"
            placeholder="Re-enter your password"
            value={values.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            onBlur={() => handleBlur('confirmPassword')}
            error={touched.confirmPassword && errors.confirmPassword}
          />
          <FieldError
            error={touched.confirmPassword ? errors.confirmPassword : null}
          />
        </div>

        <div style={{ marginBottom: t.spacing(4) }}>
          <Label>Are you an admin?</Label>
          <div
            style={{
              marginTop: t.spacing(2),
              display: 'flex',
              alignItems: 'center',
              gap: t.spacing(3),
            }}
          >
            <button
              type="button"
              onClick={() => handleChange('isAdmin', !values.isAdmin)}
              style={{
                width: '56px',
                height: '30px',
                borderRadius: '999px',
                border: 'none',
                padding: '3px',
                backgroundColor: values.isAdmin ? '#10B981' : '#4B5563',
                display: 'flex',
                alignItems: 'center',
                justifyContent: values.isAdmin ? 'flex-end' : 'flex-start',
                cursor: 'pointer',
                transition:
                  'background-color 0.2s ease, justify-content 0.2s ease',
              }}
            >
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '999px',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
                }}
              />
            </button>
            <BodyText muted>
              {values.isAdmin ? 'Yes, I am an admin' : 'No, I am not an admin'}
            </BodyText>
          </div>
        </div>

        <AuthButton type="submit" disabled={!isFormValid || isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </AuthButton>
      </form>

      <div
        style={{
          marginTop: t.spacing(6),
          textAlign: 'center',
        }}
      >
        <BodyText muted>
          Already have an account?{' '}
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
            Log in
          </button>
        </BodyText>
      </div>
    </AuthCard>
  )
}

export default Signup


