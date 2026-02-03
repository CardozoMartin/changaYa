import RegisterForm from "@/components/RegisterForm/RegisterForm";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function RegisterScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('register');
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Header con logo */}
          <View style={styles.header}>
          <View style={styles.iconWrapper}>
          <View style={styles.iconBackground}>
            {/* Icono de apretón de manos */}
            <Ionicons name="hand-left-outline" size={60} color="#FFF" style={styles.handIcon} />
          </View>
          {/* Badge amarillo con rayo */}
          <View style={styles.badge}>
            <Ionicons name="flash" size={16} color="#1E3A5F" />
          </View>
        </View>
          <Text style={styles.logoText}>Chamga<Text style={{color: '#F4C542'}}>Ya</Text></Text>
          <Text style={styles.tagline}>Conectando oportunidades</Text>
        </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'login' && styles.activeTab]}
              onPress={() => router.push('/auth/LoginScreen')}
            >
              <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>
                Iniciar Sesión
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tab, activeTab === 'register' && styles.activeTab]}
              onPress={() => setActiveTab('register')}
            >
              <Text style={[styles.tabText, activeTab === 'register' && styles.activeTabText]}>
                Registrarse
              </Text>
            </TouchableOpacity>
          </View>

          {/* Formulario */}
          <RegisterForm />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  logoBadge: {
    width: 56,
    height: 56,
    backgroundColor: "#F4C542",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  briefcaseIcon: {
    width: 28,
    height: 28,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  logoText: {
    fontSize: 36,
    fontWeight: "700",
    color: "#1E3A5F",
  },
  tagline: {
    fontSize: 16,
    color: "#5A6C7D",
    fontWeight: "500",
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 30,
    backgroundColor: "#E8E8E8",
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#8A8A8A",
  },
  activeTabText: {
    color: "#1E3A5F",
    fontWeight: "600",
  },
  titleContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E3A5F",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#5A6C7D",
    fontWeight: "400",
  },
  formContainer: {
    flex: 1,
    paddingBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    color: "#2D3748",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 15,
    color: "#2D3748",
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 15,
    color: "#2D3748",
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  eyeIcon: {
    width: 24,
    height: 24,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  eyeOuter: {
    width: 22,
    height: 14,
    borderWidth: 2,
    borderColor: "#8A8A8A",
    borderRadius: 11,
    position: "absolute",
  },
  eyeSlash: {
    width: 26,
    height: 2,
    backgroundColor: "#8A8A8A",
    transform: [{ rotate: "45deg" }],
    position: "absolute",
  },
  registerButton: {
    backgroundColor: "#1E3A5F",
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  termsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  termsText: {
    fontSize: 13,
    color: "#8A8A8A",
  },
  termsLink: {
    fontSize: 13,
    color: "#3B82C8",
    fontWeight: "500",
  },
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  loginLinkText: {
    fontSize: 15,
    color: "#5A6C7D",
  },
  loginLink: {
    fontSize: 15,
    color: "#3B82C8",
    fontWeight: "600",
  },
   iconWrapper: {
    position: 'relative',
    marginBottom: 0,
  },
  iconBackground: {
    width: 100,
    height: 90,
    backgroundColor: '#1E4D8B',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    transform: [{ rotate: '-5deg' }],
  },
  handIcon: {
    transform: [{ rotate: '-45deg' }, { scaleX: -1 }],
    marginLeft: -15,
    marginTop: -10,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 38,
    height: 38,
    backgroundColor: '#F4C430',
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  }
});
