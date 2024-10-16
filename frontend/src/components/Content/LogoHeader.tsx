import { Center, Image } from '@mantine/core';

export function LogoHeader() {
  return (
    <Center style={{ padding: '20px 0', backgroundColor: '#000000' }}> {/* Light background and some padding */}
      <Image
        src="https://i0.wp.com/marathonmedicalinc.com/wp-content/uploads/2022/06/MM_MainLogo_ReverseColor_Med.png?fit=800%2C140&ssl=1"
        alt="Marathon Medical Logo"
        width={800}  // Adjust the width if needed
        height={100}  // Adjust the height if needed
      />
    </Center>
  );
}
