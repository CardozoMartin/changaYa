import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useGeoRef } from './../hooks/useGeoRef';

interface LocationAutocompleteProps {
  value: string;
  onChangeText: (text: string) => void;
  onSelectLocation: (location: string) => void;
  error?: string;
  placeholder?: string;
  onFocus?: () => void;
}

export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value,
  onChangeText,
  onSelectLocation,
  error,
  placeholder = 'Ej: Bella Vista, Tucumán',
  onFocus,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const { loading, searchLocalities } = useGeoRef();

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (value.length >= 2) {
        const results = await searchLocalities(value);
        setSuggestions(results);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [value, searchLocalities]);

  const handleSelectLocation = (locality: any) => {
    const fullLocation = `${locality.nombre}, ${locality.provincia.nombre}`;
    onSelectLocation(fullLocation);
    onChangeText(fullLocation);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <View style={styles.container}>
      <View style={[
        styles.inputContainer,
        error && styles.inputContainerError
      ]}>
        <View style={styles.locationIconContainer}>
          <View style={styles.locationPin} />
        </View>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={(text) => {
            onChangeText(text);
            if (text.length < 2) {
              setShowSuggestions(false);
            }
          }}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
            onFocus?.();
          }}
        />
        {loading && (
          <ActivityIndicator size="small" color="#1142d4" />
        )}
      </View>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSelectLocation(item)}
              >
                <View style={styles.suggestionIconContainer}>
                  <View style={styles.suggestionPin} />
                </View>
                <View style={styles.suggestionTextContainer}>
                  <Text style={styles.suggestionPrimaryText}>
                    {item.nombre}
                  </Text>
                  <Text style={styles.suggestionSecondaryText}>
                    {item.municipio.nombre}, {item.provincia.nombre}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            style={styles.suggestionsList}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}

      {showSuggestions && suggestions.length === 0 && !loading && value.length >= 2 && (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>
            No se encontraron localidades
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
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
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    maxHeight: 240,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    zIndex: 1000,
  },
  suggestionsList: {
    maxHeight: 240,
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
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 4,
  },
  noResultsText: {
    fontSize: 14,
    color: '#6B7280',
  },
});