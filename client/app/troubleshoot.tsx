import { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { PickerField } from '../components/PickerField';
import { NumberField } from '../components/NumberField';
import { TextField } from '../components/TextField';
import { useRequest } from '../context/RequestContext';
import { colors, spacing, radius, typography } from '../constants/theme';
import type { TroubleshootRequest, CoffeeProcessing } from '../types';

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

const GRIND_OPTIONS = [
  { label: 'Fine', value: 'fine' },
  { label: 'Medium-fine', value: 'medium-fine' },
  { label: 'Medium', value: 'medium' },
  { label: 'Medium-coarse', value: 'medium-coarse' },
  { label: 'Coarse', value: 'coarse' },
];

const ROAST_OPTIONS = [
  { label: 'Light', value: 'light' },
  { label: 'Medium', value: 'medium' },
  { label: 'Dark', value: 'dark' },
];

export default function TroubleshootScreen() {
  const router = useRouter();
  const { setPending } = useRequest();

  const [brewer, setBrewer] = useState('');
  const [dose, setDose] = useState('');
  const [water, setWater] = useState('');
  const [pours, setPours] = useState('');
  const [grindSize, setGrindSize] = useState('');
  const [temp, setTemp] = useState('');
  const [processing, setProcessing] = useState('');
  const [roastLevel, setRoastLevel] = useState('');
  const [tasteDescription, setTasteDescription] = useState('');
  const [goalDescription, setGoalDescription] = useState('');

  const handleSubmit = () => {
    if (!brewer || !dose || !water || !pours || !grindSize || !temp || !processing || !roastLevel || !tasteDescription || !goalDescription) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }

    const data: TroubleshootRequest = {
      brewer: brewer as TroubleshootRequest['brewer'],
      doseGrams: parseInt(dose, 10),
      waterGrams: parseInt(water, 10),
      numberOfPours: parseInt(pours, 10),
      grindSize,
      waterTempCelsius: parseFloat(temp),
      processing: processing as CoffeeProcessing,
      roastLevel: roastLevel as TroubleshootRequest['roastLevel'],
      tasteDescription,
      goalDescription,
    };

    setPending({ mode: 'troubleshoot', data });
    router.push('/result');
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <PickerField label="Brewer" options={BREWER_OPTIONS} value={brewer} onChange={setBrewer} />
      <NumberField label="Dose (g)" value={dose} onChange={setDose} placeholder="e.g. 15" />
      <NumberField label="Water (g)" value={water} onChange={setWater} placeholder="e.g. 250" />
      <NumberField label="Number of pours" value={pours} onChange={setPours} placeholder="e.g. 3" />
      <PickerField label="Grind size" options={GRIND_OPTIONS} value={grindSize} onChange={setGrindSize} />
      <NumberField label="Water temperature (°C)" value={temp} onChange={setTemp} placeholder="e.g. 93" />
      <PickerField label="Processing" options={PROCESSING_OPTIONS} value={processing} onChange={setProcessing} />
      <PickerField label="Roast level" options={ROAST_OPTIONS} value={roastLevel} onChange={setRoastLevel} />
      <TextField
        label="How did it taste?"
        value={tasteDescription}
        onChange={setTasteDescription}
        placeholder="e.g. Too sour, weak sweetness, grassy finish…"
        numberOfLines={3}
      />
      <TextField
        label="What do you want to fix?"
        value={goalDescription}
        onChange={setGoalDescription}
        placeholder="e.g. I want more sweetness and body…"
        numberOfLines={3}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Diagnose my brew</Text>
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
