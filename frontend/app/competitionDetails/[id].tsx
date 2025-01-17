import { Button, Image, StyleSheet, Share } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CompetitionDetailsRouteProp } from '../types';
import { useRoute } from '@react-navigation/native';

export default function CompetitionDetails() {
  const route = useRoute<CompetitionDetailsRouteProp>();
  const { competition } = route.params;
  
  if (!competition) {
    return;
  }

  // Handle sharing competition link
  const handleShare = async (title: string, url: string) => {
    try {
      await Share.share({
        title,
        message: `Join my boots competition: ${title}!`,
        url,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />}
      >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Competition Details</ThemedText>
        <Button
          title="Share Link"
          onPress={() => {
            const title = competition.name;
            const url = `http://localhost:8081/competitionDetails/${competition.id}`;
            handleShare(title, url);
          }}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
