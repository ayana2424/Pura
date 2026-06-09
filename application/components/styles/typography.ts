import { StyleSheet } from 'react-native'; // ← add this import

export const typography = StyleSheet.create({
  heading1: {
    fontSize: 48,
    fontFamily: "NataSans-SemiBold",
    textAlign: "left",
    color: "#ffffff",
  },
  heading2: {
    fontSize: 32,
    fontFamily: "NataSans-SemiBold",
    textAlign: "left",
    color: "#ffffff",
  },
  heading3: {
    fontSize: 28,
    fontFamily: "NataSans-SemiBold",
    textAlign: "left",
    color: "#ffffff",
  },
  heading4: {
    fontSize: 24,
    fontFamily: "NataSans-SemiBold",
    textAlign: "left",
    color: "#ffffff",
  },
  heading5: {
    fontSize: 20,
    fontFamily: "NataSans-SemiBold",
    textAlign: "left",
    color: "#ffffff",
  },
  body: {
    fontSize: 16,
    fontFamily: "NataSans-Regular",
    textAlign: "left",
    color: "#ffffff",
  },
  subhead: {
    fontSize: 14,
    fontFamily: "NataSans-Regular",
    textAlign: "left",
    color: "#ffffff",
  },
  caption: {
    fontSize: 12,
    fontFamily: "NataSans-Regular",
    textAlign: "left",
    color: "#ffffff",
  },
}); // ← close StyleSheet.create