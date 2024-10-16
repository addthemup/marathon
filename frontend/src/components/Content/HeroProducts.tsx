import { Title, SimpleGrid, Text, Button, ThemeIcon, Grid, rem } from '@mantine/core';
import { IconStethoscope, IconBrain, IconHeartbeat } from '@tabler/icons-react';

import classes from './HeroProducts.module.css';

const features = [
  {
    icon: IconStethoscope,
    title: 'ENT',
    description: 'Cutting-edge technology for Ear, Nose, and Throat surgeries, offering high precision and safety.',
  },
  {
    icon: IconBrain,
    title: 'Neuro/Spine',
    description: 'Innovative solutions for neurological and spinal procedures that enhance surgical outcomes.',
  },
  {
    icon: IconBrain,
    title: 'Plastics & Reconstruction',
    description: 'Advanced tools for reconstructive and plastic surgeries, delivering optimal patient results.',
  },
  {
    icon: IconHeartbeat,
    title: 'Cardiovascular/Orthopedics',
    description: 'State-of-the-art devices for cardiovascular and orthopedic procedures to support critical patient care.',
  },
];

export function HeroProducts() {
  const items = features.map((feature) => (
    <div key={feature.title}>
      <ThemeIcon
        size={44}
        radius="md"
        variant="gradient"
        gradient={{ deg: 133, from: 'red', to: 'darkred' }}
      >
        <feature.icon style={{ width: rem(26), height: rem(26) }} stroke={1.5} />
      </ThemeIcon>
      <Text fz="lg" mt="sm" fw={500}>
        {feature.title}
      </Text>
      <Text c="dimmed" fz="sm">
        {feature.description}
      </Text>
    </div>
  ));

  return (
<div style={{ paddingLeft: '16%', paddingRight: '16%', paddingTop: '50px' }}>
  <Grid gutter={80}>
    <Grid.Col span={{ base: 12, md: 5 }}>
      <Title className={classes.title} order={2}>
        Surgical Devices & Products
      </Title>
      <Text c="dimmed" mt="md">
        The surgical technology source for medical facilities throughout the Carolinas. Marathon Medical is a medical device distributor that is dedicated to supplying hospitals, surgery centers, and physician practices with the tools they need to achieve optimal patient outcomes.
      </Text>
      <Text c="dimmed" mt="md">
        We value surgical excellence and practicality as much as you do.
      </Text>
      <Text c="dimmed" mt="md">
        Click the brand logos to view the products we distribute. Then contact us for a quote.
      </Text>

      <Button
        variant="gradient"
        gradient={{ deg: 133, from: 'red', to: 'darkred' }}
        size="lg"
        radius="md"
        mt="xl"
      >
        Get started
      </Button>
    </Grid.Col>
    <Grid.Col span={{ base: 12, md: 7 }}>
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing={30}>
        {items}
      </SimpleGrid>
    </Grid.Col>
  </Grid>
</div>

  );
}
