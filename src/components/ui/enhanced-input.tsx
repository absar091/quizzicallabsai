'use client';

import { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, Search, X, Check, AlertCircle } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

const inputVariants = cva(
  'flex h-10 w-full rounded-xl border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'border-input bg-white/50 backdrop-blur-sm focus:bg-white/80',
        glass: 'border-white/20 bg-white/10 backdrop-blur-md focus:bg-white/20',
        outlined: 'border-2 border-dashed border-border/50 focus:border-primary/50',
        filled: 'border-0 bg-muted focus:bg-muted/80',
        neon: 'border-primary/50 bg-primary/5 focus:border-primary focus:bg-primary/10',
      },
      state: {
        default: '',
        error: 'border-red-500 focus-visible:ring-red-500',
        success: 'border-green-500 focus-visible:ring-green-500',
        warning: 'border-yellow-500 focus-visible:ring-yellow-500',
      },
    },
    defaultVariants: {
      variant: 'default',
      state: 'default',
    },
  }
);

export interface EnhancedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  description?: string;
  error?: string;
  success?: string;
  warning?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  showPasswordToggle?: boolean;
  containerClassName?: string;
}

const EnhancedInput = forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({
    className,
    variant,
    state,
    type = 'text',
    label,
    description,
    error,
    success,
    warning,
    leftIcon,
    rightIcon,
    clearable = false,
    showPasswordToggle = false,
    containerClassName,
    value,
    onChange,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [inputValue, setInputValue] = useState(value || '');

    const inputType = showPasswordToggle && showPassword ? 'text' : type;
    const computedState = error ? 'error' : success ? 'success' : warning ? 'warning' : state;

    const handleClear = () => {
      setInputValue('');
      onChange?.({ target: { value: '' } } as any);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      onChange?.(e);
    };

    return (
      <div className={cn('space-y-2', containerClassName)}>
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}

          <input
            type={inputType}
            className={cn(
              inputVariants({ variant, state: computedState }),
              leftIcon && 'pl-10',
              (rightIcon || clearable || showPasswordToggle) && 'pr-10',
              className
            )}
            ref={ref}
            value={inputValue}
            onChange={handleChange}
            {...props}
          />

          {/* Right side icons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
            {clearable && inputValue && (
              <button
                type="button"
                onClick={handleClear}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {showPasswordToggle && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}

            {rightIcon && <div className="text-muted-foreground">{rightIcon}</div>}
          </div>

          {/* State indicators */}
          {computedState === 'success' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
              <Check className="h-4 w-4" />
            </div>
          )}

          {computedState === 'error' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
              <AlertCircle className="h-4 w-4" />
            </div>
          )}
        </div>

        {/* Description */}
        {description && !error && !success && !warning && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}

        {/* Error message */}
        {error && (
          <p className="text-xs text-red-600 flex items-center space-x-1">
            <AlertCircle className="h-3 w-3" />
            <span>{error}</span>
          </p>
        )}

        {/* Success message */}
        {success && (
          <p className="text-xs text-green-600 flex items-center space-x-1">
            <Check className="h-3 w-3" />
            <span>{success}</span>
          </p>
        )}

        {/* Warning message */}
        {warning && (
          <p className="text-xs text-yellow-600 flex items-center space-x-1">
            <AlertCircle className="h-3 w-3" />
            <span>{warning}</span>
          </p>
        )}
      </div>
    );
  }
);

EnhancedInput.displayName = 'EnhancedInput';

// Search Input Component
interface SearchInputProps extends Omit<EnhancedInputProps, 'leftIcon' | 'rightIcon'> {
  onSearch?: (value: string) => void;
  debounceMs?: number;
}

export function SearchInput({
  onSearch,
  debounceMs = 300,
  ...props
}: SearchInputProps) {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout>();

  const handleSearch = (value: string) => {
    if (debounceTimer) clearTimeout(debounceTimer);

    const timer = setTimeout(() => {
      onSearch?.(value);
    }, debounceMs);

    setDebounceTimer(timer);
  };

  return (
    <EnhancedInput
      {...props}
      leftIcon={<Search className="h-4 w-4" />}
      onChange={(e) => {
        props.onChange?.(e);
        handleSearch(e.target.value);
      }}
      placeholder="Search..."
    />
  );
}

// Password Input Component
export function PasswordInput(props: EnhancedInputProps) {
  return <EnhancedInput {...props} type="password" showPasswordToggle />;
}

// Email Input Component
export function EmailInput(props: EnhancedInputProps) {
  return <EnhancedInput {...props} type="email" />;
}

// Number Input Component
export function NumberInput(props: EnhancedInputProps) {
  return <EnhancedInput {...props} type="number" />;
}

// URL Input Component
export function UrlInput(props: EnhancedInputProps) {
  return <EnhancedInput {...props} type="url" />;
}

// Tel Input Component
export function TelInput(props: EnhancedInputProps) {
  return <EnhancedInput {...props} type="tel" />;
}

// Date Input Component
export function DateInput(props: EnhancedInputProps) {
  return <EnhancedInput {...props} type="date" />;
}

// Time Input Component
export function TimeInput(props: EnhancedInputProps) {
  return <EnhancedInput {...props} type="time" />;
}

// File Input Component
interface FileInputProps extends Omit<EnhancedInputProps, 'type'> {
  accept?: string;
  multiple?: boolean;
  onFilesChange?: (files: FileList | null) => void;
}

export function FileInput({
  accept,
  multiple = false,
  onFilesChange,
  ...props
}: FileInputProps) {
  return (
    <EnhancedInput
      {...props}
      type="file"
      accept={accept}
      multiple={multiple}
      onChange={(e) => {
        props.onChange?.(e);
        onFilesChange?.(e.target.files);
      }}
    />
  );
}

export { EnhancedInput, inputVariants };
