import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';
import { Chip } from '@/components/ui/Chip';
import type { UserRow } from '@/types/database';
import { formatUserLocation } from '@/utils/formatters';

interface ProfileHeaderProps {
  user: UserRow;
  isOwnProfile?: boolean;
  onPhotoPress?: (index: number) => void;
}

export function ProfileHeader({
  user,
  isOwnProfile = false,
  onPhotoPress,
}: ProfileHeaderProps) {
  const heroPhoto = user.photos[0];
  const gridPhotos = user.photos.slice(1);

  return (
    <View>
      {heroPhoto && (
        <View className="rounded-3xl overflow-hidden mb-4 -mx-5">
          <Image
            source={{ uri: heroPhoto }}
            style={{ width: '100%', height: 360 }}
            contentFit="cover"
          />
        </View>
      )}

      {gridPhotos.length > 0 && (
        <FlashList
          data={gridPhotos}
          horizontal
          keyExtractor={(_, i) => `photo-${i + 1}`}
          renderItem={({ item, index }) => (
            <Pressable onPress={() => onPhotoPress?.(index + 1)} className="mr-2">
              <Image
                source={{ uri: item }}
                style={{ width: 100, height: 130, borderRadius: 16 }}
                contentFit="cover"
              />
            </Pressable>
          )}
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        />
      )}

      <Text className="text-2xl font-bold text-text-primary">
        {user.name}
        {user.age ? `, ${user.age}` : ''}
      </Text>
      <Text className="text-base text-text-secondary mt-1">
        {formatUserLocation(user.city)}
      </Text>

      {user.bio && (
        <Text className="text-base text-text-primary mt-4 leading-6">{user.bio}</Text>
      )}

      {user.vibe_tags.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mt-4">
          {user.vibe_tags.map((tag) => (
            <Chip key={tag} label={tag} />
          ))}
        </View>
      )}

      {(user.weekly_km || user.average_pace || user.favourite_route || user.run_club) && (
        <View className="mt-6 gap-3">
          {user.weekly_km != null && (
            <InfoCard label="Weekly km" value={`${user.weekly_km} km`} />
          )}
          {user.average_pace && (
            <InfoCard label="Average pace" value={`${user.average_pace} /km`} />
          )}
          {user.favourite_route && (
            <InfoCard label="Favourite route" value={user.favourite_route} />
          )}
          {user.run_club && (
            <InfoCard label="Run club" value={user.run_club} />
          )}
        </View>
      )}
    </View>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <View className="bg-card rounded-2xl px-4 py-3 border border-border">
      <Text className="text-xs text-text-secondary uppercase tracking-wide">{label}</Text>
      <Text className="text-base font-medium text-text-primary mt-1">{value}</Text>
    </View>
  );
}
