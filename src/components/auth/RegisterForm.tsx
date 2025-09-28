// src/components/auth/RegisterForm.tsx
import React, { useState } from 'react'
import PrimaryButton from '../UI/PrimaryButton'
import SecondaryButton from '../UI/SecondaryButton'
import type { Field, FormProps } from '../../types/ui'
import './RegisterForm.css'

function RegisterForm(props: FormProps) {
  const {
    title,
    subtitle,
    fields,
    initialValues,
    onSubmit,
    submitLabel = 'Register',
    secondaryLabel = 'Cancel',
    onSecondary,
    rightImageUrl,
    logoUrl,
    bottomText,
    bottomLinkLabel,
    onBottomLink,
  } = props

  const [values, setValues] = useState<Record<string, string>>(initialValues)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    onSubmit(values)
  }

  return (
    <div className="form-wrapper">
      {/* Izquierda */}
      <div className="form-left">
        <div className="form-left-inner">
          {logoUrl && <img src={logoUrl} alt="Meetzy" className="form-logo" />}
          {title && <h1 className="form-title">{title}</h1>}
          {subtitle && <p className="form-subtitle">{subtitle}</p>}

          <form onSubmit={handleSubmit} className="form-grid">
            {fields.map((f: Field) => (
              <div key={f.name} className="form-group">
                <label htmlFor={f.name} className="form-label">{f.label}</label>

                {f.type === 'textarea' ? (
                  <textarea
                    id={f.name}
                    name={f.name}
                    placeholder={f.placeholder}
                    required={f.required}
                    value={values[f.name] || ''}
                    onChange={handleChange}
                    className="form-textarea"
                  />
                ) : (
                  <input
                    id={f.name}
                    type={f.type || 'text'}
                    name={f.name}
                    placeholder={f.placeholder}
                    required={f.required}
                    value={values[f.name] || ''}
                    onChange={handleChange}
                    className="form-input"
                  />
                )}
              </div>
            ))}

            {/* Acciones: Primary (submit) y, opcionalmente, Secondary */}
            <div className="form-actions">
              <PrimaryButton type="submit" fullWidth>
                {submitLabel}
              </PrimaryButton>

              {onSecondary && (
                <SecondaryButton onClick={onSecondary}>
                  {secondaryLabel}
                </SecondaryButton>
              )}
            </div>
          </form>

          {(bottomText || bottomLinkLabel) && (
            <div className="form-bottom">
              <span>{bottomText}</span>
              {bottomLinkLabel && (
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); onBottomLink && onBottomLink() }}
                >
                  {bottomLinkLabel}
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Derecha */}
      {rightImageUrl && (
        <div className="form-right">
          <img src={rightImageUrl} alt="Form side" />
        </div>
      )}
    </div>
  )
}

export default RegisterForm
