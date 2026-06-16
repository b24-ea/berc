import { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { useAuthStore } from '@/store/authStore';
import { useCreateRun } from '@/features/runs/hooks';
import { createRunSchema, type CreateRunFormValues } from '@/utils/validators';
import { colors } from '@/constants/colors';
import { theme } from '@/constants/theme';
import { cardFrame } from '@/constants/cardStyle';
import { isSupabaseConfigured } from '@/services/supabase/client';
import { VIBE_TAGS } from '@/constants/vibes';

export default function CreateRunScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const userId = useAuthStore((s) => s.user?.id);
  const isDevBypass = useAuthStore((s) => s.isDevBypass);
  const createRun = useCreateRun();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const postButtonScale = useSharedValue(1);
  const postButtonOpacity = useSharedValue(1);

  const { control, handleSubmit, setValue, watch, formState: { errors } } =
    useForm<CreateRunFormValues>({
      resolver: zodResolver(createRunSchema),
      defaultValues: {
        title: '',
        location: '',
        date: '',
        time: '',
        vibeTags: [] as string[],
        note: '',
        imageUri: '',
        distance: '',
        pace: '',
      },
    });

  const vibeTags = watch('vibeTags');
  const title = watch('title');
  const location = watch('location');
  const date = watch('date');
  const time = watch('time');
  const distance = watch('distance');
  const pace = watch('pace');

  const isReadyToPost = useMemo(
    () => Boolean(imageUri && title?.trim() && location?.trim() && date?.trim() && time?.trim()),
    [imageUri, title, location, date, time],
  );

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setValue('imageUri', result.assets[0].uri);
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    const runData = {
      title: values.title,
      location: values.location,
      date: values.date,
      time: values.time,
      distance: values.distance && values.distance.length > 0
        ? Number(values.distance)
        : undefined,
      pace: values.pace,
      vibeTags: values.vibeTags,
      note: values.note,
      imageUri: values.imageUri,
    };

    const shouldUseMockPost = isDevBypass || !isSupabaseConfigured || !userId;

    if (shouldUseMockPost) {
      Alert.alert('Run posted (demo)', 'This is a mock post. Supabase can be connected later.');
      router.replace('/(tabs)/feed');
      return;
    }

    await createRun.mutateAsync({ userId, data: runData });
    router.replace('/(tabs)/feed');
  });

  const postButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: postButtonScale.value }],
    opacity: postButtonOpacity.value,
  }));

  const onPressPostRun = async () => {
    if (!isReadyToPost || createRun.isPending) return;

    postButtonScale.value = withSequence(
      withTiming(0.97, { duration: 110 }),
      withTiming(1.02, { duration: 110 }),
      withTiming(1, { duration: 130 }),
    );
    postButtonOpacity.value = withSequence(
      withTiming(0.86, { duration: 110 }),
      withTiming(1, { duration: 180 }),
    );

    await onSubmit();
  };

  return (
    <View className="flex-1 bg-page">
      <View
        className="flex-row items-center justify-between px-5 pb-3 border-b border-border"
        style={{ paddingTop: insets.top + 8 }}
      >
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text className="text-xl font-semibold" style={{ color: theme.brand }}>
          New Run
        </Text>
        <Pressable disabled={!isReadyToPost} onPress={onSubmit} hitSlop={10}>
          <Text
            className="text-base font-medium"
            style={{ color: isReadyToPost ? theme.brand : colors.muted }}
          >
            Post
          </Text>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 44, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-[28px] font-bold mb-1" style={{ color: theme.brand }}>
          Create your run
        </Text>
        <Text className="text-base mb-5" style={{ color: '#A53D13CC' }}>
          Keep it simple and inviting.
        </Text>

        <Pressable onPress={pickImage} className="mb-6">
          {imageUri ? (
            <View>
              <Image
                source={{ uri: imageUri }}
                style={{ width: '100%', height: 320, borderRadius: 20 }}
                contentFit="cover"
              />
              <View className="absolute bottom-3 right-3 bg-black/45 rounded-full px-3 py-1.5">
                <Text className="text-white text-xs font-medium">Change photo</Text>
              </View>
            </View>
          ) : (
            <View className="h-[320px] rounded-3xl border border-dashed border-border items-center justify-center bg-card">
              <Ionicons name="camera-outline" size={30} color={colors.textPrimary} />
              <Text className="text-base font-medium mt-2" style={{ color: theme.brand }}>
                Upload your run photo
              </Text>
              <Text className="text-xs mt-1 tracking-wide uppercase" style={{ color: '#A53D13B3' }}>
                Minimalist landscape preferred
              </Text>
            </View>
          )}
        </Pressable>
        {errors.imageUri && (
          <Text className="text-sm -mt-4 mb-4" style={{ color: theme.brandDark }}>
            {errors.imageUri.message}
          </Text>
        )}

        <View className="rounded-3xl p-4 gap-4 mb-4" style={cardFrame}>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Story Title"
                placeholder="Morning Mist over the Ridge..."
                value={value}
                onChangeText={onChange}
                error={errors.title?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="location"
            render={({ field: { onChange, value } }) => (
              <Input
                label=""
                placeholder="Add location"
                value={value}
                onChangeText={onChange}
                error={errors.location?.message}
              />
            )}
          />
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Controller
                control={control}
                name="date"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label=""
                    placeholder="Oct 24, 2023"
                    value={value}
                    onChangeText={onChange}
                    error={errors.date?.message}
                  />
                )}
              />
            </View>
            <View className="flex-1">
              <Controller
                control={control}
                name="time"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label=""
                    placeholder="06:45 AM"
                    value={value}
                    onChangeText={onChange}
                    error={errors.time?.message}
                  />
                )}
              />
            </View>
          </View>
        </View>

        <Text className="text-xs uppercase tracking-wide mt-1 mb-3" style={{ color: '#A53D13B3' }}>
          Performance & Vibe
        </Text>
        <View className="rounded-3xl p-4 mb-4" style={cardFrame}>
          <View className="flex-row gap-3 mb-3">
            <View className="flex-1">
              <Input
                label="Distance"
                placeholder="0.0 km"
                keyboardType="numeric"
                value={distance ?? ''}
                onChangeText={(v) => setValue('distance', v)}
              />
            </View>
            <View className="flex-1">
              <Input
                label="Pace"
                placeholder="0:00 /km"
                value={pace ?? ''}
                onChangeText={(v) => setValue('pace', v)}
              />
            </View>
          </View>

          <Text className="text-sm font-medium mb-2" style={{ color: theme.brand }}>
            Vibe tags
          </Text>
          <Text className="text-xs mb-3" style={{ color: '#A53D13B3' }}>
            Pick a few tags so people know the feel of this run.
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-1">
            {VIBE_TAGS.slice(0, 8).map((tag) => {
              const selected = vibeTags.includes(tag);
              return (
                <Pressable
                  key={tag}
                  onPress={() => {
                    if (selected) setValue('vibeTags', vibeTags.filter((t) => t !== tag));
                    else setValue('vibeTags', [...vibeTags, tag]);
                  }}
                  className="px-4 py-2 rounded-full border"
                  style={{
                    borderColor: selected ? theme.brand : colors.border,
                    backgroundColor: selected ? theme.peach : '#fff',
                  }}
                >
                  <Text
                    className="text-sm"
                    style={{ color: selected ? theme.brand : theme.brandDark }}
                  >
                    {tag}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="rounded-3xl p-4 mt-1 mb-6" style={cardFrame}>
          <Controller
            control={control}
            name="note"
            render={({ field: { onChange, value } }) => (
              <TextArea
                label="Personal Notes"
                placeholder="How did it feel? The air was crisp and my legs felt light..."
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </View>

        <Animated.View style={postButtonAnimatedStyle}>
          <Pressable
            onPress={onPressPostRun}
            disabled={!isReadyToPost || createRun.isPending}
            className="rounded-full py-4 items-center"
            style={{
              backgroundColor: !isReadyToPost || createRun.isPending ? colors.muted : theme.brand,
            }}
          >
            <Text className="text-white text-lg font-semibold">
              {createRun.isPending ? 'Posting...' : 'Post Run'}
            </Text>
          </Pressable>
        </Animated.View>
        <View className="h-2" />
      </ScrollView>
    </View>
  );
}
