import React, { useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  Animated
} from 'react-native';

const { width } = Dimensions.get('window');

const OnboardingScreen = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const slides = [
    {
      id: '1',
      title: 'Conectá y ',
      titleHighlight: 'Resolvé',
      description: 'Conectamos a quienes ofrecen changas con expertos listos para resolverlas. Nuestro sistema de valoraciones te asegura confianza total.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDj1e69uclrokgnN6jFrjynNBn0SZwoROFGmVeA1MNqMN7A6xJb39AlWrHvy51_SS3A-s7hZx4SFX2SwNN4y_b05OzdWyF_AI5ZjKHEJKeq5WdJfKIYYIuTr13sSnXGbi0is2uVE92koIe4TRq2UOpvqgiJrhVrrfS3kMHqkbhtoDaXiKERzYtlcjyUFHDiqpWff1PE0Rfb69H9Bm0dH2GFMUY9thbbe4aiaqSwH8eQtWzd5bHJh3vYhXwmfB4nPx-sRq9tQaSMk2o',
      showRating: true
    },
    {
      id: '2',
      title: 'Trabajá cuando ',
      titleHighlight: 'quieras',
      description: 'Elegí tus horarios y el tipo de trabajo que preferís. Vos decidís cuándo y dónde trabajar según tu disponibilidad.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDj1e69uclrokgnN6jFrjynNBn0SZwoROFGmVeA1MNqMN7A6xJb39AlWrHvy51_SS3A-s7hZx4SFX2SwNN4y_b05OzdWyF_AI5ZjKHEJKeq5WdJfKIYYIuTr13sSnXGbi0is2uVE92koIe4TRq2UOpvqgiJrhVrrfS3kMHqkbhtoDaXiKERzYtlcjyUFHDiqpWff1PE0Rfb69H9Bm0dH2GFMUY9thbbe4aiaqSwH8eQtWzd5bHJh3vYhXwmfB4nPx-sRq9tQaSMk2o',
      showRating: false
    },
    {
      id: '3',
      title: 'Pagos ',
      titleHighlight: 'Seguros',
      description: 'Todas las transacciones están protegidas. El pago se libera solo cuando el trabajo está completado y ambas partes están satisfechas.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDj1e69uclrokgnN6jFrjynNBn0SZwoROFGmVeA1MNqMN7A6xJb39AlWrHvy51_SS3A-s7hZx4SFX2SwNN4y_b05OzdWyF_AI5ZjKHEJKeq5WdJfKIYYIuTr13sSnXGbi0is2uVE92koIe4TRq2UOpvqgiJrhVrrfS3kMHqkbhtoDaXiKERzYtlcjyUFHDiqpWff1PE0Rfb69H9Bm0dH2GFMUY9thbbe4aiaqSwH8eQtWzd5bHJh3vYhXwmfB4nPx-sRq9tQaSMk2o',
      showRating: false
    }
  ];

  const handleSkip = () => {
    router.push('/TermsAndPrivacyScreen');
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true
      });
    } else {
      router.push('/TermsAndPrivacyScreen');
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50
  }).current;

  const renderSlide = ({ item }) => (
    <View style={styles.slide}>
      {/* Hero Illustration Section */}
      <View style={styles.illustrationContainer}>
        {/* Decorative Background Blob */}
        <View style={styles.backgroundBlob} />
        
        {/* Image Container */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            resizeMode="contain"
          />
          
          {/* Floating Rating Card */}
          {item.showRating && (
            <View style={styles.ratingCard}>
              <View style={styles.starsContainer}>
                {[...Array(5)].map((_, i) => (
                  <Text key={i} style={styles.star}>★</Text>
                ))}
              </View>
              <Text style={styles.ratingText}>5.0</Text>
            </View>
          )}
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        {/* Headline */}
        <View style={styles.headlineContainer}>
          <Text style={styles.title}>
            {item.title}
            <Text style={styles.titleHighlight}>{item.titleHighlight}</Text>
          </Text>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    </View>
  );

  const renderDot = (index) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width
    ];

    const dotWidth = scrollX.interpolate({
      inputRange,
      outputRange: [8, 32, 8],
      extrapolate: 'clamp'
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.3, 1, 0.3],
      extrapolate: 'clamp'
    });

    return (
      <Animated.View
        key={index}
        style={[
          styles.dot,
          index === currentIndex ? styles.activeDot : styles.inactiveDot,
          { width: dotWidth, opacity }
        ]}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Skip Button */}
      <View style={styles.topBar}>
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={handleSkip}
        >
          <Text style={styles.skipText}>Saltar</Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
      />

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Carousel Indicators */}
        <View style={styles.indicatorsContainer}>
          {slides.map((_, index) => renderDot(index))}
        </View>

        {/* Next Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>
              {currentIndex === slides.length - 1 ? 'Comenzar' : 'Siguiente'}
            </Text>
            <View style={styles.arrowIcon}>
              <View style={styles.arrowLine} />
              <View style={styles.arrowHead} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F8',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
  },
  skipButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4C5F9A',
  },
  slide: {
    width: width,
    flex: 1,
  },
  illustrationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    position: 'relative',
  },
  backgroundBlob: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#E3F2FD',
    opacity: 0.4,
  },
  imageWrapper: {
    width: '100%',
    maxWidth: 380,
    aspectRatio: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  ratingCard: {
    position: 'absolute',
    bottom: -16,
    right: -8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    fontSize: 20,
    color: '#FFC107',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D111B',
  },
  contentSection: {
    backgroundColor: '#F6F6F8',
    paddingTop: 8,
    paddingBottom: 32,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  headlineContainer: {
    paddingHorizontal: 32,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0D111B',
    textAlign: 'center',
    lineHeight: 36,
  },
  titleHighlight: {
    color: '#1142d4',
  },
  descriptionContainer: {
    paddingHorizontal: 32,
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#4C5F9A',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomSection: {
    paddingBottom: 24,
  },
  indicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: '#1142d4',
  },
  inactiveDot: {
    backgroundColor: '#D1D5DB',
  },
  buttonContainer: {
    paddingHorizontal: 24,
  },
  nextButton: {
    backgroundColor: '#1142d4',
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 24,
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
  nextButtonText: {
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

export default OnboardingScreen;