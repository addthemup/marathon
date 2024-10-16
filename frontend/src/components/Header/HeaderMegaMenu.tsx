import {
  HoverCard,
  Group,
  Button,
  UnstyledButton,
  Text,
  SimpleGrid,
  ThemeIcon,
  Anchor,
  Divider,
  Center,
  Box,
  Burger,
  Drawer,
  Collapse,
  ScrollArea,
  rem,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState, useEffect } from 'react';
import {
  IconNotification,
  IconCode,
  IconBook,
  IconChartPie3,
  IconFingerprint,
  IconCoin,
  IconChevronDown,
} from '@tabler/icons-react';
import { logoutUser, getUsername } from '../Api/UsersApi'; // Import API
import classes from './HeaderMegaMenu.module.css';
import LoginModal from './LoginModal'; // Import LoginModal

const mockdata = [
  {
    icon: IconCode,
    title: 'Open source',
    description: 'This Pokémon’s cry is very loud and distracting',
  },
  {
    icon: IconCoin,
    title: 'Free for everyone',
    description: 'The fluid of Smeargle’s tail secretions changes',
  },
  {
    icon: IconBook,
    title: 'Documentation',
    description: 'Yanma is capable of seeing 360 degrees without',
  },
  {
    icon: IconFingerprint,
    title: 'Security',
    description: 'The shell’s rounded shape and the grooves on its.',
  },
  {
    icon: IconChartPie3,
    title: 'Analytics',
    description: 'This Pokémon uses its flying ability to quickly chase',
  },
  {
    icon: IconNotification,
    title: 'Notifications',
    description: 'Combusken battles with the intensely hot flames it spews',
  },
];

interface HeaderMegaMenuProps {
  onViewChange: (view: string) => void; // Function to change the current view
}

export function HeaderMegaMenu({ onViewChange }: HeaderMegaMenuProps) {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const theme = useMantineTheme();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = getUsername();
    if (storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    logoutUser();
    setIsAuthenticated(false);
    setUsername(null);
    localStorage.clear();
    window.location.reload();
  };

  // Function to update the current view and store it in local storage
  const handleViewChange = (view: string) => {
    localStorage.setItem('currentView', view); // Save the current view to local storage
    onViewChange(view); // Call the function passed as a prop to update the current view
  };

  const links = mockdata.map((item) => (
    <UnstyledButton className={classes.subLink} key={item.title}>
      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon style={{ width: rem(22), height: rem(22) }} color={theme.colors.blue[6]} />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
          <Text size="xs" c="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

  return (
    <Box pb={0}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          {/* Navigation Links */}
          <Group h="100%" gap={0} visibleFrom="sm">
            <a
              href="#"
              className={classes.link}
              onClick={() => handleViewChange('Home')} // Home button to set 'Home' as current view
            >
              Home
            </a>
            <a
              href="#"
              className={classes.link}
              onClick={() => handleViewChange('AboutUs')} // About Us button to set 'AboutUs' as current view
            >
              About Us
            </a>
            <HoverCard width={600} position="bottom" radius="md" shadow="md" withinPortal>
              <HoverCard.Target>
                <a href="#" className={classes.link}>
                  <Center inline>
                    <Box component="span" mr={5}>Features</Box>
                    <IconChevronDown
                      style={{ width: rem(16), height: rem(16) }}
                      color={theme.colors.blue[6]}
                    />
                  </Center>
                </a>
              </HoverCard.Target>
              <HoverCard.Dropdown style={{ overflow: 'hidden' }}>
                <Group justify="space-between" px="md">
                  <Text fw={500}>Features</Text>
                  <Anchor href="#" fz="xs">View all</Anchor>
                </Group>
                <Divider my="sm" />
                <SimpleGrid cols={2} spacing={0}>
                  {links}
                </SimpleGrid>
              </HoverCard.Dropdown>
            </HoverCard>
            <a href="#" className={classes.link}>Learn</a>
            <a href="#" className={classes.link}>Academy</a>
          </Group>

          {/* Authentication Buttons */}
          <Group visibleFrom="sm">
            {isAuthenticated ? (
              <>
                <Text>Welcome, {username}</Text>
                <Button variant="light" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <LoginModal setIsAuthenticated={setIsAuthenticated} setUsername={setUsername} />
                <Button>Sign up</Button>
              </>
            )}
          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
        </Group>
      </header>

      {/* Drawer for small screens */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="sm"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />
          <a href="#" className={classes.link} onClick={() => handleViewChange('Home')}>
            Home
          </a>
          <a href="#" className={classes.link} onClick={() => handleViewChange('AboutUs')}>
            About Us
          </a>
          <UnstyledButton className={classes.link} onClick={toggleLinks}>
            <Center inline>
              <Box component="span" mr={5}>Features</Box>
              <IconChevronDown
                style={{ width: rem(16), height: rem(16) }}
                color={theme.colors.blue[6]}
              />
            </Center>
          </UnstyledButton>
          <Collapse in={linksOpened}>{links}</Collapse>
          <a href="#" className={classes.link}>Learn</a>
          <a href="#" className={classes.link}>Academy</a>
          <Divider my="sm" />
          <Group justify="center" grow pb="xl" px="md">
            <LoginModal setIsAuthenticated={setIsAuthenticated} setUsername={setUsername} />
            <Button color="red">Sign up</Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
