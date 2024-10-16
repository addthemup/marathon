import time
from tqdm import tqdm
from django.core.management.base import BaseCommand

# Import the individual management commands
from .import_grace import Command as ImportGraceCommand
from .import_boss import Command as ImportBossCommand
from .import_hemostasis import Command as ImportHemostasisCommand
from .import_kirwan import Command as ImportKirwanCommand

# List of import commands with their respective names
IMPORT_COMMANDS = [
    ("Import Grace", ImportGraceCommand),
    ("Import Boss", ImportBossCommand),
    ("Import Hemostasis", ImportHemostasisCommand),
    ("Import Kirwan", ImportKirwanCommand)
]

class Command(BaseCommand):
    help = "Run all the import commands in sequence with a progress bar"

    def handle(self, *args, **kwargs):
        """Handle the execution of all import commands."""
        self.run_import_commands()

    def run_import_commands(self):
        """Run each import command and update the progress bar."""
        total_commands = len(IMPORT_COMMANDS)
        progress_bar = tqdm(total=total_commands, desc="Overall Progress", unit="step")

        for name, CommandClass in IMPORT_COMMANDS:
            try:
                # Initialize and run the command
                command_instance = CommandClass()
                self.stdout.write(self.style.SUCCESS(f"Running {name} import..."))
                command_instance.handle()

                # Update progress bar after each successful import
                progress_bar.update(1)
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error running {name}: {e}"))
            finally:
                time.sleep(0.5)  # Small delay to visualize progress bar more smoothly

        progress_bar.close()
        self.stdout.write(self.style.SUCCESS("All imports completed successfully."))
