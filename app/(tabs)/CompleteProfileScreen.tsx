import { useCompleteUserProfile } from '@/hooks/useAuth';
import { useAuthSessionStore } from '@/store/authSessionStore';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { LocationCascadeInput } from '../../components/LocationCascadeInput';

const CompleteProfileScreen = () => {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [newSkillText, setNewSkillText] = useState('');
  const [showAddSkillInput, setShowAddSkillInput] = useState(false);
  const { mutate: completeUserProfile, isPending, isError } = useCompleteUserProfile();
  const {user } = useAuthSessionStore();
  console.log('user en complete profile:', user?.id);

  interface CompleteProfileForm {
    description?: string;
    hability: string[];
    photoBuffer?: string | null;
    address?: string;
    phone?: string;
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm<CompleteProfileForm>({
    defaultValues: {
      description: "",
      hability: ['Plomería'],
      photoBuffer: null,
      address: '',
      phone: '',
    }
  });

  const availableSkills = ['Electricidad', 'Limpieza', 'Mudanzas', 'Carpintería', 'Pintura'];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería para subir una foto');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setValue('photoBuffer', result.assets[0].uri as string);
    }
  };

  const toggleSkill = (skill: string, currentSkills: string[]): string[] => {
    if (currentSkills.includes(skill)) {
      return currentSkills.filter((s: string) => s !== skill);
    } else {
      return [...currentSkills, skill];
    }
  };

  const handleAddCustomSkill = (currentSkills: string[]) => {
    const trimmedSkill = newSkillText.trim();
    
    if (trimmedSkill.length === 0) {
      Alert.alert('Error', 'Por favor ingresa el nombre de la habilidad');
      return;
    }

    if (currentSkills.includes(trimmedSkill)) {
      Alert.alert('Error', 'Esta habilidad ya está agregada');
      return;
    }

    if (trimmedSkill.length > 30) {
      Alert.alert('Error', 'El nombre de la habilidad es muy largo (máx. 30 caracteres)');
      return;
    }

    setValue('hability', [...currentSkills, trimmedSkill]);
    setNewSkillText('');
    setShowAddSkillInput(false);
  };

 const onSubmit = (data: any) => {
    console.log('Datos del formulario:', data);

    // Crear FormData
    const formData = new FormData();
    formData.append('description', data.description);

    // Normalizar y anexar phone y location como strings completos
    const phoneStr = (data.phone ?? '').trim();
    const addressStr = (data.address ?? '').trim();
    formData.append('phone', phoneStr);
    formData.append('address', addressStr); // Agregar dirección como string completo
    // Opción 2: Como múltiples campos (si el backend espera array de strings)
     data.hability.forEach((skill: string) => {
       formData.append('hability[]', skill); // Nota el [] al final
     });

    // Agregar foto - FORMATO CORRECTO PARA REACT NATIVE
    if (data.photoBuffer) {
      const uriParts = data.photoBuffer.split('.');
      let fileType = uriParts[uriParts.length - 1] || 'jpg';
      fileType = fileType.split('?')[0].toLowerCase(); // remove query params if any
      if (fileType === 'jpg') fileType = 'jpeg'; // normalize

      formData.append('photoBuffer', {
        uri: data.photoBuffer,
        name: `photo.${fileType}`,
        type: `image/${fileType}`, // image/jpeg, image/png, etc.
      } as any);
    }

    // Llamar a la mutación con el usuario ID (ajusta según tu contexto)
    const userId = user?.id ?? ''; // Obtén esto de tu contexto/store de autenticación

    completeUserProfile(
      { data: formData as any, id: userId },
      {
        onSuccess: (res: any) => {
          console.log('Perfil guardado exitosamente', res);
          // Si el backend devolvió el usuario actualizado, actualizar el store
          const token = useAuthSessionStore.getState().token;
          const currentUser = useAuthSessionStore.getState().user as any;

          const updatedUser = res?.user ?? res?.updatedUser ?? (res?.data?.user ?? null);
          if (updatedUser) {
            useAuthSessionStore.getState().setAuth(token ?? '', updatedUser as any);
          } else if (res?.imageProfile && currentUser) {
            useAuthSessionStore.getState().setAuth(token ?? '', { ...currentUser, imageProfile: res.imageProfile } as any);
          }

          router.push('/HomeScreen');
        },
        onError: (error: any) => {
          console.error('Error al guardar perfil:', error);
          const message = error?.response?.data?.message ?? error?.message ?? 'No se pudo guardar el perfil. Intenta nuevamente.';
          Alert.alert('Error', message);
        }
      }
    );
  };

  const handleSkipLater = () => {
    router.push('/HomeScreen');
  };

  // Watch para obtener valores actuales
  const photoBuffer = watch('photoBuffer');
  const description = watch('description');
  const selectedSkills = watch('hability');
  const location = watch('location');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <View style={styles.backIcon}>
            <View style={styles.backArrow} />
          </View>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Completar Perfil</Text>
        
        <View style={styles.spacer} />
      </View>

      {/* Progress Indicators */}
      <View style={styles.progressContainer}>
        <View style={styles.progressDotInactive} />
        <View style={styles.progressDotInactive} />
        <View style={styles.progressDotActive} />
      </View>

      {/* Scrollable Content with KeyboardAvoidingView */}
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 0}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          nestedScrollEnabled={true}
        >
          {/* Headline */}
          <View style={styles.headlineSection}>
            <Text style={styles.headline}>¡Hola! Cuéntanos sobre ti</Text>
            <Text style={styles.subheadline}>
              Una foto y una breve descripción ayudan a generar confianza en la comunidad.
            </Text>
          </View>

          {/* Profile Picture Upload - Controlado por react-hook-form */}
          <Controller
            control={control}
            name="photoBuffer"
            rules={{
              required: 'La foto de perfil es requerida'
            }}
            render={({ field: { value } }) => (
              <View style={styles.profilePictureSection}>
                <TouchableOpacity 
                  style={styles.avatarContainer}
                  onPress={pickImage}
                  activeOpacity={0.8}
                >
                  <View style={[
                    styles.avatarCircle,
                    errors.photoBuffer && styles.avatarCircleError
                  ]}>
                    {value ? (
                      <Image 
                        source={{ uri: value }}
                        style={styles.avatarImage}
                      />
                    ) : (
                      <View style={styles.personIcon}>
                        <View style={styles.personHead} />
                        <View style={styles.personBody} />
                      </View>
                    )}
                  </View>
                  
                  {/* Camera Badge */}
                  <View style={styles.cameraBadge}>
                    <View style={styles.cameraIcon}>
                      <View style={styles.cameraBody} />
                      <View style={styles.cameraLens} />
                    </View>
                  </View>
                </TouchableOpacity>
                
                <Text style={styles.uploadText}>Subir foto de perfil</Text>
                {errors.photoBuffer && (
                  <Text style={styles.errorText}>{errors.photoBuffer.message}</Text>
                )}
              </View>
            )}
          />

          {/* Form Fields */}
          <View style={styles.formSection}>
            {/* Bio Input - Controlado por react-hook-form */}
            <Controller
              control={control}
              name="description"
              rules={{
                required: 'La biografía es requerida',
                minLength: {
                  value: 10,
                  message: 'La biografía debe tener al menos 10 caracteres'
                },
                maxLength: {
                  value: 150,
                  message: 'La biografía no puede exceder 150 caracteres'
                }
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.fieldContainer}>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>Sobre mí</Text>
                    <Text style={styles.labelHint}>Max 150 caracteres</Text>
                  </View>
                  <TextInput
                    style={[
                      styles.textArea,
                      errors.description && styles.inputError
                    ]}
                    placeholder="Soy responsable y tengo 5 años de experiencia en reparaciones..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={3}
                    maxLength={150}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onFocus={() => {
                      setTimeout(() => {
                        scrollViewRef.current?.scrollTo({ y: 200, animated: true });
                      }, 100);
                    }}
                  />
                  <View style={styles.fieldFooter}>
                    <Text style={styles.charCount}>{(value ?? '').length}/150</Text>
                    {errors.description && (
                      <Text style={styles.errorText}>{errors.description.message}</Text>
                    )}
                  </View>
                </View>
              )}
            />

            {/* Skills Selection - Controlado por react-hook-form */}
            <Controller
              control={control}
              name="hability"
              rules={{
                validate: (value) => 
                  value.length > 0 || 'Selecciona al menos una habilidad'
              }}
              render={({ field: { value, onChange } }) => (
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Habilidades / Especialidades</Text>
                  <View style={styles.skillsContainer}>
                    {/* Habilidades seleccionadas */}
                    {value.map((skill) => (
                      <TouchableOpacity
                        key={skill}
                        style={styles.skillChipActive}
                        onPress={() => onChange(toggleSkill(skill, value))}
                      >
                        <Text style={styles.skillTextActive}>{skill}</Text>
                        <View style={styles.closeIcon}>
                          <View style={styles.closeLine1} />
                          <View style={styles.closeLine2} />
                        </View>
                      </TouchableOpacity>
                    ))}
                    
                    {/* Habilidades disponibles (no seleccionadas) */}
                    {availableSkills
                      .filter(skill => !value.includes(skill))
                      .map((skill) => (
                        <TouchableOpacity
                          key={skill}
                          style={styles.skillChipInactive}
                          onPress={() => onChange(toggleSkill(skill, value))}
                        >
                          <Text style={styles.skillTextInactive}>{skill}</Text>
                        </TouchableOpacity>
                      ))}
                    
                    {/* Botón para agregar habilidad personalizada */}
                    {!showAddSkillInput ? (
                      <TouchableOpacity 
                        style={styles.addSkillButton}
                        onPress={() => setShowAddSkillInput(true)}
                      >
                        <View style={styles.plusIcon}>
                          <View style={styles.plusLine1} />
                          <View style={styles.plusLine2} />
                        </View>
                        <Text style={styles.addSkillText}>Agregar</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.addSkillInputContainer}>
                        <TextInput
                          style={styles.addSkillInput}
                          placeholder="Nueva habilidad..."
                          placeholderTextColor="#9CA3AF"
                          value={newSkillText}
                          onChangeText={setNewSkillText}
                          maxLength={30}
                          autoFocus
                        />
                        <TouchableOpacity 
                          style={styles.addSkillConfirmButton}
                          onPress={() => handleAddCustomSkill(value)}
                        >
                          <Text style={styles.addSkillConfirmText}>✓</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.addSkillCancelButton}
                          onPress={() => {
                            setShowAddSkillInput(false);
                            setNewSkillText('');
                          }}
                        >
                          <Text style={styles.addSkillCancelText}>✕</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                  {errors.hability && (
                    <Text style={styles.errorText}>{errors.hability.message}</Text>
                  )}
                </View>
              )}
            />

            {/* Phone Input - Controlado por react-hook-form */}
            <Controller
              control={control}
              name="phone"
              rules={{
                required: 'El teléfono es requerido',
                minLength: { value: 6, message: 'Número muy corto' },
                maxLength: { value: 25, message: 'Número muy largo' },
                pattern: { value: /^[0-9+()\s-]*$/, message: 'Formato inválido' }
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Teléfono</Text>
                  <View style={[styles.inputContainer, errors.phone && styles.inputError]}>
                    <TextInput
                      style={[styles.input]}
                      placeholder="Ej: +54 9 381 123-4567"
                      placeholderTextColor="#9CA3AF"
                      value={value}
                      onChangeText={(text) => onChange(text)}
                      onBlur={onBlur}
                      keyboardType="phone-pad"
                    />
                  </View>
                  {errors.phone && (
                    <Text style={styles.errorText}>{errors.phone.message}</Text>
                  )}
                </View>
              )}
            />

            {/* Location Input - Controlado por react-hook-form con GeoRef */}
            <Controller
              control={control}
              name="location"
              rules={{
                required: 'La ubicación es requerida',
                minLength: {
                  value: 5,
                  message: 'Por favor selecciona una ubicación válida'
                }
              }}
              render={({ field: { onChange, value } }) => (
                <View 
                  style={styles.fieldContainer}
                  onLayout={(event) => {
                    // Guardar la posición del campo de ubicación
                    event.target.measure((x, y, width, height, pageX, pageY) => {
                      // No es necesario guardar, solo aseguramos que tenga espacio
                    });
                  }}
                >
                  <Text style={styles.label}>Ubicación</Text>
                  <LocationCascadeInput
                    value={value ?? ''}
                    onChangeLocation={onChange}
                    error={errors.location?.message}
                    onFocus={() => {
                      // Un solo scroll suave después de que el teclado esté visible
                      setTimeout(() => {
                        scrollViewRef.current?.scrollToEnd({ animated: true });
                      }, 300);
                    }}
                  />
                </View>
              )}
            />
          </View>

          {/* Bottom Actions - Dentro del ScrollView con espacio extra */}
          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSubmit(onSubmit)}
              activeOpacity={0.8}
              disabled={isPending}
            >
              <Text style={styles.saveButtonText}>
                {isPending ? 'Guardando...' : 'Guardar Perfil'}
              </Text>
              <View style={styles.arrowIcon}>
                <View style={styles.arrowLine} />
                <View style={styles.arrowHead} />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.skipButton}
              onPress={handleSkipLater}
            >
              <Text style={styles.skipButtonText}>Completar más tarde</Text>
            </TouchableOpacity>
          </View>

          {/* Espacio extra al final para asegurar que todo sea visible con el teclado */}
          <View style={{ height: 60 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#F6F6F8',
    zIndex: 10,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    width: 24,
    height: 24,
    position: 'relative',
  },
  backArrow: {
    width: 12,
    height: 12,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#0D111B',
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
    left: 8,
    top: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D111B',
    textAlign: 'center',
    flex: 1,
    marginRight: 48,
  },
  spacer: {
    width: 48,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    backgroundColor: '#F6F6F8',
    zIndex: 10,
  },
  progressDotInactive: {
    width: 32,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CFD5E7',
  },
  progressDotActive: {
    width: 32,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1142d4',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headlineSection: {
    alignItems: 'center',
    paddingTop: 8,
    marginBottom: 24,
  },
  headline: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0D111B',
    textAlign: 'center',
    marginBottom: 12,
  },
  subheadline: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  profilePictureSection: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(17, 66, 212, 0.3)',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarCircleError: {
    borderColor: 'rgba(239, 68, 68, 0.5)',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  personIcon: {
    width: 60,
    height: 60,
    position: 'relative',
    opacity: 0.4,
  },
  personHead: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#1142d4',
    position: 'absolute',
    top: 0,
    left: 18,
  },
  personBody: {
    width: 40,
    height: 30,
    borderWidth: 3,
    borderColor: '#1142d4',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 10,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1142d4',
    borderWidth: 4,
    borderColor: '#F6F6F8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cameraIcon: {
    width: 20,
    height: 20,
    position: 'relative',
  },
  cameraBody: {
    width: 18,
    height: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    position: 'absolute',
    bottom: 0,
    left: 1,
  },
  cameraLens: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    position: 'absolute',
    top: 6,
    left: 6,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1142d4',
  },
  formSection: {
    gap: 24,
  },
  fieldContainer: {
    gap: 8,
    zIndex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D111B',
  },
  labelHint: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#0D111B',
    textAlignVertical: 'top',
    minHeight: 90,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  fieldFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  charCount: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChipActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#1142d4',
    borderWidth: 1,
    borderColor: '#1142d4',
    shadowColor: '#1142d4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  skillTextActive: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  closeIcon: {
    width: 16,
    height: 16,
    position: 'relative',
  },
  closeLine1: {
    width: 12,
    height: 2,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
    top: 7,
    left: 2,
  },
  closeLine2: {
    width: 12,
    height: 2,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '-45deg' }],
    position: 'absolute',
    top: 7,
    left: 2,
  },
  skillChipInactive: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  skillTextInactive: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  addSkillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(17, 66, 212, 0.1)',
  },
  plusIcon: {
    width: 18,
    height: 18,
    position: 'relative',
  },
  plusLine1: {
    width: 12,
    height: 2,
    backgroundColor: '#1142d4',
    position: 'absolute',
    top: 8,
    left: 3,
  },
  plusLine2: {
    width: 2,
    height: 12,
    backgroundColor: '#1142d4',
    position: 'absolute',
    top: 3,
    left: 8,
  },
  addSkillText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1142d4',
  },
  addSkillInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#1142d4',
    borderRadius: 20,
    paddingLeft: 12,
    paddingRight: 4,
    paddingVertical: 4,
    minWidth: 200,
  },
  addSkillInput: {
    flex: 1,
    fontSize: 14,
    color: '#0D111B',
    paddingVertical: 6,
  },
  addSkillConfirmButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSkillConfirmText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  addSkillCancelButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSkillCancelText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  footer: {
    marginTop: 32,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 12,
  },
  saveButton: {
    backgroundColor: '#1142d4',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#1142d4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  arrowIcon: {
    width: 20,
    height: 20,
    position: 'relative',
  },
  arrowLine: {
    width: 12,
    height: 2,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    left: 2,
    top: 9,
  },
  arrowHead: {
    width: 8,
    height: 8,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
    right: 2,
    top: 6,
  },
  skipButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
});

export default CompleteProfileScreen;