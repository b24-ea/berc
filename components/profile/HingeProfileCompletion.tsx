import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import Svg, { Circle } from 'react-native-svg';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';

interface HingeProfileCompletionProps {
  photoUri: string;
  progress: number;
  onPhotoPress: () => void;
  onCompletePress: () => void;
}

const SIZE = 96;
const STROKE = 4;

export function HingeProfileCompletion({
  photoUri,
  progress,
  onPhotoPress,
  onCompletePress,
}: HingeProfileCompletionProps) {
  const radius = (SIZE - STROKE * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, progress));
  const offset = circumference - (clamped / 100) * circumference;
  const inset = STROKE + 4;

  return (
    <View className="items-center pt-4 pb-6">
      <Pressable onPress={onPhotoPress}>
        <View style={{ width: SIZE, height: SIZE }}>
          <Svg width={SIZE} height={SIZE} style={{ position: 'absolute' }}>
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={radius}
              stroke={colors.border}
              strokeWidth={STROKE}
              fill="none"
            />
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={radius}
              stroke={theme.brand}
              strokeWidth={STROKE}
              fill="none"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={offset}
              strokeLinecap="round"
              rotation={-90}
              origin={`${SIZE / 2}, ${SIZE / 2}`}
            />
          </Svg>
          <View
            style={{
              position: 'absolute',
              left: inset,
              top: inset,
              right: inset,
              bottom: inset,
              borderRadius: (SIZE - inset * 2) / 2,
              overflow: 'hidden',
            }}
          >
            <Image
              source={{ uri: photoUri }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          </View>
        </View>
      </Pressable>

      <Text className="text-[13px] mt-4" style={{ color: colors.textSecondary }}>
        {clamped}% complete
      </Text>

      <Pressable onPress={onCompletePress} className="mt-2">
        <Text className="text-[13px]" style={{ color: theme.brand }}>
          Complete your profile →
        </Text>
      </Pressable>
    </View>
  );
}
