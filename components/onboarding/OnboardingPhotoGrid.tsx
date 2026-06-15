import { View, Pressable, Text, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

interface OnboardingPhotoGridProps {
  photos: (string | undefined)[];
  onSlotPress: (index: number) => void;
  onRemove?: (index: number) => void;
}

export function OnboardingPhotoGrid({
  photos,
  onSlotPress,
  onRemove,
}: OnboardingPhotoGridProps) {
  const { width } = useWindowDimensions();
  const gap = 10;
  const contentWidth = width - 40;
  const colWidth = (contentWidth - gap) / 2;
  const smallHeight = colWidth * 0.95;
  const tallHeight = smallHeight * 2 + gap;
  const thirdWidth = (contentWidth - gap * 2) / 3;

  const renderSlot = (index: number, slotWidth: number, slotHeight: number) => {
    const uri = photos[index];
    const hasPhoto = Boolean(uri);

    return (
      <Pressable
        key={index}
        onPress={() => onSlotPress(index)}
        style={{ width: slotWidth, height: slotHeight, backgroundColor: theme.card }}
        className="rounded-2xl border border-dashed overflow-hidden items-center justify-center"
      >
        {hasPhoto ? (
          <>
            <Image
              source={{ uri }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
            {onRemove ? (
              <Pressable
                onPress={() => onRemove(index)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full items-center justify-center bg-black/45"
              >
                <Ionicons name="close" size={16} color="#fff" />
              </Pressable>
            ) : null}
          </>
        ) : (
          <Ionicons name="add" size={28} color={`${theme.brand}55`} />
        )}
      </Pressable>
    );
  };

  return (
    <View style={{ gap }}>
      <View className="flex-row" style={{ gap }}>
        {renderSlot(0, colWidth, tallHeight)}
        <View style={{ gap }}>
          {renderSlot(1, colWidth, smallHeight)}
          {renderSlot(2, colWidth, smallHeight)}
        </View>
      </View>
      <View className="flex-row" style={{ gap }}>
        {renderSlot(3, thirdWidth, smallHeight)}
        {renderSlot(4, thirdWidth, smallHeight)}
        {renderSlot(5, thirdWidth, smallHeight)}
      </View>
    </View>
  );
}
