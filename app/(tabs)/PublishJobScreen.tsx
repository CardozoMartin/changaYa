import { useCreateWork } from '@/hooks/useWork';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { IWorkData } from '../types/IWorkData.types';


const PublishJobScreen = () => {
  const router = useRouter();
  //React hook form
  const { control, handleSubmit: onSubmitRHF, formState: { errors }, reset, setValue, watch } = useForm<IWorkData>({
    defaultValues: {
      title: '',
      description: '',
      location: '',
      salary: 0,
      requirements: [],
      imageWork: []
    },
    mode: 'onChange'
  });

  //Hook para crear el trabajo
  const { mutate: createWork, isPending: isCreatingWork } = useCreateWork();

  const requirements = watch('requirements') ?? [];
  const imageWork = watch('imageWork') ?? [];

  //Función para seleccionar imágenes
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos permiso para acceder a tus fotos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImages = result.assets.map(asset => asset.uri);
      setValue('imageWork', [...imageWork, ...newImages]);
    }
  };

  //Handler para enviar el formulario
const handleSubmit = onSubmitRHF(async (data: IWorkData) => {
  const formData = new FormData();
  
  // Datos del formulario
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('location', data.location);
  formData.append('salary', String(data.salary));
  data.requirements.forEach((requirement: string, index: number) => {
    formData.append(`requirements[${index}]`, requirement);
  });
  if (Array.isArray(data.imageWork) && data.imageWork.length > 0) {
    for (const [index, imageUri] of data.imageWork.entries()) {
      try {
        formData.append('imageWork', {
          uri: imageUri,
          type: 'image/jpeg',
          name: `work-${Date.now()}-${index}.jpg`
        } as any);
      } catch (error) {
      }
    }
  }
//Aqui enviamos los datos al back end
  createWork(formData, {
    onSuccess: (response) => {
      Alert.alert('Éxito', 'Chamba publicada con éxito');
      reset();
      router.back();
    },
    onError: (error: any) => {
      Alert.alert(
        'Error', 
        error.response?.data?.error || error.message || 'Error al publicar'
      );
    }
  });
});

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A5F" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <View style={styles.backArrow}>
            <View style={styles.arrowLine} />
            <View style={styles.arrowTop} />
            <View style={styles.arrowBottom} />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Publicar nueva Chamba</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Detalles de la Chamba */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalles de la Chamba</Text>

          {/* Título del trabajo */}
          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <View style={styles.iconBrush}>
                <View style={styles.brushHandle} />
                <View style={styles.brushHead} />
              </View>
              <Text style={styles.label}>Título del trabajo</Text>
            </View>
            <Controller
              control={control}
              name="title"
              rules={{
                required: 'El titulo es requerido',
                pattern: { value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]+$/i, message: 'Solo se permiten letras y números' },
                minLength: { value: 3, message: 'El titulo debe tener mas de 3 caracteres' },
                maxLength: { value: 100, message: 'El titulo no puede tener mas de 100 caracteres' }
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Ej. Diseñador gráfico para redes sociales"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.title && <Text style={{ color: 'red', marginTop: 4 }}>{errors.title.message}</Text>}
          </View>

          {/* Descripción detallada */}
          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <View style={styles.iconDocument}>
                <View style={styles.documentSheet} />
                <View style={styles.documentLine1} />
                <View style={styles.documentLine2} />
              </View>
              <Text style={styles.label}>Descripción detallada</Text>
            </View>
            <Controller
              control={control}
              name="description"
              rules={{
                required: 'La descripción es requerida',
                minLength: { value: 10, message: 'La descripción debe tener al menos 10 caracteres' }
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe las tareas a realizar, los requisitos y cualquier otro detalle importante."
                  placeholderTextColor="#8A8A8A"
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.description && <Text style={{ color: 'red', marginTop: 4 }}>{errors.description.message}</Text>}
          </View>

          {/* Requisitos */}
          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <View style={styles.iconDocument}>
                <View style={styles.documentSheet} />
                <View style={styles.documentLine1} />
                <View style={styles.documentLine2} />
              </View>
              <Text style={styles.label}>Requisitos</Text>
            </View>
            <View style={styles.requirementInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Ej: Experiencia mínima 2 años"
                placeholderTextColor="#8A8A8A"
                onSubmitEditing={(e) => {
                  const text = e.nativeEvent.text.trim();
                  if (text) {
                    setValue('requirements', [...requirements, text]);
                  }
                }}
              />
            </View>
            {requirements.length > 0 && (
              <View style={styles.chipContainer}>
                {requirements.map((req, index) => (
                  <View key={index} style={styles.chip}>
                    <Text style={styles.chipText}>{req}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setValue('requirements', requirements.filter((_, i) => i !== index));
                      }}
                    >
                      <Text style={styles.chipRemove}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Imágenes */}
          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <View style={styles.iconDocument}>
                <View style={styles.documentSheet} />
                <View style={styles.documentLine1} />
                <View style={styles.documentLine2} />
              </View>
              <Text style={styles.label}>Imágenes (opcional)</Text>
            </View>
            <TouchableOpacity
              style={styles.imageButton}
              onPress={pickImage}
            >
              <Text style={styles.imageButtonText}>+ Agregar imagen</Text>
            </TouchableOpacity>
            {imageWork.length > 0 && (
              <View style={styles.imagePreviewContainer}>
                {imageWork.map((img, index) => (
                  <View key={index} style={styles.imagePreview}>
                    <Image source={{ uri: img }} style={styles.imagePreviewImg} />
                    <View style={styles.imagePreviewInfo}>
                      <Text style={styles.imagePreviewText}>Imagen {index + 1}</Text>
                      <TouchableOpacity
                        onPress={() => {
                          setValue('imageWork', imageWork.filter((_, i) => i !== index));
                        }}
                        style={styles.removeImageButton}
                      >
                        <Text style={styles.removeImageText}>×</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Logística */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Logística</Text>

          {/* Ubicación */}
          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <View style={styles.iconLocation}>
                <View style={styles.locationPin} />
                <View style={styles.locationDot} />
              </View>
              <Text style={styles.label}>Ubicación</Text>
            </View>
            <Controller
              control={control}
              name="location"
              rules={{
                required: 'La ubicación es requerida'
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputWithIcon}>
                  <View style={styles.searchIconSmall}>
                    <View style={styles.searchCircleSmall} />
                    <View style={styles.searchHandleSmall} />
                  </View>
                  <TextInput
                    style={styles.inputWithIconText}
                    placeholder="Ej: Av. Siempreviva 742"
                    placeholderTextColor="#8A8A8A"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
            />
            {errors.location && <Text style={{ color: 'red', marginTop: 4 }}>{errors.location.message}</Text>}
          </View>

          {/* Presupuesto */}
          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <View style={styles.iconMoney}>
                <View style={styles.moneyBag} />
                <Text style={styles.moneySymbol}>$</Text>
              </View>
              <Text style={styles.label}>Presupuesto</Text>
            </View>
            <Controller
              control={control}
              name="salary"
              rules={{
                required: 'El presupuesto es requerido'
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputWithIcon}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                      style={styles.inputWithIconText}
                      placeholder="0.00"
                      placeholderTextColor="#8A8A8A"
                      keyboardType="decimal-pad"
                      onBlur={onBlur}
                      onChangeText={(text) => onChange(parseFloat(text) || 0)}
                      value={value !== undefined && value !== null ? String(value) : ''}
                    />
                </View>
              )}
            />
            {errors.salary?.message && <Text style={{ color: 'red', marginTop: 4 }}>{errors.salary.message}</Text>}
          </View>
        </View>

        {/* Botón Publicar */}
        <TouchableOpacity
          onPress={handleSubmit}
          style={styles.publishButton}
          activeOpacity={0.8}
        >
          <Text style={styles.publishButtonText}>{isCreatingWork ? 'Publicando Chamba...' : 'Publicar Chamba'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#1E3A5F',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  backArrow: {
    width: 24,
    height: 24,
    position: 'relative',
    justifyContent: 'center',
  },
  arrowLine: {
    width: 18,
    height: 2,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    left: 3,
  },
  arrowTop: {
    width: 10,
    height: 2,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    left: 0,
    top: 8,
    transform: [{ rotate: '45deg' }],
  },
  arrowBottom: {
    width: 10,
    height: 2,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    left: 0,
    bottom: 8,
    transform: [{ rotate: '-45deg' }],
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  section: {
    marginTop: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5A6C7D',
    marginLeft: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#2D3748',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  textArea: {
    minHeight: 120,
    paddingTop: 14,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  inputWithIconText: {
    flex: 1,
    fontSize: 15,
    color: '#2D3748',
    marginLeft: 8,
  },
  currencySymbol: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5A6C7D',
    marginRight: 4,
  },
  iconBrush: {
    width: 18,
    height: 18,
    position: 'relative',
  },
  brushHandle: {
    width: 2,
    height: 10,
    backgroundColor: '#5A6C7D',
    position: 'absolute',
    left: 8,
    top: 0,
  },
  brushHead: {
    width: 12,
    height: 8,
    backgroundColor: '#5A6C7D',
    borderRadius: 2,
    position: 'absolute',
    left: 3,
    bottom: 0,
  },
  iconDocument: {
    width: 16,
    height: 18,
    position: 'relative',
  },
  documentSheet: {
    width: 16,
    height: 18,
    borderWidth: 2,
    borderColor: '#5A6C7D',
    borderRadius: 2,
  },
  documentLine1: {
    width: 8,
    height: 1,
    backgroundColor: '#5A6C7D',
    position: 'absolute',
    left: 4,
    top: 6,
  },
  documentLine2: {
    width: 8,
    height: 1,
    backgroundColor: '#5A6C7D',
    position: 'absolute',
    left: 4,
    top: 10,
  },
  iconLocation: {
    width: 16,
    height: 18,
    position: 'relative',
  },
  locationPin: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderColor: '#5A6C7D',
    borderRadius: 7,
    borderBottomRightRadius: 0,
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
    left: 1,
    top: 0,
  },
  locationDot: {
    width: 4,
    height: 4,
    backgroundColor: '#5A6C7D',
    borderRadius: 2,
    position: 'absolute',
    left: 6,
    top: 4,
  },
  searchIconSmall: {
    width: 18,
    height: 18,
    position: 'relative',
  },
  searchCircleSmall: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#8A8A8A',
    position: 'absolute',
    top: 1,
    left: 1,
  },
  searchHandleSmall: {
    width: 6,
    height: 2,
    backgroundColor: '#8A8A8A',
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
    bottom: 1,
    right: 1,
  },
  iconMoney: {
    width: 18,
    height: 18,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moneyBag: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderColor: '#5A6C7D',
    borderRadius: 7,
    position: 'absolute',
  },
  moneySymbol: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#5A6C7D',
  },
  publishButton: {
    backgroundColor: '#1E3A5F',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  publishButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  requirementInputContainer: {
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E3A5F',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginRight: 6,
  },
  chipRemove: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  imageButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#1E3A5F',
    paddingVertical: 16,
    alignItems: 'center',
  },
  imageButtonText: {
    color: '#1E3A5F',
    fontSize: 15,
    fontWeight: '600',
  },
  imagePreviewContainer: {
    marginTop: 12,
    gap: 8,
  },
  imagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  imagePreviewImg: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 12,
  },
  imagePreviewInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imagePreviewText: {
    color: '#2D3748',
    fontSize: 14,
  },
  removeImageButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default PublishJobScreen;