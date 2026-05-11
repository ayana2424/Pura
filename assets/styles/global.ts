import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  display_flex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
 background: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#3e3e3e",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 40,
    paddingRight: 40, // Added right padding so text doesn't hit the screen edge!
  },
  heading3: {
    fontSize: 24,
    fontFamily: "NataSans-SemiBold",
    textAlign: "left",
    color: "#ffffff",
  },
});