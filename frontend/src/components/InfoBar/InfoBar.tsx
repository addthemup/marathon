// src/components/InfoBar/InfoBar.tsx
import { Card, Text, Button, Group } from '@mantine/core';
import { useEffect } from 'react';

interface InfoBarProps {
  currentView: string;  // This prop will indicate which view is active
}

export function InfoBar({ currentView }: InfoBarProps) {
  // Log when InfoBar loads and when the view changes
  useEffect(() => {
    console.log(`InfoBar loaded with view: ${currentView}`);
  }, [currentView]);

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{
        maxWidth: '25%',   // Limit the width to 15% of the viewport
        minWidth: '300px', // Ensure a minimum width for small screens
        height: '100%',    // Full height of the parent container
      }}
    >
      <Group position="apart">
        <Text weight={500}>Information</Text>
        <Button size="xs" variant="light">
          Action
        </Button>
      </Group>

      <Text size="sm" style={{ marginTop: 10 }}>
        {/* Display current view info */}
        Current View: {currentView}
      </Text>
    </Card>
  );
}
