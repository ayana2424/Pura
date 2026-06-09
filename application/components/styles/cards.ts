import { StyleSheet } from 'react-native';

export const cards = StyleSheet.create({
  allCard: {
    backgroundColor: "rgba(255, 251, 251, 0.83)",
    borderRadius: 20,
    padding: 20,
    // display: 'flex' ← remove this, it's default
    overflow: "hidden",
  },
  flexColumn: {
    // display: 'flex' ← remove this too
    flexDirection: "column",
  },
  flexRow: {
    // display: 'flex' ← remove this too
    flexDirection: "row",
  },
});