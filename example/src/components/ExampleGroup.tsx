import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

interface ExampleGroupProps {
  style?: StyleProp<ViewStyle>;
  title: string;
  children: React.ReactNode;
}

const ExampleGroup = ({
  style,
  title,
  children,
  ...props
}: ExampleGroupProps) => (
  <View {...props} style={[styles.example, style]}>
    <Text style={styles.title}>{title}</Text>
    <View>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  example: {
    paddingVertical: 10,
  },
  title: {
    fontSize: 20,
    margin: 10,
  },
});

export default ExampleGroup;
