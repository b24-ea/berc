import { View, Text, ActivityIndicator, Pressable } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { Stack } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useIncomingRequests, useAcceptRequest, useDeclineRequest } from '@/features/requests/hooks';
import type { IncomingRequest } from '@/features/requests/api';
import { notifications } from '@/hooks/useNotifications';
import { getFirstName, formatRunDateTime } from '@/utils/formatters';
import { colors } from '@/constants/colors';

export default function RequestsScreen() {
  const userId = useAuthStore((s) => s.user?.id);
  const { data: requests, isLoading } = useIncomingRequests(userId);
  const acceptRequest = useAcceptRequest();
  const declineRequest = useDeclineRequest();

  const handleAccept = async (req: IncomingRequest) => {
    if (!userId) return;
    await acceptRequest.mutateAsync({
      requestId: req.id,
      runId: req.run_id,
      creatorId: userId,
      requesterId: req.requester_id,
      runTitle: req.run.title,
      runDate: req.run.datetime,
    });
    await notifications.requestAccepted(getFirstName(req.requester.name));
  };

  const handleDecline = async (req: IncomingRequest) => {
    await declineRequest.mutateAsync(req.id);
    await notifications.requestDeclined();
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Requests',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
        }}
      />
      <Screen>
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color={colors.accent} />
          </View>
        ) : !requests?.length ? (
          <EmptyState
            title="No requests yet"
            subtitle="Your next running partner is out there."
          />
        ) : (
          <FlashList
            data={requests as IncomingRequest[]}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="bg-card rounded-3xl p-4 mb-4 border border-card-border">
                <View className="flex-row gap-3 mb-3">
                  <Image
                    source={{ uri: item.requester.photos?.[0] }}
                    style={{ width: 48, height: 48, borderRadius: 24 }}
                  />
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-text-primary">
                      {item.requester.name}
                    </Text>
                    <Text className="text-sm text-text-secondary">
                      wants to join · {item.run.title}
                    </Text>
                    <Text className="text-xs text-text-secondary mt-1">
                      {formatRunDateTime(item.run.datetime)}
                    </Text>
                  </View>
                </View>
                <View className="flex-row gap-2">
                  <View className="flex-1">
                    <Button
                      label="Accept"
                      size="sm"
                      fullWidth
                      loading={acceptRequest.isPending}
                      onPress={() => handleAccept(item)}
                    />
                  </View>
                  <View className="flex-1">
                    <Button
                      label="Decline"
                      variant="secondary"
                      size="sm"
                      fullWidth
                      loading={declineRequest.isPending}
                      onPress={() => handleDecline(item)}
                    />
                  </View>
                </View>
              </View>
            )}
          />
        )}
      </Screen>
    </>
  );
}
