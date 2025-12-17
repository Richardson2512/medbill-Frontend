/**
 * Camera Screen (Expo)
 * Document scanning interface with expo-camera and expo-image-picker
 */

import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Camera, CameraType} from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useBillAnalysis} from '../hooks/useBillAnalysis';

type RootStackParamList = {
  Camera: undefined;
  Results: {analysisResult: any};
};

type CameraScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Camera'
>;

export const CameraScreen: React.FC = () => {
  const navigation = useNavigation<CameraScreenNavigationProp>();
  const cameraRef = useRef<Camera>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [cameraType] = useState<CameraType>('back');
  const {analyzing, analyzeBill, result, error} = useBillAnalysis();

  // Check camera permissions
  useEffect(() => {
    const checkPermission = async () => {
      const {status} = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    checkPermission();
  }, []);

  // Navigate to results when analysis completes
  useEffect(() => {
    if (result) {
      navigation.navigate('Results', {analysisResult: result});
    }
  }, [result, navigation]);

  // Show error if analysis fails
  useEffect(() => {
    if (error) {
      Alert.alert('Analysis Error', error, [{text: 'OK'}]);
    }
  }, [error]);

  const handleCapture = async () => {
    try {
      const photo = await cameraRef.current?.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      if (photo?.uri) {
        setCapturedImage(photo.uri);
      }
    } catch (err) {
      console.error('Error capturing photo:', err);
      Alert.alert('Error', 'Failed to capture photo');
    }
  };

  const handleUsePhoto = async () => {
    if (!capturedImage) {
      return;
    }
    await analyzeBill(capturedImage);
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleGallery = async () => {
    const response = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!response.canceled && response.assets?.[0]?.uri) {
      setCapturedImage(response.assets[0].uri);
    }
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Checking camera permissions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>
            Camera permission is required to scan bills
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={async () => {
              const {status} = await Camera.requestCameraPermissionsAsync();
              setHasPermission(status === 'granted');
            }}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Show preview if image is captured
  if (capturedImage && !analyzing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.previewContainer}>
          <Image source={{uri: capturedImage}} style={styles.previewImage} />
          <View style={styles.previewActions}>
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={handleRetake}>
              <Text style={styles.retakeButtonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.usePhotoButton}
              onPress={handleUsePhoto}>
              <Text style={styles.usePhotoButtonText}>Use This Photo</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.previewHint}>
            Make sure all charges are visible
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show processing screen
  if (analyzing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.processingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.processingTitle}>Analyzing Your Bill</Text>
          <Text style={styles.processingText}>
            This usually takes 5-10 seconds...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Camera view
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera
          ref={cameraRef}
          style={styles.camera}
          type={cameraType}
          flashMode={flash === 'on' ? 'torch' : 'off'}
          ratio="16:9"
        />

        {/* Document frame overlay */}
        <View style={styles.overlay}>
          <View style={styles.frame} />
        </View>

        {/* Top controls */}
        <View style={styles.topControls}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.flashButton}
            onPress={() => setFlash(flash === 'off' ? 'on' : 'off')}>
            <Text style={styles.flashButtonText}>
              {flash === 'off' ? '⚡' : '⚡'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom controls */}
        <View style={styles.bottomControls}>
          <TouchableOpacity
            style={styles.galleryButton}
            onPress={handleGallery}>
            <Text style={styles.galleryButtonText}>📷 Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.captureButton}
            onPress={handleCapture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>

          <View style={styles.placeholder} />
        </View>

        {/* Hint text */}
        <View style={styles.hintContainer}>
          <Text style={styles.hintText}>
            Place entire bill in frame and ensure text is readable
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frame: {
    width: '85%',
    height: '60%',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  topControls: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  flashButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashButtonText: {
    fontSize: 24,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  galleryButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  galleryButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  captureButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
  },
  placeholder: {
    width: 80,
  },
  hintContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  hintText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  previewImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
  },
  previewActions: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  retakeButton: {
    backgroundColor: '#666',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  retakeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  usePhotoButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  usePhotoButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  previewHint: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
  },
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  processingTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginTop: 24,
    marginBottom: 8,
  },
  processingText: {
    fontSize: 16,
    color: '#666',
  },
});

