// components/NavBar.tsx

import { usePathname, useRouter } from "expo-router";
import { AddSquare, Home, Note1, Profile2User,Setting2, Tree } from "iconsax-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const tabs = [
  { name: 'home',    icon: Home   },
  { name: 'garden',  icon: Tree    },
  { name: 'info',     icon: Note1 },
  { name: 'community', icon: Profile2User },
  { name: 'profile', icon: Setting2 },
] as const;

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive =
         pathname === '/' ? tab.name === 'home' : pathname.includes(tab.name);
        const Icon = tab.icon;
        const route = tab.name === 'home' ? '/' : `/${tab.name}`;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => router.push(`/${tab.name}` as any)}
          >
            <View style={[styles.iconWrapper, isActive && styles.iconWrapperActive]}>
              <Icon
                size={30}
                color={isActive ? '#6B3E1E' : '#C4A898'}
                variant={isActive ? 'Bold' : 'Bold'}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F5F0E8',
    paddingVertical: 20,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconWrapper: {
    padding: 8,
    borderRadius: 12,
  },
  iconWrapperActive: {
    backgroundColor: '#E8D5C0',
  },
});