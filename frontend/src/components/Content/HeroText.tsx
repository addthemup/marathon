import { Title, Text, Button, Container } from '@mantine/core';
import { Dots } from './Dots';
import classes from './HeroText.module.css';

export function HeroText() {
  return (
    <Container className={classes.wrapper} size={1400}>
      <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
      <Dots className={classes.dots} style={{ right: 0, top: 60 }} />

      <div className={classes.inner}>
        <Title className={classes.title}>
          Why <Text component="span" className={classes.highlight}>Carolina Hospitals, Surgery Centers, and Clinics</Text> Choose Us
        </Title>

        <Container p={0} size={600}>
          <Text size="lg" c="dimmed" className={classes.description}>
            Since 2005, Marathon Medical has been the premier medical device distributor for surgical facilities of all types across North Carolina and South Carolina. Marathon offers surgical technology for ENT, plastics, neurosurgery, spine, ophthalmic, cardiovascular, and orthopedic procedures.
          </Text>
        </Container>

        <div className={classes.controls}>
          <div>
            <Button className={classes.control} size="lg" variant="default" color="gray">
              Request a Quote
            </Button>
            <Button className={classes.control} size="lg" variant="default" color="gray">
              Request Service/Repair
            </Button>
          </div>

        </div>
      </div>
    </Container>
  );
}
