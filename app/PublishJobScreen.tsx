import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function PublishJobScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('');
  const [urgency, setUrgency] = useState('normal'); // 'urgent', 'normal', 'flexible'
  const [showError, setShowError] = useState(false);

  const handlePublish = () => {
    if (!title.trim()) {
      setShowError(true);
      return;
    }
    setShowError(false);
    // Lógica para publicar
    console.log('Publicando trabajo...');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A5F" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <View style={styles.backArrow} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Publicar nueva Chamba</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView 
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Detalles del Trabajo Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detalles del Trabajo</Text>

            {/* Título */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <View style={styles.iconEdit} />
                <Text style={styles.label}>Título de la chamba</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Ej: Necesito pintor para mi sala"
                placeholderTextColor="#A0A0A0"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Descripción */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <View style={styles.iconDocument} />
                <Text style={styles.label}>Descripción detallada</Text>
              </View>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe las tareas a realizar, los requisitos y cualquier otro detalle importante."
                placeholderTextColor="#A0A0A0"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            {/* Categoría */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <View style={styles.iconCategory} />
                <Text style={styles.label}>Categoría</Text>
              </View>
              <TouchableOpacity style={styles.selectInput}>
                <Text style={[styles.selectText, !category && styles.placeholderText]}>
                  {category || 'Selecciona una categoría'}
                </Text>
                <View style={styles.chevronDown} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Logística Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Logística</Text>

            {/* Ubicación */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <View style={styles.iconLocation} />
                <Text style={styles.label}>Ubicación</Text>
              </View>
              <View style={styles.searchInputContainer}>
                <View style={styles.searchIconSmall} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Ej: Av. Siempreviva 742"
                  placeholderTextColor="#A0A0A0"
                  value={location}
                  onChangeText={setLocation}
                />
              </View>
            </View>

            {/* Presupuesto */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <View style={styles.iconMoney} />
                <Text style={styles.label}>Presupuesto</Text>
              </View>
              <View style={styles.budgetInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.budgetInput}
                  placeholder="0.00"
                  placeholderTextColor="#A0A0A0"
                  value={budget}
                  onChangeText={setBudget}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {/* Duración estimada */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <View style={styles.iconClock} />
                <Text style={styles.label}>Duración estimada</Text>
              </View>
              <TouchableOpacity style={styles.selectInput}>
                <Text style={[styles.selectText, !duration && styles.placeholderText]}>
                  {duration || 'Selecciona la duración'}
                </Text>
                <View style={styles.chevronDown} />
              </TouchableOpacity>
            </View>

            {/* Urgencia */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <View style={styles.iconUrgency} />
                <Text style={styles.label}>Urgencia</Text>
              </View>
              <View style={styles.urgencyContainer}>
                <TouchableOpacity
                  style={[
                    styles.urgencyButton,
                    urgency === 'urgent' && styles.urgencyButtonActive,
                  ]}
                  onPress={() => setUrgency('urgent')}
                >
                  <Text
                    style={[
                      styles.urgencyText,
                      urgency === 'urgent' && styles.urgencyTextActive,
                    ]}
                  >
                    Urgente
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.urgencyButton,
                    urgency === 'normal' && styles.urgencyButtonActive,
                  ]}
                  onPress={() => setUrgency('normal')}
                >
                  <Text
                    style={[
                      styles.urgencyText,
                      urgency === 'normal' && styles.urgencyTextActive,
                    ]}
                  >
                    Normal
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.urgencyButton,
                    urgency === 'flexible' && styles.urgencyButtonActive,
                  ]}
                  onPress={() => setUrgency('flexible')}
                >
                  <Text
                    style={[
                      styles.urgencyText,
                      urgency === 'flexible' && styles.urgencyTextActive,
                    ]}
                  >
                    Flexible
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Error Message */}
          {showError && (
            <View style={styles.errorContainer}>
              <View style={styles.errorIcon} />
              <Text style={styles.errorText}>
                Por favor, añade un título. Este campo es obligatorio para publicar.
              </Text>
            </View>
          )}

          {/* Publish Button */}
          <TouchableOpacity 
            style={styles.publishButton}
            onPress={handlePublish}
          >
            <Text style={styles.publishButtonText}>Publicar Chamba</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  flex: {
    flex: 1,
  },
  header: {
    backgroundColor: '#1E3A5F',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 4,
  },
  backArrow: {
    width: 24,
    height: 24,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    marginRight: 32,
  },
  headerSpacer: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 8,
  },
  iconEdit: {
    width: 20,
    height: 20,
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  iconDocument: {
    width: 20,
    height: 20,
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  iconCategory: {
    width: 20,
    height: 20,
    backgroundColor: '#8B5CF6',
    borderRadius: 10,
  },
  iconLocation: {
    width: 20,
    height: 20,
    backgroundColor: '#3B82F6',
    borderRadius: 10,
  },
  iconMoney: {
    width: 20,
    height: 20,
    backgroundColor: '#10B981',
    borderRadius: 10,
  },
  iconClock: {
    width: 20,
    height: 20,
    backgroundColor: '#F59E0B',
    borderRadius: 10,
  },
  iconUrgency: {
    width: 20,
    height: 20,
    backgroundColor: '#EF4444',
    borderRadius: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textArea: {
    height: 140,
    paddingTop: 14,
  },
  selectInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 15,
    color: '#1F2937',
  },
  placeholderText: {
    color: '#A0A0A0',
  },
  chevronDown: {
    width: 12,
    height: 12,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#6B7280',
    transform: [{ rotate: '45deg' }],
    marginTop: -4,
  },
  searchInputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIconSmall: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: '#9CA3AF',
    borderRadius: 8,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    padding: 0,
  },
  budgetInputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginRight: 8,
  },
  budgetInput: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    padding: 0,
  },
  urgencyContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  urgencyButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  urgencyButtonActive: {
    backgroundColor: '#1E3A5F',
    borderColor: '#1E3A5F',
  },
  urgencyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  urgencyTextActive: {
    color: '#FFFFFF',
  },
  errorContainer: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  errorIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F59E0B',
    marginRight: 12,
    marginTop: 2,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  publishButton: {
    backgroundColor: '#1E3A5F',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  publishButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});