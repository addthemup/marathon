import { Container, Title, Text, Button } from '@mantine/core';
import classes from './HeroHeader.module.css';

export function HeroHeader() {
  return (
    <div className={classes.root}>
      <Container size="xl">
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
              Surgical technology that helps you{' '}
              <Text
                component="span"
                inherit
                variant="gradient"
                gradient={{ from: 'white', to: 'red' }}
              >
                ace patient outcomes
              </Text>
              .
            </Title>

            <Text className={classes.description} mt={30}>
              The work you do makes lives better. Our focus is to make your work a little easier. We bring you hassle-free customer service, solution-based thinking, and information about new developments and best practices in the medical device industry.
            </Text>

            <Text className={classes.description} mt={30}>
              The surgery centers we serve perform procedures such as:
            </Text>

            <Button
              variant="gradient"
              gradient={{ from: 'red', to: 'darkred' }}
              size="xl"
              className={classes.control}
              mt={40}
              component="a"
              href="https://marathonmedicalinc.com/products/"
            >
              Browse Surgical Products
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
