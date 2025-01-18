import React, { useState } from 'react';
import { Modal, StyleSheet, TextInput, useColorScheme } from 'react-native';

import { ICompetition } from '@/types/competition';
import { IconButton } from './IconButton';
import { Colors } from '@/constants/Colors';
import { createCompetition } from '@/network/competition';
import { Text, View, RowView} from './Themed';

export function CompetitionCreationModal() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'light' ? Colors.light : Colors.dark;

  const clearedFormData: ICompetition = {
    id: 0,
    name: '',
    description: '',
    start_date: '',
    end_date: '',
  };
    
  const [isCompetitionModalVisible, setIsCompetitionModalVisible] = useState(false);
  const [competitionFormData, setCompetitionFormData] = useState<ICompetition>(clearedFormData);
  const [categories, setCategories] = useState<string[]>([]);

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
    await createCompetition(competitionFormData);
    handleCloseCreateCompetitionModal();
  };
  
  return (
      <>
        <View>
          <IconButton
            iconName="plus"
            color={theme.tint}
            iconSize={32}
            onPress={() => {setIsCompetitionModalVisible(true)}}
          />
        </View>
          
          <Modal visible={isCompetitionModalVisible} animationType="slide">
              <View style={styles.formContainer}>
                {/* main competition creation fields  */}
                  <Text style={styles.title}>Create New Competition</Text>
                  <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
                  
                  <Text>Name</Text>
                  <TextInput
                    style={styles.textInput}
                    value={competitionFormData.name}
                    onChangeText={value => handleChange('name', value)}
                  />

                  <Text>Description</Text>
                  <TextInput
                    style={styles.textInput}
                    value={competitionFormData.description}
                    onChangeText={value => handleChange('description', value)}
                  />

                  <Text>Start Date</Text>
                  <TextInput
                    style={styles.textInput}
                    value={competitionFormData.start_date}
                    onChangeText={value => handleChange('start_date', value)}
                  />

                  <Text>End Date</Text>
                  <TextInput
                    style={styles.textInput}
                    value={competitionFormData.end_date}
                    onChangeText={value => handleChange('end_date', value)}
                  />
                  {/* category selection */}

                  {/* submit logic  */}
                  <RowView style={styles.submitContainer}>
                    <IconButton
                      backgroundColor={theme.warning}
                      iconName="close"
                      color={theme.warning}
                      iconSize={32}
                      onPress={handleCloseCreateCompetitionModal}
                      content="close"
                    />
                    <IconButton
                      iconName="plus"
                      color={theme.tint}
                      iconSize={32}
                      onPress={handleCreateCompetition}
                      content="create"
                    />
                  </RowView>
              </View>
          </Modal>
      </>
)};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  submitContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '100%',
  },
  textInput: {
    borderWidth: 1,
    marginBottom: 8,
    padding: 4,
    borderRadius: 4,
    borderColor: "rgb(102, 102, 102)",
    color: useColorScheme() === 'light' ? Colors.light.text : Colors.dark.text,
  },
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
    paddingTop: 22,
  },
  formContainer: {
    padding: 20,
    paddingTop: 80,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});
