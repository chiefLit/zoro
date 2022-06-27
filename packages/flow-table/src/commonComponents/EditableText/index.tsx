import React from 'react'
import { Input, InputRef } from 'antd'
import './style.less'

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean
}

/**
 * 可编辑文本
 */
export default (props: EditableTextProps) => {
  const { value, onChange, disabled = false } = props;
  const inputRef = React.useRef<InputRef>(null)

  const handlePressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    inputRef.current?.blur()
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    if (e.target.value === value) return
    onChange?.(e.target.value)
  }

  return (
    <div className='editable-text-box'>
      {
        disabled
          ? <span>{value}</span>
          : <Input
            className='ant-input'
            size='small'
            value={value}
            ref={inputRef}
            onChange={e => onChange(e.target.value)}
            onPressEnter={handlePressEnter}
            onBlur={e => handleBlur}
            autoFocus={false}
          />
      }
    </div>
  )
}