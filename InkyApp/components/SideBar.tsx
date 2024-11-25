import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Link, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false); // State to track sidebar visibility
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const sections = [
    {
      title: 'Home',
      items: [{ name: 'Home', route: '/' }],
    },
    {
      title: 'Follows',
      items: [
        { name: 'Updates', route: '/tabs/notification' },
        { name: 'Library', route: '/tabs/library' },
        { name: 'Login', route: '/tabs/login' },
        { name: 'My Groups', route: '/tabs/my-groups' },
        { name: 'Reading History', route: '/tabs/reading-history' },
      ],
    },
    {
      title: 'Titles',
      items: [
        { name: 'Advanced Search', route: '/tabs/search' },
        { name: 'Recently Added', route: '/tabs/recently-added' },
        { name: 'Latest Updates', route: '/tabs/latest-updates' },
        { name: 'Random', route: '/tabs/random' },
      ],
    },
    {
      title: 'Community',
      items: [
        { name: 'Forums', route: '/tabs/forums' },
        { name: 'Groups', route: '/tabs/groups' },
        { name: 'Users', route: '/tabs/users' },
      ],
    },
    {
      title: 'Inky',
      items: [
        { name: 'Site Rules', route: '/tabs/site-rules' },
        { name: 'Announcements', route: '/tabs/announcements' },
        { name: 'About Us', route: '/tabs/about-us' },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      {/* Toggle Button */}
      <TouchableOpacity onPress={toggleSidebar} style={styles.toggleButton}>
        {isOpen ? (
          <Ionicons name="close" size={24} color="#fff" />
        ) : (
          <Ionicons name="menu" size={24} color="#fff" />
        )}
      </TouchableOpacity>

      {/* Sidebar */}
      {isOpen && (
        <ScrollView style={styles.sidebar}>
          {sections.map((section, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.items.map((item, idx) => {
                const isActive = pathname === item.route;
                return (
                  <Link
                    key={idx}
                    href={item.route}
                    style={[
                      styles.itemLink,
                      isActive ? styles.activeItemLink : null,
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.itemText, isActive ? styles.activeItemText : null]}>
                      {item.name}
                    </Text>
                  </Link>
                );
              })}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#121212',
    height: Dimensions.get('window').height, // Ensure container matches full height of the screen
  },
  toggleButton: {
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 5,
    margin: 10,
  },
  sidebar: {
    width: 250,
    backgroundColor: '#333',
    paddingVertical: 20,
    paddingHorizontal: 15,
    height: '100%', // Full height for the sidebar
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemLink: {
    paddingVertical: 5,
  },
  itemText: {
    color: '#fff',
    fontSize: 14,
  },
  activeItemLink: {
    backgroundColor: '#555',
    borderRadius: 4,
  },
  activeItemText: {
    color: '#1E90FF',
    fontWeight: 'bold',
  },
});
