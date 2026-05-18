import { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { PickerField } from '../components/PickerField';
import { NumberField } from '../components/NumberField';
import { useRequest } from '../context/RequestContext';
import { colors, spacing, radius, typography } from '../constants/theme';
import type { BrewRequest, CoffeeProcessing, CoffeeVariety } from '../types';

const BREWER_OPTIONS = [
  { label: 'Conical (V60, Origami, Hario Switch)', value: 'conical' },
  { label: 'Flat bottom (Kalita Wave, April, Orea)', value: 'flat_bottom' },
];

const PROCESSING_OPTIONS: { label: string; value: CoffeeProcessing }[] = [
  { label: 'Washed', value: 'washed' },
  { label: 'Natural', value: 'natural' },
  { label: 'Honey', value: 'honey' },
  { label: 'Anaerobic', value: 'anaerobic' },
  { label: 'Anaerobic Washed', value: 'anaerobic_washed' },
  { label: 'Anaerobic Natural', value: 'anaerobic_natural' },
  { label: 'Wet Hulled', value: 'wet_hulled' },
  { label: 'Thermal Shock', value: 'thermal_shock' },
  { label: 'Other', value: 'other' },
  { label: 'Unknown', value: 'unknown' },
];

const VARIETY_OPTIONS: { label: string; value: CoffeeVariety }[] = [
  { label: 'Bourbon', value: 'bourbon' },
  { label: 'Typica', value: 'typica' },
  { label: 'Gesha', value: 'gesha' },
  { label: 'Sidra', value: 'sidra' },
  { label: 'SL28', value: 'sl28' },
  { label: 'SL34', value: 'sl34' },
  { label: 'Catuai', value: 'catuai' },
  { label: 'Caturra', value: 'caturra' },
  { label: 'Pacamara', value: 'pacamara' },
  { label: 'Heirloom', value: 'heirloom' },
  { label: 'Liberica', value: 'liberica' },
  { label: 'Other', value: 'other' },
  { label: 'Unknown', value: 'unknown' },
];

const ROAST_OPTIONS = [
  { label: 'Light', value: 'light' },
  { label: 'Medium', value: 'medium' },
  { label: 'Dark', value: 'dark' },
];

export default function BrewScreen() {
  const router = useRouter();
  const { setPending } = useRequest();

  const [brewer, setBrewer] = useState('');
  const [processing, setProcessing] = useState('');
  const [variety, setVariety] = useState('');
  const [elevation, setElevation] = useState('');
  const [roastLevel, setRoastLevel] = useState('');

  const handleSubmit = () => {
    if (!brewer || !processing || !variety || !roastLevel) {
      Alert.alert('Missing fields', 'Please fill in all required fields.');
      return;
    }

    const data: BrewRequest = {
      brewer: brewer as BrewRequest['brewer'],
      processing: processing as CoffeeProcessing,
      variety: variety as CoffeeVariety,
      roastLevel: roastLevel as BrewRequest['roastLevel'],
      ...(elevation ? { elevationMeters: parseInt(elevation, 10) } : {}),
    };

    setPending({ mode: 'brew', data });
    router.push('/result');
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <PickerField label="Brewer" options={BREWER_OPTIONS} value={brewer} onChange={setBrewer} />
      <PickerField label="Processing" options={PROCESSING_OPTIONS} value={processing} onChange={setProcessing} />
      <PickerField label="Variety" options={VARIETY_OPTIONS} value={variety} onChange={setVariety} />
      <PickerField label="Roast level" options={ROAST_OPTIONS} value={roastLevel} onChange={setRoastLevel} />
      <NumberField
        label="Elevation (MASL)"
        value={elevation}
        onChange={setElevation}
        placeholder="e.g. 1800"
        optional
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Generate brew guide</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  buttonText: { ...typography.subheading, fontWeight: '600', color: '#fff' },
});
