import { View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cn } from '@/utils/cn';

interface ScreenProps extends ViewProps {
  safe?: boolean;
  padded?: boolean;
}

export function Screen({
  children,
  safe = true,
  padded = true,
  className,
  ...props
}: ScreenProps & { className?: string }) {
  const Container = safe ? SafeAreaView : View;

  return (
    <Container
      className={cn('flex-1 bg-page', padded && 'px-5', className)}
      {...props}
    >
      {children}
    </Container>
  );
}
