import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function Sidebar() {
  const sections = [
    {
      title: 'Home',
      items: [{ name: 'Home', route: '/' }],
    },
    {
      title: 'Follows',
      items: [
        { name: 'Updates', route: '/updates' },
        { name: 'Library', route: '/library' },
        { name: 'MDLists', route: '/mdlists' },
        { name: 'My Groups', route: '/my-groups' },
        { name: 'Reading History', route: '/reading-history' },
      ],
    },
    {
      title: 'Titles',
      items: [
        { name: 'Advanced Search', route: '/advanced-search' },
        { name: 'Recently Added', route: '/recently-added' },
        { name: 'Latest Updates', route: '/latest-updates' },
        { name: 'Random', route: '/random' },
      ],
    },
    {
      title: 'Community',
      items: [
        { name: 'Forums', route: '/forums' },
        { name: 'Groups', route: '/groups' },
        { name: 'Users', route: '/users' },
      ],
    },
    {
      title: 'Inky',
      items: [
        { name: 'Site Rules', route: '/site-rules' },
        { name: 'Announcements', route: '/announcements' },
        { name: 'About Us', route: '/about-us' },
      ],
    },
  ];

  return (
    <ScrollView style={styles.sidebar}>
      {sections.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.items.map((item, idx) => (
            <TouchableOpacity key={idx} style={styles.item} onPress={() => console.log(`Navigate to ${item.route}`)}>
              <Text style={styles.itemText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 200,
    backgroundColor: '#333',
    paddingVertical: 20,
    paddingHorizontal: 15,
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
  item: {
    paddingVertical: 5,
  },
  itemText: {
    color: '#fff',
    fontSize: 14,
  },
});
