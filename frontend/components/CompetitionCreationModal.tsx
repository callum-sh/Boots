import React, { useState } from 'react';
import { Button, Modal, StyleSheet, View, TextInput } from 'react-native';

import { ThemedText } from '@/components/ThemedText';

export function CompetitionCreationModal() {
    const [isCompetitionModalVisible, setIsCompetitionModalVisible] = useState(false);

    const [competitionName, setCompetitionName] = useState('');
    const [competitionDate, setCompetitionDate] = useState('');

    const handleCreateCompetition = () => {
        // Logic to handle competition creation
        console.log('Competition Created:', { competitionName, competitionDate });
        setIsCompetitionModalVisible(false);
    };
    
    return (
        <>
            <Button title="Create New Competition" onPress={() => {setIsCompetitionModalVisible(true)}} />
            
            <Modal visible={isCompetitionModalVisible} animationType="slide">
                <View style={styles.formContainer}>
                    <ThemedText type="title">Create New Competition</ThemedText>
                    <TextInput
                        style={styles.input}
                        placeholder="Competition Name"
                        value={competitionName}
                        onChangeText={setCompetitionName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Competition Date"
                        value={competitionDate}
                        onChangeText={setCompetitionDate}
                    />
                    <Button title="Create" onPress={handleCreateCompetition} />
                    <Button title="Close" onPress={() => setIsCompetitionModalVisible(false)} />
                </View>
            </Modal>
        </>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});
