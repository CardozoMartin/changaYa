import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ScrollView,
  Linking
} from 'react-native';
import { useAcceptTermsAndConditions } from '@/hooks/useAuth';
import { useAuthSessionStore } from '@/store/authSessionStore';

const TermsAndPrivacyScreen = () => {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const { user } = useAuthSessionStore();
  console.log('User ID:', user?.id);
  const { mutate: acceptTerms, isPending } = useAcceptTermsAndConditions();

  const terms = [
    {
      id: 1,
      number: '1',
      title: 'Uso de la plataforma',
      description: 'ChangaYa es un intermediario que conecta ofertantes y demandantes de servicios temporales. No somos empleadores directos.',
      bgColor: '#E3F2FD',
      textColor: '#1142d4'
    },
    {
      id: 2,
      number: '2',
      title: 'Sistema de Valoraciones',
      description: 'Mantenemos la calidad mediante un sistema obligatorio de estrellas. Tanto el trabajador como el contratante deben calificarse mutuamente al finalizar.',
      bgColor: '#FEF08A',
      textColor: '#92400E'
    },
    {
      id: 3,
      number: '3',
      title: 'Pagos y Tarifas',
      description: 'Los pagos acordados se liberan una vez que la "Changa" ha sido marcada como completada por ambas partes.',
      bgColor: '#E3F2FD',
      textColor: '#1142d4'
    },
    {
      id: 4,
      number: '4',
      title: 'Privacidad de datos',
      description: 'Tus datos personales son confidenciales. Solo compartimos la información necesaria para coordinar el trabajo una vez confirmada la solicitud.',
      bgColor: '#E3F2FD',
      textColor: '#1142d4'
    },
    {
      id: 5,
      number: '5',
      title: 'Conducta',
      description: 'Tolerancia cero al acoso o discriminación. El incumplimiento resultará en la suspensión inmediata de la cuenta.',
      bgColor: '#E3F2FD',
      textColor: '#1142d4'
    }
  ];

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Error opening link:', err));
  };

  const handleAccept = () => {
    if (!isChecked || !user?.id) {
      return;
    }

    acceptTerms(
      { userId: user.id },
      {
        onSuccess: () => {
          router.push('/CompleteProfileScreen');
        },
        onError: (error) => {
          console.error('Error accepting terms:', error);
          // Aquí podrías mostrar un mensaje de error al usuario
        }
      }
    );
  };

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
        
        <Text style={styles.headerTitle}>Términos y Privacidad</Text>
        
        <View style={styles.spacer} />
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.iconContainer}>
            <View style={styles.gavelIcon}>
              <View style={styles.gavelHandle} />
              <View style={styles.gavelHead} />
            </View>
          </View>
          
          <Text style={styles.heroTitle}>Bienvenido a ChangaYa</Text>
          
          <Text style={styles.heroDescription}>
            Para asegurar una comunidad segura y confiable para todos, por favor revisa nuestras reglas antes de comenzar.
          </Text>
        </View>

        {/* Terms Cards */}
        <View style={styles.termsContainer}>
          {terms.map((term) => (
            <View key={term.id} style={styles.termCard}>
              <View style={styles.termContent}>
                <View style={[styles.numberBadge, { backgroundColor: term.bgColor }]}>
                  <Text style={[styles.numberText, { color: term.textColor }]}>
                    {term.number}
                  </Text>
                </View>
                
                <View style={styles.termTextContainer}>
                  <Text style={styles.termTitle}>{term.title}</Text>
                  <Text style={styles.termDescription}>{term.description}</Text>
                </View>
              </View>
            </View>
          ))}

          {/* Links */}
          <View style={styles.linksContainer}>
            <TouchableOpacity onPress={() => handleOpenLink('https://changaya.com/terminos')}>
              <Text style={styles.linkText}>Leer Términos de Uso completos</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => handleOpenLink('https://changaya.com/privacidad')}>
              <Text style={styles.linkText}>Leer Política de Privacidad completa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Footer with Checkbox and Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.checkboxContainer}
          onPress={() => setIsChecked(!isChecked)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
            {isChecked && (
              <View style={styles.checkmark}>
                <View style={styles.checkmarkLine1} />
                <View style={styles.checkmarkLine2} />
              </View>
            )}
          </View>
          
          <Text style={styles.checkboxLabel}>
            He leído y acepto los{' '}
            <Text style={styles.checkboxLabelBold}>Términos de Uso</Text>
            {' '}y la{' '}
            <Text style={styles.checkboxLabelBold}>Política de Privacidad</Text>
            {' '}de ChangaYa.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.acceptButton,
            (!isChecked || isPending) && styles.acceptButtonDisabled
          ]}
          onPress={handleAccept}
          disabled={!isChecked || isPending}
          activeOpacity={0.8}
        >
          <Text style={styles.acceptButtonText}>
            {isPending ? 'Procesando...' : 'Aceptar y Continuar'}
          </Text>
          {!isPending && (
            <View style={styles.arrowIcon}>
              <View style={styles.arrowLine} />
              <View style={styles.arrowHead} />
            </View>
          )}
        </TouchableOpacity>
      </View>
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
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#F6F6F8',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  },
  spacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(17, 66, 212, 0.1)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  gavelIcon: {
    width: 30,
    height: 30,
    position: 'relative',
  },
  gavelHandle: {
    width: 4,
    height: 18,
    backgroundColor: '#1142d4',
    position: 'absolute',
    bottom: 2,
    left: 6,
    transform: [{ rotate: '-45deg' }],
  },
  gavelHead: {
    width: 16,
    height: 8,
    backgroundColor: '#1142d4',
    borderRadius: 2,
    position: 'absolute',
    top: 4,
    right: 2,
    transform: [{ rotate: '-45deg' }],
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0D111B',
    marginBottom: 12,
    textAlign: 'center',
  },
  heroDescription: {
    fontSize: 16,
    color: '#4C5F9A',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  termsContainer: {
    gap: 16,
  },
  termCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  termContent: {
    flexDirection: 'row',
    gap: 16,
  },
  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  numberText: {
    fontSize: 14,
    fontWeight: '700',
  },
  termTextContainer: {
    flex: 1,
  },
  termTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D111B',
    marginBottom: 4,
  },
  termDescription: {
    fontSize: 14,
    color: '#4C5F9A',
    lineHeight: 20,
  },
  linksContainer: {
    marginTop: 16,
    gap: 8,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1142d4',
    textDecorationLine: 'underline',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#9CA3AF',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: '#1142d4',
    borderColor: '#1142d4',
  },
  checkmark: {
    width: 12,
    height: 12,
    position: 'relative',
  },
  checkmarkLine1: {
    width: 2,
    height: 6,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    bottom: 2,
    left: 2,
    transform: [{ rotate: '-45deg' }],
  },
  checkmarkLine2: {
    width: 2,
    height: 10,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    bottom: 0,
    right: 2,
    transform: [{ rotate: '45deg' }],
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: '#0D111B',
    lineHeight: 20,
  },
  checkboxLabelBold: {
    fontWeight: '700',
    color: '#1142d4',
  },
  acceptButton: {
    backgroundColor: '#1142d4',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#1142d4',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  acceptButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0.1,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
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
});

export default TermsAndPrivacyScreen;