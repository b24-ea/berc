import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';

interface AppTopBarProps {
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  onRightIconPress?: () => void;
  rightIconName?: keyof typeof Ionicons.glyphMap;
  rightIconSize?: number;
  rightIconColor?: string;
  rightIconContainerClassName?: string;
  hideRightIcon?: boolean;
  rightIconContainerStyle?: {
    backgroundColor?: string;
    borderRadius?: number;
    width?: number;
    height?: number;
  };
}

export function AppTopBar({
  leftContent,
  rightContent,
  onRightIconPress,
  rightIconName = 'notifications-outline',
  rightIconSize = 24,
  rightIconColor = colors.textPrimary,
  rightIconContainerClassName,
  hideRightIcon = false,
  rightIconContainerStyle,
}: AppTopBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row items-center justify-between px-5 pb-3"
      style={{ paddingTop: insets.top + 8, backgroundColor: colors.background }}
    >
      <View
        pointerEvents="none"
        style={{ position: 'absolute', left: 0, right: 0, top: insets.top + 8, bottom: 12, justifyContent: 'center' }}
      >
        <Text
          style={{
            color: theme.brand,
            fontSize: 26,
            fontWeight: '700',
            lineHeight: 30,
            letterSpacing: -0.5,
            textAlign: 'center',
            transform: [{ translateX: -4 }],
          }}
        >
          berc
        </Text>
      </View>

      {leftContent ? (
        <View className="h-[46px] min-w-[46px] justify-center">
          {leftContent}
        </View>
      ) : (
        <View className="w-[46px] h-[46px]" />
      )}

      <View className="flex-row items-center gap-2">
        {rightContent}
        {!hideRightIcon ? (
          <Pressable
            onPress={onRightIconPress}
            hitSlop={12}
            className={`w-[46px] h-[46px] items-center justify-center ${rightIconContainerClassName ?? ''}`}
            style={rightIconContainerStyle}
          >
            <Ionicons name={rightIconName} size={rightIconSize} color={rightIconColor} />
          </Pressable>
        ) : !rightContent ? (
          <View className="w-[46px] h-[46px]" />
        ) : null
        }
      </View>
    </View>
  );
}
