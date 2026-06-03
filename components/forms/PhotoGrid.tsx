import { View, Pressable, Text } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';

interface PhotoGridProps {
  photos: string[];
  runningIndices: number[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onToggleRunning: (index: number) => void;
  maxPhotos?: number;
}

export function PhotoGrid({
  photos,
  runningIndices,
  onAdd,
  onRemove,
  onToggleRunning,
  maxPhotos = 6,
}: PhotoGridProps) {
  return (
    <View className="flex-row flex-wrap gap-3">
      {photos.map((uri, index) => (
        <Pressable
          key={`${uri}-${index}`}
          onLongPress={() => onToggleRunning(index)}
          className="relative"
        >
          <Image
            source={{ uri }}
            style={{ width: 100, height: 130, borderRadius: 16 }}
            contentFit="cover"
          />
          {runningIndices.includes(index) && (
            <View className="absolute bottom-2 left-2 bg-accent rounded-full px-2 py-0.5">
              <Text className="text-xs text-white font-medium">Running</Text>
            </View>
          )}
          <Pressable
            onPress={() => onRemove(index)}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-text-primary items-center justify-center"
          >
            <Ionicons name="close" size={14} color="#fff" />
          </Pressable>
        </Pressable>
      ))}
      {photos.length < maxPhotos && (
        <Pressable
          onPress={onAdd}
          className="w-[100px] h-[130px] rounded-2xl bg-card border border-dashed border-border items-center justify-center"
        >
          <Ionicons name="add" size={28} color={colors.textSecondary} />
        </Pressable>
      )}
    </View>
  );
}
