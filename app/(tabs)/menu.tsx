import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BottomTabBarProps {
  activeTab?: 'home' | 'search' | 'create' | 'messages' | 'profile';
  onTabPress?: (tab: 'home' | 'search' | 'create' | 'messages' | 'profile') => void;
}

const BottomTabBar = ({ activeTab = 'profile', onTabPress }: BottomTabBarProps) => {
  return (
    <View style={styles.container}>
      {/* Home Tab */}
      <TouchableOpacity style={styles.tabButton} onPress={() => onTabPress?.('home')}>
        <Ionicons 
          name={activeTab === 'home' ? 'home' : 'home-outline'} 
          size={26} 
          color={activeTab === 'home' ? '#1E3A8A' : '#9CA3AF'} 
        />
        <Text style={[
          styles.tabLabel, 
          activeTab === 'home' && styles.activeTabLabel
        ]}>
          Inicio
        </Text>
      </TouchableOpacity>

      {/* Search Tab */}
      <TouchableOpacity style={styles.tabButton} onPress={() => onTabPress?.('search')}>
        <Ionicons 
          name={activeTab === 'search' ? 'search' : 'search-outline'} 
          size={26} 
          color={activeTab === 'search' ? '#1E3A8A' : '#9CA3AF'} 
        />
        <Text style={[
          styles.tabLabel, 
          activeTab === 'search' && styles.activeTabLabel
        ]}>
          Buscar
        </Text>
      </TouchableOpacity>

      {/* Create Tab (Center Button) */}
      <TouchableOpacity style={styles.createButton} onPress={() => onTabPress?.('create')}>
        <View style={styles.createButtonInner}>
          <Ionicons name="add" size={32} color="#fff" />
        </View>
      </TouchableOpacity>

      {/* Messages Tab */}
      <TouchableOpacity style={styles.tabButton} onPress={() => onTabPress?.('messages')}>
        <Ionicons 
          name={activeTab === 'messages' ? 'chatbubble' : 'chatbubble-outline'} 
          size={26} 
          color={activeTab === 'messages' ? '#1E3A8A' : '#9CA3AF'} 
        />
        <Text style={[
          styles.tabLabel, 
          activeTab === 'messages' && styles.activeTabLabel
        ]}>
          Mensajes
        </Text>
      </TouchableOpacity>

      {/* Profile Tab */}
      <TouchableOpacity style={styles.tabButton} onPress={() => onTabPress?.('profile')}>
        <Ionicons 
          name={activeTab === 'profile' ? 'person' : 'person-outline'} 
          size={26} 
          color={activeTab === 'profile' ? '#1E3A8A' : '#9CA3AF'} 
        />
        <Text style={[
          styles.tabLabel, 
          activeTab === 'profile' && styles.activeTabLabel
        ]}>
          Perfil
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingBottom: 6,
    paddingTop: 4,
    paddingHorizontal: 8,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    fontWeight: '500',
  },
  activeTabLabel: {
    color: '#1E3A8A',
    fontWeight: '600',
  },
  createButton: {
    position: 'relative',
    top: -20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1E3A8A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 6,
    borderColor: '#fff',
  },
});

export default BottomTabBar;