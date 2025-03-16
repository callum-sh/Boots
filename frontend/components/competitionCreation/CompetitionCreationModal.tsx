import { useEffect, useState } from 'react';
import { Modal, StyleSheet, TextInput, useColorScheme } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

import { ICompetition } from '@/types/competition';
import { IconButton } from '../IconButton';
import { Colors } from '@/constants/Colors';
import { createCompetition } from '@/network/competition';
import { Text, View, RowView} from '../Themed';
import { CategorySelectionModal } from './CategorySelectionModal';
import { fetchCategories } from '@/network/category';
import { ICategory } from '@/types/category';
import React = require('react');

export function CompetitionCreationModal() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'light' ? Colors.light : Colors.dark;

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(() => {
    const defaultEnd= new Date();
    defaultEnd.setDate(defaultEnd.getDate() + 28);
    return defaultEnd;
  });
  const [validDates, setValidDates] = useState(true);

  const clearedFormData: ICompetition = {
    id: 0,
    name: '',
    description: '',
    start_date: startDate.toLocaleDateString(),
    end_date: endDate.toLocaleDateString(),
    categories: [],
    participants: [],
  };
  
  const [isCompetitionModalVisible, setIsCompetitionModalVisible] = useState(false);
  const [competitionFormData, setCompetitionFormData] = useState<ICompetition>(clearedFormData);
  const [categories, setCategories] = useState<ICategory[]>([]);

  // fetch recommended categories
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };

    fetchData();
  }, []);

  const handleChange = (key: keyof ICompetition, value: string | number[]) => {
    // TODO: validate form (like date(s), etc.)
    setCompetitionFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const onStartDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setStartDate(selectedDate);
      if (selectedDate >= endDate) {
        setValidDates(false)
      } else {
        setValidDates(true)
        handleChange("start_date", selectedDate.toLocaleDateString());
      }
    }
  };

  const onEndDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setEndDate(selectedDate);
      if (startDate >= selectedDate) {
        setValidDates(false)
      } else {
        setValidDates(true)
        handleChange("end_date", selectedDate.toLocaleDateString());
      }
    }
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
            content="Make Competition"
          />
        </View>
          
          <Modal visible={isCompetitionModalVisible} animationType="slide">
              <View style={styles.formContainer}>
                {/* main competition creation fields  */}
                  <Text style={styles.title}>Create New Competition</Text>
                  <View style={styles.separator} lightColor="#fff" darkColor="rgba(255,255,255,0.1)" />
                  
                  <Text>Name</Text>
                  <TextInput
                    style={[styles.textInput, {color: theme.tint}]}
                    value={competitionFormData.name}
                    onChangeText={value => handleChange('name', value)}
                  />

                  <Text>Description</Text>
                  <TextInput
                    style={[styles.textInput, {color: theme.tint}]}
                    value={competitionFormData.description}
                    onChangeText={value => handleChange('description', value)}
                  />

                  <Text>Start Date</Text>
                  <DateTimePicker
                    value={startDate}
                    mode={"date"}
                    onChange={onStartDateChange}
                  />

                  <Text>End Date</Text>
                  <DateTimePicker
                    value={endDate}
                    mode={"date"}
                    onChange={onEndDateChange}
                  />
                  {!validDates && <Text style={styles.errorText}>End date must be after the start date</Text>}

                  {/* category selection */}
                  <CategorySelectionModal handleChange={handleChange} categories={categories} />

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
                      color={validDates ? theme.tint : "#808080"}
                      iconSize={32}
                      onPress={validDates ? handleCreateCompetition : undefined}
                      content="create"
                      disabled={!validDates}
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
    color: Colors.light.text,
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
    flex: 1,
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
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 4,
  },
});
