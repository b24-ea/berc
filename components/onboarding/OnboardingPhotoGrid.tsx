import { View, Pressable, Text, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

const BRAND_BROWN = '#8B3213';
const BRAND_BROWN_LIGHT = '#C4A48E';

interface OnboardingPhotoGridProps {
  photos: string[];
  runningSlotIndex: number;
  onSlotPress: (index: number) => void;
}

export function OnboardingPhotoGrid({
  photos,
  runningSlotIndex,
  onSlotPress,
}: OnboardingPhotoGridProps) {
  const { width } = useWindowDimensions();
  const gap = 12;
  const slotWidth = (width - 40 - gap) / 2;
  const slotHeight = slotWidth * 1.28;

  const slots = [0, 1, 2, 3];

  return (
    <View className="flex-row flex-wrap" style={{ gap }}>
      {slots.map((index) => {
        const uri = photos[index];
        const isRunningSlot = index === runningSlotIndex;
        const hasPhoto = Boolean(uri && uri.length > 0);

        return (
          <Pressable
            key={index}
            onPress={() => onSlotPress(index)}
            style={{ width: slotWidth, height: slotHeight }}
            className="rounded-2xl border border-dashed border-[#D4C9BE] bg-[#FAF8F5] overflow-hidden items-center justify-center"
          >
            {hasPhoto ? (
              <>
                <Image
                  source={{ uri }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="cover"
                />
                {isRunningSlot && (
                  <View
                    className="absolute top-2 left-2 rounded-full px-2.5 py-1"
                    style={{ backgroundColor: BRAND_BROWN }}
                  >
                    <Text className="text-[11px] font-semibold text-white">
                      Running photo
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <>
                {isRunningSlot && (
                  <View
                    className="absolute top-2 left-2 rounded-full px-2.5 py-1"
                    style={{ backgroundColor: BRAND_BROWN }}
                  >
                    <Text className="text-[11px] font-semibold text-white">
                      Running photo
                    </Text>
                  </View>
                )}
                <Ionicons
                  name="add"
                  size={28}
                  color={isRunningSlot ? BRAND_BROWN : BRAND_BROWN_LIGHT}
                />
              </>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
