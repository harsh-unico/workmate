import React, { useState } from 'react'
import {
  AuthCard,
  Heading,
  Label,
  BodyText,
  PasswordField,
  AuthButton,
  ErrorMessage,
  FieldError,
} from '../../components'
import { useTheme } from '../../context/theme'
import { useForm } from '../../hooks/useForm'
import { validatePassword } from '../../validators'
import { ROUTES } from '../../utils/constants'
import { resetPassword } from '../../services/authService'
import logo from '../../assets/icons/logo.png'
import authBackgroundVideo from '../../assets/videos/6917969_Motion_Graphics_Motion_Graphic_1920x1080.mp4'

const ResetPassword = () => {
  const t = useTheme()
  const [successMessage, setSuccessMessage] = useState('')

  const validators = {
    newPassword: (value) => validatePassword(value, { minLength: 6 }),
    confirmPassword: (value, allValues) => {
      if (!value || value.trim() === '') {
        return {
          isValid: false,
          error: 'Please confirm your password',
        }
      }

      if (value !== allValues.newPassword) {
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

  const handleResetPassword = async (values) => {
    setSuccessMessage('')

    try {
      await resetPassword({
        password: values.newPassword,
      })
      setSuccessMessage('Your password has been updated successfully.')
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
      newPassword: '',
      confirmPassword: '',
    },
    {
      newPassword: (value) => validators.newPassword(value),
      confirmPassword: (value) => validators.confirmPassword(value, values),
    },
    handleResetPassword,
  )

  const isFormValid =
    values.newPassword.trim() !== '' &&
    values.confirmPassword.trim() !== '' &&
    Object.keys(errors).length === 0

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
          fontWeight: t.font.weight.regular,
          marginBottom: t.spacing(2),
        }}
      >
        Change Password
      </Heading>

      <BodyText muted style={{ marginBottom: t.spacing(4) }}>
        Enter your new password below.
      </BodyText>

      <ErrorMessage message={errors.submit} style={{ marginBottom: t.spacing(4) }} />

      {successMessage && (
        <div
          style={{
            marginBottom: t.spacing(4),
            padding: t.spacing(2),
            borderRadius: t.radius.input,
            backgroundColor: t.colors.progressTrack,
            color: t.colors.buttonText,
            fontSize: t.font.size.sm,
          }}
        >
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: t.spacing(3) }}>
          <Label htmlFor="newPassword">New Password</Label>
          <PasswordField
            id="newPassword"
            placeholder="Enter new password"
            value={values.newPassword}
            onChange={(e) => handleChange('newPassword', e.target.value)}
            onBlur={() => handleBlur('newPassword')}
            error={touched.newPassword && errors.newPassword}
          />
          <FieldError error={touched.newPassword ? errors.newPassword : null} />
        </div>

        <div style={{ marginBottom: t.spacing(4) }}>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <PasswordField
            id="confirmPassword"
            placeholder="Re-enter new password"
            value={values.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            onBlur={() => handleBlur('confirmPassword')}
            error={touched.confirmPassword && errors.confirmPassword}
          />
          <FieldError
            error={touched.confirmPassword ? errors.confirmPassword : null}
          />
        </div>

        <AuthButton type="submit" disabled={!isFormValid || isSubmitting}>
          {isSubmitting ? 'Updating password...' : 'Change Password'}
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

export default ResetPassword


