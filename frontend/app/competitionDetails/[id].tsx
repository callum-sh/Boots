import { Button, StyleSheet, Share } from 'react-native';

import { Text, View } from '@/components/Themed';
import { Colors } from '@/constants/Colors';

export default function CompetitionDetails() {
  // todo: get from url or some alternative 
  const competition = {
    id: '1',
    name: 'Boots Competition',
  };

  // Handle sharing competition link
  const handleShare = async () => {
    try {
      // TODO: fix w/ proper link 
      await Share.share({
        message: `Join my boots competition: ${competition.name}!`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={ styles.title }>Competition Details</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      
      <View>
        <Button 
          title='Share'
          onPress={handleShare}
          color={Colors.light.tint}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shareContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
