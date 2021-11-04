import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

interface CountDownModalProps {
  visible: boolean;
  onCancel: () => void;
  onTimeout: () => void;
}

const CountDownModal = ({
  visible,
  onCancel,
  onTimeout,
}: CountDownModalProps) => {
  const [adTick, setAdTick] = useState(5);
  const seconds = Math.max(0, adTick);

  useEffect(() => {
    setAdTick(5);
    const interval = setInterval(() => {
      setAdTick((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [visible]);

  useEffect(() => {
    if (adTick === 0) {
      onTimeout();
    }
  }, [adTick, onTimeout]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            Watch this video and earn reward.
          </Text>
          <Text style={styles.modalText}>Ad starts in {seconds} seconds</Text>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={onCancel}
          >
            <Text style={styles.textStyle}>No Thanks</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  modalView: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 5,
    margin: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  button: {
    borderRadius: 20,
    elevation: 2,
    padding: 10,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default CountDownModal;
