import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { FilterOption, SortOption, FILTER_OPTIONS, SORT_OPTIONS } from '../types/gallery';

interface FilterBarProps {
  filter: FilterOption;
  sort: SortOption;
  onFilterChange: (filter: FilterOption) => void;
  onSortChange: (sort: SortOption) => void;
  style?: ViewStyle;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  sort,
  onFilterChange,
  onSortChange,
  style,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: colors.card,
        borderBottomColor: colors.border,
      },
      style,
    ]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {FILTER_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.chip,
              filter === option.value && { backgroundColor: colors.primary },
            ]}
            onPress={() => onFilterChange(option.value)}
          >
            <Text style={[
              styles.chipText,
              { color: colors.text },
              filter === option.value && { color: '#FFFFFF' },
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {SORT_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.chip,
              sort === option.value && { backgroundColor: colors.primary },
            ]}
            onPress={() => onSortChange(option.value)}
          >
            <Text style={[
              styles.chipText,
              { color: colors.text },
              sort === option.value && { color: '#FFFFFF' },
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
});
