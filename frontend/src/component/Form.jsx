import React from 'react'

const Form = ({
  fields = [],
  values = {},
  onChange,
  containerClassName = 'space-y-4',
  fieldClassName = '',
  labelClassName = 'block text-sm font-semibold text-gray-700 mb-2',
  inputClassName =
    'w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#4169e1]',
  textareaClassName,
  helperClassName = 'text-xs text-gray-500 mt-1',
  radioGroupClassName = 'space-y-2',
  radioOptionClassName = 'flex items-center',
  radioInputClassName = 'w-4 h-4 cursor-pointer accent-blue-500',
  radioLabelClassName = 'ml-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900'
}) => {
  const resolvedTextareaClassName = textareaClassName || `${inputClassName} resize-none`

  return (
    <div className={containerClassName}>
      {fields.map((field) => {
        const value = values[field.name] ?? ''

        const wrapperClassName = [fieldClassName, field.wrapperClassName].filter(Boolean).join(' ')

        if (field.type === 'radio') {
          return (
            <div key={field.name} className={wrapperClassName}>
              {field.label ? <label className={labelClassName}>{field.label}</label> : null}
              <div className={field.radioGroupClassName || radioGroupClassName}>
                {(field.options || []).map((option) => {
                  const optionValue = String(option.value)
                  const checked = String(value) === optionValue

                  return (
                    <div
                      key={optionValue}
                      className={field.radioOptionClassName || radioOptionClassName}
                    >
                      <input
                        type="radio"
                        id={`${field.name}-${optionValue}`}
                        name={field.name}
                        value={optionValue}
                        checked={checked}
                        onChange={(e) => onChange?.(field.name, e.target.value)}
                        className={field.radioInputClassName || radioInputClassName}
                      />
                      <label
                        htmlFor={`${field.name}-${optionValue}`}
                        className={field.radioLabelClassName || radioLabelClassName}
                      >
                        {option.label}
                      </label>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        }

        if (field.type === 'textarea') {
          return (
            <div key={field.name} className={wrapperClassName}>
              {field.label ? <label className={labelClassName}>{field.label}</label> : null}
              <textarea
                placeholder={field.placeholder}
                value={value}
                onChange={(e) => onChange?.(field.name, e.target.value)}
                maxLength={field.maxLength}
                rows={field.rows || 4}
                className={field.className || resolvedTextareaClassName}
              />
              {field.showCount && typeof field.maxLength === 'number' ? (
                <p className={field.helperClassName || helperClassName}>
                  {String(value).length}/{field.maxLength} characters
                </p>
              ) : null}
            </div>
          )
        }

        // checkbox
        if (field.type === 'checkbox') {
          return (
            <div key={field.name} className={[wrapperClassName, 'flex items-center gap-2'].filter(Boolean).join(' ')}>
              <input
                type="checkbox"
                id={field.name}
                checked={!!value}
                onChange={e => onChange?.(field.name, e.target.checked)}
                className={field.className || 'w-5 h-5 accent-[#4169e1] rounded focus:ring-2 focus:ring-[#4169e1]'}
              />
              {field.label ? (
                <label htmlFor={field.name} className={labelClassName + ' mb-0 cursor-pointer'}>
                  {field.label}
                </label>
              ) : null}
              {field.helperText ? (
                <span className={field.helperClassName || helperClassName}>{field.helperText}</span>
              ) : null}
            </div>
          )
        }

        // default: input
        return (
          <div key={field.name} className={wrapperClassName}>
            {field.label ? <label className={labelClassName}>{field.label}</label> : null}
            <input
              type={field.type || 'text'}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => onChange?.(field.name, e.target.value)}
              maxLength={field.maxLength}
              className={field.className || inputClassName}
            />
            {field.showCount && typeof field.maxLength === 'number' ? (
              <p className={field.helperClassName || helperClassName}>
                {String(value).length}/{field.maxLength} characters
              </p>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

export default Form
