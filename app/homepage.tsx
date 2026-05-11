import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { globalStyles } from '../assets/styles/global'; 
export default function Index() {
  return (
    <View>
      {/* Top Homescreen Navigation Bar */}
    <View style={globalStyles.display_flex}>
    <View><Text style={globalStyles.heading3}>Garden Summary</Text>
    <Text style={globalStyles.heading3}>Today's Tasks</Text></View>
    <Text> hihihi</Text>
    </View>

    {/* Main Homescreen Content */}
<View>
  <Text> Zone A - Cherry Tomatoes</Text>
<View style={globalStyles.display_flex}>
  <View>Graph</View>
  <View>
    <View>
      <Text>Last Watered</Text>
      <Text>85%</Text>
    </View>
     <View>
      <Text>Soil Moisture</Text>
      <Text>60%</Text>
    </View>
</View>
</View>

</View>

    </View>
  );
}


