import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
  StatusBar,
  Platform,
} from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Skill {
  id: string;
  label: string;
}

// ─── Floating Label Input ─────────────────────────────────────────────────────
interface FloatingInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  icon?: React.ReactNode;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  value,
  onChangeText,
  keyboardType = 'default',
  icon,
  autoCapitalize = 'sentences',
}) => {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <View style={[styles.inputWrapper, focused && styles.inputWrapperFocused]}>
      <Text style={[styles.floatingLabel, active && styles.floatingLabelActive]}>
        {label}
      </Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          selectionColor="#1a7a8a"
        />
        {icon && <View style={styles.inputIcon}>{icon}</View>}
      </View>
    </View>
  );
};

// ─── Skill Chip ───────────────────────────────────────────────────────────────
interface SkillChipProps {
  label: string;
  onRemove: () => void;
}

const SkillChip: React.FC<SkillChipProps> = ({ label, onRemove }) => (
  <View style={styles.chip}>
    <Text style={styles.chipText}>{label}</Text>
    <TouchableOpacity onPress={onRemove} style={styles.chipClose} hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}>
      <Text style={styles.chipCloseText}>×</Text>
    </TouchableOpacity>
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────────────────
const EditarPerfil: React.FC = () => {
  const params = useLocalSearchParams();
  const [userData, setUserData] = useState<any>(null);
  const isLoadedRef = React.useRef(false);

  // Extraer datos del usuario al montar el componente (UNA SOLA VEZ)
  React.useEffect(() => {
    if (isLoadedRef.current) {
      console.log('⚠️ Ya fue cargado, evitando loop');
      return;
    }

    console.log('Params recibidos en EditarPerfil (raw):', params);

    if (params.user) {
      try {
        const userString = params.user as string;
        
        if (userString === '[object Object]') {
          console.log('⚠️ El usuario llegó como [object Object] - error de serialización en ProfileScreen');
        } else if (typeof userString === 'string') {
          const parsedUser = JSON.parse(userString);
          setUserData(parsedUser);
          isLoadedRef.current = true;
          console.log('✅ Datos del usuario extraídos correctamente');
          console.log('📋 Nombre:', parsedUser?.fullName);
          console.log('📧 Email:', parsedUser?.email);
          console.log('📱 Teléfono:', parsedUser?.phone);
          console.log('🏠 Dirección:', parsedUser?.address);
          console.log('🖼️ Imagen:', parsedUser?.imageProfile);
          console.log('📝 Descripción:', parsedUser?.description);
          console.log('🛠️ Habilidades:', parsedUser?.hability);
        } else {
          setUserData(userString);
          isLoadedRef.current = true;
          console.log('✅ Usuario recibido como objeto');
        }
      } catch (error) {
        console.log('❌ Error al parsear usuario:', error);
      }
    } else {
      console.log('⚠️ No hay datos de usuario en los params');
    }
  }, []); // Dependencia vacía para que se ejecute UNA SOLA VEZ

  // Inicializar estados con datos del usuario
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [skills, setSkills] = useState<Skill[]>([]);

  // Actualizar estados cuando userData cambia (SOLO cuando se carga userData)
  React.useEffect(() => {
    if (userData && isLoadedRef.current) {
      console.log('📝 Llenando formulario con datos del usuario...');
      const nameParts = userData.fullName?.split(' ') || [];
      setNombre(nameParts[0] || '');
      setApellido(nameParts.slice(1).join(' ') || '');
      setTelefono(userData.phone || '');
      setEmail(userData.email || '');
      setDireccion(userData.address || '');
      setDescripcion(userData.description || '');
      setImageUrl(userData.imageProfile || '');
      
      // Cargar habilidades desde el campo 'hability'
      if (Array.isArray(userData.hability) && userData.hability.length > 0) {
        const skillsList = userData.hability.map((skill: string, idx: number) => ({
          id: idx.toString(),
          label: skill,
        }));
        setSkills(skillsList);
      }
    }
  }, [userData]);

  const removeSkill = (id: string) =>
    setSkills(prev => prev.filter(s => s.id !== id));

  const handleAddSkill = () => {
    // Placeholder: would open a modal/picker in a real app
    const newSkill: Skill = {
      id: Date.now().toString(),
      label: 'Nueva Habilidad',
    };
    setSkills(prev => [...prev, newSkill]);
  };

  const handleSave = () => {
    const skillsLabels = skills.map(s => s.label);
    console.log('Guardando:', {
      nombre,
      apellido,
      telefono,
      email,
      direccion,
      descripcion,
      contraseña,
      habilidades: skillsLabels,
      fullName: `${nombre} ${apellido}`.trim(),
      imageProfile: imageUrl,
    });
    // Aquí iría la llamada a la API para actualizar el usuario
  };

  // Location pin SVG-like icon using unicode
  const PinIcon = () => (
    <Text style={styles.pinIcon}>📍</Text>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f4f7f9" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Avatar ── */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatar, { backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ fontSize: 40 }}>👤</Text>
              </View>
            )}
            <TouchableOpacity style={styles.cameraBtn} activeOpacity={0.85}>
              <Text style={styles.cameraIcon}>📷</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Text style={styles.changePhotoText}>Cambiar foto de perfil</Text>
          </TouchableOpacity>
        </View>

        {/* ── Personal Info ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>INFORMACIÓN PERSONAL</Text>

          <View style={styles.row}>
            <View style={styles.halfCol}>
              <FloatingInput
                label="Nombre"
                value={nombre}
                onChangeText={setNombre}
              />
            </View>
            <View style={styles.halfColRight}>
              <FloatingInput
                label="Apellido"
                value={apellido}
                onChangeText={setApellido}
              />
            </View>
          </View>

          <FloatingInput
            label="Teléfono"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
          />

          <FloatingInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <FloatingInput
            label="Dirección"
            value={direccion}
            onChangeText={setDireccion}
            icon={<PinIcon />}
          />

          <FloatingInput
            label="Descripción"
            value={descripcion}
            onChangeText={setDescripcion}
          />

          <FloatingInput
            label="Contraseña"
            value={contraseña}
            onChangeText={setContraseña}
            autoCapitalize="none"
          />
        </View>

        {/* ── Skills ── */}
        <View style={styles.section}>
          <View style={styles.skillsHeader}>
            <Text style={styles.sectionLabel}>MIS HABILIDADES</Text>
            <TouchableOpacity onPress={handleAddSkill} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
              <Text style={styles.addSkillText}>+ AGREGAR</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.chipsContainer}>
            {skills.map(skill => (
              <SkillChip
                key={skill.id}
                label={skill.label}
                onRemove={() => removeSkill(skill.id)}
              />
            ))}
          </View>
        </View>

        {/* Bottom padding so content isn't hidden behind the save button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Save Button (floating at bottom) ── */}
      <View style={styles.saveContainer}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.88}>
          <Text style={styles.saveIcon}>💾</Text>
          <Text style={styles.saveBtnText}>Guardar Cambios</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const TEAL = '#1a7a8a';
