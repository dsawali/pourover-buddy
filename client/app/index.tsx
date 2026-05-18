import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, radius, typography } from '../constants/theme';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Pourover Buddy</Text>
          <Text style={styles.subtitle}>What would you like to do?</Text>
        </View>

        <View style={styles.cards}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push('/brew')}
            activeOpacity={0.75}
          >
            <Text style={styles.cardEmoji}>☕</Text>
            <Text style={styles.cardTitle}>Brew a cup</Text>
            <Text style={styles.cardDescription}>
              Get a personalised pour-over guide based on your beans and setup.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push('/troubleshoot')}
            activeOpacity={0.75}
          >
            <Text style={styles.cardEmoji}>🔍</Text>
            <Text style={styles.cardTitle}>Troubleshoot my brew</Text>
            <Text style={styles.cardDescription}>
              Diagnose what went wrong and get targeted adjustments for your next cup.
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  header: { marginBottom: spacing.xxl, alignItems: 'center' },
  title: { ...typography.heading, fontSize: 34, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  cards: { gap: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  cardEmoji: { fontSize: 32, marginBottom: spacing.xs },
  cardTitle: { ...typography.subheading },
  cardDescription: { ...typography.body, color: colors.textSecondary },
});
