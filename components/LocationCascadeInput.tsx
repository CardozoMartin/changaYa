import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useGeoRef } from '../hooks/useGeoRef';

interface LocationCascadeInputProps {
  value: string;
  onChangeLocation: (location: string) => void;
  error?: string;
  onFocus?: () => void;
}

export const LocationCascadeInput: React.FC<LocationCascadeInputProps> = ({
  value,
  onChangeLocation,
  error,
  onFocus,
}) => {
  const [currentStep, setCurrentStep] = useState<'province' | 'locality' | 'street'>('province');
  const [provinceQuery, setProvinceQuery] = useState('');
  const [localityQuery, setLocalityQuery] = useState('');
  const [streetQuery, setStreetQuery] = useState('');
  
  const [selectedProvince, setSelectedProvince] = useState<any>(null);
  const [selectedLocality, setSelectedLocality] = useState<any>(null);
  
  const [showProvinceSuggestions, setShowProvinceSuggestions] = useState(false);
  const [showLocalitySuggestions, setShowLocalitySuggestions] = useState(false);
  const [showStreetSuggestions, setShowStreetSuggestions] = useState(false);
  
  const [provinceSuggestions, setProvinceSuggestions] = useState<any[]>([]);
  const [localitySuggestions, setLocalitySuggestions] = useState<any[]>([]);
  const [streetSuggestions, setStreetSuggestions] = useState<any[]>([]);
  
  const { loading, searchProvinces, searchLocalities, searchStreets } = useGeoRef();

  // Buscar provincias
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (provinceQuery.length >= 2 && currentStep === 'province') {
        const results = await searchProvinces(provinceQuery);
        setProvinceSuggestions(results);
        setShowProvinceSuggestions(true);
      } else {
        setProvinceSuggestions([]);
        setShowProvinceSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [provinceQuery, currentStep, searchProvinces]);

  // Buscar localidades
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (localityQuery.length >= 2 && currentStep === 'locality' && selectedProvince) {
        const results = await searchLocalities(localityQuery, selectedProvince.id);
        setLocalitySuggestions(results);
        setShowLocalitySuggestions(true);
      } else {
        setLocalitySuggestions([]);
        setShowLocalitySuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [localityQuery, currentStep, selectedProvince, searchLocalities]);

  // Buscar calles/barrios
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (
        streetQuery.length >= 3 && 
        currentStep === 'street' && 
        selectedProvince && 
        selectedLocality
      ) {
        const results = await searchStreets(
          streetQuery,
          selectedLocality.nombre,
          selectedProvince.nombre
        );
        setStreetSuggestions(results);
        setShowStreetSuggestions(true);
      } else {
        setStreetSuggestions([]);
        setShowStreetSuggestions(false);
      }
    }, 500); // Más tiempo para no sobrecargar la API de Nominatim

    return () => clearTimeout(delayDebounceFn);
  }, [streetQuery, currentStep, selectedProvince, selectedLocality, searchStreets]);

  const handleSelectProvince = (province: any) => {
    setSelectedProvince(province);
    setProvinceQuery(province.nombre);
    setShowProvinceSuggestions(false);
    setCurrentStep('locality');
    setLocalityQuery('');
    setSelectedLocality(null);
    setStreetQuery('');
  };

  const handleSelectLocality = (locality: any) => {
    setSelectedLocality(locality);
    setLocalityQuery(locality.nombre);
    setShowLocalitySuggestions(false);
    setCurrentStep('street');
    setStreetQuery('');
  };

  const handleStreetChange = (text: string) => {
    setStreetQuery(text);
    updateFullLocation(text);
  };

  const handleSelectStreet = (street: any) => {
    setStreetQuery(street.formatted);
    setShowStreetSuggestions(false);
    updateFullLocation(street.formatted);
  };

  const updateFullLocation = (street: string) => {
    if (selectedProvince && selectedLocality && street) {
      const fullLocation = `${street}, ${selectedLocality.nombre}, ${selectedProvince.nombre}`;
      onChangeLocation(fullLocation);
    } else if (selectedProvince && selectedLocality) {
      const fullLocation = `${selectedLocality.nombre}, ${selectedProvince.nombre}`;
      onChangeLocation(fullLocation);
    } else if (selectedProvince) {
      onChangeLocation(selectedProvince.nombre);
    }
  };

  const handleEditProvince = () => {
    setCurrentStep('province');
    setSelectedProvince(null);
    setSelectedLocality(null);
    setLocalityQuery('');
    setStreetQuery('');
    onChangeLocation('');
  };

  const handleEditLocality = () => {
    setCurrentStep('locality');
    setSelectedLocality(null);
    setStreetQuery('');
    updateFullLocation('');
  };

  return (
    <View style={styles.container}>
      {/* Paso 1: Provincia */}
      <View style={styles.stepContainer}>
        <Text style={styles.stepLabel}>1. Provincia</Text>
        <View style={[
          styles.inputContainer,
          currentStep === 'province' && styles.inputContainerActive,
          error && !selectedProvince && styles.inputContainerError
        ]}>
          <View style={styles.locationIconContainer}>
            <View style={styles.locationPin} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Ej: Tucumán, Buenos Aires..."
            placeholderTextColor="#9CA3AF"
            value={provinceQuery}
            onChangeText={(text) => {
              setProvinceQuery(text);
              if (text.length < 2) {
                setShowProvinceSuggestions(false);
              }
            }}
            onFocus={() => {
              setCurrentStep('province');
              if (provinceSuggestions.length > 0) {
                setShowProvinceSuggestions(true);
              }
              onFocus?.();
            }}
            editable={!selectedProvince || currentStep === 'province'}
          />
          {selectedProvince && (
            <TouchableOpacity onPress={handleEditProvince} style={styles.editButton}>
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
          )}
          {loading && currentStep === 'province' && (
            <ActivityIndicator size="small" color="#1142d4" />
          )}
        </View>

        {showProvinceSuggestions && provinceSuggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <FlatList
              data={provinceSuggestions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => handleSelectProvince(item)}
                >
                  <View style={styles.suggestionIconContainer}>
                    <View style={styles.suggestionPin} />
                  </View>
                  <Text style={styles.suggestionPrimaryText}>{item.nombre}</Text>
                </TouchableOpacity>
              )}
              style={styles.suggestionsList}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
            />
          </View>
        )}
      </View>

      {/* Paso 2: Localidad/Ciudad */}
      {selectedProvince && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepLabel}>2. Localidad / Ciudad</Text>
          <View style={[
            styles.inputContainer,
            currentStep === 'locality' && styles.inputContainerActive,
            error && !selectedLocality && styles.inputContainerError
          ]}>
            <View style={styles.locationIconContainer}>
              <View style={styles.locationPin} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Ej: San Miguel de Tucumán..."
              placeholderTextColor="#9CA3AF"
              value={localityQuery}
              onChangeText={(text) => {
                setLocalityQuery(text);
                if (text.length < 2) {
                  setShowLocalitySuggestions(false);
                }
              }}
              onFocus={() => {
                setCurrentStep('locality');
                if (localitySuggestions.length > 0) {
                  setShowLocalitySuggestions(true);
                }
                onFocus?.();
              }}
              editable={!selectedLocality || currentStep === 'locality'}
            />
            {selectedLocality && (
              <TouchableOpacity onPress={handleEditLocality} style={styles.editButton}>
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>
            )}
            {loading && currentStep === 'locality' && (
              <ActivityIndicator size="small" color="#1142d4" />
            )}
          </View>

          {showLocalitySuggestions && localitySuggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <FlatList
                data={localitySuggestions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => handleSelectLocality(item)}
                  >
                    <View style={styles.suggestionIconContainer}>
                      <View style={styles.suggestionPin} />
                    </View>
                    <View style={styles.suggestionTextContainer}>
                      <Text style={styles.suggestionPrimaryText}>
                        {item.nombre}
                      </Text>
                      <Text style={styles.suggestionSecondaryText}>
                        {item.municipio.nombre}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                style={styles.suggestionsList}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled
              />
            </View>
          )}
        </View>
      )}

      {/* Paso 3: Calle/Barrio con sugerencias */}
      {selectedProvince && selectedLocality && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepLabel}>3. Calle o Barrio</Text>
          <Text style={styles.stepHint}>
            Escribe al menos 3 caracteres para ver sugerencias
          </Text>
          <View style={[
            styles.inputContainer,
            currentStep === 'street' && styles.inputContainerActive
          ]}>
            <View style={styles.locationIconContainer}>
              <View style={styles.locationPin} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Ej: Av. Sarmiento, Barrio Norte..."
              placeholderTextColor="#9CA3AF"
              value={streetQuery}
              onChangeText={handleStreetChange}
              onFocus={() => {
                setCurrentStep('street');
                onFocus?.();
              }}
            />
            {loading && currentStep === 'street' && (
              <ActivityIndicator size="small" color="#1142d4" />
            )}
          </View>

          {showStreetSuggestions && streetSuggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <FlatList
                data={streetSuggestions}
                keyExtractor={(item, index) => `${item.formatted}-${index}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => handleSelectStreet(item)}
                  >
                    <View style={styles.suggestionIconContainer}>
                      <View style={styles.suggestionPin} />
                    </View>
                    <View style={styles.suggestionTextContainer}>
                      <Text style={styles.suggestionPrimaryText}>
                        {item.formatted}
                      </Text>
                      {item.neighbourhood && (
                        <Text style={styles.suggestionSecondaryText}>
                          {item.neighbourhood}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
                style={styles.suggestionsList}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled
              />
            </View>
          )}

          {showStreetSuggestions && streetSuggestions.length === 0 && !loading && streetQuery.length >= 3 && (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>
                No se encontraron sugerencias. Puedes escribir la dirección manualmente.
              </Text>
            </View>
          )}

          {/* Sugerencias rápidas comunes */}
          {!streetQuery && (
            <View style={styles.quickSuggestionsContainer}>
              <Text style={styles.quickSuggestionsLabel}>Sugerencias comunes:</Text>
              <View style={styles.chipRow}>
                {['Centro', 'Barrio Norte', 'Barrio Sur', 'Centro Histórico'].map((suggestion) => (
                  <TouchableOpacity
                    key={suggestion}
                    style={styles.suggestionChip}
                    onPress={() => {
                      setStreetQuery(suggestion);
                      updateFullLocation(suggestion);
                    }}
                  >
                    <Text style={styles.suggestionChipText}>{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      )}

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {/* Resumen de ubicación seleccionada */}
      {selectedProvince && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryLabel}>Ubicación seleccionada:</Text>
          <Text style={styles.summaryText}>
            {streetQuery && `${streetQuery}, `}
            {selectedLocality && `${selectedLocality.nombre}, `}
            {selectedProvince.nombre}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  stepContainer: {
    gap: 8,
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  stepHint: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputContainerActive: {
    borderColor: '#1142d4',
    borderWidth: 2,
  },
  inputContainerError: {
    borderColor: '#EF4444',
  },
  locationIconContainer: {
    width: 24,
    height: 24,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationPin: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderColor: '#9CA3AF',
    borderRadius: 7,
    borderBottomRightRadius: 0,
    transform: [{ rotate: '45deg' }],
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#0D111B',
    paddingVertical: 14,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(17, 66, 212, 0.1)',
    borderRadius: 6,
    marginLeft: 8,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1142d4',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  suggestionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    maxHeight: 200,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  suggestionIconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(17, 66, 212, 0.1)',
    borderRadius: 16,
    marginRight: 12,
  },
  suggestionPin: {
    width: 12,
    height: 12,
    borderWidth: 2,
    borderColor: '#1142d4',
    borderRadius: 6,
    borderBottomRightRadius: 0,
    transform: [{ rotate: '45deg' }],
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionPrimaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0D111B',
    marginBottom: 2,
  },
  suggestionSecondaryText: {
    fontSize: 13,
    color: '#6B7280',
  },
  noResultsContainer: {
    padding: 12,
    backgroundColor: '#FFF9E6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    marginTop: 4,
  },
  noResultsText: {
    fontSize: 13,
    color: '#92400E',
    textAlign: 'center',
  },
  quickSuggestionsContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  quickSuggestionsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
  },
  suggestionChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1142d4',
  },
  summaryContainer: {
    backgroundColor: 'rgba(17, 66, 212, 0.05)',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#1142d4',
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D111B',
  },
});