const TEAL_DARK = '#155f6d';
const TEAL_LIGHT = '#e8f4f6';
const BORDER = '#d6e4e8';
const TEXT_PRIMARY = '#1a2332';
const TEXT_SECONDARY = '#8fa3ad';
const BG = '#f4f7f9';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: BG,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 32,
    color: TEXT_PRIMARY,
    lineHeight: 36,
    marginTop: -4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    letterSpacing: 0.2,
  },
  headerPlaceholder: {
    width: 36,
  },

  // ── Scroll ──
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  // ── Avatar ──
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#eaf2f5',
    borderRadius: 20,
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#d4c4b0',
    // Shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 2,
    right: -2,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: TEAL,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
      },
      android: { elevation: 4 },
    }),
  },
  cameraIcon: {
    fontSize: 16,
  },
  changePhotoText: {
    color: TEAL,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.1,
  },

  // ── Section ──
  section: {
    marginBottom: 24,
    gap: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: TEXT_SECONDARY,
    letterSpacing: 1.1,
    marginBottom: 4,
  },

  // ── Row layout ──
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfCol: {
    flex: 1,
  },
  halfColRight: {
    flex: 1,
  },

  // ── Floating Input ──
  inputWrapper: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: BORDER,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 10,
    minHeight: 64,
    justifyContent: 'flex-end',
    ...Platform.select({
      ios: {
        shadowColor: '#b0c8d0',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: { elevation: 1 },
    }),
  },
  inputWrapperFocused: {
    borderColor: TEAL,
    ...Platform.select({
      ios: {
        shadowColor: TEAL,
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: { elevation: 3 },
    }),
  },
  floatingLabel: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    marginBottom: 2,
    fontWeight: '400',
  },
  floatingLabelActive: {
    fontSize: 12,
    color: TEAL,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: TEXT_PRIMARY,
    fontWeight: '400',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  inputIcon: {
    marginLeft: 8,
  },
  pinIcon: {
    fontSize: 18,
    opacity: 0.5,
  },

  // ── Skills ──
  skillsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addSkillText: {
    fontSize: 12,
    fontWeight: '700',
    color: TEAL,
    letterSpacing: 0.8,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 50,
    paddingVertical: 8,
    paddingLeft: 16,
    paddingRight: 10,
    gap: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#b0c8d0',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: { elevation: 1 },
    }),
  },
  chipText: {
    fontSize: 14,
    color: TEXT_PRIMARY,
    fontWeight: '400',
  },
  chipClose: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: TEAL_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipCloseText: {
    fontSize: 16,
    color: TEAL,
    lineHeight: 20,
    fontWeight: '600',
    marginTop: -1,
  },

  // ── Save Button ──
  saveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    paddingTop: 12,
    backgroundColor: BG,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  saveBtn: {
    backgroundColor: TEAL_DARK,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: TEAL_DARK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
      },
      android: { elevation: 6 },
    }),
  },
  saveIcon: {
    fontSize: 18,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default EditarPerfil;