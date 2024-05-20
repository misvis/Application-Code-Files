import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Modal } from 'react-native-web';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

// Define a Label component
const Label = ({ text, color }) => (
  <View style={[styles.label, { backgroundColor: color }]}>
    <Text style={styles.labelText}>{text}</Text>
  </View>
);

const Card = ({ id, photo, title, description, labels, onToggleLabel }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleDescription = () => {
    setExpanded(!expanded);
  };

  const toggleLabel = (label) => {
    onToggleLabel(id, label);
  };

  return (
    <TouchableOpacity style={styles.card}>
      <Image source={photo} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text
          style={[
            styles.cardDescription,
            expanded ? styles.expandedDescription : styles.previewDescription,
          ]}
        >
          {description}
        </Text>
        <View style={styles.labelsContainer}>
          {labels.map((label, index) => (
            <TouchableOpacity key={index} onPress={() => toggleLabel(label)}>
              <Label text={label.text} color={label.color} />
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity onPress={toggleDescription} style={styles.collapsibleButton}>
          <FontAwesomeIcon icon={expanded ? faMinus : faPlus} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [cards, setCards] = useState([]);
  const [labels, setLabels] = useState([]);
  const [newLabelText, setNewLabelText] = useState('');
  const [newLabelColor, setNewLabelColor] = useState('#FF5733'); // Default color
  const [colorPickerVisible, setColorPickerVisible] = useState(false);

  const [newCardData, setNewCardData] = useState({
    photo: null,
    title: '',
    description: '',
    labels: [],
  });

  useEffect(() => {
    const storedCards = localStorage.getItem('cards');
    if (storedCards) {
      setCards(JSON.parse(storedCards));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cards', JSON.stringify(cards));
  }, [cards]);

  const handleCreateCard = () => {
    setCards([...cards, newCardData]);
    setShowModal(false);
    setNewCardData({
      photo: null,
      title: '',
      description: '',
      labels: [],
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCardData({ ...newCardData, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleLabel = (cardIndex, label) => {
    const updatedCards = [...cards];
    const card = updatedCards[cardIndex];
    const labelIndex = card.labels.findIndex(
      (l) => l.text === label.text && l.color === label.color
    );
    if (labelIndex === -1) {
      card.labels.push(label);
    } else {
      card.labels.splice(labelIndex, 1);
    }
    setCards(updatedCards);
};

  const createNewLabel = () => {
    if (newLabelText.trim() === '') {
      alert('Label text cannot be empty.');
      return;
    }
    if (labels.length < 8) {
      setLabels([...labels, { text: newLabelText, color: newLabelColor }]);
      setNewLabelText('');
    } else {
      alert('You can only create up to 8 labels.');
    }
  };

  const toggleColorPicker = () => {
    setColorPickerVisible(!colorPickerVisible);
  };

  return (
    <SafeAreaProvider>
      <View style={styles.navigator}>
        <Text style={styles.appName}>Demo App</Text>
        <TouchableOpacity>
          <Image source={require('./assets/user.png')} style={styles.userIcon} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.content}>
            <ScrollView>
              {cards.length > 0 && (
                <View style={styles.grid}>
                  {cards.map((card, index) => (
                    <Card
                      key={index}
                      id={index} // Pass a unique identifier to each Card
                      photo={card.photo}
                      title={card.title}
                      description={card.description}
                      labels={card.labels}
                      onToggleLabel={toggleLabel}
                    />
                  ))}
                </View>
              )}
            </ScrollView>
          </View>
          <View style={styles.sidebar}>
            <Text style={styles.sidebarText}>Sidebar Content</Text>
            <ScrollView style={styles.labelScroll}>
              {labels.map((label, index) => (
                <TouchableOpacity key={index} onPress={() => createNewLabel(label.text, label.color)}>
                  <Label text={label.text} color={label.color} />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.labelCreation}>
              <TextInput
                style={[styles.input, styles.labelInput]}
                placeholder="Label"
                value={newLabelText}
                onChangeText={(text) => setNewLabelText(text)}
              />
              <TouchableOpacity style={styles.colorPicker} onPress={toggleColorPicker}>
                <View style={[styles.colorPreview, { backgroundColor: newLabelColor }]} />
              </TouchableOpacity>
              {colorPickerVisible && (
                <View style={styles.colorPickerContainer}>
                  <TouchableOpacity
                    style={[styles.colorOption, { backgroundColor: '#FF5733' }]}
                    onPress={() => {
                      setNewLabelColor('#FF5733');
                      setColorPickerVisible(false);
                    }}
                  />
                  <TouchableOpacity
                    style={[styles.colorOption, { backgroundColor: '#FFC300' }]}
                    onPress={() => {
                      setNewLabelColor('#FFC300');
                      setColorPickerVisible(false);
                    }}
                  />
                  <TouchableOpacity
                    style={[styles.colorOption, { backgroundColor: '#DAF7A6' }]}
                    onPress={() => {
                      setNewLabelColor('#DAF7A6');
                      setColorPickerVisible(false);
                    }}
                  />
                  <TouchableOpacity
                    style={[styles.colorOption, { backgroundColor: '#C70039' }]}
                    onPress={() => {
                      setNewLabelColor('#C70039');
                      setColorPickerVisible(false);
                    }}
                  />
                  <TouchableOpacity
                    style={[styles.colorOption, { backgroundColor: '#900C3F' }]}
                    onPress={() => {
                      setNewLabelColor('#900C3F');
                      setColorPickerVisible(false);
                    }}
                  />
                  <TouchableOpacity
                    style={[styles.colorOption, { backgroundColor: '#00ADB5' }]}
                    onPress={() => {
                      setNewLabelColor('#00ADB5');
                      setColorPickerVisible(false);
                    }}
                  />
                  <TouchableOpacity
                    style={[styles.colorOption, { backgroundColor: '#5E60CE' }]}
                    onPress={() => {
                      setNewLabelColor('#5E60CE');
                      setColorPickerVisible(false);
                    }}
                  />
                </View>
              )}
              <TouchableOpacity style={styles.createLabelButton} onPress={createNewLabel}>
                <Text style={styles.buttonText}>Create Label</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.button} onPress={() => setShowModal(true)}>
          <Text style={styles.buttonText}>Create Card</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={showModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Create New Card</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={newCardData.title}
            onChangeText={(text) => setNewCardData({ ...newCardData, title: text })}
          />
          <input
            type="file"
            accept="image/*"
            style={styles.fileInput}
            onChange={handleImageChange}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={newCardData.description}
            onChangeText={(text) => setNewCardData({ ...newCardData, description: text })}
          />
          <TouchableOpacity style={styles.createButton} onPress={handleCreateCard}>
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setShowModal(false)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    backgroundColor: '#3498db',
    borderRadius: 20,
    marginTop: 10,
    margin: 20,
    padding: 20,
  },
  navigator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFE5B4',
    borderRadius: 20,
    marginTop: 35,
    margin: 20,
    padding: 20,
    alignItems: 'center',
  },
  appName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    tintColor: '#fff',
    marginLeft: 'auto',
    marginRight: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    margin: 5,
    width: '30%', // Adjust as needed
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardContent: {
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 14,
    color: '#777',
    lineHeight: 20,
    overflow: 'hidden',
  },
  previewDescription: {
    maxHeight: 60, // Limit to 3 lines of text
  },
  expandedDescription: {
    maxHeight: 'none', // Show all lines when expanded
  },
  collapsibleButton: {
    marginTop: 5,
  },
  icon: {
    fontSize: 18,
    color: '#3498db',
  },
  labelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    marginTop: 5,
  },
  label: {
    backgroundColor: '#FF5733',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 2,
  },
  labelText: {
    color: '#fff',
    fontSize: 12,
  },
  sidebar: {
    backgroundColor: '#FFD700',
    width: 150,
    marginTop: 0,
    margin: 20,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  sidebarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#A9A9A9',
    padding: 10,
    margin: 10,
    borderRadius: 20,
  },
  button: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  fileInput: {
    backgroundColor: '#3498db',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 0, // Remove default border
    cursor: 'pointer', // Show pointer cursor on hover
  },
  labelInput: {
    marginBottom: 5,
  },
  colorPicker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  colorPreview: {
    flex: 1,
    borderRadius: 15,
  },
  colorPickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  labelCreation: {
    marginTop: 20,
    alignItems: 'center',
  },
  createLabelButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  labelScroll: {
    maxHeight: 200, // Limit max height and add scrollbar
    overflowY: 'scroll',
  },
});

export default App;
