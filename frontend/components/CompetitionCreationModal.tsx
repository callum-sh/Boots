import React, { useState } from 'react';
import { Button, Modal, StyleSheet, View, TextInput } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ICompetition } from '@/app/(tabs)';
import { BACKEND_URL, DEBUG } from '@/constants/env';

export function CompetitionCreationModal() {

  const clearedFormData: ICompetition = {
    id: 0,
    name: '',
    description: '',
    start_date: '',
    end_date: '',
  };  
    
  const [isCompetitionModalVisible, setIsCompetitionModalVisible] = useState(false);
  const [competitionFormData, setCompetitionFormData] = useState<ICompetition>(clearedFormData);

  // functions 
  const handleChange = (key: keyof ICompetition, value: string) => {
    // TODO: validate form (like date(s), etc.)
    setCompetitionFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCloseCreateCompetitionModal = () => {
    // close modal and clear form data
    setIsCompetitionModalVisible(false);
    setCompetitionFormData(clearedFormData);
  };
  
  const handleCreateCompetition = async () => {
    try {
      await fetch(`${BACKEND_URL}/competition/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(competitionFormData),
      });
      if (DEBUG) {
        console.log(`[debug] created competition: ${JSON.stringify(competitionFormData)}`);
      }
    } catch (error) {
      console.error(`[error] failed to create competition: ${error}`);
    }

    handleCloseCreateCompetitionModal();
  };
  
  return (
      <>
          <Button title="Create New Competition" onPress={() => {setIsCompetitionModalVisible(true)}} />
          
          <Modal visible={isCompetitionModalVisible} animationType="slide">
              <View style={styles.formContainer}>
                  <ThemedText type="title">Create New Competition</ThemedText>
                  <ThemedText>Name</ThemedText>
                  <TextInput
                    style={{ borderWidth: 1, marginBottom: 8, padding: 4 }}
                    value={competitionFormData.name}
                    onChangeText={value => handleChange('name', value)}
                  />

                  <ThemedText>Description</ThemedText>
                  <TextInput
                    style={{ borderWidth: 1, marginBottom: 8, padding: 4 }}
                    value={competitionFormData.description}
                    onChangeText={value => handleChange('description', value)}
                  />

                  <ThemedText>Start Date</ThemedText>
                  <TextInput
                    style={{ borderWidth: 1, marginBottom: 8, padding: 4 }}
                    value={competitionFormData.start_date}
                    onChangeText={value => handleChange('start_date', value)}
                  />

                  <ThemedText>End Date</ThemedText>
                  <TextInput
                    style={{ borderWidth: 1, marginBottom: 8, padding: 4 }}
                    value={competitionFormData.end_date}
                    onChangeText={value => handleChange('end_date', value)}
                  />
                  <Button title="Create" onPress={handleCreateCompetition} />
                  <Button title="Close" onPress={handleCloseCreateCompetitionModal} />
              </View>
          </Modal>
      </>
)};

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
