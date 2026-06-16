import { Pressable, Text, ActivityIndicator, type PressableProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { cn } from '@/utils/cn';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'muted';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends PressableProps {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-accent rounded-full h-[52px]',
  secondary: 'bg-card border border-card-border rounded-2xl',
  ghost: 'bg-transparent',
  muted: 'bg-card',
};

const variantTextStyles: Record<ButtonVariant, string> = {
  primary: 'text-white',
  secondary: 'text-text-primary',
  ghost: 'text-text-secondary',
  muted: 'text-text-secondary',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2.5 rounded-xl',
  md: 'px-6 py-3.5 rounded-2xl',
  lg: 'px-8 py-4 rounded-2xl',
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  className,
  onPressIn,
  onPressOut,
  ...props
}: ButtonProps & { className?: string }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isDisabled = disabled || loading || variant === 'muted';

  return (
    <AnimatedPressable
      style={animatedStyle}
      onPressIn={(e) => {
        if (!isDisabled) scale.value = withSpring(0.97, { damping: 15 });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, { damping: 15 });
        onPressOut?.(e);
      }}
      disabled={isDisabled}
      className={cn(
        'items-center justify-center flex-row',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        isDisabled && 'opacity-60',
        className,
      )}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#1A1A1A'} />
      ) : (
        <Text
          className={cn(
            'font-semibold text-base',
            variantTextStyles[variant],
            size === 'sm' && 'text-sm',
          )}
        >
          {label}
        </Text>
      )}
    </AnimatedPressable>
  );
}
