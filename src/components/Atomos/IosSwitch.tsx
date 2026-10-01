import { useId, type CSSProperties } from 'react';

import './IosSwitch.css';

export type IosSwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  name?: string;
  disabled?: boolean;
  color?: string;
  size?: 'small' | 'medium';
};

const IosSwitch = ({
  checked,
  onChange,
  label,
  name,
  disabled = false,
  color,
  size = 'medium',
}: IosSwitchProps) => {
  const switchId = useId();
  const labelId = `${switchId}-label`;
  const isSmall = size === 'small';

  return (
    <div className="ios-switch-field">
      <button
        type="button"
        role="switch"
        id={switchId}
        name={name}
        aria-checked={checked}
        aria-labelledby={label ? labelId : undefined}
        disabled={disabled}
        className={`ios-switch${isSmall ? ' ios-switch--small' : ''}${checked ? ' ios-switch--on' : ''}`}
        style={color ? ({ '--ios-switch-color': color } as CSSProperties) : undefined}
        onClick={() => onChange(!checked)}
      >
        <span className="ios-switch__thumb" />
      </button>

      {label && (
        <label className="ios-switch__label" id={labelId} htmlFor={switchId}>
          {label}
        </label>
      )}
    </div>
  );
};

export default IosSwitch;
